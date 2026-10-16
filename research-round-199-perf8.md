# Perf Part 8 (Final Validation) — Findings (Round 199)
**Date:** Wed 2026-10-14 ~19:28 EDT · **Source:** live web research (web-standards, nixiefx, losh, volumeshadertest, chrome, mdn, jacklehamster, gamedev, 80lv)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- 10ms internal discipline (not just 16.7ms); fixed timestep + interpolation.
- 16.7ms includes compositing; audit order (window → cull → alloc → pool → lists → passes).
- Losh (1-hour profiler pass; familiar env; test deploy early).

## B. Validation
- Thermal (throttle ~30s; cooled device; LPM off; iPhone 15 Pro baseline).
- DevTools (performance recording; FPS meter). Real-device (Android inspect; iOS Develop).
- Checklist (cool → cable → remote → 5-min soak → P10 after throttle).

## C. Techniques
- NixieFX (DPR cap 2; low draw calls; atlases; zero steady-state alloc; bound pools).
- MDN (pre-render; int coords; no drawImage scale; layered canvas; alpha:false; no shadowBlur; no per-frame text; rAF).
- Fixed timestep (decouple sim/render).

## D. What to avoid
- Last-minute additions. Wrong-thing optimization. Unvalidated deploy.
- Canvas traps (shadowBlur; per-frame text). Pool-without-cap.

## E. Shipped
- Terror of Mongolia (js13k; sprite caching; seeded grid).
- Losh LD34 (vanilla JS; profiler hour). SUPERHOT (7DFPS; minimal = performant).

## Implemented this round (code)
- **js/game.js:** pool prewarm at boot + drop-newest exhausted behavior.
- **PERF-SPEC.md:** BUDGET-HOLDING YES + jam perf gate.
- 4,164 lines (+4).

## F. Sources
web-standards · nixiefx · losh · volumeshadertest · chrome · mdn · jacklehamster · gamedev · 80lv
