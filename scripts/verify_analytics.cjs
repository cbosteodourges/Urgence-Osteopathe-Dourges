/* Browser checks using the real Google library; collection requests are intercepted.
 * Run with PLAYWRIGHT_MODULE pointing to playwright and GOOGLE_TAG_FIXTURE to a
 * fresh downloaded gtag.js. No test hits are sent to the live Analytics property.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const docs = path.resolve(__dirname, '../docs');
const site = 'https://osteopathe-urgence-59-62.fr';
const googleTag = fs.readFileSync(process.env.GOOGLE_TAG_FIXTURE, 'utf8');
const measurement = 'G-LV04SF57XP';
const cookieKey = 'cb_analytics_consent';
const consentSelector = '[data-consent="grant"]';
const pages = fs.readdirSync(docs).filter(x => x.endsWith('.html') && !x.startsWith('google'));
const mime = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css',
  '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg'};

(async function () {
  const browser = await chromium.launch({headless:true,
    executablePath:process.env.CHROME_EXECUTABLE || undefined,
    args:['--no-sandbox']});
  let checks = 0;
  async function environment(viewport) {
    const context = await browser.newContext({viewport: viewport || {width:390,height:844}});
    const hits = [], loads = [], errors = [];
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === site) {
        const target = path.join(docs, decodeURIComponent(url.pathname === '/' ? 'index.html' : url.pathname.slice(1)));
        if (fs.existsSync(target) && target.startsWith(docs + path.sep)) {
          await route.fulfill({status:200,body:fs.readFileSync(target),contentType:mime[path.extname(target)] || 'application/octet-stream'});
        } else await route.fulfill({status:404,body:'Not found'});
      } else if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
        loads.push(url.href);
        await route.fulfill({status:200,body:googleTag,contentType:'application/javascript'});
      } else if (/(^|\.)google-analytics\.com$/.test(url.hostname) && /collect$/.test(url.pathname)) {
        hits.push({url:url.href, body:request.postData() || ''});
        await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*'}});
      } else await route.abort();
    });
    context.on('page', page => page.on('pageerror', e => errors.push(e.message)));
    const page = await context.newPage();
    return {context,page,hits,loads,errors};
  }
  async function eventCount(page, name) {
    return page.evaluate(n => window.dataLayer.filter(x => x[0] === 'event' && x[1] === n).length, name);
  }
  function receivedEvents(hits) {
    return hits.flatMap(h => {
      const query = new URL(h.url).searchParams;
      const lines = h.body ? h.body.split('\n').map(s => new URLSearchParams(s)) : [];
      return [query, ...lines].map(p => p.get('en')).filter(Boolean);
    });
  }
  try {
    const e = await environment();
    await e.page.goto(site + '/urgence-osteopathe-henin-beaumont.html?utm_source=oosteo&utm_medium=referral&utm_campaign=fiche_henin_beaumont&email=test@example.invalid#patient-secret');
    await e.page.locator('.cb-consent').waitFor({state:'visible'});
    await e.page.waitForTimeout(350);
    assert.equal(e.loads.length,0); assert.equal(e.hits.length,0); checks += 2;
    const geometry = await e.page.locator('.cb-consent').boundingBox();
    assert(geometry.x >= 0 && geometry.x + geometry.width <= 390 && geometry.y >= 0 && geometry.y + geometry.height <= 844); checks++;
    const denyBox = await e.page.locator('[data-consent="deny"]').boundingBox();
    const grantBox = await e.page.locator(consentSelector).boundingBox();
    assert.equal(denyBox.height,grantBox.height); assert.equal(denyBox.width,grantBox.width); checks += 2;
    await e.page.locator('.cb-consent-info').click();
    assert(await e.page.locator('dialog[open]').isVisible()); checks++;
    await e.page.keyboard.press('Escape');
    await e.page.locator('[data-consent="deny"]').click();
    await e.page.reload();
    assert.equal(e.loads.length,0); assert.equal(e.hits.length,0);
    assert(await e.page.locator('.cb-consent').isHidden()); checks += 3;

    await e.page.locator('[data-privacy-settings]').click();
    await e.page.locator(consentSelector).click();
    await e.page.waitForFunction(() => !!window.google_tag_manager, {timeout:10000});
    await e.page.waitForTimeout(1500);
    assert.equal(e.loads.length,1); assert(receivedEvents(e.hits).includes('page_view')); checks += 2;
    const viewHit = e.hits.find(h => new URL(h.url).searchParams.get('en') === 'page_view');
    assert(viewHit, 'page_view must be sent to Analytics');
    const hitQuery = new URL(viewHit.url).searchParams;
    assert.equal(hitQuery.get('tid'),measurement);
    assert.equal(hitQuery.get('dl'),site + '/urgence-osteopathe-henin-beaumont.html?utm_source=oosteo&utm_medium=referral&utm_campaign=fiche_henin_beaumont'); checks += 2;
    const config = await e.page.evaluate(() => window.dataLayer.find(x => x[0] === 'config')[2]);
    assert(config.page_location.includes('utm_source=oosteo'));
    assert(!config.page_location.includes('email=') && !config.page_location.includes('#'));
    assert.equal(config.allow_google_signals,false); assert.equal(config.cookie_update,false); checks += 4;
    assert(e.hits.every(h => !h.url.includes('test%40') && !h.url.includes('patient-secret') && !h.body.includes('patient-secret'))); checks++;

    // Real button activations, including clicks on child icons, must preserve links.
    await e.page.locator('a[href^="tel:"]').first().click();
    await e.page.locator('a[href^="sms:"]').first().click();
    await e.page.locator('a[href*="placeId=practice-732649"]').first().click();
    await e.page.locator('a[href*="placeId=practice-733086"]').first().click();
    await e.page.waitForTimeout(1500);
    assert.equal(await eventCount(e.page,'click_call'),1);
    assert.equal(await eventCount(e.page,'click_sms'),1);
    assert.equal(await eventCount(e.page,'click_doctolib'),2); checks += 3;
    const events = receivedEvents(e.hits);
    for (const name of ['click_call','click_sms','click_doctolib']) { assert(events.includes(name), name + ' not transmitted'); checks++; }
    const cabinets = await e.page.evaluate(() => window.dataLayer.filter(x => x[0] === 'event' && x[1] === 'click_doctolib').map(x => x[2].cabinet));
    assert.deepEqual(cabinets,['henin_beaumont','dourges']); checks++;
    const calls = await e.page.evaluate(() => window.dataLayer.filter(x => x[0] === 'event' && x[1] === 'click_call').map(x => x[2]));
    assert(!JSON.stringify(calls).includes('769565271')); checks++;

    const second = await e.context.newPage();
    await second.goto(site + '/contact.html');
    await second.waitForFunction(() => !!window.google_tag_manager, {timeout:10000});
    assert(await second.locator('.cb-consent').isHidden()); checks++;
    await e.page.locator('[data-privacy-settings]').click();
    await Promise.all([e.page.waitForNavigation(),e.page.locator('[data-consent="deny"]').click()]);
    await second.waitForFunction(id => window['ga-disable-' + id] === true && !window.google_tag_manager,measurement);
    const afterWithdraw = e.hits.length;
    await e.page.locator('a[href^="tel:"]').first().click();
    await e.page.waitForTimeout(400);
    assert.equal(e.hits.length,afterWithdraw);
    assert((await e.context.cookies(site)).every(c => !c.name.startsWith('_ga'))); checks += 2;

    // An expired acceptance must not silently restart tracking.
    await e.page.evaluate(key => localStorage.setItem(key,JSON.stringify({version:1,granted:true,expires:Date.now()-1})),cookieKey);
    const loadsBeforeExpiry = e.loads.length;
    await e.page.reload();
    assert(await e.page.locator('.cb-consent').isVisible());
    assert.equal(e.loads.length,loadsBeforeExpiry); checks += 2;
    assert.deepEqual(e.errors,[]); checks++;
    await e.page.setViewportSize({width:320,height:740});
    const narrow = await e.page.locator('.cb-consent').boundingBox();
    assert(narrow.x >= 0 && narrow.x + narrow.width <= 320 && narrow.y >= 0 && narrow.y + narrow.height <= 740); checks++;
    await e.page.screenshot({path:(process.env.ANALYTICS_SCREENSHOT || '/tmp/analytics-desktop.png').replace('desktop','mobile')});
    await e.context.close();

    const blocked = await environment();
    await blocked.context.addInitScript(() => {
      Object.defineProperty(window,'localStorage',{get:() => { throw new Error('Storage blocked'); }});
    });
    await blocked.page.goto(site + '/index.html');
    assert(await blocked.page.locator('.cb-consent').isVisible());
    assert.equal(blocked.loads.length,0); checks += 2;
    await blocked.page.locator(consentSelector).click();
    await blocked.page.waitForFunction(() => !!window.google_tag_manager);
    await blocked.page.reload();
    assert(await blocked.page.locator('.cb-consent').isVisible());
    assert.equal(blocked.loads.length,1); assert.deepEqual(blocked.errors,[]); checks += 3;
    await blocked.context.close();

    // All site pages must expose the same reversible choice at desktop width.
    const desktop = await environment({width:1440,height:1000});
    for (const name of pages) {
      await desktop.page.goto(site + '/' + name);
      assert(await desktop.page.locator('[data-privacy-settings]').isVisible());
      assert(await desktop.page.locator('.cb-consent').isVisible());
      assert.equal(await desktop.page.locator('h1').count(),1); checks += 3;
    }
    assert.equal(desktop.loads.length,0); assert.equal(desktop.hits.length,0); checks += 2;
    assert.deepEqual(desktop.errors,[]); checks++;
    await desktop.page.screenshot({path:process.env.ANALYTICS_SCREENSHOT || '/tmp/analytics-desktop.png'});
    await desktop.context.close();
    console.log('OK:',checks,'browser checks;',pages.length,'pages; real GA4 payloads captured; no live test hits sent.');
  } finally { await browser.close(); }
}()).catch(error => { console.error(error); process.exitCode = 1; });
