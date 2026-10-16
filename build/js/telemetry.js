/* Mecha Protocol — GameAnalytics telemetry (Round 18).
   SETUP: Aldo creates a free game at gameanalytics.com → game settings →
   pastes the Game Key + Secret Key below. Until then: completely silent,
   game runs identically. Telemetry NEVER crashes gameplay (guard-wrapped). */
'use strict';

const GA_GAME_KEY = 'PASTE_GAME_KEY_HERE';
const GA_SECRET_KEY = 'PASTE_SECRET_KEY_HERE';
const GA_BUILD = '0.1.0';

const Telemetry = {
  GA: null, enabled: false, _retried: false,

  init() {
    try {
      let consent = null;
      try { consent = localStorage.getItem('mecha-protocol-analytics'); } catch (e) {}
      if (consent === '0') return;                                 // Round 62: consent declined → no remote tracking

      if (navigator.doNotTrack === '1') return;                          // respect DNT
      if (!GA_GAME_KEY || GA_GAME_KEY === 'PASTE_GAME_KEY_HERE') return; // no keys → silent
      if (!window.gameanalytics) {                                      // SDK not loaded → inject it, then init
        if (!this._retried) {
          this._retried = true;
          const s = document.createElement('script');
          s.async = true;
          s.src = 'https://unpkg.com/gameanalytics/dist/GameAnalytics.min.js';
          s.onload = () => this.init();
          document.head.appendChild(s);
        }
        return;
      }
      const GA = gameanalytics.GameAnalytics;
      GA.configureBuild(GA_BUILD);
      GA.configureAvailableCustomDimensions01(['easy', 'normal', 'hard']);
      GA.initialize(GA_GAME_KEY, GA_SECRET_KEY);
      GA.startSession();
      if (window.Game && Game.difficulty) GA.setCustomDimension01(Game.difficulty);
      this.GA = GA; this.enabled = true;
      this._run(g => g.addDesignEvent('session:start', 1));
    } catch (e) { this.enabled = false; }
  },

  _run(fn) { try { if (this.enabled && this.GA) fn(this.GA); } catch (e) {} },

  setConsent(v) {                                                    // Round 62: first-launch consent / Help toggle
    try { localStorage.setItem('mecha-protocol-analytics', v ? '1' : '0'); } catch (e) {}
    if (v && !this.enabled) { this._retried = false; this.init(); }  // opted in late → initialize now
    if (!v && this.enabled) { this.enabled = false; this.GA = null; } // opted out → stop
  },

  setDifficulty(d) { this._run(g => g.setCustomDimension01(d)); },
  design(id, value) { this._run(g => g.addDesignEvent(id, value)); },
  saveEvent(action) { this._run(g => g.addDesignEvent('save:' + action, 1)); },  // resume/export/import/abandon

  missionStart(n) {
    this._run(g => g.addProgressionEvent(gameanalytics.EGAProgressionStatus.Start, 'mission', String(n)));
  },
  missionComplete(n, turns) {
    this._run(g => g.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, 'mission', String(n), turns));
  },
  missionFail(n, seconds) {
    this._run(g => g.addProgressionEvent(gameanalytics.EGAProgressionStatus.Fail, 'mission', String(n), seconds));
  },
  errorEvent(msg) {
    this._run(g => g.addErrorEvent(gameanalytics.EGAErrorSeverity.Warning, String(msg).slice(0, 64)));
  },
  // retention foundation (Round 44): local day-streak + day-N tracking, works with or
  // without GA keys — the Daily Sortie (seeded daily challenge) builds on this
  trackRetention() {
    try {
      const ld = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      const today = ld(new Date());
      const yesterday = ld(new Date(Date.now() - 864e5));
      let first = null;
      try { first = localStorage.getItem('mecha-protocol-firstday'); } catch (e) {}
      if (!first) { try { localStorage.setItem('mecha-protocol-firstday', today); } catch (e) {} first = today; }
      let streak = 0;
      try { streak = parseInt(localStorage.getItem('mecha-protocol-streak') || '0', 10) || 0; } catch (e) {}
      let last = null;
      try { last = localStorage.getItem('mecha-protocol-lastday'); } catch (e) {}
      if (last !== today) {
        streak = (last === yesterday) ? streak + 1 : 1;
        try {
          localStorage.setItem('mecha-protocol-streak', String(streak));
          localStorage.setItem('mecha-protocol-lastday', today);
        } catch (e) {}
        const dayN = Math.round(((new Date(today + 'T12:00:00')) - (new Date(first + 'T12:00:00'))) / 864e5);
        try { this.design('retention:day_' + dayN, 1); } catch (e) {}
        try { this.design('retention:streak_' + Math.min(streak, 30), 1); } catch (e) {}
      }
      try { Game.playerStreak = streak; } catch (e) {}
    } catch (e) {}
  },

  shutdown() {
    // Round 156 — session-end audio snapshot (nuisance score): what % of sessions
    // end with SFX/music muted = proxy for mix/loop quality (r/gamedev mute-rate).
    try {
      const d = (window.SaveStore && SaveStore.read && SaveStore.read()) || {};
      const s = d.settings || {};
      if (s.sfxMuted) this._run(g => g.addDesignEvent('audio:session_end:sfx_muted', 1));
      if (s.musicMuted) this._run(g => g.addDesignEvent('audio:session_end:music_muted', 1));
    } catch (e) {}
    this._run(g => g.endSession());
  },   // flush queue — call on pagehide
};
