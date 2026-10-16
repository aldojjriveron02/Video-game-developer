# Narrative Part 15 (Finalization / Content Lock) — Findings (Round 246)
**Date:** Wed 2026-10-15 ~00:03 EDT · **Source:** live web research (megill, beaulieu, bromley, ingold, supergiant, my.games, gmtk)
**Project:** Mecha Protocol — narrative (pre-jam; finalization)

## A. Mechanics
- Voice bible (Megill, Ubisoft Massive, Game Developer Apr 2023): NOT a lore encyclopedia — a one-page "how this character talks" (diction, rhythm, attitude, taboo phrases) every line is checked against. Keep practical, living, consultable.
- No-name-tag test protocol: strip speaker labels, shuffle lines, attribute blind. Any line plausible for two characters fails — rewrite or cut. = Beaulieu's "hello" test (give the same functional line to different characters; attitudes must read as distinct people).
- AI-line voice pass: the pro version is the read-aloud/table-read. Interleave 36 AI lines among human baseline, tags removed; read full set aloud in session order; any line that sounds "written" not "spoken," or breaks bible diction, gets rewritten by hand or deleted. Ingold's bar: judge on whether lines earn their place as banter (characterful), not just grammar.

## B. Validation
- 3-player one-shot (Bromley, Games User Research): one-to-one moderated sessions, FRESH players each time ("players only get to experience the story fresh once"). Ask during play: "What is happening? Why? What do you expect next?" + appeal check: "How interested are you in what happens next?" Recruit genre-matched; no long mid-session breaks.
- Quote check: ask each player to quote VEX's defining line. All three land on same escalation rung → ladder is legible. Nobody quotes anything → voice isn't landing; cut lines, don't add.
- Skip test (MY.GAMES "The Big Skip"): serial skippers are the reality. Skip every briefing and bark; verify objectives, game state, VEX's posture remain legible from gameplay + HUD alone. Anything only learnable from a skipped line → move to highlighted briefing essential or cut.

## C. Techniques
- Briefing discipline (Ingold): narrative turns brains on through setup/payoff/one-off events — "not every game needs a deep intricate plot." MY.GAMES craft rule: cut dialogue to essential minimum, highlight critical beats (color/bold) for skimmers. Tactics build: briefing = objective + stakes + one character beat; any sentence that doesn't change what the player does or feels gets cut.
- Bark trigger audits (Beaulieu): triggers need multiple variants (2, 3, 10 per situation); failure mode = repetition becoming meme (Skyrim "Never should have come here"). Pro audit: play with trigger logic ON, log every fire with timestamps, listen for what grates. Any line repeating within ~3 min → add variant or widen cooldown.
- Escalation-ladder check (Nemesis system reference, GMTK): rival's dialogue state visibly tracks player history. Jam version: play three sessions (dominating / struggling / comeback); verify tone audibly shifts across arrogant→rattled→beaten — triggered off REAL game state (score differential, streaks), never a timer.

## D. What to avoid
- Last-minute rewrites / new lines after voice pass (Supergiant "From Alpha to Content Lock" 2014): at content lock "no more significant content changes"; alpha = content-complete. Every post-pass line is untested (no no-name-tag, no read-aloud, no trigger audit). Rule: after voice pass, line list FROZEN; edits to existing lines only, each re-read aloud.
- Lore dumps (MY.GAMES): walls of text frustrate; a lore paragraph on a jam deadline = information with no gameplay home. Cut or move to briefing highlight.
- Untested trigger frequencies (Beaulieu): any bark whose rate was never measured in real play is a liability — audit it or cut it.

## E. Shipped
- Thomas Was Alone (Bithell, 2012): sparse narrator lines turn colored rectangles into people with friendships and arcs — "When Less is More in Storytelling." Every line passes the no-name-tag equivalent.
- Baba Is You (Hempuli, Nordic Game Jam 2017, 48h): narrative IS the mechanic — zero dialogue needed. Lesson: VEX's ladder works best when taunts describe what the player just did, not abstract lore.
- SUPERHOT (7 Day FPS Challenge 2013): bark-length system text ("SUPER. HOT.", "WAKE UP") = UI feedback AND plot — short, skippable-proof, unmistakable voice.

## Implemented this round
- **Verified (code read, no changes):** every bark fire already logs to telemetry (barks.js:132, 'bark:<trigger>:<key>' with timestamps via design events) — the trigger audit has its data source. No new instrumentation needed.
- **NARRATIVE-SPEC.md:** finalization checklist — (1) no-name-tag test on all 106 lines (morning of final day); (2) 3-player one-shot (Bromley protocol + quote check); (3) trigger audit via telemetry (flag repeats <3min → variant or widen cooldown); (4) skip test (objectives legible from gameplay alone); (5) content lock after voice pass (line list frozen, edits-only, each re-read aloud). Escalation-ladder check: three sessions (dominating/struggling/comeback) verifying tone shifts off real game state.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
megill · beaulieu · bromley · ingold · supergiant · my.games · gmtk · bithell · hempuli
