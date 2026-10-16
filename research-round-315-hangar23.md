# Hangar Part 23 (Verification Round 6) — Findings (Round 315)
**Date:** Wed 2026-10-15 ~06:39 EDT · **Source:** live web research (schreiber, riot, valve, critical-gaming)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 6)

## A. Mechanics
- Choice audit (Schreiber): "dominated choices as a balance defect to be deleted." "Eliminating dominated choices outright." Pairwise dominance per mission class — strictly-worse-on-every-axis = fake choice, redesign or remove.
- Label audit (Critical-Gaming): choices must be "not equally attractive," "informed," with "no 'clearly better' option." Every ◆ + recWhy must pass truthfulness — does recWhy describe actual mission conditions the player can verify in-game?
- Balance audit (Schreiber; Riot): "decide ahead of time what they want measured; pick-rate correlated with win-rate is a standard quantitative balance signal." Riot: "Presence = pick rate + ban rate," per-audience bands (Average/Skilled/Elite/Pro). "Don't punish popularity — high pick-rate alone is not proof of overpowered, it may just be fun."

## B. Validation
- Playtest sorting (Valve/Ambinder): "we see our game designs as hypotheses and our playtests as experiments." "Start playtesting as soon as we have something playable." "Match the right methodology to the desired form of data." Preset system = hypothesis; experiment = observing new players in the hangar.
- Pick-rate analysis (Riot): track Presence per tier; flag over-present and under-present. "~0% picks on a mission where it should be viable = failed choice." "Picked everywhere = dominant-strategy ship-blocker."
- New-player comprehension (Valve): watch fresh player read ◆/★ + recWhy, ask them to explain back ("why is Skirmisher optimal here?"). "The choice must be understood before it can be informed." Record: misread labels, ignored recWhy, default confusion.

## C. Techniques
- Curated defaults: "the preselected option carries most first-time players." ★ must be "genuinely survivable, forgiving — the one a player who never opens the hangar would still clear early missions with." Visually preselected; indecision defaults to safety, not a trap.
- Honest labels (Gotham City Impostors): "'Fun Facts' panel on each loadout describing its playstyle role in plain language." Every label states what the preset does and doesn't do, in mission terms, no marketing fluff.
- Mission-grounded recommendations: ◆ "computed/justified from the upcoming mission's parameters (enemy mix, terrain, objective)." recWhy names them: "optimal because this mission is close-quarters" — never "best preset." Context-conditional, never global.
- No false choices (Schreiber; Critical-Gaming): "the three presets must be intransitive across mission classes (rock-paper-scissors, not a ladder). Any preset never ◆ on any mission class is a fake choice."

## D. What to avoid
- Tier-list implications: "Never present presets as S/A/B-ranked, 'best,' or absolutely ordered." Riot's skill-tiered framework: "an option can be dominant at one skill band and weak at another, so any global ranking is false." recWhy always conditional ("for this mission"), never absolute.
- Fake choices: "A preset that loses on every axis is worse than no choice — it punishes experimentation and teaches players to distrust the hangar."
- Unexplained recommendations: "A ◆ with no recWhy is an uninformed choice. The explanation is the feature, not the badge."
- Analysis paralysis (Chou): "Hick's law vs choice overload." "Three presets with honest, differentiated labels sit well under the overload threshold." "Keep exactly three, sharply differentiated, honestly labeled."

## E. Shipped
- The Division 2: "up to 12 saved loadout slots." "Switching builds is one menu action; slots organized around mission context (solo vs group)." Lesson: frictionless switching, context-organized.
- Risk of Rain 2: survivor loadouts — "every variant is honestly described and swappable without cost, so players experiment freely." Lesson: honest descriptions beat a single "best" recommendation.
- Gotham City Impostors: "'Fun Facts' panel describing intended playstyle and role." Lesson: "plain-language role labels are the cheapest comprehension win in preset UX."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** choice audit passes. Brawler recFor M1 ("M1 is close-quarters — wins at range 1-2"); Skirmisher recFor M2 ("M2 is open ground — speed decides it"); Bulwark recFor M3 ("M3 is the VEX duel — survive ~2 extra hits"). Each preset is ◆ on exactly one mission — intransitive across mission classes, no dominated choices. ★ safe default = Bulwark (recommended:true, "Safest first pick"). recWhy mission-conditional, never absolute. Descriptions honest with weaknesses stated.
- **HANGAR-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
schreiber · riot · valve · critical-gaming · division 2 · risk of rain 2 · gotham city impostors
