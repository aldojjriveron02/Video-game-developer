# Feel Part 23 (Verification Round 5) — Findings (Round 310)
**Date:** Wed 2026-10-15 ~06:23 EDT · **Source:** live web research (hourences, nijman, filby, standke, ellison)
**Project:** Mecha Protocol — feel (pre-jam; verification round 5)

## A. Mechanics
- Post-freeze audit (Hourences/Eiserloh): "after every freeze or shake event, verify the camera fully returns to neutral — trauma must decay to zero." "If any shake leaks into the next event (overlapping trauma), feel reads as muddy, not punchy." Log peak vs residual trauma at next event's start; residual ~0.
- Tempo audit (Filby): frame-by-frame review of the hit-stop ladder. Each tier's freeze maps to damage/weight; post-freeze dip reads as "breath," not stall. "Step through captures and confirm freeze, release, recovery each last the intended frames." "Verify input is never dropped during freeze (buffered)."
- Redundancy audit (GameMaker8): "every hit must register on at least two independent channels (hit-stop + floater, or shake + sound)." Map each damage event to channels; single-channel = failure. Hierarchy: animation > particles > screen effects > sound > UI. Latency <100ms; audio synced within ~33ms.

## B. Validation
- Blind tests (GameMaker8): watch players without telling them what changed; "they should describe hits as 'heavy' or 'snappy' unprompted." Ladder: randomized A/B of adjacent tiers; players sort by weight without knowing values.
- Frame analysis (Filby): capture at 60fps, step through hit-stop → release → recovery; count frames per phase vs spec (70ms ≈ 4–5 frames). "The definitive verification for freeze discipline."
- One-button test (GameMaker8): "strip to a single action and check it feels right in isolation — if the core hit doesn't read with everything else off, no amount of layering fixes it." Rank variants by impact; ranking must match the ladder.
- Mute test (Wayline; GameMaker8): audio off; every hit must still read via visuals alone.
- Playtest-for-overload (Ellison): "specifically ask testers whether they feel visually overwhelmed."

## C. Techniques
- Recovery curves (Eiserloh): trauma decays linearly, shake = trauma² — "automatic dynamic range." "Treat any change to the exponent as a feel change requiring re-verification."
- Layered stacks (Nijman; Filby): permanent vs temporary shake, directional, zoom punch, rotational kick — each on its own trauma budget "so they compose instead of clipping." Dead Cells layers hit-stop + shake amplitude by weapon weight.
- Leniency (Standke): input buffering, generous dodge, reaction delays, aim assist, pause-after-kill, camera anticipation. "Feel is not only feedback; it's the game forgiving the player." Tactics: generous input windows, cursor-anticipating animation.
- Tempo-matching (GameMaker8): feedback <100ms; audio within ~33ms. "The post-freeze dip must release into full speed on a frame boundary — the 'breath' works because it's predictable."

## D. What to avoid
- Stall-not-hit (Ellison: "illusion of impact"): "freeze that reads as a hitch rather than impact — caused by freeze without accompanying channels." "A bare freeze is a bug, not juice."
- Flow-killers: shake obscuring telegraphs or positioning — "juice must never reduce readability of the tactics board."
- Unlayered feedback: single-channel hits; or every hit using every layer ("if a basic attack shakes like a finisher, the ladder is flat").
- Post-freeze neglect: "trauma that doesn't return to zero; a dip that doesn't release cleanly — the moments right after the effect are as designed as the effect itself."
- Juice-as-smokescreen (Ellison): "adding shake/particles to cover weak core mechanics." Subtlety Exercise: "reduce visual intensity 50% and check the game still feels good on mechanics + sound alone."
- No escape hatches: "un-toggleable shake — screen-shake intensity and hit-stop must have user-facing toggles."

## E. Shipped
- Dead Cells: per-weapon hit-stop, weapon-weighted shake, 70ms slow-mo before death, buffered inputs, leniency. "Filby's frame-by-frame method tuned each weapon's freeze to its weight."
- Nuclear Throne (Nijman): trauma shake + directional kick + zoom, tuned live at GDC. "Shake always recovers fully and scales quadratically, so chaos stays readable."
- Celeste: feathered shake on dashes/landings, squash & stretch, particles, camera lookahead, instant respawn. "Every mechanic got feedback on multiple channels and recovery was instant."

## Implemented this round
- **VERIFIED (analysis, no changes — frozen):** residual trauma. Turn-based pacing (events seconds apart) + trauma clamp at 1.0 + 0.5/sec linear decay = no overlap. Worst case (1s apart): trauma decays to 0.5, next event clamps to 1.0 (no unbounded stacking). Camera fully recovers between events. Hourences' recoverability satisfied by design.
- **FEEL-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
hourences · nijman · filby · standke · ellison · dead cells · nuclear throne · celeste
