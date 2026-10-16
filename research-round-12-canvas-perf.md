# HTML5 Canvas Performance — Findings (Round 12)
**Date:** Tue 2026-10-13 ~20:48 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Strategy Game · vanilla JS + canvas, 60fps on mid-range phones incl. mobile Safari

## A. Rendering budgets
- Hardest numbers (davrous.com, 2013 — pessimistic floor): Surface RT ~100 sprites @60fps, Lumia 920 ~75 @60fps; desktop 500–1000. Modern mid-range phones far faster — treat 75–100 as floor, not ceiling.
- WildGames (Sept 2026, vendor blog): Canvas 2D smooth at ~500–1500 draw calls/frame @1080p60 on mid-range laptop; >2000 particles → prefer WebGL. <1000 moving objects fine for Canvas 2D.
- [synthesis] Our game: grid + ~6 mechs + highlights + numbers + a few hundred particles = low hundreds of drawImages/frame — comfortably inside even pessimistic budgets. **Per-call state changes matter more than raw draw count.**

## B. Layered rendering (validates our architecture)
- Kaiido (SO): "having more paint instructions will be what costs the most" — one full clearRect + batched paths beats many small clearRects. Pre-render static content to offscreen canvas, re-draw via single drawImage ("drawing bitmaps is super fast").
- Wax/MDN/HTML5Rocks: **layered canvases** — static terrain drawn ONCE on base canvas, dynamic content on transparent overlay. HTML5Rocks test: 300 sprites on one canvas dropped frames; multiple canvases unaffected.
- [synthesis] Pragmatic tactics approach: 3 stacked layers (static terrain / highlights+units / fx). **Skip dirty-rect bookkeeping** — complexity >> payoff at our scale. ✅ Our game.js ALREADY does exactly this (terrain/unit/fx layers + dirty flags) — research validates the choice.

## C. Atlas discipline
- iOS canvas limits: legacy 3MP (<256MB RAM) / 5MP; iPhone 6 Plus iOS 9.3.1: 4096×4096 (16.7MP). Verify with canvas-size tool on target device.
- ≤2048×2048 atlas = 16MB — safe even on legacy iOS. POT not required for canvas2D (WebGL/mipmap thing), but ≤2048² still right for old iPhones.
- Preload/decode all atlases before gameplay (image.decode() / warm-up drawImage) so first frames don't hitch. Batch draws per atlas (source-image switches are costly state changes).

## D. Particles on a budget
- **Never arc()/fill() per particle** (WildGames: per-particle arc ~12fps on mid-range laptop). Pre-render particle sprites once to offscreen, drawImage only.
- BuildNewGames (canonical): no allocation in hot loops — fixed object pool (live + free arrays); watch window.performance.memory.usedJSHeapSize. GC pauses cause visible FPS drops.
- [synthesis] Recipe: fixed pool 512–1024, pre-rendered sprites, no shadowBlur/gradients per particle. Practical cap: **~300–600 concurrent particles**, fading fast. ⚠️ Our game.js allocates per particle + uses fillRect — fine at prototype counts, but pool + pre-rendered sprites go on the polish checklist.

## E. Mobile Safari specifics
- DPR: canvas memory scales with DPR² (iPhone DPR 3, 390×844 CSS = 1170×2532 ≈ 11.8MB per layer). **Cap effective DPR at 2** for game canvas — visually near-identical on a tactics grid, big savings. ✅ Already done in game.js (Math.min(2, dpr)).
- Touch: listeners default passive; set {passive:true} explicitly where preventDefault unneeded. ⚠️ Our pointerdown handler doesn't call preventDefault — but CSS touch-action:none already handles scroll; fine.
- Folklore watchlist [unverified]: 2048px HW-accel limit claim, per-tab total canvas memory caps, software drawImage of large images on old iOS. Verify on device before acting.
- Verified: rAF pauses in background tabs (free battery win); 120Hz screens run callbacks 120×/s — gate on timestamp delta (✅ our loop uses dt).

## F. Profiling
- Chrome DevTools Performance panel: Frames section, Paint Profiler, CPU throttling (2× to simulate phones), Rendering tab FPS meter + paint flashing (verifies layered strategy is skipping work).
- stats.js (mrdoob) — lightweight in-page FPS meter.
- Attribute cost first: toggle rendering off vs logic off, compare frame times.

## G. Perf traps
- **shadowBlur: the biggest drop** (Paul Lewis) — avoid for text/sprites.
- Float coords force per-pixel AA — round to ints for drawImage (MDN + all agree). ⚠️ Our grid math is mostly integer; audit drawMech offsets.
- save()/restore() "very slow in most browsers" — set transforms directly. ⚠️ drawMech uses save/restore per limb (6×/mech) — acceptable since unit layer redraws only when dirty, but flatten in polish pass.
- Gradients/patterns per frame; fillStyle churn in loops (batch same-color paths); fillText slow → pre-render damage numbers as digit sprites at scale.
- **Don't** over-engineer: dirty-rect bookkeeping at a few hundred sprites = complexity >> payoff; profile before optimizing.

## H. Battery / render-on-demand
- rAF pauses in background tabs automatically. 30fps with consistent pacing is a legitimate fallback tier (davrous targeted 30fps on weak devices).
- [synthesis] For a mostly-static tactics board: keep rAF running, **skip all canvas work when nothing is dirty** — cuts wake time to near zero while idle. ✅ Our loop already does this (fx layer cleared, not drawn, when empty; unit layer dirty-flagged). Add "Power saver" toggle in polish.

## Applied to Mecha Protocol (implement-immediately)
Already correct: 3-layer canvases, dirty flags, DPR cap 2, dt-based loop, integer-ish grid math.
Polish checklist (added to BUILD-PLAN): particle pool + pre-rendered sprites; flatten drawMech save/restore; audit float coords; pre-rendered digit sprites if floaters grow; Power-saver toggle; verify on-device with canvas-size + paint flashing.

## I. Sources
davrous.com (2013 sprite benchmarks) · wildgames.io/blog/webgl-vs-canvas2d (Sept 2026) · stackoverflow.com/questions/68733355 (Kaiido/Wax) · MDN Canvas Optimizing · HTML5Rocks canvas performance (Wayback, CC BY 3.0) · stackoverflow.com/questions/6081483 (iOS canvas limits) · github.com/jhildenbiddle/canvas-size · buildnewgames.com GC-friendly code (Wayback) · developer.chrome.com/docs/devtools/performance · github.com/mrdoob/stats.js · MDN rAF · MDN addEventListener (passive) · stackoverflow.com/questions/8205828 (best-practices thread)
Research-only; nothing changed anywhere. Two sources 404'd (recovered via Wayback); construct.net skipped (Cloudflare loop).
