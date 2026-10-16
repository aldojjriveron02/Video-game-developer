# Tutorial Part 25 (Verification Round 6) — Findings (Round 316)
**Date:** Wed 2026-10-15 ~06:42 EDT · **Source:** live web research (hedges, fan, gee, adams, gameanalytics)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 6)

## A. Mechanics
- Teach-audit (Hedges, Game Developer Oct 2017): positive — "doesn't feel like a tutorial; doesn't disrupt flow; low chance of failing; ability to skip; freedom to experiment; focus on unique mechanics." Negative — "hand-holding; unskippable; patronizing; information overload; ruins flow; constant pauses; too long; pop-up messages; forced pace; repetitive." Filter: "does the player need this to do the next thing?" — anything else is cut.
- Hint-budget audit (Fan, PvZ GDC 2012): "no more than 8 words a sentence." Hedges survey: players prefer short messages. Direct corroboration of our 8-word budget.
- Impasse audit (Gee): information "on demand" and "just in time." Hints resolve detected impasses, not narrate.

## B. Validation
- Silent playtest (getgud.io): "Stay Silent and Observe — let players experience without interference; record sessions; focus on behavior, not self-report." Any facilitator intervention = defect.
- Telemetry funnels (GameAnalytics, McCalmont Feb 2025): Tip 5 — "Track Every Step of the Tutorial: build a funnel over every step to measure drop-offs, then dissect the largest: is there friction? Is the mechanic hard? Is the goal unclear?"
- Behavior metrics (getgud.io; GameAnalytics): combine quantitative (time, errors) with qualitative observation. Tip 6 — "measure starts, stops, sources, sinks; track conversion and engagement."
- Comprehension probes (getgud): "behavior over self-report" — paraphrase probes, not leading questions. "Players rationalize but behavior doesn't lie."

## C. Techniques
- Teach via doing (Hedges): Mario 1-1, Mega Man X, Dark Souls Undead Asylum — "teaches through level design rather than text." Fan: "Just get the player to do it once."
- Progressive disclosure (Gee; GameAnalytics): "just in time." "Guided instruction only for trickier parts, free exploration for well-understood mechanics." Shogun 2's adjustable advice levels.
- Contextual hints (Fan; Hedges): 8-word sentences; appear at moment of need (impasse), not before.
- Graceful failure (Hedges; Adams; GameAnalytics): "low chance of failing." Adams: "don't punish inexperience." Tip 7 — "Make a User Feel Successful: the tutorial should let the player win something." Corroborates our zero-cost first verbs.

## D. What to avoid
- Adams' Eight Ways (Game Developer, June 2011): (1) force the tutorial; (2) make them read a lot; (3) describe buttons badly; (4) leave steps out; (5) punish inexperience; (6) patronize; (7) force completion; (8) ship no tutorial.
- Hedges negatives: hand-holding, unskippable, patronizing, forced videos, info overload, ruined flow, irrelevant info, constant pauses, too long, pop-ups, forced pace, repetitive.
- GameAnalytics Tip 2: "remove unnecessary barriers." "An unskippable tutorial is exactly such a barrier."

## E. Shipped
- BotW (Great Plateau): "offers perhaps the best tutorial ever made" — "a safe sandbox where the player learns by doing and experiments freely."
- Portal: "mechanics introduced one at a time through level design." "One concept per chamber = progressive disclosure + zero-cost verbs."
- Half-Life 2: "teaches through physics interaction rather than text. The tutorial is the game."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** tutorial funnel instrumentation (tutorial.js:61-158). `tutorial:start`, `tutorial:choice:veteran/new`, `tutorial:step:show:<id>`, `tutorial:step:done:<id>`, `tutorial:step:dismiss:<id>`, `tutorial:step:stall:<id>` (impasse), `tutorial:skipped`. Full funnel: start → show → done/dismiss/stall → skipped. GameAnalytics Tip 5 ("Track Every Step") satisfied.
- **TUTORIAL-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
hedges · fan · gee · adams · gameanalytics · botw · portal · half-life 2
