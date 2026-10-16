/* Mecha Protocol — turn engine, combat, input, rendering, mission flow */
'use strict';

const Game = {
  grid:null, playerMechs:[], enemyMechs:[],
  turn:1, phase:'briefing', missionIndex:0,
  selected:null, moveInfo:null, attackTargets:[],
  forecast:null, undoSnapshot:null, undoUsed:false,
  particles:[], floaters:[], projectiles:[],
  animating:false, enemyQueue:[], enemyTimer:0,
  intents:[], shake:0,
  hitStop:0, slowmo:0, time:0, banner:null, flashes:[], trauma:0, _hsBudget:[],  // Round 205 — hit-stop/sec timestamps
  // Round 154 — jam difficulty (LD60: raters play once, briefly; a wipe in M1 kills Fun votes).
  // JAM_BUILD defaults to 'easy' (Story); harder modes one tap away on the briefing screen.
  // Hades/Celeste rule: the easy path gates nothing and costs nothing.
  reducedEffects:false, difficulty:((typeof JAM_BUILD !== 'undefined' && JAM_BUILD) ? 'easy' : 'normal'), animSpeed:1, runBuffs:null, battleMusicOn:false, coachTarget:null,
  renderScale:2, particleCap:300, hiddenPause:false,
  view:{ tile:40, ox:0, oy:0 },
  taunts:['taunt.0', 'taunt.1', 'taunt.2', 'taunt.3'],

  /* ---------- helpers ---------- */
  spd(ms) { return Math.max(16, Math.round(ms / this.animSpeed)); },  // animation-speed scaling

  /* ---------- i18n ---------- */
  refreshLanguage() {
    document.getElementById('btn-undo').innerHTML = '↩ ' + t('ui.undo');
    document.getElementById('btn-end').textContent = t('ui.end_turn');
    const fx = document.getElementById('btn-fx');
    if (fx) fx.title = t('ui.reduce_effects');
    const lang = document.getElementById('btn-lang');
    if (lang) lang.title = t('ui.language');
    const spd = document.getElementById('btn-speed');
    if (spd) spd.title = t('ui.speed');
    const help = document.getElementById('btn-help');
    if (help) help.title = t('ui.help');
    // re-render whichever overlay is visible (gameover/victory re-render on next show)
    const br = document.getElementById('briefing-screen');
    if (br && !br.classList.contains('hidden')) this.showBriefing(this.missionIndex);
    const hg = document.getElementById('hangar-screen');
    if (hg && !hg.classList.contains('hidden')) Hangar.render();
  },

  /* ---------- help glossary (Round 24 — Kriegsfront's #1 complaint was "didn't understand") ---------- */
  showHelp() {
    const el = document.getElementById('help-screen');
    el.classList.remove('hidden');
    const items = ['heat', 'limbs', 'cover', 'intent', 'forecast', 'undo'].map(k =>
      `<div class="help-item"><h3>${t('help.' + k + '.t')}</h3><p>${t('help.' + k + '.d')}</p></div>`).join('');
    el.innerHTML = `<div class="overlay-card"><h1>${t('ui.help')}</h1>${items}
      <div class="help-item"><h3>${t('help.prototype.t')}</h3><p>${t('help.prototype.d')}</p></div>
      <div class="help-item"><h3>🛟 ${t('ui.pilot_assists')}</h3><p>${t('ui.assists_sub')}</p>
        <div id="assist-toggles" style="display:flex;flex-direction:column;gap:8px;margin-top:8px"></div></div>
      <div class="help-item"><h3>🔊 ${t('ui.audio')}</h3>
        <div id="audio-toggles" style="display:flex;gap:8px;margin-top:8px"></div></div>
      <div class="help-item"><h3>💬 ${t('ui.barks')}</h3>
        <div id="bark-verbosity" style="display:flex;gap:8px;margin-top:8px"></div></div>
      <div class="help-item"><h3>📊 ${t('ui.analytics')}</h3>
        <div id="analytics-toggle" style="display:flex;gap:8px;margin-top:8px"></div></div>
      <div class="help-item"><h3>💾 ${t('help.save.t')}</h3><p>${t('help.save.d')}</p>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="ctl-btn" id="btn-save-export" style="flex:1">⤴ ${t('ui.export_save')}</button>
          <button class="ctl-btn" id="btn-save-import" style="flex:1">⤵ ${t('ui.import_save')}</button>
          <input type="file" id="file-save-import" accept=".json,application/json" style="display:none">
        </div></div>
      <div class="help-item"><h3>📲 ${t('help.install.t')}</h3><p>${t('help.install.d')}</p></div>
      <button class="big-btn" id="btn-help-close">${t('ui.close')}</button></div>`;
    document.getElementById('btn-help-close').onclick = () => el.classList.add('hidden');
    // pilot assist toggles (Round 52)
    const atg = document.getElementById('assist-toggles');
    if (atg) {
      const renderAssists = () => {
        atg.innerHTML = Object.values(ASSISTS).map(a => {
          const on = this.hasAssist(a.id);
          return `<button class="ctl-btn" data-a="${a.id}" style="text-align:left;${on ? 'border-color:#7dff8a;color:#7dff8a' : ''}">${on ? '✓ ' : '○ '}${t(a.nameKey)}<br><span style="font-size:12px;opacity:.75">${t(a.descKey)}</span></button>`;
        }).join('');
        atg.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { this.toggleAssist(b.dataset.a); renderAssists(); });
      };
      renderAssists();
    }
    // audio mutes (Round 55)
    const atg2 = document.getElementById('audio-toggles');
    if (atg2) {
      const renderAudio = () => {
        const s = (this.saveData.settings || {});
        atg2.innerHTML = ['sfx', 'music'].map(k => {
          const muted = k === 'sfx' ? s.sfxMuted : s.musicMuted;
          return `<button class="ctl-btn" data-m="${k}" style="flex:1;${muted ? 'border-color:#ff5d5d;color:#ff5d5d' : ''}">${muted ? '🔇' : '🔊'} ${t('ui.' + k)}<br><span style="font-size:12px;opacity:.75">${t(muted ? 'ui.muted' : 'ui.unmuted')}</span></button>`;
        }).join('');
        atg2.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { this.toggleAudio(b.dataset.m); renderAudio(); });
      };
      renderAudio();
    }
    // bark verbosity (Round 90 — cognitive load control: Off/Reduced/Full)
    const atgBark = document.getElementById('bark-verbosity');
    if (atgBark) {
      const renderBark = () => {
        const v = (this.saveData.settings || {}).barkVerbosity || 'full';
        const opts = [['off', '🔇'], ['reduced', '🔉'], ['full', '🔊']];
        atgBark.innerHTML = opts.map(([k, icon]) =>
          `<button class="ctl-btn" data-b="${k}" style="flex:1;${v === k ? 'border-color:#7dff8a;color:#7dff8a' : ''}">${icon} ${t('ui.bark_' + k)}</button>`
        ).join('');
        atgBark.querySelectorAll('[data-b]').forEach(b => b.onclick = () => {
          this.saveData.settings.barkVerbosity = b.dataset.b;
          try { Telemetry.design('settings:bark_verbosity:' + b.dataset.b, 1); } catch (e) {}
          try { this.persistProgress(false); } catch (e) {}
          renderBark();
        });
      };
      renderBark();
    }
    // analytics consent toggle (Round 62)
    const atg3 = document.getElementById('analytics-toggle');
    if (atg3) {
      const renderConsent = () => {
        const on = (this.saveData.settings || {}).analyticsConsent !== false;
        atg3.innerHTML = `<button class="ctl-btn" style="flex:1;${on ? 'border-color:#7dff8a;color:#7dff8a' : ''}">${on ? '📊 ✓' : '📊 ○'} ${t('ui.analytics')}<br><span style="font-size:12px;opacity:.75">${t(on ? 'ui.analytics_on' : 'ui.analytics_off')}</span></button>`;
        atg3.querySelector('button').onclick = () => {
          const s = this.saveData.settings; s.analyticsConsent = !on;
          try { if (window.Telemetry) Telemetry.setConsent(s.analyticsConsent); } catch (e) {}
          this.persistProgress(false); renderConsent();
        };
      };
      renderConsent();
    }
    document.getElementById('btn-save-export').onclick = () => {
      const ok = SaveStore.export();
      try { Telemetry.saveEvent('export'); } catch (e) {}
      document.getElementById('btn-save-export').textContent = ok ? '✓' : '✕';
    };
    document.getElementById('btn-save-import').onclick = () =>
      document.getElementById('file-save-import').click();
    document.getElementById('file-save-import').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        const res = SaveStore.importJson(String(r.result || ''));
        try { Telemetry.saveEvent('import:' + res); } catch (err) {}
        if (res === 'ok') location.reload();  // boot applies the imported save
        else document.getElementById('btn-save-import').textContent = '✕ ' + res;
      };
      r.readAsText(f);
    };
    try { SFX.select(); } catch (e) {}
  },

  /* ---------- setup ---------- */
  init() {
    this.cvT = document.getElementById('terrain-layer');
    this.cvU = document.getElementById('unit-layer');
    this.cvF = document.getElementById('fx-layer');
    // terrain layer is fully painted opaque every draw → alpha:false compositing win (Round 30)
    this.ctxT = this.cvT.getContext('2d', { alpha: false });
    this.ctxU = this.cvU.getContext('2d');
    this.ctxF = this.cvF.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    // Round 206 — visualViewport fires on iOS address-bar show/hide (window resize doesn't always).
    if (window.visualViewport) window.visualViewport.addEventListener('resize', () => this.resize());
    // Round 260 — visualViewport 'scroll' (Chrome guidance): URL-bar show/hide
    // changes the viewport OFFSET (offsetTop) without a resize on some iOS
    // versions. Debounced: resize() is idempotent (recomputes from vv dims).
    if (window.visualViewport) window.visualViewport.addEventListener('scroll', () => this.resize());
    this.cvU.addEventListener('pointerdown', (e) => this.onTap(e));
    // Round 170 — pointercancel (MDN): a browser-taken-over gesture (scroll/edge
    // swipe mid-tap) must never leave selection state dangling. onTap is atomic,
    // so this is purely defensive — deselect to a clean state.
    this.cvU.addEventListener('pointercancel', () => { try { this.deselect(); } catch (e) {} });
    // iOS Safari audio unlock (Round 54): AudioContext must resume inside a user gesture,
    // or iOS keeps it suspended and the game is silent. Document-level, every tap (cheap).
    document.addEventListener('pointerdown', () => { try { SFX.ensure(); } catch (e) {} }, { passive: true });
    document.getElementById('btn-end').onclick = () => this.confirmEndTurn();
    document.getElementById('btn-undo').onclick = () => { if (this._acceptGate()) this.doUndo(); };
    try {
      const fxSet = localStorage.getItem('mecha-protocol-fx');
      this.reducedEffects = fxSet === '1';
      // Round 214 — shake intensity (GameDesign.gg: ship intensity toggles).
      // 0=off, 1=reduced (30%), 2=full. Migrates from binary reducedEffects.
      const shSet = localStorage.getItem('mecha-protocol-shake');
      this.shakeIntensity = shSet !== null ? parseInt(shSet, 10) : (this.reducedEffects ? 0 : 2);
      // accessibility = free perf tier (Round 30): respect the OS motion setting unless the player chose
      if (fxSet === null && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        this.reducedEffects = true;
    } catch (e) {}
    // JAM_BUILD (Round 154): fresh installs default to 'easy' for jam raters;
    // a saved choice always wins over the default.
    try {
      const saved = localStorage.getItem('mecha-protocol-diff');
      this.difficulty = saved || ((typeof JAM_BUILD !== 'undefined' && JAM_BUILD) ? 'easy' : 'normal');
    } catch (e) { this.difficulty = (typeof JAM_BUILD !== 'undefined' && JAM_BUILD) ? 'easy' : 'normal'; }
    // i18n (Round 23): detect → ?lang= → saved → navigator → en; re-render on switch
    I18N.onChange = () => { this.refreshLanguage(); try { this.persistProgress(false); } catch (e) {} };
    // pseudo-localization (Round 57): ?pseudo=1 — truncation/overflow testing for translators
    try { I18N.pseudo = new URLSearchParams(location.search).get('pseudo') === '1'; } catch (e) {}
    I18N.setLocale(I18N.detect());
    document.getElementById('btn-lang').onclick = () => { try { SFX.select(); } catch (e) {} I18N.cycle(); };
    // text-size setting (Round 41 — WCAG 1.4.4 / XAG 101: 100/125/150/200%)
    this.textScale = [1, 1.25, 1.5, 2].includes(parseFloat(localStorage.getItem('mecha-protocol-textscale'))) ?
      parseFloat(localStorage.getItem('mecha-protocol-textscale')) : 1;
    this.applyTextScale();
    // Round 224 — volume slider + mute (judge-proofing; persisted)
    try {
      SFX.loadVol();
      const slider = document.getElementById('vol-slider');
      const muteBtn = document.getElementById('btn-mute');
      const syncUI = () => {
        slider.value = Math.round(SFX._vol * 100);
        muteBtn.textContent = SFX._muted ? '🔇' : '🔊';
      };
      slider.oninput = () => { SFX.ensure(); SFX.setVol(slider.value / 100); if (SFX._muted && slider.value > 0) SFX.setMuted(false); syncUI(); };
      muteBtn.onclick = () => { SFX.ensure(); SFX.setMuted(!SFX._muted); syncUI(); };
      syncUI();
    } catch (e) {}
    document.getElementById('btn-text').onclick = () => {
      const steps = [1, 1.25, 1.5, 2];
      this.textScale = steps[(steps.indexOf(this.textScale) + 1) % steps.length];
      try { localStorage.setItem('mecha-protocol-textscale', String(this.textScale)); } catch (e) {}
      try { this.persistProgress(false); } catch (e) {}
      this.applyTextScale();
      try { SFX.select(); } catch (e) {}
      try { Telemetry.design('ui:textscale:' + Math.round(this.textScale * 100), 1); } catch (e) {}
    };
    // animation speed toggle (Round 24 — "gameplay feels slow" is the #1 tactics complaint)
    document.getElementById('btn-speed').onclick = () => {
      this.animSpeed = this.animSpeed === 1 ? 2.5 : 1;
      document.getElementById('btn-speed').classList.toggle('active', this.animSpeed !== 1);
      try { SFX.select(); } catch (e) {}
    };
    document.getElementById('btn-help').onclick = () => this.showHelp();
    // music engine (Round 27): states model; file tracks load when dropped into audio/
    // (jam: JAM_BUILD = procedural synth path — no file fetches, no 404s)
    try {
      Music.init();
      if (typeof JAM_BUILD === 'undefined' || !JAM_BUILD) {
        Music.load('hangar', 'audio/hangar');
        Music.load('battle', 'audio/battle');
      }
    } catch (e) {}
    Telemetry.init();
    try { this.prewarmPool(); } catch (e) {}  // Round 199 — no first-burst hitch
    try { Telemetry.trackRetention(); } catch (e) {}  // day-streak, works without GA keys
    Telemetry.setDifficulty(this.difficulty);
    // install detection (Round 33): standalone = home-screen/PWA install; prompt = Android
    try {
      const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
      if (standalone) Telemetry.design('install:standalone', 1);
    } catch (e) {}
    window.addEventListener('beforeinstallprompt', () => { try { Telemetry.design('install:prompt_shown', 1); } catch (e) {} });
    window.addEventListener('pagehide', () => Telemetry.shutdown());
    window.addEventListener('error', (e) => Telemetry.errorEvent(e.message || 'unknown'));
    // iOS Add-to-Home-Screen hint (Round 19): only when iOS + not standalone + not dismissed
    try {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
      const dismissed = localStorage.getItem('mecha-protocol-a2hs') === '1';
      if (isIOS && !isStandalone && !dismissed) {
        const bar = document.createElement('div');
        bar.id = 'a2hs-hint';
        bar.innerHTML = '<span>' + t('ui.a2hs') + '</span><button id="a2hs-x" aria-label="Dismiss">✕</button>';
        document.body.appendChild(bar);
        document.getElementById('a2hs-x').onclick = () => {
          try { localStorage.setItem('mecha-protocol-a2hs', '1'); } catch (e) {}
          bar.remove();
        };
      }
    } catch (e) {}
    document.getElementById('btn-fx').onclick = () => {
      // Round 214 — cycle shake intensity: full → reduced → off
      this.shakeIntensity = (this.shakeIntensity + 2) % 3;  // 2→1→0→2
      this.reducedEffects = this.shakeIntensity === 0;
      try {
        localStorage.setItem('mecha-protocol-shake', String(this.shakeIntensity));
        localStorage.setItem('mecha-protocol-fx', this.reducedEffects ? '1' : '0');
      } catch (e) {}
      this.updateFxBtn();
      try { this.persistProgress(false); } catch (e) {}
    };
    this.updateFxBtn();
    // perf instrumentation + visibility pause (Round 30)
    try { Perf.init(); } catch (e) {}
    try { Tutorial.watchOverlays(); } catch (e) {}
    document.addEventListener('visibilitychange', () => {
      this.hiddenPause = document.hidden;
      if (!document.hidden) { this.lastT = 0; requestAnimationFrame((t) => this.loop(t)); }
    });
    // save system (Round 32): versioned schema, atomic writes, checksums — never blocks boot
    try { SaveStore.persist(); } catch (e) {}
    try { SaveStore.probeStorage(); } catch (e) {}  // Round 182: detect silent iframe discard
    try { SaveStore.requestPersist(); } catch (e) {}  // Round 200: ask browser not to evict
    this.saveData = SaveStore.read();
    // Round 286 — M86Berg (Flukz): the mid-write recovery flag must be USER-VISIBLE.
    // A notice that says only "save recovered" is a near-miss of the silent-reset
    // anti-pattern. State what was detected, what was done, what was lost.
    if (SaveStore._recoveredMidWrite) {
      // Round 295 — Meta: the notice must show WHEN the backup was saved so the
      // player can judge. Append the backup's savedAt (ISO → locale date/time).
      let recText = t('ui.save_recovered');
      try {
        const sa = this.saveData && this.saveData.savedAt;
        if (sa) recText += ' (Backup: ' + new Date(sa).toLocaleString() + ')';
      } catch (e2) {}
      try { this.banner = { text: recText, color: '#ffb84d', t: 6 }; } catch (e) {}
      try { Telemetry.design('save:recovered_midwrite', 1); } catch (e) {}
    }
    // Round 304 — the five risk states: corrupt-LIVE fallback + save refusal
    // both need player-visible notices (console cert: silent failure = audit fail).
    if (SaveStore._recoveredCorrupt) {
      let cText = t('ui.save_corrupt');
      try {
        const sa = this.saveData && this.saveData.savedAt;
        if (sa) cText += ' (Backup: ' + new Date(sa).toLocaleString() + ')';
      } catch (e2) {}
      try { this.banner = { text: cText, color: '#ffb84d', t: 6 }; } catch (e) {}
      try { Telemetry.design('save:recovered_corrupt', 1); } catch (e) {}
      SaveStore._recoveredCorrupt = false;  // one-shot
    }
    this.syncSettingsKeys();
    this.savedLoadouts = (this.saveData.hangar.lances && this.saveData.hangar.lances.length) ? this.saveData.hangar.lances : null;
    this.saveData.meta.lastPlayed = new Date().toISOString();
    // lifecycle autosave — mobile browsers kill background tabs (Round 32)
    const autoSave = () => { try { this.persistProgress(false); } catch (e) {} };
    document.addEventListener('visibilitychange', () => { if (document.hidden) autoSave(); });
    window.addEventListener('pagehide', autoSave);
    // Round 152 — bfcache restore resync (web.dev): pageshow + persisted means the page
    // came back from back/forward cache. Timers were paused; Date.now() jumped.
    // Resync animation clocks so banners/pulses don't glitch, and re-render.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.lastT = 0;
        this._lastInputT = Date.now();
        this.unitsDirty = true; this.terrainDirty = true;
        // Round 215 — re-check AudioContext on bfcache restore (iOS may suspend).
        // SFX.ensure() resumes if suspended/interrupted.
        try { if (typeof SFX !== 'undefined' && SFX.ensure) SFX.ensure(); } catch (e3) {}
        try { Telemetry.design('mobile:bfcache_restore', 1); } catch (e2) {}
      }
    });
    // Round 215 — same guard on visibilitychange (tab backgrounded → foregrounded).
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        try { if (typeof SFX !== 'undefined' && SFX.ensure) SFX.ensure(); } catch (e) {}
      }
    });
    // FTUE (Round 29): veteran ask on first boot, then briefing (or resume)
    const run = this.saveData.run;
    const resumeLabel = run ? t('ui.resume_mission', { n: run.missionIndex + 1 }) : null;
    Tutorial.init((mode) => {
      if (mode === 'resume' && this.saveData.run) {
        try { Telemetry.saveEvent('resume'); } catch (e) {}
        this.resumeRun(this.saveData.run);
      } else {
        if (this.saveData.run) {
          try { Telemetry.saveEvent('abandon'); } catch (e) {}
          this.saveData.run = null; this.persistProgress(false);
        }  // abandoned run
        this.showBriefing(0);
      }
    }, resumeLabel);
    requestAnimationFrame((t) => this.loop(t));
  },

  // one-way sync: canonical blob settings -> the scattered keys their owners read
  // audio mutes (Round 55 — AGI "Multiple Volume Controls"): separate SFX / Music
  toggleAudio(which) {
    try {
      const key = which === 'music' ? 'musicMuted' : 'sfxMuted';
      const s = this.saveData.settings;
      s[key] = !s[key];
      this.persistProgress(false);
      try { if (window.Music) Music.setMuted(which, s[key]); } catch (e) {}
      try { Telemetry.design('audio:' + which + ':' + (s[key] ? 'muted' : 'unmuted'), 1); } catch (e) {}
      return !!s[key];
    } catch (e) { return false; }
  },
  // data devlog helper (Round 56 — StS model): aggregate local stats for devlog posts.
  // Run `Game.devlogStats()` in console, screenshot the table for the devlog.
  devlogStats() {
    const s = this.saveData.stats || {};
    const total = (s.missionsWon || 0) + (s.missionsLost || 0);
    let streak = 0;
    try { streak = parseInt(localStorage.getItem('mecha-protocol-streak') || '0', 10) || 0; } catch (e) {}
    const out = {
      missionsWon: s.missionsWon || 0,
      missionsLost: s.missionsLost || 0,
      winRate: total ? Math.round(100 * s.missionsWon / total) + '%' : 'n/a',
      turnsPlayed: s.turnsPlayed || 0,
      deploys: s.deploys || 0,
      assistsOn: Object.keys((this.saveData.settings || {}).assists || {}),
      dayStreak: streak,
    };
    try { console.table(out); } catch (e) {}
    return out;
  },
  // pilot assists (Round 52 — Celeste model): granular, anytime, no punishment
  hasAssist(id) {    try { return !!(this.saveData.settings.assists || {})[id]; } catch (e) { return false; }
  },
  toggleAssist(id) {
    try {
      const a = this.saveData.settings.assists || (this.saveData.settings.assists = {});
      a[id] = !a[id];
      if (!a[id]) delete a[id];
      this.persistProgress(false);
      try { Telemetry.design('assist:' + id + ':' + (a[id] ? 'on' : 'off'), 1); } catch (e) {}
      return !!a[id];
    } catch (e) { return false; }
  },
  syncSettingsKeys() {
    const s = (this.saveData && this.saveData.settings) || {};
    if (!s.assists) s.assists = {};  // pilot assists (Round 52)  // pilot assists (Round 52)
    const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
    if (s.lang) set('mecha-protocol-lang', s.lang);
    if (s.difficulty) set('mecha-protocol-diff', s.difficulty);
    set('mecha-protocol-fx', s.reducedEffects ? '1' : '0');
    set('mecha-protocol-perf', s.perfHud ? '1' : '0');
    if (s.veteran !== null && s.veteran !== undefined) set('mecha-protocol-veteran', s.veteran ? '1' : '0');
  },

  persistProgress(indicate) {
    const d = this.saveData;
    d.settings = {
      lang: (window.I18N && I18N.locale) || 'en',
      difficulty: this.difficulty || 'normal',
      reducedEffects: !!this.reducedEffects,
      perfHud: !!(window.Perf && Perf.on),
      veteran: d.settings.veteran,
      assists: d.settings.assists || {},
      sfxMuted: !!d.settings.sfxMuted,
      musicMuted: !!d.settings.musicMuted,
      analyticsConsent: d.settings.analyticsConsent !== false,
    };
    d.meta.lastPlayed = new Date().toISOString();
    const ok = SaveStore.write(d);
    if (ok && indicate) this.flashSaved();
    // Round 304 — save refusal (oversize/quota): player-visible notice, not silent.
    // The console-cert rule: every state where progress is at risk needs a notice.
    if (!ok && SaveStore._saveRefused) {
      try { this.banner = { text: t('ui.save_refused'), color: '#ff6b6b', t: 6 }; } catch (e) {}
      try { Telemetry.design('save:refused:' + SaveStore._saveRefused, 1); } catch (e2) {}
      SaveStore._saveRefused = null;  // one-shot
    }
    return ok;
  },

  flashSaved() {
    const el = document.getElementById('save-ind');
    if (!el) return;
    el.textContent = t('ui.saved');
    el.classList.add('show');
    clearTimeout(this._saveIndT);
    this._saveIndT = setTimeout(() => el.classList.remove('show'), 1200);
  },

  // Round 221 — screen-reader announcements (GoYomi: aria-live polite).
  // DOM-layer only; never touches frozen sim/juice/tutorial systems.
  announce(msg) {
    try {
      const el = document.getElementById('sr-announce');
      if (el) { el.textContent = ''; requestAnimationFrame(() => { el.textContent = msg; }); }
    } catch (e) {}
  },
  updateFxBtn() {
    // Round 214 — 3-state shake indicator: ✦ full, ◐ reduced, ✧ off
    const b = document.getElementById('btn-fx');
    if (b) {
      const s = this.shakeIntensity;
      b.textContent = s === 2 ? '✦' : (s === 1 ? '◐' : '✧');
      b.title = t('ui.reduce_effects') + ' (' + ['off','reduced','full'][s] + ')';
    }
  },

  resize() {
    // Round 206 — visualViewport (Abratabia): iOS Safari address bar show/hide
    // changes innerHeight; visualViewport tracks the real visible area.
    const vv = window.visualViewport;
    const w = vv ? vv.width : window.innerWidth, h = vv ? vv.height : window.innerHeight;
    const dpr = Math.min(this.renderScale || 2, window.devicePixelRatio || 1);
    // Round 142 — battery saver (Feral pattern): reducedEffects drops render scale to 1×.
    // Thermal budget: sustained 60fps for 10-min missions, not just the first minute.
    let effScale = this.reducedEffects ? 1 : dpr;
    // Round 296 — iOS memory ceiling (GameMaker, Aug 2026): canvas elements capped
    // at 5 MP on iPhone. Cap the backing store at 4.5 MP (10% margin). At 2x on
    // iPhone 17 landscape this would be 12.05 MP — over-limit from boot. DPR policy
    // is a memory decision, not just a perf one.
    const mp = (w * effScale * h * effScale) / 1e6;
    if (mp > 4.5) effScale *= Math.sqrt(4.5 / mp);
    for (const cv of [this.cvT, this.cvU, this.cvF]) {
      cv.width = w * effScale; cv.height = h * effScale;
      cv.getContext('2d').setTransform(effScale, 0, 0, effScale, 0, 0);
    }
    this.W = w; this.H = h;
    if (this.grid) this.layout();
    // cache the backdrop gradient once per resize (Round 30 — no per-frame gradients)
    this.bgGrad = this.ctxT.createLinearGradient(0, 0, 0, h);
    this.bgGrad.addColorStop(0, '#0a0e1a'); this.bgGrad.addColorStop(1, '#101a30');
    this.terrainDirty = true; this.unitsDirty = true;
  },

  layout() {
    const hudTop = 60, hudBottom = 150;
    const tile = Math.floor(Math.min((this.W - 16) / this.grid.w, (this.H - hudTop - hudBottom) / this.grid.h));
    this.view.tile = Math.max(24, tile);
    this.view.ox = Math.floor((this.W - this.view.tile * this.grid.w) / 2);
    this.view.oy = hudTop + Math.floor((this.H - hudTop - hudBottom - this.view.tile * this.grid.h) / 2);
  },

  /* ---------- missions ---------- */
  showBriefing(i) {
    this.missionIndex = i;
    if (i === 0) { this.runBuffs = { move:0, maxHeat:0, acc:0, undos:0 }; this.runRewardIds = []; this.runNoEpic = 0; }  // new run — buffs reset
    // Round 139 — failure ratchet (one-directional DDA): per-mission, reset on success.
    // Attempt 3+: enemy dmg −15%. Attempt 4+: −25%. Never raises. Displayed numbers stay truthful.
    const fails = ((this.saveData.campaign.fails || {})['m' + (i + 1)] || 0);
    this._ratchet = fails >= 3 ? 0.75 : fails >= 2 ? 0.85 : 1.0;
    try { Music.setState('menu'); } catch (e) {}  // calm ambience (Round 27)
    const M = MISSIONS[i];
    const el = document.getElementById('briefing-screen');
    el.classList.remove('hidden');
    // Round 135 — causal chaining: "previously" line references what the player DID last mission
    const prev = (i > 0 && this._lastMission)
      ? `<p class="assist-note">◀ ${t('ui.previously', { turns: this._lastMission.turns, lost: this._lastMission.lost })}</p>` : '';
    el.innerHTML = `<div class="overlay-card">
      <h1>${t('ui.mission')} ${M.id}: ${t(M.nameKey)}</h1>
      ${prev}
      <p>${(typeof JAM_BUILD !== 'undefined' && JAM_BUILD && i === 0)
        ? t('mission.1.briefing_jam') : t(M.briefingKey)}</p>
      ${M.assistKey ? `<p class="assist-note">${t(M.assistKey)}</p>` : ''}
      ${(typeof THEME_HOOK !== 'undefined' && THEME_HOOK.name && THEME_HOOK.desc)
        ? `<p class="assist-note">⚡ <b>${THEME_HOOK.name}</b> — ${THEME_HOOK.desc}</p>` : ''}
      ${(typeof THEME_HOOK !== 'undefined' && THEME_HOOK.twist && i === 2)
        ? `<p class="assist-note" style="border-color:#ff5d5d">🌀 ${THEME_HOOK.twist}</p>` : ''}
      ${i === 2 ? `<p class="assist-note" style="border-color:#2de2e6;font-size:15px"><b>${t('ui.duel_oneliner')}</b></p>` : ''}
      ${(typeof SaveStore !== 'undefined' && !SaveStore.storageOK)
        ? `<p class="assist-note" style="border-color:#ffb347">⚠️ ${t('ui.save_unreliable')}</p>` : ''}
      <h2>${t('ui.forces')}</h2><p>${t('ui.forces_line', { n: M.enemySpawns.length })}</p>
      <h2>${t('ui.difficulty')}</h2>
      <div class="mech-tabs">${Object.values(DIFFICULTY).map(d =>
        `<button class="mech-tab diff-tab ${d.id === this.difficulty ? 'active' : ''}" data-d="${d.id}">${t(d.labelKey)}</button>`).join('')}</div>
      <p style="font-size:13px" id="diff-desc">${t(DIFFICULTY[this.difficulty].descKey)}</p>
      <button class="big-btn" id="btn-launch">${t('ui.launch')}</button>
    </div>`;
    el.querySelectorAll('.diff-tab').forEach(b => b.onclick = () => {
      this.difficulty = b.dataset.d;
      try { localStorage.setItem('mecha-protocol-diff', this.difficulty); } catch (e) {}
      try { this.persistProgress(false); } catch (e) {}
      try { SFX.select(); } catch (err) {}
      Telemetry.setDifficulty(this.difficulty);
      Telemetry.design('game:difficulty:select:' + this.difficulty, 1);
      el.querySelectorAll('.diff-tab').forEach(x => x.classList.toggle('active', x === b));
      document.getElementById('diff-desc').textContent = t(DIFFICULTY[this.difficulty].descKey);
    });
    document.getElementById('btn-launch').onclick = () => {
      el.classList.add('hidden');
      this.startMission(i);
    };
  },

  startMission(i) {
    const M = MISSIONS[i];
    this._heatTipShown = false;  // Round 102 — reset just-in-time tip flags per mission
    this._heatOverloads = 0;  // Round 122 — reset adaptive heat-tip counter per mission
    this.battleMusicOn = false;  // Round 109 — reset battle music trigger
    try { Music.setState('deploy'); } catch (e) {}  // Round 109: deployment silence (Prunty)
    this.grid = makeGrid(M.map);
    this.layout();
    this.playerMechs = [];
    this.enemyMechs = [];
    MECH_ID = 1;
    const names = ['VANGUARD', 'JOLT', 'BASTION'];
    M.playerSpawns.forEach(([x, y], k) => {
      const lo = (this.savedLoadouts && this.savedLoadouts[k]) || { armor:'medium', armL:'rifle', armR: k===0?'blade':'rifle' };
      const m = makeMech('player', names[k], lo);
      m.x = x; m.y = y; m.facing = 1;
      if (this.runBuffs) {  // run-scoped reward buffs (Round 25)
        m.maxHeat += this.runBuffs.maxHeat;
        m.bonusMove = this.runBuffs.move;
      }
      this.playerMechs.push(m);
    });
    M.enemySpawns.forEach(([x, y], k) => {
      // enemy archetypes (Round 51): one readable trick each — data, not new systems
      const arch = M.ace ? null : ENEMY_ARCHETYPES[(M.enemies || [])[k]] || ENEMY_ARCHETYPES.raider;
      const m = makeMech('enemy', M.ace ? 'VEX' : (arch.name + '-' + (k + 1)),
        M.ace ? { armor:'heavy', armL:'cannon', armR:'blade' } : arch.loadout);
      m.x = x; m.y = y; m.facing = -1;
      if (arch) {
        m.personality = arch.personality;
        m.tint = arch.tint;  // per-archetype readability (Okabe-Ito, colorblind-safe)
        if (arch.moveBonus) m.bonusMove = arch.moveBonus;
      } else {
        // AI personality (Round 35 — Fire Emblem engagement rules)
        m.personality = 'duelist';
      }
      if (M.ace) { // the ace: actions + phases, not HP bloat (Round 17)
        for (const key of Object.keys(m.limbs)) { m.limbs[key].max = Math.round(m.limbs[key].max * 1.4); m.limbs[key].hp = m.limbs[key].max; }
        m.isAce = true; m.actionsPerRound = 2; m.dmgBonus = 0; m.phase2 = false;
        m.maxHeat = 8;  // weakness (Round 28 — Chosen model): VEX overclocks, runs hot — heat punishes it
      }
      this.enemyMechs.push(m);
    });
    this.turn = 1;
    try { Barks.reset(); } catch (e) {}
    this._barkFirstKill = false;
    // Build-time AI dialogue: extend VEX taunt pools once (ai-dialogue.js merged
    // keys into I18N.dicts.en at load; guarded so the game runs fine without it).
    try {
      if (!this._aiTauntsWired && typeof AI_DIALOGUE !== 'undefined' && AI_DIALOGUE.vex_taunts) {
        this._aiTauntsWired = true;
        for (var _ai = 0; _ai < AI_DIALOGUE.vex_taunts.length; _ai++) this.taunts.push('taunt.ai.' + _ai);
      }
    } catch (e) {}
    for (const m of [...this.playerMechs, ...this.enemyMechs]) m._heat50warned = false;  // Round 88
    // bark: lance leader opens the mission; VEX announces themselves (Round 45)
    try {
      Barks.say('start', 0);
      // Round 147 — VEX taunt references player history (XCOM 2 Chosen cadence; causal chaining).
      // The nemesis feels observant, not scripted. Uses _lastMission (turns, mechs lost).
      if (M.ace) {
        const lm = this._lastMission;
        if (lm && (lm.lost > 0 || lm.turns > 12)) {
          try { this.aceTaunt(t('taunt.observant_weak', { turns: lm.turns, lost: lm.lost })); } catch (e2) {}
        } else if (lm && lm.turns <= 8 && lm.lost === 0) {
          try { this.aceTaunt(t('taunt.observant_strong')); } catch (e2) {}
        } else { Barks.say('vexenter', 'vex'); }
        // Round 168 — VEX signature (GLaDOS): the line, verbatim, at entrance.
        try { Barks.say('vexsign', 'vex'); } catch (e) {}
        Barks.say('vexenter', 0);
      }
    } catch (e) {}
    this.undosLeft = 1 + (this.runBuffs ? this.runBuffs.undos : 0) + (this.hasAssist('second') ? 1 : 0);  // assist (Round 52)
    this.battleMusicOn = false;  // deployment stays silent (Round 27 — Prunty)
    this.missionStartTime = Date.now();
    try { Telemetry.design('mission:start:' + (this.missionIndex + 1), 1); } catch (e) {}
    try { Tutorial.startMission(this.missionIndex); } catch (e) {}
    Telemetry.missionStart(i + 1);
    this.takeSnapshot();
    this.phase = 'player';
    try { this.announce(t('ui.player_turn')); } catch (e) {}  // Round 221
    this.beginPlayerPhase();
    this.terrainDirty = true; this.unitsDirty = true;
    this.setBanner(t('ui.mission_turn', { id: M.id }));
  },

  nextMission() {
    // persist lance
    this.save();
    // campaign progress (Round 32)
    const mid = 'm' + (this.missionIndex + 1);
    if (!this.saveData.campaign.completed.includes(mid)) this.saveData.campaign.completed.push(mid);
    const next = 'm' + (this.missionIndex + 2);
    if (this.missionIndex + 1 < MISSIONS.length && !this.saveData.campaign.unlocked.includes(next))
      this.saveData.campaign.unlocked.push(next);
    this.saveData.run = null;  // mission boundary — suspend snapshot no longer needed
    this.saveData.stats.missionsWon++;
    // Round 139 — ratchet resets on success (per-mission, one-directional)
    if (this.saveData.campaign.fails) this.saveData.campaign.fails['m' + (this.missionIndex + 1)] = 0;
    this.saveData.stats.consecFails = 0;  // reset the assist-offer counter (Round 52)
    this.persistProgress(true);
    if (this.missionIndex + 1 >= MISSIONS.length) return this.showVictory();
    this.showBriefing(this.missionIndex + 1);
  },

  save() {  // persist lance + campaign progress (Round 32: via SaveStore)
    this.saveData.hangar.lances = this.playerMechs.map(m => ({ armor:m.armor, armL:m.weapons.armL, armR:m.weapons.armR }));
    this.persistProgress(true);
  },

  /* ---------- mid-mission suspend save (Round 32) ---------- */
  serMech(m) {
    const limbs = {};
    for (const k of Object.keys(m.limbs)) limbs[k] = { hp: m.limbs[k].hp, destroyed: !!m.limbs[k].destroyed };
    return {
      name: m.name, team: m.team, x: m.x, y: m.y, facing: m.facing, armor: m.armor,
      weapons: { armL: m.weapons.armL, armR: m.weapons.armR }, limbs,
      heat: m.heat, maxHeat: m.maxHeat, bonusMove: m.bonusMove || 0, shutdown: !!m.shutdown,
      isAce: !!m.isAce, phase2: !!m.phase2, dmgBonus: m.dmgBonus || 0, kills: m.kills || 0, _phase2warned: !!m._phase2warned,
      personality: m.personality || 'duelist',
    };
  },

  deserMech(s) {
    const m = makeMech(s.team, s.name, { armor: s.armor, armL: s.weapons.armL, armR: s.weapons.armR });
    if (s.isAce) {  // re-apply ace limb scaling BEFORE hp (mirrors startMission)
      for (const k of Object.keys(m.limbs)) m.limbs[k].max = Math.round(m.limbs[k].max * 1.4);
      m.isAce = true; m.actionsPerRound = 2; m.phase2 = !!s.phase2; m.dmgBonus = s.dmgBonus || 0; m._phase2warned = !!s._phase2warned;
    }
    for (const k of Object.keys(m.limbs)) {
      if (s.limbs && s.limbs[k]) {
        m.limbs[k].hp = Math.max(0, Math.min(s.limbs[k].hp, m.limbs[k].max));
        m.limbs[k].destroyed = !!s.limbs[k].destroyed;
      }
    }
    m.x = s.x; m.y = s.y; m.facing = s.facing;
    m.heat = s.heat || 0; m.maxHeat = s.maxHeat || 10; m.bonusMove = s.bonusMove || 0; m.kills = s.kills || 0;
    m.shutdown = !!s.shutdown;
    m.personality = s.personality || (s.isAce ? 'duelist' : 'charger');
    return m;
  },

  // clean boundary: start of the player's turn, after resets — never mid-animation
  snapshotRun() {
    if (this.phase !== 'player' || !this.playerMechs.length || !this.enemyMechs.length) return;
    this.saveData.run = {
      missionIndex: this.missionIndex, turn: this.turn, undosLeft: this.undosLeft,
      runBuffs: this.runBuffs || null,
      player: this.playerMechs.map((m) => this.serMech(m)),
      enemy: this.enemyMechs.map((m) => this.serMech(m)),
    };
    this.persistProgress(false);
  },

  resumeRun(run) {
    const M = MISSIONS[run.missionIndex];
    if (!M) { this.showBriefing(0); return; }  // stale run -> fresh start, never a crash
    this.missionIndex = run.missionIndex;
    this.grid = makeGrid(M.map);
    this.layout();
    this.runBuffs = run.runBuffs;  // for FUTURE missions; deserialized mechs already carry buffs
    MECH_ID = 100;
    this.playerMechs = run.player.map((s) => this.deserMech(s));
    this.enemyMechs = run.enemy.map((s) => this.deserMech(s));
    this.turn = run.turn || 1;
    this.undosLeft = (run.undosLeft !== undefined) ? run.undosLeft : 1;
    this.battleMusicOn = true;  // combat was already joined
    this.missionStartTime = Date.now();
    this.takeSnapshot();
    this.phase = 'player';
    this.beginPlayerPhase(true);  // resumed=true: snapshot is post-turn-start, no double cooling
    try { Telemetry.design('mission:resume:' + (this.missionIndex + 1), 1); } catch (e) {}
  },

  /* ---------- turn flow ---------- */
  mechAt(x, y) {
    for (const m of [...this.playerMechs, ...this.enemyMechs])
      if (mechAlive(m) && m.x === x && m.y === y) return m;
    return null;
  },

  takeSnapshot() {
    this.undoSnapshot = JSON.stringify({
      playerMechs: this.playerMechs, enemyMechs: this.enemyMechs, turn: this.turn,
    });
  },

  doUndo() {
    if (this.undosLeft <= 0 || !this.undoSnapshot || this.phase !== 'player' || this.animating) return;
    const s = JSON.parse(this.undoSnapshot);
    this.playerMechs = s.playerMechs; this.enemyMechs = s.enemyMechs; this.turn = s.turn;
    // Undo restores to the START of the current player phase: the snapshot is taken at
    // end of enemy phase (before beginPlayerPhase resets), so reset turn flags + cooling
    // here — otherwise restored acted=true bricks the turn on turns >= 2.
    const cool = this.hasAssist('coolant') ? 4 : 3;
    for (const m of this.playerMechs) {
      if (!mechAlive(m)) continue;
      m.acted = false; m.moved = false; m.shutdown = false;
      m.heat = Math.max(0, (m.heat || 0) - cool);
    }
    this.undosLeft--;
    Telemetry.design('combat:undo', 1);
    try { Telemetry.design('combat:undo_used:m' + (this.missionIndex + 1), 1); } catch (e) {}  // balance signal (Round 34)
    this.selected = null; this.moveInfo = null; this.attackTargets = []; this.hideForecast();
    this.computeIntents();
    this.unitsDirty = true;
    this.updateUndoBtn();
    this.floater(this.W / 2, this.H / 2, t('ui.turn_rewound'), '#2de2e6', 20);
  },

  updateUndoBtn() {
    document.getElementById('btn-undo').disabled = this.undosLeft <= 0 || this.phase !== 'player';
  },

  beginPlayerPhase(resumed) {
    this.phase = 'player';
    try { Tutorial.maybeStart(); Tutorial.onTurn(this.turn); } catch (e) {}
    for (const m of this.playerMechs) {
      if (!mechAlive(m)) continue;
      if (!resumed) {
        m.heat = Math.max(0, m.heat - (this.hasAssist('coolant') ? 4 : 3));  // assist (Round 52)
        if (m.heat > m.maxHeat) { m.shutdown = true; m.acted = true; m.heat = 6; Telemetry.design('combat:heat:overload', 1); try { SFX.critical(); } catch (e) {}
          // Pilot bark on overheat (Round 76 — verb-tied; player mechs only)
          if (m.team === 'player') { try { Barks.say('overheat', this.playerMechs.indexOf(m)); } catch (e3) {} }
          // Round 102 — just-in-time heat tip (first overheat; 2-dismiss shut-off)
          // Round 122 — ADAPTIVE (Fan tip #7, PvZ pattern): fire only on SECOND overheat
          // ("doing the wrong thing"); players managing heat correctly never see it.
          if (m.team === 'player') {
            this._heatOverloads = (this._heatOverloads || 0) + 1;
            if (this._heatOverloads >= 2 && !this._heatTipShown) { this._heatTipShown = true; try { Tutorial.show('heatjit', m); } catch (e4) {} }
          }
          // VEX taunts a player's overheat (Round 66 — personality as feedback; once per mission)
          try {
            const ace = this.enemyMechs.find(e => e.isAce && mechAlive(e));
            if (ace && m.team === 'player' && !this._vexOverheatTaunt) { this._vexOverheatTaunt = true; this.aceTaunt(t('taunt.overheat')); }
          } catch (e2) {}
        }
        else { m.shutdown = false; m.acted = false; }
      } else {
        m.acted = false;  // snapshot was taken post-turn-start: no double cooling
      }
      m.moved = false;
    }
    this.selected = null; this.moveInfo = null; this.attackTargets = [];
    this.hideForecast();
    this.computeIntents();
    // Round 144 — telegraph stinger (Prosser pitch-as-information): pitch scales with max threat.
    // Severity 0-3 semitones by damage tier. Audio reinforces the visual intent readout.
    try {
      const maxDmg = this.intents.reduce((m, it) => Math.max(m, it.dmg || 0), 0);
      if (maxDmg > 0) {
        const sev = maxDmg >= 20 ? 3 : maxDmg >= 12 ? 2 : maxDmg >= 6 ? 1 : 0;
        SFX.tone(660, 0.12, 'triangle', 0.08, null, 0, 'ui', sev);
        // Round 164 — duck BGM under the stinger so the telegraph survives the mix.
        try { if (window.Music && Music.duck) Music.duck(0.6); } catch (e3) {}
      }
    } catch (e2) {}
    this.unitsDirty = true; this.terrainDirty = true;
    this.updateUndoBtn();
    this.banner = { text:t('ui.your_turn'), color:'#2de2e6', t:0 };
    try { SFX.phase(true); } catch (e) {}
    this.setBanner(t('ui.mission_turn', { id: this.missionIndex + 1 }));
    if (!resumed) {
      this.saveData.stats.turnsPlayed++;
      this.snapshotRun();  // suspend-save at the clean turn boundary (Round 32)
    }
  },

  // text-size accessibility (Round 41): CSS zoom on reading surfaces (they scroll,
  // so 200% reflows safely) + canvas text scaled at draw time
  applyTextScale() {
    document.body.dataset.ts = String(Math.round(this.textScale * 100));
    const b = document.getElementById('btn-text');
    if (b) b.textContent = 'A' + (this.textScale === 1 ? '' : '·' + Math.round(this.textScale * 100) + '%');
    this.unitsDirty = true; this.terrainDirty = true;
  },
  // tap-again-to-confirm on End Turn (Round 41 — motor accessibility / fat-finger
  // recovery: ending the turn is the one irreversible player action)
  // Round 146 — 0.5s post-acceptance delay (GAG Motor Advanced; WCAG AAA pedigree).
  // Absorbs accidental double-taps/tremor. Logs taps-inside-delay to distinguish
  // tremor/accidental input from frustration (a11y telemetry KPI).
  _acceptGate() {
    const now = Date.now();
    if (this._lastAcceptT && (now - this._lastAcceptT) < 500) {
      try { Telemetry.design('a11y:tap_absorbed_delay', 1); } catch (e) {}
      return false;
    }
    this._lastAcceptT = now;
    return true;
  },

  confirmEndTurn() {
    if (!this._acceptGate()) return;  // Round 146: 0.5s post-acceptance delay
    if (this.phase !== 'player' || this.animating) return;
    const b = document.getElementById('btn-end');
    if (b.dataset.confirm === '1') { this.endPlayerPhase(); return; }
    b.dataset.confirm = '1';
    b.textContent = t('ui.confirm_end');
    try { SFX.select(); } catch (e) {}
    try { Telemetry.design('ui:endturn:confirm_shown', 1); } catch (e) {}
    clearTimeout(this._endConfirmT);
    this._endConfirmT = setTimeout(() => {
      delete b.dataset.confirm; b.textContent = t('ui.end_turn');
    }, 3000);
  },

  endPlayerPhase() {
    if (this.phase !== 'player' || this.animating) return;
    const b = document.getElementById('btn-end');
    delete b.dataset.confirm; b.textContent = t('ui.end_turn');
    clearTimeout(this._endConfirmT);
    this.selected = null; this.moveInfo = null; this.attackTargets = [];
    this.hideForecast();
    this.phase = 'enemy';
    this.setBanner(t('ui.enemy_turn'));
    this.banner = { text:t('ui.enemy_turn'), color:'#ff5d5d', t:0 };
    try { this.announce(t('ui.enemy_turn')); } catch (e) {}  // Round 221
    try { SFX.phase(false); } catch (e) {}
    this.updateUndoBtn();
    // Round 86: ace phase-2 shift lands at the START of its next turn (the warning taunt fired 1 turn earlier)
    for (const m of this.enemyMechs) {
      if (m.isAce && m._phase2warned && !m.phase2 && mechAlive(m)) {
        m.phase2 = true; m.dmgBonus = 1;
        if (!this.reducedEffects) this.addTrauma(1.0);  // phase change: full trauma
        try { Telemetry.design('combat:ace:phase2_active', 1); } catch (err) {}
      }
    }
    // queue enemy actions — the ace acts twice per round (action economy fix)
    this.enemyQueue = [];
    this._focusMarks = new Set();  // Round 35: hard-mode cross-unit focus-fire coordination
    for (const m of this.enemyMechs) {
      if (!mechAlive(m) || m.shutdown) continue;
      m.aceActDone = false;  // reset each round (Round 28)
      const acts = m.actionsPerRound || 1;
      for (let i = 0; i < acts; i++) this.enemyQueue.push(m);
    }
    for (const m of this.enemyMechs) {
      if (!mechAlive(m)) continue;
      m.heat = Math.max(0, m.heat - (this.hasAssist('coolant') ? 4 : 3));  // assist (Round 52)
      m.shutdown = m.heat > m.maxHeat;
      if (m.shutdown) m.heat = 6;
    }
    this.enemyTimer = 0.6 / this.animSpeed;
    this.unitsDirty = true;
  },

  computeIntents() {
    this.intents = [];
    // Round 125 — focus-fire cap: track targets per round (max 2 enemies per player mech).
    const targetCounts = new Map();
    for (const e of this.enemyMechs) {
      if (!mechAlive(e) || e.shutdown) continue;
      const avoid = new Set();
      for (const [id, n] of targetCounts) { if (n >= 2) avoid.add(id); }
      const a = aiChooseAction(this, e, DIFFICULTY[this.difficulty].ai, false, avoid);
      if (a && a.target) {
        // Round 138 — threat magnitude (StS weapon tiers): intent carries expected damage,
        // not just "attack". Shape + number, never color alone.
        const w = WEAPONS[a.weapon] || {};
        // Round 139 — ratchet applies to displayed intent too (truthful numbers, never hidden fudging)
        const expDmg = Math.round((w.dmg || 0) * (w.hits || 1) * (mechAccuracy(e) / 100) * (this._ratchet || 1));
        this.intents.push({ from:e, to:a.target, dmg:expDmg });
        targetCounts.set(a.target.id, (targetCounts.get(a.target.id) || 0) + 1);
      }
    }
  },

  nearestEnemyToPlayer() {
    let best = null, bd = 99;
    const p0 = this.playerMechs.find(mechAlive);
    if (!p0) return null;
    for (const e of this.enemyMechs) {
      if (!mechAlive(e)) continue;
      const d = manhattan(p0.x, p0.y, e.x, e.y);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  },

  /* ---------- input ---------- */
  onTap(e) {
    // Round 145 — stuck detection (Hollow Knight): track last input for contextual help timing
    this._lastInputT = Date.now();
    // Round 187 — input buffer (Celeste coyote/buffer): queue taps during animation.
    if (this.phase !== 'player') return;
    if (this.animating) {
      this._bufferedTap = { x: e.clientX, y: e.clientY, t: Date.now() };
      return;
    }
    try { SFX.ensure(); } catch (err) {}
    const r = this.cvU.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    // hit-slop: near-miss taps within 8px of the grid count as the edge tile
    const SLOP = 8, vw = this.view;
    const rx = px - vw.ox, ry = py - vw.oy;
    const gw = this.grid.w * vw.tile, gh = this.grid.h * vw.tile;
    if (rx < -SLOP || ry < -SLOP || rx > gw + SLOP || ry > gh + SLOP) { this.deselect(); return; }
    const gx = Math.max(0, Math.min(this.grid.w - 1, Math.floor(rx / vw.tile)));
    const gy = Math.max(0, Math.min(this.grid.h - 1, Math.floor(ry / vw.tile)));
    const tapped = this.mechAt(gx, gy);

    // 1. tapped an attackable enemy while a mech is selected?
    if (this.selected && tapped && tapped.team === 'enemy' &&
        this.attackTargets.some(t => t === tapped)) {
      this.showForecast(this.selected, tapped);
      return;
    }
    // 2. tapped own mech?
    if (tapped && tapped.team === 'player') {
      if (!mechAlive(tapped) || tapped.acted || tapped.shutdown) { this.deselect(); return; }
      this.select(tapped);
      try { SFX.select(); } catch (err) {}
      return;
    }
    // 3. tapped a move tile?
    if (this.selected && this.moveInfo && this.moveInfo.dist[gx + ',' + gy] !== undefined) {
      try { SFX.tick(); } catch (err) {}
      this.moveSelected(gx, gy);
      return;
    }
    this.deselect();
  },

  select(m) {
    this.selected = m;
    this.hideForecast();
    const blocked = (x, y, sx, sy) => { const o = this.mechAt(x, y); return o && !(x === sx && y === sy); };
    this.moveInfo = m.moved ? null : moveRange(this.grid, m.x, m.y, mechMoveRange(m), blocked);
    this.refreshAttackTargets();
    this.unitsDirty = true; this.terrainDirty = true;
  },

  deselect() {
    this.selected = null; this.moveInfo = null; this.attackTargets = [];
    this.hideForecast(); this.unitsDirty = true; this.terrainDirty = true;
  },

  refreshAttackTargets() {
    this.attackTargets = [];
    if (!this.selected) return;
    const m = this.selected;
    const arms = [];
    if (!m.limbs.armL.destroyed) arms.push(m.weapons.armL);
    if (!m.limbs.armR.destroyed) arms.push(m.weapons.armR);
    const ranges = arms.map(w => WEAPONS[w].range);
    const maxR = Math.max(0, ...ranges);
    if (!maxR) return;
    for (const e of this.enemyMechs) {
      if (!mechAlive(e)) continue;
      const d = manhattan(m.x, m.y, e.x, e.y);
      const wOk = arms.some(w => { const wr = WEAPONS[w].range; return d >= 1 && d <= wr; });
      if (wOk && hasLine(this.grid, m.x, m.y, e.x, e.y)) this.attackTargets.push(e);
    }
  },

  moveSelected(gx, gy) {
    const m = this.selected;
    const path = pathTo(this.moveInfo.prev, m.x, m.y, gx, gy);
    if (!path.length) return;
    this.animating = true;
    m.facing = gx > m.x ? 1 : gx < m.x ? -1 : m.facing;
    const step = () => {
      if (!path.length) {
        this.animating = false; m.moved = true;
    // Round 187 — flush input buffer if fresh (<150ms)
    if (this._bufferedTap && Date.now() - this._bufferedTap.t < 150) { const bt = this._bufferedTap; this._bufferedTap = null; try { this.onTap({ clientX: bt.x, clientY: bt.y }); } catch (e2) {} } else this._bufferedTap = null;
        this.moveInfo = null;
        this.refreshAttackTargets();
        this.unitsDirty = true; this.terrainDirty = true;
        try { Tutorial.onMove(); } catch (e) {}
        try { Tutorial.markFirstAction('move'); } catch (e) {}
        return;
      }
      const [nx, ny] = path.shift();
      m.x = nx; m.y = ny;
      this.unitsDirty = true;
      setTimeout(step, this.spd(90));
    };
    step();
  },

  /* ---------- forecast & combat ---------- */
  showForecast(atk, def) {
    this.forecast = { atk, def, limb:'torso', weapon:null, arm:null };
    try { Tutorial.suspend(); } catch (e) {}  // coach mark must not cover the limb picker
    // choose best arm weapon in range
    const d = manhattan(atk.x, atk.y, def.x, def.y);
    const opts = [];
    if (!atk.limbs.armL.destroyed) opts.push(['armL', atk.weapons.armL]);
    if (!atk.limbs.armR.destroyed) opts.push(['armR', atk.weapons.armR]);
    const inRange = opts.filter(([, wid]) => { const w = WEAPONS[wid]; return d >= 1 && d <= w.range; });
    if (!inRange.length) { this.hideForecast(); return; }
    // prefer highest damage
    inRange.sort((a, b) => WEAPONS[b[1]].dmg - WEAPONS[a[1]].dmg);
    this.forecast.arm = inRange[0][0]; this.forecast.weapon = inRange[0][1];
    this.renderForecast();
  },

  hideForecast() {
    this.forecast = null;
    document.getElementById('forecast-panel').classList.add('hidden');
    try { Tutorial.resume(); } catch (e) {}
  },

  forecastNumbers() {
    const { atk, def, weapon, limb } = this.forecast;
    const w = WEAPONS[weapon];
    const hits = w.hits || 1;
    const accBonus = atk.team === 'player' ? DIFFICULTY[this.difficulty].accBonus + (this.runBuffs ? this.runBuffs.acc : 0) : (this.hasAssist('steady') ? -15 : 0);  // assist (Round 52)
    const acc = Math.max(5, Math.min(95, mechAccuracy(atk) + accBonus - terrainAt(this.grid, def.x, def.y).cover));
    const heatAfter = atk.heat + w.heat;
    // attacker hot check uses heatAfter — resolveAttack adds w.heat before the damage roll
    const hotBonus = (heatAfter >= atk.maxHeat * 0.7 ? 1 : 0) + (def.heat >= def.maxHeat * 0.7 ? 1 : 0);
    return { w, hits, acc, heatAfter, hotBonus,
      willOverheat: heatAfter > atk.maxHeat,
      limbName: t(LIMB_DEFS[limb].nameKey),
      targetHp: def.limbs[limb].hp,
      kill: def.limbs.torso.hp <= w.dmg * hits && limb === 'torso',
    };
  },

  renderForecast() {
    const f = this.forecast;
    if (!f) return;
    const n = this.forecastNumbers();
    const limbs = Object.keys(LIMB_DEFS)
      .filter(k => !f.def.limbs[k].destroyed)
      .map(k => `<button class="ctl-btn" style="min-width:0;min-height:48px;font-size:13px;padding:6px 12px;${k===f.limb?'background:#f9f871;color:#0a0e1a;border-color:#f9f871;':''}" data-limb="${k}">${t(LIMB_DEFS[k].nameKey)}</button>`)
      .join(' ');
    const el = document.getElementById('forecast-panel');
    el.classList.remove('hidden');
    el.innerHTML = `
      <div class="f-title">⚔ ${f.atk.name} → ${f.def.name} <span style="color:#8fa0c8">(${t(n.w.nameKey)})</span></div>
      <div>${t('ui.target_limb')} ${limbs}</div>
      <div style="margin-top:6px">${n.hits > 1 ? n.hits + '× ' : ''}${t('ui.forecast_dmg', { dmg: n.w.dmg + n.hotBonus, limb: n.limbName, hp: n.targetHp })}${n.hotBonus ? ' 🔥' : ''}
        · <span class="${n.acc >= 70 ? 'f-good' : 'f-bad'}">${t('ui.hit_chance', { acc: n.acc })}</span>
        · 🔥${n.heatAfter}/${f.atk.maxHeat}${n.willOverheat ? ' <span class="f-bad">' + t('ui.overheat') + '</span>' : ''}
        ${n.kill ? ' · <span class="f-bad">' + t('ui.kill') + '</span>' : ''}</div>
      <div style="margin-top:8px;display:flex;gap:10px">
        <button class="ctl-btn primary" id="f-fire" style="flex:1">${t('ui.fire')}</button>
        <button class="ctl-btn" id="f-cancel">${t('ui.cancel')}</button>
      </div>`;
    el.querySelectorAll('[data-limb]').forEach(b => b.onclick = () => { f.limb = b.dataset.limb; this.renderForecast(); });
    document.getElementById('f-fire').onclick = () => this.resolveAttack(f.atk, f.def, f.weapon, f.limb);
    document.getElementById('f-cancel').onclick = () => this.hideForecast();
  },

  resolveAttack(atk, def, weaponId, limbKey, isEnemy) {
    const w = WEAPONS[weaponId];
    const hits = w.hits || 1;
    this.hideForecast();
    // VEX audio identity (Round 31): leitmotif + signature timbre on ace attacks
    try { if (atk.isAce) { SFX.vexStinger(); SFX.vexShot(); } else SFX.shoot(); } catch (err) {}
    // battle music hits on first combat (Round 27 — ItB deployment-silence model)
    if (!this.battleMusicOn) {
      this.battleMusicOn = true;
      try { Music.setState('battle'); } catch (e) {}
    }
    // FTUE (Round 29): first player attack completes the attack lesson
    // Round 184 — fail-safe: first attack cannot overheat (safe sandbox).
    if (atk.team === 'player' && !this._firstAttackDone) {
      this._firstAttackDone = true;
      atk._noOverheatOnce = true;
    }
    if (atk.team === 'player') { try { Tutorial.onAttack(); } catch (e) {} try { Tutorial.markFirstAction('attack'); } catch (e) {} }
    this.animating = true;
    atk.acted = true; atk.moved = true;
    // Round 150 — theme hook heat multiplier (LD60; identity when unset)
    atk.heat += (typeof THEME_HOOK !== 'undefined' && THEME_HOOK.heatMult && THEME_HOOK.heatMult !== 1)
      ? Math.round(w.heat * THEME_HOOK.heatMult) : w.heat;
    // Round 184 — fail-safe: first attack heat capped below overheat threshold.
    if (atk._noOverheatOnce) { atk.heat = Math.min(atk.heat, atk.maxHeat - 1); atk._noOverheatOnce = false; }
    // Round 88: heat-50% warning bark (lore channel; once per mech per mission)
    if (atk.team === 'player' && !atk._heat50warned && atk.heat >= atk.maxHeat * 0.5 && atk.heat <= atk.maxHeat) {
      atk._heat50warned = true;
      try { Barks.say('heat50', this.playerMechs.indexOf(atk)); } catch (e3) {}
    }
    // balance telemetry (Round 34): did the attacker ENTER the 70%+ heat bet voluntarily?
    try {
      if (atk.heat - w.heat < atk.maxHeat * 0.7 && atk.heat >= atk.maxHeat * 0.7) {
        Telemetry.design('combat:heat_zone:' + atk.team, 1);
        // Round 141 — 70% alarm (AC6): audio ping + visual pulse, pre-threshold telegraph (player only)
        if (atk.team === 'player') {
          try { SFX.warn(); } catch (e2) {}
          const gx = (atk.x + .5) * this.view.tile + this.view.ox, gy = (atk.y - .6) * this.view.tile + this.view.oy;
          try { this.floater(gx, gy, '⚠ ' + t('ui.heat_70'), '#ffb347', 14, 2.5); } catch (e3) {}
        }
      }
    } catch (e) {}
    atk.facing = def.x > atk.x ? 1 : def.x < atk.x ? -1 : atk.facing;
    // projectile visual
    const v = this.view;
    this.projectiles.push({ x1:(atk.x+.5)*v.tile+v.ox, y1:(atk.y+.3)*v.tile+v.oy,
      x2:(def.x+.5)*v.tile+v.ox, y2:(def.y+.4)*v.tile+v.oy, t:0, color: atk.team==='player'?'#2de2e6':'#ff5d5d' });
    this.deselect();
    setTimeout(() => {
      const rng = mulberry32((Date.now() + atk.id * 97) >>> 0);
      let totalDealt = 0;
      for (let h = 0; h < hits; h++) {
        if (!mechAlive(def)) break;
        const accBonus = atk.team === 'player' ? DIFFICULTY[this.difficulty].accBonus + (this.runBuffs ? this.runBuffs.acc : 0) : (this.hasAssist('steady') ? -15 : 0);  // assist (Round 52)
        const acc = Math.max(5, Math.min(95, mechAccuracy(atk) + accBonus - terrainAt(this.grid, def.x, def.y).cover));
        // Round 132 — miss pity as bounded PRD (Dota 2 pattern): escalate per consecutive miss,
        // guarantee by 6th attempt. One-directional only (never punishes success). Player-side only.
        let pityAcc = acc;
        // Round 184 — fail-safe first attack (Celeste safe sandbox): the player's
        // very first attack of the campaign cannot miss. Guaranteed success.
        if (atk.team === 'player' && !this._firstAttackDone) pityAcc = 100;
        if (atk.team === 'player') {
          const streak = atk._missStreak || 0;
          if (streak >= 5) pityAcc = 100;  // hard guarantee
          else if (streak > 0) pityAcc = Math.min(100, acc + streak * 8);
        }
        if (rng() * 100 < pityAcc) {
          atk._missStreak = 0;
          // heat-as-bet (Round 25 — Ignited Steel): hot mechs hit harder AND take harder hits
          let dmg = w.dmg + (atk.dmgBonus || 0);
          let hotBonus = 0;
          if (atk.heat >= atk.maxHeat * 0.7) hotBonus++;
          if (def.heat >= def.maxHeat * 0.7) hotBonus++;
          dmg += hotBonus;
          // M1 training wheels (Round 29): hostiles fire practice rounds — defeat is impossible
          if (this.missionIndex === 0 && atk.team === 'enemy') dmg = Math.max(1, Math.round(dmg * 0.5));
          // Round 139 — failure ratchet: one-directional, per-mission. Enemy damage scaled down on attempt 3+.
          if (atk.team === 'enemy' && this._ratchet && this._ratchet < 1) dmg = Math.max(1, Math.round(dmg * this._ratchet));
          // Round 150 — theme hook (LD60 mechanical metaphor; identity when unset)
          if (typeof THEME_HOOK !== 'undefined' && THEME_HOOK.dmgMult && THEME_HOOK.dmgMult !== 1) {
            dmg = Math.max(1, Math.round(dmg * THEME_HOOK.dmgMult));
          }
          const limb = (limbKey && !def.limbs[limbKey].destroyed) ? limbKey : pickTargetLimb(def, rng);
          const evts = damageLimb(def, limb, dmg);
          totalDealt += dmg;
          const px = (def.x + .5) * v.tile + v.ox, py = (def.y + .3) * v.tile + v.oy;
          this.burst(px, py, '#ffb02e', 14);
          this.floater(px, py - 20, '-' + dmg + ' ' + t(LIMB_DEFS[limb].nameKey) + (hotBonus ? ' 🔥' : ''), '#ff5d5d', 16);
          try { SFX.hit(); } catch (err) {}
          // Round 196 — dynamic range (GameDesign.gg mistake #3): outcome scales hit-stop.
          // Limb break ×1.6, kill ×2.2 on top of weapon ladder. Light chips stay short.
          let outcomeMult = 1;
          if (evts.some(e => e.startsWith('destroyed:'))) outcomeMult = 1.6;
          if (!mechAlive(def)) outcomeMult = 2.2;
          if (!this.reducedEffects) { this._applyHitStop(0.04 * (w.hitstop || 1) * outcomeMult); def.squash = 0.18; }  // Round 128: per-weapon hit-stop ladder (Smash-style multipliers; blade 1.5×, cannon 1.25×, missiles 0.7×/pellet)
          // Round 178 — follow-through: attacker recoil opposite the shot (Cooper; ~zero cost)
          if (!this.reducedEffects) { const rdx = atk.x - def.x, rdy = atk.y - def.y;
            const rl = Math.hypot(rdx, rdy) || 1;
            atk.recoil = { dx: rdx / rl * 6, dy: rdy / rl * 6, t: 0.18 }; }
          if (!this.reducedEffects) def.limbFlash = { limb, t: 0.12, color: '#ffffff' };  // limb hit flash (Round 53)
          if (!this.reducedEffects) this.flashes.push({ x: def.x, y: def.y, t: 0.15 });  // single soft flash per hit — never a strobe (Round 41)
          for (const e of evts) {
            const [, lk] = e.split(':');
            // Round 129 — phase gate on LIMB-BREAK EVENT (anti-HP-sponge; salivity/Stout):
            // VEX adapts when it LOSES A COMPONENT, not at an HP threshold. First break = midpoint beat.
            if (def.isAce && !def.phase2 && !def._phase2warned) {
              def._phase2warned = true;  // Round 86: taunt = tell — 1-turn warning before the shift lands
              this.floater(px, py - 84, t('ui.vex_adapts'), '#c9a0ff', 18);
              this.aceTaunt(t('taunt.phase2'));
              try { Telemetry.design('combat:ace:phase2_warning', 1); } catch (err) {}
            }
            this.floater(px, py - 42, t('ui.limb_destroyed', { limb: t(LIMB_DEFS[lk].nameKey).toUpperCase() }), '#ff3b3b', 15);
            this.burst(px, py, '#ff3b3b', 22);
            if (!this.reducedEffects) this.addTrauma(0.6);  // limb break: strong band
            if (!this.reducedEffects) def.limbFlash = { limb: lk, t: 0.2, color: '#ff3b3b' };  // red flash on limb break (Round 53)
            try { Telemetry.design('combat:limb_lost:' + def.team + ':' + lk, 1); } catch (err) {}  // balance signal (Round 34)
            // Pilot bark on limb loss (Round 76 — verb-tied; player mechs only)
            if (def.team === 'player') { try { Barks.say('limblost', this.playerMechs.indexOf(def)); } catch (err2) {} }
            try { SFX.critical(); } catch (err) {}   // Tier 1: limb break always punches through
            if (!this.reducedEffects) this._applyHitStop(0.08);  // graded: heavy hits punch harder (Round 85: 80ms)
            // VEX reacts to losing a component (Round 66 — personality as feedback; once per limb)
            if (def.isAce && atk.team === 'player' && !def._tauntedLimb?.[lk]) {
              def._tauntedLimb = def._tauntedLimb || {}; def._tauntedLimb[lk] = true;
              this.aceTaunt(t('taunt.component', { limb: t(LIMB_DEFS[lk].nameKey) }));
            }
          }
          if (!mechAlive(def)) {
            this.burst(px, py, '#ff7b2e', 40);
            // Round 169 — kill confirm (Salyh): dying things don't pop out of existence.
            // 0.5s fade + shrink instead of instant vanish. Behind reduced-motion.
            if (!this.reducedEffects) def.dying = 0.5;
            this.floater(px, py - 60, t('ui.mech_down', { name: def.name }), '#f9f871', 20);
            try { SFX.critical(); } catch (err) {}
            if (!this.reducedEffects) this.addTrauma(1.0);  // kill: full trauma
            if (!this.reducedEffects) this._applyHitStop(0.08);  // kill: graded (Round 85: 80ms)
            // Round 143 — "Stop for Big Moments" (Sakurai): kill shot gets the deepest stop.
            // Smash caps: 20-30 frames (0.33-0.5s at 60fps). Our cap: 0.2s (12 frames).
            if (!this.reducedEffects && def.limbs.torso.hp <= 0)
              this._applyHitStop(0.15);  // capped at 0.2 via _applyHitStop budget
            atk.kills++;
            // barks (Round 45): first player kill + ally down reactions
            try {
              if (atk.team === 'player' && !this._barkFirstKill) {
                this._barkFirstKill = true;
                Barks.say('firstkill', this.playerMechs.indexOf(atk));
              }
              if (def.team === 'player') Barks.say('allydown', Barks.randomPilot());
            } catch (e) {}
            if (def.isAce) {
              // Build-time AI dialogue: rotate VEX defeat lines (70% AI, 30% original).
              var _dk = 'taunt.death';
              try {
                if (typeof AI_DIALOGUE !== 'undefined' && AI_DIALOGUE.vex_defeat &&
                    AI_DIALOGUE.vex_defeat.length && rng() < 0.7) {
                  _dk = 'taunt.ai_defeat.' + Math.floor(rng() * AI_DIALOGUE.vex_defeat.length);
                }
              } catch (e) {}
              this.aceTaunt(t(_dk));
            }
            else if (atk.isAce) {
              // Build-time AI dialogue: ace-kill taunts draw from the base pool
              // plus AI victory lines.
              var _pool = this.taunts;
              try {
                if (typeof AI_DIALOGUE !== 'undefined' && AI_DIALOGUE.vex_victory &&
                    AI_DIALOGUE.vex_victory.length) {
                  _pool = _pool.concat(AI_DIALOGUE.vex_victory.map(function (_, i) { return 'taunt.ai_victory.' + i; }));
                }
              } catch (e) {}
              this.aceTaunt(t(_pool[Math.floor(rng() * _pool.length)]));
            }
          }
        } else {
          const px = (def.x + .5) * v.tile + v.ox, py = (def.y + .3) * v.tile + v.oy;
          this.floater(px, py - 20, t('ui.miss'), '#8fa0c8', 14);
          if (atk.team === 'player') atk._missStreak = (atk._missStreak || 0) + 1;  // Round 132: PRD streak
        }
      }
      this.unitsDirty = true;
      setTimeout(() => {
        this.animating = false;

    // Round 187 — flush input buffer if fresh (<150ms)
    if (this._bufferedTap && Date.now() - this._bufferedTap.t < 150) { const bt = this._bufferedTap; this._bufferedTap = null; try { this.onTap({ clientX: bt.x, clientY: bt.y }); } catch (e2) {} } else this._bufferedTap = null;        this.checkEnd();
        if (this.phase === 'enemy') this.enemyTimer = 0.5 / this.animSpeed;
        else { this.computeIntents(); this.unitsDirty = true; }
      }, this.spd(450));
    }, this.spd(260));
  },

  aceTaunt(text) {
    const ace = this.enemyMechs.find(m => m.isAce && mechAlive(m)) || this.enemyMechs.find(m => m.isAce);
    if (!ace) return;
    const v = this.view;
    this.floater((ace.x + .5) * v.tile + v.ox, (ace.y - .4) * v.tile + v.oy, 'VEX: "' + text + '"', '#c9a0ff', 14);
  },

  checkEnd() {
    const enemiesAlive = this.enemyMechs.some(mechAlive);
    const playersAlive = this.playerMechs.some(mechAlive);
    if (!enemiesAlive) {
      this.phase = 'hangar';
      Telemetry.missionComplete(this.missionIndex + 1, this.turn);
      // Round 157 — tutorial funnel exit (GameDesign.gg): M1 complete closes the
      // tutorial funnel. tutorial:start fired at FTUE; step events per id exist.
      try { if (this.missionIndex === 0) Telemetry.design('tutorial:exit', 1); } catch (e) {}
      this.setBanner(t('ui.mission_complete'));
      try { Barks.say('clear', Barks.randomPilot()); } catch (e) {}  // bark (Round 45)
      // Round 168 — VEX signature (GLaDOS "Still Alive" slot): the same line,
      // verbatim, when the player wins the M3 duel. Finish smiling.
      try { if (this.missionIndex === 2) Barks.say('vexsign', 'vex'); } catch (e) {}
      // Round 148 — VEX legend through chatter (M1/M2 only; the duel is M3)
      try { if (this.missionIndex < 2) Barks.say('vexrumor', Barks.randomPilot()); } catch (e2) {}
      this.hopsonCheck();  // Round 130 — Hopson mid-playtest: 4-option difficulty popup after each mission
      // Round 135 — causal chaining (Kuelz): record last-mission outcome for the next briefing's "previously" line
      this._lastMission = { turns: this.turn, lost: this.playerMechs.filter(m => !mechAlive(m)).length };
      // heal small amount between missions
      for (const m of this.playerMechs) for (const k of Object.keys(m.limbs)) {
        const L = m.limbs[k];
        if (!L.destroyed) L.hp = Math.min(L.max, L.hp + (this.hasAssist('repairs') ? 4 : 2));  // assist (Round 52)
      }
      setTimeout(() => this.showDraft(), 900);
    } else if (!playersAlive) {
      this.phase = 'gameover';
      this.saveData.run = null;  // the lance died — suspend snapshot is pointless
      this.saveData.stats.missionsLost++;
      // Round 139 — per-mission failure count for the ratchet (one-directional DDA)
      const camp = this.saveData.campaign; camp.fails = camp.fails || {};
      camp.fails['m' + (this.missionIndex + 1)] = (camp.fails['m' + (this.missionIndex + 1)] || 0) + 1;
      // assist offer at the moment of failure (Round 52 — anti-Ninja-Dog: invitation, not shame)
      const fails = (this.saveData.stats.consecFails || 0) + 1;
      this.saveData.stats.consecFails = fails;
      this.persistProgress(false);
      Telemetry.missionFail(this.missionIndex + 1, Math.round((Date.now() - (this.missionStartTime || Date.now())) / 1000));
      try { Music.setState('menu'); } catch (e) {}  // calm on defeat (Round 27)
      const el = document.getElementById('gameover-screen');
      el.classList.remove('hidden');
      el.innerHTML = `<div class="overlay-card">
        <h1 style="color:#ff5d5d">${t('ui.lance_destroyed')}</h1>
        <p>${t('ui.gameover_sub', { n: this.missionIndex + 1 })}</p>
        ${fails >= 2 ? `<p style="color:#f9f871">🛟 ${t('ui.assist_suggest')}</p><button class="big-btn ghost" id="btn-assists" style="margin-bottom:10px">${t('ui.pilot_assists')}</button>` : ''}
        <button class="big-btn" id="btn-retry">${t('ui.retry')}</button></div>`;
      const ab = document.getElementById('btn-assists');
      if (ab) ab.onclick = () => { el.classList.add('hidden'); this.showHelp(); };
      document.getElementById('btn-retry').onclick = () => {
        el.classList.add('hidden');
        Telemetry.design('combat:retry:' + (this.missionIndex + 1), 1);
        this.savedLoadouts = this.playerMechs.map(m => ({ armor:m.armor, armL:m.weapons.armL, armR:m.weapons.armR }));
        this.startMission(this.missionIndex);
      };
    }
  },

  /* ---------- reward draft (Round 25 — StS reward cadence) ---------- */
  showDraft() {
    // Round 36: rarity-weighted (epics skew late), pity (no epic last draft → force one),
    // explicit skip (StS trust valve), duplicate picks upgrade (Pom-style)
    const epics = REWARDS.filter(r => r.tier === 'epic');
    const commons = REWARDS.filter(r => r.tier !== 'epic');
    const epicW = this.missionIndex === 0 ? 0.15 : 0.40;
    const forceEpic = (this.runNoEpic || 0) >= 1;
    const pool = [];
    const e = [...epics], c = [...commons];
    const take = (arr) => arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    if ((forceEpic || Math.random() < epicW) && e.length) pool.push(take(e));
    while (pool.length < 3 && c.length) pool.push(take(c));
    while (pool.length < 3 && e.length) pool.push(take(e));
    pool.sort(() => Math.random() - 0.5);
    this.runNoEpic = pool.some(r => r.tier === 'epic') ? 0 : (this.runNoEpic || 0) + 1;
    const owned = this.runRewardIds || [];
    const el = document.getElementById('gameover-screen');
    el.classList.remove('hidden');
    el.innerHTML = `<div class="overlay-card">
      <h1>${t('ui.draft_title')}</h1>
      <p>${t('ui.draft_sub')}</p>
      <div class="mech-tabs" style="flex-direction:column;align-items:stretch;gap:8px">${pool.map(r =>
        `<button class="mech-tab reward-card" data-r="${r.id}" style="text-align:left;padding:12px">
          <b>${r.tier === 'epic' ? '<span class="epic-tag">EPIC</span> ' : ''}${owned.includes(r.id) ? '⬆ ' : ''}${t(r.nameKey)}</b><br><span style="font-size:13px;color:#8fa3c8">${t(r.descKey)}${owned.includes(r.id) && r.upgrade ? ' ' + t('ui.draft_upgrade') : ''}</span>
        </button>`).join('')}</div>
      <button class="ctl-btn" id="btn-draft-skip" style="width:100%;margin-top:10px">${t('ui.draft_skip')}</button>
    </div>`;
    el.querySelectorAll('.reward-card').forEach(b => b.onclick = () => {
      const r = REWARDS.find(x => x.id === b.dataset.r);
      this.applyReward(r);
      Telemetry.design('game:reward:select:' + r.id, 1);
      try { SFX.select(); } catch (e) {}
      el.classList.add('hidden');
      Hangar.open(this);
    });
    document.getElementById('btn-draft-skip').onclick = () => {
      Telemetry.design('game:reward:skip', 1);
      try { SFX.select(); } catch (e) {}
      el.classList.add('hidden');
      Hangar.open(this);
    };
  },

  applyReward(r) {
    const ownedBefore = (this.runRewardIds || []).includes(r.id);
    const e = (ownedBefore && r.upgrade) ? r.upgrade : r.effect;  // Pom-style: duplicates upgrade
    if (ownedBefore) { try { Telemetry.design('game:reward:upgrade:' + r.id, 1); } catch (err) {} }
    else this.runRewardIds = [...(this.runRewardIds || []), r.id];
    if (e.repair) {
      for (const m of this.playerMechs) for (const k of Object.keys(m.limbs)) {
        const L = m.limbs[k];
        if (!L.destroyed) L.hp = Math.min(L.max, L.hp + e.repair);
      }
      return;
    }
    if (!this.runBuffs) this.runBuffs = { move:0, maxHeat:0, acc:0, undos:0 };
    for (const k of ['move', 'maxHeat', 'acc', 'undos']) if (e[k]) this.runBuffs[k] += e[k];
  },

  showVictory() {
    this.saveData.run = null;
    this.saveData.hangar.lances = [];
    this.persistProgress(false);
    try { Music.setState('menu'); } catch (e) {}  // back to calm (Round 27)
    const el = document.getElementById('gameover-screen');
    el.classList.remove('hidden');
    // playtest survey hook (Round 49): paste the Google Form URL — button appears only when set
    const surveyBtn = SURVEY_URL
      ? `<a href="${SURVEY_URL}" target="_blank" rel="noopener"><button class="big-btn ghost" id="btn-survey" style="margin-top:10px">${t('ui.playtest_survey')}</button></a>` : '';
    el.innerHTML = `<div class="overlay-card">
      <h1 style="color:#7dff8a">${t('ui.vex_defeated')}</h1>
      <p>${t('ui.victory_sub')}</p>
      ${surveyBtn}
      <button class="big-btn" id="btn-again">${t('ui.play_again')}</button></div>`;
    const sb = document.getElementById('btn-survey');
    if (sb) sb.onclick = () => { try { Telemetry.design('playtest:survey:opened', 1); } catch (e) {} };
    document.getElementById('btn-again').onclick = () => {
      el.classList.add('hidden');
      this.savedLoadouts = null;
      this.showBriefing(0);
    };
  },

  /* ---------- enemy phase ---------- */
  runEnemyPhase(dt) {
    if (this.phase !== 'enemy' || this.animating) return;
    this.enemyTimer -= dt * this.animSpeed;
    if (this.enemyTimer > 0) return;
    const m = this.enemyQueue.shift();
    if (!m) {
      this.turn++;
      this.takeSnapshot();
      this.beginPlayerPhase();
      return;
    }
    if (!mechAlive(m) || m.shutdown) { this.enemyTimer = 0.2 / this.animSpeed; return; }
    // D&D legendary-action rule (Round 28): the ace's 2nd action is reposition/utility, never a double nuke
    const secondAct = !!(m.isAce && m.aceActDone);
    const a = aiChooseAction(this, m, DIFFICULTY[this.difficulty].ai, secondAct);
    if (!a) { this.enemyTimer = 0.2 / this.animSpeed; return; }
    if (m.isAce) m.aceActDone = true;
    // move
    const blocked = (x, y, sx, sy) => { const o = this.mechAt(x, y); return o && !(x === sx && y === sy); };
    const { prev } = moveRange(this.grid, m.x, m.y, mechMoveRange(m), blocked);
    const path = pathTo(prev, m.x, m.y, a.move[0], a.move[1]);
    this.animating = true;
    m.facing = a.move[0] > m.x ? 1 : a.move[0] < m.x ? -1 : m.facing;
    const stepMove = () => {
      if (!path.length) {
        this.unitsDirty = true;
        // anticipation beat BEFORE the pre-attack delay (Round 37): the ring pulses
        // during the 250ms beat, then the attack lands
        if (a.target && mechAlive(a.target)) this.windupAttack(m);
        setTimeout(() => {
          if (a.target && mechAlive(a.target)) {
            try { if (this._focusMarks) this._focusMarks.add(a.target.id); } catch (e) {}  // Round 35
            this.resolveAttack(m, a.target, a.weapon, null, true);
          } else { this.animating = false; this.enemyTimer = 0.4 / this.animSpeed; }
    // Round 187 — flush input buffer if fresh (<150ms)
    if (this._bufferedTap && Date.now() - this._bufferedTap.t < 150) { const bt = this._bufferedTap; this._bufferedTap = null; try { this.onTap({ clientX: bt.x, clientY: bt.y }); } catch (e2) {} } else this._bufferedTap = null;
        }, this.spd(250));
        return;
      }
      const [nx, ny] = path.shift();
      m.x = nx; m.y = ny;
      this.unitsDirty = true;
      setTimeout(stepMove, this.spd(110));
    };
    stepMove();
  },

  /* ---------- feel triggers ---------- */
  windupAttack(m) {
    // anticipation beat (Round 37 — 12 principles): the attacker telegraphs for ~250ms
    // before resolveAttack fires; the intent line is already known, this makes it felt
    if (!this.reducedEffects) m.windup = 0.25;
  },

  // screenshake, trauma model (Round 37 — Eiserloh): trauma 0..1, offset = trauma²,
  // decay 0.5/s, smooth noise (never random jumps), applied to render transform only.
  // reduced-effects zeroes it at the source (XAG 117).
  addTrauma(x) {
    if (this.reducedEffects) return;
    // Round 214 — intensity scaling: reduced = 30% trauma
    const mult = this.shakeIntensity === 0 ? 0 : (this.shakeIntensity === 1 ? 0.3 : 1);
    this.trauma = Math.min(1, (this.trauma || 0) + x * mult);
    this._juiceTick();
  },

  // Round 151 — juice events/sec guard (eastondev 3-5/sec discipline; Hades over-juice alarm).
  // Rolling 1s window; exceeding 5 juice events/sec logs a telemetry alarm.
  // The jam build watches this — over-juice fires during the jam itself, not after.
  _juiceTick() {
    const now = Date.now();
    this._juiceEvts = (this._juiceEvts || []).filter(t => now - t < 1000);
    this._juiceEvts.push(now);
    if (this._juiceEvts.length > 5 && !this._juiceAlarmed) {
      this._juiceAlarmed = true;
      try { Telemetry.design('feel:over_juice', this._juiceEvts.length); } catch (e) {}
      setTimeout(() => { this._juiceAlarmed = false; }, 5000);
    }
  },

  /* ---------- fx ---------- */
  // Round 205 — hit-stop rate cap (gamestack): max 0.35s freeze per rolling second.
  // Prevents perpetual freeze when 3v3 multi-attacks stack. Single hits unaffected.
  _applyHitStop(dur) {
    const now = performance.now() / 1000;
    this._hsBudget = this._hsBudget.filter(t => now - t < 1);
    const used = this._hsBudget.reduce((a, b) => a + b, 0);
    if (used + dur > 0.35) return;  // budget exhausted — skip, don't stack
    this._hsBudget.push(dur);
    this.hitStop = Math.max(this.hitStop, dur);
  },
  // Round 199 — pool prewarm (NixieFX): allocate at boot, never on first burst.
  prewarmPool() {
    if (!this._pPool) { this._pPool = []; for (let i = 0; i < 300; i++) this._pPool.push({}); }
  },
  burst(x, y, color, n) {
    n = this.reducedEffects ? Math.ceil(n / 2) : n;
    this.prewarmPool();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 160;
      let p = this._pPool.pop();
      if (!p) continue;  // Round 199 — exhausted: drop newest (NixieFX cap behavior), never alloc
      p.x = x; p.y = y; p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp - 40;
      p.life = .5 + Math.random() * .5; p.max = .9; p.color = color; p.size = 2 + Math.random() * 3;
      this.particles.push(p);
    // particle cap (Round 30 — governor-controlled; drop oldest, return to pool)
    while (this.particles.length > (this.particleCap || 300)) this._pPool.push(this.particles.shift());
    }
  },
  floater(x, y, text, color, size, dur) {
    const d = dur || 1.6;
    this.floaters.push({ x, y, text, color, size: size || 14, life: d, max: d });
    while (this.floaters.length > 30) this.floaters.shift();
    this._juiceTick();  // Round 151: juice events/sec guard
  },
  setBanner(t) { document.getElementById('turn-banner').textContent = t; },

  // Round 130 — Hopson mid-playtest instrument (Halo 2/3 pattern): after each mission,
  // one dismissible 4-option difficulty check. Feeds telemetry; never blocks progress.
  hopsonCheck() {
    try {
      const opts = ['too_easy', 'making_progress', 'too_hard_lost', 'too_hard_dying'];
      const el = document.getElementById('hopson-check');
      if (!el) return;
      el.classList.remove('hidden');
      el.innerHTML = `<div class="overlay-card"><p>${t('ui.hopson_q')}</p>` +
        opts.map(o => `<button class="big-btn ghost" data-h="${o}" style="margin:4px">${t('ui.hopson_' + o)}</button>`).join('') + `</div>`;
      el.querySelectorAll('[data-h]').forEach(b => b.onclick = () => {
        try { Telemetry.design('playtest:hopson:m' + (this.missionIndex + 1) + ':' + b.dataset.h, 1); } catch (e) {}
        el.classList.add('hidden');
      });
      setTimeout(() => el.classList.add('hidden'), 15000);  // auto-dismiss; never traps the player
    } catch (e) {}
  },

  /* ---------- rendering ---------- */
  drawTerrain() {
    const ctx = this.ctxT, v = this.view;
    ctx.clearRect(0, 0, this.W, this.H);
    // backdrop
    ctx.fillStyle = this.bgGrad || '#0a0e1a'; ctx.fillRect(0, 0, this.W, this.H);
    for (let y = 0; y < this.grid.h; y++) for (let x = 0; x < this.grid.w; x++) {
      const t = terrainAt(this.grid, x, y);
      const px = v.ox + x * v.tile, py = v.oy + y * v.tile;
      ctx.fillStyle = t.color;
      ctx.fillRect(px + 1, py + 1, v.tile - 2, v.tile - 2);
      if (this.grid.cells[y][x] === 'cover') {
        ctx.fillStyle = '#2de2e6';
        ctx.globalAlpha = .25;
        ctx.fillRect(px + 1, py + 1, v.tile - 2, 5);
        ctx.globalAlpha = 1;
      }
      if (this.grid.cells[y][x] === 'rough') {
        ctx.strokeStyle = '#4a3f6e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px + 6, py + v.tile - 8); ctx.lineTo(px + v.tile - 6, py + 8); ctx.stroke();
      }
      // Round 159 — scorched (environmental storytelling): 3 parallel claw slashes.
      // The VEX legend told through the arena — previous duelists died here.
      if (this.grid.cells[y][x] === 'scorched') {
        ctx.strokeStyle = '#3a2a3a'; ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const oy = py + 8 + i * ((v.tile - 16) / 2);
          ctx.beginPath(); ctx.moveTo(px + 8, oy); ctx.lineTo(px + v.tile - 8, oy + 4); ctx.stroke();
        }
      }
      // grid coordinates (Round 24 — table stakes for tactics)
      ctx.fillStyle = 'rgba(143,163,200,.5)';
      ctx.font = `${Math.max(8, Math.round(v.tile * .22 * this.textScale))}px sans-serif`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(String.fromCharCode(65 + x) + (y + 1), px + 3, py + 2);
    }
    // move range highlight
    if (this.selected && this.moveInfo) {
      ctx.fillStyle = 'rgba(45,226,230,.22)';
      for (const k of Object.keys(this.moveInfo.dist)) {
        const [x, y] = k.split(',').map(Number);
        ctx.fillRect(v.ox + x * v.tile + 1, v.oy + y * v.tile + 1, v.tile - 2, v.tile - 2);
      }
    }
    this.terrainDirty = false;
  },

  drawUnits() {
    const ctx = this.ctxU, v = this.view;
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.save();
    if (this.trauma > 0) {
      // trauma² shaping + smooth noise (Round 37) — never random jumps
      const s = this.trauma * this.trauma * 20, t = this.time / 1000;
      const nx = Math.sin(t * 39.7) * 0.6 + Math.sin(t * 17.3) * 0.4;
      const ny = Math.cos(t * 44.3) * 0.6 + Math.cos(t * 19.1) * 0.4;
      ctx.translate(nx * s, ny * s);
    }
    // intents (enemy plans) — Round 133: APX "Leave It There" — persistent across phases,
    // not just player phase. Cognitive: don't rely on memory; the plan stays visible while it executes.
    if (this.phase === 'player' || this.phase === 'enemy') {
      ctx.strokeStyle = '#ff5d5d'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
      ctx.globalAlpha = .55;
      for (const it of this.intents) {
        ctx.beginPath();
        ctx.moveTo((it.from.x + .5) * v.tile + v.ox, (it.from.y + .5) * v.tile + v.oy);
        ctx.lineTo((it.to.x + .5) * v.tile + v.ox, (it.to.y + .5) * v.tile + v.oy);
        ctx.stroke();
        // ⚠ over the target + expected damage number (StS: "intends to attack for 6 damage")
        ctx.font = `${Math.round(v.tile * .4 * this.textScale)}px sans-serif`;
        ctx.fillText('⚠', (it.to.x + .5) * v.tile + v.ox - v.tile * .2, (it.to.y + .15) * v.tile + v.oy);
        ctx.font = `${Math.round(v.tile * .32 * this.textScale)}px sans-serif`;
        ctx.fillStyle = '#fff';
        ctx.fillText(it.dmg + '', (it.to.x + .5) * v.tile + v.ox + v.tile * .18, (it.to.y + .15) * v.tile + v.oy);
        ctx.fillStyle = '#ff5d5d';
      }
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    const all = [...this.playerMechs, ...this.enemyMechs].sort((a, b) => a.y - b.y);
    for (const m of all) {
      // Round 169 — kill confirm: dying mechs fade + shrink over 0.5s instead of
      // popping out of existence. Fully dead (dying <= 0) skips like before.
      const dying = !mechAlive(m) && m.dying > 0;
      if (!mechAlive(m) && !dying) continue;
      const fadeK = dying ? Math.max(0, m.dying / 0.5) : 1;
      const bob = Math.sin(this.time / 450 + m.id * 1.7) * 2;   // idle aliveness
      const px = v.ox + m.x * v.tile, py = v.oy + m.y * v.tile + bob;
      // Round 178 — apply recoil offset (decays in update)
      if (m.recoil && m.recoil.t > 0 && !this.reducedEffects) { const rk = m.recoil.t / 0.18;
        px += m.recoil.dx * rk; py += m.recoil.dy * rk; }
      // selection ring
      if (m === this.selected) {
        ctx.strokeStyle = '#f9f871'; ctx.lineWidth = 3;
        ctx.strokeRect(px + 2, py + 2, v.tile - 4, v.tile - 4);
      }
      // attackable highlight
      if (this.attackTargets.includes(m)) {
        ctx.strokeStyle = '#ff5d5d'; ctx.lineWidth = 3;
        ctx.strokeRect(px + 2, py + 2, v.tile - 4, v.tile - 4);
      }
      // squash-and-stretch on hit (Round 37 — Nijman's "give things mass")
      // Round 169 — kill-confirm fade: dying mechs shrink + fade (globalAlpha + scale).
      const drawScale = dying ? 0.6 + 0.4 * fadeK : 1;
      if (fadeK < 1) ctx.globalAlpha = fadeK;
      if (m.squash > 0 && !this.reducedEffects) {
        const sq = Math.min(1, m.squash / 0.18);
        const cx = px + v.tile / 2, cy = py + v.tile / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale((1 + 0.22 * sq) * drawScale, (1 - 0.22 * sq) * drawScale); ctx.translate(-cx, -cy);
        drawMech(ctx, m, px + 4, py + 2, v.tile - 8, v.tile - 4, {});
        ctx.restore();
      } else if (drawScale < 1) {
        const cx = px + v.tile / 2, cy = py + v.tile / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(drawScale, drawScale); ctx.translate(-cx, -cy);
        drawMech(ctx, m, px + 4, py + 2, v.tile - 8, v.tile - 4, {});
        ctx.restore();
      } else {
        drawMech(ctx, m, px + 4, py + 2, v.tile - 8, v.tile - 4, {});
      }
      if (fadeK < 1) ctx.globalAlpha = 1;
      // windup ring — anticipation beat (Round 37)
      if (m.windup > 0 && !this.reducedEffects) {
        const k = Math.min(1, m.windup / 0.25);
        ctx.strokeStyle = '#ff5d5d'; ctx.lineWidth = 3;
        ctx.globalAlpha = 0.35 + 0.65 * k;
        const pad = 3 * k;
        ctx.strokeRect(px + 2 - pad, py + 2 - pad, v.tile - 4 + pad * 2, v.tile - 4 + pad * 2);
        ctx.globalAlpha = 1;
      }
      // faction badge: shape + color double-coding (never color alone)
      const bcx = px + v.tile / 2, bcy = py - 4, br = Math.max(4, v.tile * 0.09);
      ctx.save();
      ctx.fillStyle = m.team === 'player' ? PLAYER_COLOR : ENEMY_COLOR;
      ctx.strokeStyle = '#0a0e1a'; ctx.lineWidth = 2;
      ctx.beginPath();
      if (m.team === 'player') ctx.arc(bcx, bcy, br, 0, 7);
      else { ctx.moveTo(bcx, bcy - br); ctx.lineTo(bcx + br, bcy + br); ctx.lineTo(bcx - br, bcy + br); ctx.closePath(); }
      ctx.fill(); ctx.stroke();
      ctx.restore();
      // hp bar (torso)
      const t = m.limbs.torso;
      const bw = v.tile - 16;
      ctx.fillStyle = '#10131f';
      ctx.fillRect(px + 8, py + v.tile - 8, bw, 5);
      ctx.fillStyle = t.hp / t.max > .5 ? '#7dff8a' : t.hp / t.max > .25 ? '#f9f871' : '#ff5d5d';
      ctx.fillRect(px + 8, py + v.tile - 8, bw * (t.hp / t.max), 5);
      // acted dim
      if (m.acted && m.team === 'player') {
        ctx.fillStyle = 'rgba(10,14,26,.45)';
        ctx.fillRect(px, py, v.tile, v.tile);
      }
    }
    ctx.restore();
    this.unitsDirty = false;
  },

  drawFx(dt) {
    // idle-to-zero (Round 43): skip the full-screen clear when nothing is drawn —
    // a static board costs zero fill, per WebKit's power guidance
    const hasFx = this.coachTarget || this.banner || this.flashes.length ||
      this.particles.length || this.floaters.length;
    if (!hasFx) {
      if (!this.fxClean) { this.ctxF.clearRect(0, 0, this.W, this.H); this.fxClean = true; }
      return;
    }
    this.fxClean = false;
    const ctx = this.ctxF;
    ctx.clearRect(0, 0, this.W, this.H);
    // FTUE coach target ring (Round 29): pulsing marker on the thing to tap
    // Round 145 — stuck pulse (Hollow Knight): after 8s idle, the ring pulses faster/brighter.
    // Context-sensitive help — the nudge escalates only when the player is stuck.
    if (this.coachTarget && this.grid) {
      const v = this.view, cx = v.ox + (this.coachTarget.x + .5) * v.tile, cy = v.oy + (this.coachTarget.y + .5) * v.tile;
      const idleMs = Date.now() - (this._lastInputT || Date.now());
      const stuck = idleMs > 8000;
      // Round 157 — stuck-point map (Liu eye-tracking substitute): log one event per
      // stuck episode (8s idle during a coach mark). This IS the tutorial funnel's
      // drop-off locator — where gaze fails, not task difficulty.
      if (stuck && !this._stuckLogged && this.coachTarget) {
        this._stuckLogged = true;
        try { Telemetry.design('tutorial:stuck:' + (Tutorial.step || 'none'), 1); } catch (e) {}
      } else if (!stuck) {
        this._stuckLogged = false;
      }
      // Round 211 — urgent (5s stall) escalates like stuck: faster pulse, orange.
      const urgent = stuck || (this.coachTarget.urgent === true);
      const r = v.tile * (.45 + .08 * Math.sin(Date.now() / (urgent ? 110 : 220)));
      ctx.strokeStyle = urgent ? '#ffb347' : '#2de2e6'; ctx.lineWidth = urgent ? 4 : 3;
      ctx.globalAlpha = urgent ? 1 : .9;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // phase banner
    if (this.banner) {
      const b = this.banner; b.t += dt;
      const life = 1.4;
      if (b.t >= life) this.banner = null;
      else {
        const p = b.t / life;
        const scale = this.reducedEffects ? 1
          : p < 0.15 ? 0.7 + (p / 0.15) * 0.4 : 1.1 - Math.min(0.1, (p - 0.15) * 0.25);
        const alpha = p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.W / 2, this.H * 0.38);
        ctx.scale(scale, scale);
        ctx.font = `800 ${Math.round(38 * this.textScale)}px -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        // fit-to-width: never clip the banner at large text scales (Round 41)
        const maxW = this.W * 0.92;
        const tw = ctx.measureText(b.text).width * scale;
        if (tw > maxW) { const k = maxW / tw; ctx.scale(k, k); }
        ctx.strokeStyle = '#0a0e1a'; ctx.lineWidth = 6;
        ctx.strokeText(b.text, 0, 0);
        ctx.fillStyle = b.color;
        ctx.fillText(b.text, 0, 0);
        ctx.restore();
        ctx.textAlign = 'left';
      }
    }
    // impact flashes
    const v = this.view;
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const fl = this.flashes[i];
      fl.t -= dt;
      if (fl.t <= 0) { this.flashes.splice(i, 1); continue; }
      ctx.globalAlpha = (fl.t / 0.15) * 0.55;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(v.ox + fl.x * v.tile, v.oy + fl.y * v.tile, v.tile, v.tile);
    }
    ctx.globalAlpha = 1;
    // projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.t += dt * 3;
      if (p.t >= 1) { this.projectiles.splice(i, 1); continue; }
      const x = p.x1 + (p.x2 - p.x1) * p.t, y = p.y1 + (p.y2 - p.y1) * p.t;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill();
      ctx.globalAlpha = .4;
      ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) { this.particles.splice(i, 1); if (this._pPool) this._pPool.push(p); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt;
      ctx.globalAlpha = p.life / p.max;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    // floaters
    ctx.textAlign = 'center';
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.life -= dt; f.y -= 24 * dt;
      if (f.life <= 0) { this.floaters.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, f.life / (f.max * .5));
      const age = 1 - f.life / f.max;
      const pop = age < 0.25 ? 1 + (1 - age / 0.25) * 0.6 : 1;   // damage-number pop
      ctx.font = `700 ${Math.round(f.size * pop * this.textScale)}px -apple-system, sans-serif`;
      ctx.strokeStyle = '#0a0e1a'; ctx.lineWidth = 4;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
    if (this.trauma > 0) this.trauma = Math.max(0, this.trauma - dt * 0.5);  // trauma decay (Round 37)
    for (const m of [...this.playerMechs, ...this.enemyMechs]) {  // transient feel timers
      if (m.windup > 0) m.windup -= dt;
      if (m.squash > 0) m.squash -= dt;
      if (m.recoil && m.recoil.t > 0) m.recoil.t -= dt;  // Round 178
      if (m.dying > 0) m.dying -= dt;  // Round 169 — kill-confirm fade decay
      if (m.limbFlash && m.limbFlash.t > 0) m.limbFlash.t -= dt;  // hit flash decay (Round 53)
    }
  },

  loop(t) {
    if (this.hiddenPause) return;  // tab hidden — rAF paused (Round 30, battery)
    const rawDt = Math.min(.1, (t - (this.lastT || t)) / 1000);
    this.lastT = t; this.time = t;
    try { Perf.frame(rawDt * 1000); } catch (e) {}
    // hit-stop: freeze the frame on impact
    if (this.hitStop > 0) {
      this.hitStop -= rawDt;
      // Round 301 — post-freeze tail (Dead Cells): when the freeze ends, dip
      // time-scale to 0.35x for 70ms. Weight comes from the dip, not the freeze.
      if (this.hitStop <= 0 && !this.reducedEffects) this.slowmo = 0.07;
      requestAnimationFrame((t2) => this.loop(t2));
      return;
    }
    let dt = Math.min(.05, rawDt);
    // slow-mo tail: time-scale dip after hit-stop ends
    if (this.slowmo > 0) { this.slowmo -= rawDt; dt *= 0.35; }
    if (this.terrainDirty && this.grid) Perf.time('terrain', () => this.drawTerrain());
    // idle bob needs continuous unit redraw during battle — skipped in reduced-effects
    // (Round 43: WebKit idle-to-zero — a static board draws nothing, saving battery)
    if (!this.reducedEffects && (this.phase === 'player' || this.phase === 'enemy') && this.grid) this.unitsDirty = true;
    if (this.unitsDirty) Perf.time('units', () => this.drawUnits());
    this.runEnemyPhase(dt);
    Perf.time('fx', () => this.drawFx(dt));
    requestAnimationFrame((t2) => this.loop(t2));
  },
};

// Round 127 — font preload gate (Mozilla canvas warning): @font-face downloads only on
// first use, and canvas has no auto re-render — text drawn before the font loads stays
// wrong/tofu forever. Gate boot on document.fonts.ready with a 2.5s timeout fallback
// (game must never hang on a font CDN failure). iOS falls back per-glyph to Hiragino.
window.addEventListener('load', () => {
  const boot = () => Game.init();
  try {
    let booted = false;
    const once = () => { if (!booted) { booted = true; boot(); } };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(once).catch(once);
      setTimeout(once, 2500);
    } else once();
  } catch (e) { boot(); }
});
