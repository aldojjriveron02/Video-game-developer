/* Mecha Protocol — scripted browser playtest (Round 30+)
 * Drives the real game in headless Chromium over pipes: welcome → briefing →
 * M1 battle (move + attack via synthetic pointer input) → end turn → enemy
 * phase → UI buttons. Captures console errors + screenshots. */
'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
const SHOT = __dirname + '/shots';
fs.mkdirSync(SHOT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

(async () => {
  const errors = [];
  const browser = await puppeteer.launch({
    pipe: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[console.error] ' + m.text()); });
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message));
  page.on('requestfailed', (r) => errors.push('[requestfailed] ' + r.url() + ' ' + (r.failure() || {}).errorText));

  const ev = (fn, ...args) => page.evaluate(fn, ...args);
  const state = (label) => ev(() => ({
    phase: Game && Game.phase,
    turn: Game && Game.turn,
    mission: Game && Game.missionIndex,
    tStep: Tutorial && Tutorial.step,
    tOn: Tutorial && Tutorial.enabled,
    selected: !!(Game && Game.selected),
    moveInfo: !!(Game && Game.moveInfo),
    targets: Game ? Game.attackTargets.length : -1,
    forecast: !!(Game && Game.forecast),
    undos: Game && Game.undosLeft,
    player: Game ? Game.playerMechs.map((m) => ({ x: m.x, y: m.y, hp: m.limbs.torso.hp })) : null,
    enemy: Game ? Game.enemyMechs.map((m) => ({ x: m.x, y: m.y, hp: m.limbs.torso.hp })) : null,
  })).then((s) => { log.push(label + ': ' + JSON.stringify(s)); return s; });

  const tileXY = (gx, gy) => ev((gx, gy) => {
    const v = Game.view, r = Game.cvU.getBoundingClientRect();
    return { x: Math.round(r.left + v.ox + (gx + 0.5) * v.tile), y: Math.round(r.top + v.oy + (gy + 0.5) * v.tile) };
  }, gx, gy);
  const clickTile = async (gx, gy) => { const p = await tileXY(gx, gy); await page.mouse.click(p.x, p.y); };

  await page.goto('http://localhost:8901/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => typeof Game !== "undefined" && Game.phase, { timeout: 20000 });
  await sleep(900);
  await page.screenshot({ path: SHOT + '/1-welcome.png' });
  await state('after-load');

  // 1. welcome → new player
  const wvis = await ev(() => !document.getElementById('welcome-screen').classList.contains('hidden'));
  log.push('welcome-visible: ' + wvis);
  if (wvis) await page.click('#btn-w-new');

  // 2. briefing → launch (Normal default)
  await page.waitForFunction(() => !document.getElementById('briefing-screen').classList.contains('hidden'), { timeout: 10000 });
  await sleep(600);
  await page.screenshot({ path: SHOT + '/2-briefing.png' });
  await page.click('#btn-launch');

  // 3. battle starts, coach mark = move
  await page.waitForFunction(() => typeof Game !== "undefined" && Game.phase === 'player' && Tutorial && Tutorial.step === 'move', { timeout: 20000 });
  await sleep(700);
  await page.screenshot({ path: SHOT + '/3-coach-move.png' });
  let s = await state('battle-start');

  // 4. click the coached mech, then a reachable tile nearest the enemy
  const ct = await ev(() => Game.coachTarget);
  await clickTile(ct.x, ct.y);
  await page.waitForFunction(() => typeof Game !== "undefined" && !!Game.moveInfo, { timeout: 8000 });
  const dest = await ev(() => {
    const e = Game.enemyMechs[0];
    let best = null, bd = 1e9;
    for (const k of Object.keys(Game.moveInfo.dist)) {
      const [x, y] = k.split(',').map(Number);
      const d = Math.abs(x - e.x) + Math.abs(y - e.y);
      if (d < bd) { bd = d; best = { x, y }; }
    }
    return best;
  });
  log.push('move-dest: ' + JSON.stringify(dest));
  await clickTile(dest.x, dest.y);
  await page.waitForFunction(() => typeof Tutorial !== "undefined" && Tutorial.step === "attack", { timeout: 15000 });
  await sleep(400);
  await page.screenshot({ path: SHOT + '/4-after-move.png' });
  s = await state('after-move');

  // 5. attack: tap nearest enemy → forecast → FIRE
  if (s.targets > 0) {
    const ne = await ev(() => { const e = Game.nearestEnemyToPlayer(); return { x: e.x, y: e.y }; });
    await clickTile(ne.x, ne.y);
    await page.waitForFunction(() => typeof Game !== "undefined" && !!Game.forecast, { timeout: 8000 });
    await sleep(400);
    await page.screenshot({ path: SHOT + '/5-forecast.png' });
    await state('forecast-open');
    await page.click('#f-fire');
    await page.waitForFunction(() => typeof Tutorial !== "undefined" && Tutorial.step === "heat", { timeout: 20000 });
    await sleep(800);
    await page.screenshot({ path: SHOT + '/6-after-attack.png' });
    await state('after-attack');
  } else {
    log.push('NO-ATTACK-TARGET after move — skipping attack step');
  }

  // 6. end turn → enemy phase → turn 2
  await page.click('#btn-end');
  await sleep(1500);
  await page.screenshot({ path: SHOT + '/7-enemy-phase.png' });
  await page.waitForFunction(() => typeof Game !== "undefined" && Game.phase === 'player' && Game.turn === 2, { timeout: 90000 });
  await sleep(600);
  await page.screenshot({ path: SHOT + '/8-turn2-intents.png' });
  await state('turn-2');

  // 5b. attack on turn 2 (enemies have advanced into range)
  s = await ev(() => {
    const m = Game.playerMechs.find((x) => x.limbs.torso.hp > 0);
    return { x: m.x, y: m.y };
  });
  await clickTile(s.x, s.y);
  await sleep(500);
  const hasTargets = await ev(() => Game.attackTargets.length > 0);
  log.push('turn2-attack-targets: ' + hasTargets);
  if (hasTargets) {
    const ne = await ev(() => { const e = Game.nearestEnemyToPlayer(); return { x: e.x, y: e.y }; });
    await clickTile(ne.x, ne.y);
    await page.waitForFunction(() => typeof Game !== "undefined" && !!Game.forecast, { timeout: 8000 });
    await sleep(400);
    await page.screenshot({ path: SHOT + '/5-forecast.png' });
    await state('forecast-open');
    await page.click('#f-fire');
    await page.waitForFunction(() => typeof Tutorial !== "undefined" && Tutorial.step === 'heat', { timeout: 20000 });
    await sleep(800);
    await page.screenshot({ path: SHOT + '/6-after-attack.png' });
    await state('after-attack');
  }

  // 7. undo button
  const undosBefore = await ev(() => Game.undosLeft);
  await page.click('#btn-undo');
  await sleep(600);
  const undosAfter = await ev(() => Game.undosLeft);
  log.push(`undo: ${undosBefore} → ${undosAfter} (expect decrement)`);

  // 8. help glossary
  await page.click('#btn-help');
  await sleep(500);
  await page.screenshot({ path: SHOT + '/9-help.png' });
  const helpOpen = await ev(() => !document.getElementById('help-screen').classList.contains('hidden'));
  log.push('help-open: ' + helpOpen);
  await page.click('#btn-help-close');

  // 9. language toggle → Japanese
  await page.click('#btn-lang');
  await sleep(600);
  const langNow = await ev(() => I18N && I18N.locale);
  await page.screenshot({ path: SHOT + '/10-japanese.png' });
  log.push('locale-after-toggle: ' + langNow);
  await page.click('#btn-lang'); // back to English
  await sleep(400);

  // 10. speed toggle
  const spdBefore = await ev(() => Game.animSpeed);
  await page.click('#btn-speed');
  await sleep(300);
  const spdAfter = await ev(() => Game.animSpeed);
  log.push(`speed: ${spdBefore} → ${spdAfter}`);

  // 11. perf HUD smoke test
  await page.goto('http://localhost:8901/?perf=1', { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(1200);
  const perfOn = await ev(() => Perf && Perf.on && !!document.getElementById('perf-hud'));
  log.push('perf-hud: ' + perfOn);
  await page.screenshot({ path: SHOT + '/11-perf-hud.png' });

  await browser.close();

  console.log('=== PLAYTEST LOG ===');
  log.forEach((l) => console.log(l));
  console.log('=== ERRORS (' + errors.length + ') ===');
  errors.forEach((e) => console.log(e));
  console.log(errors.length === 0 ? 'RESULT: CLEAN — no console/page/network errors' : 'RESULT: ERRORS FOUND');
})().catch((e) => { console.error('PLAYTEST CRASHED:', e.message); process.exit(1); });
