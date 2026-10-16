# Audio Part 12 (Pre-Jam Freeze) — Findings (Round 224)
**Date:** Wed 2026-10-14 ~21:53 EDT · **Source:** live web research (sunoboard, chrome, huddee, airwiggles, js13k)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- First casualty (SunoBoard). One-hour plan.
- Chrome autoplay (gesture; iframe allow). iOS silent switch (playback).
- LD60 = Jam (pre-existing legal). Freeze before theme.

## B. Validation
- −18 LUFS mobile. −12 dB music under SFX. −1 dBTP true peak.
- Volume slider (judges at night). Fresh-profile test. bfcache resync.

## C. Techniques
- Pitch ±5% (already ±5-15%). Music −12 dB. Bark ducking (sidechain).
- Procedural stack (ZzFX/jsfxr/TinyMusic). Volume persistence.

## D. What to avoid
- Auto-noise (pre-gesture). Silent-switch. Repetition. Balance trap.
- Creep (theme redesign). No-limit.

## E. Shipped
- ZzFX/ZzFXM (seeded). jsfxr (thousands LD). TinyMusic/Sonant-X.
- SunoBoard one-hour workflow.

## Implemented this round (code)
- **js/sfx.js:** master gain + persisted volume/mute (loadVol/saveVol/setVol/setMuted).
- **index.html:** volume slider + mute button (HUD).
- **js/game.js:** volume wiring.
- **AUDIO-SPEC.md:** freeze discipline + matrix + traps.
- 4,314 lines (+43).

## F. Sources
sunoboard · chrome · huddee · airwiggles · js13k
