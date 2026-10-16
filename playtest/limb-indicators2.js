const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.evaluate(() => {
    document.getElementById('btn-w-vet').click();
    if (typeof Game !== 'undefined' && typeof Hangar !== 'undefined') {
      // damage the preview mech's limbs before opening hangar
      Hangar.open(Game);
      const m = Game.saveData.squad ? Game.saveData.squad[0] : null;
      const mech = m || (Hangar.preview ? Hangar.preview : null);
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const info = await page.evaluate(() => {
    // Find how the hangar paper-doll gets its mech, damage it, re-render
    if (typeof Hangar === 'undefined') return { noHangar: true };
    const keys = Object.keys(Hangar);
    return { keys: keys.slice(0, 12) };
  });
  console.log(JSON.stringify(info));
  await browser.close();
})();
