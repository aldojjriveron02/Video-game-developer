# Difficulty Part 5 (Dynamic & Validation) — Findings (Round 139)
**Date:** Thu 2026-10-15 ~07:55 EDT · **Source:** live web research (wikipedia, reddit, sciencedirect, gameanalytics, bugnet, flukz, liquipedia, fandom, fireemblemwiki, hearthstone, steam, arqade, github, polygon, caniplaythat, celeste.ink, gamedeveloper, g-a-g)
**Project:** Mecha Protocol — difficulty (Phase 3 week-1)

## A. Dynamic
- One-directional DDA (Rollings/Adams: two-way is gameable).
- Crash Bandicoot (help weak, don't change for strong). God Hand (visible meter).
- RE4 two-way (don't copy). L4D Director (pacing, not slider).

## B. Validation
- GameAnalytics: balance maps (kills−deaths); normalize; gradient maps.
- Bugnet: intended curve; spike = deaths+retries+abandonment; fix teaching first.
- Gates: median ≤3; p90 ≤6; no cell >40% deaths; long-tail ≥70%.

## C. Pity
- Dota PRD (honest). FE true hit. Hearthstone hard cap.
- XCOM 2 hidden aim (mechanism not secrecy — disclose).

## D. What to avoid
- Rubber-banding. Lying odds (XCOM meme). Weaponized DDA (EA suit).
- Fake difficulty. Gameability.

## E. Shipped
- Hades (God Mode 20%+2%/death, cap 80%). Celeste (granular, tools-not-cheats).
- RE4 (1-10 scale). XCOM 2 (miss-streak relief). Dota 2 (PRD).

## Implemented this round (code)
- **js/game.js:** failure ratchet (per-mission; −15% / −25%; truthful intent numbers).
- **DIFFICULTY-SPEC.md:** production difficulty spec appended.
- 3,540 lines (+12).

## F. Sources
wikipedia · reddit · sciencedirect · gameanalytics · bugnet · flukz · liquipedia · fandom · fireemblemwiki · hearthstone · steam · arqade · github · polygon · caniplaythat · celeste.ink · gamedeveloper · g-a-g
