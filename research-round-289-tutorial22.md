# Tutorial Part 22 (Verification Round 3) — Findings (Round 289)
**Date:** Wed 2026-10-15 ~04:58 EDT · **Source:** live web research (playtestquest, vgm, brouard, hodent, celeste, downwell)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 3)

## A. Mechanics
- Decay rule (PlaytestQuest, Oct 2026): "tutorial work decays every time you change the game around it, so teaching needs retesting on every build — with fresh eyes, repeatedly." Any change to a mechanic, level beat, or hint invalidates that beat's verification. New players read the tutorial in the context of the whole game, not as a diff.
- Cold checklist (VGM.co; Brouard): recruit target-audience players who've never seen the game. Fixed questions: when does comprehension break? where does momentum stall? does the first reward land? what does confusion look like in the controls? Map the required learnings first (narrative context, goals, controls, core loop, keys to perform).
- Post-play probes (VGM.co; PlaytestQuest): structured debrief after the silent session. The paraphrase probe: "describe what this mechanic does in your own words" — if they can't, the teaching failed even if they performed it (cargo-cult performance). Four failure patterns: the non-user (never uses it), the prompt-checker (re-opens the tutorial — didn't stick), the over-user (uses it everywhere — boundaries unclear), the stuck (can't connect mechanic to obstacle).
- Text audit (PlaytestQuest): "text is a label, not a lesson; text labels things, levels teach things." Every popup: could the level before this moment have shown it? Good text = two-word prompt at first use. Bad text = explaining before touching, describing what gameplay would demonstrate, lore dumps. Brouard: a positive learning context (no time limit, no long-term punishment, short respawn, room to experiment) replaces a succession of popups.

## B. Validation
- Fresh players every build (PlaytestQuest; VGM.co): 5–8 cold players surface the majority of recurring problems. "One player's confusion is an anecdote; three players stumbling at the same moment is a signal." Internal testers = mechanical bug-checking only, never learning validation.
- Silent observation (VGM.co): "watch, don't lead — the moment you clarify an instruction during a session, you've contaminated the data." Brouard: playtest from conception with low-fi prototypes; guerrilla + live testing for fast feedback.
- Paraphrase probes: the cheapest high-signal validation a jam team can run. Catches cargo-cult performance.
- Most common missed failure (VGM.co): reward timing — "the first meaningful payoff arrives too late, and the player churns before the tutorial has done its job."

## C. Techniques
- Safe rooms (PlaytestQuest's second law; Brouard): first attempt at a new mechanic = low-stakes. BotW shrines: no time limit, no long-term punishment, short respawn, experimentation field. = our safe sandbox.
- Offered-not-forced (Celeste Assist Mode; Hades God Mode): fully optional, player-toggled, never auto-applied. Brouard: offer optional choices, detect context, provide appropriate help — never take pacing control away.
- One sentence per beat (PlaytestQuest; Hodent): teach the minimum for the next challenge — one feature, use it, then the next. Fix order: motivation → isolate → constrain → feedback → repeat → text LAST (two words, at the moment of use). Brouard: "don't gather all important learnings in one moment; it overwhelms."
- Impasse design (PlaytestQuest): teach with level geometry, not text. Portal's isolated-variable puzzles; SMB World 1-1's Goomba skill gate. Three-step: teach (safe isolated space) → test (slightly harder, alone) → combine (merge with a learned mechanic).

## D. What to avoid
- Unskippable intros: forced pacing = #1 complaint. r/gamedev: "Players skip tutorials, then blame the game." Skippers need a re-openable reference (glossary), not a locked gate. Extra Credits: never "click here prison" (stolen agency).
- Undismissable assist: reads as patronizing, becomes a churn driver. Celeste/Hades exist because forced assist backfires.
- Text walls: "explaining before the player touches anything, describing in words what the gameplay would demonstrate faster, lore dumps." The telltale of failing design = "a succession of popups."
- Tutorial-as-fix (Brouard): "We will fix it with a tutorial" = papering over a usability failure. Fix the root cause in order (motivation → isolation → constraint → feedback → repetition), touch text last.

## E. Shipped
- Celeste (PICO-8 jam origin): prompts reveal only two buttons; skill gates teach each verb; safety-loop rooms, failing drops to a safe floor. Impasse design, zero text walls. Assist Mode = offered-not-forced coexisting with a hardcore game.
- Downwell (solo dev): "the tutorial never announces itself — the player falls, naturally presses jump, and the gunboots fire downward with an immediate visual payoff." Forced affordance + first-seconds reward = nails "first reward landing."
- Portal (DigiPen student project): isolated-variable rooms; portals mastered before cubes/turrets/energy balls. Teach → test → combine.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** first-reward timing (VGM.co's warning). The player's first attack (Round 184: guaranteed hit, can't miss) delivers the FULL juice package on the first action — damage floater with limb name, per-weapon hit-stop, squash, single flash. The payoff lands at the first verb use, not late. (Downwell pattern: immediate visual payoff on the discovered verb.)
- **TUTORIAL-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
playtestquest · vgm · brouard · hodent · celeste · downwell · portal
