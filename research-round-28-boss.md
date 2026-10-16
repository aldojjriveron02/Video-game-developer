# Boss & Ace Design in Tactics Games — Findings (Round 28)
**Date:** Tue 2026-10-13 ~22:44 EDT · **Source:** live web research 2026-10-13 (GameDesignSkills, GamesIndustry.biz, XCOM wiki, IGN, hayao.dev ItB codex, Salivity, Arcane Eye/D&D)
**Project:** Mecha Protocol — the VEX finale, researched like a boss

## A. Boss anatomy
- 4 elements: Anticipation, Presentation, The Fight, Conclusion. 4 principles: Purpose (skill test / narrative beat), Theme (mechanics match story), Moveset (readable tells, distinct attacks, visuals match power), Escalation (phases).
- Boss = "a graduation test — has the player learned to master this type of gameplay?" (Mejerwall). Rules: every boss needs a weakness; 3 points of feedback for anything players must know; know min/maxes; no exploits.
- XCOM 2's Chosen: a boss as a recurring SYSTEM (3 personalities, invade missions, talk, persist) — not a stat block.
- Fire Emblem's Black Knight: the tactics rival template — unbeatable early, taunts mid-fight, escape always an option, dying line of respect ("I commend you"), story consequence.
- Through-line: identity + rules-change, not raw HP. VEX's kit (2 actions, 1.4× HP, 50% phase, taunts) already follows this.

## B. Phase design
- "Evolution over replacement" — Phase 2 modifies Phase 1 mechanics so mastery carries over. Pair transitions with arena/thematic shifts. Desperation phase: more aggression, readable patterns, no unfairness.
- **50% HP trigger = genre standard.** Critical rule: the transition turn is a FREE turn — announces and charges, never surprise-kills.
- Recovery window after every big attack — the player's reward for dodging.

## C. Telegraphs (the "one turn to get out of the way" vocabulary)
- ItB codex: perfect information — shown = resolved, no hidden rolls; telegraphs stored as directions (shoving rewrites outcomes); a winning line AND a do-nothing losing line must both exist.
- FFXIV vocabulary: cast bars (explicit countdown), ground indicators (exact damage zones), boss animations (arm raise, energy gather).
- Grid-portable: (1) intent one turn ahead w/ tile markers + damage ✅ (we have); (2) "charging" state w/ visible countdown for the signature nuke; (3) distinct visuals per attack tier.

## D. The Chosen (nemesis reference)
- 3 fixed identities; random strengths (Blast Shield, Kinetic Plating, Regeneration, Planewalker) + weaknesses (Shell-shocked, Groundling, Brittle, Bewildered; faction "Adversary" bonus); anti-degenerate rules.
- Invade uninvited (0% for 2 missions after encounter, 50% after); timers pause; resurrected at Citadel; daze/kidnap; Avenger-defense fail state; power creep; unique weapon drops.
- **Portable to a 3-mission prologue:** fixed personality + taunts, ONE signature strength + ONE discoverable weakness (Adversary → our reward draft delivers the counter), uninvited appearance, "adapt" revive beat. NOT portable: per-campaign randomization, kidnapping metagame, power creep.

## E. The rival ace (Char lineage)
- Char: boundary character (red, mask, charisma), mirrors the protagonist ideologically, rematches recontextualize, defined by ideology + desire — not just skill.
- Black Knight: recurring, unbeatable early, mid-fight taunts, escape option, dying respect line, story consequence.
- Rival recipe: distinct visual identity, signature move, event-keyed taunts, rematches w/ escalating stakes, final mutual respect. **VEX's "2 actions/round" should be NAMED in fiction** ("VEX doesn't wait its turn").
- Caution: Black Knight duel is RNG-dependent — feel-bad. Rival fights must be winnable through build/skill, not luck.

## F. Anti-frustration checklist
1. Every boss needs a weakness. 2. Tells match power (multi-sensory; hitboxes = damage zones). 3. Guaranteed recovery windows. 4. Perfect honesty (shown = resolved). 5. No surprise-kills on transitions. 6. Min/max + no exploits. 7. One-shots → cap + telegraph a turn early; RNG wipes → deterministic intent; immunity → resistance + weak windows; add-spam → cap + answerable.

## G. Multi-action bosses (D&D legendary actions)
- 3/round, usable at end of another creature's turn, costs 1–3, budgeted into Challenge Rating over 3 rounds. Rules: no recharge abilities, limit turn-stealing, mix effect types (damage + movement + utility); 2025 redesign = special abilities, not mundane attacks.
- **For VEX:** budget both actions into difficulty (2 × damage = real DPS); two actions DIFFERENT IN KIND (attack + reposition/utility/telegraph-setup); display both intents at round start; never both = same nuke.

## Applied to VEX (implement-immediately, this round)
1. **Legendary-action split** ✅ — ace's 2nd action is move-only (reposition/utility), never a double nuke. Verified: 0 attacks in 20 trials. (Design note: with the split, there's no second attack intent to telegraph — the reposition is visible when it happens; no hidden damage.)
2. **Discoverable weakness** ✅ — VEX overclocks: maxHeat 10→8, so heat-as-bet punishes it (hot = +1 taken). Named in M3 briefing intel: "VEX doesn't wait its turn — it acts twice every round, but never the same strike twice. And it overclocks — it runs HOT."
3. **Min/max verified** ✅ — worst phase-2 hit (blade 6 + 1 + hot 1 = 8) < fresh player torso (10 HP). No one-shot possible.
4. Already satisfied: 50% transition happens on the player's turn (free reposition turn before powered attacks land); dying respect line ("You... actually did it. Impressive."); event-keyed taunts.
- **Backlog (vertical slice):** M2 VEX flyby (unbeatable teaser → finale rematch w/ history); "charging" telegraph state for a signature nuke; reward-draft anti-VEX counter loot.
- 1,793 lines, all syntax-clean.

## H. Sources
gamedesignskills.com (boss design) · gamesindustry.biz (Mejerwall) · xcom.fandom.com/wiki/The_Chosen · ign.com (Black Knight guide) · hayao.dev (ItB codex) · raids.com (FFXIV telegraphs) · salivity.github.io (multi-phase) · arcaneeye.com (D&D legendary actions) · note.com (Char analysis)
