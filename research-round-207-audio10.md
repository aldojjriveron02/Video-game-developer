# Audio Part 10 (Final Confirmation) — Findings (Round 207)
**Date:** Wed 2026-10-14 ~20:08 EDT · **Source:** live web research (ldjam, asoundeffect, rtings, lans.cloud, jsfxr, beepbox, chrome, bugnet)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- LD (72h; Audio 1-5 stars; Submission Hour; bug fixes flagged).
- Asset rule (3rd-party = opt out of Audio; synth engine = tool, fine).
- sfxr "originally created for Ludum Dare" (jam-native synth).

## B. Validation
- Loudness (−23/−24 LUFS; −1 dBTP; −14 trailer).
- ebur128 (ffmpeg; scriptable gate). Bugnet taxonomy (6 bug classes).
- A Sound Effect (readability; pre-dubs; voice limiting; endpoints; mix passes).

## C. Techniques
- Limiter −1 dBTP (safety net). Ducking (BGM under voice/SFX).
- Voice priority (barks > UI > enemy > ambient). Hit-stop + audio pairing.
- iOS (audioSession playback; 'interrupted' state). Autoplay (gesture + start).
- jsfxr + BeepBox (jam-speed, zero budget).

## D. What to avoid
- iOS silent switch (#1 trap). 'playback' costs. 'interrupted' burst.
- Suspended at load. Pre-jam audio w/o opt-out. No mute. Oversized assets. Trailer-hot in-game.

## E. Shipped
- jsfxr (sfxr.me). sfxr (LD-original). BeepBox (MIT synth).
- ebur128 (one-command). Voice-limit pattern (A Sound Effect).

## Implemented this round (code)
- **js/barks.js:** BGM ducking on bark fire (0.4, 0.5s).
- **AUDIO-SPEC.md:** conditional decision + mix contract.
- 4,193 lines (+2).

## F. Sources
ldjam · asoundeffect · rtings · lans.cloud · jsfxr · beepbox · chrome · bugnet
