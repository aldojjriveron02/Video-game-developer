/* Mecha Protocol — mech state, limb damage, paper-doll renderer */
'use strict';

let MECH_ID = 1;

function makeMech(team, name, loadout) {
  // loadout: { armor:'medium', armL:'rifle', armR:'blade', ... }
  const armor = ARMOR[loadout.armor || 'medium'];
  const limbs = {};
  for (const k of Object.keys(LIMB_DEFS)) {
    const max = Math.round(LIMB_DEFS[k].baseHp * armor.hpMul);
    limbs[k] = { hp:max, max, destroyed:false };
  }
  return {
    id: MECH_ID++, team, name,
    x:0, y:0, facing: team === 'player' ? 1 : -1,
    armor: armor.id,
    weapons: { armL: loadout.armL || 'rifle', armR: loadout.armR || 'rifle' },
    limbs, heat:0, maxHeat:10,
    acted:false, moved:false, shutdown:false,
    kills:0,
  };
}

function mechAlive(m) { return !m.limbs.torso.destroyed; }

function mechMoveRange(m) {
  const base = 4 + ARMOR[m.armor].moveBonus;
  let r = base + (m.bonusMove || 0);
  if (m.limbs.legL.destroyed) r -= 2;
  if (m.limbs.legR.destroyed) r -= 2;
  return Math.max(1, r);
}

function mechAccuracy(m) {
  let acc = 85;
  if (m.limbs.head.destroyed) acc -= 25;
  return acc;
}

// Apply damage to a specific limb. Returns events: ['destroyed:armL', ...]
function damageLimb(m, limbKey, dmg) {
  const limb = m.limbs[limbKey];
  if (!limb || limb.destroyed) return [];
  limb.hp -= dmg;
  if (limb.hp <= 0) { limb.hp = 0; limb.destroyed = true; return ['destroyed:' + limbKey]; }
  return [];
}

// Weighted random limb targeting: torso/head favored, destroyed skipped
function pickTargetLimb(m, rng) {
  const weights = { torso:30, head:12, armL:18, armR:18, legL:11, legR:11 };
  const pool = [];
  for (const k of Object.keys(weights)) {
    if (!m.limbs[k].destroyed) for (let i = 0; i < weights[k]; i++) pool.push(k);
  }
  if (!pool.length) return 'torso';
  return pool[Math.floor(rng() * pool.length)];
}

/* ---------- Paper-doll renderer ----------
   Draws the mech from its actual loadout: armor tier colors the plating,
   weapons draw on the arms, destroyed limbs render dark/broken.
   (w,h) = pixel size of the drawing area. facing: 1 = right, -1 = left. */
function drawMech(ctx, m, x, y, w, h, opts) {
  opts = opts || {};
  const s = Math.min(w, h) / 100;      // unit scale
  const fx = m.facing;
  ctx.save();
  ctx.translate(x + w / 2, y + h * 0.92);
  ctx.scale(fx * s, s);
  const armorColor = ARMOR[m.armor].color;
  const teamColor = m.tint || (m.team === 'player' ? PLAYER_COLOR : ENEMY_COLOR);
  const dark = c => shade(c, -45);

  // limb vertical centers (Round 65 — accessibility indicators): match the draw coordinates below
  const LIMB_CY = { head: -68, torso: -47, armL: -45, armR: -45, legL: -17, legR: -17 };
  const limb = (key, drawFn) => {
    const L = m.limbs[key];
    ctx.save();
    if (L.destroyed) ctx.globalAlpha = 0.35;
    // hit flash (Round 53): damaged limb flashes white 2 frames; red on limb break
    const fl = m.limbFlash;
    const flashColor = (fl && fl.limb === key && fl.t > 0) ? fl.color : null;
    drawFn(flashColor || (L.destroyed ? '#1a1f2e' : armorColor), L);
    ctx.restore();
    // damage indicators (Round 65 — accessibility: icons/patterns, never color alone)
    const cy = LIMB_CY[key] || -50;
    if (!L.destroyed && L.hp < L.max) {  // damaged: crack lines, more as damage grows
      ctx.save(); ctx.strokeStyle = '#0a0e1a'; ctx.lineWidth = 1.5;
      const n = Math.min(3, 1 + Math.floor((1 - L.hp / L.max) * 3));
      for (let i = 0; i < n; i++) {
        const y = cy - 7 + i * 9;
        ctx.beginPath(); ctx.moveTo(-10, y); ctx.lineTo(-1, y + 5); ctx.lineTo(-7, y + 10); ctx.stroke();
      }
      ctx.restore();
    } else if (L.destroyed) {  // destroyed: ✕ marker (alpha+luminance already applied above)
      ctx.save(); ctx.strokeStyle = '#ff3b3b'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-7, cy - 7); ctx.lineTo(7, cy + 7);
      ctx.moveTo(7, cy - 7); ctx.lineTo(-7, cy + 7);
      ctx.stroke(); ctx.restore();
    }
  };

  // legs
  limb('legL', (c) => { ctx.fillStyle = c; ctx.fillRect(-16, -34, 11, 34); });
  limb('legR', (c) => { ctx.fillStyle = c; ctx.fillRect(5, -34, 11, 34); });
  // panel lines — tone-matched darker tints, never pure black (Round 40 — Gundam grammar)
  const panel = (c) => shade(c, -28);
  if (!m.limbs.legL.destroyed) { ctx.fillStyle = panel(armorColor); ctx.fillRect(-12, -30, 2, 26); }
  if (!m.limbs.legR.destroyed) { ctx.fillStyle = panel(armorColor); ctx.fillRect(9, -30, 2, 26); }
  // feet
  ctx.fillStyle = dark(armorColor);
  if (!m.limbs.legL.destroyed) ctx.fillRect(-18, -6, 15, 6);
  if (!m.limbs.legR.destroyed) ctx.fillRect(3, -6, 15, 6);
  // torso
  limb('torso', (c) => {
    ctx.fillStyle = c; ctx.fillRect(-15, -62, 30, 30);
    ctx.fillStyle = teamColor; ctx.fillRect(-15, -62, 30, 5); // team stripe
    // Round 299 — color-independence (GAG): team by SHAPE, not color alone.
    // ▲ = player, ▼ = enemy. White = color-independent, high contrast.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (m.team === 'player') { ctx.moveTo(-4, -68); ctx.lineTo(4, -68); ctx.lineTo(0, -74); }
    else { ctx.moveTo(-4, -74); ctx.lineTo(4, -74); ctx.lineTo(0, -68); }
    ctx.closePath(); ctx.fill();
  });
  if (!m.limbs.torso.destroyed) { ctx.fillStyle = panel(armorColor); ctx.fillRect(-15, -46, 30, 2); }
  // cockpit glow
  if (!m.limbs.torso.destroyed) {
    ctx.fillStyle = '#bffbff';
    ctx.fillRect(-4, -56, 8, 6);
  }
  // arms + weapons
  const drawArm = (key, sideX, weaponId) => {
    limb(key, (c) => { ctx.fillStyle = c; ctx.fillRect(sideX, -58, 9, 26); });
    const L = m.limbs[key];
    if (!L.destroyed && weaponId) drawWeapon(ctx, weaponId, sideX, -32, teamColor);
  };
  drawArm('armL', -26, m.weapons.armL);
  drawArm('armR', 17, m.weapons.armR);
  // head + visor
  limb('head', (c) => {
    ctx.fillStyle = c; ctx.fillRect(-9, -76, 18, 15);
    if (!m.limbs.head.destroyed) { ctx.fillStyle = '#ff3b3b'; ctx.fillRect(-7, -71, 14, 4); }
  });
  // heat glow + pattern (Round 78 — never color alone: 1–3 chevrons by heat level)
  if (m.heat >= 7) {
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(Date.now() / 150);
    ctx.fillStyle = '#ff7b2e';
    ctx.fillRect(-15, -62, 30, 30);
    ctx.globalAlpha = 1;
    // heat chevrons: 1 at 7–8, 2 at 9, 3 at 10+ (pattern, not just color)
    const n = m.heat >= 10 ? 3 : m.heat >= 9 ? 2 : 1;
    ctx.save(); ctx.strokeStyle = '#0a0e1a'; ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) {
      const y = -58 + i * 8;
      ctx.beginPath(); ctx.moveTo(-8, y); ctx.lineTo(0, y + 5); ctx.lineTo(8, y); ctx.stroke();
    }
    ctx.restore();
  }
  // shutdown X
  if (m.shutdown) {
    ctx.strokeStyle = '#ff5d5d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-20, -80); ctx.lineTo(20, -20);
    ctx.moveTo(20, -80); ctx.lineTo(-20, -20); ctx.stroke();
  }
  ctx.restore();
}

function drawWeapon(ctx, weaponId, ax, ay, teamColor) {
  ctx.save();
  ctx.fillStyle = '#222a3d';
  ctx.strokeStyle = teamColor; ctx.lineWidth = 1.5;
  const w = WEAPONS[weaponId];
  ctx.translate(ax + 4.5, ay);
  if (weaponId === 'blade') {
    ctx.fillStyle = '#cfe9ff';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(4, -26); ctx.lineTo(8, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7fd4ff'; ctx.stroke();
  } else if (weaponId === 'cannon') {
    ctx.fillRect(-4, -22, 16, 10); ctx.strokeRect(-4, -22, 16, 10);
    ctx.fillRect(8, -19, 10, 4);
  } else if (weaponId === 'missiles') {
    ctx.fillRect(-5, -20, 18, 12); ctx.strokeRect(-5, -20, 18, 12);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-1 + i * 6, -14, 2, 0, 7); ctx.fillStyle = teamColor; ctx.fill(); }
  } else { // rifle
    ctx.fillRect(-2, -24, 8, 22); ctx.strokeRect(-2, -24, 8, 22);
    ctx.fillRect(0, -30, 4, 8);
  }
  ctx.restore();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
