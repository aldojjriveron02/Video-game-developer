# Tutorial Part 17 (FTUE Verification) — Findings (Round 244)
**Date:** Wed 2026-10-14 ~23:52 EDT · **Source:** live web research (krug, bromley, luban, bycer, thorson, schell, okpy, nintendo)
**Project:** Mecha Protocol — tutorial (jam stance: EASY default, safety net verified)

## A. Mechanics
- Tissue test (Krug, "Rocket Surgery Made Easy"): cheap DIY usability — quick unscripted sessions with fresh users, not formal lab studies. Bromley's protocol: fresh player, no instructions, silent observation, record what they do. 5–10 players = accepted small-scale number.
- FTUE funnel as timestamps: (1) boot → first tap ("do they know what to touch?"); (2) → first meaningful action ("do they understand the core verb?"); (3) → first win ("did the loop land?"). Luban: first meaningful action past ~60s → cut friction. Players arrive impatient.
- Watch (Bycer): fumble points = the lesson plan. Misclicks, ignored hints, repeated failures on same step.
- Debrief (Schell): most frustrating moment, favorite moment, "anything you wanted to do that you couldn't?", magic wand, "describe this game to friends?", "did they find their way through the level?"
- First 60s rule (Luban): real small challenge showing originality immediately, wrapped in just enough narrative. "Nothing is more boring than a game that begins with a push button tutorial."
- Skip design (OKPy 2026, citing GDC + Unity A/B data): prominent skip + clear later access lifts Day-1 retention 4–11% relatively. Two rules: skip prominent from outset; everything skipped retrievable in-game (help menu, codex, contextual tips).

## B. Validation
- 5–10 fresh players, no instructions, silent observation, timestamp funnel, Schell debrief, fix biggest blocker between players (not after all five). Verifies safety net catches skippers AND strugglers, not just compliant players.
- Three timestamps = three design questions: first tap (opening legibility), first meaningful action (verb comprehension), first win (loop satisfying). Cliff between meaningful action and first win = tutorial taught verb but not strategy.
- Fail-triggered help (Nintendo Super Guide, NSMB Wii 2009): after 8 deaths, block appears offering Luigi to complete the level — offered NEVER forced, player resumes anytime. Pattern: detect failure → offer non-judgmentally → let player retake control. DIRECTLY validates our 2+ fails assist suggestion.
- Assists ON default (Celeste, Thorson): Assist Mode granular + opt-in + renamed from judgmental "Cheat Mode." Goal: "players safe to float around between loosely-defined difficulty levels without judgement." Jam entry: assists ON + HUD toggles matches — skilled opt out in one tap, nobody shamed, raters never walled.

## C. Techniques
- Contextual hints > front-loaded (Bycer): teach in order of play (what, how, why/when); limit system access until basics known (Offworld Trading Company model). Wargroove (tactics exemplar): units introduced one at a time, tutorials in-battle showcasing each unit.
- One-liners: Bycer ("if it isn't vital, don't show it at start") + Luban (brief narrative, then play) → briefing = who/where/stakes, one line, rest contextual. Matches our jam stance.
- Safety net, two layers (Thorson): (1) invisible kindness — coyote time, buffering, corner correction ("fudged a tiny bit in the player's favor"); (2) visible fail-triggered help — Super Guide. Our assists ON + 2+ fails suggestion = both layers.
- EASY default for raters: Thorson (drop authorial preciousness), Luban (don't wall in minute one), jam wisdom (judges won't retry). Rater plays once for minutes — a bounce rates the difficulty, not the game.

## D. What to avoid
- Unskippable tutorials (OKPy: 4–11% retention cost; in jam = rater patience).
- Tutorializing before the player cares (narrative hook + real challenge first).
- Help that never appears for skippers ("as harmful as a mandatory, tedious tutorial" — the skip-then-stuck failure mode our net prevents).
- Hard defaults that wipe raters (Thorson's "precious" about difficulty).
- Popup-guideline tutorials + text without a test (Bycer): walk through, and every lesson ends with the player DOING the action — delete text-only lessons.

## E. Shipped
- Into the Breach (Subset): perfect-information intent telegraphs + free Reset Turn + compact first island — UI is the teacher, mistakes reversible, safety net one click stigma-free. (Davis GDC 2019.)
- Celeste (Extremely OK): Assist Mode as accessibility + invisible kindness — struggling caught without shame, skilled never notice. "Coming out feeling capable and powerful."
- Wargroove (Chucklefish): one-unit-at-a-time in-battle tutorials — Bycer's model inside complex tactics; "impeccable job of introducing tutorials during battles." (Newsweek.)
- Nintendo Super Guide (2009): canonical fail-triggered assist — offered, optional, resumable.

## Implemented this round
- **Verified (code read, no changes):** fail-triggered assist at 2+ fails (game.js:1284) — offered, not forced (Super Guide pattern); wording non-judgmental (i18n: "Rough mission? Pilot Assists can help — no shame in tuning the fight." + JA "調整は恥じゃない" — Celeste lesson already applied); assists ON default + HUD toggles; per-mission one-liners.
- **TUTORIAL-SPEC.md:** tissue-test protocol with timestamp targets (first tap <15s, first meaningful action <60s, first VEX destroyed ~2min on EASY); Schell debrief battery; skip-then-stuck end-to-end verification (fresh profile: skip → HUD toggle visible → one-liner re-shows → 2+ fails fires suggestion); rater-simulation run requirement.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
krug · bromley · luban · bycer · thorson · schell · okpy · nintendo · wargroove · subset
