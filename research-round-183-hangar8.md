# Hangar Part 8 (Jam & Validation) — Findings (Round 183)
**Date:** Wed 2026-10-14 ~18:25 EDT · **Source:** live web research (punchev, behler, bromley, ixdf, wayline, itb wiki, riot, ludo.guide, reddit)
**Project:** Mecha Protocol — hangar (Phase 3, pre-jam)

## A. Jam hangar
- PUNCHev (60-second rule; one decision; first win fast; default = good path).
- Behler (jam judges time-limited; simple+polished+instructions beats complex).

## B. Validation
- Bromley (6 players; 2-3 worth it; fix then re-test). PUNCHev (test first 60s hardest).
- Protocol: 5-6 fresh, "deploy and start", think-aloud, <60s via telemetry.

## C. Techniques
- IxDF Progressive Disclosure (staged for config flows; responsive enabling).
- Wayline (guided; tiered; meaningful > many). Pattern: preset screen → full custom later.

## D. What to avoid
- Paradox of choice (analysis paralysis). PUNCHev mistakes (decide before understanding).
- Hidden options (only trap when NEEDED is hidden — our gate is correct).
- Scope creep (4th preset = analysis paralysis).

## E. Shipped
- Into the Breach (tiered: 1 squad → Custom unlocks). LoL (Recommended Items; Item Sets).
- AC6 (deep hangar + test arena; counter-lesson for jam).

## Implemented this round (code)
- **js/data.js:** `recFor` on presets (brawler→M1, skirmisher→M2, bulwark→M3).
- **js/hangar.js:** "◆ FOR Mn" mission tag alongside ★ RECOMMENDED.
- **HANGAR-SPEC.md:** jam decision + rules + validation protocol.
- 4,085 lines (+4).

## F. Sources
punchev · behler · bromley · ixdf · wayline · itb wiki · riot · ludo.guide · reddit
