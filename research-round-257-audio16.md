# Audio Part 16 (Final Lock) — Findings (Round 257)
**Date:** Wed 2026-10-15 ~01:09 EDT · **Source:** live web research (audiokinetic, airwiggles, schappler, shirokova, chrome dev, r/gameaudio)
**Project:** Mecha Protocol — audio (pre-jam; final lock)

## A. Mechanics
- Lock checklist run (r/GameAudio): voice budgets as fixed allocations — dialog ~4, hard effects ~16, master limiter, inaudible-sound culling. Lock pass = binary checklist: every bus, cap, limiter, cull verified present and untouched.
- Device matrix (Airwiggles; Shirokova via Joonas Turner, LinkedIn 2026): input latency and playback behavior differ PC/console/mobile — browser jam builds tested only on dev desktop headphones are the classic failure. Compare audio across platforms.
- Master-level freeze (Audiokinetic/Wwise): -24 LUFS console, -18 LUFS mobile. Airwiggles independently ~-18 mobile; Schappler 2014 found portable/mobile averaging -18 LKFS. Freeze = no gain/bus/asset changes moving integrated loudness after lock — mix ships as measured.

## B. Validation
- 4-device matrix (Shirokova): desktop speakers, earbuds/headphones, phone speaker, one more (laptop/TV). Headroom + audibility on each; spike-hunting across 0–1 dynamics; quiet sounds confirmed audible. Music, SFX, UI feedback present and undistorted on all four.
- First-tap unlock (Chrome Developers, "Web Audio, Autoplay Policy and Games"): suspended context auto-resumes ONLY when user interacts AND a source node's start() is called — resume must pair with a source start. iOS touchend-resume path documented. Jam test: cold-load, one tap, suspended→running + music starts — Chrome desktop, Android Chrome, Safari iOS.
- Ducking/crossfade (Shirokova; Audiokinetic HDR best practices): state-transition testing + dynamic-layering stress in busy scenes. Our check: music→musicBoss→musicVictory under SFX load — 0.8s/2.0s crossfades click-free, ducking attenuates (not mutes).
- Mix freeze: re-measure integrated loudness of final build vs -18 LUFS; mecha-protocol-volume restores correctly; volume defaults and per-bus balance regression-tested, not tweaked.

## C. Techniques
- State music machines (Airwiggles/Wwise Part 3): RTPC-driven adaptive music and mix control — parameters drive music states + ducking, not hardcoded per-scene tracks. Our music/musicBoss/musicVictory = same architecture.
- Ducking discipline (Wwise HDR): priority-based, always-on, always tested, never ad-hoc. Validates musicDucking as persistent mechanism, not per-transition hack.
- Voice caps (r/GameAudio): hard per-category budgets with priorities so critical sounds can't be stolen + inaudibility culling. Our 3 caps = same formalization.
- LUFS targets: THREE independent sources (Audiokinetic, Airwiggles, Schappler) converge on -18 LUFS integrated for mobile/portable, -24 for console. "Do not creep toward console targets or streaming-style -14." Our frozen -18 = the correct industry-standard choice.

## D. What to avoid
- Post-lock sound additions: invalidate every measured number (loudness, voice budgets, ducking thresholds). Budgets are SPENT allocations — late additions mean something else gets cut or stolen.
- Unlocked contexts: autoplay policy = any audio path without gesture-resume is silent. Classic jam-day "no audio on judges' machines." Every start() flows through the single resumed context.
- Volume creep: nudging master/bus gain "just a little" after -18 freeze defeats the freeze. Too quiet? Fix the ASSET, not the bus.
- Untested ducking (Shirokova): verified-only-in-isolation fails when victory music + boss SFX + UI collide.
- Single-device validation: mixes that work on studio headphones fall apart on phone speakers (weak bass, inaudible quiet layers).

## E. Shipped
- SUPERHOT (7-Day FPS Challenge 2013 → 2M+ copies): audio and mechanic = same system — gunshots stretch/pitch with time, staccato kill feedback. Constraint forced fusion, not decoration. Closest analog to our state-machine audio.
- 140 (Jeppe Carlsen, IGF 2013): no separate music/SFX silos — walls bounce balls into beats; the platforming IS the score. Voice budgets + mixing solved by design.
- Celeste PICO-8 (4-day jam): tiny asset set under brutal constraint — one composer, tight loops, every track serving level mood; carried the identity to the 2018 release. Lesson: small, locked, state-appropriate music set > large unfinished one.

## Implemented this round
- **Verified (earlier rounds, confirmed against research):** single AudioContext (round 248 — one guarded new AC()); -18 LUFS = exact pro mobile target (round 239); state machine + ducking + crossfades + 3 voice caps (rounds 240-243).
- **AUDIO-SPEC.md:** final-lock checklist as PASS/FAIL run — (1) unlock test on 3 browsers (cold-load, one tap, suspended→running); (2) lock pass: 3 caps active, ducking on, crossfades click-free under load, volume key persists/restores, NO asset adds after — record who ran it and when ("lock is a decision, not a feeling"); (3) 4-device matrix on locked build; (4) mix freeze: re-measure vs -18, fix assets not master; (5) ducking/crossfade stress in busiest scene (rapid transitions, caps saturated).
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
audiokinetic · airwiggles · schappler · shirokova · chrome dev · r/gameaudio · superhot · 140 · celeste
