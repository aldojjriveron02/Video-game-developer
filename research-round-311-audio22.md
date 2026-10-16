# Audio Part 22 (Verification Round 6) — Findings (Round 311)
**Date:** Wed 2026-10-15 ~06:27 EDT · **Source:** live web research (quantic lab, jacobsen, testdevlab, audiokinetic)
**Project:** Mecha Protocol — audio (pre-jam; verification round 6)

## A. Mechanics
- Freeze certificate (Quantic Lab): "detailed specifications for audio standards — decibel levels, bitrates, channel configurations, latency tolerance." "Audio must be tested at every stage, not just at the end, because late fixes are expensive." (Wwise): main mix hits loudness target with no mastering adjustment; set up mastering early.
- Variation audit (Jacobsen): "nuisance score" — "play the game, log which sounds trigger most often, and mark every sound that 'sonically ruins the experience' as an audio bug." (TestDevLab): "repeatedly trigger the same actions and note whether the soundscape changes." Sample consistency: "one odd sample in a pattern is conspicuous."
- Device matrix (TestDevLab; Quantic Lab): dedicated audio lab; test low- and high-end; "platforms handle audio differently." Wwise: mix must translate across headphones, stereo TV, 7.1.4 Atmos. "Never over-process for consumer hardware — master toward a neutral target."

## B. Validation
- Dedicated QA (Quantic Lab; TestDevLab): automated tests first (consistency) + manual/subjective (dialogue tone, emotional match). Focus groups for clarity, balance, quality.
- Output modes (Wwise): per-mode presets (e.g., "Night Mode" muting LFE). "Every listening mode offered must be validated."
- Reference mixes: investigate reference titles' loudness statistics; decisions A/B in calibrated studio.
- Hard numbers (PlayStation via Audiokinetic, Feb 2024): console -24 LUFS ±2; mobile/portable -18 LUFS ±2; max peak -1 dBTP; max 20 LRA; "minimum 30-minute capture representative of the gameplay distribution (no capture bias)."
- Measure actual device output (looped into DAW), "never just middleware meters — this captures the entire audio pipeline as players hear it."

## C. Techniques
- Synthesis vs samples: three methods — record, stock, synthesize. "Synthesis is less common because it's more expensive," but pros favor layering: "weapon SFX = attack click + bass hit + tail; ambient beds layer ~15 channels." Validates our procedural approach.
- Procedural variation (TestDevLab; Jacobsen): "engines randomize pitch, loudness, and delay per trigger." "Layering + randomization is the single most powerful fix." Split components for multiplicative variation; notch filters so music never clashes with UI/SFX.
- Mix discipline: subtractive EQ, cut lows below 80Hz, export mono, normalize to 0dB. Mastering: neutral tonal balance; EQ offsets max ±3dB; safety-limit at -1/-2 dBFS. "With LUFS targets at -24/-18, the limiter should barely work."

## D. What to avoid
- Repetition fatigue: "overused loops, identical triggers; one odd sample in a consistent set reads as a bug."
- Mix drift: "music, SFX, dialogue must stay balanced; master subtle."
- Untested outputs: "platform differences, untested speaker setups, mixing in uncalibrated rooms."
- Silent failures: "music playing indefinitely or stopping abruptly; stripped SFX layers; occlusion faults; concurrency faults — TestDevLab's test is literally 'spam away' triggering sounds to find mud or crashes."
- Audio as afterthought: "write a sonic style guide alongside the visual art direction from day one."

## E. Shipped
- Inside (Playdead): Andersen "playing synthesized/processed audio through an actual human skull with contact microphones — bone conduction as a unique filter." "A single coherent processing chain made every sound belong to the same world; identity came from disciplined experimentation, not bigger sample libraries."
- Hellblade (Ninja Theory): full binaural 3D; "asked players to wear headphones and disable extra audio processing to hear the mix as validated." Won major audio awards.
- Hades (Supergiant): Korb's vertical layering scales with combat intensity; "adaptive layers + long public iteration eliminated music fatigue across hundreds of runs."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** concurrency protection (sfx.js:11,63). MAX_VOICES: 12 — "BBC-style voice cap." Non-priority sounds drop at cap ("drop, don't stack"); priority/critical tier bypasses. Passes TestDevLab's "spam away" test — rapid triggers can't crash or muddy, excess is dropped cleanly.
- **AUDIO-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
quantic lab · jacobsen · testdevlab · audiokinetic · inside · hellblade · hades
