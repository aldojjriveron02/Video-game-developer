# Narrative Part 16 (Final Lock) — Findings (Round 255)
**Date:** Wed 2026-10-15 ~00:58 EDT · **Source:** live web research (beaulieu, mikkelson, slabinski, kasavin, wolpaw, xuelder, pangea)
**Project:** Mecha Protocol — narrative (pre-jam; final lock)

## A. Mechanics
- Voice-bible check (Mikkelson): "paint personalities" — distinct types behind each voice or "a town full of people who talk the same." Quirks subtle (barks are repeatable). For VEX: each ladder rung (arrogant/rattled/beaten) needs written-down voice rules (diction, sentence length, what he NEVER says); every line checked against rules, not vibes.
- No-name-tag test (Slabinski "Character above all else"): dialogue must be emotional and characterful, never "static, clinical" plot delivery. Strip tags from all 106 lines, shuffle, second person identifies speaker + VEX rung per line. Failures cut/rewritten. Xuelder: define nouns, verbs, characters first — every line serves a known voice.
- AI-line read-aloud (Wolpaw/Valve via Navarro): writers "write all the dialogue, record it, cut it ourselves and wire it into the game" — self-recording IS the writing process. Bender: "Read your dialogue aloud — if it sounds unnatural, rewrite it." Slabinski concision: cut ~62 words of throat-clearing to ~20 — the pass should HALVE line lengths. Mikkelson: "Just write. Even the bad ideas." — volume first, read-aloud is the cut filter.

## B. Validation
- 3-player one-shot (Wolpaw: "playtest early, and playtest often" — including non-gamers). Three fresh players, one full session each: does VEX's ladder read correctly uncoached? Does each rung land on distinct players, not just the writer?
- Quote check (Kasavin/Hades via Notis 2026): "so much of the dialogue never repeats" — only a few DELIBERATE recurring anchors (Zagreus's "In the name of Hades, Olympus, I accept this message" — kept intentionally). Validation question: which lines are SUPPOSED to be quotable anchors vs one-shot texture? A player-quoted line should be a deliberate anchor, not a trigger-firing-too-often accident.
- Skip test (Mikkelson): barks are "possibly the clearest and easiest tool" to tell players what to do — so flip it: all lines skipped/muted, do goals + VEX's state remain legible? Critical escalation beats must be carried by GAME STATE, never one skippable line. Skipping must never cause trigger pile-up when un-skipped.

## C. Techniques
- Briefing discipline (Xuelder, NarraScope jam): "Figure out the mechanics/hook first, then write the narrative to emphasize the mechanic." Cap: "Keep it under 5000 words max." Every bark serves the ladder or a gameplay aid; lines serving neither are cut regardless of quality.
- Escalation verification (Portal/GLaDOS precedent): GLaDOS written "a good bit meaner," rewritten after feedback (McLain "nervous about reading some of the stuff"). Define each rung's entry/exit as GAME STATE (not vibes); play full sessions; check against fresh-player reactions — does "rattled" read as rattled to someone who didn't write it? Regression test: a rung never fires out of order or regresses without designed cause.
- Content lock (Pangea): late narrative changes = "one of the most expensive and avoidable mistakes a studio can make." Jam analog: after read-aloud pass, text FROZEN. Any edit — even one word — restarts read-aloud + no-name-tag for affected lines. No exceptions in final 48h.

## D. What to avoid
- Post-voice-pass rewrites: in production, script changes after VO recording are "notoriously expensive" — the recording IS the lock. Our read-aloud pass = the voice pass. Editing after without re-verification = same anti-pattern at jam scale.
- Lore dumps (Slabinski "Treachery of Forced Lore"): "Being forced to listen to lore is usually only a step up from listening to a professor." Lore = garnish, not the dish. VEX's backstory in implied texture, never expository bark.
- Untested trigger frequencies (Slabinski/Redding GDC 2009): "Always be aware of the purpose of your barks"; "Bark writing is deceptively hard" — not a crutch for visual storytelling. Hades' answer: track heard lines, prioritize unheard. Ours: cooldowns/recency/verbosity — verified against real fire logs.
- New lines after lock (Xuelder): bypasses voice-bible + no-name-tag + read-aloud — all three. If worth adding, worth re-running all three; usually isn't.

## E. Shipped
- Portal (Valve 2007): GLaDOS's arc = textbook arrogant→rattled→beaten, reactive, state-driven, playtested and retuned (rewritten less mean). Direct VEX model: rungs keyed to game state, verified against fresh players.
- SUPERHOT (7DFPS jam 2013; 2M+ copies): narrative = handful of terse terminal texts + "SUPER HOT" refrain. Story never outgrows the mechanic — Xuelder's rule in shipped form. Minimal text + strong refrain > volume.
- Thomas Was Alone (personal jam 2010): one disciplined narrator voice, short lines, personality = movement ability. One voice done perfectly > ensemble done thinly.
- Hades (honorable mention): track-heard/prioritize-unheard + deliberate anchors = the playback gold standard (Kasavin 2026).

## Implemented this round
- **Verified (code read, no changes — pre-lock):** NO PILE-UP POSSIBLE — `if (v === 'off') return;` fires BEFORE the cooldown gate sets _lastTime (barks.js:89). Skipped/muted barks leave zero timestamp residue; fire-and-forget, no queue. Skipping can never pile up.
- **Verified:** NO LADDER REGRESSION — _phase2warned set once; phase2 is one-way (game.js:818-819: warned → true, never reverts). Ladder only moves forward.
- **NARRATIVE-SPEC.md:** final-lock discipline — (1) no-name-tag on all 106 (second person identifies speaker + rung); (2) AI read-aloud as self-recording (Valve-style; halve lengths; this pass = the lock); (3) ladder verified across full sessions + 3-player one-shot (Portal precedent); (4) trigger audit from telemetry (Hades rule: exhaust variety before repeating; over-firing = tuning bug); (5) skip test (beats carried by game state; no pile-up — verified); (6) content lock after read-aloud (any edit restarts both checks; Pangea discipline).
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
beaulieu · mikkelson · slabinski · kasavin · wolpaw · xuelder · pangea · portal · superhot
