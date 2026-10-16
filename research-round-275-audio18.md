# Audio Part 18 (Final Verification 2) — Findings (Round 275)
**Date:** Wed 2026-10-15 ~03:17 EDT · **Source:** live web research (zlobin, quarles, weir, sony aswg, mdn)
**Project:** Mecha Protocol — audio (pre-jam; final verification round 2)

## A. Mechanics
- Priority audit (GDC/Wwise practice): Tier 1 Critical (never kill, bypass virtual stealing) / Tier 2 High (kill oldest) / Tier 3 Medium (virtual) / Tier 4 Low (kill lowest volume). The audit: force an unnatural burst, verify low-priority drops while critical stays clean; trigger Tier 1 with the pool saturated — must kill Tier 4, never Tier 1. Our mapping: UI = Tier 1 (Lester); 12-voice cap = the saturated pool.
- LRA spot-check (Sony ASWG-R001, Taylor/Mongeau): BS.1770 metering (Integrated/Short-Term 3s/Momentary 0.4s); measure MINIMUM 30 minutes of real gameplay; capture LRA + True Peak + integrated. Portable reference: -18 LUFS average, true peak max -1 dBTP. Measure the FINAL rendered output (route to DAW or meter at output), not in-engine estimates. Our -18 LUFS = the portable reference exactly.
- Ducking stress (Quarles, LucasArts Fracture): ducker ramps non-VO to -9 dB over 500ms, holds until priority ends, ramps back over 1000ms, pre-roll offset. Stress: densest moment (state transition + max SFX + UI) — verify engage, hit target, release cleanly, never stick "on" or pump. Caveat: overused/aggressive ducking becomes distracting itself.

## B. Validation
- Device matrix (sfxengine): "the worst device your players will use" — cheap earbuds, laptop speakers, phone speaker. Same scenarios across all hardware; fresh ears (not the sound designer); different listening contexts (quiet room vs noisy commute).
- First-tap unlock (MDN): context created outside a gesture starts SUSPENDED; resume() on user interaction. Single AudioContext = validated at source level (Montag). Cover: real mobile Safari + Chrome, background/foreground, silent ringer, Bluetooth.
- Lock-pass log (Laven, GDC 2023 Audio Summit): daily QA routines (smoke tests, build verification), ad-hoc exploratory, audio-specific bug tracking, dev-requested verification. The log: dated checklist entry per lock item — run after every design change (Quarles: full top-to-bottom mix pass after any major rework before lock).

## C. Techniques
- Vertical re-orchestration (Zlobin, GGJ 2016 "7 Layers of Summoning" — built in <48h by 4 people): the most common adaptive technique. Discipline = CONSTRAINTS: same tempo, time signature, key, harmony; ~30s fixed loops; same DAW project; different rhythm/instrumentation per layer; each layer a very noticeable element. Key lessons: compose the neutral "zero layer" FIRST (Zlobin left it last → "boring and featureless"); mutually exclusive states never overlap; bar-boundary quantization trades flexibility for responsiveness (responsiveness is the main advantage).
- Ducking discipline (Quarles): bus hierarchies (Master → SFX/VO/Music); fixed repeatable ramps (-9dB/500ms/1000ms); duck sparingly, combine with priority tiers + bus levels.
- Voice tiers + "mix as you go" (Weir, No Man's Sky): aggressive distance/context voice limiting; know every sound's upper/lower limits; mix as you go, not at the end; "embrace the chaos."

## D. What to avoid
- Post-lock additions (Quarles): "if a new battle encounter is added... the 'rhythm' of the level has now changed" — full re-mix top-to-bottom after any major rework. Adding content after lock without re-mix silently breaks aural integrity.
- Volume creep (Quarles): relentless action → "wall of noise" → player mutes. Design peaks and valleys. Guard: frozen reference levels, A/B every change, log LRA.
- Unlocked contexts (MDN): cold load with no first-tap resume = silently dead on mobile.
- Late-audio thinking (Game Audio Co): the 5 pitfalls = audio as finishing coat, not a system.

## E. Shipped
- DOOM 2016 (Gordon): modular stems, same key/tempo (120–140 BPM), behavioral scripts (enemies nearby, aggression, weapon, damage). Intensity layers switched seamlessly. The music reads the player.
- No Man's Sky (Weir + 65daysofstatic): generative "Pulse" — 24 sets = 60 soundscapes; RTPCs (storminess, indoors/outdoors); real-time synthesized vocals; aggressive voice limiting; EBU R128. "Pass as much information as practical from the game to the audio systems."
- 7 Layers of Summoning (GGJ 2016): zero-layer neutral → winner's theme, intensity per landed attack. Proves vertical re-orchestration at JAM SCALE. Zlobin's mistake (zero layer last) = our lesson.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** the "zero layer" is DELIBERATE SILENCE (Prunty's rule, Round 87) — menu = silence, deploy = silence + ambient, battle = first contact. Not featureless-by-neglect; silence-as-composition. States mutually exclusive (setState returns if same); 4s hysteresis prevents flapping (Round 134). Zlobin's lesson satisfied by design.
- **AUDIO-SPEC.md:** lock-pass log + zero-layer rule (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
zlobin · quarles · weir · sony aswg · mdn · doom · no man's sky · 7 layers
