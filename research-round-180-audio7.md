# Audio Part 7 (Jam & Validation) — Findings (Round 180)
**Date:** Wed 2026-10-14 ~17:40 EDT · **Source:** live web research (zzfx, zzfxm, jsfxr, hexshift, mdn ×2, smus, chrome, testdevlab, jacobsen, littlejs, mozilla)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- ZzFX (<1KB, 20 params, precache zzfxG/zzfxP). ZzFXM (442B music). jsfxr (LD2007).
- Hexshift (procedural recipe). MDN (best practices). Smus (master→compressor).

## B. Validation
- Chrome autoplay (MEI, auto-resume). MDN mobile (priming, no soft volume, test both).
- TestDevLab (concurrency spam, randomization). Latency (measure on iPhone 17).

## C. Techniques
- Layered synthesis. Ducking (setTargetAtTime, atk 0.1-0.3s, rel 0.5s).
- Adaptive (crossfade, stems on beat). Anti-boredom (variant pools, jitter).

## D. What to avoid
- Clipping (±1.0, -6dB, compressor last). Mud (separate bands). Autoplay.
- Fatigue (#1 killer; nuisance score). Per-trigger regen.

## E. Shipped
- ZzFX games (60+). LittleJS (4k stars). jsfxr Chip Pops (6000). Diridum.
- Field Runners, Angry Birds (WebAudio).

## Implemented this round (audit)
- **Verified compliant:** pitch jitter, bark rotation+cooldowns, voice steal,
  duck() setTargetAtTime, first-tap unlock.
- **AUDIO-SPEC.md:** jam decision + validation matrix + traps. Spec only, +0 lines.
- 4,060 lines (+0).

## F. Sources
zzfx · zzfxm · jsfxr · hexshift · mdn ×2 · smus · chrome · testdevlab · jacobsen · littlejs · mozilla
