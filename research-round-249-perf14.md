# Perf Part 14 (Final Freeze) — Findings (Round 249)
**Date:** Wed 2026-10-15 ~00:15 EDT · **Source:** live web research (glaiel, digital foundry, proxx, nystrom, chrome, web.dev)
**Project:** Mecha Protocol — perf (pre-freeze; final protocol)

## A. Mechanics
- Final-24h re-measure (Glaiel, shipped The End Is Nigh): built a "monitor simulator" — "I can't just trial and error this on my computer and expect it to be a robust solution." Method: same combat-heavy scene, weakest phone, before AND after every change. Never a vibes check on a laptop.
- Governor-on soak = sign-off. Industry name for our auto-governor: DYNAMIC RESOLUTION SCALING (Digital Foundry 2018; Meta Horizon docs — viewport scaled on GPU utilization). Rule: freeze numbers only valid with governor ARMED, heaviest scene.
- Allocation sweep = last gate (Nystrom, Game Programming Patterns): object pools "to avoid the cost of allocation and deallocation, especially on mobile devices." GC pauses = p99 spikes in ring buffer; last gate = busy scene, zero per-frame allocation, flat p99.

## B. Validation
- Weakest-phone rule. PROXX (Chrome team): budgets BEFORE code (<25KB, <5s TTI slow 3G, 60fps), logic in Web Worker, KaiOS phones supported. Counterexample: Cyberpunk 2077 gated on high-end PC, failed on base consoles — Sony delisted, full refunds. "Whatever you don't gate on becomes the launch story."
- Thermal soak buckets (Zatorskyi): "After throttling, CPU & GPU clock speed can be cut in half" — cold runs lie. r/gamedev: flagships slow after ~15 min. Sign-off = soak-END numbers, both power modes, watching p95 cross the 20ms governor threshold as heat builds.
- Input latency (RAIL): process input <50ms, visible response <100ms. Jam check: tap-to-visible-response on weakest phone, heaviest scene.
- DPR readback: fill-rate scales with backing-store pixels — read real canvas pixel dims on weakest phone (renderScale:2 multiplies governor workload).
- Frame instrumentation (Chrome LoAF docs): LoAF = rendering update delayed beyond 50ms, Chromium-first. Validates our design: own ring buffer primary, LoAF where available, longtask Safari fallback — never one browser API.

## C. Techniques
- Numeric tweaks only (Glaiel cautionary: shipped timing "fuzziness" caught by speedrunners — timing tweaks have BEHAVIORAL side effects). Last-24h: numbers (particleCap, thresholds, renderScale), never algorithms/loop structure. Every change = before/after same-scene 3-signal.
- Flag-HUD anti-bit-rot (stats.js pattern): HUD ships in build, ON for every jam-day run — regression visible the moment it appears.
- visibilitychange discipline (Chrome Page Lifecycle): stop loop on hidden, resync clock on visible. Glaiel parallel: resync after scene loads (0.05s dt clamp bounds the spike — verify no catch-up spiral).

## D. What to avoid
- Last-minute "optimizations" (Knuth: premature optimization = root of all evil; Glaiel: untested fixes shipped timing quirks).
- Profiling the menu (DF methodology: demanding scenes; menu p95 = meaningless).
- Cold-run sign-offs (throttling halves clocks — a 2-min run measures a different device than minute 15).
- Laptop gating (Cyberpunk = the $1B version).

## E. Shipped
- PROXX: budgets first, weakest device first, worker isolation — hit targets on hardware most teams don't test.
- Cyberpunk 2077: gated high-end PC, base consoles disaster — delisted, refunded. The weakest-phone rule with a price tag.
- The End Is Nigh (Glaiel): frame-timing discipline — clamp dt (his spiral cap 8/60; ours 0.05 = tighter), resync after loads, "an uneven framerate is worse than a slow framerate" (governor must produce STABLE degraded frames, not oscillate).

## Implemented this round
- **Verified (code read, no changes — pre-freeze):** dt clamp 0.05 (tighter than Glaiel's 8/60); visibilitychange stop/resync; ?perf=1 flag; ring buffer primary + LoAF + longtask fallback; particleCap 300 pooled.
- **PERF-SPEC.md:** final-freeze protocol — (1) same-scene 3-signal, governor ARMED, weakest phone, before+after every change; (2) 15–20min soak both power modes, sign off on soak-end numbers, governor stable (no oscillation per Glaiel's rule); (3) allocation sweep last gate (zero per-frame, flat p99); (4) input-latency + DPR readback + tab-away/resume audit; (5) 24h freeze: numbers only, ?perf=1 always on, no loop-structure changes.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
glaiel · digital foundry · proxx · nystrom · chrome · web.dev · mdn · zatorskyi
