# Tutorial Part 5 (Invisible & Coach Marks) — Findings (Round 130)
**Date:** Thu 2026-10-15 ~05:40 EDT · **Source:** live web research (gmtk ×2, gamedeveloper ×3, nngroup ×3, material, apple, nintendo, engadget, rps, gdc, indiegameculture, medium/hopson)
**Project:** Mecha Protocol — tutorial (Phase 3 week-1, pillar 1)

## A. Invisible
- Brown/HL2: one mechanic at a time, safe sandbox, NPCs demonstrate, weenies, lighting.
- Meat Boy: constraint teaches; Brownie = invisible tutorial.
- Hopson: reward desired behavior (reinforcement).

## B. Coach marks
- Harley NN/g: short, no chains, visuals, don't match UI, scannable.
- Laubheimer: push fails (paradox of active user); pull revelations win.
- Material feature discovery; Apple TipKit.

## C. Validation
- Nielsen: 5 users ≈ 85% of issues; 3 rounds × 5.
- Hopson: mid-playtest popup (Halo 2/3, ~3 min sweet spot); silent metrics.
- Valve: constant playtesting, watch where players get stuck.

## D. What to avoid
- Berbece: skippable, game literacy, UI-directed. Brown: don't front-load, affordances.
- Paradox of the active user: mandatory upfront tutorial is fought.

## E. Shipped
- Mario 1-1 (designed LAST; binary lessons). Portal (antepiece; one variable).
- Celeste (one mechanic, safe rooms, micro-stories). Hollow Knight (King's Pass; delayed Focus).

## Implemented this round (code + spec)
- **js/game.js:** Hopson mid-playtest instrument (4-option difficulty popup after each mission → telemetry; auto-dismiss 15s).
- **js/i18n.js:** EN + JA keys for the popup.
- **index.html:** hopson-check overlay element.
- **TUTORIAL-SPEC.md v1:** 4-layer stack (Environment/Demonstration/Coach-mark/Skippable).
- 3,473 lines (+25).

## F. Sources
gmtk ×2 · gamedeveloper ×3 · nngroup ×3 · material · apple · nintendo · engadget · rps · gdc · indiegameculture · hopson
