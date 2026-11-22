"""Offline integrity checks for the published static site. Run: python scripts/verify_site.py."""
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
import json
import re
import xml.etree.ElementTree as ET

DOCS = Path(__file__).resolve().parents[1] / 'docs'
BASE = 'https://osteopathe-urgence-59-62.fr/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.ids = []
        self.text = []
        self.anchors = []
        self.anchor = None
        self.hidden = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        assert len(attributes) == len(attrs), ('duplicate HTML attributes', tag, attrs)
        self.tags.append((tag, attributes))
        if tag in ('script', 'style', 'svg'):
            self.hidden += 1
        if tag == 'a':
            self.anchor = (attributes, [])
        if 'id' in attributes:
            self.ids.append(attributes['id'])

    def handle_data(self, text):
        if not self.hidden:
            self.text.append(text)
            if self.anchor:
                self.anchor[1].append(text)

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg'):
            self.hidden -= 1
        if tag == 'a' and self.anchor:
            self.anchors.append((self.anchor[0], ' '.join(self.anchor[1])))
            self.anchor = None


pages = {p.name: (p.read_text(encoding='utf-8'), Page(p.read_text(encoding='utf-8'))) for p in DOCS.glob('*.html')}
indexable, descriptions, redirects = set(), set(), set()
links = schemas = images = 0
booking_links = 0
expected_hours = {
    ('Monday', '00:00', '00:00'), ('Tuesday', '00:00', '00:00'),
    ('Wednesday', '10:00', '12:00'), ('Thursday', '10:00', '12:00'),
    ('Friday', '00:00', '00:00'),
    ('Saturday', '10:00', '12:00'), ('Saturday', '16:00', '18:00'),
    ('Sunday', '10:00', '12:00'), ('Sunday', '16:00', '18:00'),
}
expected_addresses = {
    'Hénin-Beaumont': ('288 rue Léon Pruvot', '62110'),
    'Dourges': ('44 chemin du Puits', '62119'),
}
for filename, (text, page) in pages.items():
    if filename.startswith('google'):
        continue
    assert len(page.ids) == len(set(page.ids)), (filename, 'duplicate IDs')
    metas = {a.get('name', a.get('property', a.get('http-equiv'))): a.get('content') for t, a in page.tags if t == 'meta'}
    canonical = [a['href'] for t, a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert len(canonical) == 1, filename
    assert len([1 for t, a in page.tags if t == 'h1']) == 1, filename
    visible = ' '.join(' '.join(page.text).split())
    assert not re.search(r'\b9\s*h\s*(?:à|–|-)\s*19\s*h|7\s*j\s*/\s*7|7 jours sur 7', visible, re.I), (filename, 'obsolete visible opening claim')
    assert not re.search(r'09:00|19:00', text), (filename, 'obsolete structured opening hours')
    assert 'horaires d’ostéopathie à confirmer' in visible.lower(), (filename, 'unconfirmed Hénin hours missing')
    assert 'jours fériés selon disponibilités' in visible.lower(), (filename, 'holiday exception missing')
    if 'refresh' in metas:
        redirects.add(filename)
        assert metas['refresh'].startswith('0; url='), filename
        target = metas['refresh'].split('url=', 1)[1]
        assert target.split('#')[0] == canonical[0], filename
        assert canonical[0] == BASE + 'acces-cabinets.html', filename
        assert 'application/ld+json' not in text, filename
    else:
        indexable.add(canonical[0])
        assert canonical[0] == BASE + ('' if filename == 'index.html' else filename), filename
        assert metas.get('robots') == 'index, follow', filename
        desc = metas.get('description')
        assert desc and desc not in descriptions, (filename, 'missing/duplicate description')
        descriptions.add(desc)
        assert desc == metas['og:description'] == metas['twitter:description'], filename
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)
        assert blocks, filename
        for block in blocks:
            graph = json.loads(block)['@graph']
            schemas += 1
            businesses = [entity for entity in graph if entity['@type'] == 'MedicalBusiness']
            assert businesses, filename
            expected_places = {'Dourges'} if filename == 'osteopathe-urgence-week-end-jours-feries.html' else set(expected_addresses)
            assert {b['address']['addressLocality'] for b in businesses} == expected_places, (filename, 'wrong real offices')
            for business in businesses:
                city = business['address']['addressLocality']
                assert city in expected_addresses, filename
                assert (business['address']['streetAddress'], business['address']['postalCode']) == expected_addresses[city], filename
                assert business['telephone'] == '+33769565271', filename
                if city == 'Hénin-Beaumont':
                    assert business['priceRange'] == '60 €', filename
                    assert not business.get('openingHoursSpecification') and not business.get('openingHours'), (filename, 'unconfirmed Hénin hours must not be invented')
                else:
                    assert business['priceRange'] == '60–80 €', filename
                    actual = []
                    for spec in business['openingHoursSpecification']:
                        days = spec['dayOfWeek']
                        for day in days if isinstance(days, list) else [days]:
                            actual.append((day.rsplit('/', 1)[-1], spec['opens'], spec['closes']))
                    assert set(actual) == expected_hours and len(actual) == len(expected_hours), (filename, actual)
                    # Public holidays have no confirmed fixed times, including when
                    # they fall on a normally closed day. Keep them in prose only.
                    assert 'PublicHolidays' not in json.dumps(business), filename
                    assert 'Jours fériés : selon disponibilités' in business['description'], filename
            web_pages = [entity for entity in graph if entity['@type'] == 'WebPage']
            title = unescape(re.search(r'<title>(.*?)</title>', text, re.S).group(1))
            assert len(web_pages) == 1 and web_pages[0]['name'] == title, filename
            assert web_pages[0]['description'] == desc, (filename, 'WebPage description differs')
            assert title == metas['og:title'] == metas['twitter:title'], (filename, 'inconsistent share titles')
        assert '08:00' not in text and '20:00' not in text, filename

    for attrs, label in page.anchors:
        url = urlsplit(attrs.get('href', ''))
        if url.hostname != 'www.doctolib.fr':
            continue
        booking_links += 1
        query = parse_qs(url.query)
        place = query.get('placeId', [None])[0]
        assert place in (None, 'practice-732649', 'practice-733086'), (filename, 'unknown booking ID', place)
        assert place or url.path.endswith('/booking/places'), (filename, 'booking must select a known practice or offer the place selector')
        context = label + ' ' + attrs.get('aria-label', '')
        if 'Hénin-Beaumont' in context:
            assert place == 'practice-732649', (filename, 'Hénin button selects another place')
        if 'Dourges' in context:
            assert place == 'practice-733086', (filename, 'Dourges button selects another place')

    assert len([1 for t, a in page.tags if t == 'script' and a.get('src') == 'statistiques.js' and 'defer' in a]) == 1, filename
    assert len([1 for t, a in page.tags if t == 'link' and a.get('href') == 'statistiques.css']) == 1, filename
    assert len([1 for t, a in page.tags if t == 'button' and 'data-privacy-settings' in a]) == 1, filename

    for tag, attrs in page.tags:
        references = []
        if 'href' in attrs:
            references.append(attrs['href'])
        if 'src' in attrs:
            references.append(attrs['src'])
        if 'srcset' in attrs:
            references.extend(candidate.strip().split()[0] for candidate in attrs['srcset'].split(','))
        if tag == 'img':
            images += 1
            assert all(k in attrs for k in ('alt', 'width', 'height')), (filename, attrs)
        if tag == 'a' and attrs.get('href', '').startswith(('tel:', 'sms:')):
            assert attrs['href'].split(':', 1)[1] == '+33769565271', filename
        for ref in references:
            parsed = urlsplit(ref)
            if parsed.scheme and not ref.startswith(BASE):
                continue
            target = unquote(parsed.path).lstrip('/') or ('index.html' if parsed.scheme else filename)
            links += 1
            assert (DOCS / target).exists(), (filename, 'missing file', ref)
            if parsed.fragment and target in pages:
                assert unquote(parsed.fragment) in pages[target][1].ids, (filename, 'missing anchor', ref)
            if filename not in redirects and tag == 'a':
                assert target not in redirects, (filename, 'internal link to retired page', ref)

sitemap = ET.parse(DOCS / 'sitemap.xml')
listed = {loc.text for loc in sitemap.findall('.//{*}loc')}
assert listed == indexable, ('sitemap mismatch', listed ^ indexable)
assert not redirects and len(indexable) == 20, ('unexpected site structure', redirects, len(indexable))

# Every city page must be discoverable from the access guide.
city_pages = {name for name in pages if name.startswith('urgence-osteopathe-')}
assert len(city_pages) == 14, ('missing city pages', city_pages)
hub_links = {a.get('href') for t, a in pages['acces-cabinets.html'][1].tags if t == 'a'}
assert city_pages <= hub_links, ('access guide missing city links', city_pages - hub_links)
for filename in city_pages:
    text, page = pages[filename]
    title = re.search(r'<title>(.*?)</title>', text, re.S).group(1)
    metas = {a.get('name', a.get('property')): a.get('content') for t, a in page.tags if t == 'meta'}
    assert title == metas['og:title'] == metas['twitter:title'], (filename, 'inconsistent titles')
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S):
        entities = json.loads(block)['@graph']
        web_pages = [entity for entity in entities if entity['@type'] == 'WebPage']
        assert len(web_pages) == 1 and web_pages[0]['name'] == title, (filename, 'inconsistent WebPage name')
print(f'OK: {len(indexable)} indexable pages, {len(redirects)} redirects, {schemas} JSON-LD blocks, {links} local references, {images} images, {booking_links} Doctolib links; office hours, prices and Analytics hooks verified.')
