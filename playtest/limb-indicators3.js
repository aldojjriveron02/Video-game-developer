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
    // Start a mission to get playerMechs initialized, then jump to hangar
    if (typeof Game !== 'undefined') {
      Game.startMission(0);
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    if (typeof Game !== 'undefined' && Game.playerMechs && Game.playerMechs[0]) {
      const m = Game.playerMechs[0];
      m.limbs.armL.hp = Math.floor(m.limbs.armL.max * 0.4);
      m.limbs.legR.hp = 0; m.limbs.legR.destroyed = true;
      Game.state = 'hangar';
      if (typeof Hangar !== 'undefined') { Hangar.game = Game; Hangar.mechIndex = 0; Hangar.render(); }
      document.getElementById('hangar-screen').classList.remove('hidden');
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/tmp/limb-indicators.png' });
  console.log('shot ok');
  await browser.close();
})();
