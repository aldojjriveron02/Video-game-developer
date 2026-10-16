# Tutorial Part 14 (Pre-Jam Freeze) — Findings (Round 220)
**Date:** Wed 2026-10-14 ~21:31 EDT · **Source:** live web research (gamedev, ec, gmtk, baba, celeste)
**Project:** Mecha Protocol — tutorial (Phase 3, pre-jam)

## A. Jam tutorial
- Survival mechanic. DONE 2h before; playable first; grasp goal/controls/win.
- Freeze BEFORE jam; teach only M3 slice.

## B. Validation
- 7-item freeze (≤8w; actionable 2s; 5s hint; split; unfailable; skip; buffer).
- EC (less text; don't frontload). GMTK (split; HL2 no-text).

## C. Techniques
- Celeste one-liner (goal + controls, one breath).
- 5 invisible methods. Baba reverse-levels (map = tutorial).
- Freeze-safe = data-only; ONE method/flag.

## D. What to avoid
- Frontloaded walls. Punished trial-error. Teaching tap/swipe.
- Volatile-coupled hints. Late copy churn. Self-testing only.

## E. Shipped
- Baba Is You (2017). Canabalt (2009; zero tutorial).
- CELESTE Classic (4-day; one sentence). HL2 (60s unfailable).

## Implemented this round (code)
- **js/game.js + js/i18n.js:** M3 duel one-liner (7w EN+JA).
- **TUTORIAL-SPEC.md:** freeze discipline + 7-item checklist.
- 4,259 lines (+1).

## F. Sources
gamedev · ec · gmtk · baba · celeste
