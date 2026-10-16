# Perf Part 16 (Final Freeze) — Findings (Round 267)
**Date:** Wed 2026-10-15 ~02:19 EDT · **Source:** live web research (fuller, android, htmltoapp, digital foundry, meta quest)
**Project:** Mecha Protocol — perf (pre-jam; final freeze)

## A. Mechanics
- Governor verification (Fuller): two debug features every DRS needs — (a) graph over time of resolution + frame/GPU time + dropped frames (our ?perf=1 trace), (b) test mode changing resolution EVERY FRAME to expose shader/sync issues. Non-obvious failure: dropping too slowly (frame drops) OR dropping too far / recovering too slowly (wasted quality). Verification = scripted worst-case, watch the trace: steps down precede drops, steps up reclaim quality fast.
- 3-signal re-measure: no single run trustworthy (JIT warm-up, GC, thermals). Android's "slow sessions" aggregate over sessions/devices; Digital Foundry uses repeated runs. Practical: 3 repeat runs, fresh page load each, run 1 = cold/JIT-warm (discard/flag).
- Thermal soak (Meta Quest practice): up to 60 minutes to catch throttling; device labs confirm only longer sessions surface it. For us: 30–60 min worst-case loop on weakest device, watch p99 + governor floor — throttling pinning the governor at floor with drops = ship-blocker, invisible in a 2-minute test.

## B. Validation
- Rater-device profiling (htmltoapp): flagships hide problems — test on a real cheap phone (3–4-year-old mid-range). Highest-leverage validation step.
- Debug-flag run (Fuller): ship-readiness judged from the debug overlay, not feel. The ?perf=1 trace = the acceptance artifact; save it.
- Worst-case spike test (Android Frame Rate guide "Scenario 3"): average FPS excellent while P99 reveals shader-compilation/asset-streaming stutters. Scripted worst case: max particles, max units, first-burst effects, tab-hide/resume — read p99, not average.

## C. Techniques
- DRS governors (Fuller): drive resolution from frame time vs target slightly under budget; confidence-weight history (decays with time since resolution last chosen) — validates our existing design. Add a "panic mode" concept: thin latency margin → step down more aggressively.
- DPR caps (htmltoapp): cap effective DPR (2, or 1.5 fill-heavy) — cuts pixel count up to ~55% vs uncapped with little visible loss. Our 1.25 = aggressive/good. (MDN: never render far above displayed size.)
- visibilitychange (htmltoapp): rAF stops when backgrounded, but timers/audio/network don't — explicit handler to pause logic + suspend audio. Ours (rAF self-terminate + autosave-on-hide + timestamp reset) = the professional pattern.
- Prewarmed pools (htmltoapp): never allocate in the game loop (arrays, objects, closures, strings); pool everything; GC pauses = periodic hitch. Verify pool depth covers the worst-case burst so it never grows mid-fight.

## D. What to avoid
- Unfreezing after freeze (Bloomsbury: feature freeze at beta, producer-enforced). Any post-freeze change invalidates all measurement. Hard means hard.
- Perf tuning without measurement (Android: optimize against measured distributions, not intuition).
- Trusting desktop numbers for mobile (flagships/desktops hide problems).
- FPS instead of frame time (Android: smooth average coexists with intermittent hitches).

## E. Shipped
- WIN: DOOM 2016 on Switch — adaptive resolution made a locked-feeling 30fps possible on vastly weaker hardware. A well-tuned governor = legitimate celebrated strategy, not a hack.
- CAUTION: Cyberpunk 2077 last-gen — verified on high-end PCs, min-spec skipped = launch catastrophe. Maps to anti-pattern 3.
- CAUTION: Elden Ring PC launch — 250ms stutters on first encounter (shader compilation), invisible in average FPS, caught only by frame-time analysis; Bandai Namco acknowledged. Fix: pre-compilation during load (The Ascent). = the rationale for prewarmed pool + worst-case spike + p99 acceptance.

## Implemented this round
- **RESOLUTION STRESS MODE (js/perf.js):** Fuller's second debug feature — the pair was incomplete (we had the graph, not the stress mode). `?perf=stress` cycles the governor 0→4→0 every frame, forcing render-scale changes to expose resize/shader/sync issues. The gov trace in the HUD records the cycling. Verified functionally: gov 1→2→3→4→0→1→2, trace 2→1.5→1.25→1→2. Debug-only, zero gameplay impact.
- All `node --check` clean. +4 → **4,446 lines**.
- PERF-SPEC.md: final freeze (below).

## F. Sources
fuller · android · htmltoapp · digital foundry · meta quest · bloomsbury
