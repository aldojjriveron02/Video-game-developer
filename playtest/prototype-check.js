const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  const r = await page.evaluate(() => {
    document.getElementById('btn-w-vet').click();
    const helpBtn = document.querySelector('[data-screen="help"], #btn-help');
    if (helpBtn) helpBtn.click();
    const html = document.getElementById('help-screen').innerHTML;
    return {
      hasPrototypeNote: html.includes('Prototype status') || html.includes('プロトタイプ'),
      mentionsFun: html.toLowerCase().includes('fun') || html.includes('楽しい'),
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
