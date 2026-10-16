# Audio Part 4 (Jam & Validation) — Findings (Round 156)
**Date:** Wed 2026-10-14 ~15:50 EDT · **Source:** live web research (chrome dev, pixabay ×2, reddit, checklist.gg, filippovicarelli, youtube, tunepocket, selektaudio, numberanalytics)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- Hook-y track + satisfying SFX on core verb + zero-install web audio.
- Chrome autoplay (suspended until gesture; title tap = unlock; verify in itch.io embed).

## B. Validation
- Mute-rate (toggle + sliders as telemetry; proxy for mix quality).
- Nuisance soak (10-min; 1-5; reject 3+ at min 10). Bugnet audio QA fields.

## C. Music sourcing
- Pixabay (290K+; free commercial; no attribution; trap: uncleared samples).
- Content ID certificates. Bulk 1-3 min (filter for 4-8 min pre-jam).

## D. What to avoid
- Autoplay-before-gesture. Strikes vs claims. Standalone redistribution.
- Phone-speaker mix. MP3 universal (OGG spotty in Safari).

## E. Shipped
- VS (FM-synth; tiny files; loops forever). Brotato (punchy synthesized SFX).

## Implemented this round (code)
- **js/telemetry.js:** session-end mute snapshot (audio:session_end:sfx_muted/music_muted).
- **AUDIO-SPEC.md:** jam audio + validation spec appended (pre-jam checklist).
- 3,783 lines (+9).

## F. Sources
chrome dev · pixabay ×2 · reddit · checklist.gg · filippovicarelli · youtube · tunepocket · selektaudio · numberanalytics
