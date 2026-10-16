# Feel Part 5 (Juice & Hit-Stop) — Findings (Round 128)
**Date:** Thu 2026-10-15 ~05:10 EDT · **Source:** live web research (sourcegaming, ssbwiki, gamedeveloper ×2, valdemird, adk.elsevierpure, ar5iv ×2, lowfierce, polygon/youtube, microsoft learn)
**Project:** Mecha Protocol — feel (Phase 3 week-1, pillar 1)

## A. Juice
- Redundant not decorative; tiered; reduced-motion; 60-80ms demo.
- Doucet: juice adds pleasure, OIL removes pain. Over-juiced + under-oiled = pain.
- Song 2005: quick attacks + help player SEE (camera, particles, sound, rumble).

## B. Hit-stop
- Sakurai: both freeze same time; scales with damage; caps; FFA constraint; visual-only vibration; hurtboxes static.
- SmashWiki: formula, caps 20/30 frames, per-attack modifiers (tipper 1.25×, Ryu 1.5×, electric 1.5×).
- Daniels: hit pause makes impact feel harder than it is.

## C. Validation
- Juice-off test (Jonasson & Purho). Juul & Begy A/B (juicy rated higher, performed WORSE).
- Pick-a-feeling (Pichlmair & Johansen). GEM 2022 (19 features; Kao: zero AND extreme juice both degrade).

## D. What to avoid
- Over-juice (Kao, Juul, Doucet). Shake slider must reach ZERO (Microsoft; 10% floor FAILS).
- Shake tiers + reduced-motion guard.

## E. Shipped
- GoW axe (Barlog: weight, recall). ItB snappy (micro-chunks, constant playtest).

## Implemented this round (code)
- **js/data.js:** WEAPONS.hitstop multipliers (blade 1.5×, cannon 1.25×, rifle 1.0×, missiles 0.7×).
- **js/game.js:** hit-stop uses per-weapon multiplier.
- **FEEL-SPEC.md:** production feel spec (M3 duel) appended.
- 3,447 lines.

## F. Sources
sourcegaming · ssbwiki · gamedeveloper ×2 · valdemird · juul/begy · pichlmair · gem2022 · lowfierce · polygon · microsoft
