# Feel/Juice Part 6 (Hit-stop & Validation) — Findings (Round 143)
**Date:** Thu 2026-10-15 ~09:05 EDT · **Source:** live web research (youtube ×4, ssbwiki, gamedeveloper, eolt, arxiv, nickballou, fortressofdoors, reddit)
**Project:** Mecha Protocol — feel (Phase 3)

## A. Hit-stop
- Smash (dmg/3+constant; attacker/defender; electric 1.5×; caps 20-30f; per-hitbox).
- GGXrd (7f light, 10f heavy). Sakurai (8 techniques; "Stop for Big Moments").
- Song (God of War).

## B. Validation
- Juice-off (Jonasson/Purho: progressive layering). Juul A/B.
- Kao (n=3,018; goldilocks). Hicks (multimodal). arXiv (no hit-stop = weak).

## C. Tiering
- Hicks (multimodal; exaggeration/focus/ambient). Pichlmair (tuning/juicing/streamlining).
- Brown (one primary feeling per moment).

## D. What to avoid
- Over-juice (Kao). Confusion (Doucet). Delayed pre-feedback (Napoli 0.1s).
- Shake zero-floor (Nijman). Swink (predictable/instantaneous/harmony).

## E. Shipped
- GoW axe (1.5s timeout; 0.1s wiggle; 3 rumbles). ItB (snappy).
- Smash (ladder math). Hades (readable under density).

## Implemented this round (code)
- **js/game.js:** kill shot 0.15s hit-stop (deepest); cap 0.2s.
- **FEEL-SPEC.md:** production feel spec appended.
- 3,570 lines (+4).

## F. Sources
youtube ×4 · ssbwiki · gamedeveloper · eolt · arxiv · nickballou · fortressofdoors · reddit
