# Narrative Part 19 (Verification Round 2) — Findings (Round 282)
**Date:** Wed 2026-10-15 ~04:18 EDT · **Source:** live web research (ryan, voiceart, pulsegeek, narrative dept, into the breach)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 2)

## A. Mechanics
- Read-aloud pass (voicebros; voiceart.app): "a dialogue spreadsheet cannot show whether a bark collides with combat, whether a tutorial prompt outlasts its animation, or whether two characters sound too similar. Temporary spoken lines make those problems audible during development." AI self-recording = the read-aloud pass. Play all 106 back-to-back in act order + a full combat session; listen for collisions, drag, voice drift.
- Trigger audit (r/narrativedesign; natetamwriting; pulsegeek): the pro pipeline is trigger-first — spreadsheets led by the stimulus column ("combat damage taken"), then the line, then VA notes. pulsegeek's runtime side: "timing windows, category cooldowns, and priority rules that reduce overlap." The audit must verify: every trigger ≥1 line; every line maps to a defined trigger; cooldowns + exclusionary-conditionals resolve with no category overlap.
- Quote check (Ryan, SFWA): "plot inconsistencies, discrepancies in character voice, odd leaps in plot logic or dialogue, and/or missing dialogue," plus spelling/grammar and proper-noun consistency (ArenaNet: "no detail was too small").

## B. Validation
- Big Skip test (MY.GAMES 2025): "reading dialogues very often becomes a chore... it loses player focus." Keep it short, highlight the important stuff, "let them skip it." Validation: full run skipping every dialogue element — the game must still be playable; all essential info survives via UI/mechanics.
- Ladder regression (SFWA): "ever-evolving" QA — after ANY narrative/trigger change, re-run the full act ladder 1→6 in order (bark changes cascade: cooldowns, act-scoped flags). Barks.audit() = the automated half.
- 95% rule (pulsegeek): professional QA measures coverage — what fraction of lines/branches were actually exercised. ≥95% verified by read-aloud + trigger audit; the rest = documented explicit exceptions, never silent gaps.

## C. Techniques
- Trigger-first writing (Narrative Dept): "What is STIMULATING the bark?" — stimulus defined before the line exists, "because the words change based on what they are responding to." = our write-from-trigger pillar.
- Name-tag discipline: speaker/trigger/VA notes in metadata columns — never inside the line text. Lines carry voice only; attribution lives in data. (Drift breaks UI nameplates and parsers.)
- AI as self-recording (voiceart.app): "a casting and timing workspace for original characters" — hear lines before committing. Pro pattern: hear every line in-voice before lock, zero marginal cost per iteration.

## D. What to avoid
- Post-lock rewrites (Ryan's jam rule): "Know your scope and fit your story inside your scope... don't feature creep your narrative." Post-lock = deletions + timing only.
- Untested triggers (pulsegeek; SFWA): "missing dialogue" and "odd leaps in plot logic" are QA's core finds. An untested trigger = a missing line at runtime.
- Name-tag drift (SFWA): proper-noun drift = a real bug class.
- Scope creep (Ryan): narrative built only from the existing "narrative thruline." 106 barks / 6 acts / 36 AI lines = a full plate.

## E. Shipped
- Into the Breach (Subset): pilots.csv ships "profile and personality dump on each character" (Avellone); DeepWiki: "unique dialogue responses to game events" — personality carried entirely by short trigger-bound lines, not cutscenes. (Even distinguishes "Basic AI Pilots" — parallels our 36 AI lines.)
- Banner Saga (Stoic): "narrative stakes are embedded in tactical choices — story IS roster management." Tiny team, epic scope, no epic writing volume.
- FTL (Subset): "at its best when you're telling stories" — compact random-event system (trigger → text → choice) generates endless emergent narrative. A small audited trigger-driven set beats a sprawling one.

## Implemented this round
- **STATIC COVERAGE CHECK (js/barks.js, pulsegeek):** the audit's missing half. `Barks.audit()` = dynamic (fire rates per session). New `Barks.coverage()` = static: every trigger in BARK_COUNTS must resolve ≥1 line in i18n (`bark.<trigger>.<pilot>.<n>`); reports GAPS vs OK per trigger. Run in the console before lock. Verified: all 10 triggers resolve lines in i18n — NO GAPS. +18 → **4,479 lines**, all clean.
- **NARRATIVE-SPEC.md:** verification round 2 (below).

## F. Sources
ryan · voiceart · pulsegeek · narrative dept · into the breach · banner saga · ftl
