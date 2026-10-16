# Audio Part 9 (Final Validation) — Findings (Round 198)
**Date:** Wed 2026-10-14 ~19:23 EDT · **Source:** live web research (ldjam, itch.io, chrome, webkit, huddee, feross, airwiggles, aswg, soundarmoury, zzfxm, js13k)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- LD rules (72h; 3rd-party audio = Audio opt-out; all-synth = eligible).
- Audio criterion: "how good it sounds / effective sound design" (1-5).
- itch (ZIP ≤1000/500MB; Click-to-Play = unlock gesture).
- Submission Hour (1h; bug fixes only).

## B. Validation
- Loudness (mobile −18 LUFS-I; console −24; indie −19.6 mean).
- SFX tiers (−13 max; −18 to −14 loud; −23 focus; −28 quiet).
- VO tiers (−19 to −18 emphasis). Couthier (±3dB; mix low).
- 4-device matrix (iPhone 17 ×2, desktop ×2, Android).
- Mix check (LUFS over M3; −13 ceiling; music 6-10dB under).

## C. Techniques
- Master limiter (DynamicsCompressor). BGM duck 3-6dB under barks.
- iOS silent fix (audioSession.type='playback'; Safari 16.4+; iPhone 17 = iOS 26).
- Fallback (silent buffer). Autoplay (suspended → resume; lazy; test flag).

## D. What to avoid
- iOS silent mute (#1 trap). Suspended context. itch iframe autoplay.
- Loudness drift. Post-bfcache audio. New features post-deadline.

## E. Shipped
- ZzFXM (<1KB songs; js13k). "2021: A Space Opera" (js13k winner; TinyMusic).
- jsfxr (created FOR LD). js13k toolchain.

## Implemented this round (code)
- **js/sfx.js:** iOS audioSession guard (both contexts covered).
- **AUDIO-SPEC.md:** mix-ready decision + 4-device matrix + mix check protocol.
- 4,160 lines (+2).

## F. Sources
ldjam · itch.io · chrome · webkit · huddee · feross · airwiggles · aswg · soundarmoury · zzfxm · js13k
