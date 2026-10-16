# Audio Part 17 (Final Lock) — Findings (Round 266)
**Date:** Wed 2026-10-15 ~02:11 EDT · **Source:** live web research (lester, rodrigue, chrome dev, audiokinetic, huiberts)
**Project:** Mecha Protocol — audio (pre-jam; final lock)

## A. Mechanics
- Mix phases (Lester, Game Audio Learning Portal): Planning → Execution → Polish ("at the very end of production — finalize the mix; incredibly important, and shouldn't be taken for granted") → Reflection. The lock = the Polish phase: scheduled, non-skippable, not squeezed in after the build.
- The anchor question: "What are the important sounds the player needs to hear?" Strategy games (Civ, Humankind, AoE) prioritize UI and unit feedback over aesthetics. For tactics: UI clicks, unit select/move/attack, victory stingers must survive under music BEFORE anything decorative gets headroom.
- Loudness Range (Rodrigue/Audiokinetic via Designing Sound): measure LRA per segment (level, menu, battle). EBU: LRA >20 LU probably excessive; mobile targets the low end (5–10 LU) so quiet moments survive ambient noise + weak speakers. Too high → EBU R-128 compressor recipe (threshold <−40 dBFS, ratio 1:1.2–1:1.5, release >1s) or sidechain-duck ambience/music under important sounds. Too low → check the master limiter isn't crushing the mix.
- r/GameAudio: "Manage voice counts and numbers of registered sound objects" + "start early. Always always test on your lowest spec platform."

## B. Validation
- First-tap unlock (Chrome Developers, Greenaway/Choi): since Chrome 71, AudioContext resumes when (1) user interacted + (2) a source node's start() is called. MEI heuristic can also grant autoplay. Validation = fresh browser profile, first tap, suspended→running; silent-first-load = the signature failure.
- Cross-engine (MDN Autoplay guide): Firefox/Safari differ from Chrome/MEI — unlock test must run on ≥3 browsers.
- QA sheet (Game Audio Learning Portal): bug-tracking with issue/where/recreate/status/notes/tracking number — the jam-scale lock-pass log.
- Mobile voices (Audiokinetic): physical voices "strictly limited" — suggested ceiling 50–100; playback limits + priorities decide what gets killed or virtualized. Stress = max SFX density, caps hold without dropout.

## C. Techniques
- State music machines (Huiberts, Game Developer): vertical re-orchestration — stackable layers over a fixed-duration theme (~30s), shared key/harmony/tempo, differing rhythm/instrumentation; each layer a clearly noticeable element; all composed in one DAW project. Our music/musicBoss/musicVictory = same architecture.
- Ducking discipline (Rodrigue): sidechain important sounds (hits, UI, victory stinger) under music/ambience — "maintains mix clarity by detaching the front elements." Discipline = fixed duck amounts + release times (our 0.8/2.0s), never hand-tuned per build.
- Voice caps (Audiokinetic): playback limits + priorities. Our 3 caps + priority steal = jam-scale version.
- LUFS (Designing Sound): −18 LUFS integrated = mobile-appropriate (broadcast EBU R-128 is −23; mobile runs hotter/narrower for noisy environments + small speakers). Freeze it — post-freeze gain tweaks re-open the whole mix.

## D. What to avoid
- The Game Audio Company pitfalls: (1) audio as afterthought; (2) repetitive loops (use adaptive: vertical layering, horizontal resequencing); (3) poor balancing; (4) neglecting optimization (compressed formats, asset discipline); (5) ignoring player feedback.
- Indie devs' top vote: "Saving it til last" — the post-lock addition problem, bluntly.
- Volume creep: LRA >~20 LU excessive; over-aggressive limiter collapses dynamics. Creeping master/limiter post-freeze = how a jam mix dies.
- Unlocked contexts: suspended-never-resumed = silent game on first load (fresh-profile test catches it).
- Untested ducking: tuned at one density pumps or vanishes at another; the boss-music + max-SFX stress must be HEARD.

## E. Shipped
- Minit (2018): from 2012 jam "Adventure Minute" — composer divided per-area tracks into minute-long parts to fit the 60-second death loop. Audio embraced the central constraint instead of fighting it.
- Ape Out (2019): custom C# sampler — 7 velocity levels × 12 round robins; hit velocity follows player action; drummer drops out when the ape is shot. "The music is paying attention to you." Boch's advice: "Adopt interesting constraints." A state machine with teeth.
- Celeste (2018): from 4-day Pico-8 jam — Lena Raine's adaptive score (Chapter 7 stems fade with progress). Layered stems over fixed structures — vertical re-orchestration scaled from jam to release.

## Implemented this round
- **UI TIER → PRIORITY (js/sfx.js):** Lester's anchor question applied. Tier 1 was kill-confirm + VEX stinger only — but strategy games prioritize UI + unit feedback over aesthetics, and a dropped UI click during heavy combat is the exact failure. All 7 UI sounds (tick, warn, select, confirm ×2, error, phase ×2) now pass priority:true — they always win a voice. Safe: UI sounds are short (0.03–0.2s) + player-driven, can't saturate the 12-voice cap.
- All `node --check` clean. +0 lines (longer lines, same count). **4,442 lines**.
- AUDIO-SPEC.md: final lock (below).

## F. Sources
lester · rodrigue · chrome dev · audiokinetic · huiberts · minit · ape out · celeste
