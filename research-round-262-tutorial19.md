# Tutorial Part 19 (Final Verification) — Findings (Round 262)
**Date:** Wed 2026-10-15 ~01:39 EDT · **Source:** live web research (behler, hodent, doyen, bycer, bergdahl, celeste)
**Project:** Mecha Protocol — tutorial (pre-jam; final verification)

## A. Mechanics
- Tissue test → "fresh eyes" hallway testing (Bycer 2019): fresh eyes = "the most valuable" onboarding resource — they reveal where learning breaks down. Every game is someone's first, even familiar genres. Zero explanation, watch silently, note the first confusion moment. If comprehension isn't near-instant, the tutorial is too thick.
- Skip-then-stuck end-to-end (Game Developer tutorial blog): always include in-context cues for skippers and returners — players who skip are most likely to get stuck. QA pass: skip everything, deliberately fail twice, verify help appears and dismisses.
- Rater simulation (Behler, SUPERJUMP 2022, from the rater's seat): time per game is limited — "a game with simpler mechanics that is well-polished with good instructions often beats a great idea with interesting mechanics that is too complicated to understand in a few minutes." Protocol: play like a tired judge — cold start, 3–5 minutes max, judge core-loop comprehension.

## B. Validation
- Fresh-player protocol (Hodent, GDC16 "The Gamer's Brain Part 2"): active tutorials only (learning by doing); never a punishing state during onboarding; reminders as memory-lapse workarounds; cognitive load ~3 items while learning; avoid false affordances; "Iteration is key. Knowledge is just the ingredients and not the recipe."
- Timestamp targets: ≤3–5 min understand how to play (Behler); 10 min emotional hook (Doyen, "Stop Teaching, Start Seducing" 2026); 15 min core loop + keep-playing conviction (Bycer); 30 min half-hour heavily scrutinized for approachability (Bycer).
- FFWWDD → timestamped observations clustered, fixed by frequency × impact. One-change-per-iteration supported by Hodent + Bycer's no-over-correct warning.

## C. Techniques
- One-liners: no "windows that contain walls of text" (Bergdahl); loading-screen dumps unread (Hodent); never frontload exposition (Bycer). One short line per beat.
- Breadcrumbs (Hodent): manage attention with clear signifiers — highlighted tiles, arrows, pulsing objectives — pointing at the next action without words. Bergdahl: best tutorials are invisible.
- Fail-triggered help (Bergdahl): detect struggle from behavior — adaptive hints appearing only when needed (Bulletstorm-style). Hodent: never punish during onboarding. Our design (2+ fails, offered-not-forced, one-tap dismissible) = professional consensus.
- Non-judgmental wording (Celeste): "designed to be a challenging, but accessible game" (VICE/creators). GMTK: never accuses, no shame stamp. Lesson: frame assistance as the normal way to play ("Assists are on so you can enjoy the tactics"), never a penalty.

## D. What to avoid
- Unskippable tutorials (Bergdahl: break immersion, waste time, forced repetition across sessions).
- Text dumps (Bergdahl/Hodent/Bycer all converge).
- Help that never appears for skippers (dead end with no recovery).
- Blaming the player (Hodent: no punishing states; Bergdahl: "Don't assume the player's skill level"; "Too slow! Try again?" destroys motivation → frame failure as information).
- Bycer's three indie failures: (1) essentials-no-context then wolves; (2) frontloaded exposition; (3) onboarding so slow interest dies. "Hard games should not have hard tutorials."

## E. Shipped
- Portal (Valve 2007): teaches portals by doing — walk through one before having the gun; almost no text. Zero-risk rooms per mechanic. Model: teach move → attack → ability in a safe scripted first mission.
- Into the Breach (Subset 2018): teaches through the grid — consequences legible before committing. Model for breadcrumbs: show predicted outcomes on the board itself.
- Celeste Assist Mode (2018): opt-in, granular, framed non-judgmentally from the start. Decoupled difficulty from shame.
- Honorable mention: Mario Bros. 1-1 — zero-text tutorial; level design teaches jump, enemies, power-ups.

## Implemented this round
- **WORDING AUDIT (i18n.js, verified):** game-over sub = "Mission {n} failed. The war goes on — refit and try again." (factual, forward-looking). Assist suggest = "Rough mission? Pilot Assists can help — no shame in tuning the fight." (explicitly non-judgmental; Celeste standard). JA mirrors both. PASS.
- **OPEN (jam-day):** native-speaker JA review still outstanding (flagged round 253). Also: itch.io raters score "difficulty scaling and options" — our default-ON visible assist = rating insurance (itch.io jam wiki).
- **TUTORIAL-SPEC.md:** final verification (below). Spec only, +0 lines. 4,433 lines (+0).

## F. Sources
behler · hodent · doyen · bycer · bergdahl · celeste · portal · itb
