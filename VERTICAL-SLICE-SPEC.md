# Mecha Protocol — Vertical Slice Spec (Phase 3)
**Status:** DRAFT for El Loko review — no building until approved.
**Date:** Thu 2026-10-15 · **Authorization:** Aldo "Get it done" (2026-10-14 10:40 EDT, via main chat)
**Gate doc:** GATE-ZERO.md · **Plan:** BUILD-PLAN.md (in build/)

## 1. Slice definition
ONE mission at final quality: **M3 — the VEX duel**. Art locked, sound locked, juice locked.
This is a PRODUCTION slice (Ismail): it proves we CAN build the game, not whether it's fun (that's the prototype gate, still Aldo's call).

## 2. What's IN (final quality)
- **Combat:** 3v3 grid, per-limb damage (6 limbs, destruction = functional loss), limb-break thresholds drive VEX de-escalation
- **Heat:** pattern chevrons + redundant text channel; 70% +1/-1; 100% shutdown; adaptive just-in-time tip (2nd overheat)
- **Intent telegraphs:** closed glyph grammar (≤7 forms, shape+color), intent bar, answerability gate (every attack has ≥1 counterplay), ladder Story=FULL / Normal=PARTIAL / Hard=NONE
- **VEX ace:** 2 actions/round, phase 2, taunt=tell, cooldown-driven AI, memory counters (3–5), focus-fire cap (max 2/round), teach-one-move-per-encounter
- **Pilot barks:** 8 triggers, per-trigger cooldowns, archetypes (Ace/Rookie/Veteran, Avellone method), density rule (≥2 payloads, ≤12 words), VEX milestones as radio-chatter legend
- **Audio:** deploy silence (menu→silence→battle on lock-in), SFX pitch variation (±1 semitone), state pairs, GainNode buses, music ducks under barks
- **Feel:** 120ms/event ceiling, Sakurai hit-stop (40ms light / 80ms crit, no AoE), shake tiers + reduce-motion, ItB snappy (instant cursor, clarity-first)
- **Difficulty:** no-stigma assists ("Tune the challenge"), Rewind charges (Story ∞ / Normal 3 / Hard 0–1), invisible DDA (attacker cap, miss pity), 3-death assist prompt, TRUE hit chances
- **A11y:** ≤5 choices/screen, 44×44pt targets, 0.5s post-acceptance delay, single-tap only, no timed inputs, pattern chevrons (not color-only), thumb-zone controls
- **Tutorial:** invisible-first (affordance + skill gate), coach marks as fallback (≤8 words, 2-dismiss shut-off, recallable)
- **i18n:** EN + JA (189 keys), Crowdin Free plan ready, glossary seeded before opening
- **Telemetry:** first-launch consent, minimal event taxonomy, per-encounter difficulty events (deaths, turns, heat deaths, rewinds, quits)

## 3. What's OUT (deferred to production)
Missions 1–2 content, full hangar (M3 bottom-sheet picker ships; full two-axis UI ships per HANGAR-SPEC), Daily Sortie playable, Commander Edition, Supporter Pack sale, Steam, server leaderboards/seasons, trailer, mod browser UI (spec only), JA native-speaker pass.

## 4. 75-20-5 quality tiering
- **5% peaks (max):** per-limb damage feedback, heat chevrons, combat responsiveness, pilot barks, VEX duel feel
- **75% valleys (good-enough):** hangar chrome, menus, non-slice systems
- **20% good:** everything else
- Stop polishing when the 5 gate questions are answerable without apologies.

## 5. The 5 gate questions (pass/fail)
1. Fun after novelty? (Aldo's "is it fun?" — measurable per BUILD-PLAN.md)
2. Content velocity? (2nd mission encounter faster than 1st — else pipeline FAILED)
3. Performance? (iPhone 17 + desktop, 60fps, <100ms input, 120ms/event)
4. Unit cost? (build-hour log → total × 1.3 margin)
5. Delivery? (itch.io web build, zero backend, eternal-build compliant)

## 6. Risk register
- 2nd mission ≥ 1st → pipeline FAILED → rescope or kill
- Combat not fun at final quality → KILL (cheapest option)
- Unit cost × 2 × 1.3 > runway → RESCOPE or KILL
- iPhone perf < 60fps → fix or cut scope
- GREEN / YELLOW / RED are EQUAL outcomes. No hero mode (invalidates velocity data).

## 7. Build-hour log (the primary instrument)
- Log every hour from day 1, tagged per system.
- Time mission 1 build honestly → build 2nd encounter with same tooling → 2nd time = unit cost.
- Extrapolate: unit × 2 remaining missions × archetype multiplier × 1.3 = production estimate.

## 8. Validation plan
- **Feel:** juice-off test, pick-a-feeling-first, juice A/B (target medium-high)
- **Barks:** purpose review, telemetry spam audit, state-match sampling
- **Intent:** ISO-9186 glyph comprehension, RITE (fix after 1, stop after 6 clean)
- **Difficulty:** 5–10 players, silent observation, median/p90 (median 12–18 turns, p90 ≤2 rewinds)
- **Tutorial:** 3 rounds × 5 fresh players, Hopson mid-mission prompts, tip→action funnel
- **Audio:** mute-rate telemetry (<5%), nuisance-count top-5, iPhone speaker fatigue test
- **AI:** headless sim per (mission × difficulty × archetype), per-cluster win rates (never global average)
- **A11y:** 5–8 players with impairments, separate pool, APX deck checklist

## 9. Schedule
8–10 weeks, sustainable solo pace. Week ~4: repeatability check (2nd encounter signal). Week 8–10: written GREEN/YELLOW/RED verdict. Deliverable = the DECISION + cost math, not just the playable mission.

## 10. Needs from El Loko (review)
1. Approve scope IN/OUT — anything to move?
2. Approve the 5 gate questions + kill triggers as written?
3. Greenlight to start the build-hour log and week-1 pillar work?
