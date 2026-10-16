# Narrative Part 23 (Verification Round 6) — Findings (Round 318)
**Date:** Wed 2026-10-15 ~06:49 EDT · **Source:** live web research (ryan, crawford, slabinski, valve)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 6)

## A. Mechanics
- Voice-consistency audit (Ryan, SFWA): "a narrative QA pass looks for plot inconsistencies, discrepancies in character voice, odd leaps in plot logic or dialogue, and missing dialogue." Proper nouns verified — "no detail was too small." Audit = named checklist against the voice bible, not vibes.
- Trigger-coverage audit (Crawford): "dialogue systems should be tested early with all features in place." "Nothing is worse than a programmer telling you cue enums must be specified by you, and you didn't include it." Every concept wired to a trigger and fired in testing.
- Localization audit (Game Developer): "build a glossary first; annotate every string with context; enforce encoding and placeholder rules; run linguistic testing." "Plan for ~30% text expansion." Freeze + per-string comments = audit trail.

## B. Validation
- Voice-actor table reads (Crawford): "scripts must include VO direction and context; session time is finite; book pick-up sessions." Read-through every line aloud (temp VO first) before final — catches clunky timing and voice drift.
- Localization QA: dedicated pass with terminology tools, played builds, context notes — "not a spellcheck afterthought."
- Player comprehension (McAloon; Slabinski; Ryan): Supergiant used Early Access as live narrative playtest — "watching how players actually encountered story beats." Slabinski: "95% of people won't remember a thing — validate that the moment lands, not that the lore is complete." Ryan: brief QA on specific targets; warn about known issues.

## C. Techniques
- Character bibles (Crawford; Slabinski): "writing docs must include world and character descriptions that travel to VO sessions." Slabinski: "character above all else." Voice bible = diction, attitude, taboo phrases per speaker.
- Contextual variation (Valve; Ruskin): Response System — "concepts matched against criteria about speaker and world state, selected by rules into response groups." Ruskin: "fuzzy criteria matching lets writers iterate freely and stay autonomous."
- Economical writing (Slabinski; Crawford): "cut a 62-word passage to 20 words with no loss." Crawford's 80/20: "80% of players will never hear some percentage of the dialogue, so prioritize toward the most-heard lines."
- Honest scope (Slabinski; Crawford): "don't force lore." "Barks are a deadly art — never a crutch for weak visual storytelling." Scope word count to what players actually hear.

## D. What to avoid
- Voice drift (Ryan; Crawford): "character-voice discrepancies are among the top things narrative QA flags." "Without a locked bible and directed sessions, ensemble bark writing drifts."
- Untriggerable lines (Crawford): "lines written without a verified trigger path are wasted VO and script cost." The ≥95% coverage gate is the antidote.
- Translation breakage: "bare strings with no context, misused placeholders, ignored encoding, UI built for English lengths." Even EN-only: missing comments + unstable IDs = future breakage.
- Bloat (Slabinski; Crawford): "overwritten dialogue, forced lore, barks patching storytelling holes." "Ignoring the 80/20 — spending the word budget on lines almost nobody hears."

## E. Shipped
- L4D1/2 (Valve): Response System — "concepts, criteria, rules, response groups — survivors' barks reacted to the AI Director's live game state." "Writer autonomy through the system."
- Hades (Supergiant): Kasavin — "thousands of contextual, reactive lines with narrative events weighted so story surfaced across repeated runs." "Reactivity was an explicit design goal, validated through Early Access."
- Firewatch (Campo Santo): "the entire story around two characters' walkie-talkie dialogue." "Honest scope — the writing budget went into depth of one relationship instead of breadth."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** Crawford's 80/20 rule. High-frequency triggers (firstkill, limblost, overheat, heat50) get 3 variants × 3 pilots (36 lines) — where repetition irritates. Low-frequency (start, allydown, clear, vexrumor) get 1-2 variants. VEX signature: intentionally ONE line (GLaDOS pattern — "Memorability through recurrence, not variety"). No bloat; Beaulieu rule applied where it matters, discipline everywhere else.
- **NARRATIVE-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
ryan · crawford · slabinski · valve · l4d · hades · firewatch
