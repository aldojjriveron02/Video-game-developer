# Feel Part 19 (Final Verification) — Findings (Round 274)
**Date:** Wed 2026-10-15 ~03:09 EDT · **Source:** live web research (nijman, jonasson/purho, eiserloh, brown, gamedesign.gg, fumoto)
**Project:** Mecha Protocol — feel (pre-jam; final verification)

## A. Mechanics
- Feel freeze (Jonasson/Purho "Juice It or Lose It"): "Don't start polishing until it is final." Freeze mechanics BEFORE feel tuning. (Nijman: "screenshake is about timing" — changing an action's timing after freeze silently invalidates every shake/hit-stop/squash tuned against it.) Protocol: (1) lock input timing, durations, damage; (2) tune against recorded baselines (blind-A/B lineage); (3) any mechanic change post-freeze = mandatory re-verification, not a tweak.
- 3-second test (gamedesign.gg): a player should tell whether the game feels good within three seconds of touching the controls. For us: first click/move delivers the full stack (anticipation squash → move → impact hit-stop → shake) before any tutorial text.
- Juice budget audit (gamedesign.gg dynamic range): a crit and a light jab must NOT produce the same feedback — loud moments need quiet moments to read. Cap concurrent full-strength juice (our density alarm), tier every event, verify kills still read louder than light hits at max board chaos. (Nijman: shake should punctuate, not drone.)

## B. Validation
- Blind A/B (gamedesign.gg comparison test): two builds/values, no labels, which feels better. Keep every tuning iteration's build — compare concrete versions, not memory vs present.
- Rater-first-impression (Valve/Brown): "shut up and watch" — the act of watching is the data; don't coach, don't take heavy notes. Fresh eyes > ten dev re-runs. Have them narrate what they FEEL ("that felt heavy" = data; "I think the shake is 12px" = not).
- One-word test: single word after 60s. Targets: "punchy," "crisp," "weighty." "Fine" or a shrug = feel hasn't landed.
- Supporting: blindfold test (physical metaphors only), mute test (if feel collapses without sound, you're leaning on audio — sound buys 20–40ms perceived responsiveness), repetition test (the 30th attack must still read, not numb).

## C. Techniques
- Hit-stop bands (Nijman #17 "Sleep"): micro-pauses sell drama. Street Fighter: 2–4 frames on hit. Pro pattern = ladder (light brief, kills longest). Our 28→150ms (heavy/kill 80ms, 0.35s hard cap) = pro territory. The cap matters: chained hit-stops on a tactics board could stall the frame budget; exhausted→skip is the correct escape hatch.
- Screen-shake shapes (Eiserloh GDC 2016): trauma 0–1; offset = noise × trauma² × max. The square is the point — small hits whisper, big hits roar. Rules: impacts ADD trauma, never set; smooth/perlin noise, not raw random (jitter = nausea); decay ~1.4/s; modest max offset; decay guarantees the screen settles.
- Squash discipline (Disney via Jonasson/Purho): anticipation + impact only. Our anticipation-only is stricter than most jam games — good. Stretch-on-everything = "mushy," not punchy.
- Pool exhaustion (Unity docs): eliminate hot-path allocation. Jam refinement: pool exhausted → DROP the spawn. A missing particle is invisible; a GC hitch is felt by everyone.

## D. What to avoid
- Adding juice after freeze (the talk's closing line). New juice on an unfrozen build = feel tuned against mechanics that no longer exist.
- Feel tuning by committee (Valve: treat designs as hypotheses; shut up and watch). Feel by vote converges on "fine." One owner; raters react, they don't design.
- Untested juice budgets (gamedesign.gg: "one-size-fits-all feedback," "not testing feel early and often"). Unaudited = the 5th explosion costs as much as the 1st = shake-drone, particle soup, kills indistinguishable from scratches.

## E. Shipped
- Nuclear Throne (Vlambeer): the reference implementation — hit-stop on explosions, slow-mo on big kills, trauma shake. Small team, tiny verb set (shoot, explode, die), ruthless dynamic range — small guns whisper, nukes roar.
- Downwell (Fumoto, GDC 2016): one dev, one verb (gunboots). White flash, particles, modest shake, knockback — all serve it. "One verb, fully funded, beats five verbs at half juice." The last 48h is for SUBTRACTION.
- Celeste Classic (PICO-8, 4-day jam): dash freeze-frames, landing shake, dust, anticipation squash. Feel verbs designed FIRST, levels second — feel-first survives scope growth.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** all Eiserloh rules satisfied —
  1. Add, never set: `trauma = min(1, (trauma||0) + x*mult)` (game.js:1447)
  2. trauma² shaping (game.js:1573)
  3. Smooth noise (layered sine/cosine, "never random jumps")
  4. Decay (game.js:1791 — 0.5/s, tactics-appropriate vs Eiserloh's 1.4/s shooter rate)
- **FEEL-SPEC.md:** final verification (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
nijman · jonasson/purho · eiserloh · brown · gamedesign.gg · fumoto · nuclear throne · downwell · celeste
