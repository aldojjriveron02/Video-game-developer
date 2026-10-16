/* Mecha Protocol — $0 WebAudio SFX synth (Round 31 upgrade)
 * Recipes from live research: jsfxr default presets (laser/explosion/
 * hit/pickup), BBC gunshot voice-pool pattern, 3-tier combat hierarchy
 * (critical/standard/UI with ducking + frequency carving via buses).
 * No audio assets needed — everything synthesized. */
'use strict';

const SFX = {
  ctx: null,
  _voices: 0,
  MAX_VOICES: 12,   // BBC-style voice cap: steal/drop beyond this

  // Must be called from a user gesture (iOS requirement). Safe to call often.
  master: null,  // Round 224 — master gain (persisted volume + mute)
  _vol: 1, _muted: false,

  // Round 224 — judge-proofing (SunoBoard: "judges play in offices and at night").
  // Visible volume + persisted mute. DOM + bus only; frozen systems untouched.
  loadVol() {
    try {
      const v = JSON.parse(localStorage.getItem('mecha-protocol-volume') || '{}');
      this._vol = (typeof v.vol === 'number') ? Math.min(1, Math.max(0, v.vol)) : 1;
      this._muted = !!v.muted;
    } catch (e) {}
  },
  saveVol() {
    try { localStorage.setItem('mecha-protocol-volume', JSON.stringify({ vol: this._vol, muted: this._muted })); } catch (e) {}
  },
  setVol(v) {
    this._vol = Math.min(1, Math.max(0, v)); this.saveVol(); this._applyVol();
  },
  setMuted(m) {
    this._muted = !!m; this.saveVol(); this._applyVol();
  },
  _applyVol() {
    try { if (this.master) this.master.gain.setTargetAtTime(this._muted ? 0 : this._vol, this.ctx.currentTime, 0.02); } catch (e) {}
  },

  ensure() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        // Round 198 — iOS silent-switch guard (also in music.js; idempotent, global)
        try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
        // Round 224 — master gain between buses and destination
        this.master = this.ctx.createGain();
        this.loadVol();
        this.master.gain.value = this._muted ? 0 : this._vol;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') this.ctx.resume();
      return this.ctx;
    } catch (e) { return null; }
  },

  _voice(priority) {
    // a frozen clock (suspended/interrupted) meters nothing real — reset instead of leaking
    if (!this.ctx || this.ctx.state !== 'running') { this._voices = 0; return true; }
    // Round 171 — priority steal (GameCraft): Tier 1 (kill-confirm, VEX stinger)
    // always wins a voice; normal SFX drop at cap.
    if (this._voices >= this.MAX_VOICES && !priority) return false;  // drop, don't stack
    this._voices++;
    return true;
  },
  _release() { this._voices = Math.max(0, this._voices - 1); },

  _bus(name) {
    try {
      if (window.Music && Music[name + 'Bus']) return Music[name + 'Bus'];
    } catch (e) {}
    return (this.master) || (this.ctx && this.ctx.destination) || null;
  },

  tone(freq, dur, type, vol, slideTo, delay, bus, severity, priority) {
    const ctx = this.ensure(); if (!ctx || !this._voice(priority)) return;
    const t0 = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    // Round 126 — pitch variation (Prosser): random ±1 semitone (1.06^N) per play.
    // Never play the exact same sample twice (anti-fatigue).
    // Round 144 — pitch as information: optional severity (0-3) shifts up by semitones.
    // Higher threat = higher pitch (aural juice reinforcing the intent readout).
    const sevShift = Math.pow(1.06, (typeof severity === 'number' ? severity : 0));
    const pitchShift = Math.pow(1.06, (Math.random() * 2 - 1)) * sevShift;
    o.frequency.setValueAtTime(freq * pitchShift, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo * pitchShift), t0 + dur);
    g.gain.setValueAtTime(vol || 0.1, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this._bus(bus || 'sfx') || ctx.destination);
    o.onended = () => this._release();
    o.start(t0); o.stop(t0 + dur + 0.02);
  },

  // filterType: 'lowpass' | 'highpass'; sweepTo: optional end freq
  noise(dur, vol, filterFreq, delay, filterType, sweepTo, bus, priority) {
    const ctx = this.ensure(); if (!ctx || !this._voice(priority)) return;
    const t0 = ctx.currentTime + (delay || 0);
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = filterType || 'lowpass';
    f.frequency.setValueAtTime(filterFreq || 1000, t0);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this._bus(bus || 'sfx') || ctx.destination);
    src.onended = () => this._release();
    src.start(t0);
  },

  /* ---------- UI tier (bus: ui — 2-5 kHz presence, quiet) ---------- */
  tick()    { this.tone(1400, 0.03, 'square', 0.025, null, 0, 'ui', 0, true); },  // Round 266: UI = Tier 1 priority
  // Round 141 — 70% heat alarm (AC6 pattern): two-tone warning ping, pre-threshold telegraph
  warn()    { this.tone(880, 0.08, 'square', 0.05, null, 0, 'ui', 0, true); this.tone(880, 0.08, 'square', 0.05, null, 0.12, 'ui', 0, true); },
  select()  { this.tone(520, 0.07, 'sine', 0.06, 880, 0, 'ui', 0, true); },
  confirm() { // rising two-tone — up = yes (jsfxr pickup DNA: 699 Hz, x1.335 arp)
              this.tone(699, 0.06, 'square', 0.05, null, 0, 'ui', 0, true);
              this.tone(933, 0.09, 'square', 0.05, null, 0.06, 'ui', 0, true); },
  error()   { // falling — down = no
              this.tone(440, 0.1, 'square', 0.05, 220, 0, 'ui', 0, true); },

  /* ---------- standard tier (voice-limited, pitch-jittered) ---------- */
  shoot() { // jsfxr LASER recipe: square 1316 Hz, -25.9 oct/s sweep, 0.23 s
    const j = 0.95 + Math.random() * 0.1;   // anti-machine-gun ±5%
    this.tone(1316 * j, 0.23, 'square', 0.055, 145 * j);
    this.noise(0.06, 0.04, 5000);
  },
  hit(priority)   { // jsfxr HIT: square 1868 Hz falling hard + noise thump
    const j = 0.9 + Math.random() * 0.2;
    this.tone(1868 * j, 0.19, 'square', 0.09, 200 * j, 0, null, 0, priority);
    this.noise(0.09, 0.13, 900 * j);
  },
  explode() { // layered: swept body + sub thump + HP crack
    const j = 0.9 + Math.random() * 0.2;
    this.noise(0.5, 0.26, 3000, 0, 'lowpass', 200);   // body: 3 kHz -> 200 Hz
    this.tone(60 * j, 0.32, 'sine', 0.24, 30);        // sub weight
    this.noise(0.04, 0.13, 3000, 0, 'highpass');      // transient crack
    try { if (window.Music) Music.duck(0.35, 0.6); } catch (e) {}
  },

  /* ---------- critical tier (always plays, ducks hard) ---------- */
  critical() { // limb destroyed / mech down / shutdown — Tier 1 (priority: always wins a voice)
    this.hit(true);
    this.noise(0.3, 0.2, 700, 0, null, null, null, true);
    try { if (window.Music) Music.duck(0.5, 0.35); } catch (e) {}
  },

  /* ---------- VEX identity kit (Round 31) ---------- */
  vexStinger() { // 3-note minor-2nd leitmotif, detuned saws — scarcity = identity (Tier 1 priority)
    const notes = [330, 349.23, 311.13];  // E4, F4, Eb4
    notes.forEach((f, i) => {
      this.tone(f, 0.3, 'sawtooth', 0.065, null, i * 0.17, null, 0, true);
      this.tone(f * 1.008, 0.3, 'sawtooth', 0.045, null, i * 0.17, null, 0, true);  // detune shimmer
    });
    try { if (window.Music) Music.duck(0.5, 0.4); } catch (e) {}
  },
  vexShot() { // signature timbre: lower register, longer tail than player weapons
    const j = 0.97 + Math.random() * 0.06;
    this.tone(220 * j, 0.34, 'sawtooth', 0.08, 55 * j);
    this.noise(0.12, 0.07, 1800);
  },

  phase(playerTurn) {
    if (playerTurn) { this.tone(440, 0.12, 'triangle', 0.08, 660, 0, 'ui', 0, true); this.tone(660, 0.14, 'triangle', 0.06, 880, 0.09, 'ui', 0, true); }
    else { this.tone(220, 0.16, 'triangle', 0.08, 147, 0, 'ui', 0, true); this.tone(147, 0.2, 'triangle', 0.06, 98, 0.1, 'ui', 0, true); }
  },
};
