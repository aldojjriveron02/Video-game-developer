# Feel Part 17 (Final Verification) — Findings (Round 256)
**Date:** Wed 2026-10-15 ~01:04 EDT · **Source:** live web research (sakurai, celeste, eiserloh, nijman, brown, egmatic)
**Project:** Mecha Protocol — feel (pre-jam; final verification)

## A. Mechanics
- Juice budget re-measure (Celeste): crystal-collect freeze shipped at 0.1s; post-release Berry re-measured: "far too long. Now it's just .05 seconds and it's still very noticeable. 'The human eye can really spot things.'" The 48h ritual: re-time every hit-stop/freeze/transition ONE AT A TIME at FULL-SPEED playback — never in the editor's mental model. Berry/Thorson re-tested pixel-level tolerances ("only one or two") with repeated full-speed testing: "We had to play with… a lot of testing."
- A/B protocol (Sakurai's discipline): "we have to nail it on the first try, and don't make a lot of changes" (Famitsu "Thinking About Hitstop," SourceGaming 2015). Jam protocol: our ✦/◐/✧ toggle IS the A/B rig — off must equal full juice strip, same 30-second sequence on both, blind where possible (someone else flips the toggle). Nijman GDC 2013 structured his whole talk as before/after — never judge juice in isolation.
- 60fps floor (Nystrom, Game Programming Patterns 2014): pools pre-warmed before gameplay, never instantiated dynamically (GC spikes mid-fight). Canvas: pre-fill particle pool at load, zero allocation in hot loop. Verify on slowest rater device with particles + shake + hit-stop STACKED — the worst-case juice spike is the test case, not the idle scene.

## B. Validation
- Blind A/B (Celeste): Berry/Thorson invited friends "knowing they probably wouldn't recognise anything was particularly wrong as they hit a wall over and over again. 'But watching them you can see that's not working.'" Protocol: fresh rater, toggle hidden, watch HANDS AND FACE not the screen, ask only "how did that feel?" — never "did you notice the screenshake?" (leading questions poison the result).
- Rater-first-impression (Brown, GMTK "How to judge a game in 2 minutes"): judges rate in ~2 minutes — first 30 seconds carry the score. First 30s must contain: one hit-stop, one trauma-shake, one squash/stretch, zero onboarding text. If a rater hasn't felt a hit in 30s, the feel pillar is failing.
- Budget alarm (Celeste): "balance the effect so you feel it but are not distracted by it" (Berry). Alarm fires when juice is NOTICED rather than FELT (egmatic 2026: "juice should be felt, not noticed"; if the player can describe the screenshake, it's over budget).

## C. Techniques
- Hit-stop ladders (Sakurai): "the more damage an attack inflicts, the longer the hitstop period" — the ladder. Both attacker and victim freeze the same time; CAP the maximum regardless of damage (even Final Smashes); per-move multipliers (Marth tipper; projectiles less). SSBU: hitstop ∝ knockback ∝ victim damage% — compounds with match state. "Eight Hit Stop Techniques" (2022) — a family, not one timer.
- Trauma-based shake (Eiserloh GDC 2016, Bevy example): trauma 0–1, add on events, decay per frame, smooth noise × trauma² — "squaring makes small values subtle and large values violent" (Godot Forum, inkharbor 2025). Cap max displacement. Our trauma² budget = the industry-standard shape.
- Prewarmed pools: full pool at load (prewarm), recycle dead, zero allocation in frame loop. Warm-flag so first explosion doesn't hitch.
- Squash/stretch (inkharbor 2025): scale sprite (1.3/0.7) with elastic-out to 1.0 — "scale the sprite, not the collision shape." Celeste: shake "moves in the direction she dashes" — directional, aligned with motion vector, or reads as noise. egmatic anti-pattern: "adding screen shake to everything" — only on impact/landing/dash, never ambient.

## D. What to avoid
- Post-A/B tuning (Sakurai): once the verdict is in, changing a tuned value restarts the experiment — log the verdict and move on.
- Juice creep after lock (egmatic: shake on everything = signature anti-pattern). Every new juice element spends from the budget — new juice without a cut = budget violation.
- Unfrozen feel changes (Celeste: no control changes once content built — "they'd affect all the work they'd done"). Final 48h = verification-only, not tuning passes.
- Frame drops on rater devices: worst-case stack must hold 60fps on weakest hardware. Cut juice density if it hitches — the stutter IS the felt experience there.
- Juice that gets noticed (Berry/egmatic). Accessibility: ✧ = genuine no-shake/no-flash, not "less."

## E. Shipped
- Super Smash Bros. (Sakurai): hitstop ∝ damage, capped max, per-move multipliers (tipper, projectiles, electric), attacker vibrates with decaying amplitude, hurtboxes static while visuals shake, amplitude adjusted for camera distance. Every impact's duration ∝ its significance — ladder maps game state to sensation 1:1.
- Celeste (Maddy Makes): 0.15s dash + directional shake + hair trails + color state; freeze-frames re-measured 0.1→0.05; coyote + 1–2px corner correction; cut the stamina "catch breath" pause ("nobody was having fun when they had to stop"); sub-hundredth float tuning (.2→.21); "benefit of the doubt" input; juice felt, never noticed.
- Nuclear Throne (Vlambeer): Nijman's GDC 2013 — ~30 discrete juice tricks, mantra "More is more," maximal juice within a strict shake budget, and a player-facing screenshake slider (direct ancestor of our ✦/◐/✧ toggle).

## Implemented this round
- **Verified (code read, no changes — pre-freeze):** hit-stop rate cap = HARD cap (0.35s per rolling second; budget exhausted → skip, don't stack — game.js:1462-1468). Juice density alarm exists (>5 juice events → alarm, 5s cooldown). Pool prewarmed (verified earlier). Trauma² budget = industry shape (Eiserloh). 3-state toggle = the A/B rig (off = full strip — verified round 247).
- **FEEL-SPEC.md:** final verification — (1) Celeste re-measure: re-time every hit-stop/freeze/trauma-decay at full speed (expect current durations 1.5–2× too long); (2) blind A/B this week: ✧ vs ✦, rater blind, watch player not screen, ask only "how did that feel?" — if ✧ ever wins, juice is OVER budget (cut, don't add); (3) rater-first-impression: first 30s = one hit-stop + one shake + one squash/stretch, no text; (4) FEEL FREEZE 48h out: lock every duration/coefficient/pool/curve (Sakurai's rule); (5) stress the pool on the floor device: max burst + full trauma² + hit-stop, hold 60fps or cut density.
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
sakurai · celeste · eiserloh · nijman · brown · egmatic · nystrom · inkharbor
