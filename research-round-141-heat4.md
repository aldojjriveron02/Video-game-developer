# Heat Part 4 (Chevrons & Validation) — Findings (Round 141)
**Date:** Thu 2026-10-15 ~08:25 EDT · **Source:** live web research (gamedesign.gg, microsoft learn, w3c ×2, deque, colorblind.fyi, coblis, colororacle, stark, nngroup, smashingmagazine, wikipedia, measuringu, uxdesign, battletechhq, steam, armoredcore wiki, braceyourselfgames, gameindustry.com, meteorbyte, gamedeveloper)
**Project:** Mecha Protocol — heat (Phase 3 week-1)

## A. Chevron
- GameDesign.gg: 2+ independent channels; luminance survives, hue doesn't.
- Segmented fill = count channel. Microsoft: shapes + patterns.

## B. Validation
- Coblis, Color Oracle, Stark. 4.5% rule (1 in 22).
- WCAG (4.5:1, 3:1, 1.4.1, 1.4.11). 5-sec test. Grayscale/squint. RITE.

## C. Anti-fatigue
- Ignited Steel (double-edged; timers force bet). Phantom Brigade (threshold+buffer; vent verb; crosshatch).
- MWO override (priced in structure). BT tabletop (graduated 0-30). Meier (interesting decisions).

## D. What to avoid
- Invisible tax. No counterplay. Color-only. Ghost Heat (obscure).

## E. Shipped
- BT tabletop. HBS BT. MWO. AC6 (70% alarm). Phantom Brigade. Ignited Steel. FTL (counter-example).

## Implemented this round (code)
- **js/sfx.js:** warn() — two-tone 70% alarm ping.
- **js/game.js:** 70% crossing triggers alarm + visual floater (player only).
- **js/i18n.js:** EN + JA labels.
- **HEAT-SPEC.md v1:** production heat spec.
- 3,563 lines (+11).

## F. Sources
gamedesign.gg · microsoft · w3c ×2 · deque · colorblind.fyi · coblis · colororacle · stark · nngroup · smashing · wikipedia · measuringu · uxdesign · battletechhq · steam · armoredcore · braceyourself · gameindustry · meteorbyte · gamedeveloper
