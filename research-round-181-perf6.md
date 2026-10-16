# Perf Part 6 (Jam & Validation) — Findings (Round 181)
**Date:** Wed 2026-10-14 ~17:50 EDT · **Source:** live web research (sadil, playcanvas, mdn, smus, whatwg, chrome devtools ×2, web.dev ×4, abratabia ×2, bugnet ×2, paul irish, gamiday, playgama, js13k, slither)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- Sadil (practical JS budget 10-12ms; zero-alloc; pooling; DPR control).
- PlayCanvas (60fps=16.67ms; 30fps=33.33ms).

## B. Validation
- Chrome remote debug (USB + inspect). DevTools Performance panel.
- web.dev (mobile 5-10× slower; remote identical). Safari Web Inspector (iPhone 17).

## C. Techniques
- MDN canvas (offscreen pre-render; int coords; layer canvases; alpha:false; batch;
  dirty regions; no shadowBlur; rAF). Smus (redraw regions). WHATWG (batch drawImage).
- OffscreenCanvas (worker). Pooling (Bugnet, GamiDay).

## D. What to avoid
- Layout thrashing (batch reads/writes). Paul Irish reflow list. UI overdraw.
- Mobile paint bottleneck. Canvas rebuilds.

## E. Shipped
- slither.io (vanilla JS, tens of millions). js13kGames (13KB, 60fps). 2048 (vanilla, 60fps mobile).

## Implemented this round (code)
- **js/perf.js:** over-budget threshold 16.7ms → 12ms (practical JS budget).
- **PERF-SPEC.md:** jam decision + pre-jam work + traps.
- 4,060 lines (+1).

## F. Sources
sadil · playcanvas · mdn · smus · whatwg · chrome ×2 · web.dev ×4 · abratabia ×2 · bugnet ×2 · paul irish · gamiday · playgama · js13k · slither
