# Difficulty Tuning & Balance — Findings (Round 17)
**Date:** Tue 2026-10-13 ~21:27 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Protocol — tuning the 3-mission campaign before playtesters arrive

## A. Difficulty ramps
- **XCOM force levels:** ramp on a calendar clock racing player tech → "inverse arms race" (fixed finite enemy roster → late game gets easier); needs an endgame pressure valve (Avatar Project timer).
- **Into the Breach:** player-chosen ramp (visible threat levels, self-paced) + fixed brutal-but-fair finale built from MASTERED mechanics (Davis: reaction to FTL's rule-breaking final boss).
- **Fire Emblem:** tune ONE honest curve, layer mode multipliers on top ("everyone reaches the ending" + hard core for veterans).
- **Win-rate targets** [synthesis]: sawtooth with downward trend. M1 ~85–95% first-try wins, M2 ~65–80%, ace ~50–65% — hard enough to demand hangar part-swapping, not so hard testers quit. (Riot's published bands: ±4–5% from 50% = "needs attention.")

## B. First-mission targets
- **World 1-1 (Miyamoto):** "the course is Mario 101" — teach one verb at a time through geometry not text; first failure survivable; first Goomba unavoidable but slow.
- **"Win, but feel tested":** ~90% first-try wins; much higher = cutscene → add optional pressure (turn-par, bonus objective) so skilled players feel tested while new players win.
- [synthesis] **M1 teaches: move + attack + heat ONLY.** Per-limb damage and hangar swapping are M2's lessons (medium enemies = the limb lesson; hangar unlock = the customization lesson).

## C. Boss/ace design (the action-economy problem)
- 3 player actions vs 1 boss action = the boss loses. Solutions: **paragon monsters** (multiple turns + HP pools in one body), D&D **Legendary Actions** (act at end of others' turns), XCOM 2 **Ruler Reactions** (act after nearly every soldier action — divisive, "anti-fun" risk).
- **Caution:** compensation that visibly breaks learned turn order feels unfair even when it fixes the math. Telegraphed, patterned extra actions read as fair; arbitrary interrupts read as cheating.
- **Epic ace recipe** [synthesis]: (a) 2 actions/round, NOT HP bloat (HP bloat = grind); (b) telegraph big moves one turn ahead (ItB philosophy — telegraphed enemies feel fair at any power); (c) phase change at 50% HP (new puzzle, not longer puzzle); (d) triggered taunts (earned, not random); (e) 1–2 adds max — the fight stays about the ace.

## D. AI difficulty levers (invisible → obvious)
- **Soren Johnson (Civ IV):** "A stronger AI with fewer handicap bonuses is preferable to a dummy AI that relies on ludicrous bonuses."
- **Hidden aim assists (XCOM 2, Solomon):** "a number of things that tweak that number in the player's favor at the lower difficulty settings" — cumulative bonuses after misses etc. **Invisible, highest-value lever for a solo dev.**
- **Top-N sampling** (our current lever): industry-standard cheap lever — pick among top-weighted options with noise.
- **Deliberate restraint** (Subset AMA): blacklist un-fun optimal moves (don't focus-fire the nearly-dead, don't camp spawns). "There's lots of un-fun things we discourage the AI from doing."
- **Targeting priorities** (Davis): "FTL and Into the Breach don't want the AI to 'try to win'... they just need the AI to provide enough resistance to make for interesting puzzles." Scoring weights = the AI's "personality" — biggest lever for how it FEELS.
- **Rule:** keep the AI's information and actions honest; cheat only in numbers and probabilities.

## E. Rubber-banding vs fixed (pro consensus)
- RE4: hidden dynamic difficulty (aggression, damage, drops) — **the secrecy is the point**; once players see the rubber band, victories feel unearned.
- L4D's AI Director = drama management, NOT difficulty adjustment (common design error to conflate).
- **Consensus:** most tactics games ship FIXED difficulty + hidden assists, not true DDA — rubber-banding undermines the genre's core promise (the puzzle is fair, your improvement is real).
- Solo-dev version [synthesis]: skip DDA. XCOM-model hidden assists per difficulty setting + explicit player-chosen modes (Fire Emblem model — cheapest, most respected).

## F. Playtest-driven balance (concrete numbers)
- **Riot balance framework:** nerf/buff bands per skill segment (avg play: >54.5%/<49%). Portable: set per-mission win-rate bands BEFORE playtesters arrive.
- **Slay the Spire (Mega Crit):** tracked pick-rate-when-offered + win-rate (3 → 90+ graphs); small frequent balance patches. The solo-dev template: instrument everything, patch in small batches.
- **Balance canaries:** 2–3 strong players find dominant strategies faster than telemetry ("they aren't afraid to tell us when cards suck").
- **Volume:** ItB relied on "excessive internal developer testing... lots of replays" — don't tune off 3 playthroughs. **200+ bot self-play sims per AI setting** = cheapest balance instrument (our enumerate→score→pick AI is deterministic-friendly).
- **Red-flag bands** [synthesis]: M1 first-try win <80%; median turns 2× design target (grind/turtle); weapon >70% pick rate (dominant); ace decided by turn 3 in >30% (trivial) or player wipe >60% (unfair).

## G. Common balance failures
1. **Snowballing:** "I knew I'd won/lost by turn X but had to play it out." Watch: M1 zero-damage win → M2 trivial via hangar snowball.
2. **Dominant strategies:** "Given the opportunity, players will optimize the fun out of a game" (Johnson [unverified attribution]). Spot via pick-rate extremes — if one weapon/build wins everything, the hangar is decoration.
3. **Difficulty cliffs:** win-rate delta >30pts between missions. Fix: one new pressure per mission, never two.
4. **Grind/HP bloat:** high win rate + high turn count = bored. Fix: fewer HP, more actions, phase changes.
5. **False difficulty/RNG spikes:** losses cluster on low-probability events; players say "unfair" not "hard." Counter: tune the FEEL of randomness (hidden assists).

## Applied to Mecha Protocol (implement-immediately, this round)
- **Ace rework:** 2× HP → 1.4× (no HP bloat); **2 actions/round** (acts twice in enemy phase); **phase change at 50% torso HP** ("VEX ADAPTS — WEAPONS OVERDRIVE", +1 damage, new taunt); big moves telegraphed via existing intent lines (ItB fairness rule).
- **Difficulty modes** (Fire Emblem model): STORY / NORMAL / HARD select on briefing screen. Affects AI top-N sampling (5/3/1) + hidden player accuracy nudge (+10/0/−5, XCOM model). Persisted.
- **M1 scope:** teaches move + attack + heat only (limbs/hangar are M2's lessons) — already matches mission design.
- Bot-sim balance runs (200+ sims/setting) → next build task.

## H. Sources
gamedeveloper.com (Bycer XCOM deep dive; Solomon randomness 2016; Slay the Spire telemetry 2018) · vulture.com (Davis ItB interview 2018) · nintendo.co.uk Iwata Asks (FE Awakening) · eurogamer.net (Miyamoto 1-1, 2015) · coinsandscrolls.blogspot.com (boss action economy 2018) · theangrygm.com (paragon monsters 2015) · reddit.com/r/pcgaming (Subset AMA 2022) · developer.valvesoftware.com (L4D AI Director) · leagueoflegends.com (Riot balance framework 2019) · pcgamesn.com (StS streamers 2019) · code.tutsplus.com (snowball effect 2014) · designer-notes.com (Soren Johnson) · cbr.com (RE4 DDA 2022)
