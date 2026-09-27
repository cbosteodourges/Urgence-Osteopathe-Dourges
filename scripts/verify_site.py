"""Offline integrity checks for the published static site. Run: python scripts/verify_site.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
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
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        assert len(attributes) == len(attrs), ('duplicate HTML attributes', tag, attrs)
        self.tags.append((tag, attributes))
        if 'id' in attributes:
            self.ids.append(attributes['id'])


pages = {p.name: (p.read_text(), Page(p.read_text())) for p in DOCS.glob('*.html')}
indexable, descriptions, redirects = set(), set(), set()
links = schemas = images = 0
for filename, (text, page) in pages.items():
    if filename.startswith('google'):
        continue
    assert len(page.ids) == len(set(page.ids)), (filename, 'duplicate IDs')
    metas = {a.get('name', a.get('property', a.get('http-equiv'))): a.get('content') for t, a in page.tags if t == 'meta'}
    canonical = [a['href'] for t, a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert len(canonical) == 1, filename
    assert len([1 for t, a in page.tags if t == 'h1']) == 1, filename
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
            for business in businesses:
                assert business['address']['addressLocality'] in ('Hénin-Beaumont', 'Dourges'), filename
                for spec in business['openingHoursSpecification']:
                    pair = spec['opens'], spec['closes']
                    assert pair == ('09:00', '19:00') or (
                        pair == ('00:00', '00:00') and
                        spec['dayOfWeek'] == 'https://schema.org/PublicHolidays' and
                        business['address']['addressLocality'] == 'Hénin-Beaumont'
                    ), (filename, spec)
        assert '08:00' not in text and '20:00' not in text, filename

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
assert len(redirects) == 12 and len(indexable) == 8
print(f'OK: {len(indexable)} indexable pages, {len(redirects)} redirects, {schemas} JSON-LD blocks, {links} local references, {images} images.')
