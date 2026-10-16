# Tutorial Part 26 (Verification Round 7) — Findings (Round 325)
**Date:** Wed 2026-10-15 ~07:18 EDT · **Source:** live web research (gameanalytics, duamentes, chou, wayline)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 7)

## A. Mechanics
- Completion-funnel audit (GameAnalytics): "define ordered conversion steps, then inspect per-step drop-off to find bottlenecks and quantify abandonment." Our start/show/done/dismiss/stall/skipped maps 1:1. Audit: instrument every step, measure drop-off, fix steepest first.
- Skip-path audit (Duamentes; GameAnalytics): "observe and measure both paths separately (completed vs skipped), comparing downstream conversion." "Segmenting funnels by behavior reveals whether skippers churn or thrive."
- Re-engagement audit (GameAnalytics; Tyrads): "Day 1 / Day 7 / Day 30 retention." Baseline "~40% D1 / 20% D7 / 10% D30." Tyrads: "if ≥30% return next day, onboarding is working." Tie funnel events to D1 — stalled/dismissed = re-engagement cohort (contextual hint on return, never forced replay).

## B. Validation
- Playtest discipline (Duamentes): "watch silently — do not lead or help." "5–8 testers." "Mix of player types." "Post-session emotional UX debrief — ask how the player *felt*." (Professional form of paraphrase probes.)
- Cohort analysis (Playio): "group players by shared attributes and compare over time." Cohorts = completed vs skipped vs stalled, compared on D1/D7 — isolates tutorial effect.
- A/B testing (Zengin): "test one tutorial variable at a time against retention deltas, not raw completion."
- Long-term retention: "a tutorial is 'verified' only when its cohort shows no regression on D1 return."

## C. Techniques
- Adaptive tutorials: "monitor performance and dynamically adjust — advanced get less hand-holding, struggling get extra guidance." (Our 8s impasse model; pro version adapts hint *content* to failure.)
- Contextual help (Chou): "step-by-step early, glowing-choice cues, instruction exactly when needed." "Help appears at point of confusion, never in pre-game lecture."
- Progressive mastery: "introduce core mechanics gradually, one verb at a time." "Early actions must be safe, guided, produce early win-states." (Validates zero-cost first verbs.)
- Honest pacing (Chou): "if the user feels stupid during onboarding, the game has already lost them." "Never teach a move in text then demand harder version in combat."

## D. What to avoid
- Tutorial abandonment: "nearly half of players abandon games due to poor onboarding." "A confused first session is already a lost player."
- One-size-fits-all: "a single static tutorial treats veterans and newcomers identically."
- Help-system bloat: "drowning players in walls of text instead of teaching via doing."
- Forced replays (Wayline): "Forced Tutorials Are Killing Game Discovery." "Always offer skip, never force replay of completed content."

## E. Shipped
- Mario 1-1: "invisible tutorial through level design alone — no text boxes." "Failure in 1-1 costs nothing." (Matches zero-cost-verb pillar.)
- Portal: "one concept per room, instant recovery." "Every new mechanic in a space where the player cannot lose."
- Chou (Octalysis): "front-load early win-states and glowing next-action cues."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** skip path. "Skip tutorial" button on coach UI (tutorial.js:110). Skips the coaching layer but "same mission, same rewards — Bugnet trap avoided: skip routes through identical progression" (tutorial.js:3-4). "Atomic skip — route skip through same finalization" (tutorial.js:148). Wayline satisfied (always offer skip); no punishment for skipping; no forced replay.
- **TUTORIAL-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,565 lines** (+0).

## F. Sources
gameanalytics · duamentes · chou · wayline · mario · portal
