const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.split('\n')[0]));
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  // Welcome → briefing
  await page.evaluate(() => document.getElementById('btn-w-vet').click());
  await new Promise(r => setTimeout(r, 1000));
  // Launch mission → should reach hangar (pre-mission loadout)
  await page.evaluate(() => {
    const btn = document.querySelector('#briefing-screen .big-btn, #btn-launch');
    if (btn) btn.click();
    else if (typeof Game !== 'undefined' && Game.startMission) Game.startMission(0);
  });
  await new Promise(r => setTimeout(r, 2000));
  const state = await page.evaluate(() => ({
    hangarVisible: !document.getElementById('hangar-screen').classList.contains('hidden'),
    hasPlayerMechs: typeof Game !== 'undefined' && !!(Game.playerMechs && Game.playerMechs[0]),
  }));
  console.log(JSON.stringify(state));
  await page.screenshot({ path: '/tmp/limb-indicators.png' });
  await browser.close();
})();
