# iPhone Sessions Part 3 (Touch & Performance) — Findings (Round 142)
**Date:** Thu 2026-10-15 ~08:50 EDT · **Source:** live web research (apple, nngroup, smashingmagazine, webkit, webmobilefirst, mdn, abratabia, web.dev, toucharcade ×3, gdevelop, pocketgamer, gameanalytics)
**Project:** Mecha Protocol — mobile (Phase 3 week-1, pillar 3)

## A. Touch
- Apple 44×44. NNGroup (1cm; fingertip 1.6-2cm; slips; Fitts).
- Thumb zone (easy/natural/hard; bottom-center). iPhone 17 (402×874; 3×; safe-area).
- Single-tap (StS tap-tap; no hover).

## B. Performance
- MDN (offscreen; no shadowBlur; rAF; cap DPR; alpha:false).
- Abratabia (thermal throttling 3-5min; 70-80%; pooling).
- Memory (100-200MB tab kill). Feral (per-device; no slider).

## C. Session
- GameAnalytics (2.7min median). web.dev bfcache (pagehide/pageshow).
- iOS (background suspend; autosave-on-pagehide).

## D. What to avoid
- Small targets (StS iOS). Finger occlusion. Sub-60fps.
- GDevelop 5 mistakes. Feral (don't emulate mouse). Audio unlock.

## E. Shipped
- ItB iOS (tap-only; 8×8). StS iOS (tap-tap). XCOM iOS (touch-first).
- Polytopia (mobile-first; 6-person; 25M+).

## Implemented this round (code)
- **js/game.js:** battery saver — reducedEffects drops render scale to 1×.
- **MOBILE-SPEC.md v1:** production mobile spec.
- 3,566 lines (+3).

## F. Sources
apple · nngroup · smashing · webkit · webmobilefirst · mdn · abratabia · web.dev · toucharcade ×3 · gdevelop · pocketgamer · gameanalytics
