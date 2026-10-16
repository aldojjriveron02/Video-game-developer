# Mecha Tactics Design Research — Findings (Round 1)
**Date:** Tue 2026-10-13 ~19:35 EDT · **Source:** live web research, all claims sourced below
**Project:** Mecha Strategy Game (concept phase) · **Constraint:** $0 budget

## A. Combat design patterns (what works)

**BattleTech (Harebrained Schemes, 2018)** — phase-based alternating initiative: light mechs act before heavies; melee/knockdowns reduce enemy initiative. Evasion pips built by moving. Heat is the universal throttle (~30 dissipated/turn; full bar = shutdown) — weapons balanced by heat-per-alpha, not just damage. Called shots and knockdowns enable "surgical" play.
Sources: designer kiva's Medium series; Steam community guide; Paradox forums.

**Front Mission** — grid, player/enemy phases; signature hook is **per-part targeting**: wanzers destroyed piece by piece (body, arms, legs); a destroyed arm disables its weapon. Customization and damage are one system — your build is what the enemy takes apart.
Sources: frontmission.fandom.com/wiki/Wanzers; r/frontmission dev thread 2022.

**Super Robot Wars** — player/enemy phases; three defining systems: (a) automatic counterattacks (defense is active, battles feel like anime duels); (b) Spirit Commands — pilot abilities (accuracy/evasion boosts, heals, barriers) as the main burst resource; (c) Will/Morale — boosts all stats above a threshold, decays when idle, rewarding aggression.
Sources: super-robot-wars.fandom.com; lp-archive.org.

**Phantom Brigade (2023)** — hybrid timeline: plan orders on a visible timeline, watch them execute in real time. Prototype-weapon conceit shows enemy moves ahead (partial perfect information as the tactical core). Directional procedural damage — parts come off where you hit.
Source: en.wikipedia.org/wiki/Phantom_Brigade.

**Into the Breach (Subset Games, 2018)** — 8×8 grid, **deterministic combat (RNG removed entirely)**, fully telegraphed enemy attacks, 4–5-turn battles, objectives are buildings/civilians. Fun = a solvable puzzle with one undo. Cut to protect this: real-time pressure, complex action points, hit-percentage RNG.
Source: GDC 2019 "Design Postmortem — Lessons in Simplicity" (Matthew Davis).

**Battle Brothers systems** — continuous initiative turn order (no player/enemy split), fatigue as action currency, permanent injuries, morale interlocked with positioning/terrain/gear, contract/crisis campaign meta. Maps to mechs: chassis = body, parts = gear, pilots = mercenaries, heat = fatigue.
Source: battlebrothersgame.com Dev Blog #4.

## B. Customization systems that work

**Front Mission wanzer model (gold standard for "deep but legible")** — exactly 4 swappable parts (body, left arm, right arm, legs) + CPU + backpack. Body gives engine/power; total weight must stay within capacity; arms hold one weapon each (melee/short/long/missiles) + shield; backpacks add functions (jump, repair). Pilots learn skills from weapon experience — pilots and parts grow on parallel tracks. Because parts are individually destructible, every build choice is tactically readable.
Sources: frontmission.fandom.com; gaming.stackexchange.com; retrogames.cc.

**BattleTech mechlab** — three constraints make building a puzzle: tonnage (weight budget), hardpoint types (weapon class needs matching mount), heat (dissipation ~30/turn; alphas limited by the heat gauge, not cooldowns). Heat is the elegant master-constraint tying weapons, engines, and sinks into one budget.

**Phantom Brigade scavenging** — parts looted from fallen enemies; battle tactics (which parts you preserve vs. destroy) become customization decisions.

**Design principle (kiva):** constraints should serve the combat fantasy — players plan loadouts against the threat ahead. Front Mission's 4-part model beats BattleTech's granularity for a solo dev: fewer knobs, same emotional payoff. [synthesis]

## C. The fun core

- **kiva (BattleTech):** "the real meat is punching the arms off an enemy mech" — the visceral disassembly fantasy. Pilots are the attachment anchor: players invest in people, not metal; that's what makes loss sting. Every mission needs context (what's happening), options (multiple approaches), deadline (pressure).
- **Into the Breach (GDC):** fun = perfect-information puzzle combat — victories feel earned by foresight, never lost to dice.
- **Phantom Brigade:** the hook is fantasy fusion — tactical planning resolving into cinematic anime battle; future-sight makes planning itself the dopamine loop.
- **Reviewer verdicts:** Front Mission Evolved reviews converge on "no room for tactics" — its deep customization was judged "useless" once the tactical frame was removed. Customization without tactical stakes is decoration.
- **[Synthesis] The fun core = TACTICAL DISASSEMBLY (per-part destruction) + LEGIBLE INFORMATION (telegraphed attacks, visible trade-offs) + PILOT ATTACHMENT (invest in people, not metal).** Moment-to-moment hook: "I saw it coming, I built for it, I ripped its arm off."

## D. Indie scope realities

- **Subset Games (Into the Breach): 2 people.** Radical scope discipline: 8×8 grid, 3 mechs, 5-turn battles, no RNG. Cut everything but the core loop.
- **Phantom Brigade:** tiny indie studio → acquired mid-dev → ~6 years announce-to-ship. Single-player only, no multiplayer.
- **Dual Gear:** 5 devs, Unreal Engine, Front Mission-inspired → Early Access only, years later. Lesson: 3D + tiny team = very long runway.
- **Kriegsfront Tactics (Toge Productions):** dev since 2018; shipped a FREE Prologue on Steam (July 2024) to validate the market while full game still in dev. Lesson: ship a free vertical slice early as marketing + scope check.
- **Mech Tech:** solo dev, 7 years, Kickstarter March 2026, still pre-launch. Budget for marketing overhead, not just dev.
- **[Synthesis] Pattern: tiny teams shipped single-player-only, 4–6+ year runways, ruthless cuts. NONE shipped multiplayer at launch → the async/MMO-lite layer should be phase 2 at the earliest.**

## E. Failure patterns to avoid

1. **MechWarrior Tactics (directly cautionary — browser-based mecha tactics):** 1v1 online with hidden simultaneous orders + part customization; stuck in closed beta 2 years while selling paid Founder Packs; dev contract cancelled; publisher kept selling packs with no progress (scam accusations); rights sold in bankruptcy. Failures: multiplayer before the game works, monetizing a beta, team churn, no communication.
2. **Front Mission Evolved:** genre switch to third-person shooter destroyed the core audience; customization became "useless" without tactics.
3. **BattleTech self-critique (kiva):** reused maps + muddy objectives hurt the campaign — maps/missions aren't "free content." Small set of hand-tuned maps with clear context/options/deadlines beats procedural sprawl (critical for a solo dev).
4. **[Synthesis] Recurring failure shape:** (a) complexity without stakes — systems not connected to combat outcomes; (b) multiplayer-first sequencing — ship single-player first; (c) customization divorced from destruction — players care about builds because builds get shot off.

## F. Key implication for our plan
Single-player tactics FIRST (the proven indie path), async/MMO-lite as phase 2. The $0-budget question for phase 2 is still open — that's the next research round.

## G. Sources (all visited 2026-10-13)
- persenche.medium.com/the-design-philosophy-of-battletech-b17163718905 (Parts 1 & 3)
- youtube.com/watch?v=s_I07Iq_2XM (GDC 2019 Into the Breach postmortem)
- gamedeveloper.com/design/video-how-subset-games-designed-i-into-the-breach-i-
- en.wikipedia.org/wiki/Phantom_Brigade · /wiki/MechWarrior_Tactics
- frontmission.fandom.com/wiki/Wanzers · super-robot-wars.fandom.com/wiki/Spirit_Commands
- battlebrothersgame.com/dev-blog-4-battle-mechanics/
- steamcommunity.com/app/637090/discussions/0/1473095331413955391/
- metacritic.com/game/front-mission-evolved/ · reddit.com/r/indiegames/comments/1rx4x01/
- pcgamesn.com/into-the-breach/into-the-breach-advanced-edition-interview
Unverified: Tetragon Works exact headcount; Dual Gear current release state.
