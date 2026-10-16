# Enemy AI — Production Spec (Round 74)
**Status:** DEFERRED to production AI pass. Current AI (ai.js) matches the shipped ItB pattern — one brain, enumerate→score→pick, difficulty = optimality knob. No prototype changes needed.

## Current state (verified)
- One scorer, all difficulties. Easy = pick among top 5, Normal = top 3, Hard = best (ItB's non-optimality knob, exact mechanism).
- Flat additive weights: expected damage, finishing bonus, focus fire (difficulty-scaled), heat discipline, VEX phase-2 aggression.
- No future-state simulation (Wargroove snappiness tradeoff). Re-run per activation.

## Production refinements
1. **Response curves:** shape considerations with sigmoid (heat), exponential (kill-confirms), not just linear weights.
2. **Anti-repetition:** negatively weight repeated positions/targets (ItB's Scorpion) — keeps behavior varied without smarts.
3. **Veto-by-multiplication:** hard constraints (negative location = kill candidate) via multiplication, not just additive penalties.
4. **Per-archetype weights:** FE/AW-style ×0/×1/×2 multipliers per factor per archetype.

## VEX ace (counter-pool utility AI)
- Per-factor multipliers (×2 lowest-integrity limb, ×0 friendly-fire risk).
- Anti-repetition + threat map (per-tile player damage potential, decay) for retreats.
- No lookahead, no player modeling beyond last N turns.

## Difficulty (XCOM 2 recipe — never smarter AI)
- Enemy count/mix, stat tables, spawn cadence, turn-pressure timers, hidden easy-mode nudge.
- One brain, tuned numbers.

## Cheat discipline
- ALLOWED: resource/precision sliders (spawn, HP, damage, optimality probability).
- BANNED: information cheats (fog/cover/input reading), felt rubber-banding.
- Every hard AI choice visible in the telegraph layer.

## Round 161: Jam AI + validation spec (slice)
**JAM AI DECISION: freeze the AI, tune only numbers.**
- 5-archetype utility AI + weight vectors + intent telegraphs stay exactly as architected.
- No new AI techniques during the 72h jam. Difficulty from numbers, never new behaviors.

**PRIORITY-PICK DIAL (IMPLEMENTED in ai.js):**
- P(pick best-scored action): easy 0.3, normal 0.7, hard 1.0.
- Suboptimal pick = random legal non-best action (FTL's "random room").
- Replaces top-N pick (strictly more tunable). Focus-fire cap (Round 125) retained.
- One number per difficulty = the whole difficulty system. No cheating, no hidden info.

**VALIDATION (pre-jam):**
- Bot ladder: headless AI-vs-AI (greedy/random player vs archetype mixes), seeded.
- Log: win rate, avg turns, focus-fire rate, per-archetype damage.
- Targets: no archetype >60% win on easy; AI clear time near design target.

**FAIRNESS CONTRACT:** telegraph everything; VEX taunts only off telegraphed intents;
show odds where RNG exists. No invisible cheats — scale composition/weights visibly.
The one sanctioned lie: round displayed odds in the player's favor (Civ Rev precedent).
