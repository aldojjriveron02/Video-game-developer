const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  const r = await page.evaluate(() => {
    const checkbox = document.getElementById('consent-analytics');
    const card = document.getElementById('welcome-screen').innerHTML;
    // Decline consent, then check telemetry stays off
    if (checkbox) checkbox.checked = false;
    document.getElementById('btn-w-vet').click();
    const stored = localStorage.getItem('mecha-protocol-analytics');
    return {
      hasCheckbox: !!checkbox,
      labelHasAnalytics: card.includes('analytics') || card.includes('プレイデータ'),
      storedAfterDecline: stored,
      telemetryEnabled: window.Telemetry ? Telemetry.enabled : 'n/a',
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
