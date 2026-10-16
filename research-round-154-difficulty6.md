# Difficulty Part 6 (Validation & Jam) — Findings (Round 154)
**Date:** Wed 2026-10-14 ~15:20 EDT · **Source:** live web research (nngroup, rumorgames, reddit, eurogamer, coolinfographics, wikipedia ×2, polygon, rps)
**Project:** Mecha Protocol — difficulty (Phase 3, pre-jam)

## A. Validation
- Nielsen 5×3 (5 players, iterate). Difficulty curve (flow; segment testers; test each mode).
- Halo 3 heatmaps (per-tile deaths → grid heatmap).

## B. Jam difficulty
- Rumor Games (1/3 LD42 <20 ratings; low barrier). r/ludumdare (tiny scope; never twice).
- SMB 1-1 (no-fail onboarding). First-10-seconds hook.

## C. Telemetry
- Halo heatmaps. L4D AI Director (intensity; precedent for ratchet+Hopson).
- Hunicke (adaptation invisible). KPIs: completion; median/p90; heatmap; assist uptake; abandonment.

## D. What to avoid
- Visible rubber-banding (Mario Kart; blue shell = telegraphed). Fake difficulty.
- Punishing raters. Assist stigma.

## E. Shipped
- Hades God Mode (20% +2%/death, cap 80%, locks nothing).
- Celeste Assist (granular; days of work). ItB (perfect information; legibility).

## Implemented this round (code)
- **js/game.js:** JAM_BUILD → difficulty defaults 'easy' (harder one tap away).
- **DIFFICULTY-SPEC.md:** validation protocol + jam rules appended.
- 3,719 lines (+3).

## F. Sources
nngroup · rumorgames · reddit · eurogamer · coolinfographics · wikipedia ×2 · polygon · rps
