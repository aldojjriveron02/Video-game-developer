/* Mecha Protocol — enemy AI: enumerate → score → pick among best.
   Difficulty = non-optimality (ItB doc). */
'use strict';

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Score one candidate action. Higher = better for the enemy.
function scoreAction(game, mech, tx, ty, target, weaponId, aiDiff) {
  const w = WEAPONS[weaponId];
  const enraged = !!mech.phase2;  // VEX phase 2: aggression up, self-preservation down
  // Round 137 — archetypes as weight vectors (XCOM per-race pattern; IAUS):
  // same scorer, per-personality weights. Normalized considerations, real spread.
  // Enraged (VEX phase 2) forces charger weights — aggression up, self-preservation down.
  const pers = enraged ? 'charger' : (mech.personality || 'duelist');
  const W = {
    charger:    { dmg: 2.6, cover: 0.0, self: 0.4 },  // XCOM melee: ignores cover, max damage
    skirmisher: { dmg: 1.8, cover: 0.5, self: 1.0 },  // kites: damage + self-preservation
    holder:     { dmg: 1.6, cover: 1.0, self: 1.2 },  // XCOM elite: position for max damage, keeps cover
    duelist:    { dmg: 2.0, cover: 0.2, self: 0.8 },  // balanced
  }[pers] || { dmg: 2.0, cover: 0.2, self: 0.8 };
  let score = 0;
  if (target) {
    // expected damage: pick best limb value
    const limbVals = { torso: 3, head: 2, armL: 1.5, armR: 1.5, legL: 1, legR: 1 };
    let best = 0;
    for (const k of Object.keys(limbVals))
      if (!target.limbs[k].destroyed) best = Math.max(best, limbVals[k]);
    const hits = w.hits || 1;
    const acc = mechAccuracy(mech) / 100;
    const coverEvade = terrainAt(game.grid, target.x, target.y).cover / 100;
    const expDmg = w.dmg * hits * acc * (1 - coverEvade) * best;
    score += expDmg * W.dmg;
    if (!mechAlive({ limbs: target.limbs })) score += 0;
    // finishing blow bonus: would torso die?
    if (target.limbs.torso.hp <= w.dmg * hits) score += 25;
    // focus fire — a DIFFICULTY knob (Round 35): easy ignores it, normal is light,
    // hard is strong + cross-unit coordination via focus marks
    const dmgTaken = Object.values(target.limbs).reduce((s, l) => s + (l.max - l.hp), 0);
    score += dmgTaken * (aiDiff === 'easy' ? 0 : aiDiff === 'hard' ? 0.9 : 0.4);
    if (aiDiff === 'hard' && game._focusMarks && game._focusMarks.has(target.id)) score += 8;
  }
  // heat discipline: avoid overheating unless kill (relaxed when enraged; scaled by self-preservation weight)
  const heatAfter = mech.heat + w.heat;
  const heatPen = (enraged ? 0.5 : 1) * W.self;
  if (heatAfter > mech.maxHeat) score -= 30 * heatPen;
  else if (heatAfter >= 8) score -= 8 * heatPen;
  // positioning: personality-driven engagement rules (Round 35 — Fire Emblem mold)
  let nearest = 99;
  for (const p of game.playerMechs) {
    if (!mechAlive(p)) continue;
    nearest = Math.min(nearest, manhattan(tx, ty, p.x, p.y));
  }
  if (pers === 'charger') score -= nearest * 1.2;                              // closes distance, always
  else if (pers === 'skirmisher') score -= Math.abs(nearest - w.range) * 1.0;  // sits at weapon range
  else if (pers === 'holder') score -= manhattan(tx, ty, mech.x, mech.y) * 1.0; // holds its ground
  else score -= nearest * 0.5;                                                 // duelist: mild aggression
  // prefer keeping cover (weighted by personality — chargers ignore it, holders prize it)
  score += terrainAt(game.grid, tx, ty).cover * 0.2 * W.cover;
  return score;
}

// Choose action for one enemy mech. Returns {move:[x,y], target, weapon} or null.
// moveOnly (Round 28 — D&D legendary-action rule): the ace's 2nd action is
// reposition/utility, never a second nuke.
function aiChooseAction(game, mech, difficulty, moveOnly, avoidTargets) {
  const rng = mulberry32((game.turn * 7919 + mech.id * 131) >>> 0);
  const blocked = (x, y, sx, sy) => game.mechAt(x, y) && !(x === sx && y === sy);
  const { dist, prev } = moveRange(game.grid, mech.x, mech.y, mechMoveRange(mech), blocked);
  const candidates = [];
  const moveTiles = [[mech.x, mech.y]];
  for (const k of Object.keys(dist)) {
    const [x, y] = k.split(',').map(Number);
    if (!(x === mech.x && y === mech.y)) moveTiles.push([x, y]);
  }
  const armWeapons = [];
  if (!mech.limbs.armL.destroyed) armWeapons.push(['armL', mech.weapons.armL]);
  if (!mech.limbs.armR.destroyed) armWeapons.push(['armR', mech.weapons.armR]);

  for (const [tx, ty] of moveTiles) {
    for (const [arm, wid] of armWeapons) {
      const w = WEAPONS[wid];
      const inRange = tilesInRange(game.grid, tx, ty, w.range);
      let acted = false;
      for (const p of game.playerMechs) {
        if (!mechAlive(p)) continue;
        if (inRange.some(([x, y]) => x === p.x && y === p.y)) {
          candidates.push({ move: [tx, ty], target: p, weapon: wid,
            score: scoreAction(game, mech, tx, ty, p, wid, difficulty) });
          acted = true;
        }
      }
      if (!acted) {
        // reposition move (no shot): score by aggression only
        candidates.push({ move: [tx, ty], target: null, weapon: wid,
          score: scoreAction(game, mech, tx, ty, null, wid, difficulty) - 5 });
      }
    }
  }
  if (!candidates.length) return null;
  const pool = moveOnly ? candidates.filter(c => !c.target) : candidates;
  if (!pool.length) return null;
  // Round 125 — focus-fire cap (tactics slot system, Vossen): max 2 enemies per player mech per round.
  // If a target is already at cap, deprioritize it (don't remove — fallback if nothing else).
  if (avoidTargets && avoidTargets.size) {
    for (const c of pool) {
      if (c.target && avoidTargets.has(c.target.id)) c.score *= 0.1;
    }
  }
  pool.sort((a, b) => b.score - a.score);
  // Round 161 — FTL priority-pick dial (jam AI decision): P(pick the best-scored action).
  // One number per difficulty = the whole difficulty system. Easy plays suboptimally
  // most of the time (fair-feeling, never cheating); hard always optimal.
  // Replaces the old top-N pick — strictly more tunable, same enumerate→score→pick.
  const PRIORITY_P = { easy: 0.3, normal: 0.7, hard: 1.0 };
  const p = PRIORITY_P[difficulty] !== undefined ? PRIORITY_P[difficulty] : 0.7;
  if (pool.length === 1 || rng() < p) return pool[0];
  // Suboptimal pick: random legal action that ISN'T the best (FTL's "random room").
  return pool[1 + Math.floor(rng() * (pool.length - 1))];
}
