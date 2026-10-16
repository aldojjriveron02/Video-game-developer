# Audio Part 21 (Verification Round 5) — Findings (Round 302)
**Date:** Wed 2026-10-15 ~05:53 EDT · **Source:** live web research (quarles, digimonk, sfx engine, hellblade, dead space, inside)
**Project:** Mecha Protocol — audio (pre-jam; verification round 5)

## A. Mechanics
- Mix audit (Quarles): "as a project gets closer and closer to final lock-down... the audio department needs to be able to go through the levels and do a final mix of the entire game from top to bottom after design has completed any major reworks to make sure that the aural integrity remains intact."
- Priorities audit (Quarles): "the human ear cannot distinguish hundreds of independent channels of audio at any given time... there needs to be a limit put in place." Simultaneous channel limits + priority sets; higher-priority trumps, lower resumes. Bus hierarchy (Master > SFX > Weapons) "split up and grouped in a sensible way... ready for ducking."
- Ducking audit (Quarles; FMOD): VO triggers → ramp all except voice to -9 dB over 500ms, hold for duration, ramp back over 1000ms; pre-roll offset so the listener is prepared. Checklist: attack, release, depth, hold, pre-roll, all non-dialogue buses caught.
- Silence audit (Digimonk): measure short-term loudness (400–3000ms), runtime average, max short-term. "Measure low-loudness passages and their durations... If the running game's low-loudness passages were too long, and their loudness values were too low, then the overall game would sound too quiet and unexciting." Gating (ignore below ~-45 dB) for perceived loudness.
- Meter rules (SFX Engine): audit headroom/LUFS on every bus; duck key SFX/dialogue; limiters sparingly.

## B. Validation
- Fresh ears (Game Audio Learning Portal; GDC Vault): dedicated audio QA role with explicit criteria — not just the mixer re-listening.
- Device matrix (Digimonk; SFX Engine): "the built-in speaker output of industry standard mobile phones will clip when the sound sample's RMS goes above -8 dB." Device checklist, various volumes, reference mixes, accessibility. Dead Space Remake: Stereo / Multichannel / 3D Headphones output options.
- LUFS (ITU-R BS.1770-3): LKFS = LUFS (1:1). Xbox/PS4 TRCs include loudness tests — non-negotiable. Sony WWS: -23 LUFS. Critical Listening Lab: music ~-14, SFX/dialogue ~-18 to -23. AnsoAudio: console -23 ±2, portable/mobile -18, true peak -1 dBTP.

## C. Techniques
- Adaptive music (Dead Space Remake): "dynamically mixed layered music that reacts to [game state]" + "Alive system" (breathing/heart rate) — parameters driven by live state, not static tracks.
- Ducking (Quarles): defined depth (-9 dB), explicit attack/release/hold/pre-roll. "Ducking is a tool... used wisely and in conjunction with other methods." Guides attention (objectives/VO over ambient).
- Layering (SFX Engine; Hellblade II): ambience in three layers (bed, mid-ground, foreground). Hellblade II: six actors layered for the Tyrant's voice + 3D effects. "Rise and dip instead of long brick walls."
- Silence as design (INSIDE; Quarles; Galante): Andersen's near-silent foley — "silence as the loudest design tool." Quarles: games need "peaks and valleys, much like a great piece of music." Galante: "sound drives story, but story is 'king.'"

## D. What to avoid
- Clipping (SFX Engine #1): meter with LUFS, leave headroom, limiters sparingly. Phones clip above -8 dB RMS.
- Wall of noise / masking (Quarles): without priorities, the spectrum "will lose dynamics and quickly become a wall of noise. When this happens, the player will more than likely turn down or mute the audio — thereby destroying the atmosphere and the pacing."
- Unducked dialogue: dialogue must own its bus; ducking via sidechain + queue systems required, not optional.
- Ducking abuse (Quarles): "If it's used too frequently or aggressively, it will become distracting."
- Post-freeze mix changes (Quarles): design changes near lock-down change a level's "rhythm"; shipping without a re-mix breaks aural integrity. Freeze = changes require re-audit, never silent tweaks.
- Repetition fatigue (SFX Engine): 3–5+ variations per sound, randomization containers, pitch/volume randomization. Standardize 48 kHz/24-bit masters.

## E. Shipped
- Hellblade II (Ninja Theory): binaural → full 3D-space; Furies performed around a Neumann KU 100 dummy head; Tyrant = six layered actors + 3D effects. "Sound subordinated to story." Lesson: "no clear vision early forced a painful 3D-audio rebuild — '3D audio is set in stone,' so record with intent."
- Dead Space Remake (EA Motive): adaptive layered music + Alive system (breathing/heart rate) + audio occlusion; Stereo/Multichannel/3D Headphones options. "Every layer serves dread."
- INSIDE (Playdead): Andersen's near-silent foley — absence carries the horror. "Restraint created dynamics that a constantly loud mix could never achieve; the player's ears 'reset,' so every sound hits harder."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** anti-fatigue via synthesis (SFX Engine). All SFX are synthesized (no samples); the core `tone()` applies random ±1 semitone per play (sfx.js:84) — "never play the exact same sample twice." Plus severity-shifted pitch (sfx.js:85): higher threat = higher pitch — "pitch as information" (aural juice reinforcing intent). The randomization IS the variation pool; discrete 3–5 samples unnecessary for synthesized audio.
- **AUDIO-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,535 lines** (+0).

## F. Sources
quarles · digimonk · sfx engine · hellblade · dead space · inside
