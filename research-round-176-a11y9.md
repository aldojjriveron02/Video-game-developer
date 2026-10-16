# A11y Part 9 (Jam & Validation) — Findings (Round 176)
**Date:** Wed 2026-10-14 ~22:50 EDT · **Source:** live web research (gameaccessibilityguidelines ×3, celeste.ink, naughtydog, alanzucconi, filament, itch.io, colororacle, coblis, webaim, specialeffect)
**Project:** Mecha Protocol — a11y (Phase 3, pre-jam)

## A. Jam a11y
- GAG Basic tier (the jam bar). Top-4 complaints (remap, text size, colorblind, subtitles).
- itch.io a11y jam precedent.

## B. Validation
- Color Oracle/Coblis (sim). Bugnet (4 areas). WebAIM keyboard method. NVDA/VoiceOver.
- Zucconi (test with disabled players; SpecialEffect).

## C. Techniques
- Okabe-Ito palette. Redundant cues (color+shape+text). Text scaling (TLOU2 HUD).

## D. What to avoid
- Filament 4 traps (color-only, hover-only, tiny text, time pressure). Flicker. Motion sickness.

## E. Shipped
- Celeste Assist Mode (stigma-free; "fit your needs"). TLOU2 (60+ settings; presets).

## Implemented this round (audit)
- **Verified compliant:** Celeste framing (no stigma), 70% alarm redundant (audio+visual+text),
  heat chevrons, intent telegraphs not color-only, reduce-motion, assists.
- **A11Y-SPEC.md:** jam decision + validation + traps. Spec only, +0 lines.
- 4,047 lines (+0).

## F. Sources
gameaccessibilityguidelines ×3 · celeste.ink · naughtydog · alanzucconi · filament · itch.io · colororacle · coblis · webaim · specialeffect
