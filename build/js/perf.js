/* Mecha Protocol — perf instrumentation + quality governor (Round 30)
 * Frame-time ring buffer (p50/p95/p99, % over budget), per-layer draw
 * timings, and an automatic governor: p95 > 20ms for 3 evaluations →
 * step down (particle cap → render scale); sustained headroom → step up.
 * Toggle HUD with ?perf=1 (persisted). */
'use strict';

const Perf = {
  on: false,
  frames: [],            // ms, ring buffer cap 240
  layerMs: { terrain: 0, units: 0, fx: 0 },
  govLevel: 0,           // 0 full → 4 minimal
  _hot: 0, _cool: 0, _eval: 0,
  _hud: null, _hudTick: 0,
  govHist: [],           // Round 258 — gov trace: [{level, scale}] for the two-trace graph (Fuller)

  init() {
    try {
      const p = new URLSearchParams(location.search);
      this.on = p.get('perf') === '1' || p.get('perf') === 'stress' || localStorage.getItem('mecha-protocol-perf') === '1';
      this.stress = p.get('perf') === 'stress';
      // Round 267 — resolution stress mode (Fuller DRS): ?perf=stress cycles the
      // governor every frame to expose resize/shader/sync issues. Debug only.
    } catch (e) {}
    if (this.on) this.buildHud();
    // Round 162 — Long Animation Frames observer (Chrome 123+): the modern jank
    // detector. Flags frames with >50ms main-thread blocking + script attribution.
    // Dev-only (?perf=1); logs to telemetry for field jank data.
    try {
      if (this.on && typeof PerformanceObserver !== 'undefined' &&
          PerformanceObserver.supportedEntryTypes &&
          PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
        this._loafCount = 0;
        const po = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (e.duration > 50) {
              this._loafCount++;
              try { Telemetry.design('perf:longframe', Math.round(e.duration)); } catch (e2) {}
            }
          }
        });
        po.observe({ type: 'long-animation-frame', buffered: true });
        this._loaf = po;
      }
      // Round 172 — longtask fallback (Safari blind spot): LoAF is Chromium-only.
      // The older longtask API works in Safari — secondary jank signal on iPhone.
      if (typeof PerformanceObserver !== 'undefined' &&
          PerformanceObserver.supportedEntryTypes &&
          PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        this._ltCount = 0;
        const lt = new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (e.duration > 50) {
              this._ltCount++;
              try { Telemetry.design('perf:longtask', Math.round(e.duration)); } catch (e2) {}
            }
          }
        });
        lt.observe({ type: 'longtask', buffered: true });
        this._longtask = lt;
      }
    } catch (e) {}
  },

  buildHud() {
    const d = document.createElement('div');
    d.id = 'perf-hud';
    d.style.cssText = 'position:fixed;top:2px;left:2px;z-index:99;background:rgba(0,0,0,.75);' +
      'color:#0f0;font:10px/1.5 monospace;padding:4px 6px;border-radius:4px;pointer-events:none;white-space:pre;';
    document.body.appendChild(d);
    this._hud = d;
  },

  frame(ms) {
    const f = this.frames;
    f.push(ms);
    if (f.length > 240) f.shift();
    // Low Power Mode detection (Round 71): iOS throttles rAF to ~30fps.
    // Sustained 30–36ms cadence = OS throttling (or a 30Hz display) → battery-saver.
    if (!this._lpChecked) {
      if (ms >= 30 && ms <= 38) this._lpFrames = (this._lpFrames || 0) + 1; else this._lpFrames = 0;
      if (this._lpFrames >= 180) {
        this._lpChecked = true; this.lowPower = true;
        this.govLevel = 4; this.applyGov();  // battery-saver: minimal particles + render scale 1
        try { Telemetry.design('perf:lowpower', 1); } catch (e) {}
        try { if (window.Game && Game.floater) Game.floater(Game.W / 2, Game.H / 2, t('ui.battery_saver'), '#7dff8a', 16); } catch (e) {}
      }
    }
    if (this.stress) { this.govLevel = (this.govLevel + 1) % 5; this.applyGov(); }  // Round 267: stress
    if (++this._eval < 60 || f.length < 120) return;
    this._eval = 0;
    // p95 of the window — TIME-WEIGHTED (Yosoygames, Round 321).
    // Naive p95 (95th frame by count) hides rare-but-long frames: 5 frames
    // at 100ms among 95 at 16ms = naive p95 of 16ms, but those 5 frames
    // are 25% of total TIME. Weight by duration: sort by frame time, find
    // the time value where cumulative duration hits 95% of total.
    const s = [...f].sort((a, b) => a - b);
    const total = s.reduce((a, b) => a + b, 0);
    let cum = 0, p95 = s[s.length - 1];
    for (const t of s) { cum += t; if (cum >= total * 0.95) { p95 = t; break; } }
    // Round 285 — panic mode (Fuller): p95 > 2 frames = presentation latency
    // exhausted. Don't wait 3 evals — drop to max degradation NOW, recover
    // gradually through the normal path (cool counter). Sawtooth prevented
    // by the same 12–20ms dead band on the way back up.
    if (p95 > 33 && this.govLevel < 4) {
      this.govLevel = 4; this._hot = 0; this._cool = 0; this.applyGov();
      try { Telemetry.design('perf:gov:panic', 1); } catch (e) {}
    }
    else if (p95 > 20) { this._hot++; this._cool = 0; }
    else if (p95 < 12) { this._cool++; this._hot = 0; }
    else { this._hot = 0; this._cool = 0; }
    if (this._hot >= 3 && this.govLevel < 4) { this.govLevel++; this._hot = 0; this.applyGov(); }
    else if (this._cool >= 10 && this.govLevel > 0) { this.govLevel--; this._cool = 0; this.applyGov(); }
    if (this.on) this.updateHud(p95);
  },

  applyGov() {
    // degradation order (Round 30): particle cap → render scale
    const caps = [300, 150, 150, 75, 50];
    const scales = [2, 2, 1.5, 1.25, 1];
    Game.particleCap = caps[this.govLevel];
    Game.renderScale = scales[this.govLevel];
    this.govHist.push({ level: this.govLevel, scale: scales[this.govLevel] });
    if (this.govHist.length > 40) this.govHist.shift();  // Round 258: keep the last 40 gov steps
    try { Game.resize(); } catch (e) {}
    try { Telemetry.design('perf:gov:' + this.govLevel, 1); } catch (e) {}
  },

  updateHud(p95) {
    if (!this._hud || ++this._hudTick % 2) return;
    const f = this.frames;
    const s = [...f].sort((a, b) => a - b);
    const pct = (q) => s[Math.floor(s.length * q)].toFixed(1);
    const over = f.filter(x => x > 12).length / f.length * 100;  // Round 181: practical JS budget 12ms (Sadil) — browser keeps the rest of the 16.7ms frame
    const long25 = f.filter(x => x > 25).length, long50 = f.filter(x => x > 50).length;  // Round 43
    // Round 276 — bottleneck signal (Fuller: DRS must read the right signal or it
    // degrades the wrong thing). LoAF/longtask = CPU-bound; p95 over budget with
    // no long tasks = likely fill-rate/GPU-bound (DPR step-down is the answer).
    const cpuHits = (this._loafCount || 0) + (this._ltCount || 0);
    const p95hud = parseFloat(pct(.95));
    const bottleneck = p95hud <= 12 ? 'OK' : (cpuHits > 0 ? 'CPU' : 'FILL?');
    const L = this.layerMs;
    this._hud.textContent =
      `p50 ${pct(.5)} p95 ${pct(.95)} p99 ${pct(.99)}ms | over ${over.toFixed(0)}%\n` +
      `>25ms ${long25} >50ms ${long50} | bottleneck ${bottleneck} | T ${L.terrain.toFixed(1)} U ${L.units.toFixed(1)} F ${L.fx.toFixed(1)}ms | Q${this.govLevel}` +
      `\nscale ${Game.renderScale}x | gov: ${this.govHist.map(h => h.scale).join('→') || '2x'}`;  // Round 258: two-trace graph (Fuller DRS)
  },

  // wrap a draw call to time it (only when HUD on)
  time(layer, fn) {
    if (!this.on) { fn(); return; }
    const t0 = performance.now();
    fn();
    this.layerMs[layer] = performance.now() - t0;
  },
};
