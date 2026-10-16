# Tutorial Part 24 (Verification Round 5) — Findings (Round 307)
**Date:** Wed 2026-10-15 ~06:11 EDT · **Source:** live web research (bbc gel, punchev, gamedesign.gg, bromley)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 5)

## A. Mechanics
- Word budget (BBC GEL): "keep to the essentials, don't over tell" — least info needed to move on. "Learning should never be more complex than the game." (PUNCHev): "one decision at a time" — stacking choices splits attention; sequence, don't pile up. Each hint = exactly one instruction + one action.
- Do-once rule (PUNCHev; BBC GEL): "teach by doing, not by reading" — replace text dumps with a small guided action, performed once, in a safe context. "One guided execution of the core action beats any explanation."
- Impasse check (PUNCHev; Games User Research): "test the first 60 seconds harder than anything else… watch real players hit it, note exactly where they hesitate." Operational rule: "any turn with no goal-advancing action within 30–45s, or a hint re-read without acting = impasse signal → trigger assist or flag for rewrite." BBC GEL: "learn from the player's interaction and know when they need help."

## B. Validation
- Silent observation (Bromley): "collecting unbiased data means observing players (and only asking probing questions), with explicit care to avoid accidentally leading players." Zero developer verbal help; "silence is the test of whether the design speaks."
- Paraphrase probes (Bromley): "what are you trying to do right now / what did that hint tell you?" Compare phrasing to intended goal. "If the player cannot restate the hint's intent in their own words, the hint fails regardless of whether they clicked through it."
- Behavior metrics (PUNCHev; GameDesign.gg): "measure by watching the first minute closely — where players drop off, how fast they reach the first win, how many complete the opening flow." Metrics: tutorial drop-off, completion rate, time-to-first-action, A/B-test variations. "Early funnel points tell more than later metrics." BBC GEL: instrument so the game "learns from the player's interaction."

## C. Techniques
- Teach by doing (all sources): BBC GEL — hands-on through play. PUNCHev — perform once in safe context. GameDesign.gg — "cold open," interact immediately (Mario World 1-1).
- Safe experimentation (GameDesign.gg; BBC GEL): "safe sandbox" (BotW Great Plateau) — experimenting costs nothing. BBC GEL — "without fear of failure."
- Optional guidance (PUNCHev; BBC GEL; GameDesign.gg): "respect returning and experienced players… let people skip or speed through." "Dynamic hints" — adaptive help based on struggle (Hades). Re-openable glossary + skip path = this pattern.
- Just-in-time help (BBC GEL; PUNCHev; GameDesign.gg): "introduce at the moment of need… at the exact moment the player needs it." "As short as it can be… layer in deeper systems in context as they come up, not all at once up front."

## D. What to avoid
- Frontloaded exposition (PUNCHev; GameDesign.gg): "explaining the systems before the player has done anything fun." "Too much text, too fast."
- Forced pacing (GameDesign.gg; PUNCHev): "slow burn," forced slow movement, unskippable sequences. "Walls of tutorial text and unskippable coach marks." Skip path honored at every beat.
- Text-as-crutch (PUNCHev; BBC GEL): "teach by doing, not by reading." "Bad onboarding is explicit, cumbersome, and can form a barrier to play." "If the tutorial only works when the player reads, the tutorial is broken."
- Unskippable beats (PUNCHev; GameDesign.gg): "treating every player as a total beginner." "One-size-fits-all." "Invisible walls" — don't bait exploration then punish it.
- Missing feedback (PUNCHev): "no feedback on actions, so the player is unsure whether anything happened." Every action needs a reaction.

## E. Shipped
- Portal (Valve): each mechanic one at a time in safe test chambers, then combined. "Learns through doing, never through reading." Single-mechanic isolation + zero fail-state = the 3-turn assist model.
- Breath of the Wild (Nintendo): "cold open" + Great Plateau safe sandbox. "Experimentation is free and guidance arrives at the moment of need" — the model for safe sandbox + re-openable glossary.
- Hades (Supergiant): contextual help + adaptive assistance through in-world narrative. "Optional, adaptive, re-openable help — the shipped proof that a skip path and on-demand glossary don't dilute onboarding, they improve it."
- (Hyper Light Drifter: one control button at a time — the extreme minimal word-budget precedent.)

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** impasse detection (game.js:1736-1740, Round 157). 8s idle during a coach mark → stuck logged via Telemetry (`tutorial:stuck:<step>`) + visual escalation (faster pulse, orange). More sensitive than the research's 30–45s rule — appropriate for a fast tutorial. The "trigger assist or flag for rewrite" rule: we do both (escalate the coach mark + log for post-play analysis).
- **TUTORIAL-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
bbc gel · punchev · gamedesign.gg · bromley · portal · botw · hades
