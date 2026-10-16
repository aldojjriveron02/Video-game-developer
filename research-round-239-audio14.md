# Audio Part 14 (Jam-Day Audio Readiness) — Findings (Round 239)
**Date:** Wed 2026-10-14 ~23:18 EDT · **Source:** live web research (airwiggles, js2devlog, imtoospexy, timmykokke, lddb, vndev, code-garage)
**Project:** Mecha Protocol — audio (pre-Fri 6PM synthesis lock; verification only)

## A. Mechanics
- Standards anchor (GANG IESD via VNDev Wiki): −24 LUFS console, −18 LUFS portable/mobile, −1 dBTP ceiling. Shipped AAA varies −11.8 to −23 — consistency beats magic numbers. Our frozen −18 / −12dB / −1dBTP is the pro move.
- Offline workflow: OfflineAudioContext render of densest-gameplay window → FFmpeg loudnorm two-pass (measurement mode). If integrated misses: single documented master calibration offset ONLY — relative mix stays byte-identical.
- Representative window (Turi/WoW): ~30 min actual gameplay, never menus. Jam equivalent: densest realistic stacking (SFX+BGM+UI). Menu vs dense combat can differ by many LU.
- SFX ladder (LUFS-M): loudest −13; loud −18 to −14; focus −23 to −18; average −23; quiet −28; barely audible −40 to −33. Returnal (Couthier): author at target level from start, "touch nothing in engine (only ±3 dB)."
- Recipes vs master: pull individual recipe when IT breaks the ladder; never rebalance via master. Karadensky: "mix too low, turn up a little in the end" — one final master lift max.

## B. Validation
- 4-device matrix: phone/laptop speakers strip low end (bass SFX vanish); cheap earbuds exaggerate harsh highs + masking; headphones expose panning/stereo mistakes. Small speaker = classic pro check (judges commonly use one).
- Autoplay unlock (js2devlog Sep 2025): cold load (fresh profile) → first gesture must produce sound. iOS specifics: resume() synchronously at TOP of gesture handler (deferred calls lose gesture context); never create AudioContext at module level (lazy inside user event); re-resume on visibilitychange (iOS re-suspends on background return); SIMULATOR DOES NOT REPRODUCE — real iPhone required.
- Volume/mute persistence (imtoospexy js13k 2025 postmortem): forgot to update localStorage key → broke persistence in shipped build. Verify: set → hard reload → persists; mute → reload → persists; key name frozen and identical everywhere.
- Console sweep: autoplay warnings, sample-rate mismatches, unhandled resume() rejections.
- Node leaks: Chromium stop()/disconnect() doesn't always free — must stop + disconnect + dereference + onended cleanup. Long-session test: 15–30 min active play with live-node counter; flat = pass.

## C. Techniques
- Returnal in practice: post-freeze only documented ±dB gains-table commits. No re-authoring, no new processing, no engine rebalancing.
- Safe: per-recipe ±3dB trims with commit notes; pitch-band tweaks; re-running measurement. Unsafe: master-bus beyond calibration offset; new SFX after lock; re-synthesizing timbre; global re-normalization.
- Voice-cap check: Unity default 32 with priority culling. WebAudio: cap identical SFX, steal lowest-priority, spam-test noisiest SFX at max rate — no runaway, flat CPU.
- Pitch verification: randomization fires in band; audition extremes (highest not harsh, lowest not gone).
- Loop verification: render 3+ consecutive BGM passes; inspect loop point for clicks; check on phone speakers (most audible there).
- Tooling: ZzFX = js13k-standard micro synth (<1KB, 20 params); visual SFX editor = fast path for final-24h tweaks.

## D. What to avoid
- Touching master bus night before (one-time calibration, not mixing tool).
- New sounds after synthesis lock (Cosgrave js13k 2025: scrambled audio, "focus on better audio next time").
- "Just one more SFX" creep — every post-lock addition is unverified.
- No testing on judging hardware (iOS bugs don't reproduce in simulator).
- Leaving Audio category on the table (LdDB: audio moves overall placement).
- Audio-only critical info (Cosgrave: countdown music + visual snarl = "at a glance — or without sound").
- Key renames breaking persistence (freeze key names before lock).

## E. Shipped
- Inside My Radio (LD23, Audio 4.78 all-time top 10): rhythm platformer, world pulses to beat — audio as core mechanic → commercial release.
- Double Kick Heroes (LD34, 4.74): heavy-metal rhythm shooter, music carried mood/pacing/timing → Steam.
- Titan Souls (LD28, 4.67): sparse atmospheric audio, restraint created tension → Devolver-published, IGN 8/10.
- Pattern: 6 of all-time top 11 LD audio games are music/rhythm — when audio is load-bearing, ratings follow.

## Implemented this round
- **Verified (code read, no changes — pre-lock):** lazy AudioContext (created in ensure(), never module level); resume() synchronous in pointerdown gesture handler; visibilitychange → suspend on hide / re-sync on return (music.js); WebKit 'interrupted' state handled (call/lock); volume key 'mecha-protocol-volume' frozen (single key, JSON vol+muted); MAX_VOICES=12 priority steal; ±1 semitone pitch variation; iOS silent-switch guard (audioSession playback).
- **AUDIO-SPEC.md:** jam-day audio verification checklist (offline measurement pass; voice-cap spam test + long-session node counter; autoplay unlock matrix incl. real iPhone; 4-device pass with phone speaker as gate; lock enforcement at Fri 6PM — no new SFX, no re-authoring, gains-table only; persistence smoke: set→reload, mute→reload).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
airwiggles · js2devlog · imtoospexy · timmykokke · lddb · vndev · code-garage · gang
