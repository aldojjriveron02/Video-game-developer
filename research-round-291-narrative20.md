# Narrative Part 20 (Verification Round 3) — Findings (Round 291)
**Date:** Wed 2026-10-15 ~05:06 EDT · **Source:** live web research (thomas, mikkelson, simpson, bateman, advance wars)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 3)

## A. Mechanics
- Static coverage check (Thomas, PatterKit, Jul 2026): "narrative QA that a build server can enforce" — walks the story thousands of times with random choices; flags unreachable beats, choices that ran dry, lines gated behind conditions that never fire. ChoiceScript has shipped automated random testing for years. Our Barks.coverage() = the same pattern: enumerate every trigger × bark pair, prove reachability.
- Read-aloud pass (Bateman; Bender; Voices.com): have someone ELSE read your script aloud to you — different readers interpret lines differently than the author intends. Writing for the spoken word differs from silent reading; reading aloud exposes flow problems silent review misses. Two-layer: author reads aloud, then a second person reads it back cold.
- Quote check (Thomas): line-by-line verification of implemented text against the locked script. Tracking writing status + recording status as separate states per line, anchored by stable permanent line IDs that survive text changes and anchor audio + localization. Pro rule: conditionals key off IDs; display text diffed verbatim against the lock. 95% verbatim-match + 5% tolerance for deliberate in-engine tweaks.

## B. Validation
- Big Skip test (MY.GAMES 2025): the "serial skipper" — design two parallel experiences. Skimmers: brief dialogue, typographic emphasis on key words, clean skip controls, post-skip summaries (AFK Journey's scene summaries). Engagers: full read + recap tools. Validation: skip everything; confirm (a) skipping is clean, (b) nothing mechanically essential was dialogue-only, (c) barks still land in context.
- Ladder regression (Thomas; ChoiceScript): automated randomized regression — re-run the narrative suite on every change at increasing depth. "Narrative QA that a build server can enforce." For us: audit() + coverage() on every commit; reachability = pass/fail. Rungs: commit → nightly full walk → pre-lock freeze sweep.
- 95% rule (Thomas): numeric quality gates enforced mechanically (coverage thresholds on builds). ≥95% triggers reachable; ≥95% bark text verbatim against the lock. The number matters less than making it a gate, not an aspiration.

## C. Techniques
- Trigger-first writing (Mikkelson 2020): start bark brainstorming from verbs — "what the NPC is doing, whether the player just interrupted, distracted, or startled them." Player-action barks should give the player information. Barks = "the clearest and easiest tool we have" to reinforce goals; goal-related barks must not muddy objectives. Author the trigger condition first, then write the line the trigger earns.
- Name-tag discipline (Thomas): stable line IDs as the permanent identity; audio, localization, and logic anchor to the ID, never to a display name. = our no-name-tag rule (structural: IDs, not names).
- AI as self-recording (Simpson 2022; Despain): automated TTS pipeline to "quickly get a feel for the flow and pacing of a scene" — stayed in the free tier. Despain: pro studios use robotic voices so writers hear approximations in-game. Thomas's counterpoint: prefers human scratch recordings over TTS. Pro synthesis: TTS for coverage-scale sweeps (all 106), human read-aloud for final lock.

## D. What to avoid
- Post-lock rewrites (Play Journal; gamedevproducer): feature-freeze as a hard deadline; signed-off freeze list before final milestones. Narrative equivalent: no silent edits — every change = a versioned amendment that re-runs the audit + coverage gates.
- Untested triggers (Thomas): coverage tester catches "conditions that never fire." A bark whose trigger can't occur in real play = dead code. The audit must prove each trigger fires in actual play, not just that the conditional compiles.
- Name-tag drift (Thomas): renaming/reassigning speakers — or keying logic to display names — silently breaks conditionals + localization. Stable IDs = the prevention.
- Scope creep (Innovecs): scope arrives as "five small ones," not one big idea. Defense: freeze discipline + new barks enter only through spec amendment, never drive-by.

## E. Shipped
- Into the Breach (Subset; Avellone): sparse storytelling — zone leaders' briefings + pilot barks. "Extreme brevity matched the roguelike loop — a tiny team got maximum character per line." Tradeoff: no strong finale "off ramp."
- Tactical Breach Wizards (Suspicious): shoestring budget, no VO, no cutscene animation — narrative lands through character "dreams" + optional missions. "Specificity and comedy carried the character work that budget couldn't." Writing quality substituting for production values. Directly jam-applicable.
- Advance Wars (Intelligent Systems): CO banter = trigger-first bark writing in a shipped tactics game. "Every line is context-reactive — the player's tactical action triggers the character's voice." = our exclusionary-conditional model.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** stable line IDs (Thomas). Our bark keys `bark.<trigger>.<pilot>.<n>` ARE permanent IDs — the key (trigger+pilot+index) is the identity; the text (value) can change without breaking anything. Conditionals reference triggers (IDs), never display text (barks.js:145). Speaker names resolve at display time from pilot index (presentation-layer). Renaming a pilot cannot break or misroute a trigger. The no-name-tag rule is structural, not conventional.
- **NARRATIVE-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
thomas · mikkelson · simpson · bateman · advance wars · into the breach · tactical breach wizards
