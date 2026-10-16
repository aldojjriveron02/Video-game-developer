# Tutorial Part 18 (Final Verification) — Findings (Round 253)
**Date:** Wed 2026-10-15 ~00:44 EDT · **Source:** live web research (weinstein, schell, luban, flockbay, geek insights, ash)
**Project:** Mecha Protocol — tutorial (pre-jam; final verification)

## A. Mechanics
- Tissue test origin (Weinstein, Eastshade 2015): fresh eyes are precious — fix between testers, never burn the next pair on known issues. Remote < on-site (can't interpret feedback without seeing the moment). Recurring fix: more gameplay BREADCRUMBS — diegetic hints leading along interesting paths without spelling out; decreases lost/stuck.
- Skip-then-stuck end-to-end (Geek Insights Jun 2026): two explicit paths — (a) skip path: "players skip the tutorial and get lost" = named failure mode; fix = first lessons inseparable from progress + optional help without forced repetition; (b) stuck path: "if players keep failing at the same moment, redesign the tutorial before you blame the player." Luban: never "push button" tutorial; design the illusion of losability so wins feel earned.
- Rater simulation: zero-instruction boot, time to first tap/action, skipper lands meaningful action, safety net on schedule. Luban practice #1: get players into the game ASAP. "Five seconds to fun" (fun action inside first minute; cut setup until it does).

## B. Validation
- Fresh-player protocol (Weinstein + FFWWDD/Schell): never-played, zero instructions, silent, observe LIVE. Fix everything one round reveals before next tester.
- FFWWDD debrief (Schell's team via Deliberate Game Design): Frustrating / Favorite / Wanted / Wand / Doing / Describe — negatives FIRST. Then tutorial follow-ups ("Did the tutorial teach what it needed to?"). "Testers are great at showing problems, not so much at proposing solutions."
- Ask "did they understand" BEFORE "did they like it" (Geek Insights) — asking like-first is a called-out mistake.
- Between players: change ONE thing per iteration (one teaching moment, one prompt, one objective). Never batch fixes — one variable at a time. Never blame the player.

## C. Techniques
- Contextual hints: "teach only the mechanics needed for the next minute of play." Learning goals as VERBS ("Move," "aim") not systems. Tiers: first minute / first ten minutes / advanced-wait.
- One-liners: "teach one idea, ask for one action, deliver one response, move on." Long text box = redesign the intro so the environment demos it.
- Breadcrumbing (Weinstein): "there can never be too many breadcrumbs" — diegetic, non-spoiling, anti-lost.
- Fail-triggered: trigger on failure, not schedule. Offered, never forced: "optional help works better than forced repetition."
- Assists (Celeste canonical): granular, mix-and-match, toggleable anytime, consent screen BEFORE enabling. Options "come apart" — take only the help you need (protects dignity).
- Non-judgmental wording (Flockbay Jun 2026): "Wording matters because names carry judgment. Position matters. Timing matters." Celeste revised wording POST-LAUNCH (v1.3.0.0) — removed gatekeepy language + deleted the "assist" shame-stamp on file card. Hiding help in a cheat code "teaches shame."

## D. What to avoid
- Unskippable/forced tutorials (Luban: "Nothing is more boring than a game that begins with a 'push button' tutorial").
- Text dumps / information overload (two failure modes: overload, or never teaching at all).
- Help that never appears for skippers (named failure mode).
- Hard defaults / one-size-fits-all (Celeste counter-example; Ash GDC26: tailor onboarding to backgrounds).
- Blaming the player (redesign the tutorial, add breadcrumbs).
- Asking like-before-understanding.

## E. Shipped
- Into the Breach (Subset): UI as teacher — every attack telegraphed, deterministic combat. Player learns tactics by reading intent. Lesson: make enemy intent readable so first VEX kill (~2min) teaches through the grid, not a dialog box. (Davis GDC 2019.)
- Celeste (Maddy Makes): Assist Mode + post-launch wording revision (stamp removal). Tone of voice = why players used it. Lesson: assists ON default is bolder than opt-in — copy the wording discipline (EN+JA reviewed for judgment, one-tap dismissible, explain what changes).
- Wargroove (Chucklefish): campaign AS onboarding — early missions teach inside the fiction; "snappier than existing TBS." Lesson: per-mission one-liners + campaign as tutorial (safe early scenarios), not a separate mode.

## Implemented this round
- **Verified (code read, no changes):** assist suggestion on game-over screen — offered (line + optional button), NOT forced; one-tap dismissible (Retry dismisses whole screen, suggestion included); assists button opens help panel. Celeste's "respectful name + visible placement + well-timed offer" satisfied.
- **OPEN (needs a Japanese speaker, jam-day):** native-speaker review of JA hint/one-liner text for JUDGMENTAL phrasing (not just grammar) — Flockbay's lesson. Flagged for Aldo.
- **TUTORIAL-SPEC.md:** FFWWDD debrief battery (negatives first; understand-before-like); one-change-per-iteration rule; breadcrumb-first fix policy (long text box = redesign the intro); native-speaker JA review as jam-day action.
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
weinstein · schell · luban · flockbay · geek insights · ash · subset · chucklefish
