# Playtesting Methodology — Findings (Round 13)
**Date:** Tue 2026-10-13 ~20:58 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Protocol prototype → Aldo's "is it fun?" gate

## A. The "is it fun" gate
- **Sid Meier's dictum (verified provenance):** "A good game is a series of interesting decisions. The decisions must be both frequent and meaningful." → Operationalize the gate: not "fun?" but **"were decisions frequent AND meaningful?"** — maps directly onto turn-by-turn tactics.
- **MDA framework** (Hunicke/LeBlanc/Zubek, 2004): 8 kinds of fun (Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission). Gate application: **Aldo names 2–3 aesthetics the prototype must deliver (e.g., Challenge + Fantasy + Narrative); verdict = did the playtester actually experience those?** Sharper than "was it fun?"
- **Jake Solomon (XCOM/XCOM 2):** Firaxis mantra "Play forever"; "accounting for player emotion is as much the job of a game designer as building a system of mechanics." → The gate evaluates **emotional beats** (tension before a shot, relief, attachment), not just working systems.
- **NN/g — Don't listen to users:** watch what they do; preference–performance correlation only ~.44–.53. → **Weight observed behavior** (did he play mission 2 unprompted? retry a failed mission?) over stated "it was fun."
- **Proposed gate battery** [synthesis]: (1) "What happened in your favorite 60 seconds?" (2) "Was there a turn where you felt you had no good move?" (3) "Would you play a fourth mission right now?" — asked AFTER observing behavior; the behavioral answer counts more than the verbal one.

## B. What to measure
- **GameAnalytics free tier (verified live):** genuinely free, no card, no MAU limits — dashboards, custom events, funnels, cohorts, retention, realtime. JS SDK → log "design events." The pro-cheap telemetry pipeline.
- **MVP telemetry for this prototype** [synthesis]: mission_start / mission_complete / mission_fail (turns, duration, surviving units, peak heat); undo_count per mission; per-unit/per-weapon/per-part usage (what actually gets picked); quit/abandon points (last event before session end); retry counts. Funnels → completion rate per mission. Nothing else at prototype scale — cohorts/retention premature.

## C. Qualitative methods
- **Think-aloud protocol** (NN/g): cheapest #1 usability tool — no equipment, works at any stage; three requirements: representative users, representative tasks, "shut up and let the users do the talking." Solo-dev ready, no lab.
- **5-second test** (NN/g): flash title screen, then hangar, 5s each — "what is this game? what do you think you do here?" Don't warn them it's brief. Tests whether the fantasy reads instantly.
- **Truth vs polite praise** (NN/g): people bend truth toward social acceptability; memory rationalizes. → Ask about **specific remembered moments** ("tell me about the turn your mech overheated"), never solicit praise; written form for ratings.
- **Steve Krug, Rocket Surgery Made Easy:** DIY premise — "watching people use the product while they think aloud, plus asking questions" — ships scripts/checklists so a dev can run informal tests on their own work.

## D. Iteration discipline
- **Small batches, fix, re-test** (NN/g): "it's okay to leave usability problems behind in any one version… Anything not fixed now will be fixed next time." Fix most severe → new build → re-test.
- **One complaint = hypothesis, not verdict** (NN/g): "risk of being misled by the spurious behavior of a single person."
- Industry maxim [unverified attribution]: **playtesters are reliable at identifying problems but unreliable at prescribing solutions** — collect the pain, design the fix yourself.
- [synthesis] Discipline: **one hypothesis per build** (smallest change that could fix the biggest observed problem); triage by severity × frequency; re-test before stacking changes.

## E. Tactics-specific fun signals
- **Meaningful decisions** (Meier): count turns with ≥2 viable options and real tradeoffs; minimize "obvious move" turns.
- **Unpredictability** (Solomon): "If we were to use one word to describe our tactic, it would be unpredictability." And: **"If you shave off the lows, a lot of the time you're shaving off the highs"** — close calls and comebacks are the payoff; don't smooth variance away.
- **Randomness becomes narrative** (Solomon): "the products of chance become the narrative elements we see the most meaning in" — the mechanism behind unit attachment. Players read "85%" emotionally as ~100% → **XCOM quietly tweaked displayed odds in the player's favor** at lower difficulties. Concrete tuning technique for perceived fairness.
- **Warning signs** (Bycer, XCOM deep dive): (a) "fighting the game" — systems limit options so much the player fights the design, not the enemy; (b) "Inverse Arms Race" — snowballing, game gets progressively one-sided; (c) "Persistence of Losing" — tactics games are defined by losing well; failure must invite retry, not quit.
- **Tactics fun checklist** [synthesis]: ≥2 viable options most turns; ≥1 close call per mission; one story-worthy random moment; failure invites retry; no dominant strategy across all 3 missions.

## F. Remote playtesting at $0
- **r/playtesters** (4.9K members, verified live): post browser-playable link + Google Forms feedback link — free distribution + free survey in one post.
- **itch.io creator tools** (verified): threaded comments, discussion boards, ratings, devlogs — free tester recruiting + public feedback.
- **GameAnalytics free tier:** event telemetry replaces lab observation for the quantitative half.
- OBS for unmoderated think-aloud recordings [unverified as observed practice].

## G. Sample size reality
- **Textbook (NN/g):** 5 users surface ~85% of usability problems (formula N(1−(1−L)^n)); after the fifth, diminishing returns — "wasting your time running the same test with more people." Better: 3 studies of 5 users. Low-overhead agile rounds: as few as 2.
- [synthesis] **For this gate: 3–5 playtesters.** 1 risks single-person noise; 5 captures ~85%; beyond that, spend on another test-fix-retest round. The indie "1–5 testers" norm matches the research — provided they're real target players feeding an iteration loop.
- Note: Aldo's verdict is the qualitative gate per our process — these methods make his playtest (and any follow-ups) rigorous rather than vibes-based.

## H. Sources
flashofsteel.com (Meier dictum provenance, 2008) · users.cs.northwestern.edu/~hunicke/MDA.pdf (2004) · gamedeveloper.com (Solomon randomness, 2016; Bycer XCOM deep dive, 2019) · nngroup.com (5 users, 2000; how many users, 2012; think-aloud, 2012; don't listen to users, 2001; 5-second test, 2024) · sensible.com/rocket-surgery-made-easy/ (Krug, 2010) · gameanalytics.com/pricing · reddit.com/r/playtesters/ · itch.io/docs/creators/interact
Limitations: Valve internal debrief questions, itch.io analytics details, and the "playtesters find problems" attribution unverified in-session.
