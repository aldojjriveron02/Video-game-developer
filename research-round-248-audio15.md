# Audio Part 15 (Final Lock / Pre-Fri-6PM) — Findings (Round 248)
**Date:** Wed 2026-10-15 ~00:11 EDT · **Source:** live web research (airwiggles, lester, mdn, fabro, abratabia)
**Project:** Mecha Protocol — audio (synthesis lock Fri Oct 16 6PM; final verification)

## A. Mechanics
- Final 48h = dedicated "Polish" phase (Lester, Game Audio Learning): play the game, assess in context, zoom out to hear all parts together. "An incredibly important step."
- Returnal protocol (Couthier): assets authored to target loudness up front (footsteps −30, player shot −20 vs −24 platform); post-lock = trims only (±3dB). Karadensky: "it's all in the asset; if the asset is not working, mixing will not fix it."
- Offline measurement = last word (Turi): consoles/PC −23/24, mobile −18 LUFS-I over 30 min ±1. **Our frozen −18 matches the mobile target exactly — correct category for a browser game.** Caveat: interactivity skews — measure representative played-as-designed gameplay, NOT explosion spam or AFK.
- Mix low, trim master up: "If your game is at any LUFS value, you can adjust the master volume ± what you need." Master-trim = only acceptable post-lock loudness correction.
- True-peak watch (Meijer): many games exceed 0 dBTP from codec intersample peaks — verify ≤−1 dBTP on RENDERED output, not the designer's meter.

## B. Validation
- Autoplay matrix (MDN Sep 2026): blocked unless muted / user interacted (sticky activation) / allowlisted / policy grants. Web Audio: any start() outside a user-input event is subject. Matrix: cold load → silence + pending → first gesture → all lanes sound. Per browser (Firefox has own autoplay prefs).
- Real iPhone non-negotiable: iOS routes Web Audio through ambient channel — silent switch can mute a desktop-passing game. Fix: AudioSession playback at init/resume in gesture. iOS: effectively ONE active AudioContext per page — verify no second context on re-init. Test silent switch ON and OFF.
- 4-device pass, phone speaker = final gate: small speakers expose loop clicks, harsh resonances, imbalance. Audition BGM seams + loudest stack on weakest speaker.
- Persistence smoke: volume→reload, mute→reload. Holds ONLY if key frozen ('mecha-protocol-volume') — never rename in final 48h. Log anomalies (what/where/steps/status).

## C. Techniques
- Voice-cap spam: overload each category; pro model = priority-based culling ("what must the player hear right now?"). In 12-voice design: cap never breaks anchor sounds; steal choice musically sensible. "Starvation" = audio thread can't render all sounds in a frame (untested budget).
- Long-session leaks: watch node counts over sustained session; one-shots stopped + disconnected. Fine at minute 2 can degrade by minute 30.
- Loop clicks on phone: trim precisely, loopStart/loopEnd, audition on weakest device (inaudible on monitors, obvious on phones).
- Pitch-band extremes: ±1 semitone standard (playbackRate 0.9–1.1); audition both ends — low not muddy, high not piercing.

## D. What to avoid
- Master-bus changes post-lock (Returnal ±3dB ceiling exists so nobody "fixes" the mix at the bus).
- New SFX after freeze (OSHA Coaster jam failure: FMOD introduced late → git conflicts → broken builds → ripped out at deadline. Freeze integration WITH assets.)
- Re-synthesizing timbres (Karadensky: timbre IS the mix; invalidates loudness spreadsheet + 48h measurement).
- Renaming storage keys (orphans users' prefs, breaks smoke test).

## E. Shipped
- Returnal (Housemarque 2021): front-loaded LUFS spreadsheet + ±3dB trim discipline — "mindchanging masterpiece" reshaping how designers work. Lesson: loudness targets up front survive loudest scenes without heroics.
- God of War (2018): same Couthier-era process — consistent measurement vs defined target beats "make it slam."
- OSHA Coaster (jam): late FMOD → cache/meta git fights → broken builds → native audio fallback at deadline. Lesson: freeze audio integration early, test clean-machine builds.

## Implemented this round
- **Verified (code read, no changes — pre-lock):** exactly ONE `new AC()` in the entire codebase (sfx.js:44), guarded by `if (!this.ctx)` — single AudioContext confirmed (music reuses SFX's ctx). iOS one-context rule satisfied.
- **AUDIO-SPEC.md:** final-lock checklist — (1) offline measurement tonight (~30min representative gameplay, −18 ±1, BGM −12dB, ≤−1dBTP on rendered output; master-trim only if off); (2) spam-test MAX_VOICES=12 + 30min session (priority steal protects anchors, node counts bounded); (3) autoplay matrix on real hardware (silent switch ON and OFF); (4) 4-device pass (phone speaker gate; loop seams + pitch extremes; persistence smoke on frozen key); (5) lock enforcement Fri 6PM (gains-table ±3dB only; no new SFX, no re-synthesis, no key changes).
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
airwiggles · lester · mdn · fabro · abratabia · couthier · turi · karadensky · meijer
