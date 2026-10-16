# Audio Part 5 (Jam & Validation) — Findings (Round 164)
**Date:** Wed 2026-10-14 ~18:40 EDT · **Source:** live web research (mdn ×3, js2devlog, keithclark, js13k, zzfx, bugnet)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- MDN (autoplay policies; prime in gesture; mobile hostile; audio sprites).
- js13k toolchain (SoundBox; jsfxr; ZzFX; ZzFXM — full songs <1KB).
- ZzFXM (few hundred bytes JS). 3 pillars: autoplay-safe, no assets, mobile-hostile.

## B. Validation
- js2devlog (verify OUTPUT; iOS unlock; real devices; node routing; dispose).
- bugnet snippet (interruptions; headphone unplug). MDN (query autoplay policy).

## C. Techniques
- MDN (sprites; pannerNode; multi-track; beat sync). js2devlog (3-node SFX;
  layering; ADSR; buses; 120ms lookahead; "zero bitrate"). ZzFXM (panning; patterns).

## D. What to avoid
- Autoplay assumptions. iOS silent playback (no errors, no sound).
- Mobile volume disabled. BGM seams. Reverb routing. Node leaks. Promise rejections.

## E. Shipped
- js13k 2020 ZzFXM games. ZzFX (620 stars). ZzFXM repo. SoundBox.

## Implemented this round (code)
- **js/music.js:** Music.duck(dur) — BGM dip 0.55→0.18, smooth recovery.
- **js/game.js:** duck called on telegraph stinger.
- **AUDIO-SPEC.md:** jam decision (no Pixabay tracks) + validation + traps.
- 3,879 lines (+17).

## F. Sources
mdn ×3 · js2devlog · keithclark · js13k · zzfx · bugnet
