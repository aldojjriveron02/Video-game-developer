const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  const r = await page.evaluate(() => {
    // Dismiss welcome, then open Help
    document.getElementById('btn-w-vet').click();
    const helpBtn = document.querySelector('[data-screen="help"], #btn-help');
    const out = { helpBtnFound: !!helpBtn };
    if (helpBtn) helpBtn.click();
    else if (typeof Game !== 'undefined' && Game.showHelp) { Game.showHelp(); out.usedAPI = true; }
    const toggle = document.getElementById('analytics-toggle');
    out.toggleRendered = !!toggle;
    out.toggleHasButton = toggle ? toggle.innerHTML.includes('button') : false;
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
