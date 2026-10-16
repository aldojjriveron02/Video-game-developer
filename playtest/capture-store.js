// Mecha Protocol — store page screenshot capture (Round 48)
// Captures the itch.io asset set: peak combat, hangar, grid overview,
// briefing, victory. Desktop 1280x800 (store surfaces) + mobile 390x844.
const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = '/home/hatch/workspace/mecha-strategy-game/store-assets';

(async () => {
  const browser = await puppeteer.launch({ pipe: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  // --- DESKTOP captures ---
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => typeof Game !== 'undefined', { timeout: 15000 });
  await sleep(400);
  await page.evaluate(() => { localStorage.setItem('mecha-protocol-lang', 'en'); localStorage.setItem('mecha-protocol-veteran', '1'); });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined' && !document.getElementById('briefing-screen').classList.contains('hidden'), { timeout: 15000 });
  await sleep(400);
  await page.screenshot({ path: OUT + '/shot-briefing.png' });

  await page.click('#btn-launch');
  await page.waitForFunction(() => Game.phase === 'player', { timeout: 15000 });
  await sleep(800);
  // grid overview mid-battle
  await page.screenshot({ path: OUT + '/shot-grid-overview.png' });

  // peak combat: move a mech into range and attack, capture mid-resolution
  await page.evaluate(() => {
    const atk = Game.playerMechs[0];
    const def = Game.enemyMechs[0];
    // teleport into range for the shot
    atk.x = def.x - 3; atk.y = def.y;
    Game.unitsDirty = true;
    Game.selected = atk;
    atk.acted = false; atk.moved = false;
    Game.resolveAttack(atk, def, atk.weapons.armR, 'torso');
  });
  await sleep(700);  // mid-resolution: projectiles/particles/floaters live
  await page.screenshot({ path: OUT + '/shot-peak-combat.png' });
  await sleep(1500);

  // hangar: end mission → hangar screen
  await page.evaluate(() => {
    for (const m of Game.enemyMechs) { m.limbs.torso.hp = 0; m.limbs.torso.destroyed = true; }
    Game.checkEnd();
  });
  await sleep(800);
  await page.screenshot({ path: OUT + '/shot-victory.png' });
  // hangar screen (after victory continue)
  await page.evaluate(() => {
    const btn = document.getElementById('btn-continue') || document.getElementById('btn-next');
    if (btn && !btn.classList.contains('hidden')) btn.click();
  });
  await sleep(600);
  const hangarVisible = await page.evaluate(() => {
    const el = document.getElementById('hangar-screen');
    return el && !el.classList.contains('hidden');
  });
  if (hangarVisible) await page.screenshot({ path: OUT + '/shot-hangar.png' });

  // --- MOBILE capture: peak combat vertical ---
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => typeof Game !== 'undefined' && !document.getElementById('briefing-screen').classList.contains('hidden'), { timeout: 15000 });
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
