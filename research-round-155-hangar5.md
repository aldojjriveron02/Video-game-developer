# Hangar Part 5 (Validation & Jam) — Findings (Round 155)
**Date:** Wed 2026-10-14 ~15:35 EDT · **Source:** live web research (wikipedia, nngroup, diablo.fandom, strayspark, github, roblox ×2, minecraft.wiki, progameguides, game.wiki, ftl.fandom)
**Project:** Mecha Protocol — hangar (Phase 3, pre-jam)

## A. Validation
- RITE (fix after 1 when clear; makers on team). Nielsen 5×3.
- Paper-doll (Diablo term — equipment-slot figure). Diversity (3-4/group).

## B. Jam building
- StraySpark (scope discipline; presets; pre-built templates).
- ItB (14 squads, <30s pick). FTL (30 loadouts; build never blocks run).

## C. Onboarding
- Roblox (spotlight/dimming; just-in-time; timed hints). FTUE (starter items).
- Minecraft Recipe Book (catalog; show-craftable; one-click; progressive unlock).

## D. What to avoid
- Analysis paralysis (5+ min; ≤1 min target; cut branching; hide info; defaults).
- Interdependence trap. Bloat trap.

## E. Shipped
- AC6 (unlock after Ch.1; playstyle over stats). ItB (presets first, custom opt-in).
- FTL (30 loadouts; customization during run).

## Implemented this round (code)
- **js/data.js:** SQUAD_PRESETS (3 playstyle presets).
- **js/hangar.js:** JAM_BUILD-gated squad-select (renderSquadSelect; one-tap apply).
- **js/i18n.js:** squad-select keys (EN).
- **HANGAR-SPEC.md:** validation + jam spec appended.
- 3,774 lines (+55).

## F. Sources
wikipedia · nngroup · diablo.fandom · strayspark · github · roblox ×2 · minecraft.wiki · progameguides · game.wiki · ftl.fandom
