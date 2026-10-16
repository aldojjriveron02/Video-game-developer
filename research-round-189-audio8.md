# Audio Part 8 (Jam & Validation) — Findings (Round 189)
**Date:** Wed 2026-10-14 ~18:38 EDT · **Source:** live web research (bfxr, gameanalytics ×2, gameaudioco ×2, zzfxm, js13k, airwiggles, chromium, albeza, puzzlebyrinth)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- SYNTH not recorded (Bfxr proof). Albeza (8-bit generator). GameAnalytics
  (essential-only triage; Titan Souls; 5-10% budget). js13k stack.

## B. Validation
- Gain staging (-9 to -12dB). Loudness (-18 LUFS ballpark [unverified]).
- In-context mandatory. Critical listening. 4-device matrix.

## C. Techniques
- Vertical layering (stems). Horizontal resequencing. Hybrid.
- SFX layering (Mixr). ZzFXM (hundreds of bytes).

## D. What to avoid
- 5 pitfalls (early, loops, mixing, optimization, feedback). Mix mud (KISS).
- Autoplay (iOS suspended). Listener fatigue (pitch vary, throttle).

## E. Shipped
- KTANE (GGJ 2014, audio-as-gameplay). ZzFXM winners. Journey/Celeste/Hollow Knight.
- Minit. Titan Souls.

## Implemented this round (audit)
- **Verified compliant:** pitch variation; mutes; unlock; synth.
- **AUDIO-SPEC.md:** mix-ready decision + 4-device validation + post-jam layering.
- Spec only, +0 lines. 4,106 lines (+0).

## F. Sources
bfxr · gameanalytics ×2 · gameaudioco ×2 · zzfxm · js13k · airwiggles · chromium · albeza · puzzlebyrinth
