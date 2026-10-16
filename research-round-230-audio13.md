# Audio Part 13 (WebAudio Game Sound) — Findings (Round 230)
**Date:** Wed 2026-10-14 ~22:30 EDT · **Source:** live web research (airwiggles, parviainen, wilson, lof, copes, minim etro)
**Project:** Mecha Protocol — audio (Phase 1, pre-jam freeze)

## A. Mechanics
- WebAudio graph model; one-shot nodes GC automatically; long-lived nodes need disconnect().
- SFX synthesis: oscillators + noise buffers, gain envelopes, BiquadFilters, layered voices.
- Lookahead scheduler (Wilson "A Tale of Two Clocks"): ~25ms timer, schedule ~0.1s ahead on audio clock.
- Adaptive music: vertical layering (Journey), horizontal resequencing (Celeste), generative phasing (Eno/Reich).
- Sidechain: WebAudio has NO native sidechain on DynamicsCompressorNode. Pro workarounds: manual setTargetAtTime ducking; AudioWorklet sidechain compressor (Joel Löf).
- Jam winners synthesize (sfxr/jsfxr, Chip Pops methodology: per-category recipes, pitch-over-time fingerprints, seeded RNG, 16-bit WAV). js13kGames: all-synth is the only way.

## B. Validation
- Targets: mobile/browser −18 LUFS-I (±1), true peak −1 to −2 dBTP. **Our freeze matches the consensus exactly** (Turi/WoW, Beckmann/Lotum, Sony ASWG-R001, AES AESTD1004).
- Per-category SFX ladder (LUFS-M): loudest −13; loud −18 to −14; focus −23 to −18; average −23; quiet −28; barely audible −40 to −33.
- Measurement: OfflineAudioContext → WAV → FFmpeg `ebur128` + `loudnorm` (two-pass).
- 4-device matrix: headphones (2–5kHz harshness), laptop (bass rolloff ~150–200Hz), phone (mono sum!), Bluetooth/noisy.
- Clipping/DC: watch summed master during dense stacking; mix in the asset, not the master (Parviainen −20dB rule); "mix too low, turn up at the end" (Karadensky).

## C. Techniques
- Recipes: UI = filtered blips; hits = noise burst + sine thump; explosions = noise sweep + sub drop; power-ups = ascending arpeggio on a real scale; engine loops = zero-crossing trim or loop-crossfade.
- Variety: playbackRate = 2^(n/12) ±2 semitones; seeded variation pools; fingerprint to kill duplicates.
- Layering: saw+sine matched envelopes; drop levels substantially; detune to avoid phase cancellation.
- Ducking: manual gain automation or AudioWorklet sidechain — never master-bus compression as a mixing tool.
- Loops: loopStart/loopEnd at zero-crossings; incommensurable lengths for non-repeating generative music.
- Juice timing: trigger on event frame, schedule on audio clock, SFX latency <50ms.
- **Returnal protocol:** create every asset AT target loudness; freeze = gains table in version control; post-freeze only ±3dB documented commits, no master changes.

## D. What to avoid
- Master-bus compression as mixing tool (masks bad balance, pumps on dense stacks).
- Autoplay foot-guns: create/resume AudioContext inside first gesture. #1 silent-jam-game cause.
- Sample-rate mismatches; unmanaged AudioNode leaks (one-shots GC, persistent nodes don't).
- Loudness war on laptop speakers (−18 LUFS-I is the standard so users never ride volume).
- Audio as afterthought at jams (Chip Pops category checklist: interface/arcade/combos/jingles).
- Phase cancellation in layered synths (detune / vary waveforms / stagger).

## E. Shipped
- Mini Metro (Disasterpeace): real-time triggered samples, player composes music, anti-chaos voice cap (first 7 flammed in 16ths), 100s of sine variations.
- No Man's Sky (Paul Weir + 65daysofstatic): generative in-game synthesis, GDC 2017.
- Patatap (Brandel/Lullatone): pure WebAudio in browser, zero assets, beloved.
- js13kGames: decade of proof that all-synth ships real audio in 72h.

## Implemented this round
- **Verified (already in code):** MAX_VOICES=12 with priority steal (Round 171); ±1 semitone pitch variation (Round 126); severity-pitched SFX (Round 144); autoplay resume on gesture; iOS silent-switch guard (Round 198); master gain + persisted volume/mute (Round 224). All research code-recommendations already implemented.
- **AUDIO-SPEC.md:** Returnal protocol adopted (gains table = frozen; ±3dB documented commits only); offline loudness workflow (FFmpeg loudnorm two-pass); 4-device matrix checklist; jam-day smoke test.
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
airwiggles · parviainen · wilson · lof · copes · minim etro · gdc · mdn · ffmpeg
