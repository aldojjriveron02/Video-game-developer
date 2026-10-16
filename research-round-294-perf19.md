# Perf Part 19 (Verification Round 4) — Findings (Round 294)
**Date:** Wed 2026-10-15 ~05:17 EDT · **Source:** live web research (unreal, doom eternal, vampire survivors, capframex, android)
**Project:** Mecha Protocol — perf (pre-jam; verification round 4)

## A. Mechanics
- Panic-mode audit (Unreal Engine, "Over Budget Panic"): "has a panic reaction and quickly lowers the resolution to compensate before gradually rising back to normal." Tunables: frame-time budget (33.3ms), Min/MaxScreenPercentage (50/100), MaxConsecutiveFramesOverBudget. The audit: (i) panic fires on a REAL over-budget spike (not gradual drift), (ii) the floor is honored (no runaway to 0%), (iii) recovery is gradual, no oscillation. Heuristic replaceable via C++ — i.e., the governor is a tuned constant set, not magic.
- Confidence re-seed: from cold start, mid-run re-seed, and after panic — does the governor converge to the same steady-state scale within a bounded frame count, without thrashing? Unreal confirms heuristics ship as tuned constants — "re-seed" = reset internal state, confirm deterministic re-convergence, not memory-corrupted drift.
- DPR soak (web.dev; MDN; PlayCanvas; TestFort): backing-store scales with DPR² — "large canvases become a significant performance cost." Soak testing = extended runs exposing leaks + crash-on-long-session. DPR soak: extended session at the 1.25 cap with the stress scene, watching the bottleneck signal + p95/p99 for time-drift (thermal/fill-rate degradation), not a 30-second sample.

## B. Validation
- Professional workflow (Google Android): measure → per-scene → bound-check (CPU vs GPU) → optimize → A/B → iterate "until target FPS *and thermal parameters* are met." Frame rate alone is NOT the gate; thermals are an explicit exit criterion.
- Min-spec device = the gate device (Arm; Unity; Appbot): "the weakest supported device as the reference: if it doesn't hold there, it doesn't ship." Appbot: performance issues among the most cited negative-review categories — "the min-spec user base is the one that reviews-bombs you." Digital Foundry's methodology = cross-device comparison, never single-machine numbers.
- Gauntlet order + hostile states (Android; TestFort): "identify problematic scenes" — high CPU/GPU, layouts failing to yield expected performance, then trace THOSE. Hostile states: worst-case entity density, full-screen effects, camera cuts (Unreal's panic trigger), state transitions, cold start. Soak adds the time dimension: leaks + thermal drift only appear after minutes.

## C. Techniques
- DRS governors (Unreal): screen percentage adjusts frame-to-frame from measured GPU workload vs frame-time budget, bounded by min/max, with panic for spikes. The reference implementation of a confidence/resolution governor.
- Panic modes (Unreal; id Tech 7): deliberately asymmetric — cut hard and fast, recover slow. Doom Eternal's locked-60fps on Switch: DRS as the load-bearing technique. "Exactly the panic-mode pattern."
- DPR caps (web.dev; MDN; PlayCanvas): backing-store pixels scale with DPR². Cap it — 1.25 keeps fill-rate bounded on 2x/3x mobile displays without visible downscaling.
- Prewarmed pools (Unity GC docs; Embrace.io): reusable pools for frequently spawned/destroyed objects. For canvas: pooled sprites/entities/particles prewarmed before the scene — the stress test measures steady-state frame time, not allocation warmup.
- Confidence-weighted governors (Android ADPF): adapt frame pacing + workloads to live thermal/power state, not a fixed budget. Weight decisions by confidence in current device state.

## D. What to avoid
- Unfreezing after freeze: late "small" changes invalidate earlier verification. Any perf-path change post-freeze = full gauntlet re-run (Android's A/B-compare-iterate loop).
- Desktop numbers as ship evidence: "mobile players on weak hardware are the ones who experience and report perf failures." Desktop-only = verification of the wrong machine.
- FPS averages (CapFrameX): "in-game FPS counters average over short intervals (~500 ms), which hides spikes; only raw frame-time percentiles (1%/0.1% lows, p95/p99) expose stutters." Display frame times, not converted FPS, for low percentiles.
- Single metrics (Android): gate on FPS AND thermals + CPU/GPU-bound classification. "A single number cannot distinguish 'fast because underloaded' from 'fast because governor is masking a CPU bottleneck with low resolution.'"

## E. Shipped
- Doom Eternal / id Tech 7 (WIN): locked-60fps across platforms incl. Switch, DRS as the load-bearing technique. "Asymmetric governor behavior — aggressive downscale on spikes, conservative recovery — exactly the panic-mode pattern; verification on the weakest target (Switch), not the strongest."
- Vampire Survivors (WIN): migrated from Phaser web engine to custom/Unity — "from 5–8 FPS to a locked 60 FPS on Steam Deck." The fix attacked the real bottleneck (per-frame allocation of massive entity counts), not masking it. Entity-count performance = an architecture property, measured at steady state.
- Cyberpunk 2077 (CAUTIONARY): last-gen consoles unplayable; Sony delisted; stock −37%. "Verification was effectively done on the wrong hardware — high-end PCs stood in for the actual min-spec shipping platform, the exact 'desktop numbers' anti-pattern."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** panic honors the Unreal audit — all three criteria.
  1. Fires on real spike: p95 > 33ms on one eval (perf.js:99). ✓
  2. Floor honored: `govLevel = 4` max (perf.js:100); all step paths guard `govLevel < 4` (perf.js:99,106); arrays have exactly 5 levels (0–4). No runaway. ✓
  3. Recovery gradual, no oscillation: 10 evals per step up (perf.js:107) + 12–20ms dead band. ✓
  The panic is asymmetric (cut hard, recover slow) — the Doom Eternal pattern.
- **PERF-SPEC.md:** verification round 4 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
unreal · doom eternal · vampire survivors · capframex · android · cyberpunk
