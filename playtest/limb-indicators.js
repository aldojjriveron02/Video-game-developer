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
    // Damage some limbs directly then force a hangar render
    if (typeof Game !== 'undefined' && Game.saveData) {
      const m = Game.saveData.mecha;
      if (m && m.limbs) {
        m.limbs.armL.hp = Math.floor(m.limbs.armL.max * 0.4);  // damaged
        m.limbs.legR.hp = 0; m.limbs.legR.destroyed = true;    // destroyed
      }
      if (Game.showHangar) Game.showHangar();
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/tmp/limb-indicators.png' });
  console.log('shot ok');
  await browser.close();
})();
