# Perf Part 7 (Jam & Validation) — Findings (Round 190)
**Date:** Wed 2026-10-14 ~18:42 EDT · **Source:** live web research (wayline, chrome devtools, debugbear, mironsoft, mdn, infinitecanvas, playgama, abratabia ×2, bugnet, js13k)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- Wayline (profile first; top 1-2; quick wins; "playable, stable, not perfect").

## B. Validation
- DevTools 4x/20x throttle. Calibrated presets (DebugBear). Real devices win
  (mironsoft: thermal can't be simulated). stats.js (our HUD covers).

## C. Techniques
- Object pooling (Playgama, Abratabia, GPP). MDN canvas (pre-render, int coords,
  layered, alpha:false, no shadowBlur). Culling (infinitecanvas — warns overhead).
- GPU hygiene (TypedArrays, VRAM).

## D. What to avoid
- Premature optimization ("let data guide"). GC spikes ("regular beat").
- Hidden allocations. Sacrificing vision. Culling without measurement.

## E. Shipped
- js13k (~300 entries, mobile category). Q1K3 (13KB Quake). RTS in 13KB.
- LittleJS. Tiny-Canvas. ZzFX. stats.js.

## Implemented this round (code)
- **js/game.js:** particle pool (300 preallocated, freelist reuse, zero alloc).
- **PERF-SPEC.md:** budget-holding decision + validation protocol + guards.
- 4,112 lines (+6).

## F. Sources
wayline · chrome · debugbear · mironsoft · mdn · infinitecanvas · playgama · abratabia ×2 · bugnet · js13k
