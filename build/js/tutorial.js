/* Mecha Protocol — FTUE coach marks (Round 29)
 * M1 teaches by doing: move → attack → heat → undo. The veteran toggle
 * skips the coaching layer (same mission, same rewards — Bugnet trap
 * avoided: skip routes through identical progression). M1 training-wheels
 * handicap (enemy dmg halved) lives in game.js resolveAttack. */
'use strict';

const Tutorial = {
  enabled: false,
  step: null,
  firstAttackDone: false,
  undoShown: false,

  // cb: called when the game may proceed (mode 'resume' = suspend-save resume)
  init(cb, resumeLabel) {
    let v = null;
    try { v = localStorage.getItem('mecha-protocol-veteran'); } catch (e) {}
    if (resumeLabel) this.ask(cb, resumeLabel);  // a run exists: always offer resume
    else if (v === null) this.ask(cb);
    else { this.enabled = v !== '1'; cb(); }
  },

  ask(cb, resumeLabel) {
    const el = document.getElementById('welcome-screen');
    el.classList.remove('hidden');
    el.innerHTML = `<div class="overlay-card">
      <h1>${t('tutorial.welcome.t')}</h1>
      <p>${t('tutorial.welcome.d')}</p>
      ${resumeLabel ? `<button class="big-btn" id="btn-w-resume" style="margin-bottom:10px">▶ ${resumeLabel}</button>` : ''}
      <button class="big-btn" id="btn-w-new">${t('tutorial.welcome.new')}</button>
      <button class="big-btn ghost" id="btn-w-vet" style="margin-top:10px">${t('tutorial.welcome.vet')}</button>
      <div id="save-wipe-nudge" style="margin-top:14px;padding:10px;background:rgba(255,200,60,.08);border:1px solid rgba(255,200,60,.3);border-radius:6px;font-size:12px;line-height:1.5">
        <div style="margin-bottom:8px">⚠️ ${t('ui.save_wipe_warn')}</div>
        <button class="ctl-btn" id="btn-w-export">⤴ ${t('ui.save_wipe_export')}</button>
      </div>
      <label style="display:flex;gap:8px;align-items:flex-start;margin-top:14px;font-size:13px;opacity:.85;cursor:pointer">
        <input type="checkbox" id="consent-analytics" checked style="margin-top:2px">
        <span>${t('ui.analytics_consent')}</span>
      </label>
    </div>`;
    // Round 163 — 7-day wipe nudge: iOS Safari may delete localStorage after 7 days
    // away. Front-and-center export on the welcome screen = the jam save safety net.
    const btnExp = document.getElementById('btn-w-export');
    if (btnExp) btnExp.onclick = (e) => {
      e.stopPropagation();
      let ok = false;
      try { ok = SaveStore.export(); } catch (e2) {}
      try { Telemetry.saveEvent('export:welcome'); } catch (e2) {}
      btnExp.textContent = ok ? '✓' : '✕';
    };
    const done = (veteran) => {
      try { localStorage.setItem('mecha-protocol-veteran', veteran ? '1' : '0'); } catch (e) {}
      try { if (window.Game && Game.saveData) Game.saveData.settings.veteran = !!veteran; } catch (e) {}
      try { const c = document.getElementById('consent-analytics'); const v2 = c ? c.checked : true;
            localStorage.setItem('mecha-protocol-analytics', v2 ? '1' : '0');
            if (window.Game && Game.saveData) { Game.saveData.settings.analyticsConsent = v2; Game.persistProgress(); }
            try { if (window.Telemetry && typeof Telemetry.setConsent === 'function') Telemetry.setConsent(v2); } catch (e2) {}
          } catch (e) {}
      this.enabled = !veteran;
      this._t0 = Date.now(); this._tFirst = false;  // FTUE funnel start (Round 38)
      try { Telemetry.design('tutorial:choice:' + (veteran ? 'veteran' : 'new'), 1); } catch (e) {}
      // Round 157 — tutorial funnel (GameDesign.gg): tutorial_start for the funnel
      // (start → step_complete → tutorial_exit). Step events already exist per id.
      try { Telemetry.design('tutorial:start', 1); } catch (e) {}
      try { SFX.select(); } catch (e) {}
      el.classList.add('hidden');
      cb();
    };
    document.getElementById('btn-w-new').onclick = () => done(false);
    document.getElementById('btn-w-vet').onclick = () => done(true);
    const br = document.getElementById('btn-w-resume');
    if (br) br.onclick = () => {
      try { SFX.select(); } catch (e) {}
      el.classList.add('hidden');
      cb('resume');
    };
  },

  startMission(i) {
    this.step = null; this.firstAttackDone = false; this.undoShown = false;
    const cm = document.getElementById('coach-mark');
    if (cm) cm.classList.add('hidden');
    Game.coachTarget = null;
  },

  maybeStart() {
    if (this.enabled && Game.missionIndex === 0 && Game.turn === 1 && !this.step) {
      const m = Game.playerMechs.find(mechAlive);
      this.show('move', m);
      // Round 166 — scripted first turn (ItB intro): pre-select the mech so the
      // player sees the move range immediately. One less tap to the first action.
      try { if (m && Game.select) Game.select(m); } catch (e) {}
    }
  },

  show(id, target, silent) {
    // Round 89: tips auto-stop when dismissed 2+ times (Sesame Street rule — don't answer unasked questions)
    try {
      const dismissals = JSON.parse(localStorage.getItem('mecha-protocol-tip-dismissals') || '{}');
      if ((dismissals[id] || 0) >= 2) return;  // player said "got it" twice — stay silent
    } catch (e) {}
    this.step = id;
    this._target = target || null;
    if (this._suspended) return;  // overlay/forecast open — stay hidden until resume()
    Game.coachTarget = target ? { x: target.x, y: target.y } : null;
    const el = document.getElementById('coach-mark');
    el.classList.remove('hidden');
    el.innerHTML = `<div><b>🎓 ${t('tutorial.' + id + '.t')}</b><br>${t('tutorial.' + id + '.d')}</div>
      <button class="ctl-btn" id="coach-ok" style="margin-top:8px">${t('tutorial.gotit')}</button>
      <button class="ctl-btn ghost" id="coach-skip" style="margin-top:8px;margin-left:8px">Skip tutorial</button>`;
    document.getElementById('coach-skip').onclick = () => { this.skip(); };
    document.getElementById('coach-ok').onclick = () => {
      try {
        Telemetry.design('tutorial:step:dismiss:' + id, 1);
        // Round 89: count dismissals for the 2-strike shut-off
        const d = JSON.parse(localStorage.getItem('mecha-protocol-tip-dismissals') || '{}');
        d[id] = (d[id] || 0) + 1;
        localStorage.setItem('mecha-protocol-tip-dismissals', JSON.stringify(d));
      } catch (e) {}
      this.complete(id);
    };
    if (!silent) { try { Telemetry.design('tutorial:step:show:' + id, 1); } catch (e) {} }
    // Round 211 — 5-second context hint (Hollow Knight): if the player stalls at a
    // skill gate, escalate the coach target pulse. Otherwise stay silent.
    try {
      if (this._stallT) clearTimeout(this._stallT);
      this._stallT = setTimeout(() => {
        if (this.step === id && Game.coachTarget) {
          Game.coachTarget.urgent = true;  // renderer pulses harder
          try { Telemetry.design('tutorial:step:stall:' + id, 1); } catch (e2) {}
          Game.unitsDirty = true;
        }
      }, 5000);
    } catch (e) {}
    Game.unitsDirty = true;
  },

  complete(id) {
    if (this.step !== id) return;
    try { if (this._stallT) { clearTimeout(this._stallT); this._stallT = null; } } catch (e) {}
    this.step = null;
    Game.coachTarget = null;
    document.getElementById('coach-mark').classList.add('hidden');
    try { Telemetry.design('tutorial:step:done:' + id, 1); } catch (e) {}
    Game.unitsDirty = true;
  },

  // Round 193 — atomic skip (Bugnet: route skip through same finalization).
  // Sets FULL completed state in one pass; never half-sets; never re-triggers.
  skip() {
    this.step = null;
    this.firstAttackDone = true;
    this.undoShown = true;
    this.enabled = false;
    Game.coachTarget = null;
    const cm = document.getElementById('coach-mark');
    if (cm) cm.classList.add('hidden');
    try { Telemetry.design('tutorial:skipped', 1); } catch (e) {}
    try { Game.save(); } catch (e) {}
    Game.unitsDirty = true;
  },

  // first-interactive-action timing (Round 38): seconds from session start to the
  // player's first move/attack — the devtodev "aha moment" leading indicator
  markFirstAction(kind) {
    if (!this._t0 || this._tFirst) return;
    this._tFirst = true;
    const secs = Math.round((Date.now() - this._t0) / 1000);
    try { Telemetry.design('ftue:time_to_first_action', secs); } catch (e) {}
    try { Telemetry.design('ftue:first_action:' + kind, 1); } catch (e) {}
  },

  onMove() {
    if (!this.enabled || Game.missionIndex !== 0) return;
    if (this.step === 'move') {
      this.complete('move');
      this.show('attack', Game.nearestEnemyToPlayer());
    }
  },

  onAttack() {
    if (!this.enabled || Game.missionIndex !== 0) return;
    if (!this.firstAttackDone) {
      this.firstAttackDone = true;
      if (this.step === 'attack') this.complete('attack');
      this.show('heat');
    }
  },

  onTurn(n) {
    if (this.enabled && Game.missionIndex === 0 && n === 2 && !this.undoShown) {
      this.undoShown = true;
      this.show('undo');
    }
  },

  // A full-screen overlay (help/hangar/briefing/gameover, z-index 10) must
  // never fight the coach mark (z-index 60) for taps — suspend while open.
  suspend() {
    if (this._suspended) return;
    this._suspended = true;
    document.getElementById('coach-mark').classList.add('hidden');
    try { Game.coachTarget = null; Game.unitsDirty = true; } catch (e) {}
  },

  resume() {
    if (!this._suspended) return;
    this._suspended = false;
    if (this.step) this.show(this.step, this._target, true);
  },

  watchOverlays() {
    const screens = ['help-screen', 'hangar-screen', 'briefing-screen', 'gameover-screen']
      .map((id) => document.getElementById(id)).filter(Boolean);
    const check = () => {
      const anyOpen = screens.some((el) => !el.classList.contains('hidden'));
      if (anyOpen) this.suspend(); else this.resume();
    };
    const obs = new MutationObserver(check);
    screens.forEach((el) => obs.observe(el, { attributes: true, attributeFilter: ['class'] }));
    check();
  },
};
