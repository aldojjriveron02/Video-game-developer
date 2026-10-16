# Difficulty Part 4 (Assist & Dynamic) — Findings (Round 132)
**Date:** Thu 2026-10-15 ~06:10 EDT · **Source:** live web research (marty64 ×2, datafield, fireemblem wiki, mariowiki, re4 wiki, ufopaedia, dota2 wiki, serenesforest, dailyday, salivity, dodgeye)
**Project:** Mecha Protocol — difficulty (Phase 3 week-1)

## A. Assist
- Celeste: granular toggles, non-judgmental framing, zero gating.
- Hades: 20% +2%/death, 80% cap, permanent, damage-only.
- FE Casual: retreat-not-death since 2010; newcomer naming.
- Super Guide: 8-10 deaths, optional, interruptible, downgraded reward.

## B. Dynamic
- RE4 Game Rank: hidden, TWO-DIRECTIONAL (trap); weighted actions; 5→10 shots, 720→1800 dmg.
- XCOM 2: aim assist tiers; max engaged 4/6/8/unlimited; silent HP.
- Dota PRD: P(N)=C×N; 25% → 8.5% first, guaranteed by 12th.
- FE True Hit: 2RN; 80%→92.2% (honest display).

## C. Validation
- External testers (internal = over-skilled). Deaths at locations, quit points.
- Long-tail: launch-week = skilled minority. First 30 min smoothing.
- Salivity: death heatmaps; peaks-and-valleys. Median/p90 (means lie).

## D. What to avoid
- Rubber-banding. Fake difficulty/cheating. Three fakes.
- Two-directional DDA (RE4). Lying about odds.

## E. Shipped
- Celeste, Hades, FE Casual, Super Guide, RE4, XCOM 2, Dota PRD, FE True Hit.

## Implemented this round (code)
- **js/game.js:** miss pity as bounded PRD (player-only; +8%/miss; guarantee 6th; reset on hit).
- **DIFFICULTY-SPEC.md:** one-directional DDA hard ban + production spec.
- 3,488 lines (+10).

## F. Sources
marty64 ×2 · datafield · fe wiki · mariowiki · re4 wiki · ufopaedia · dota2 wiki · serenesforest · dailyday · salivity · dodgeye
