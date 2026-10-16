# Perf Part 11 (Pre-Jam Freeze) — Findings (Round 225)
**Date:** Wed 2026-10-14 ~21:58 EDT · **Source:** live web research (nixiefx, mdn, rail, gpp, gaffer)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- GameDev (2h early; warmup upload; ship early/often).
- Generalist (feature-freeze 12–18h; perf freeze stricter).
- Vampire Survivors (web ships; know ceiling before jam).

## B. Validation
- RAIL (≤10ms/frame; 8.3ms @120Hz; 100ms input/50ms budget).
- DevTools (throttle; FPS; monitor). Real-device profiling.
- Soak tests (20-min thermal = console analog). WebAudio unlock.

## C. Techniques
- Pools (fixed/prewarmed/bounded; free-list O(1)).
- Offscreen pre-render. Integer coords. alpha:false. Batching.
- DPR ~2. Draw calls low hundreds. Zero steady-state alloc.
- Gaffer clamp (≤0.25s; accumulator; headroom).

## D. What to avoid
- Spiral of death. Optimizing without profiling. Render-target changes.
- Feature work in window. HUD at full cost. Audio node churn. 120Hz judder.

## E. Shipped
- Vampire Survivors (Phaser→Unity). js13k (13KB; procedural).
- Console soak tests. nixiefx checklist. LD warmup builds.

## Implemented this round (verification)
- **Verified:** dt clamped 0.05s (spiral-safe). Perf HUD off by default.
- **PERF-SPEC.md:** freeze timestamp + battery + trap watch.
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
nixiefx · mdn · rail · gpp · gaffer
