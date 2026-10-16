/* Mecha Protocol — hangar: part swaps with live paper-doll preview */
'use strict';

const Hangar = {
  mechIndex: 0,

  open(game) {
    this.game = game;
    this.mechIndex = 0;
    const el = document.getElementById('hangar-screen');
    el.classList.remove('hidden');
    // Round 155 — jam squad-select (LD60: lock the hangar). JAM_BUILD shows 3 curated
    // presets, pick in <30s (ItB model). Full hangar stays for the slice.
    if (typeof JAM_BUILD !== 'undefined' && JAM_BUILD && typeof SQUAD_PRESETS !== 'undefined') {
      this.renderSquadSelect();
      return;
    }
    this.render();
  },

  // Jam squad-select: one tap per preset, applies to all 3 player mechs, closes.
  // Round 234 — Diablo III delta pattern: every preset card shows its stats as
  // deltas vs the currently equipped squad (▲▼ + green/red, colorblind-safe),
  // paired with the plain-language desc (Round 165). No naked numbers.
  _squadTotals(loadouts) {
    // loadouts: [{armor, armL, armR}, ...] — from a preset or live mechs
    let hp = 0, move = 0;
    const guns = {};
    for (const l of loadouts) {
      const a = ARMOR[l.armor] || ARMOR.medium;
      for (const k of Object.keys(LIMB_DEFS)) hp += Math.round(LIMB_DEFS[k].baseHp * a.hpMul);
      move += a.moveBonus || 0;
      for (const w of [l.armL, l.armR]) if (w) guns[w] = (guns[w] || 0) + 1;
    }
    // weapon signature: most common arm weapon (the preset's identity)
    let sig = '', best = 0;
    for (const w of Object.keys(guns)) if (guns[w] > best) { best = guns[w]; sig = w; }
    return { hp, move, sig };
  },
  _deltaLine(cur, next) {
    const parts = [];
    const dh = next.hp - cur.hp, dm = next.move - cur.move;
    if (dh !== 0) parts.push(`<span style="color:${dh > 0 ? '#7dff8a' : '#ff7d7d'}">HP ${dh > 0 ? '▲' : '▼'}${Math.abs(dh)}</span>`);
    if (dm !== 0) parts.push(`<span style="color:${dm > 0 ? '#7dff8a' : '#ff7d7d'}">Move ${dm > 0 ? '▲' : '▼'}${Math.abs(dm)}</span>`);
    if (next.sig && next.sig !== cur.sig) parts.push(`<span style="color:#ffd75e">Arms → ${next.sig}</span>`);
    return parts.length ? ' <span style="font-size:11px">(' + parts.join(' · ') + ' vs current)</span>' : '';
  },
  renderSquadSelect() {
    const g = this.game;
    const el = document.getElementById('hangar-screen');
    // Round 174 — one-tap deploy (One Minute Rule): the recommended preset gets a
    // dominant primary button above the cards. Judge goes hangar→combat in <60s;
    // choosers still pick from the 3 cards below.
    const rec = SQUAD_PRESETS.findIndex(s => s.recommended);
    // Round 183 — mission-contextual recommendation (LoL pattern): tag the preset
    // recommended for THIS mission index alongside the global ★ default.
    const mi = (typeof g !== 'undefined' && typeof g.missionIndex === 'number') ? g.missionIndex : 2;
    const recMission = SQUAD_PRESETS.findIndex(s => s.recFor === mi);
    // Round 234 — current equipped totals for the delta baseline (Diablo III pattern).
    const curLoadouts = (g.playerMechs || []).map(m => ({ armor: m.armor, armL: m.weapons && m.weapons.armL, armR: m.weapons && m.weapons.armR }));
    const curTotals = this._squadTotals(curLoadouts.length ? curLoadouts : SQUAD_PRESETS[rec].mechs);
    el.innerHTML = `<div class="overlay-card">
      <h1>⚙ ${t('ui.squad_select')}</h1>
      <p style="font-size:13px;opacity:.85">${t('ui.squad_select_d')}</p>
      <button class="ctl-btn primary" id="deploy-rec" style="display:block;width:100%;margin:4px 0 12px;padding:14px;font-size:17px">▶ ${t('ui.deploy')} — ${SQUAD_PRESETS[rec].name} ★</button>
      ${SQUAD_PRESETS.map((s, i) => `
        <button class="big-btn" data-sq="${i}" style="display:block;width:100%;margin:8px 0;text-align:left${s.recommended ? ';border-color:#ffd75e;box-shadow:0 0 0 1px #ffd75e' : ''}">
          <b>${s.name}</b>${s.recommended ? ' <span style="font-size:11px;color:#ffd75e">★ RECOMMENDED</span>' : ''}${(i === recMission && s.recWhy) ? ' <span style="font-size:11px;color:#7dff8a">◆ FOR M' + (mi + 1) + '</span><br><span style="font-size:10px;color:#7dff8a;opacity:.85">' + s.recWhy + '</span>' : ''}${this._deltaLine(curTotals, this._squadTotals(s.mechs))}<br><span style=\"font-size:12px;opacity:.8\">${s.desc}</span>
        </button>`).join('')}
    </div>`;
    const applyPreset = (i) => {
        const s = SQUAD_PRESETS[i];
        s.mechs.forEach((loadout, i) => {
          const m = g.playerMechs[i]; if (!m) return;
          if (ARMOR[loadout.armor]) {
            m.armor = loadout.armor;
            const a = ARMOR[loadout.armor];
            for (const k of Object.keys(m.limbs)) {
              m.limbs[k].max = Math.round(LIMB_DEFS[k].baseHp * a.hpMul);
              m.limbs[k].hp = Math.min(m.limbs[k].hp, m.limbs[k].max);
            }
          }
          if (WEAPONS[loadout.armL]) m.weapons.armL = loadout.armL;
          if (WEAPONS[loadout.armR]) m.weapons.armR = loadout.armR;
        });
        try { Telemetry.design('jam:squad_select:' + s.id, 1); } catch (e) {}
        this.close();
        // Jam path must advance like the full hangar's deploy button does —
        // without this the player softlocks on the post-mission screen.
        g.nextMission();
    };
    el.querySelectorAll('[data-sq]').forEach(b => {
      b.onclick = () => applyPreset(+b.dataset.sq);
    });
    // Round 174 — one-tap deploy: the dominant button applies the recommended
    // preset and closes immediately.
    const dep = el.querySelector('#deploy-rec');
    if (dep) dep.onclick = () => applyPreset(rec);
    // Round 234 — Enter = deploy (XCOM pattern): keyboard path to the exit,
    // no scrolling, no hunting. Removed when the screen closes.
    const onKey = (e) => {
      if (e.key === 'Enter' && !document.getElementById('hangar-screen').classList.contains('hidden')) {
        e.preventDefault();
        this._unbindDeployKey();
        applyPreset(rec);
      }
    };
    this._unbindDeployKey();
    this._deployKeyHandler = onKey;
    document.addEventListener('keydown', onKey);
  },

  _unbindDeployKey() {
    if (this._deployKeyHandler) {
      document.removeEventListener('keydown', this._deployKeyHandler);
      this._deployKeyHandler = null;
    }
  },

  close() {
    this._unbindDeployKey();
    document.getElementById('hangar-screen').classList.add('hidden');
  },

  // shareable build code (Round 39): MP1-<base64url JSON> — AC6 Share-ID pattern,
  // cross-platform from day one, no backend. Validates every field on import.
  buildCode(mechs) {
    try {
      const arr = mechs.map(m => ({ n: m.name, a: m.armor, l: m.weapons.armL, r: m.weapons.armR }));
      const bytes = new TextEncoder().encode(JSON.stringify(arr));
      let bin = ''; for (const b of bytes) bin += String.fromCharCode(b);
      return 'MP1-' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) { return ''; }
  },
  applyBuildCode(g, code) {
    try {
      if (!code || !code.startsWith('MP1-')) return false;
      const b64 = code.slice(4).replace(/-/g, '+').replace(/_/g, '/');
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const arr = JSON.parse(new TextDecoder().decode(bytes));
      if (!Array.isArray(arr) || !arr.length) return false;
      arr.forEach((s, i) => {
        const m = g.playerMechs[i]; if (!m || !s) return;
        if (s.n && typeof s.n === 'string') m.name = s.n.slice(0, 16);
        if (ARMOR[s.a]) {
          m.armor = s.a;
          const a = ARMOR[s.a];
          for (const k of Object.keys(m.limbs)) {
            m.limbs[k].max = Math.round(LIMB_DEFS[k].baseHp * a.hpMul);
            m.limbs[k].hp = Math.min(m.limbs[k].hp, m.limbs[k].max);
          }
        }
        if (WEAPONS[s.l]) m.weapons.armL = s.l;
        if (WEAPONS[s.r]) m.weapons.armR = s.r;
      });
      return true;
    } catch (e) { return false; }
  },

  render() {
    const g = this.game;
    const el = document.getElementById('hangar-screen');
    const m = g.playerMechs[this.mechIndex];
    const tabs = g.playerMechs.map((p, i) =>
      `<button class="mech-tab ${i === this.mechIndex ? 'active' : ''}" data-i="${i}">${p.name}</button>`).join('');
    // Round 131 — "Valid Only" filter (MW5 pattern): disable weapons that would push
    // total arm heat over maxHeat. Disabled-with-reason, never a modal error.
    const weaponOpts = (cur, otherId) => Object.values(WEAPONS).map(w => {
      const otherHeat = otherId ? (WEAPONS[otherId] ? WEAPONS[otherId].heat : 0) : 0;
      const over = w.id !== cur && (w.heat + otherHeat) > m.maxHeat;
      return `<option value="${w.id}" ${w.id === cur ? 'selected' : ''} ${over ? 'disabled' : ''}>${t(w.nameKey)} — ${w.dmg}dmg/${w.range}rng/${w.heat}🔥${over ? ' (over heat)' : ''}</option>`;
    }).join('');
    // Round 140 — AC6 two-axis pass/fail meter: heat budget (total arm heat / maxHeat).
    // Visual bar, red at threshold — not just disabled options.
    const armHeat = (WEAPONS[m.weapons.armL] ? WEAPONS[m.weapons.armL].heat : 0) +
                    (WEAPONS[m.weapons.armR] ? WEAPONS[m.weapons.armR].heat : 0);
    const heatPct = Math.min(100, Math.round(100 * armHeat / Math.max(1, m.maxHeat)));
    const heatColor = armHeat > m.maxHeat ? '#ff5d5d' : heatPct >= 80 ? '#ffb347' : '#2de2e6';
    const heatMeter = `<div style="margin:8px 0"><div style="font-size:13px">🔥 ${t('ui.heat_budget')}: ${armHeat}/${m.maxHeat}</div>
      <div style="height:10px;background:#1a2333;border-radius:5px;overflow:hidden">
      <div style="width:${heatPct}%;height:100%;background:${heatColor}"></div></div></div>`;
    const armorOpts = Object.values(ARMOR).map(a =>
      `<option value="${a.id}" ${a.id === m.armor ? 'selected' : ''}>${t(a.nameKey)}</option>`).join('');
    const limbChips = Object.keys(LIMB_DEFS).map(k => {
      const L = m.limbs[k];
      return `<span class="limb-chip">${t(LIMB_DEFS[k].nameKey)} <b>${L.hp}/${L.max}</b></span>`;
    }).join('');

    el.innerHTML = `
      <div class="overlay-card">
        <h1>${t('ui.hangar')}</h1>
        <p>${t('ui.hangar_sub', { n: g.missionIndex + 1 })}</p>
        <div class="mech-tabs">${tabs}</div>
        <canvas id="hangar-canvas" width="520" height="300"></canvas>
        <h2>${t('ui.mech_name')}</h2>
        <div class="part-row"><input id="inp-mechname" maxlength="16" value="${m.name.replace(/"/g, '&quot;')}"
          style="flex:1;font-size:16px;padding:8px;border-radius:8px;border:1px solid #2de2e6;background:#0a0e1a;color:#e8f4ff"></div>
        <h2>${t('ui.recipes')}</h2>
        <div class="mech-tabs" style="flex-wrap:wrap">${RECIPES.map(r =>
          `<button class="mech-tab recipe-btn" data-r="${r.id}" title="${t(r.descKey)}">⚙ ${t(r.nameKey)}</button>`).join('')}</div>
        <h2>${t('ui.armor_plating')}</h2>
        <div class="part-row"><span class="pname">${t(ARMOR[m.armor].nameKey)}</span>
          <select id="sel-armor">${armorOpts}</select></div>
        <h2>${t('ui.arm_weapons')}</h2>
        <div class="part-row"><div><div class="pname">${t('ui.left_arm')}</div>
          <div class="pstat">${t(WEAPONS[m.weapons.armL].descKey)}</div></div>
          <select id="sel-armL">${weaponOpts(m.weapons.armL, m.weapons.armR)}</select></div>
        <div class="part-row"><div><div class="pname">${t('ui.right_arm')}</div>
          <div class="pstat">${t(WEAPONS[m.weapons.armR].descKey)}</div></div>
          <select id="sel-armR">${weaponOpts(m.weapons.armR, m.weapons.armL)}</select></div>
        ${heatMeter}
        <h2>${t('ui.limb_integrity')}</h2>
        <div class="limb-hp">${limbChips}</div>
        <button class="big-btn" id="btn-repair">${t('ui.repair_all')}</button>
        <h2>${t('ui.share_build')}</h2>
        <div class="part-row">
          <button class="ctl-btn" id="btn-build-copy" style="flex:1">⤴ ${t('ui.copy_build')}</button>
          <input id="inp-build-code" placeholder="MP1-…" style="flex:2;font-size:13px;padding:8px;border-radius:8px;border:1px solid #2de2e6;background:#0a0e1a;color:#e8f4ff">
          <button class="ctl-btn" id="btn-build-load" style="flex:1">⤵ ${t('ui.load_build')}</button>
        </div>
        <button class="big-btn ghost" id="btn-deploy" style="margin-top:10px">${t('ui.deploy_mission', { n: g.missionIndex + 2 })}</button>
      </div>`;

    // live preview
    const cv = document.getElementById('hangar-canvas');
    const preview = { ...m, facing: 1, heat: 0, shutdown: false };
    const draw = () => {
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      drawMech(ctx, preview, 0, 0, cv.width, cv.height, {});
    };
    draw();

    el.querySelectorAll('.mech-tab').forEach(b => b.onclick = () => {
      this.mechIndex = +b.dataset.i; this.render();
    });
    document.getElementById('sel-armor').onchange = (e) => {
      Telemetry.design('hangar:armor:select:' + e.target.value, 1);
      // armor change re-scales limb HP proportionally
      const oldMax = {}, old = ARMOR[m.armor];
      for (const k of Object.keys(m.limbs)) oldMax[k] = m.limbs[k].max;
      m.armor = e.target.value;
      const a = ARMOR[m.armor];
      for (const k of Object.keys(m.limbs)) {
        const ratio = m.limbs[k].hp / oldMax[k];
        m.limbs[k].max = Math.round(LIMB_DEFS[k].baseHp * a.hpMul);
        m.limbs[k].hp = Math.max(1, Math.round(m.limbs[k].max * ratio));
      }
      preview.armor = m.armor; draw(); this.render();
    };
    document.getElementById('sel-armL').onchange = (e) => { m.weapons.armL = e.target.value; preview.weapons.armL = m.weapons.armL; Telemetry.design('hangar:weapon:select:' + e.target.value, 1); draw(); this.render(); };
    document.getElementById('sel-armR').onchange = (e) => { m.weapons.armR = e.target.value; preview.weapons.armR = m.weapons.armR; Telemetry.design('hangar:weapon:select:' + e.target.value, 1); draw(); this.render(); };
    // mech naming (Round 39 — Front Mission ownership hook)
    document.getElementById('inp-mechname').onchange = (e) => {
      const v = e.target.value.trim().slice(0, 16);
      if (v) { m.name = v; Telemetry.design('hangar:mech:rename', 1); this.render(); }
    };
    // preset recipes (Round 39 — one-tap starter builds)
    el.querySelectorAll('.recipe-btn').forEach(b => b.onclick = () => {
      const r = RECIPES.find(x => x.id === b.dataset.r);
      m.armor = r.loadout.armor; m.weapons.armL = r.loadout.armL; m.weapons.armR = r.loadout.armR;
      // armor change re-scales limb HP (same proportional logic as the armor select)
      const a = ARMOR[m.armor];
      for (const k of Object.keys(m.limbs)) {
        m.limbs[k].max = Math.round(LIMB_DEFS[k].baseHp * a.hpMul);
        m.limbs[k].hp = Math.min(m.limbs[k].hp, m.limbs[k].max);
      }
      Telemetry.design('hangar:recipe:' + r.id, 1);
      try { SFX.select(); } catch (e) {}
      this.render();
    });
    // build share codes (Round 39 — $0 community fuel, AC6 Share-ID pattern, cross-platform)
    document.getElementById('btn-build-copy').onclick = () => {
      const code = Hangar.buildCode(g.playerMechs);
      const done = (ok) => { document.getElementById('btn-build-copy').textContent = ok ? '✓' : '✕'; };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(() => done(true), () => done(false));
        else done(false);
      } catch (e) { done(false); }
      Telemetry.design('hangar:build:copy', 1);
    };
    document.getElementById('btn-build-load').onclick = () => {
      const code = document.getElementById('inp-build-code').value.trim();
      const ok = Hangar.applyBuildCode(g, code);
      document.getElementById('btn-build-load').textContent = ok ? '✓' : '✕';
      if (ok) { Telemetry.design('hangar:build:load', 1); this.render(); }
    };
    document.getElementById('btn-repair').onclick = () => {
      for (const k of Object.keys(m.limbs)) { m.limbs[k].hp = m.limbs[k].max; m.limbs[k].destroyed = false; }
      m.heat = 0; this.render();
    };
    document.getElementById('btn-deploy').onclick = () => {
      this.close();
      g.nextMission();
    };
  },
};
