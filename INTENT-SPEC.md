# Intent Telegraphs — Slice Spec (Round 67)
**Status:** DEFERRED to vertical slice (the slice's ONE deferred item). This spec is the build target. No prototype code.

## Thesis
Show every enemy's next attack as locked-in arrows + target tiles + one severity badge, computed once per enemy phase from the existing AI personalities. ItB's grammar, StS's icon discipline, detail wired to difficulty modes.

## Architecture
- `AI.decide()` → immutable `Intent{type, targetTiles[], magnitude{damage,heat,push}, effects[], sourceId}` → `IntentRenderer` reads Intents, never AI state.
- Recompute only on board-state changes (unit moved/died). Never re-roll during execution. Badges never flicker.
- A telegraph is a promise: the only legal mid-round change is a communicated reactive rule (target died → new target + re-telegraph + bark).

## Render grammar (phone-first, iPhone 17)
1. Threatened target tiles: red chevron/tint overlay on grid.js (never color-only — chevron shape + icon).
2. Thin arrow: attacker → primary target tile (re-aims as bodies move).
3. ONE badge on enemy sprite: icon = type; severity scales the glyph (chevron count 1–3 by damage band, StS dagger→scythe model). No raw numbers at a glance.
4. Tap/hover enemy → intent card: exact damage, heat, push direction, affected limbs.
5. Spawn telegraphs: ItB-style burrow markers one full turn early; body-block rules explicit in tutorial.
6. Bark channel: pilot one-liner when targeted ("Brace for impact!") — merges existing systems, zero new UI.
7. Accessibility: reduced-motion → static highlight (no pulse); respects reduced effects.

## Readability ladder → difficulty modes (Round 84 — telegraphs as the difficulty lever)
- Story: FULL intent (every enemy's action + exact damage + target tiles). The onboarding/access mode.
- Normal: PARTIAL intent (enemy intents shown, target tiles hidden except bosses/elites). The intended game — read intentions, predict tiles.
- Hard: NO intents — pure board-reading mastery. "Read the board like a master" is Hard's identity, not stat bloat.
- This is honest, learnable difficulty (ItB's information-based model): the player always knows why they lost.
- Difficulty becomes an information dial, not just stat scaling. A/B in playtests.

## "Unknown" intent
- All 5 archetypes: fully telegraphed. Reserve "?" badge for VEX phase-changes/enrage — the slice keeps one surprise.

## What NOT to build
- No paragraph move descriptions (StS's failed system).
- No intent re-rolls after player acts.
- No new numbers on the board at a glance.
- Clarity gates content: every future ability must be telegraph-readable; the Intent struct is the contract.

## Round 98: Glyph grammar (ItB pattern, production contract)
**Closed grammar (3 attack forms, distinct trajectory glyphs):**
- Direct/melee (adjacent tile) → ARROW glyph
- Projectile (straight line, first obstruction) → DOTTED LINE glyph  
- Artillery (any tile along line) → LOOPING ARC glyph

**Rule:** any attack that can't be drawn in this grammar gets REDESIGNED, not re-explained.

**Intent bar:** category glyph + exact damage number (Spire pattern). Hover/tap → animated tooltip showing the actual enemy unit performing the attack.

**One-status-per-tile:** a tile carries ONE effect max. No stacking.

**Readability ladder (degrade by removing layers, never by stacking):**
- Story = FULL: glyph + target tiles + exact numbers
- Normal = PARTIAL: glyph + number, targets hidden
- Hard = NONE: attack category only or "?"

**Mobile:** glyph must carry full meaning without hover (iPhone 17 tap-gated).

## Round 124: Production intent spec (intent telegraph part 2)
**Answerability gate (ItB rule):**
- EVERY telegraphed attack must have ≥1 counterplay (move, push, kill, block, vent).
- Information without counterplay = frustration, not fairness.
- Hard=NONE must NEVER produce unavoidable damage.
- Audit all 5 archetypes against this gate.

**Closed glyph grammar (≤7 forms, StS ceiling):**
- SHAPE encodes attack type. SIZE/BAND encodes damage tier.
- NEVER mint a new icon per enemy. Compose from the grammar.
- 7 damage bands (StS pattern): 0-4, 5-9, 10-14, 15-19, 20-24, 25-29, 30+.
- 13 intent types max (StS pattern).

**Ladder (visibility flag, StS semantics):**
- Story=FULL: type + target + exact damage.
- Normal=PARTIAL: type + target, damage banded (full hide for elites only).
- Hard=NONE: explicit compensated tradeoff (Runic Dome), never silent.

**Glyph validation (ISO 9186 + RITE):**
- Out-of-context comprehension test (3-judge majority correct).
- 5-second flash test (cheapest pre-RITE filter).
- RITE: fix after 1 user, stop after 6 clean.
- Confusion matrix for glyph pairs.
- Mobile pass on iPhone-17 viewport (glyph-without-hover).

**Shape + color (not color-only):**
- Wildermyth pattern: solid vs shattered (not just red).
- Lethal intents: stronger weight (size/pulse). Triage, not uniform.

## Round 138: Production intent spec (slice)
**Threat magnitude (IMPLEMENTED in game.js):**
- Intent carries expected damage (weapon dmg × hits × accuracy).
- Rendered as number next to ⚠ (StS: "intends to attack for 6 damage").
- Shape + number, never color alone (WCAG 1.4.1).

**Closed grammar (≤7 forms, Miller):**
- 5 archetypes → 1 base glyph each + Unknown + magnitude tiers.
- Instantly separable silhouettes at iPhone 17 sizes.

**Ladder (3 designed states):**
- FULL: persistent glyph + tap/hover exact detail (M3 duel).
- PARTIAL: archetype/severity only (higher difficulties).
- NONE: Unknown glyph. Audit for leaks (glows, barks, chevrons).

**Non-redundancy:** grid glyph = spatial threat; intent bar = triage ordering.

**Validation:** RITE (1-3 per iteration) + 5-sec test ("what is VEX about to do?") +
ISO 9186-lite (≥67% consensus). NN/g 4 criteria.

**ItB warning:** tune difficulty via enemy count/weight mix, NOT opacity.
