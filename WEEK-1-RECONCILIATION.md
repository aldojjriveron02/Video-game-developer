# Week-1 Reconciliation: 1v1 Prototype → 3v3 Slice
**Date:** Thu 2026-10-15 · **Directive:** El Loko — "Don't rebuild combat from zero."
**Sources:** `~/workspace/game-builder/mecha-hangar/` (sim.js, bot-test.js, QA-REPORT-2026-10-14.md)

## What the 1v1 prototype gives us (bot-verified, 15/15 checks, 18 matchups × 30 seeds)
**9 weapons, measured DPS:**
| Weapon | dmg | acc | cd | Type | Expected HP/turn |
|---|---|---|---|---|---|
| kinetic_rifle | 14 | .90 | 1 | direct | ~12.6 |
| cannon | 26 | .65 | 2 | direct | ~5.6 (burst breaks heal thresholds) |
| plasma_cannon | 20 | .85 | 2 | pierce | ~8.5 (ignores armor/shield) |
| gatling | 4×4 | .88 | 1 | multihit | ~14.1 (DEAD — 0 bot picks) |
| energy_shield | — | — | 4 | shield | 60% block, 2 turns |
| repair_arm | — | — | 3 | heal | 22 HP |
| boosters | — | — | 3 | dodge | +35% dodge, 2 turns |
| fuel_cell | — | — | 0 | passive | +40 power capacity |
| shield_gen | — | — | 0 | passive | +12 armor |

**4 dead weapons (0 picks across 9,042 tracked):** smg, gatling, missile_pod, rocket_launcher.
→ DECISION: do not port dead weapons as-is. Gatling needs a fix (e.g., heat-efficient suppressive fire) or cut. The other three were already cut from the table.

**Loadout economy:** 6 hardpoints, 100 base power, 120 base HP. Power-budget validation (`loadout_over_budget`, `fuel_cell_capacity`) — port the VALIDATION PATTERN to the slice's two-axis (Weight × Power/Heat) gates.

**Bot harness methodology (port, don't rebuild):**
- Seeded RNG (mulberry32) + fight_deterministic / fight_seed_variance checks
- smart / greedy / random planner ladder (skill gap = strategy depth signal)
- Matchup matrix: 30 seeds per matchup, win rate / avg turns / crashes
- Dead-action detector (flags unused options)
- Stalemate gate: draw rate > 20% or avg turns > 45 → FAIL
- No-soft-lock invariants: cooldowns decay to zero, fights always terminate

**Heat:** 1v1 sim has NO heat (probe verified zero references). Heat comes from the Lab's build (pattern chevrons). The harness's no-soft-lock invariants EXTEND to heat: shutdown must always recover, heat must always decay.

## Reconciliation mapping (1v1 → 3v3 slice)
1. **Arm weapons (slice: 4 swappable):** kinetic_rifle → reliable mid; cannon → burst/anti-heal; plasma_cannon → pierce/anti-armor; 4th slot = FIXED gatling (suppressive) or energy_shield (defensive). Dead three stay cut.
2. **Enemy archetypes (5):** weight their enumerate→score→pick scorer with 1v1 weapon profiles (Brawler=cannon, Lancer=kinetic_rifle, etc.). Archetypes = weight vectors on one scorer (utility AI).
3. **VEX ace:** cannon burst profile (26dmg, .65acc) as signature-move baseline; energy_shield windows as phase-2 mechanic; repair_arm REMOVED for VEX (Bycer rule — don't invalidate player builds; heal-loop is the 1v1's documented degenerate).
4. **Two-axis gates:** port `validateLoadout` pattern → Weight × Power/Heat hard gates with bar-vs-white-line UI.
5. **Validation:** adapt bot-test.js → slice harness: 3v3 matchup matrix per (mission × difficulty × archetype), per-cluster win rates (never global average), Gate Zero bands (Rookie 60–80%, no cluster >90% player-loss).

## Week-1 pillars (from BUILD-PLAN.md)
1. **Readable puzzles** — intent telegraphs + answerability gate on M3
2. **Modular mechs** — 4-weapon arm set ported + balanced per 1v1 data
3. **iPhone sessions** — touch-first, 44px targets, <100ms input

## Build-hour log
Started day 1 (see BUILD-HOURS.md). Tag every hour per system. 2nd-encounter time = unit cost.
