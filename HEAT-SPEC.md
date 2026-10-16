# HEAT-SPEC.md v1 — Production Heat (Slice)
**Date:** Thu 2026-10-15 · **Round 141** · **Status:** DRAFT for slice build

## 70% alarm (IMPLEMENTED)
- Crossing 70% maxHeat (player): two-tone audio ping (SFX.warn) + visual floater.
- AC6 pattern: pre-threshold telegraph, before the point of no return.
- EN + JA labels.

## Chevron encoding
- 4 chevrons = COUNT channel (positional fill).
- Hue = reinforcement (cool→amber→red). Never hue-only.
- Numeric heat % readout. SHAPE/TEXT at danger (hazard striping + CRITICAL).
- Passes GameDesign.gg audit: color + border + pips + label.

## Heat as bet (Ignited Steel)
- 70%+ = damage bonus (already in game.js hotBonus).
- Double-edged: outgoing up AND incoming up.
- Mission pressure forces the bet.

## Vent as verb
- Explicit action, stated rate/duration.
- All heat sources render in preview. No hidden heat.

## Validation
- Grayscale test + Coblis + 25% squint.
- 5-sec glance: "which chevron = danger?"
- RITE rounds. 4.5% population rule as tripwire.
- Heat-bet telemetry (buffer entries, vent uses, shutdown causes).
