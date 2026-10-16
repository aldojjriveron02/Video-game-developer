# Perf Part 17 (Verification Round 2) — Findings (Round 276)
**Date:** Wed 2026-10-15 ~03:25 EDT · **Source:** live web research (fuller, nystrom, unity, android, dev.to)
**Project:** Mecha Protocol — perf (pre-jam; verification round 2)

## A. Mechanics
- 3-signal re-measure (Fuller): DRS needs THREE signals — (1) GPU-busy proving GPU is the bottleneck, (2) CPU/GPU frame-time comparison, (3) rasterizer/timer-query GPU-time feedback. Single-metric measurements get fooled by VSync and bottleneck misidentification. Fuller: DRS is not "just adjusting screen resolution" — it must read the right bottleneck signal or it degrades the wrong thing.
- Thermal soak (Nystrom; dev.to): console makers require soak tests; "a pool that never empties in QA can exhaust under real-world hours of play." Professional ritual: heaviest scene, 30+ min, on-device overlay recording frame time AND temperature — "performance looked fine until minute ~20, when thermal throttling kicked in." The soak must cross the device's thermal knee (≥30 min); temperature logged alongside frame times.
- Governor verification (Unity Adaptive Performance; Android ADPF): simulate thermal throttling to verify the governor responds — force the hostile state, don't wait for it. Use the Thermal API to monitor throttling headroom/proximity and react proactively.

## B. Validation
- Min-spec device (dev.to): "The editor will not warn you." Profile on the weakest target with on-device overlay; desktop/editor numbers are not evidence. Write the frame budget down (16.6ms for 60fps) and check against it on-device.
- Debug-flag gauntlet (Fuller; Unity): debug overlays + synthetic stress loads = industry standard. Force the bad state through a flag, verify behavior.
- Worst-case spike test (Nystrom): the empty-pool policy question ("what happens when the pool is exhausted?") IS the worst-case design question — expand, or fail loudly, but decide deliberately.
- Reproducible measurement (Android ADPF): Fixed Performance Mode during benchmarking — disable the adaptive layer (lock clocks/governor off) for a repeatable baseline, then re-enable for soak.

## C. Techniques
- DRS governors (Fuller): scale from GPU-busy/bottleneck signals with hysteresis — limit how often/how much resolution changes per frame/window so the governor doesn't cause visible oscillation. Confidence-weighting aligns: don't act on noisy single samples.
- Panic modes (Unity): layered scalers (resolution → framerate → effects/LOD) triggered by thermal state + bottleneck detection.
- DPR caps (MDN; Stack Overflow): fill-rate cost scales with devicePixelRatio². Full-DPR retina took canvas perf from fine to "unusable." Capping (our 1.25) = the standard web-game answer; mobile GPUs are fill-rate-bound before logic-bound.
- Prewarmed pools (Nystrom): "reuse instead of allocate" avoids GC spikes. Prewarming matters — an unwarmed pool allocates on first use, moving the hitch to the worst moment. Size from measured worst-case; decide the exhausted-pool policy in advance.

## D. What to avoid
- Unfreezing after freeze (Cities: Skylines II): admitted "performance isn't up to scratch" days BEFORE launch, shipped anyway. Architectural problems (uncapped geometry, missing culling) couldn't be hotfixed. Perf freeze = a gate, not a guideline.
- Desktop numbers for mobile (dev.to): the editor passed; the device failed at minute 20 under thermal load. Not on-device + not long-duration = not validation.
- FPS averages (Hole-in-my-Head; Digital Foundry): average FPS hides stutters — "59 fps" can contain a visible hitch. Percentiles (p50/p95/p99) = the metric. Our ?perf=1 design matches industry practice.

## E. Shipped
- WIN: Doom 2016 (id Tech DRS) — resolution scales invisibly within a frame budget rather than dropping frames. A decade later: table stakes (Fuller 2023, Unity, Android ADPF). Our confidence-weighted governor = established, proven company.
- CAUTION: Cities: Skylines II (2023) — architectural perf problems, discovered late, couldn't be hotfixed. The soak + spike test exist to catch these BEFORE freeze.
- CAUTION: the 20-minute wall (dev.to) — passed functional QA, would have failed sustained-play. Without the soak, ship-confidence = the first 20 minutes, the only part that always runs fine.

## Implemented this round
- **BOTTLENECK SIGNAL (js/perf.js):** Fuller's three-signal requirement. The ?perf=1 HUD now shows a bottleneck readout: combines LoAF/longtask counters (CPU-bound signal) with p95 frame time. `OK` (p95 ≤12ms) / `CPU` (p95 over + long tasks firing — resolution scaling won't help) / `FILL?` (p95 over + no long tasks — likely fill-rate/GPU-bound, DPR step-down is the answer). Verified functionally: all 3 cases PASS. +6 → **4,452 lines**, all clean.
- **PERF-SPEC.md:** verification round 2 (below).

## F. Sources
fuller · nystrom · unity · android · dev.to · doom · cities skylines 2
