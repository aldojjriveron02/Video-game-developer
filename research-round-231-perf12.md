# Perf Part 12 (Browser Game Performance) — Findings (Round 231)
**Date:** Wed 2026-10-14 ~22:35 EDT · **Source:** live web research (mdn, smus, fiedler, sukin, nystrom, adenot, lewis, bugnet, android)
**Project:** Mecha Protocol — perf (Phase 1, pre-jam freeze)

## A. Mechanics
- Canvas canon (MDN Aug 2026 + Smus/Chrome): pre-render offscreen, integer coords, no drawImage scaling, layered canvases, {alpha:false}, batch state, dirty rects, NO shadowBlur per frame, rAF only. Mobile canvas much slower than desktop — desktop testing lies.
- Game-loop canon (Fiedler "Fix Your Timestep!"): accumulator, fixed dt steps, clamp frame time, cap max steps (slow-mo over death spiral). **Our dt=0.05s is tighter and safer than their 0.25s.**
- Memory (Nystrom Object Pool + Data Locality): preallocate, O(1) alloc/free, typed arrays, never allocate in hot loop. Consoles require multi-day soaks — creeping fragmentation kills shipped games.
- Profile real budgets: JS frame tax ~3–4ms of 16.6ms (Lewis); Safari Web Inspector Timelines via USB for iPhone; thermal throttling changes numbers mid-session.

## B. Validation
- Frame-time: rAF delta histograms — median, p95/p99, % missed vsync. FPS alone hides jank.
- Long Tasks API (≥50ms) + Long Animation Frames (Chromium) + performance.measure for sim-vs-render split.
- **3-signal re-measure (synthesis, no single canonical source):** (1) median frame time; (2) tail jank — p95/p99, missed vsync, long-task count; (3) sustained/thermal — late vs early session. Ship only if all three hold. Median can look fine while the tail ruins feel.
- Thermal: mobile SoCs throttle within ~10 min; first-minute FPS ≠ tenth-minute FPS. Soak 5–15 min minimum on real device, worst-case turns, compare first-5 vs last-5.
- Low-end matrix: flagships 60fps, low-end locked 30 floor; iPhone 17 + older iPhone + budget Android + Chromebook; quality scaler sheds effects before missing floor.
- 20-min jank: memory graph sawtooth (leak), frame-time drift (thermal/accumulation), longtask counts second half.

## C. Techniques
- Batch draws by state; sprite atlases; HUD DOM at 4–10Hz cached strings, transform/opacity only (compositor).
- Particles: fixed pools, drop overflow at saturation (invisible), typed arrays, pre-rendered glow sprites (no shadowBlur).
- Audio CPU (Adenot): convolver/HRTF very expensive; BiquadFilter cheap; fixed-gain free; latencyHint:"playback" for battery; ~1000+ voices = dropouts.
- Perf HUD = stats.js pattern: FPS, ms, frame graph, long tasks, draw calls, pool usage, heap. On in dev/QA, URL flag in prod, OFF at ship — **matches our JAM_BUILD dormant default exactly.**
- Input latency: tactics budget ≤50–70ms (Bugnet); sample input late; Event Timing API for field measurement; 240fps phone camera as ground truth; >20% regression = blocker.

## D. What to avoid
- Allocating in hot loop (even +new Date()); per-frame string concat in HUD; shadowBlur; unthrottled resize; save/restore churn.
- "Works on my M-series Mac" trap — gate is a real-device trace on the weakest target.
- iOS battery drains: unreleased Wake Lock; uncapped background rAF (cancel on visibilitychange); full-DPR canvas (cap 2); low-latency AudioContext when unneeded; convolver/HRTF for ambience.

## E. Shipped
- Agar.io (Valadares): canvas 2D, 190 players/room on 2015 phones; bottlenecks were collision + packet encoding, not rendering; budget goes to gameplay, not pixels.
- Diep.io: culling discipline — don't simulate what nobody sees.
- Slither.io: cheap circle draws, client-side interpolation (rbcs), spatial hashing.
- 2048 (Cirulli): tiles animate on compositor via CSS transforms — zero per-frame main-thread work.

## Implemented this round
- **Verified (already in code):** perf.js ring buffer (p50/p95/p99, % over budget), per-layer draw timings, auto-governor (p95>20ms → shed), LoAF + longtask fallback for Safari, visibilitychange handlers (autosave + guards). All research code-recommendations already implemented.
- **PERF-SPEC.md:** 3-signal re-measure protocol formalized (median / tail / thermal); thermal soak procedure (30-min iPhone 17, worst-case script, 5-min buckets, Low Power Mode repeat); allocation-sweep checklist; jam-day perf checklist (dormant HUD on URL flag, DPR cap 2, visibilitychange discipline).
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
mdn · smus · fiedler · sukin · nystrom · adenot · lewis · bugnet · android · valadares · cirulli
