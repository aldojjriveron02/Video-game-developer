# Audio Part 11 (ebur128 Execution) — Findings (Round 215)
**Date:** Wed 2026-10-14 ~20:59 EDT · **Source:** live web research (ffmpeg, criticallisteninglab, mdn, jsfxr, howler)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- itch embed = judge path; first-click audio, zero setup.
- All-synth sidesteps codec matrix (Safari no OGG).
- Tap-to-start = unlock gesture. JAM_BUILD strips HUD.

## B. Validation
- ebur128 (ffmpeg -filter:a ebur128). loudnorm for correction.
- Targets: SFX/dialog −18…−23; music −14; 48kHz; master −18…−16, ≤−1dBTP.
- 4-device: iPhone silent OFF/ON; desktop Chrome; desktop Safari/Android.

## C. Techniques
- Master: per-bus → master → compressor (−6dB, 3ms, 250ms).
- Ducking (−6dB, 0.3s restore, exponential). 5–20ms fades.
- Voice mgmt (cap, steal oldest, prewarm). Sync resume() in gesture.

## D. What to avoid
- Autoplay before gesture. iOS silent switch (#1 trap).
- resume()-after-async. OGG-only. Stack-up clipping.
- HUD in JAM_BUILD. Bass vanishing on phone speakers.

## E. Shipped
- jsfxr (created for LD). Howler.js (unlock pattern).
- Critical Listening Lab (delivery specs). FFmpeg (zero-budget toolchain).

## Implemented this round (code)
- **js/game.js:** AudioContext re-check on bfcache + visibilitychange.
- **AUDIO-SPEC.md:** conditional decision + measurement protocol.
- 4,258 lines (+9).

## F. Sources
ffmpeg · criticallisteninglab · mdn · jsfxr · howler
