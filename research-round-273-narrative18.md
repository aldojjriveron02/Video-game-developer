# Narrative Part 18 (Final Lock) — Findings (Round 273)
**Date:** Wed 2026-10-15 ~03:01 EDT · **Source:** live web research (avellone, beaulieu, goldfire, stuart, ryan)
**Project:** Mecha Protocol — narrative (pre-jam; final lock)

## A. Mechanics
- Read-aloud pass (Indie Dev Guide; Aivis): read dialogue out loud; if it sounds awkward, revise. Placeholder voices early reveal timing problems ("it looked short in the subtitles, but it's long when spoken"). For us: all 106 barks + 36 AI lines aloud (or via AI self-recording) before lock; flag anything that drags or outlasts its trigger window.
- Trigger audit (Beaulieu): barks = systemic design — write from trigger lists, write variations per trigger, because barks inform the player about gameplay. Precedent: Into the Breach — Avellone used exclusionary conditionals so a pilot would never "cheer about a kill on the same turn that a fellow pilot dies." Enumerate every trigger, force-fire each in-game, confirm right line + no wrong-state fires.
- Quote check (Ryan, SFWA): narrative QA covers plot inconsistencies, character-voice discrepancies, odd leaps, missing dialogue, and — explicitly — spelling, grammar, punctuation. Brief QA with detailed guidelines; 95%+ clean before lock.

## B. Validation
- Big Skip test (Stuart, Guardian): skippable cutscenes get skipped (Elden Ring); Half-Life/Firewatch survive because story is delivered without stopping play. Play the whole game skipping everything — if the narrative lands through barks/taunts alone, it survives. Barks are skip-proof by design.
- Ladder regression (Ryan): one full playthrough per act (1–6) after every build change. Fixing a late-act bug must not break an act-1 bark.
- 95% rule (GoConsensus VO prep): "Double — no, triple check your script" before recording locks. 95%+ typographically clean; the rest known-and-logged, not unknown.

## C. Techniques
- Trigger-first writing (Avellone): "driven by mission parameters, objectives, and designing scripting calls that refer to gameplay actions... Once the scripting foundation is poured, the actual writing work begins." = our write-from-trigger pillar.
- Name-tag discipline (Avellone): scripting tokens (_full, _last, _self, _squad, _corp) instead of hard-coded names. Ryan's GW2 QA: "no detail was too small." Single no-name-tag convention across all 142 lines, verified by audit.
- AI as self-recording (GoldFire Studios; IGDA): route all dialogue through TTS placeholder VO to test flow, pacing, logic before actors. Validated: TTS read-aloud catches rhythm/timing/trigger-logic problems the silent page hides.

## D. What to avoid
- Post-lock rewrites (GoConsensus): most expensive changes in narrative (re-recorded audio, re-timed animation, re-translated strings). Post-lock = deletions + timing only. A rewrite = a deletion-scoped bug fix.
- Untested triggers (Avellone): lines that never fire = dead writing; lines that fire wrong = narrative bugs. Beaulieu's warning: Skyrim's "arrow in the knee" — frequency without variation discipline becomes mockery.
- Name-tag drift (Ryan): convention + audit, or drift is inevitable.
- Scope creep (NarraScope jam sticky): keep under 5000 words; design the mechanic first, then write to emphasize it. 142 lines is within discipline — don't grow it in the final 48h.

## E. Shipped
- Into the Breach (Subset 2018, Avellone): time-travel framing + mission-parameter-driven pilot barks with scripting tokens + exclusionary conditionals. Tiny line count, every line contextual.
- Wildermyth (GDC 2022): procedural comic-panel storytelling — personality tags + event triggers generate story never hand-written. The extreme bark-trigger system.
- FTL (Subset 2012, Avellone): short text-event vignettes, self-contained, skippable. ~100 short well-gated lines can carry a whole game.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** exclusionary conditionals are STRUCTURAL. VEX victory taunts fire on `atk.isAce` (ace kills); VEX defeat lines fire on `def.isAce` (ace dies). Opposite sides of the same event — they cannot cross. First-kill cheer (player kills) and ally-down (player mech dies) are likewise mutually exclusive per event. Avellone's rule satisfied by event structure.
- **NARRATIVE-SPEC.md:** final lock (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
avellone · beaulieu · goldfire · stuart · ryan · into the breach · wildermyth · ftl
