const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const r = await page.evaluate(() => {
    if (typeof Perf === 'undefined') return { noPerf: true };
    // Simulate 200 frames at 33.3ms (iOS Low Power throttle)
    for (let i = 0; i < 200; i++) Perf.frame(33.3);
    return {
      lowPower: !!Perf.lowPower,
      govLevel: Perf.govLevel,
      checked: !!Perf._lpChecked,
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
