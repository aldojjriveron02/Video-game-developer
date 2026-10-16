/* Mecha Protocol — $0 music engine (Round 27)
 * File-based OGG loops + STATES model (Into the Breach: menu ambience /
 * deployment silence / battle on first contact). No tracks shipped yet —
 * see audio/README.md. Every call is a silent no-op without tracks,
 * so the game runs SFX-only today. */
'use strict';

const Music = {
  ctx: null,
  tracks: {},          // name -> AudioBuffer
  current: null,       // { name, src, gain }
  state: 'off',
  musicBus: null, sfxBus: null, uiBus: null,

  init() {
    const ctx = SFX.ensure(); if (!ctx) return;
    if (this.ctx === ctx && this.musicBus) return;
    this.ctx = ctx;
    // bus architecture: music/sfx/ui gains -> master compressor -> destination
    this.musicBus = ctx.createGain(); this.musicBus.gain.value = 0.55;
    this.sfxBus = ctx.createGain();   this.sfxBus.gain.value = 1.0;
    this.uiBus = ctx.createGain();    this.uiBus.gain.value = 0.8;
    // audio mutes (Round 55 — AGI "Multiple Volume Controls"): applied on bus creation
    try {
      const s = (window.Game && Game.saveData && Game.saveData.settings) || {};
      if (s.musicMuted) { this.musicBus.gain.value = 0; this._musicMuted = true; }
      if (s.sfxMuted) { this.sfxBus.gain.value = 0; this.uiBus.gain.value = 0; }
    } catch (e) {}
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 6;
    this.musicBus.connect(comp); this.sfxBus.connect(comp); this.uiBus.connect(comp);
    // Route through the SFX master gain (Round 224 volume/mute) when it exists —
    // otherwise the master slider/mute drive a gain node with no signal path.
    comp.connect((window.SFX && SFX.master) || ctx.destination);
    // iOS: play through the silent switch (Safari 16.4+)
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch (e) {}
    // iOS 15+: AudioContext suspends on lock/background — re-sync on return
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) { try { this.ctx.suspend(); } catch (e) {} }
      else { SFX.ensure(); }
    });
    // WebKit-only 'interrupted' state (call/lock): currentTime freezes and any
    // scheduled tones would pile up and machine-gun on return — re-sync instead
    try {
      this.ctx.onstatechange = () => {
        if (this.ctx.state === 'interrupted') { try { this.ctx.resume(); } catch (e) {} }
      };
    } catch (e) {}
  },

  // format fallback (Round 46 — Safari cannot decode Vorbis per MDN codec guide,
  // so an .ogg-only pipeline is silent on iPhone; pick per-browser extension)
  _pickExt() {
    if (this._ext) return this._ext;
    let ext = '.ogg';
    try {
      const a = document.createElement('audio');
      const m4a = a.canPlayType ? a.canPlayType('audio/mp4; codecs="mp4a.40.2"') : '';
      const ogg = a.canPlayType ? a.canPlayType('audio/ogg; codecs="vorbis"') : '';
      if (m4a === 'probably' || (m4a === 'maybe' && ogg !== 'probably')) ext = '.m4a';
    } catch (e) {}
    this._ext = ext;
    return ext;
  },

  load(name, base) {
    if (!this.ctx || this.tracks[name]) return;
    const url = base + this._pickExt();  // base has no extension: 'audio/hangar'
    fetch(url).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(ab => this.ctx.decodeAudioData(ab))
      .then(buf => { this.tracks[name] = buf; })
      .catch(() => { /* no track yet — stay silent */ });
  },

  play(name, fade) {
    if (!this.ctx || !this.tracks[name]) return;           // no track: silent no-op
    if (this.current && this.current.name === name) return;
    const ctx = this.ctx, t0 = ctx.currentTime, f = fade || 2;
    this.init();
    // fade out current
    if (this.current) {
      const old = this.current;
      old.gain.gain.setTargetAtTime(0.0001, t0, f / 3);
      setTimeout(() => { try { old.src.stop(); } catch (e) {} }, f * 1000 + 200);
    }
    // start new loop (AudioBufferSourceNode loop=true = gapless; never HTMLAudioElement)
    const src = ctx.createBufferSource();
    src.buffer = this.tracks[name]; src.loop = true;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.setTargetAtTime(1.0, t0, f / 3);
    src.connect(g); g.connect(this.musicBus);
    src.start(t0);
    this.current = { name, src, gain: g };
  },

  // audio mutes (Round 55): separate SFX / Music channels, persisted
  setMuted(which, muted) {
    try {
      if (which === 'music' && this.musicBus) { this._musicMuted = !!muted; this.musicBus.gain.value = muted ? 0 : 0.55; }
      if (which === 'sfx') {
        if (this.sfxBus) this.sfxBus.gain.value = muted ? 0 : 1.0;
        if (this.uiBus) this.uiBus.gain.value = muted ? 0 : 0.8;
      }
    } catch (e) {}
  },

  // brief dip under big SFX moments (explosions, victory)
  duck(amount, release) {
    if (!this.ctx || !this.musicBus || !this.current) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setTargetAtTime(1 - (amount || 0.35), t, 0.05);
    // recover to the muted-aware level — never unmute muted music
    this.musicBus.gain.setTargetAtTime(this._musicMuted ? 0 : 0.55, t + 0.15, release || 0.5);
  },

  stop(fade) {
    if (!this.ctx || !this.current) { this.state = 'off'; return; }
    const old = this.current, f = fade || 1.5;
    old.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, f / 3);
    setTimeout(() => { try { old.src.stop(); } catch (e) {} }, f * 1000 + 200);
    this.current = null; this.state = 'off';
  },

  // STATES model: 'menu' (SILENCE — Prunty's rule, Round 87) | 'deploy' (SILENCE + ambient — Round 109) | 'battle' (first contact) | 'off'
  setState(state) {
    if (this.state === state) return;
    // Round 134 — hysteresis (Abratabia): minimum 4s per state (one musical phrase) + ignore
    // rapid re-entry. Stops jitter from state flapping (e.g., assist toggles, selection changes).
    const now = Date.now() / 1000;
    if (this._lastChange && (now - this._lastChange) < 4 && state !== 'battle') return;
    this._lastChange = now;
    this.state = state;
    this.init();
    if (state === 'menu') this.stop(2.5);  // Round 87: strategic silence — music enters at combat, not in hangar
    else if (state === 'deploy') this.stop(2.0);  // Round 109: deployment silence (Prunty — tension before battle)
    else if (state === 'battle') this.play('battle', 1.5);
    else this.stop(1.5);
  },
};
