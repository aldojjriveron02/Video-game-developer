# Audio Part 3 (Procedural & Validation) — Findings (Round 144)
**Date:** Thu 2026-10-15 ~09:20 EDT · **Source:** live web research (gamedeveloper, asoundeffect, bugnet, thegameaudioco, nme, echoesanddust, youtube, soundonsound)
**Project:** Mecha Protocol — audio (Phase 3)

## A. Procedural
- Prosser (pitch shifting: random; 1.06^N chained; pitch as information).

## B. Validation
- Jacobsen (nuisance score; comfort triangle). Bugnet (audio QA 5-track).
- Mute-rate (telemetry synthesis).

## C. Layering
- Prunty (deploy silence verbatim; simple combat melodies; human elements).
- Silence-before-impact. Nioh 2 (4-layer).

## D. What to avoid
- Afterthought. Repetitive loops. Poor mixing. No optimization. Ignoring feedback.
- Constant music (fatigue). Wrong trigger. Late audio.

## E. Shipped
- ItB (deploy silence). Hades (Korb solo model). Nioh 2 (layered).

## Implemented this round (code)
- **js/sfx.js:** tone() severity param (0-3 semitones).
- **js/game.js:** telegraph stinger (pitch scales with max threat).
- **AUDIO-SPEC.md:** production audio spec appended.
- 3,582 lines (+12).

## F. Sources
gamedeveloper · asoundeffect · bugnet · gameaudioco · nme · echoesanddust · youtube · soundonsound
