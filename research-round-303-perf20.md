# Perf Part 20 (Verification Round 5) — Findings (Round 303)
**Date:** Wed 2026-10-15 ~05:57 EDT · **Source:** live web research (unity, fuller, bugnet, android, web.dev)
**Project:** Mecha Protocol — perf (pre-jam; verification round 5)

## A. Mechanics
- Frame-budget audit (Unity): "Developers use the average frame time to benchmark game speed rather than fps." 30fps = <33.33ms; 60fps = 16.66ms. "Even a single frame that exceeds the target frame budget will cause hitches." Workflow: profile before (baseline/"performance signature"), during (track changes), after (prove effect). Identify CPU-bound vs GPU-bound; optimize only the bottleneck. Mobile: reserve ~35% idle — budget = (1000/30)×0.65 ≈ 22ms — "giving chips time to cool and saving battery."
- Governor audit (Fuller; Meta/Epic): aim slightly UNDER target (16ms for 60fps, not 16.66); small stepped increments; minimal-latency GPU timing feedback; render UI at fixed max resolution. For our governor: smooth step-down, hysteresis on step-up, playable floor, panic unreachable in normal play / reachable in pathological.
- Memory audit (Unity; Bugnet): establish budget → Memory Profiler → within budget. Hunt per-frame allocations (GC.Alloc) — "the allocation's visible cost understates the real cost: requesting memory can hit the power budget (slowing CPU/GPU), push cache lines out, and trigger delayed GC pauses." Soak: "run a long, repetitive session; monitor resources over time; capture long-run failures" — flat = pass, drift = fail.

## B. Validation
- Device matrix (Unity): "Establish hardware tiers... profile and optimize for each." "The most accurate profiling results always come from running and profiling builds on target devices" — a game can be GPU-bound on some, CPU-bound on others.
- Thermal soak (Unity; QA Brains; Happycapy; Drizz): sustained work → chips hot → OS throttles → "frame stuttering." Soak 30min–4h+ (up to 12h before releases) tracking CPU, memory, frame stats. Frequency scaling can mask real gains.
- Percentiles (Android): P90 FPS ("90% faster; slowest 10% below"), P99 FPS ("reflects 1% slowest frames — critical for identifying stutter"), "Slow Sessions" (>25% frames below target, in Play vitals). Anti-example: "averaging 60fps but with shader-compilation stutters at P99 = 15fps."

## C. Techniques
- DRS (Fuller): target slightly under display target; small steps; minimal-latency feedback; fixed-max UI. (Meta: "automatically adjusts during heavy GPU work and increases image quality when possible.")
- Panic modes: explicit lowest-quality floor on severe breach — our p95>33ms → level 4. Floor must keep game playable; recover upward when load clears.
- DPR caps: Unity mobile — "reducing display resolution" as first-order lever (fill cost grows quadratically). Never render above what hardware sustains.
- Pool prewarming (Unity; CloudThat): reuse avoids allocation overhead. "Pre-warm object pools, ensuring a seamless experience from the outset." Android: unwarmed shader compilation = classic P99 stutter. Prewarm-then-measure = pro standard.
- Frame pacing (Android; web.dev): frames at even intervals — "consistent pacing matters as much as throughput." Canvas: pre-render static to off-screen, batch draws, avoid per-frame state changes, redraw only changed regions, layered canvases, avoid shadowBlur + sub-pixel coords, rAF + delta time. "Most mobile canvas implementations are slow."

## D. What to avoid
- Average FPS (Unity): "59 frames in 0.75s plus one 0.25s frame averages to 60fps but 'players will notice a stutter'." Android's P99-vs-average split. FPS ban justified.
- Desktop-only testing (Unity): frequency scaling + thermals differ on real devices; dev-machine numbers lie.
- Unbounded growth (Unity): unbounded caches/arrays + unwarmed pools = memory pressure + GC spikes. "Allocation's delayed GC and power-budget costs are the hidden killers." Cap everything.
- Post-freeze changes (Bugnet): "define numeric thresholds for frame time/memory/load time, run a repeatable perf test on every change, and fail merges that exceed the budget — catching regressions early."

## E. Shipped
- Vampire Survivors: Phaser → purpose-built engine; Steam Deck "5-8 frames" → "around locked 60 FPS." "Fixed 2D scope, pooled entities, capped effects, an engine built for its exact workload."
- Cut the Rope (HTML5): ZeptoLab/Pixel Lab — "two-phase frame discipline ('You have an update phase, and you have a draw phase'), kept per-frame work minimal via pre-rendering/layering." "Nobody should have any concerns about making a bet on HTML5."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** frame budget 12ms (perf.js:128, Round 181 Sadil) — "practical JS budget 12ms, browser keeps the rest of the 16.7ms frame." This reserves 28% idle, close to Unity's 35% mobile rule (10.8ms for 60fps). Conservative for a turn-based game; the governor handles degradation. No tightening needed — the budget is already well under 16.66ms.
- **PERF-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,535 lines** (+0).

## F. Sources
unity · fuller · bugnet · android · web.dev · vampire survivors · cut the rope
