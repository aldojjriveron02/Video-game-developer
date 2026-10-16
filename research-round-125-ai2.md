# Enemy AI Part 2 (Enumerate-Score-Pick & Archetype) — Findings (Round 125)
**Date:** Thu 2026-10-15 ~03:40 EDT · **Source:** live web research 2026-10-14/15 (shaggydev.com, en.wikipedia.org, deliberategamedesign.com, gamedeveloper.com ×2, medium.com, docs.google.com, aiandgames.com, slay-the-spire.fandom.com)
**Project:** Mecha Protocol — AI

## A. Enumerate
- Shaggy Dev (utility AI = enumerate-score-pick; 0.1 near-tie; archetype = weights; Sims).

## B. Archetype
- Deliberate (Smasher/Emphasizer/Enforcer/Challenger × tiers); Vossen (cadence 2-3s, slots; focus-fire cap).

## C. Validation
- Zengin (Monte Carlo, 92% problem); Davis (map design, mission gates).

## D. What to avoid
- ItB (never: coordinate, distinguish, snoop, plan); Johnson (play to lose); Solomon (cheat FOR player).

## E. Shipped
- ItB Vek (COMPILE→SCORE→SELECT); Spire (weighted + Intent); XCOM; Sims; Civ IV.

## Implemented this round (code)
- **js/ai.js:** focus-fire cap (max 2 per mech, score ×0.1 if at cap).
- **js/game.js:** computeIntents tracks target counts per round.
- 3,430 lines (+14).

## F. Sources
shaggy · wiki · deliberate · gamedev ×2 · medium · google docs · aiandgames · spire
