# Feel Part 16 (Final Verification / Verify-Only Discipline) — Findings (Round 247)
**Date:** Wed 2026-10-15 ~00:07 EDT · **Source:** live web research (sakurai, nijman, kindlefall, juice-it-or-lose-it, gmtk, gamedesignpath)
**Project:** Mecha Protocol — feel (FROZEN; verify-only discipline)

## A. Mechanics
- Slow-mo verification (FGC standard, frame-step): 60fps → 0.25x = 15 game-frames per real second — 2f light hitstop directly countable. Count: freeze frames per tier, frozen frames/sec vs budget, shake decay curve, particles at quarter speed. Sakurai's team PRE-CALCULATED freeze frames and divided vibration amplitude across them — verification was arithmetic, not vibes.
- Mute test as gate (Oduya, Game Design Path Jul 2026): "Test with the sound off once... Remove any effect that looks exciting but does not answer a question." If the hit doesn't read silent, the visual layer failed — sound is masking a feedback deficit.
- Blind test: ≥5 people, silent protocol, say nothing, watch. The spectator's body is the instrument — flinches, smiles, confusion. <5 = reading noise.

## B. Validation
- Feel checklist on FROZEN build (Generalist Programmer jam guide): pre-submission checklist against the frozen build, never a moving target. Juice-it-or-lose-it model: verify each layer additively — base motion → impact frames → shake → particles → flash → sound — each perceptible ALONE before judging the stack. A layer not perceptible in isolation = decoration, not feedback.
- A/B toggle: live per-effect toggle, feel with/without in same session. Jam implementation: debug toggle stripping ALL juice to raw mechanics, re-enable per layer. Two questions: (1) raw game still controls correctly? (2) each layer changes how the hit feels?
- Density alarm — what the log should show (Sakurai rationale: Dynasty Warriors uses little hitstop because freezing on crowds would "end up frozen for a long time, reducing overall game speed"; Smash: hard cap on max freeze frames regardless of damage): timestamped hitstop events with frame counts, cumulative frozen frames/rolling second vs 0.35s budget, trauma peaks, one alarm line per breach naming the second + count. The log is Sakurai's frame-counting, automated.

## C. Techniques
- Safe feel tweaks: NONE — frozen. Sakurai: "We don't have the time for trial and error, so we have to nail it on the first try, and don't make a lot of changes." Freeze 12–18h before submission; feel tuning IS a feature — under the freeze.
- When slow-mo reveals a miss: Sakurai = targeted, never systemic (Marth's tipper per-attack modifier; Ryu's raised hitstop; hard caps). Game Design Path: REMOVE the offending effect rather than adding a compensating one. Protocol: (a) confirm real at full speed, not slow-mo artifact; (b) smallest directed change (one modifier, one cap); (c) if not obviously safe → CUT, don't tune.
- "Verify only" discipline: sheet is read-only, protocol is read-only; the job is measurement. Every run ends PASS / CUT / DOCUMENT. "TUNE" is not a final-24h state.

## D. What to avoid
- Tuning the night before: no verification budget (can't A/B, slow-mo, mute, blind-test a 2am change). Any number changed after freeze = unverified number.
- New juice after freeze: misreading Nijman's "more is more" — it's about amplifying VERIFIED juice, not adding layers. New effects bypass mute test, density alarm, checklist.
- Trusting the sheet without frame-counting: the whole literature is frame arithmetic. A spec value ("2f hitstop") is a hypothesis until counted. Sheet = what to verify, not what's true.
- "Felt fine at full speed" dismissal: Sakurai hid sub-frame movement inside hitstop because real-time perception can't be trusted for frame-level work.

## E. Shipped
- Smash Bros (Sakurai): caught (a) uncapped hitstop on Hammer/Final Smashes → hard cap; (b) vibration moving hurtboxes → whiffs → visual-only vibration; (c) vibration unreadable far from camera → amplitude scaled to distance, decaying across pre-calculated frames.
- Nuclear Throne (Nijman): subtle shake read as nothing → "More is more" — scale the VERIFIED effect, don't add new ones.
- Kindlefall: blanket time-bending destroyed pacing → per-context durations (last kill 0.75s, boss 2.2s, hitstop sub-0.1s). Time effects = pacing resource with a cap — same principle as our hitstop budget.

## Implemented this round
- **Verified (code read, no changes — frozen):** A/B toggle exists — shakeIntensity 0 sets reducedEffects, gating trauma/shake (820), hitstop (1138), knockback (1140), render scale (432) = full juice strip to raw mechanics. Density alarm logs count to telemetry ('feel:over_juice').
- **FEEL-SPEC.md:** jam-day run order — (1) slow-mo count once (outcomes: PASS/CUT/DOCUMENT); (2) mute test as hard gate; (3) blind test, one spectator, silent; (4) A/B run (raw controls correctly? each layer perceptible?); (5) read the density log (trust it over full-speed feel). Verify-only: no TUNE state.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
sakurai · nijman · kindlefall · juice-it-or-lose-it · gmtk · gamedesignpath · swink · generalist
