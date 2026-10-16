# Barks Part 6 (Jam VO & Validation) — Findings (Round 160)
**Date:** Wed 2026-10-14 ~17:20 EDT · **Source:** live web research (valve wiki, gdcvault, radiator, wikipedia, cloudfall, substack, sarah-beaulieu, asoundeffect, reddit ×4, itch.io, steam, aalto)
**Project:** Mecha Protocol — barks (Phase 3, pre-jam)

## A. Jam VO
- Norm: NO recorded VO (r/gamedev). Alternatives (Hollow Knight gibberish; Dredge grunts; Bastion narrator).
- Jam economics (~40 lines). ItB: text quips.

## B. Validation
- Jacobsen nuisance score (count most-played; file offenders; odd-sample trap).
- r/gamedev muting (tactics players mute MORE; mobile public muting).
- Protocol: nuisance audit; mute correlation; recall; annoyance.

## C. Techniques
- Matejka (3 jobs; 5-10 alternatives). Beaulieu (5 functions; 2-10 variations).
- Valve Response System (respeakdelay; norepeat; odds; speakonce; stop_on_nonidle).
- ItB (repeat trigger, differentiate per character; shared trait).

## D. What to avoid
- Repetition (Skyrim). Irrelevance. Blocking. Odd-sample trap.
- VEX citing hidden state (fairness contract).

## E. Shipped
- L4D2 (7,800 lines; talker system). ItB (trigger repetition + differentiation).
- BATTLETECH (limited pool even commercially).

## Implemented this round (code)
- **js/barks.js:** stop_on_nonidle — barks yield when juice/sec > 3 (critical always fire).
- **BARK-SPEC.md:** jam decision (~50 lines, text-only) + validation + traps.
- 3,821 lines (+10).

## F. Sources
valve wiki · gdcvault · radiator · wikipedia · cloudfall · substack · sarah-beaulieu · asoundeffect · reddit ×4 · itch.io · steam · aalto
