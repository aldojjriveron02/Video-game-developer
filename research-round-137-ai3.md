# Enemy AI Part 3 (Archetype & Validation) — Findings (Round 137)
**Date:** Thu 2026-10-15 ~07:25 EDT · **Source:** live web research (gameai.com, wikipedia, mcvuk, steam ×2, gdcvault ×2, reddit ×2, gaming.stackexchange, tumblr ×2, saschb2b, news.ubisoft, pcgamer)
**Project:** Mecha Protocol — AI (Phase 3 week-1)

## A. Archetype
- IAUS (Dave Mark): data-driven; 7-min packages; GW2 shipped.
- Sims 3: Boltzmann + temperature; 3-axis personality.
- XCOM: one scorer + per-race weights (melee ignore cover; Sectopods attack>cover; Ethereals hang back).
- Fix for collapse: normalize 0-1; response curves; weight spread; distinctiveness audit.

## B. Validation
- Spire GDC 2019: per-cluster win rates; instrumented day one; 2-person team.
- Monte Carlo: N≈1000 (±3%); CI per cluster; Gate Zero bands.
- Ladder = procedural personas. Dead-action + stalemate = hard gates first.

## C. Anti-cheat
- ItB: no coordination/planning/peeking; perceived intelligence.
- XCOM 2: cheat FOR player; Legendary fair.
- askagamedev: fantasy of hero; telegraphs not search.

## D. What to avoid
- Omniscient. Rubber-banding. Hidden pro-AI bonuses. Perfect balance (band not point).

## E. Shipped
- ItB Vek (telegraphed; exploitable). Spire (intent state machine).
- XCOM (enumerate+score; per-race weights). Sims 3 (Boltzmann).

## Implemented this round (code)
- **js/ai.js:** archetypes as weight vectors (charger/skirmisher/holder/duelist; dmg/cover/self).
- **VEX-DESIGN.md:** production AI spec appended.
- 3,520 lines (+9).

## F. Sources
gameai · wikipedia · mcvuk · steam ×2 · gdcvault ×2 · reddit ×2 · stackexchange · tumblr ×2 · saschb2b · ubisoft · pcgamer
