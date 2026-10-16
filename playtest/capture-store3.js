// Round 48 — hangar + mobile EN captures (direct Hangar.open)
const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = '/home/hatch/workspace/mecha-strategy-game/store-assets';
(async () => {
  const browser = await puppeteer.launch({ pipe: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    localStorage.setItem('mecha-protocol-lang', 'en');
    localStorage.setItem('mecha-protocol-veteran', '1');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined' && typeof Hangar !== 'undefined', { timeout: 15000 });
  await sleep(500);
  await page.evaluate(() => { Game.showBriefing(0); document.getElementById('btn-launch').click(); });
  await page.waitForFunction(() => Game.phase === 'player', { timeout: 15000 });
  await sleep(400);
  await page.evaluate(() => { Hangar.open(Game); });
  await sleep(800);
  const vis = await page.evaluate(() => {
    const el = document.getElementById('hangar-screen');
    return el && !el.classList.contains('hidden');
  });
  console.log('hangar visible:', vis);
  if (vis) await page.screenshot({ path: OUT + '/shot-hangar.png' });
  // mobile EN: fresh, briefing + combat
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('mecha-protocol-lang', 'en'); localStorage.setItem('mecha-protocol-veteran', '1'); });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined', { timeout: 15000 });
  await sleep(600);
  const st = await page.evaluate(() => ({
    briefing: !document.getElementById('briefing-screen').classList.contains('hidden'),
    phase: Game.phase,
  }));
  console.log('mobile state:', JSON.stringify(st));
  await page.screenshot({ path: OUT + '/shot-mobile-briefing.png' });
  console.log('errors:', JSON.stringify(errs.filter(e => !e.includes('ERR_TUNNEL') && !e.includes('404'))));
  console.log('done');
  await browser.close();
})().catch(e => console.error('capture crashed:', e.message));
