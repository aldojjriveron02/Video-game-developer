# Perf Part 18 (Verification Round 3) — Findings (Round 285)
**Date:** Wed 2026-10-15 ~04:42 EDT · **Source:** live web research (fuller, bugnet, android adpf, nystrom, sebadorn)
**Project:** Mecha Protocol — perf (pre-jam; verification round 3)

## A. Mechanics
- Bottleneck-aware re-measure (Fuller): build automated test points, render at each resolution, record time, build the expected-delta table. On varying hardware the table updates dynamically — weight frame-time history with a confidence value by recency; inverse-confidence extrapolates from recent data. Every optimization invalidates the old table — re-measure before AND after, attributing each frame to the correct signal (OK/CPU/FILL), or the governor steers on stale data.
- Thermal soak with temperature (Android ADPF): "achieve performance goals without exceeding thermal limitations." Once overheated, workload must drop BELOW sustainable to dissipate; when headroom returns, settle on SUSTAINABLE not maximum "for optimal play time." Web analog: frame-time drift over a long session (gov scale-over-time trace) = the temperature proxy.
- Governor hostile-state verification (Fuller; Android): "panic mode" — drop resolution aggressively when presentation latency runs out (normal overruns are absorbed; the governor must react to the latency signal, not just frame time). Android bands: ~0.85 → watchout; ~0.95 → reduce immediately; >1.0 → severe. Hostile states: sustained overload (settle low, no sawtooth), sudden spikes (panic engages, recovers gradually — "subtle, gradual resolution changes rather than jarring abrupt jumps"), post-thermal recovery (sustainable, not full).
- Debug pair (Fuller): his two "extremely useful" features = our ?perf=1 + ?perf=stress. (1) Graph over time of resolution, GPU/CPU frame time, dropped frames — "graph Digital Foundry wish they had." (2) Change resolution every frame — "quickly exposes errors in shaders, or perhaps synchronisation issues." Extra trick: render BELOW the shipping floor to surface issues. Keep both through ship.

## B. Validation
- Min-spec device is the truth (Cyberpunk 2077): base Xbox One at 10 FPS, sub-720p, Sony pulled it from the store. High-end numbers say nothing about the floor. Wayline: "test on a wide range of devices, from low-end to high-end." The freeze decision happens on the weakest target device, not the dev desktop.
- Debug-flag gauntlet (Fuller): fixed scenes, same device, same build, scripted load. Meaningful only cooled + version-tagged. Full sequence every candidate build: cold boot → normal (?perf=1) → stress (?perf=stress) → soak. Skipping a leg invalidates the run.
- Worst-case spike test (Fuller; Bugnet): exceed the latency cushion — below-floor resolutions + scenario spikes (max units + effects + DPR cap). Prove panic engages and drops are bounded. Bugnet: track p99 — it exposes what averages hide.
- Reproducible baselines (Bugnet): report frame TIME not FPS; fixed-bucket histograms; tag with version/platform/GPU/scene; segment by scene; p50/p95/p99 across builds. "Average frame rate is a lie" — 60 FPS average can coexist with misery. "tracking p50 alone is insufficient. You need all three tiers."

## C. Techniques
- DRS governors with hysteresis and panic (Fuller; Wayline): drop fast enough to avoid dropped frames, no further than required; increase quickly when headroom exists. Latency-aware panic drops more aggressively when presentation latency is nearly exhausted. Dead-band between down/up thresholds prevents oscillation. Target slightly UNDER budget (16ms for 16.6ms frame) to build latency cushion.
- Confidence-weighted adaptation (Fuller): weight history by recency; extrapolate with inverse-confidence when stale. Re-seed and re-validate after every content change.
- DPR caps (PlayCanvas): "problematic on low/mid-tier mobile devices" — fill-rate scales with pixel count. Cap maxPixelRatio per tier at runtime (startup benchmark or GPU-name list) + user quality toggle.
- Prewarmed pools (McAnlis; PixiJS): "reclaiming memory isn't free." Sawtooth memory = GC events. Instrument max live objects per type, pre-allocate at startup, pre-fill in init.

## D. What to avoid
- Unfreezing after freeze (Wayline; Fuller): every post-freeze change invalidates the baselines. Freeze = hard gate. "One more tiny tweak" restarts verification.
- Desktop numbers for mobile (Cyberpunk): dev desktop has sustained clocks + active cooling; the phone throttles at minute 8. Desktop-pass + mobile-fail = the shipped experience.
- FPS averages (Bugnet; Wayline): "a stable, consistent frame rate is vastly preferable to a wildly fluctuating one, even if the overall average frame rate is higher."
- Single-metric measurements (Fuller; Wayline): GPU time alone misleads (frame-time "bubbles"); CPU-over-budget trick is harmful in dev builds. "Don't rely solely on CPU or GPU load" — add the thermal signal. One metric = one blind spot.
- Deleting instead of pooling (sebadorn, js13k): deleting objects = "micro stutters and lost frames." Pool effects, flag destroyed objects.

## E. Shipped
- Doom 2016 (id): adaptive DRS on consoles — governor absorbs content spikes the fixed budget couldn't. The resolution-over-time graph proves it.
- GTA Online (t0st/Rockstar, 2021): single-threaded CPU JSON bottleneck — 70% load-time cut. Profile first, attribute precisely, measure before/after.
- Cyberpunk 2077 (cautionary): min-spec validation = a ship gate, not a nice-to-have.
- sebadorn js13k 2020: pre-render static geometry to offscreen canvas; viewport-only rendering; pooling over deletion.

## Implemented this round
- **PANIC MODE (js/perf.js, Fuller):** the governor's normal path steps down one level per 3 hot evals — good for gradual load, but a severe spike (p95 > 33ms = 2 frames) means presentation latency is exhausted; waiting drops real frames. Panic: jump straight to max degradation (level 4) on the first severe eval; recover gradually through the normal cool path (10 evals per step up). The 12–20ms dead band prevents sawtooth on recovery. Telemetry: `perf:gov:panic`. Verified functionally: severe spike → 1→4 immediate; normal hot → gradual 2→3; cool → gradual 4→3. +8 → **4,487 lines**, all clean.
- **PERF-SPEC.md:** verification round 3 (below).

## F. Sources
fuller · bugnet · android adpf · nystrom · sebadorn · doom · gta online · cyberpunk
