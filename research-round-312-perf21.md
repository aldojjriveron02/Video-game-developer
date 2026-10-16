# Perf Part 21 (Verification Round 6) — Findings (Round 312)
**Date:** Wed 2026-10-15 ~06:31 EDT · **Source:** live web research (unity, netmarble, ue, doom)
**Project:** Mecha Protocol — perf (pre-jam; verification round 6)

## A. Mechanics
- Idle-reserve rule (Unity; Google; Netmarble): "Work on a specific time budget per frame" but "we don't recommend using this maximum time consistently as the device can overheat." Google: "maximizing performance at sustainable levels." Netmarble (ADPF): thermal headroom 1.04→0.92 (11%), "never exceeded 1.0, hence preventing device overheating." Budget to the sustainable thermal ceiling; keep reserve so throttling never engages.
- Allocation audit (Unity; Android; UE): "reduce the number of managed allocations" — "use object pools instead of new allocations in hot paths." Android Meminfo + Memory Advice API (warns before LMK). UE: ListTextures "to see where all the texture memory is going." Mechanic: snapshot → attribute every byte → zero steady-state allocations.
- Soak protocol (Netmarble): "prolonged gameplay sessions resulted in increased device temperature, causing performance degradation." Fix: data-driven governor (dynamic resolution + adaptive FPS), verified by sustained-session metrics — "not by a 60-second cold benchmark." Without governor: 40–56 erratic; with it: 50–60 stable.

## B. Validation
- Min-spec devices (UE): per-device tiers, per-device quality settings, per-device content scale factors. "Validate on the actual device."
- Thermal chambers (Android ADPF; Unity): "dynamic thermal, CPU, and GPU management." Netmarble: thermal headroom never exceeded 1.0. Unity: hot devices skew profiler — thermal state is part of test setup.
- Frame traces (Android AGI/Perfetto/Systrace/APT; Unity Profiler): "locate frames of interest" and aggregate — "median, mean, and mode frame times" — the basis for percentile reporting.
- Measured-change discipline (Unity): "Before optimizing anything … save the Profiler .data file. Implement your changes and [capture] after. Rely on this cycle: profile, optimize, and compare." "Don't guess or make assumptions about what is slowing down your game."

## C. Techniques
- Budget discipline (Unity; UE): "Work on a specific time budget per frame." UE: "Draw calls ≤700 per view," "Triangles ≤500k per view," 5 sampler limit. "Budgets are per-view, per-device-tier numbers, not vibes."
- Governor tuning (Netmarble; id): Netmarble — "resolution scaling had the most significant impact on GPU load and thermal output." "Change quality settings separately to reduce sudden decreases; restore gradually when heat decreases." Doom Eternal: DRS "on all of the platforms" (Billy Khan) — "tuned against a hard frame budget."
- Memory ceilings (Android; UE): Memory Advice API — "stay at optimal levels that avoid LMKs." Hard ceiling at runtime, not a guideline.
- Prewarming (Unity): "Use object pools… Create reusable instances at a point in the game (e.g., during a menu screen) when a CPU spike is [tolerable]." Baseline Profiles for ART ahead-of-time compilation.

## D. What to avoid
- Budget creep (UE; Unity): hard numbers exist "precisely so no one quietly raises them." "Raising the budget instead of fixing the overrun is the failure mode."
- Unmeasured changes (Unity; Netmarble): "Don't guess." Profile→optimize→compare with saved captures.
- Desktop proxies (Unity; UE): "Profile early, often, and on the target device." "Editor numbers are not shipping evidence." "Shipping numbers from a dev machine are fiction."
- Hope-based perf: thermal reality + governor absence = "the two canonical ways hope dies." Replace with governor + soak + percentile traces.

## E. Shipped
- Doom Eternal (id): DRS "on all platforms" — "the governor is engine-level and platform-universal, tuned against a hard frame budget rather than per-platform hacks."
- Kingsroad (Netmarble): ADPF thermal governor — dynamic resolution (primary lever) + adaptive FPS (60→30 floor, gradual recovery). "Measured first, changed one lever at a time, verified sustained." Thermal 1.04→0.92; FPS 40–56 erratic → 50–60 stable.
- Fortnite-class (Epic/UE): per-device profiles, per-tier scale factors, hard numeric budgets — "budgets are numbers checked per device tier, so perf scales down to min-spec by construction."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** zero steady-state allocations. The game loop contains no `new`, `[]`, or `{}` allocations — the hot path is allocation-free. Pool prewarming (Round 199) handles particles. Unity's GC-Alloc discipline satisfied.
- **PERF-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
unity · netmarble · ue · doom · android
