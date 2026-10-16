# VEX — Ace Design Spec (Round 66)
**Status:** M3 prototype exists (ace, 2 actions/round, phase2, duelist, heat weakness, taunts). Multi-component boss + 3-encounter arc DEFERRED to vertical slice. This spec is the build target.

## Identity
- Masked rival ace (Char lineage). Silhouette-distinct mech. Frame visibly derives from the player's chassis family (Grahf mirror).
- Defining trait: never lost a component without taking two back (Yellow 13 lineage).

## Three-encounter arc
- M1: cameo — seen at range, one scripted signature move, withdraws (Sabbagh "behavior outside combat").
- M2: first skirmish, false victory — VEX loses one component, retreats (Stout beat 5: the "first phase sacrifice").
- M3: full multi-phase duel. Each rematch needs an in-fiction rebuild reason.

## Multi-component = phase system
- Each limb is a targetable component. Component destruction unlocks phases (no HP bloat).
- 3 stages; each adds attacks, not health. Shed component → shockwave + bark + HUD banner (phase telegraph).
- Defenses: repositioning, heat-venting. NEVER breaks grid/AP/heat rules (the FTL trap).

## Ace AI (Nemesis-lite)
- Track player's most-used tactic per mission; switch to counter-pool ONCE per mission ("the dance").
- Fixed-pattern openers (learnable) + random-pool later phases.
- Every attack telegraphed on 3 channels: grid pattern + sound + HUD banner.
- Stun/knock-out windows after big attacks (counterplay).

## Barks (Vois rules)
- Info vs personality SEPARATED. Warnings: actionable info first, duration-budgeted.
- Personality triggers on PLAYER actions: overheat ✓ (implemented R66), component destroyed ✓ (implemented R66), kill, phase2, death.
- 3–6 variants/trigger, cooldowns, priority, reference passage for VEX's voice.
- Pilots react to VEX (callbacks sell the rivalry).

## M3 = graduation test
- Recombines M1–M2 mechanics (heat, limb targeting, positioning, all 5 archetypes as escorts).
- Twist = composition, not new rules (ItB model).

## Calibration
- Telemetry: player DPS/skill distribution at M2 → tune M3 phases to median.
- Difficulty modes shift telegraph clarity + counter aggression, not raw stats.
- Playtest question: "did players feel the dance?" Instrument: adapted once, read telegraphs, sacrificed a component.

## Round 86 refinements (boss design research)
- **Taunt = tell (IMPLEMENTED):** phase-2 warning fires 1 turn BEFORE the shift lands. The taunt ("You cracked my armor...") is the telegraph; dmgBonus applies at the start of the ace's next turn. Psychonauts pattern — the boss yells its attack.
- **Phase 2 = new puzzle (slice):** not just +1 damage. Options: drops ranged for heat-generating melee/charge; vents heat to zero but must stay stationary 1 turn (exploitable); summons 2 VEX drone adds (Grey Crow — turnable against the ace).
- **Chosen memory (slice):** ace adapts between encounters (beat with heat → heat-resistant plating); one randomized strength/weakness per campaign; taunts reference prior fights; tangible reward per encounter; one off-map action between encounters.
- **Forbidden list:** no one-shot without 1-turn visible telegraph + counterplay; heat slows/taxes, never denies a turn; phase 2 preserves ≥2 valid strategies; presentation reuses existing VFX/audio; encounter 2 opens like encounter 1, then breaks pattern (Sylas trick).

## Round 100: Memory counters (Chosen pattern, production VEX pass)
**Persist 3–5 counters between fights:**
- Dominant damage type used (heat/kinetic/explosive)
- Limbs destroyed (which ones)
- Turtled? (defensive play flag)

**VEX adapts:**
- If player alpha-struck with heat → phase 2 gains heat sinks
- If sniped limbs → VEX plates that limb
- Reference in taunts: "You took my left arm last time. I plated it."

**Between-fight pressure:**
- After Encounter 1, briefing warns of specific counter in Encounter 2
- One line of text + one loadout swap = Nemesis dread at zero art cost

**Phase 2 = new puzzle (never fresh HP):**
- Cap 2 phases. Must change target priority, positioning, OR resource math.
- No full-HP resets. Destructible-and-partial only.

## Round 108: De-escalation + phase UI (production boss pass)
**Limb = phase (De-escalation model, Xenoblade X):**
- Every VEX limb destroyed REMOVES its attached attacks.
- Phase-shift event on UI: banner + bark + hit-stop + telemetry (part_break).
- Broken limb = progress kept (never refilled).

**Phase UI:**
- One continuous HP bar with threshold ticks at 66%/33%.
- Transitions trigger AT threshold, NEVER at zero HP.
- Each transition: name-change banner ("VEX // PHASE 2: ...") + micro-pause + visual escalation + unique bark.
- No HP refills between phases. Banner/ticks not color-only (a11y).

**3-encounter arc (discard-and-draw):**
- E1: teaches tell language (taunt=tell).
- E2: drops phase-1 moves, gains memory counters (visible ADAPTED states).
- E3: opens identically to E1 (Sylas Nightmare), then diverges to final exam.

**Scope guardrails:**
- 2 phases max. ~3 new attacks per phase max.
- Memory as ADAPTED states (player-visible, not hidden AI).

## Round 120: Production boss spec (boss design part 3)
**De-escalation engine (per-limb damage):**
- Phase transitions = limb-break thresholds (not HP %).
- Destroying a limb REMOVES its attacks (visible, legible, earned).
- Phase UI announces what was lost ("VEX lost left cannon — barrage disabled").
- Fixes anticlimax: weaker phase reads as damage, not arbitrary tuning.

**VEX AI (cooldowns, not hidden resource):**
- Boss moves run on cooldowns (Boss Saga pattern — predictable, readable).
- Telegraph in the SAME chevron language the player reads.
- NEVER immune to heat or limb damage (Bycer's rule-breaking trap).

**Teach-one-move-per-encounter (3-encounter arc):**
- E1: showcase signature move (survive/escape). E2: evolve it (speed/range) + arena change. E3: cumulative exam.
- Validation metric: "~3 attempts to memorize a telegraphed move" (Yu-kai Chou).
- Telemetry: phase reach rate, attempts/phase, killing attacks, quit rate/phase.

**Brief and tactics-native:**
- One health bar per encounter. No reflex demands.
- Reward hangar loadout + grid positioning (tactics boss, not twitch).
- Mirrored trick: cooler-jacket version of a player system (Design Doc rival).

**Budget (Costa):**
- 5-6 playtest iterations for VEX. Prototype to 70-80% before polish.
- Slice = ONE duel boss on existing archetype chassis. No ambition creep.

## Round 129: Production VEX spec (M3 duel)
**Phase gates on LIMB-BREAK EVENTS (IMPLEMENTED):**
- Phase 2 warning fires on FIRST limb break (any limb), not torso HP ≤ 50%.
- Anti-HP-sponge: phases are events, not thresholds.
- Each break = Stout midpoint beat (wound state + breather + evolution).

**Mirror-moveset duel (Badeline model):**
- VEX fields same weapon families as player (rifle/cannon/blade/missiles).
- Telegraphs mirror player's own UI — readable because player knows their kit.
- Bayonetta fairness: same rules, "a little better."

**De-escalation ending:**
- Final phase = concession/stand-down (Krauser model), not cheap desperation.
- Stout kill-sequence: visible defeat moment even when boss exits.

**Iteration budget (Costa):**
- 2-6 full iterations on the VEX duel. Log each in BUILD-HOURS.md.
- Iter 1: readable tells. Iter 2: phase-transition clarity. Iter 3+: telemetry tuning.

**Telemetry:**
- Per-attempt phase reached, attempt counts, win rate, damage per limb per phase.
- Flow channel: if players stall at same phase → telegraph bug (Morgana lesson), not numbers.

## Round 137: Production AI spec (slice)
**Archetypes as weight vectors (IMPLEMENTED in ai.js):**
- charger: dmg 2.6, cover 0.0, self 0.4 (XCOM melee — ignores cover).
- skirmisher: dmg 1.8, cover 0.5, self 1.0.
- holder: dmg 1.6, cover 1.0, self 1.2 (XCOM elite — position for max damage).
- duelist: dmg 2.0, cover 0.2, self 0.8.
- Enraged (VEX phase 2) forces charger weights.

**Anti-cheat posture:**
- Non-omniscient by construction: no build peeking, no multi-turn lookahead.
- All tuning in transparent systems (difficulty modes, weights, telegraphed intents).
- Hidden bonuses favor PLAYER only; top difficulty verifiably bonus-free.

**Validation (Gate Zero):**
- Seeded Monte Carlo, N≈1000 per (archetype × skill) cluster.
- Win rate with CI per cluster; pre-commit acceptance bands.
- Dead-action detector + stalemate gate FIRST (hard gates).
- Distinctiveness audit: action-distribution divergence per archetype.

**Perception budget:** readability (intents, barks, exploitable targeting) > deeper search.
