# Narrative — Production Spec (Round 110)
**Spine:** A rookie lance earns its legend by surviving the ace who hunts them.

## Factions (one line each)
- **Player faction:** [TBD — needs Aldo's call on name/tone]
- **Enemy faction:** [TBD — needs Aldo's call]
- **VEX:** the ace. Not the faction — the face.

## 3-mission beats
- **M1 (Setup):** emotional anchor + inciting incident. VEX heard, not seen (barks name the call sign; motif plays).
- **M2 (Rising action):** complication + first VEX contact. Invincible encounter forces tactical concession. OR wound through proxy (Yellow 4 beat).
- **M3 (Climax):** the duel. Personal reckoning. VEX's motif scores the fight.

## Exposition budget
- Briefings: only what's needed for the next fight.
- Codex: all history, unlocked by creeping exposition.
- Barks: radio-chatter legend engine (VEX milestones, reputation).

## Rules
- Causal chaining: M2 references M1; M3 references both. Never reset.
- One tone across all 3 (lock it; Days of Ruin lesson).
- Unreliable narrators: briefings contradict codex. Same nouns, different verbs.
- Vocabulary discipline: lock term list (chevrons, call signs, faction names).
- Never pure evil / pure good (simplification trap).

## Round 135: Production narrative spec (M3 duel)
**Causal chaining (IMPLEMENTED in game.js):**
- Mission-complete records turns + mechs lost.
- Next briefing opens with "Previously:" line (EN + JA).
- Each mission exists because of what the player DID.

**Plot Clock (Kuelz):**
- M1 = Context (exposition + stakes). M2 = Investment (tension + counterweight). M3 = Payoff (climax + resolution).
- Resolution beat budgeted after M3 duel (debrief bark, not lore dump).

**VEX arc (Yellow 13 model):**
- M1: VEX introduced as unbeatable (forced-retreat pattern).
- M2: taunts react to player's tactics by name (heat/loadout/limb choices).
- M3: duel lands bittersweet (victory mixed with empathy); barks acknowledge cost.
- Commander near-silent (Mobius 1 technique).

**Faction test (Loreteller 5 questions):**
- One-sentence want; external + internal obstacle; two loudest voices;
  what new problem success creates; who stands at the fault line.
- VEX must want something legible that survives the duel.

**Validation (Bromley):**
- Storyboard 3 beats + 8 bark triggers as slides.
- Comprehension: "What's happening? Why? What next?" (fresh players only).
- Appeal: "How interested in what happens next?" M1→M2→M3 drop-off.
- Tone lock: feeling-words per archetype vs design intent.

**Writing discipline:**
- Barks fire on player action/victory (never mid-action, never out of nowhere).
- Audit: none fire during high-concentration moments.
- One exposition beat per mission max; rest via non-text channels.

## Round 148: Completed narrative validation checklist (slice)
**VEX legend through chatter (IMPLEMENTED in barks.js/game.js/i18n.js):**
- New `vexrumor` trigger (ambient tier, 15s cooldown, silenced in reduced-bark mode).
- Fires on mission clear for M1/M2 only. Pilots mention VEX by name —
  the legend is built through ally chatter before the M3 duel
  (Shattered Skies as Literature: Mobius 1's legend via radio chatter).
- EN + JA (draft) lines.

**Validation checklist (all sourced):**
- (A) Loreteller 5-question faction test — run when Aldo names the factions.
- (B) Bromley 2-track (comprehension 3-questions; appeal "how interested?"; tone lock).
- (C) Yellow 13 model (split channels; third-party humanize; tragic irony;
  Yellow-4 moment; visual identity; consequence continuity).
- (D) Traps: lore-dump (Game Developer 2018 — creeping exposition, right occasion);
  voiceless (Chandler GDC 2005 — distinct vocabulary per character);
  in-situ vs codex (GameDesign.gg — nothing load-bearing only in optional lore).
- (E) Shipped: Valkyria (book mode; war-correspondent; Darcsen arc; Selvaria);
  Advance Wars (CO carriers; Andy onboarding; Days of Ruin tone caution);
  XCOM 2 Chosen (distinct personalities; remember battles; mock mid-mission);
  AC04 as Literature (parallel narratives; legend via chatter).

**Rules:** no lore dumps (in-situ only: briefings/barks/taunts); never ask
"do you like the story"; never reuse narrative playtesters.

## Round 159: Jam narrative + validation spec (slice)
**JAM NARRATIVE DECISION: minimum viable story.**
- SHIPS: 3-line briefings + VEX observant taunts + vexrumor barks. That's the story.
- CUT (jam): codex, branching dialogue, backstory text, lore paragraphs.
- Rationale: "a sentence or two of premise" (community); complete > ambitious (Arcweave);
  reading is "an uphill battle" (MY.GAMES) — every line earns its place, all skippable.

**ENVIRONMENTAL STORYTELLING (IMPLEMENTED):**
- M3 duel arena carries the VEX legend: scorched tiles (w) with claw-mark slashes —
  wreckage of previous duels. Zero VO cost, survives mute, works without sound.
- VEX barks do DiGRA double duty: gameplay clue first (observant = telegraphs mechanics),
  legend second (creeping exposition — the legend stays a rumor, never a paragraph).

**VALIDATION:**
- Comprehension: Bromley's 3 questions on briefings + duel (3-5 fresh testers, never re-use).
- Appeal: skip-rate per briefing/bark as "interest" proxy; >50% skip = cut candidate.
- Recall: 1 week later — "what do you remember about VEX?" (breaks distort memory).

**JAM TRAPS:** no lore dump; everything skippable + auto-summary; no punishment for
skipping; no branching (one critical path); lock narrative content early (2h rule).

## Round 168: Jam narrative + validation spec (slice)
**JAM STORY DECISION: change almost nothing structurally.**
- Minimum-viable-story already matches the evidence (Portal/ItB).
- At theme reveal (Fri 6PM): 1 hour → ONE theme hook line via THEME_HOOK +
  one creative twist for the M3 duel. <500 new words for the jam build.
- Nothing in the slice's fiction needs cutting; 3-line briefings pass the cut test.

**VEX SIGNATURE (IMPLEMENTED in barks.js + i18n.js + game.js):**
- One line, verbatim, twice: "Remember this feeling. You earned it."
- Fired at M3 duel entrance AND on duel victory (the "Still Alive" slot).
- Memorability through recurrence (GLaDOS pattern), not variety.

**VALIDATION (lightweight):**
- Comprehension: 3-5 fresh testers, Bromley questions per beat.
- Appeal: "how interested in what happens next?" 1-5 per mission.
- 24h recall test — unrecalled fiction gets cut (Portal rule).
- Telemetry: extend funnel with narrative beats; bark skip/dismiss timing.

**TRAPS:** lore dumps; theme mismatch; overwritten barks; front-loaded exposition;
high story delta; reusing narrative playtesters; repetition insensitivity.

## Round 177: Theme-reveal execution plan (slice)
**THEME TWIST SLOT (IMPLEMENTED in data.js + game.js):**
- THEME_HOOK.twist added — the "payoff" moment (Arcweave: hook → choice → payoff).
- Renders as a 🌀 line on the M3 briefing only, when set.
- Friday 6PM executor fills 3 fields: name (hook) + desc (hook detail) + twist (payoff).

**EXECUTION PLAN (Fri Oct 16, 6PM EDT, 1 hour hard stop):**
1. 0:00-0:30 — arkicade word-chain seeding from the theme word.
2. 0:30-0:45 — pick ONE mode ("theme as problem" in M3 duel recommended).
3. 0:45-1:00 — write TWO artifacts: ONE hook line + ONE twist (≤3-line budget).
- Twist must fit existing briefing slots; 4th line = cut (Kennedy rule).

**VALIDATION (Sat, 45 min, 2-3 fresh players):** Bromley 3 questions + word-list emotion.
Fix only "why" confusions (3-fix rule). Re-run Sun only if a fix landed.
**M3 ARENA:** before-and-after staging; strip test (remove text, stakes still read).
**GUARDRAILS:** no lore dumps (3 lines); no purple prose (≤12 words/bark); no branching;
content lock 2h before butler deploy.

## Round 186: Jam narrative decision (slice)
**JAM NARRATIVE DECISION: Celeste strategy.** Ship the slice minimal; the twist
slot is the story's seed for post-jam expansion. No narrative feature work now.

**FRIDAY 6PM EXECUTION (locked):**
- Ryan scope pass (≤2h): loop × fantasy × theme → ONE integration sentence.
- Fill THEME_HOOK name/desc/twist only. M3 duel + briefing untouched.
- ≤3 twist barks, ≤12 words each. Total new copy ≤200 words.

**AUDIT (verified compliant — spec only, +0 lines):**
- Bark terminology: 0 mechanical-term collisions in flavor text (SFWA rule).
- Micro-budgets: twist ≤20w, beats ≤50w (SFWA).
- Validation: Fri comprehension (3 Qs) → Sun bark-context → Mon re-telling test.
- Technique: environmental (M3 arena) + do-don't-tell (twist changes 1 visible thing).

## Round 195: Final narrative sign-off (slice)
**FINAL NARRATIVE DECISION: STORY-READY (conditional).** No structural work.
Two conditions: (1) 3-player comprehension test; (2) Friday 6PM theme lock.

**IMPLEMENTED — O'Connor bark audit:**
- 4 high-frequency triggers now carry 2 variants per pilot (EN + JA):
  limblost, overheat, firstkill, heat50.
- Stimulus-response: each variant answers the player's in-moment question.
- Cooldown + never-repeat-last + verbosity tiers already in (Rounds 90/101).

**FRIDAY 6PM RULE:** ONE theme-integration method; story works with theme stripped.
3 touchpoints: title, first bark, twist. Finish 2h before deadline.

## Round 204: Final narrative confirmation (slice)
**FINAL NARRATIVE DECISION: STORY-READY — CONDITIONAL (do NOT declare GO).**
Gate: 3-player one-shot before Friday 6PM (Bromley protocol).

**IMPLEMENTED — Vois repetition audit:**
- heat50.p0.1: varied construction ("Heat climbing. Ease off." vs "Halfway to redline").
- limblost.p0.1: informational-first ("Limb gone. Compensating." — warnings stay legible).
- EN + JA. Cooldowns/priority already in (Rounds 90/101/160).

**MOOD TARGETING (LD Mood category):**
- ONE intended emotion per mission; twist slot = payoff.
- Humor (barks) must not break M3 arena vibe.

**SHIP CHECKLIST:** critical path + max 2 branches; start/finish; ≥1 complete path;
opening spell-checked; THEME_HOOK in critical path; lock 2h before; browser instant-play.

## Round 213: Vois table audit (slice)
**FINAL NARRATIVE DECISION: STORY-READY — CONDITIONAL (gate: 3-player one-shot).**
Confirm when 3-player comprehension passes.

**VOIS TABLE AUDIT (all triggers):**
| Trigger | Freq | Urgency | Cooldown | Variants | Info-first | Notes |
|---------|------|---------|----------|----------|------------|-------|
| limblost | High | Critical | 1.5s | 2×3 | ✓ | "Limb gone. Compensating." |
| overheat | High | Critical | 1.5s | 2×3 | ✓ | "Running hot. Venting now." |
| vexenter | Once | Critical | 1.5s | 1+1 | ✓ | Duel entrance |
| allydown | Med | Critical | 1.5s | 1×3 | ✓ | Always fires |
| firstkill | Med | Info | 6s | 2×3 | ✓ | O'Connor variants |
| heat50 | Med | Info | 6s | 2×3 | ✓ | "Heat climbing. Ease off." |
| clear | Once | Low | 15s | 1×3 | ✓ | Mission clear |
| start | Once | Low | 15s | 2 | ✓ | Mission start |
| vexrumor | Low | Low | 15s | 1×2 | ✓ | M1/M2 legend building |
| vexsign | 2× | Signature | — | 1 | N/A | GLaDOS: verbatim repeat |

**Overlap guard:** stop_on_nonidle suppresses non-critical when juice >3/sec.
**Duration:** floaters 3.2s; 8-word rule ensures readability. Ducking 0.5s covers voice moment.
**Maxim:** "Write the line the player needs, then give it permission to stay quiet."

## Round 222: Pre-jam freeze (slice)
**NARRATIVE FREEZE: two boundaries.**
- Sat Oct 17 6PM: Vois table = translation baseline (10 triggers frozen).
- Sun Oct 18 6PM: release lock (typo/showstopper only + change record).

**BARK AUDIT (70 lines):**
- No icon-duplicates found. All barks add character/strategy beyond telegraphs.
- Info/personality split holds. 2-3 variants per trigger. Verbs as feedback.

**VOICE MATRIX (frozen):**
- RAIDER: charger (aggressive, closes distance)
- STINGER: skirmisher (hit-and-run, taunting)
- LONGSHOT: holder (patient, calculating)
- WARDEN: holder (defensive, stoic)
- PYRE: charger (reckless, incendiary)
- VEX (ace): arrogant rival (signature verbatim line)

**2H BUFFER:** final read-aloud in-game; verify aria-live + floaters + ducking agree.
Unverified = DEFERRED to post-jam.

## VEX ESCALATION LADDER (Round 237 — Wed 2026-10-14 ~23:05 EDT)
Verified in code (Hades/Theseus + GLaDOS principles):
1. Arrogant opening — observant entrance taunts referencing player history (turns, mechs lost; Round 147) + VEX signature line, verbatim (Round 168).
2. Rattled midpoint — phase2 taunt on first component loss ("You cracked my armor. Now I stop holding back.") + per-limb reactions, once per limb (Round 66).
3. Beaten — defeat lines (70% AI / 30% original).
4. Winning — victory/kill lines.
Principle: the rival notices what the player is DOING (observant, personal taunts); escalation is state-driven, not a flat pool.

## PLAYBACK IMPLEMENTATION NOTE (locked, verified in code)
- Cooldowns: critical 1.5s / combat 6s / ambient 15s (Round 101).
- Never-repeat-last-variant + shown-set rotation (Round 101).
- Verbosity: Off/Reduced/Full (Round 90). stop_on_nonidle: suppress non-critical barks when juice >3/sec (Round 160).
- Token layer #self/#mech/#mission (Round 136). BGM ducks under barks (Round 207).

## PRE-JAM NARRATIVE GATES
- No-name-tag test: strip speaker names from all 70 lines; each must identify as Raider/Stinger/Longshot-Warden/Pyre/VEX by diction alone. Interchangeable = icon-duplicate = cut.
- AI voice pass: all 36 AI lines auditioned against the Vois baseline (reference performance per character); reject wrong words/emotion/duration-overrun.
- Briefing discipline: M3 briefing = who/where/stakes only (Bateman). Story lives in barks.

## FINALIZATION CHECKLIST (Round 246 — Wed 2026-10-15 ~00:03 EDT)
Run on the frozen build, morning of the final day:
1. No-name-tag test: strip speaker tags from all 106 lines (70 barks + 36 AI), shuffle, attribute blind. Rewrite or cut every unattributable line.
2. 3-player one-shot (Bromley): fresh players, one-to-one. "What's happening? Why? What next?" + quote VEX's defining line. Same rung from all three = ladder legible; nothing quoted = cut, don't add.
3. Trigger audit: pull bark telemetry ('bark:<trigger>:<key>' fires, timestamped); flag any line repeating within ~3 min → add variant or widen cooldown/recency.
4. Skip test: skip every briefing + bark; objectives, game state, VEX posture must stay legible from gameplay + HUD. Skipped-only info → highlighted briefing essential or cut.
5. Escalation check: three sessions (dominating / struggling / comeback) — tone must shift across arrogant→rattled→beaten off real game state.
6. Content lock (Supergiant discipline): after the voice pass, the line list is FROZEN. Edits to existing lines only, each re-read aloud. No new barks, no new briefings, no lore. Un-audited ships cut, not hopeful.

## FINAL LOCK (Round 255 — Wed 2026-10-15 ~00:58 EDT)
- No-name-tag test: strip tags from all 106 lines, shuffle, second person identifies speaker + VEX rung per line. Failures cut/rewritten. (Slabinski "character above all else.")
- AI read-aloud = self-recording (Valve-style): record every line, rewrite what sounds unnatural, halve lengths (Slabinski concision). This pass COMPLETES the content lock — any edit (even one word) restarts read-aloud + no-name-tag. (Pangea discipline.)
- Ladder verified across full sessions: rungs keyed to game state, never out of order, never regress. Then 3-player one-shot: does each rung read to uncoached players? (Portal/GLaDOS precedent.)
- Trigger audit from telemetry: soak-test ~10 min, every trigger's fire count vs design budget. Hades rule: exhaust variety before repeating; over-firing = tuning bug, not writing problem.
- Skip test: beats carried by game state, never one skippable line. VERIFIED: skipping can't pile up (off-returns before timestamp set; no queue). Ladder can't regress (one-way phase2).
- Order: ladder verified → playback verified → gates spec'd → lock. No new lines after lock.

## FINAL LOCK (Round 264 — Wed 2026-10-15 ~01:55 EDT)
- Trigger audit tool (Beaulieu's Skyrim lesson): `Barks.audit()` in console after a playthrough — per-trigger firing rates for the session, sorted. Any trigger repeating identical lines like the Skyrim case gets more variations or a longer cooldown. Unmeasured = untested.
- Quote check (Slabinski's 95% rule): after each fresh-player session, ask them to repeat any line they remember. Nobody quoting the escalation beats = the ladder isn't landing.
- Write from the trigger (O'Connor): lines are stimulus-and-response, never standalone assets. Ask what the player would want to know at that moment; answer in voice.
- The Big Skip (MY.GAMES): players skip regardless of authorial intent — the game survives it. Short, highlight the important beat, don't punish.
- After lock: deletions and timing fixes only. Late rewrites invalidate performance (Beaulieu). Nothing new after lock. (Perita.)

## FINAL LOCK (Round 273 — Wed 2026-10-15 ~03:01 EDT)
- Verified (code read): exclusionary conditionals are STRUCTURAL. VEX victory (ace kills) vs VEX defeat (ace dies) = opposite sides of the same event, cannot cross. First-kill cheer vs ally-down likewise mutually exclusive per event. (Avellone's rule.)
- Read-aloud pass: all 106 barks + 36 AI lines via AI self-recording (GoldFire-validated practice) before lock. Flag anything that drags or outlasts its trigger window.
- Big Skip: play acts 1–6 skipping everything — the 6-act arc must survive on barks/taunts alone. Barks are skip-proof by design. (Stuart.)
- Quote check: 95%+ typographically clean against a written style sheet. Known exceptions logged; unknown ones fixed. (Ryan; GoConsensus.)
- Post-lock = deletions + timing ONLY. A rewrite = a deletion-scoped bug fix, never an improvement. No new lines, no wording improvements, no name-tag exceptions. (GoConsensus: post-lock rewrites are the most expensive changes.)
- Scope: 142 lines is within jam discipline (NarraScope <5000 words). Don't grow it in the final 48h.

## VERIFICATION ROUND 2 (Round 282 — Wed 2026-10-15 ~04:18 EDT)
- Static coverage (js/barks.js, pulsegeek): `Barks.coverage()` — every trigger in BARK_COUNTS must resolve ≥1 i18n line; reports GAPS vs OK. The static half (audit() = dynamic half). Run in the console before lock. Verified: all 10 triggers resolve — NO GAPS.
- Read-aloud as audio, not text: all 106 + 36 AI lines through self-recording in act order, then in a live combat session. Reject anything that grates, collides, or drifts. (voiceart.app: "what the spreadsheet can't show, the ear catches.")
- Big Skip: one complete run, all dialogue skipped. Essential info must survive via UI/mechanics alone.
- 95% quote check: ≥95% of lines pass read-aloud + trigger audit + no-name-tag + voice consistency. The rest = documented exceptions, never silent gaps. (pulsegeek.)
- Lock discipline: any single line change re-runs the audit ladder (cooldowns + act flags cascade). Post-lock = deletions + timing only. (Ryan: "don't feature creep your narrative.")

## VERIFICATION ROUND 3 (Round 291 — Wed 2026-10-15 ~05:06 EDT)
- Verified (code read): stable line IDs (Thomas). Bark keys `bark.<trigger>.<pilot>.<n>` = permanent IDs — the key is the identity, the text is the value. Conditionals reference triggers (IDs), never display text. Speaker names resolve at display time from pilot index. Renaming a pilot cannot break a trigger. No-name-tag is structural.
- Coverage as a hard gate (Thomas; ChoiceScript): Barks.coverage() fails the build if any trigger is unreachable. Gate: ≥95% trigger reachability. Ladder: every commit → nightly full walk → pre-lock freeze sweep. "Narrative QA that a build server can enforce."
- Read-aloud in two layers (Simpson; Bateman): TTS sweep of all 106 for flow/pacing at scale (cheap, fast); human read-aloud of the 36 AI lines + act openers, with someone else reading back cold, before the lock. AI for breadth, humans for the final ear.
- Trigger-first authorship (Mikkelson): every bark records its trigger verb/condition first; the audit verifies the trigger actually fires in real play. Closes the "untested triggers" anti-pattern.
- Freeze discipline: any post-lock bark change = a versioned spec amendment + re-run of audit() and coverage(). No silent edits. New barks enter only through amendment, never drive-by. (Play Journal's hard freeze-date model.)
- OPEN: native-speaker JA wording review (needs a Japanese speaker — flagged for Aldo, jam-day).

## VERIFICATION ROUND 4 (Round 300 — Wed 2026-10-15 ~05:45 EDT)
- Beaulieu's 3+ rule (js/i18n.js + js/barks.js): high-frequency triggers (firstkill, limblost, overheat, heat50) now have 3 variants per pilot (was 2). 12 new lines matching each voice bible. All ≤12 words (density rule). BARK_COUNTS updated. The Skyrim-guard pattern is now guarded.
- String freeze (Localazy; Force Media): after freeze, no silent rewrites. Any necessary change ships as a NEW line ID; edits never touch a frozen ID. Ship-blocker: any edit to a frozen ID without a new ID + documented exception.
- Coverage gate as ship-blocker: Barks.coverage() ≥95%, every trigger resolved to a unique stable ID. Below the gate blocks ship.
- Read-aloud + fresh-ears: table-read all VEX taunts/pilot barks aloud (Salivity); test in live play at real duration (Vois); non-writer flags every grating line (SFWA briefing discipline).
- Tone audit: read every VEX line against the voice bible (mannerisms, vocabulary, taboos) with one owner signing the final pass. Flag drift per-line.
- Repetition watch: variation pools on all high-frequency triggers (Beaulieu 3+; L4D2 as the bar). Ship-blocker: any trigger heard dozens of times per session with <3 lines.

## VERIFICATION ROUND 5 (Round 309 — Wed 2026-10-15 ~06:20 EDT)
- Verified (analysis): Kasavin's subtext rule governs narrators; Beaulieu's four jobs govern combat barks. Our lines are barks, correctly following the bark framework. No narrator; no conflict.
- Freeze audit (PlayablePlan): lock source revision; change queue; triage DEFER/TYPOFIX/RETRANSLATE/HOLD with per-change record (ID, old→new, reason, trigger, decision, owner). Ship-blocker: post-freeze rewrite without a change record or with recycled ID.
- Variation gate: Barks.coverage() ≥95% (hard ship-blocker) + 3-variant rule for high-freq triggers (Beaulieu). Tonal-balancing line audit before voice lock. (Kasavin: "no repeats.")
- Bible-vs-build audit: diff voice bible against in-game strings at this milestone. Bible is canon — contradicting lines fixed or recorded immediately (Inkwarden "point of change" rule).
- QA briefing (SFWA/Ryan): hand QA the voice section + proper-noun list + one-page brief (voice discrepancies, logic leaps, missing dialogue, repeats in same beat). "No detail too small."
- Table-read high-freq barks: Discord read-aloud, dev half-acting responses. Catches lines that read fine but sound wrong; confirms variants sound like the same character.

## VERIFICATION ROUND 6 (Round 318 — Wed 2026-10-15 ~06:49 EDT)
- Verified (code read): Crawford's 80/20 rule. High-freq triggers get 3 variants × 3 pilots; low-freq get 1-2; VEX signature intentionally ONE line (GLaDOS pattern). No bloat.
- String freeze as hard gate: after freeze, any string change requires documented change request with context/ID, not an edit. Freeze violations = ship-blockers. Audit freeze record for undocumented edits.
- Barks.coverage() ≥95% as literal ship-blocker: every line ID must have verified trigger path; final audit fires (or simulates) every concept. Lines that never fire get cut, not shipped.
- Read-aloud table read (temp VO) before freeze: catches clunky rhythm, timing overflow, voice drift that silent review misses. Flag against voice bible.
- Voice bible line-by-line audit: sample every speaker's lines against diction/attitude rules; verify proper nouns (VEX terminology especially). Voice drift = ship-blocker.
- Beaulieu rule mechanically: final verification confirms 3 variants for every high-freq trigger and rotation actually works. Missing variants on hot paths = ship-blockers; extra variants on cold paths = bloat, cut them.
- Localization hygiene (EN-only ship): every string needs context comments, character limits, stable IDs (verify no ID changed post-freeze). Cheap insurance against future translation breakage.

## VERIFICATION ROUND 7 (Round 327 — Wed 2026-10-15 ~07:25 EDT)
- Verified (code read): stimulus-mapping. All barks trigger-driven (no timers). Per-trigger cooldowns (Mitchell) prevent clustering. Fire counts (Beaulieu) ensure measured. O'Connor audit passes.
- Stimulus-map gate (pre-freeze): every bark ID documents its stimulus (player action/state change). No stimulus, no line. Makes coverage() ≥95% meaningful — coverage of unmapped lines is theater.
- Three-question comprehension (ship-blocker): 3–5 fresh moderated playtests (Bromley protocol). What is happening? Why? What next? Players must answer from barks alone. If VEX identity/motive not legible, taunt set fails — rewrite before freeze.
- VEX signature emotional contract (ship-blocker): define ONE intended emotion for the ONE line (e.g., contempt). Test if first-time players feel it. One line, one emotion, verified. If it doesn't land, change the line — not the count.
- Freeze as restraint (Avellone): bible stays open, game text closed. Post-freeze changes require (a) failed comprehension/emotion result and (b) stable-ID-preserving fix — no renames, no new IDs.
- Anti-dissonance spot check: sample 20 fired barks vs board states (Hocking test). Each line must agree with mechanics. Mismatches rewritten or re-triggered — never shipped.

## VERIFICATION ROUND 8 (Round 336 — Wed 2026-10-15 ~07:58 EDT)
- Verified (code read): string externalization. All barks in i18n as bark.<trigger>.<pilot>.<n> (barks.js:7). Stable IDs, voice bible (Round 149). JA flagged for native-speaker pass (honest gap).
- Freeze + change-request gate (ship-blocker): any edit to VEX taunt/enemy bark/pilot bark post-freeze requires written change request (line ID, reason, re-verification: stimulus map, emotion contract, coverage re-run). Silent edits = #1 ship-blocker. (Translators USA; Studio Fugu.)
- Pseudo-localization pass (ship-blocker): pad all barks/taunts ~35% (industry expansion guideline), screenshot every trigger path at target resolution. Clipping/overflow = ship-blocker — frozen line that can't display = failed stimulus. (Unity; Studio Fugu.)
- ID contract: static check that no ID renamed/reused since freeze — otherwise coverage() ≥95% passes on aliased IDs. DNT marking for pilot names/faction terms. (Studio Fugu; Translators USA.)
- Native-reader comprehension (final gate): hand trigger-context packet (line + screenshot/clip + intended emotion) to fresh reader, no dev context. Ask them to name emotion/situation. Mismatch = fails VEX emotion contract = rewrite before freeze sign-off. (Game Developer LQA.)
- Culturalization audit log: score each taunt/bark vs per-market risk list (insults, mockery, stereotypes, religious/symbolic refs). Log residual risk per line; unresolved high risk = ship-blocker. (Nimdzi; Juego Studios.)

## VERIFICATION ROUND 9 (Round 345 — Wed 2026-10-15 ~08:27 EDT)
- Verified (code read): pipeline gates. Barks.coverage() checks each bark.<trigger>.<pilot>.<i> ID (barks.js:91-100). Renamed/missing ID → coverage drops → gate fails. Thomas's "don't change it!" automated. IDs immutable, versioned with code.
- Freeze gate (ship-blocker): declare string freeze; any post-freeze edit requires explicit exception + re-verification of affected line IDs. (eTranslationServices; Game-Ace.)
- Line-ID immutability (ship-blocker): every VEX taunt/enemy bark/pilot bark has unique immutable ID surviving edits. Any ID change or duplicate = verification blocker. (Thomas.)
- Coverage as CI gate: Barks.coverage() ≥95% kept as automated test; re-run after every freeze exception. Regression-test every narrative fix. (eTranslationServices.)
- Stimulus + externalization gates: every bark maps to gameplay stimulus; all narrative in externalized strings (no hard-coded text). Mirrors automated QA gates flagging hard-coded strings.
- Version with code: bark database (IDs, statuses, voice bible refs) in same VCS as game, per-line status (Draft/Polished/Final) visible. Verifications 2–8 remain auditable post-ship. (Thomas.)

## VERIFICATION ROUND 10 (Round 354 — Wed 2026-10-15 ~08:55 EDT)
- Verified (code read): EN-only jam lock. JAM_BUILD=true → SUPPORTED=['en'] (i18n.js:14). JA in repo for post-jam Crowdin; needs native-speaker pass (honest gap, Round 336). Phase 2.
- Freeze via stable IDs: post-freeze change to any bark/taunt must mint new versioned line ID — never edit frozen source in place — and re-run full verification. Gate on Barks.coverage() ≥95%. Pro triad: linguistic, visual, technical audits. (LocalizeDirect.)
- Technical audit (canvas-specific): pseudo-localize every bark/taunt in-canvas before real translation. Worst cases: German (~30% expansion), Japanese (wider glyphs — Family Island overflowed), RTL scripts. Overflow/clipping/tofu = ship-blocker.
- Cultural review (taunts): taunts = highest-risk (insults, blasphemy-adjacent map badly). Reactive audit: native speakers flag per target market; keep per-market variants where needed. (Witcher: no one-size-fits-all; Fire Emblem Fates lesson.)
- Export stimulus mapping to loc kit: trigger event, speaker identity, tone, intended audience, gameplay screenshot per bark. Yakuza rule — "text and context" — is where barks live or die.
- Lock voice bible + glossary: VEX terminology, pilot call-signs, tone rules frozen as glossary-of-record; per-character voice guides (Yakuza accent guide) so future transcreation preserves intent/atmosphere not literal meaning.

## VERIFICATION ROUND 11 (Round 363 — Wed 2026-10-15 ~07:30 EDT)
- Verified (design): bark architecture. Trigger → bark (not branching); per-trigger cooldowns/fire counts; stable IDs; coverage() ≥95% (existence); stimulus-mapping (trigger-driven). "Unreachable" = trigger never fires (QA activity). (PulseGeek; BranchGuard.)
- Freeze string table: lock all line IDs; any new/changed post-freeze string gets new ID (never reuse). Ship-blockers only: (a) crashes/hangs in bark triggering, (b) Barks.coverage() <95%, (c) missing-string fallbacks in-game. Everything else queues post-ship. (BranchGuard D5/D10.)
- Full-tree traversal (ship-blocker): prove every bark/stimulus mapping fires at least once under every reachable game state (pilot dead/alive, mission win/loss). "Tour every branch + state matrix" (PulseGeek). Any bark that cannot trigger, or stimulus with zero barks = blocker.
- Blind read-aloud tone pass: read every VEX taunt + pilot bark aloud against voice bible in one sitting; flag any line sounding like wrong character or drifting register. One sitting, one pass, before freeze. Catches what linters can't. (PulseGeek tone audit.)
- QA evidence pack: automated report showing Barks.coverage() ≥95% per stimulus, stable line-ID list with change log since lock, placeholder-parity check, localization-ready export (no hardcoded strings). Attach to verification record as sign-off. (BranchGuard D7/D9/D10.)
- Fresh-eyes playtest: someone who hasn't written lines plays full loop with all barks on; note (a) bark feeling wrong for moment, (b) repeated-bark fatigue, (c) moment needing bark but none. Only human validation pros fully trust (PulseGeek). File as ship-blocker or known-defect-with-workaround — no silent fixes post-freeze.

## VERIFICATION ROUND 12 (Round 372 — Wed 2026-10-15 ~07:55 EDT)
- Verified (spec read): narrative discipline. Tone lock, vocabulary lock, stable IDs, coverage ≥95%, stimulus-mapping. Cardoso's "story locked to what design needed" (Portal) — barks serve mechanics, no narrative surface beyond verifiable. (Cardoso.)
- Declare narrative content lock formally: adopt Cardoso finaling model — from lock onward, no new lines; only tweaks to existing content, each requiring explicit approval. Classify every post-lock change as either ship-blocker (crash, wrong trigger, offensive/incorrect line) or deferred. Unapproved additions = freeze violations, not improvements.
- Bark-coverage audit (ship-blocker): re-verify Barks.coverage() ≥95% against frozen string set with stable line IDs; confirm every stimulus maps to exactly one line, no orphaned/placeholder IDs survive, manifest-based build integration fails loudly on missing audio. (Vois implementation-QA: right line, right trigger, right mix.)
- Full RC narrative playthrough: one complete beginning-to-end run on release candidate verifying every VEX taunt, enemy bark, pilot bark fires in context, matches voice bible, subtitles/captions timed and compliant. "Plays from beginning to end without breaking" RC criterion applied to narrative — final verification, not sample.
- Credit audit (in-build): apply IGDA checklist — inclusion (30-day rule), attribution (name+role+association), ordering, consent; specifically verify QA, localization, contractors, departed contributors. Render and watch actual credits sequence in RC build — post-launch credit fixes "extremely hard," omissions become public. (Metroid Dread; Callisto Protocol.)
- Spoiler audit: confirm which builds contain full story, who holds them, under what NDA; prepare one-paragraph leak-response statement now. Leaked ending damages "intended game experience" in way no patch can fix. (Rockstar; TLOU2.)

## VERIFICATION ROUND 13 (Round 381 — Wed 2026-10-15 ~08:30 EDT)
- Verified (spec read): script lock defined. :140: "content lock 2h before butler deploy"; :258: "AI read-aloud COMPLETES content lock — any edit (even one word) restarts read-aloud"; :337: "Freeze gate (ship-blocker): declare string freeze; any post-freeze edit requires explicit exception + re-verification." Matches Cardoso/Dansky (lock writing with feature lock; after lock text = production data). (Cardoso; Dansky.)
- Declare script lock with named gate: freeze strings now; after freeze, every line edit requires exception approved by single named owner (Cardoso: schedule-owner breaks ties between "ship it" and "improve it"). Treat post-freeze edits as production defects, not prose tweaks — Dansky's "'It's just words' isn't true any more."
- Story-freeze audit (automated checklist): string freeze verified, all line IDs stable (diff ID registry against frozen manifest), Barks.coverage() ≥95% re-run green, pipeline/string-externalization/localization checks green, every ending played start-to-finish in final build (Cardoso's gold criterion). No RC ships with red item.
- Continuity audit (tooling + humans): extend pipeline checks with compiler-style static analysis on bark/dialogue graph (unreachable lines, orphan IDs, dead triggers — GDC 2019 approach), then run one Portal-style session — fresh playtester plays through and retells story back. If they can't reproduce VEX's arc and ending, story fails no matter what coverage number says. (GDC 2019; Portal.)
- Tone audit (single-editor voice pass): one reader sweeps all VEX taunts, then all enemy barks, then all pilot barks, checking voice consistency line by line against voice bible. Do after writing stops so late edits can't reintroduce drift. (Storyflow: documentation alone doesn't hold voice; dedicated pass does.)
- Narrative ship-blockers: (a) any ending not played end-to-end in final build; (b) bark coverage below 95%; (c) any line-ID change after freeze; (d) any story change that hasn't re-run localization, pipeline, and tone verification. Make mechanical blockers, not judgment calls, so closing stays closing. (Cardoso.)

## VERIFICATION ROUND 14 (Round 390 — Wed 2026-10-15 ~09:01 EDT)
- Verified (code read): coverage gate exists. barks.js:91: coverage() (R282, pulsegeek) — automated traversal checking every trigger in BARK_COUNTS. 95% threshold documented as ship-blocker. Matches PulseGeek (automated traversal, CI fails below threshold). (PulseGeek.)
- Three-audit gauntlet (write results into NARRATIVE-SPEC.md): (i) story-sign-off audit — scripted stimulus→line playtests for every VEX taunt, enemy bark, pilot bark; (ii) coverage audit — keep Barks.coverage() ≥95% gate as hard CI-style fail, with unvisited-stimulus reports attached; (iii) post-launch audit — locale-fallback table proving every wired line degrades gracefully. (PulseGeek.)
- Freeze discipline: declare string-freeze date in NARRATIVE-SPEC.md, lock line IDs as immutable, require any post-freeze text change to re-run full validation chain (ID stability check → stimulus mapping → coverage gate) before merge — no silent edits.
- Narrative ship-blockers (explicit): missing line for wired stimulus; dead-path/unreachable branches; bark cooldown violations or repetition spam; wired-but-unlocalized lines without approved fallback; subtitle/text mismatch. Any one blocks ship. (PulseGeek.)
- Post-launch monitoring (even jam build): log bark fire rates per stimulus in playtests to catch repetition fatigue, keep one-page localization-gap list so known gaps tracked, not discovered by players. (Hades: sign-off treated as continuous.)
- Machine-readable source of truth: narrative export (line IDs, stimulus mapping, text, cooldowns) must be artifact CI validates against engine's bark table — writers edit there, everything else generated. (PulseGeek: immutable composite IDs.)

## VERIFICATION ROUND 15 (Round 399 — Wed 2026-10-15 ~09:38 EDT)
- Verified (spec read): ongoing narrative defined. :287: "stable line IDs — Bark keys `bark.<trigger>.<pilot>.<n>` = permanent IDs"; :288: "Coverage as hard gate: Barks.coverage() fails the build if any trigger is unreachable. Gate: ≥95%"; :297: "Coverage gate as ship-blocker: Barks.coverage() ≥95%." Matches Vois (stable-ID discipline) and Apex (continuity system). (Vois; Apex.)
- Treat string freeze and stable-ID contract as ship-blocker, per milestone: no line text edits after freeze without re-freeze; any changed ID resets that line's coverage to 0 and blocks sign-off. (Vois: "line is born when it gets an ID and keeps it until the game ships".)
- Keep Barks.coverage() ≥95% as hard release gate and extend post-launch: every new content drop must ship with its coverage measured and ≥95% before release, using dialogue matrix (line ID × trigger context × recorded file × playback state) as ground truth.
- Recurring story-monitoring audit (per milestone/season): triple-check new lines against voice bible for character consistency and drift — adopt Apex's "Did we say this?" crowdsourced cross-check as checklist item before each freeze.
- Pre-freeze bark fatigue testing with real playback rules: simulate actual trigger frequencies and cooldowns in-game before locking lines, since grating repetition is #1 coverage-neglect failure mode. (Vois.)
- Plan narrative 2 drops ahead: keep rolling "meta layer" — each faction/pilot's arc endpoint sketched even if tentative — so post-launch content integrates with shipped game instead of drifting. (Apex: 1-year scaffolding.)

## VERIFICATION ROUND 16 (Round 408 — Thu 2026-10-15 ~12:14 EDT)
- New this round (spec only): story-expansion plan. Spec has no story-expansion/canon-drift plan (:144: "slot is the story's seed for post-jam expansion") — this round adds it. Matches Megill (living bible), Tamer (permanent/temporary split), Warframe (additive evolution). (Megill; Tamer; Warframe.)
- Quarterly story-evolution audit against the voice bible before each content drop (Megill's "living document" discipline). Checklist: do new VEX taunts/pilot barks fit the established tentpoles and character backstories? Does any new line paint the fiction into a corner for future drops? Treat the voice bible like Guild Wars 2's expansion problem — leave writers (and future-you) room. Ship-blocker: no drop ships with bible conflicts unresolved.
- Canon-drift locks at the line level (Andrianova's backstory-first rule + Mustard's fixed-beginning/end). For each faction/character, freeze a "voice contract" entry in the voice bible: who VEX is, what it knows, what it can never claim. Any new bark contradicting a shipped line must be flagged in the audit and either rewritten or deliberately re-contextualized in-fiction — never silently overwritten (the retcon anti-pattern). Ship-blocker: contradiction audit passes.
- Permanent-vs-temporary split (Tamer) for all post-launch narrative. Core campaign/pilot barks = permanent canon, always accessible; seasonal/event barks = temporary, clearly marked non-canon-flavored. Never vault or delete permanent story content without an in-game archive (the Destiny-vaulting / preservation-crisis anti-pattern). Ship-blocker: expansion plan declares each line's permanence class.
- Extend Barks.coverage() into a post-launch monitoring gate (Bungie's validation loop + Ryan's QA model). Per release: run the existing 95%+ coverage gate, add a repetition/fatigue check on VEX taunts (Bungie's predictability lesson — frameworks breed formula), and brief a narrative QA pass on character-voice consistency and proper-noun/naming conventions before sign-off. Ship-blocker: coverage + fatigue + voice-consistency checks green.
- String freeze + localization re-verification as hard ship-blockers for every story expansion (existing freeze discipline), plus one post-launch telemetry rule from the evergreen-games playbook: log which barks actually trigger in real builds, retire or rewrite zero-trigger lines, and feed player reactions back into the next drop's plan — Mustard's "campfire story" loop, scaled to a tactics game. Never gate canon story behind FOMO mechanics (Critical Rollout's warning) — players should always be able to hear the whole story.

## VERIFICATION ROUND 17 (Round 417 — Thu 2026-10-15 ~13:08 EDT)
- New this round (spec only): environmental-storytelling plan. Spec has no environmental-storytelling plan — this round adds it. Matches Mulholland (three-level stack), Dark Souls (opt-in interactive narrative), Dishonored 2 (story of an object). (Mulholland; Dark Souls; Dishonored 2.)
- Run the environmental audit now, before freeze: Build the Bioware-style artifact: a beat sheet per mission mapping intended emotion + intensity + the AEGIS/VEX faction read the player should take away, then playtest 3–5 fresh players with the comprehension trio (what's happening / why / what do you expect next) and mark every mismatch as a ship-blocker until fixed or deliberately cut. Environmental storytelling must survive skipped briefings — on a 2D canvas, faction color language, wreckage/scorch set dressing, and tile-level vignettes (a fallen AEGIS shield emblem, a VEX ace's signature strike pattern burned into a map) are the tools.
- Freeze microcopy with a voice-bible lock and ship-blocker rule: Inventory every string — buttons, tooltips, victory/defeat text, error states, tutorial prompts — and sign each against the existing voice bible; any string that drifts (VEX bark cadence in a UI tooltip, AEGIS formality in an error message) is a blocker until rewritten or re-approved. Adopt the UX Writing Hub rules: brief, characterful, never interruptive, never under-directing.
- Author the "story of an object" for each map: Per the Dishonored 2 discipline, give every mission 2–3 authored environmental vignettes that telegraph faction story without text: AEGIS defensive emplacements showing discipline, VEX ace's personalized wreckage showing menace. If a prop can't earn its narrative cost, cut it — don't decorate.
- Instrument post-launch narrative monitoring from day one: Define the three cohorts (drop after mission 1, mid-campaign, completers) and the telemetry that matters for narrative (briefing skip rates, mission drop-off points, which AI lines/barks players actually encounter). After the EN jam build ships, run one post-launch ethnography pass on player discussion + one telemetry pass before the JA localization — comprehension failures found in EN must be fixed before translation multiplies them.
- Make environmental storytelling opt-in, like Dark Souls: Keep the 36 AI lines and briefings as the explicit layer, but guarantee the implicit layer (map, props, faction visual language) tells the same story for players who skip text. Test this explicitly: one playtester cohort plays with all dialogue muted, and their faction/character comprehension must still clear the bar.

## VERIFICATION ROUND 18 (Round 426 — Thu 2026-10-15 ~13:53 EDT)
- Verified (spec read): AI-dialogue discipline defined. :280: "Static coverage (js/barks.js, pulsegeek): `Barks.coverage()` — every trigger in BARK_COUNTS must resolve ≥1 i18n line; reports GAPS vs OK. Run in the console before lock. Verified: all 10 triggers resolve — NO GAPS."; :283: "95% quote check: ≥95% of lines pass read-aloud + trigger audit + no-name-tag + voice consistency."; :290: "Trigger-first authorship (Mikkelson): every bark records its trigger verb/condition first; the audit verifies the trigger actually fires in real play." Matches Vois (trigger audit) and Allcorrect (voice consistency). (Vois; Allcorrect.)
- Run the trigger audit on all 36 lines now (ship-blocker gate): Build the Vois-style sheet: ID, speaker, trigger, text, intention, duration budget, revision. For each trigger record frequency, urgency, overlap, and interrupt rules. Ship-blockers: (a) any trigger that can fire in a tight loop with no cooldown; (b) any high-frequency combat trigger with only one variant; (c) any informational bark whose actionable content sits after the first ~2 seconds. Freeze the IDs when the audit passes.
- Voice-lock the three voices before freeze: Write a reference passage for each: AEGIS (faction voice), VEX rank-and-file (faction voice), and the VEX ace (antagonist voice — distinct from VEX mooks per Beaulieu's group-characterization rule). Define each voice's normal energy, allowed emotional range, and 3–5 sample phrases. Then run the line-up test: print all 36 lines blind and check whether each is attributable to its speaker — any line that could be spoken by either faction fails the voice audit and gets rewritten.
- Adopt "permission to stay quiet" as the freeze discipline: After the audit, the default fix for a grating bark is a longer cooldown, a mute, or a cut — never another variant. Log every post-freeze line change as an explicit exception with reason; this is the freeze discipline that protects the native-speaker review already banked. (Vois: "More lines do not fix excessive triggering.")
- Playtest the repetitive path, not the golden path: Script a session of repeated orders, failed actions, and same-area returns — the tactics-game equivalent of Vois's deliberate-repetition test — and listen at 2x exposure. Any bark that grates by the 20th hearing is a ship-blocker; fix with trigger rules first, variants second.
- Bank the post-launch/JA continuity now: Promote the frozen style guide + character bible to "Keeper of Knowledge" status (per Allcorrect) so the JA post-jam translation inherits the EN voice locks rather than re-deriving them, and define one post-launch monitoring loop: collect player reports on repetition/voice issues after the jam build and route every new line through the bible before it ships.

## VERIFICATION ROUND 19 (Round 435 — Thu 2026-10-15 ~14:42 EDT)
- New this round (spec only): story plan. Spec has a story-expansion plan (round 408) but no story plan — this round adds it (bible-gate audit, Promise Test, faction lock, blocker list, post-launch series). Matches Megill (living bible), Dena (narrative testing), XCOM (systemic bark writing). (Megill; Dena; XCOM.)
- Freeze with a bible-gate, not a date: Before the jam, run Megill's five-slot story audit (premise summary, key events/objects/locations, combat justification, tone/voice, methods) over the 36 AI lines, mission briefings, and enemy barks; lock the bible and route every post-freeze line through a single owner. Anything the bible can't explain is a blocker.
- Run Dena's Promise Test on every mission briefing + Theme-Action Alignment on every bark trigger before ship: If a briefing promises something the mission doesn't deliver, or a bark's emotion mismatches its trigger, fix or cut — per O'Connor, fewer words win.
- Enforce the faction lock on AEGIS vs VEX as a ship-blocker: any line that could be spoken by the other faction fails. Tag each of the 36 lines to its faction voice matrix (XCOM method); the VEX ace's taunts must be unfalsifiable by player action (no dissonance).
- Write down narrative ship-blockers vs. non-blockers now: wrong-trigger bark, faction-voice violation, briefing/mission contradiction = blockers; typos and microcopy polish = fix-forward. This is the freeze discipline the jam needs.
- Plan post-launch as a series, not an epilogue: instrument trigger coverage so you can see which barks/briefings players actually encounter (GDC "Playable Series" method), concentrate any future story spend at the moments players feel most, and gate new content against the frozen bible to prevent faction drift.

## VERIFICATION ROUND 20 (Round 444 — Thu 2026-10-15 ~15:26 EDT)
- New this round (spec only): story-bible plan. Spec has a story plan (round 435) but no story-bible plan — this round adds it (voice guides, faction fact sheets, trigger map, character ownership, freeze discipline, ship-blocker list, validation pass, mechanics-first stinger audit). Matches Kuelz (verbing), Hades (writing as feedback), Shadow of Mordor (named-enemy memory). (Kuelz; Hades; Mordor.)
- Story-bible plan: ship a single frozen NARRATIVE-SPEC.md containing per-character voice guides for AEGIS command, VEX command, and the named enemy ace (speech mannerisms, vocabulary range, taboo words/topics, sample barks), faction fact sheets (AEGIS vs VEX goals, uniforms, naming conventions), and the mission/stinger trigger map. One named owner per character with final-pass authority; no other writer edits that voice.
- Freeze discipline: after localization freeze, narrative changes are continuity-ledger-only — every proposed change must cite the bible line it preserves. Any post-launch content goes into a supplementary layer (side barks, optional intel entries) that deepens but never contradicts the frozen arc, following the live-service retcon-prevention practice.
- Ship-blockers list (hard gates): (a) every mission briefing passes the verbing test — it must reference player verbs (deploy, hold, flank, lose) and set up a rule the stingers pay off; (b) every named-enemy-ace appearance passes the memory test — the ace must reference prior encounters with the player (Shadow of Mordor rule), never reset to a stranger; (c) every victory/defeat stinger fires only post-outcome as feedback, never mid-mission; (d) zero unresolved contradictions between briefings, barks, and stingers in a full script read-aloud (table read).
- Validation pass before ship: run comprehension playtests on the mission-briefing sequence using storyboard/paper walkthroughs with tactics-game players (ask "what's happening / why / what happens next" per mission), plus appeal checks ("how interested are you in what happens next?") across a full mission arc to catch interest drop-off before launch.
- Victory/defeat stinger audit as mechanics-first fiction: like Dark Souls' bonfire and Hades' death reactions, make defeat narratively load-bearing — the named ace's taunts should evolve with the player's win/loss record, and AEGIS command's briefings should acknowledge prior failures. Stingers that ignore the player's actual record are the #1 story gap to eliminate.

## VERIFICATION ROUND 21 (Round 453 — Thu 2026-10-15 ~16:13 EDT)
- New this round (spec only): dialogue plan. Spec has a story-bible plan (round 444) but no dialogue plan — this round adds it (trigger-coverage audit, voice guides, freeze discipline, dialogue ship-blocker list, post-launch narrative ownership). Matches SFWA (narrative QA), Slabinski (concise barks), VoiceDesign (voice audit). (SFWA; Slabinski; VoiceDesign.)
- Run a trigger-coverage dialogue audit: Map every mission briefing line, bark, and victory/defeat stinger to its trigger and verify each fires correctly in context; no dead lines ship.
- Lock voice guides now (AEGIS voice vs VEX voice vs the named enemy ace: diction, cadence, vocabulary, emotional range), audit all existing lines against them, and attach direction notes to every scripted line before the VO/localization freeze.
- Enforce freeze discipline: After localization freeze, any dialogue change requires narrative sign-off plus re-validation of affected triggers and localized strings — no silent edits.
- Maintain a dialogue ship-blocker list: Missing dialogue under any reachable trigger, character-voice contradictions, unlocalized text, and spelling/grammar errors in briefings/stingers block ship; everything else is triaged, not shipped silently.
- Post-launch: assign narrative ownership of every patch's text changes; monitor player reports for misfiring/mistranslated lines; regression-check dialogue triggers after each update.
