# Feel Part 13 (Agnostic Playtest) — Findings (Round 214)
**Date:** Wed 2026-10-14 ~20:53 EDT · **Source:** live web research (jamzo, nng, shade, gamedesign.gg, vlambeer)
**Project:** Mecha Protocol — feel (Phase 3, pre-jam)

## A. Jam feel
- Jamzo (juice = memorable; gray box + feel > pretty spreadsheet).
- LD (browser, minutes, alone — M3 slice is right shape).
- Start screen = first touch; UI juice mandatory.

## B. Validation
- Nielsen (5 users; more studies > more users; 2 for agile).
- Shafer (unguided; think-aloud; no coaching; stalls = findings).
- Schade (no leading; authority effect; neutral Qs).
- 2×5, touch+desktop, silent, unassisted, 5s stall threshold.

## C. Techniques
- Hit-stop (~0.05s; scale w/ damage; multi-hit caution).
- Shake (punch not earthquake; toggle; scale to meaning).
- Particles (handful; prewarmed pool ✓). Easing (non-input only).
- Audio (pitch varied ✓). Vlambeer (~30 tweaks on flat proto).

## D. What to avoid
- Over-juice (queasy; confetti; freeze; mushy).
- Shake overdose. New feel after freeze. iOS autoplay.
- Friends-only + leading Qs. Last-6h on particles.

## E. Shipped
- Nuclear Throne (MOJAM 2013; feel bible).
- Baba Is You (Nordic 2017; grid; readability).
- Celeste (PICO-8 4-day; buffer; Assist Mode).

## Implemented this round (code)
- **js/game.js:** 3-state shake intensity (full/reduced/off) + persistence.
- **FEEL-SPEC.md:** conditional decision + agnostic protocol.
- 4,249 lines (+16).

## F. Sources
jamzo · nng · sch · gamedesign.gg · vlambeer
