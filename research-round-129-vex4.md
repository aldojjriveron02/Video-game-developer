# Boss Design Part 4 (VEX Duel & Multi-Phase) — Findings (Round 129)
**Date:** Thu 2026-10-15 ~05:25 EDT · **Source:** live web research (design doc ×2, salivity, gamedeveloper/stout, gamedesignskills/costa, bloodborne wiki ×2, wikipedia ×2, youtube/keren)
**Project:** Mecha Protocol — VEX (Phase 3 week-1, pillar 1)

## A. Duel
- Similarity/mirror: Badeline (mirror + delay), Bayonetta ("another version of you, but better").
- Sonic/Shadow trap: mirror without format adaptation = spam.
- Krauser: concession de-escalation, not desperation.
- Nemesis: procedural rivalry (patented — clone mechanics not code).

## B. Multi-phase
- Salivity: readable telegraphs, evolution over replacement, thematic shifts, rhythm/dialogue, fairness.
- Stout: boss = test + story; 8-beat structure; de-escalation needs visible defeat moment.
- Design Doc: checkpointing/lost-progress mitigation.

## C. Validation
- Costa: 2-6 iterations/boss; Garen/Morgana case studies; telemetry; flow channel; 6 errors.

## D. What to avoid
- HP sponge (gate on events). Cheating (same rules). One-boss mechanics. Stunlockable. Mirror without adaptation. Same-avoidance. Skipping iteration.

## E. Shipped
- Ludwig (2 phases, 50% cut, damage-type shift, two songs).
- Lady Maria (3 phases, evolution over replacement).
- SotC (16 colossi, puzzles). The End (sniper duel, tranq de-escalation).

## Implemented this round (code)
- **js/game.js:** VEX phase 2 now gates on FIRST LIMB BREAK (any limb), not torso HP ≤ 50%. Anti-HP-sponge.
- **VEX-DESIGN.md:** production VEX spec (M3 duel) appended.
- 3,448 lines (+1).

## F. Sources
design doc ×2 · salivity · stout · costa · keren · bloodborne ×2 · wikipedia ×2
