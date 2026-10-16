# Narrative Part 24 (Verification Round 7) — Findings (Round 327)
**Date:** Wed 2026-10-15 ~07:25 EDT · **Source:** live web research (o'connor, wolpaw, hocking, avellone)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 7)

## A. Mechanics
- Pacing audit (Game Narrative Toolbox): "list every triggered line in mission order and check the gaps — clusters = noise; long silences = dead air." Fix = trigger-spacing (cooldowns, priority gates), not more lines.
- Exposition audit (Wolpaw): "Doing cutscenes is like admitting defeat — use the environment to tell the story." "Any line that explains rather than reacts is a candidate for deletion. One-line-of-lore-per-line maximum."
- Player-agency audit (O'Connor): "barks are a stimulus/response system. The player 'speaks' through action; the bark is the game talking back." "Audit every line ID: What player action stimulates this bark? If a line fires on a timer with no stimulus, it's decoration, not dialogue."

## B. Validation
- Playtest observation (Bromley): "run moderated one-to-one playtests and watch where attention goes during story moments. Do players read the bark, or keep scanning the grid?"
- Story comprehension: "test comprehension EARLY — even at script level." Three questions: "What is happening? Why? What do you expect next?" "For our barks: can a player state who VEX is, what VEX wants, why pilots fight — from barks alone?"
- Emotional response: "define the EXPECTED emotional response for each beat in advance, then capture whether players actually experienced it." "A player can only experience a story as intended the first time — budget fresh-player playtests."

## C. Techniques
- Environmental storytelling (INSIDE): "zero dialogue, zero text; narrative through staging, animation, sound." Analog: "unit placement, map names, VFX, enemy composition tell story before any line fires."
- Show-don't-tell (Portal; BioShock): "story unfolds inside the levels, with minimal dialogue that each earned its place." "Deliver story through the medium's strengths — through the trigger moment, not explanation text."
- Player-driven narrative (Avellone/ITB): "there is no canonical lore, only possibilities you stitch together." "Pilots' personalities emerge from mechanics intersecting with tiny flavor fragments."
- Restraint (Avellone): "dialogue is scant, every word earned." "One signature line for VEX is correct — scarcity makes a line land. Restraint is ship discipline."

## D. What to avoid
- Exposition dumps (Wolpaw): "a block of text explaining the world is the game admitting defeat." "If it doesn't answer a player action, cut it."
- Ludonarrative dissonance (Hocking 2007): "conflict between story told through non-interactive elements and story told through gameplay." Our version: "VEX taunting 'you are predictable' while AI repeats the same attack; pilot barking 'holding the line!' as player retreats."
- Purple prose: "barks are shouted in a firefight; adjectives die there." "If a line can't be read aloud in under ~3 seconds, too long."
- Story bloat (Avellone): "More lines ≠ more story." "Bible everything, but ship the minimum. Freeze is when research ends and restraint begins."

## E. Shipped
- Into the Breach (Avellone): "dialogue is scant; story through pilots' fragments intersecting with mechanics." "Restraint makes each fragment feel discovered." "Direct model for our pilot barks."
- Portal (Wolpaw): "story through environment with almost no cutscenes." "Scarcity made every line quotable." "Model for VEX: one signature line is enough if the board does the talking."
- INSIDE (Playdead): "zero dialogue, zero text." "If a bark isn't doing something the environment can't, delete it."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** stimulus-mapping. No timer-fired barks — all triggers are player-action/state-change driven (barks.js). Per-trigger cooldowns (Mitchell spacing, barks.js:67) prevent clustering, not decoration. Per-trigger fire counts (Beaulieu, barks.js:68) ensure unmeasured = untested. O'Connor's stimulus/response audit passes: every line answers a player action.
- **NARRATIVE-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
o'connor · wolpaw · hocking · avellone · inside · portal · itb
