# AI Part 5 (Jam & Validation) — Findings (Round 161)
**Date:** Wed 2026-10-14 ~17:40 EDT · **Source:** live web research (aiandgames, reddit, gamedeveloper, shaggydev, acm, valve, egm, steam, sscait, bugnet)
**Project:** Mecha Protocol — AI (Phase 3, pre-jam)

## A. Jam AI
- ItB (simple hand-coded; difficulty from composition; fixed by playtesting).
- ArcheanGames (rejected MCTS — "little control, hard to tweak").
- Jam constraints: cheap, readable <30s, fair. "Dumb but legible" wins.

## B. Validation
- PathOS (AI playtesting). Bot ladders (SSCAIT 115K games).
- Bugnet = crash tracking, NOT AI playtester. L4D (measure player experience).

## C. Techniques
- Utility AI recipe (Huebner; 0-100 scale; XCOM). Mechanics (response curves; bucketing).
- Telegraphed AI (ItB; FTL weighted-priority). Difficulty via handicaps (L4D).

## D. What to avoid
- "Mathematically balanced" ≠ fair-feeling (Civ Rev fudged odds; Tetris transparency).
- Cheating AI (only if invisible). Rubber-banding discovered = trust destroyed.
- Expensive AI (MCTS on mobile). Opaque RNG.

## E. Shipped
- ItB (hand-coded + telegraphs). XCOM (utility AI). FTL ("if the enemy played smart the player would have no chance").
- L4D (AI Director). Rise of the Elders.

## Implemented this round (code)
- **js/ai.js:** FTL priority-pick dial (easy 0.3 / normal 0.7 / hard 1.0); replaces top-N.
- **AI-SPEC.md:** jam decision + validation + fairness contract.
- 3,826 lines (+5).

## F. Sources
aiandgames · reddit · gamedeveloper · shaggydev · acm · valve · egm · steam · sscait · bugnet
