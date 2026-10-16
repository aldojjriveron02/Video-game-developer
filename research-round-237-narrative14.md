# Narrative Part 14 (Game Narrative/Dialogue) — Findings (Round 237)
**Date:** Wed 2026-10-14 ~23:05 EDT · **Source:** live web research (vois, beaulieu, mikkelson, kasavin, bateman, walker)
**Project:** Mecha Protocol — narrative (FROZEN; verification only)

## A. Mechanics
- Bark canon (Vois Sep 2026): a bark communicates game state without stealing attention. Concise variants; emotional boundary per trigger; separate informational from personality lines; log frequency/urgency/overlap per trigger; silence is sometimes right. Variant counts: rare = 1 fixed; routine ~3; frequent ~6 — "if all six sound like the same joke, you have one idea wearing different words" (the pro zero-icon-duplicates rule). More lines do NOT fix excessive triggering — cooldowns/priority/recency are code.
- Beaulieu: barks are systemic dialogue — first job is to inform; done well they spread lore, characterize, carry "narrative potential" (evoke, don't tell). Characterization: how does THIS character say hello. A bark heard 100s of times becomes a Proust's madeleine — write accordingly.
- Voice matrices (Mikkelson): map personality types behind every voice or you get "a town full of people who talk the same." Subtle quirks, nothing over the top. Vois voice-bible: define normal energy + allowed range per trigger; keep a reference passage per character; compare new batches against it — validates our Vois-baseline discipline.
- Arrogant rival (GLaDOS case study): added to serve a mechanical need (Walker); "the result of playtesting." Design DNA: psychotic but funny and smart, "knows something real about the player" — taunts feel personal because observant, not generic. Hades' Theseus: context-aware (knows your weapons, past runs) — arrogance lands when it acknowledges the player specifically; escalates when forced to notice the player winning.
- Briefing (Bateman): mission briefing = "most egregious example" of stopping gameplay for story. Keep minimal, deliver through gameplay. Bastion: narrator REPLACED tutorials/cutscenes. Jam rule: one short briefing (who/where/stakes), everything else in barks.

## B. Validation
- No-name-tag test (Mikkelson; Vois): strip speaker names; if a line could belong to any of the 5, it fails.
- Bark audits (Vois): play realistic encounters with trigger logic ON (not a playlist); include repetitive behavior; write down exact line IDs that grate. Audit sheet: ID, character, trigger, text, intention, duration budget, approval.
- Zero icon-duplicates: Vois's "one idea wearing different words" test + Beaulieu's emotional-boundary rule — every variant occupies a distinct intention; duplicates pruned.
- Quote tests (Games User Research): comprehension checks (what's happening, why, what's next); appeal checks vs intended emotion; recruit from competitor set; do it early — narrative hardens fast. Portal proof: the antagonist emerged from playtesting.

## C. Techniques
- Cooldown/rotation (Vois): per-trigger cooldowns, priority on collision, avoid most-recent clip. Code, not copy — writer delivers implementation note (priorities, cooldowns, never-overlap lines) confirmed IN GAME.
- Contextual barks (Mikkelson triad): observation, positive reinforcement, negative reinforcement + gameplay aids. Bastion = purest shipped form.
- Vois baseline: reference passage per character; audition new batches against it for tone drift. Kasavin wrote Bastion's narrator around Logan Cunningham's strengths — reference performance is the anchor.
- Escalating rival (Hades GDC 2021): ~300k words / ~21k lines, state-tracking system, rarely repeats. Duel principle: taunts evolve with scoreline — arrogant winning, rattled losing, respectful-beat beaten. Theseus works because the game remembers.
- Brevity (Kasavin/Bastion): "a man of few words" — short expressions, rich meaning, comfortable pauses; every line has design constraints behind it. Vois: actionable info first, duration budget per trigger, test WHILE doing the action. Both converge on the 7-word instinct.

## D. What to avoid
- 5-second repeat (Skyrim "Never should have come here") — fix is implementation (cooldowns, pools, triggers), not more jokes.
- Same-voice cast (Mikkelson) — audit with no-name-tag test.
- Lore dump before gameplay (Bateman) — one short briefing, rest in-scene.
- Quips during tense moments — emotional-boundary violation is a design bug.
- AI dialogue with no human voice pass (Game Developer Sep 2025: devs "more worried than ever" about generative AI lowering quality). Vois: listen to every candidate; approve small representative set first. For our 36 AI lines, the voice pass is mandatory, not polish.
- Voiced-protagonist tradeoff (Kasavin GDC 2021): voiced protagonists multiply cost; jam-economical = voiced narrator/enemy + short functional unit barks (Bastion model).

## E. Shipped
- Hades (2020): Theseus = love-to-hate arrogant rival; contextual, state-tracked, rarely repeats. Player feels SEEN.
- Bastion (2011): reactive narration replacing tutorials/cutscenes; "man of few words"; story inside the action.
- Into the Breach (2018): Avellone's snippet-sized pilots — anxious Isaac (time reverse), optimistic Bethany (shield), veteran Ralph (double XP). Minimal lines, maximum personality — distinct perspectives, not more words.
- Portal (2007): GLaDOS born from playtesting; observant, personal, escalating taunts — the VEX template.

## Implemented this round
- **Verified escalation ladder (code read, no changes — FROZEN):** (1) arrogant opening — observant entrance taunts referencing player history (Round 147, XCOM Chosen cadence) + VEX signature line (Round 168, GLaDOS); (2) rattled midpoint — phase2 taunt on first component loss ("You cracked my armor. Now I stop holding back.") + per-limb reactions (Round 66); (3) beaten — defeat lines (70% AI / 30% original); (4) winning — victory/kill lines. Matches the Hades/Theseus escalation principle.
- **Verified playback system (code read):** per-trigger cooldowns (critical 1.5s / combat 6s / ambient 15s, Round 101); never-repeat-last-variant; shown-set rotation; verbosity control (Off/Reduced/Full, Round 90); stop_on_nonidle — suppresses non-critical barks when juice >3/sec (Round 160, Valve); token layer #self/#mech/#mission (Round 136, Avellone); BGM ducks under barks (Round 207). All Vois implementation-note items present.
- **NARRATIVE-SPEC.md:** no-name-tag voice-matrix test protocol (70 lines); AI voice-pass requirement (36 lines vs Vois baseline); escalation ladder documented; implementation note locked (cooldowns/priority/recency confirmed in game).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
vois · beaulieu · mikkelson · kasavin · bateman · walker · valve · supergiant
