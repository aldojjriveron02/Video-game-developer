# Feel Part 25 (Verification Round 7) — Findings (Round 328)
**Date:** Wed 2026-10-15 ~07:29 EDT · **Source:** live web research (swink, nijman, df, thorson)
**Project:** Mecha Protocol — feel (pre-jam; verification round 7)

## A. Mechanics
- Polish-pass audit (Swink 2008): game feel = "realtime control of virtual objects in a simulated space, with interactions emphasised by polish." Five types: "animation, visual effects, sound effects, cinematic effects, tactile effects." Audit: for every interaction, confirm each channel fires on resolution frame. (Berbece GDC 2015: canonical worked example.)
- Consistency audit (Nijman): "every impact class gets the same shake/freeze/knockback signature so players learn to read force from feel." Enumerate damage events, group by class, confirm identical signatures; deviations documented, not accidental.
- Platform-feel audit (Digital Foundry): "Switch 2 GameCube-controller — ~52.3ms extra ≈ 3 frames, 'enough to be an issue.'" "Feel perfect on one platform can be broken on another by latency alone." Audit: measure end-to-end latency per platform vs budget.

## B. Validation
- Feel-specific playtests (Swink; Jonasson & Purho): "no industry standard for measuring game feel; it is highly subjective." Answer = "structured iteration, not metrics." "Add one juice element at a time, playtest immediately, keep what reads." Blind A/B: "ask feel questions ('did the hit land?') not fun questions."
- Cross-platform checks (DF): "same input, measured latency, per platform." For canvas: "60Hz vs 120Hz+ and throttled rAF — feel constants must be time-based, never frame-count-based."
- Long-session feel (Celeste): "Screen Shake slider (0%) for motion sensitivity." "10-minute muted, unbroken session — if juice fatigues or mix collapses without sound, fails."

## C. Techniques
- Micro-polish (Thorson): "10 forgiveness techniques: coyote time, buffering, corner correction." "Widen timing/positioning windows so inputs feel kind. Forgiveness engineering, not spectacle."
- Feel layering (Jonasson & Purho): "start bare, layer explosion → particles → sound → screen effects one at a time, verifying each reads." Swink's "response" = ADSR envelope: attack (freeze), sustain (shake), release (dip to 1x).
- Platform adaptation (DF; valdemird): "effects must be refresh-rate independent and degrade gracefully under throttling. Trauma decays in seconds, not frames."
- Feel documentation: "one source of truth for tuned constants." "Escalating celebration (bigger moments get more); step functions (discrete steps over continuous curves, reproducible)."

## D. What to avoid
- Inconsistent feel: "same input class, different response. Breaks learned read of force/timing." Ship-blocker class.
- Platform feel drift: "shipping feel tuned on one machine." "A canvas game assuming 60Hz rAF drifts on 120Hz."
- Polish bloat (Kelly 2014): "juice applied indiscriminately trains players to ignore it." "Every effect must connect to player input; otherwise noise."
- Feel regressions: "tuned values are the product; any change without re-verification is regression." "Constants live in spec; blind A/B re-runs on change."

## E. Shipped
- Celeste: "controls feel 'kind' — inputs succeed slightly more often than deserved." "Deaths feel like player's fault, never controls'."
- Dead Cells: "hidden forgiveness + dense hit feedback." "Combat feels brutally fair; every hit feels massive." "Closest analog to our hit-stop ladder + floaters."
- Nuclear Throne: "every bullet feels violent; layering so consistent players read enemy power from feel alone."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** refresh-rate independence. All feel constants time-based: hit-stop durations in seconds (0.04/0.08/0.15, game.js:1181,1206,1221,1225); `_applyHitStop` uses `performance.now()/1000` with 0.35s budget per 1s window (game.js:1507-1513); trauma decays 0.5/sec (time-based); 70ms dip time-based; squash 0.18s time-based. No frame-count assumptions. 120Hz displays won't change feel durations. (DF/valdemird requirement satisfied.)
- **FEEL-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
swink · nijman · df · thorson · celeste · dead cells · nuclear throne
