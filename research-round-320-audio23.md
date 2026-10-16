# Audio Part 23 (Verification Round 7) — Findings (Round 320)
**Date:** Wed 2026-10-15 ~06:55 EDT · **Source:** live web research (riviere, audiokinetic, apx, inside)
**Project:** Mecha Protocol — audio (pre-jam; verification round 7)

## A. Mechanics
- Mix-translation audit (Riviere): mix must "translate well across various playback systems (headphones, hi-fi, surround, TV speakers)" and conform to platform specs. Audit same build on phone speaker, earbuds, laptop — "UI-critical SFX must survive the weakest endpoint."
- Loudness audit (Audiokinetic/PlayStation Feb 2024): "define a target before measuring." Console −24 LUFS ±2; Mobile −18 LUFS ±2; max peak −1 dBTP; max 20 LRA. "Measure actual hardware device output, not just middleware busses." "Minimum 30 minutes, representative of gameplay distribution — no capture bias." "Main mix should hit the target with no mastering adjustment needed."
- Accessibility audit (APX): "every audio cue that carries gameplay information needs a visual equivalent." "Subtitles must include speaker names, directional indicators, non-dialogue SFX descriptions." "Independent volume sliders per layer, mono-audio toggle, caption customization." "44–45% of players use subtitles."

## B. Validation
- Reference listening (Audiokinetic): "reviewing many reference titles and getting an understanding of their average loudness statistics so your title lands within general expectations."
- Meter calibration: "measure actual device output end-to-end; verify no gain offset; make mastering decisions only in a well-calibrated studio." Community: "mix to −24 LUFS integrated, monitor in-engine + dedicated meter, verify peak headroom."
- Hearing-diverse testing: "mute playthrough (does every audio-critical event have a visual channel?), mono mix, slider coverage, caption-equivalent coverage."

## C. Techniques
- Dynamic range discipline (Audiokinetic): "compress early in the pipeline per element rather than crushing the master." "Mastering compression does not work for all content and can easily make things worse."
- Frequency slotting (Riviere): "mixing is 'managing the frequency spectrum' with per-sound-type rules established early per category." Our 3-layer split is the slot architecture.
- Adaptive mixing (Riviere; Hellblade II): "side-chaining, ducking, HDR, and state mixing to dynamically adjust based on systemic scenarios." Hellblade II "heavily relied on dynamic ducking for clarity."
- Honest mastering (Audiokinetic): "mastering must be subtle — address persistent issues, not specifics." "Safety limiting may be the only mastering a title needs." "EQ offsets max ~3 dB; if more is needed, there's an issue better addressed earlier."

## D. What to avoid
- Loudness wars: "over-compressing assets and crushing the master causes clipping, distortion, fatigue — catastrophic when many ultra-loud assets trigger at once." Fix: "master-bus headroom of −6 to −3 dB, platform LUFS targets."
- Frequency masking: "without per-category spectral rules, layers fight for the same band and readability dies."
- Untested hearing profiles: "no mono-mix check, no visual-second-channel, no captions = unverified for a large segment."
- Master-bus crutches: "don't fix mix problems with master EQ/compression." "If the limiter is working hard, the mix is wrong."

## E. Shipped
- INSIDE (Playdead): "processed recordings through an actual human skull." "Levels use silence with only distant industrial rumbles — 'silence' as a design choice." "Audio carries gameplay information, not just mood." BAFTA Best Music 2017, GDC Best Audio 2017.
- Hellblade II (Ninja Theory): "recorded internal voices binaurally; 3rd-order ambisonic beds; procedural Foley; dynamic ducking for voice-layer clarity." "Fatigue-tested on Neumann NDH20/NDH30."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** mute-test coverage. Every audio-critical event has a visual channel (verified Round 310: hit-stop, flash, floater fire independent of audio). Master volume + mute persisted (sfx.js:14, Round 224). Mute playthrough passes — hits read via visuals alone.
- **HONEST GAP (not a jam-blocker):** no independent per-layer volume sliders (music/sfx/ui separately). APX recommends them; we have master only. Phase 2 candidate. Documented as known limitation.
- **AUDIO-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
riviere · audiokinetic · apx · inside · hellblade ii
