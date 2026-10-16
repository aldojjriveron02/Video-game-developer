# Mobile Safari Perf Profiling for HTML5 Canvas Games — Findings (Round 30)
**Date:** Tue 2026-10-13 ~23:10 EDT · **Source:** live web research 2026-10-13 (WebKit blog, MDN, Stack Overflow, AG Grid, motion.dev, Apple Support, Android Developers, PlayCanvas, web.dev)
**Project:** Mecha Protocol — 60fps on the iPhone 17, engineered

## A. Safari devtools profiling
- iOS: Settings → Safari → Advanced → Web Inspector ON; Mac: Develop menu → device → page. USB or Wi-Fi.
- **Rendering Frames timeline = THE tool:** FPS meter (live counter + graph), per-frame bars; long frames visually pop against the 16.7ms budget.
- Long frames vs GC: JS & Events timeline + Memory timeline (GC events). Spike coinciding with GC = allocation problem; tall frames without GC = draw cost.

## B. Usual suspects + fixes
1. **Uncapped DPR** — iPhone DPR 3 → 9× pixels; ×3 layered canvases. Fix: cap render scale at 2 (CSS upscale); PlayCanvas changes DPR at runtime.
2. **shadowBlur** — MDN: "avoid whenever possible." Pre-bake glow into sprites.
3. **Per-frame gradients** — create once at init, reuse.
4. **Per-frame allocations** — pool particles/projectiles/floaters; no closures in the hot loop.
5. **Layout thrashing** — DOM updates only on state change, never per frame.
6. **Transparency** — `{ alpha: false }` on opaque layers; layered canvases endorsed by MDN but each costs memory + a compositing pass.
7. **backdrop-filter / CSS blur** — runs on CPU in Safari, tanks FPS. Pre-blurred images instead.
8. **Per-frame text** — pre-render floating text to offscreen canvases; avoid drawImage scaling; Math.floor coords; rAF.

## C. Particle/effect budgets
- ~1,000–3,000 simple fillRect/drawImage particles = comfortably 60fps-safe on a 2024–2026 iPhone; 10,000+ needs pre-rendered sprites + batching. [iPhone-17-specific headroom unverified — verify on-device.]
- **AG Grid benchmark: per-point state changes 287.1ms → single batched fill 15.4ms (18.6×).** Per-particle state changes are the killer, not pixel count.
- globalAlpha/composite changes break batching — sort draws by op or bake alpha into sprites.

## D. Battery & thermal
- Continuous rAF = sustained CPU/GPU/display wakeups = the drain.
- **iOS Low Power Mode throttles rAF to 30fps** (WebKit bug 168837) → delta-time loop required (fixed-step runs at half speed).
- Thermal: frame times creep after minutes of sustained play; sustained CPU >50% throttles within minutes.
- Mitigations: pause rAF on visibilitychange + when idle; reduce-effects mode; 60fps cap on mobile (not 120).

## E. On-device measurement (no Mac)
- In-game HUD: performance.now() deltas → ring buffer → frame-time histogram.
- **Percentiles, not average FPS.** "Slow session" = >25% of frames below 20 FPS. Target: p95 ≤ 16.7ms; p99 > 33ms = jank bug.

## F. PWA vs Safari tab
- No documented rendering difference on modern iOS (2011-era no-JIT note long fixed). Verify empirically with the same HUD in both.

## G. Graceful degradation
- **Dynamic resolution scaling:** rolling p95 → step 3→2→1.5→1 (hysteresis against oscillation); startup benchmark sets initial tier.
- Effect toggles: particle cap, shake off, hit-stop off. **prefers-reduced-motion = accessibility + free perf tier.**
- Auto-detect = the frame-time governor (no UA sniffing). Degradation order: particle cap → render scale → shake/hit-stop off → intentional 30fps.

## Applied to Mecha Protocol (implement-immediately, this round)
- **New `js/perf.js`:** frame-time ring buffer (p50/p95/p99, % over 16.7ms), per-layer draw timings (terrain/units/fx), automatic quality governor (p95 > 20ms ×3 evals → step down: particle cap 300→150→75→50, render scale 2→1.5→1.25→1; sustained headroom → step up). Toggle HUD with `?perf=1` (persisted). Telemetry: `perf:gov:<level>`.
- **Already had:** DPR capped at 2, delta-time loop (Low Power Mode safe).
- **Added:** `{ alpha: false }` on the opaque terrain layer; backdrop gradient cached per resize (was per-draw); particle cap 300 (governor-controlled, oldest dropped); floater cap 30; rAF paused on `visibilitychange`; hit-stop now respects reduced-effects; **prefers-reduced-motion auto-enables reduced effects** (unless the player chose).
- Verified in harness: governor steps down under jank (cap 150, resize fired), recovers with hysteresis, p95 math correct. 2,038 lines, all syntax-clean.

## H. Sources
webkit.org (web inspector; rendering frames timeline; timelines tab) · developer.mozilla.org (optimizing canvas; prefers-reduced-motion) · stackoverflow.com (10k particles) · ag-grid.com (batching benchmark) · motion.dev + bugs.webkit.org (rAF throttle) · support.apple.com (power modes; thermal) · infoq.com (sustained iOS perf) · developer.android.com (percentile metrics) · developer.playcanvas.com (runtime DPR) · web.dev (reduced motion) · graffino.com, webdong.dev (Safari blur)
