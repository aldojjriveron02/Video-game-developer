# A11y Part 14 (Pre-Jam Freeze) — Findings (Round 221)
**Date:** Wed 2026-10-14 ~21:38 EDT · **Source:** live web research (gag, w3c, goyomi, gmtk, scott)
**Project:** Mecha Protocol — a11y (Phase 3, pre-jam)

## A. Jam a11y
- Scott (35 jammers; scaffold + freeze, not invent).
- GGJ diversifiers (4.5:1; top-4; configurable; Easy-read; Hands Off).
- Top-4 complaints (controls; text size; color; subtitles).

## B. Validation
- GAG Basic (30 items; flicker 3×/s; 28px; 4.5:1).
- W3C Easy Checks (10-point freeze pass).
- Touch targets (44pt Apple; 48dp Android).

## C. Techniques
- GoYomi (keyboard; aria-live; semantic buttons; vanilla JS).
- itch taxonomy (125 games; 8 features).
- GAG (subtitles + speaker ID; separate volume; no simultaneous).

## D. What to avoid
- "epilepsy safe" (never). Frozen-system changes.
- Bolt-on untested modes. Missing bark/telegraph captions.
- Autostart. Blocking OS a11y. Difficulty ≠ a11y.

## E. Shipped
- GoYomi (reference). Guacamelee!/Lovers (text). Journey (visual audio).
- Evil Glitch (js13k→Steam). GGJ18 cohort.

## Implemented this round (code)
- **index.html:** #sr-announce aria-live region.
- **js/game.js:** Game.announce() + turn announcements.
- **js/barks.js:** bark announcements.
- **A11Y-SPEC.md:** freeze discipline + 10-point pass.
- 4,271 lines (+12).

## F. Sources
gag · w3c · goyomi · gmtk · scott
