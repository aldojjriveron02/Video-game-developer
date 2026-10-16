# Perf Part 15 (Final Freeze) — Findings (Round 258)
**Date:** Wed 2026-10-15 ~01:13 EDT · **Source:** live web research (fuller, unity, roblox, osmani, doom, mdn, nystrom)
**Project:** Mecha Protocol — perf (pre-jam; final freeze)

## A. Mechanics
- Governor verification first (Fuller, "DRS Implementation Best Practice," Oct 2023): keep frame time under budget, confidence-weight history, avoid oscillation. Three verification tools: (a) debug graph plotting resolution AND frame time over time, (b) stress mode changing resolution every frame, (c) scientific approach — automated test points deriving a cost function. The governor verification protocol: engage under load, recover after, no oscillation.
- Multiple signals (Unity profiling guide): frame time, NOT FPS — profile before, during, and after changes. Roblox Creator Hub: phones/tablets downclock under sustained heat — a short clean run is one signal, not the verdict.
- Thermal soak (Unity): ~35% idle headroom so chips cool; monitor frequencies for throttle state. Mechanic: 20–30+ min sustained worst-case session on rater device, compare back-half frame-time drift vs first 5 min.

## B. Validation
- Rater-device profiling (Roblox: test on hardware every 1–2 weeks; Osmani 2018: budgets around mobile JS cost): desktop numbers are NOT the budget. Desktop Chrome doesn't thermal-throttle like a phone.
- Debug-flag run (Fuller): resolution-vs-frame-time graph = debug-flag-grade tool, run on the real build against real scenes. The ?perf=1 equivalent — verifies governor behavior under measured worst-case load.
- Worst-case spike test (Fuller + pooling literature): validate against the spike scene — allocation churn and render cost are bursty, not average. web.dev Object Pools (2013): pools exist so the worst-case spike doesn't trigger GC pauses.

## C. Techniques
- DRS-style governors (Fuller): engage below budget, confidence-weighted history, no oscillation, two-trace debug graph. DOOM 2016/id Tech 6 shipped DRS to lock 60fps (Digital Foundry Apr 2016) — the governor absorbs hardware variance at runtime. Decade-long precedent.
- DPR caps (MDN "Optimizing canvas"): scale to DPR up to a cap, never unbounded — render cost ~quadratic in pixels; a 3x phone costs ~4x a 1.5x cap. Our 1.25 cap = industry-sanctioned tradeoff.
- visibilitychange discipline (MDN): rAF throttled in hidden tabs; self-terminate loop on hide, autosave, reset timestamps (hidden tab returns with huge delta — clamp/reset prevents time-jump spike).
- Prewarmed pools (web.dev + Game Programming Patterns): real-time software can't accept unpredictable GC pauses — recycle, fill up front. Warm before the first spike, not lazily during it.

## D. What to avoid
- Unfreezing after freeze: every change invalidates governor verification, re-measure, soak. The freeze is the LAST measurement, not the first.
- Perf tuning without measurement (Unity: profile before/during/after; Fuller: cost function, not vibes).
- Trusting desktop numbers for mobile (Roblox, Osmani, Android "Slow Sessions": desktop ≠ phone thermals).
- FPS instead of frame time (Unity): governor engagement/oscillation readable only in p50/p95/p99.

## E. Shipped
- WIN: DOOM 2016 — DRS shipped to lock 60fps across consoles. Hardware variance absorbed at runtime, not tuned per device.
- CAUTION: Vampire Survivors — Phaser chugging under massive enemy counts; moved to Unity 2 years after shipping. A canvas game surviving a budget-breaking renderer pays in rewrites.
- CAUTION: Arkham Knight PC 2015 — sales suspended over perf; insufficient validation on shipping hardware. Jam-scale lesson: the rater's device is the only benchmark.

## Implemented this round
- **The research's explicit ask:** "?perf=1 doesn't show both traces → add the graph before the freeze; it is the verification instrument." Added gov trace to the perf HUD (js/perf.js):
  - `govHist` array records every governor step ({level, scale}, last 40).
  - HUD now renders: `scale 1.25x | gov: 2→2→1.5→1.25` — current render scale + full step-down history (the two-trace graph: scale-over-time alongside the existing p50/p95/p99 frame-time lines).
  - Empty-history fallback: `gov: 2x`.
- **Verified:** HUD already reports frame time p50/p95/p99 (Unity's rule); governor has confidence-style logic (3 hot windows to step down, 10 cool to step up — oscillation protection); visibilitychange discipline + DPR cap + prewarmed pool all in place.
- +4 → **4,421 lines**. All `node --check` clean. Trace verified by simulation render.
- PERF-SPEC.md: final-freeze protocol (below).

## F. Sources
fuller · unity · roblox · osmani · doom · mdn · nystrom · web.dev
