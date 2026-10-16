# Perf Part 9 (Final Confirmation) — Findings (Round 208)
**Date:** Wed 2026-10-14 ~20:12 EDT · **Source:** live web research (gamedev, mdn, nixiefx, abratabia ×2, generalistprogrammer, arcadigo)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- GameDev (don't wait final hour; test LD env; tight scope).
- Abratabia (sign-off metrics BEFORE; load + runtime; 3-tier matrix; <100KB Brotli; <10s Fast-3G).
- Freeze ≥24h before deadline.

## B. Validation
- NixieFX (12.5ms budget; 3 signals; A/B; 34→9.4ms case).
- Abratabia (CI; HUD; p50/p95/p99; memory budgets; 30-min leak test).
- Thermal (3-5 min cliff; 10-30 min sustained).

## C. Techniques
- MDN (offscreen; integer coords; no scaling; layered; alpha:false; batch; rAF; dirty regions).
- NixieFX (zero alloc; no map/filter; ring buffers; DPR cap 2; cull).
- GeneralistProgrammer (profile→fix; CPU vs GPU; pooling 60x; dynamic 30-50%).
- Abratabia (75% governor; hysteresis; Workers).

## D. What to avoid
- Single-source. Shrinking features. Unpooled alloc. Unbounded DPR.
- Optimizing w/o profiling. Desktop≠phone. LPM throttling. DevTools skew.

## E. Shipped
- NixieFX (34→9.4ms; 212→47 draws). GeneralistProgrammer (batching 5000→500).
- MDN (offscreen cache pattern).

## Implemented this round (audit)
- **Verified:** governors + hysteresis + LPM detection (all in code).
- **Verified:** zero-alloc hot loop (dirty-flag; pools prewarmed).
- **PERF-SPEC.md:** confirmed (code side) + submission checklist.
- Spec only, +0 lines. 4,193 lines (+0).

## F. Sources
gamedev · mdn · nixiefx · abratabia ×2 · generalistprogrammer · arcadigo
