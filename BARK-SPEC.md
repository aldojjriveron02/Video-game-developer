# BARK-SPEC.md v1 — Production Barks (Slice)
**Date:** Thu 2026-10-15 · **Round 136** · **Status:** DRAFT for slice build

## Token layer (IMPLEMENTED in barks.js)
- `#self` → callsign (Ace/Rookie/Vet/VEX). `#mech` → mech name. `#mission` → M1/M2/M3.
- Signature diction at zero writing cost.

## Exclusionary conditionals (suppression table)
Priority (emphatic first):
1. Pilot-death bark suppresses ALL other barks that turn.
2. VEX taunt yields to pilot-death.
3. Limb-destroy suppresses heat-warning same turn.
4. Kill-cheer never fires on a turn a pilot/building was lost.

## Purpose check (Matejka 3 jobs + Avellone)
Every line must: (a) name its trigger, (b) give usable info, (c) be speakable only by its archetype.
Failing (b) = cut or rewrite (the "They're coming!" void).

## Variety budget
- High-frequency (move/attack): 3+ variants.
- Rare (death, mission end): 2 variants.
- Cooldowns = respeak floor (already in barks.js).
- Loop test: fire each trigger 10× — if it annoys, rewrite.

## Spam audit
- Telemetry flags any line >5% of bark volume per session → rewrite.
- Density rule: ≥2 of {event info, state info, character} in ≤12 words.

## Archetype diction warps (Avellone backstory→diction)
- Ace: clipped certainty. "Clean hit, #self."
- Rookie: questions/exclamations. "#self — did you SEE that?!"
- Veteran: dry understatement. "That's how you do it, #self."
- VEX: mirrors player tactics by name (Yellow 13 radio chatter).

## Validation (BATTLETECH recall test)
- After M3 playtest: ask players to quote a pilot. Unquotable = voice failed.
- In-game iteration until barks "feel correct" (Avellone/ITB).

## Round 149: Production bark spec (slice)
**Voice bible (IMPLEMENTED in barks.js as VOICE_BIBLE):**
- p0 ACE: clipped radio-procedure; brevity codes; never hedges; enemies = "targets".
- p1 ROOKIE: fast run-on; sim slang; mech by name (#mech); never bored.
- p2 VETERAN: slow dry; old-war idioms; gallows humor; never panics; enemies = "kids".
- VEX: two registers — legend (M1/M2, described-only) + observant (M3, references
  YOUR actions); never shouts/threatens directly; calls you "lance"/callsign.
- Existing taunts audited: all 4 pass the bible (no direct threats).

**Bark QA (every line, zero cost):**
- Matejka 3 jobs: responds to trigger? delivers info? reflects character?
- 4 tests: purpose (state the info) / loop (30× tolerable?) / recall (quotable?) /
  trigger (right context only?).
- Template: trigger, info, voice, tokens, verbosity gate, cooldown tier.

**Density:** ≥2 of {event info, state info, character} in ≤12 words (Redding triple-duty).
**Volume:** 5-10 keepers per trigger (Valve 80/20); A/B rotation on top of cooldowns.
**Never punish:** pilot barks ego-stroke after mistakes; VEX cruel about the MISSION,
never the PLAYER (Avellone Reset rule).

**LD60 72h bark sprint:** writers'-room (100 lines, keep 20%); stimulus-response
(answer the player's literal question in-voice); 10-word theme word-list per
character (ITB terminology discipline); temp VO day one; loop-test triggers
in-engine (trigger bugs > writing bugs).

## Round 160: Jam bark + validation spec (slice)
**JAM BARK DECISION: text barks only, ~40-60 lines total.**
- 3 pilots × ~8 combat barks (24) + ~12 VEX taunts + ~6 vexrumor + ~8 VEX-teacher ≈ 50.
- CUTS: no VO recording; no EN-dub expansion; any bark not bound to a trigger+cooldown.
- Jam-scale norm: 40-line $3 itch.io mech pack. ItB uses text quips (no full VO).

**STOP_ON_NONIDLE (IMPLEMENTED in barks.js):**
- Barks yield to high-intensity moments: if juice events/sec > 3, non-critical
  barks are suppressed. Critical (limblost, overheat, vexenter, allydown) always fire.
- Never stack voice over threat audio or the telegraph stinger (Valve rule).

**Existing guards (audited):** per-trigger cooldowns (1.5s/6s/15s); never-repeat-last-variant;
shown-set cycling; verbosity Off/Reduced/Full. Playback rules > more lines.

**VALIDATION:**
- Nuisance audit: play M3, count bark triggers per line, file top offenders as bugs.
- Mute correlation: mute-rate vs bark density (in-game mutes only — KiwasiGames caveat).
- Recall: did the VEX-teacher bark change next-turn behavior? (funnel instruments this)
- Annoyance: can the player ignore barks and still play? (ItB bar)

**TRAPS:** Skyrim repetition (guards); irrelevance (every bark informs or characterizes);
blocking (hang-and-fade, never modal); odd-sample (audit pools as units);
VEX cites visible state only (telegraph fairness contract).
