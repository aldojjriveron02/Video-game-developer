# Hangar Part 3 (Mech-Building & Paper Doll) — Findings (Round 131)
**Date:** Thu 2026-10-15 ~05:55 EDT · **Source:** live web research (pencilandpaper, ign ×2, lparchive, wikipedia, measuringu, nngroup ×2, taugrim, sinisterdesign)
**Project:** Mecha Protocol — hangar (Phase 3 week-1, pillar 2)

## A. Paper doll
- Crawshaw: 6 interaction states; ghost; in-range warnings; mobile alternative (tap→chips→Next).
- MW5: Weapons/Detail toggle; right-click quick-place; Valid Only filter; yellow no-ammo warning.

## B. Two-axis
- AC6: legs gate weight; cores gate arms; weight + EN gates.
- FM3: power budget; weight math LAST = hidden interdependence trap.
- MW5: tonnage pinned; Max Armor; heat sinks.

## C. Validation
- RITE: fix after 1; think-aloud; decision makers on team.
- MeasuringU: prototype not production; AoE II verification (2 clean = stop).
- Nielsen: think-aloud is tool #1.

## D. What to avoid
- Full sets (Taugrim: collapses choice). Stat bloat (≤5 numbers). Errors after fact.
- Hidden interdependence (FM3). Bottom-sheet traps (Laubheimer).

## E. Shipped
- AC6 (Assembly; legs/cores/generators). FM1/3 (per-limb HP; power budget).
- MW5 (MechLab; hardpoints; Valid Only; free paint).

## Implemented this round (code)
- **js/hangar.js:** "Valid Only" filter — weapon options disabled with reason if total arm heat > maxHeat; re-render on change.
- **HANGAR-SPEC.md:** production hangar spec appended.
- 3,478 lines (+5).

## F. Sources
pencilandpaper · ign ×2 · lparchive · wikipedia · measuringu · nngroup ×2 · taugrim · sinisterdesign
