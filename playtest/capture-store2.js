// Round 48 — hangar + mobile EN captures
const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = '/home/hatch/workspace/mecha-strategy-game/store-assets';
(async () => {
  const browser = await puppeteer.launch({ pipe: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  // EN locale + veteran before first load
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    localStorage.setItem('mecha-protocol-lang', 'en');
    localStorage.setItem('mecha-protocol-veteran', '1');
  });
  // hangar: open directly via Game.showHangar if available, else via flow
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined', { timeout: 15000 });
  await sleep(400);
  await page.setViewport({ width: 1280, height: 800 });
  const hangar = await page.evaluate(() => {
    if (typeof Game.showHangar === 'function') { Game.showHangar(); return 'showHangar'; }
    // fallback: complete M1 then continue
    return 'none';
  });
  await sleep(800);
  let vis = await page.evaluate(() => {
    const el = document.getElementById('hangar-screen');
    return el && !el.classList.contains('hidden');
  });
  if (!vis) {
    // fallback flow: briefing → launch → win → continue
    await page.evaluate(() => {
      if (document.getElementById('briefing-screen') && !document.getElementById('briefing-screen').classList.contains('hidden'))
        document.getElementById('btn-launch').click();
    });
    await page.waitForFunction(() => typeof Game !== 'undefined' && Game.phase === 'player', { timeout: 15000 }).catch(()=>{});
    await page.evaluate(() => {
      for (const m of Game.enemyMechs) { m.limbs.torso.hp = 0; m.limbs.torso.destroyed = true; }
      Game.checkEnd();
    });
    await sleep(1000);
    await page.evaluate(() => {
      for (const id of ['btn-continue','btn-next','btn-hangar','btn-debrief-continue']) {
        const b = document.getElementById(id);
        if (b && !b.classList.contains('hidden') && b.offsetParent) { b.click(); break; }
      }
    });
    await sleep(800);
    vis = await page.evaluate(() => {
      const el = document.getElementById('hangar-screen');
      return el && !el.classList.contains('hidden');
    });
  }
  console.log('hangar path:', hangar, 'visible:', vis);
  if (vis) await page.screenshot({ path: OUT + '/shot-hangar.png' });
  // mobile EN combat
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined' && !document.getElementById('briefing-screen').classList.contains('hidden'), { timeout: 15000 });
  await sleep(300);
  await page.screenshot({ path: OUT + '/shot-mobile-briefing.png' });
  await page.click('#btn-launch');
  await page.waitForFunction(() => Game.phase === 'player', { timeout: 15000 });
  await sleep(600);
  await page.evaluate(() => {
    const atk = Game.playerMechs[1];
    const def = Game.enemyMechs[0];
    atk.x = def.x - 3; atk.y = def.y;
    Game.unitsDirty = true;
    atk.acted = false; atk.moved = false;
    Game.resolveAttack(atk, def, atk.weapons.armR, 'torso');
  });
  await sleep(700);
  await page.screenshot({ path: OUT + '/shot-mobile-combat.png' });
  console.log('errors:', JSON.stringify(errs.filter(e => !e.includes('ERR_TUNNEL') && !e.includes('404'))));
  console.log('done');
  await browser.close();
})().catch(e => console.error('capture crashed:', e.message));
