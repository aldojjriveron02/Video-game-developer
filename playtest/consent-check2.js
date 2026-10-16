const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  const r = await page.evaluate(() => {
    const out = {};
    // Decline → telemetry must refuse to init
    localStorage.setItem('mecha-protocol-analytics', '0');
    try { if (typeof Telemetry !== 'undefined') { Telemetry._retried = false; Telemetry.init(); } } catch (e) { out.err = e.message; }
    out.declinedStaysOff = typeof Telemetry !== 'undefined' ? !Telemetry.enabled : 'n/a';
    // Opt back in via setConsent
    try { Telemetry.setConsent(true); } catch (e) { out.err2 = e.message; }
    out.storedAfterOptIn = localStorage.getItem('mecha-protocol-analytics');
    // Opt out again
    try { Telemetry.setConsent(false); } catch (e) { out.err3 = e.message; }
    out.disabledAfterOptOut = typeof Telemetry !== 'undefined' ? !Telemetry.enabled : 'n/a';
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
