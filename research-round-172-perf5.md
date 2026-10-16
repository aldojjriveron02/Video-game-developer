# Perf Part 5 (Jam & Validation) — Findings (Round 172)
**Date:** Wed 2026-10-14 ~21:35 EDT · **Source:** live web research (MDN, web.dev ×2, chrome.dev, GPP ×2, eliasku, itch.io, playgama, wayline)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- 53% abandon over 3s (Google). RAIL budgets. Bundle norms (<5MB).
- Vanilla JS = structural advantage. itch.io limits + GZIP/Brotli.

## B. Validation
- RAIL (10ms/16.7ms; 100ms input; 50ms jank). LoAF (Chromium-only — Safari blind).
- DevTools toolkit. Soak tests (30+ min).

## C. Techniques
- MDN canvas (11 items; layered = validated). Object pooling. Dirty flags (caveats).
- js13k tricks (Canvas 2D 60fps; cache emoji; DPR).

## D. What to avoid
- GC pressure. Layout thrash. Overdraw/fill-rate. shadowBlur. Premature optimization.

## E. Shipped
- Cat Survivors (13KB; 60fps). js13k class. itch.io norms.

## Implemented this round (code)
- **js/perf.js:** longtask PerformanceObserver (Safari jank signal; LoAF is Chromium-only).
- **PERF-SPEC.md:** jam decision + validation + traps.
- 4,036 lines (+17).

## F. Sources
MDN · web.dev ×2 · chrome.dev · GPP ×2 · eliasku · itch.io · playgama · wayline
