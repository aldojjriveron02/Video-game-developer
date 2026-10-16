# Music Part 2 (Adaptive & Licensing) — Findings (Round 109)
**Date:** Wed 2026-10-14 ~22:50 EDT · **Source:** live web research 2026-10-14 (pcgamer.com, daracrawford.com, pixabay.com ×2, reddit.com, ansoaudio.com, ftl.fandom.com)
**Project:** Mecha Protocol — music

## A. Adaptive
- Prunty (silence rule; implementation > composition; Morrowind mudcrab).

## B. Licensing
- Pixabay (allowed/prohibited; 4-8 min bucket; avoid "Attack on Titan Vibes"; AI labels).

## C. 3-layer
- Crawford (horizontal/vertical; stingers 3-20s; 120bpm; 2-bar splice; 48kHz).

## D. What to avoid
- Fatigue; repetition (≥5 min); copyright (Content ID self-test); too loud (-18 LUFS); wrong trigger.

## E. Shipped
- ItB (silence); FTL (2 layers); XCOM:EU; Phantom Doctrine; Splinter Cell.

## Implemented this round (code + spec)
- **js/music.js:** 'deploy' state (silence during unit placement).
- **js/game.js:** setState('deploy') on mission start; reset battleMusicOn.
- 3,402 lines (+3).

## Still needs Aldo
- Pick 2 Pixabay tracks (instrumental, 4-8 min, original titles).

## F. Sources
pcgamer · crawford · pixabay ×2 · reddit · ansoaudio · ftl
