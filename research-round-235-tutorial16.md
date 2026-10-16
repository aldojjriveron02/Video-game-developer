# Tutorial Part 16 (Tutorial/Onboarding UX) — Findings (Round 235)
**Date:** Wed 2026-10-14 ~22:58 EDT · **Source:** live web research (bycer, khalifa, weinbaum, punchev, milton, wiltshire, nngroup)
**Project:** Mecha Protocol — tutorial (FROZEN code path; verification only)

## A. Mechanics
- First-60-seconds canon (PUNCHev): most games lose players in the first minute to menus/sign-in/front-loaded tutorials. Teach one decision at a time; reach the first win fast; teach by doing, not reading.
- Contextual vs front-loaded (NNGroup 2023): spectrum from step-by-step flows to "pull revelations" (contextual help the user invokes). Khalifa/Andersen taxonomy: instructions < examples < "carefully designed experience" (SMB 1-1; Dahlskog & Togelius).
- One-liner pattern (Bycer): tutorials start with three things — controls, what am I looking at, step one. "If your tutorial requires the player to read the manual (a tutorial for the tutorial), you have failed."
- Progressive disclosure: teach what → how → why/when, in order of importance (Bycer; Offworld Trading Company model).
- Tactics without manual (Wiltshire/RPS on Into the Breach): constrain design around comprehension — 3 attack shapes, no special cases; animated tooltips > text ("a thousand times more effective" — playtesters read 3 sentences and still didn't get it).

## B. Validation
- Tissue test (Weinbaum/Eastshade 2015): never-played player, zero guidance, watch hands and face. Fresh eyes are consumable — frugal batches, fix between. In-person beats remote.
- Time to first meaningful action: PUNCHev — "test the first 60 seconds harder than anything else." Webeyez: onboarding completion AND first meaningful engagement.
- Funnel telemetry: Tutorial Completion Rate = North Star, granular milestones (industry). Emhance AI: +12% completion from copy iteration, +4–6 D1 retention.
- Zero-knowledge rule (Bycer): assume the player skipped every word. If learnable only through text, tutorial fails.

## C. Techniques
- 5s stall hint: contextual idle-triggered help (NNGroup "pull revelations"; PUNCHev feedback-on-everything). Eastshade nuance: breadcrumbs plentiful but diegetic — never spoil discovery.
- Atomic skip: universal best practice — one action, up front, never page-by-page. PUNCHev: respect experienced players. Unskippable coach marks = top onboarding mistake.
- Tooltips vs modals: anchored tooltips keep player in game view; modals block it. Into the Breach animated weapon tooltips = tactics exemplar. Bycer: popup-guideline systems → misclicks fill screen with unknown info.
- Learn by doing: Bycer's "The Test" — every lesson needs a DO proving learning, beyond clicking "next."
- Defaults = good path (PUNCHev): assists ON by default = correct call.
- Skip-then-stuck: Andersen "Availability of Help" — help re-accessible after skip. Safety net = stall hint + contextual tooltips + persistent briefing re-read.

## D. What to avoid
- Unskippable dialogue tutorials (Twilight Princess); fix = on-screen prompts at moment of need (BotW).
- Telling not showing (Doom Eternal popups); fix = visual clues in world. "Present like they're not tutorials."
- Tutorial announcing itself (Helldivers); fix = embed in real game. Tutorial level ≠ real game teaches non-transferable skills.
- Front-loading before first touch (PUNCHev #1 first-minute killer).
- Text dumps (players skip, then get stuck — every wall = design debt).
- Modals blocking game view (fatal in tactics).
- No help after skip (the unfixable variant).
- Williams (2009): mishandled active-learning tutorials can ruin the whole game — tutorial friction < game friction.

## E. Shipped
- Super Mario Bros. (1985): World 1-1 designed AFTER harder levels as a school — Goomba, mushroom, pipes. Zero text. Level IS the tutorial.
- Into the Breach (2018): "sacrifice cool ideas for clarity every time" (Justin Ma); half of 4-year dev on UI; perfect information + animated tooltips; rules simplified to communicability.
- Breath of the Wild (2017): brief on-screen prompts at moment of need, never leaving gameplay.
- Portal (2007): one mechanic per chamber, each solvable only by the new mechanic, zero text walls, relentless playtester iteration.

## Implemented this round
- **Verified skip-then-stuck safety net (code read, no changes — FROZEN):** skip() sets full completed state atomically (Round 193); stall timer is step-gated (no-op after skip); safety net layers intact — (1) 4 pilot-assist toggles ON by default with HUD access (Round 52); (2) fail-triggered assist suggestion after 2+ fails (game.js:1284); (3) per-mission briefing one-liner re-shown every mission. No help is locked behind the skipped tutorial.
- **TUTORIAL-SPEC.md:** tissue-test protocol (5–10 fresh players, in-person, time: first tap / first meaningful action / first VEX destroyed; frugal batches, fix between); frozen-path pass/fail checklist (one-liner vs Bycer's 3 questions; 5s hint timing; atomic skip; both toggle states); string A/B protocol (fresh players only, track time-to-first-action per variant).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
bycer · khalifa · weinbaum · punchev · milton · wiltshire · nngroup · andersen · williams
