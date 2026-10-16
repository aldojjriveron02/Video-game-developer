# A11y Part 15 (Browser Game Accessibility) — Findings (Round 236)
**Date:** Wed 2026-10-14 ~23:00 EDT · **Source:** live web research (mdn, w3c, nngroup, xbox, gag, naughty dog)
**Project:** Mecha Protocol — a11y (FROZEN; GO CONFIRMED; verification only)

## A. Mechanics
- Canvas problem (MDN): canvas "is just a bitmap and does not provide information about any drawn objects" — SR sees one opaque element. Pro pattern: shadow accessible tree (visually-hidden DOM mirroring game state) + canvas presentational.
- aria-live: ONE region, empty on load, aria-atomic="true". polite = routine (moves, turns, damage); assertive = urgent only (unit death, checkmate threats). Never announce more than every few seconds — batch rapid events ("3 units moved"); never point at a constantly-updating counter. (MDN; A11Y Collective; rightsaidjames)
- Keyboard grid play (W3C APG Grid Pattern): roving tabindex, arrows move, Enter/Space select, Escape cancel, documented shortcuts + visible key list.
- Focus: move into dialog on open, return on close, visible indicator always, never trap (WCAG 2.1.2).

## B. Validation
- "GO CONFIRMED" = checklist against published standard. Models: Xbox Accessibility Guidelines (XAGs) + MGATS testing service; Game Accessibility Guidelines basic/intermediate/advanced tiers (basic = minimum any game should meet = jam 10-point pass).
- Automated (axe/Lighthouse/contrast) catches only ~25–30% — canvas logic, live-region timing, keyboard flow are invisible to tools. Manual passes mandatory.
- SR testing: NVDA + VoiceOver. Breaks in practice: regions talking over themselves, mirror DOM out of sync, widgets not in tab order, focus lost on overlay. Rule: play the whole core loop with screen curtained.
- Photosensitivity: WCAG 2.3.1 — no more than 3 flashes in any 1-second period. PEAT (TRACE Center, free) analyzes video captures. Jam protocol: record busiest combat, run PEAT, cap <3 flashes/sec, no large-area saturated-red.
- Colorblind: simulate deuteranopia/protanopia/tritanopia; states distinguishable without color (WCAG 1.4.1).

## C. Techniques
- 10-point jam pass (GAG basic tier): (1) keyboard-only full playthrough; (2) visible focus always; (3) no traps; (4) live-region for all state changes; (5) 4.5:1 contrast; (6) no color-only indicators; (7) no flash >3x/sec; (8) no hover-only info; (9) simple/remappable controls; (10) text to 200%.
- Remapping: full remap, one-button play where feasible, adjustable sensitivity.
- Audio→visual: every gameplay sound gets a visual equivalent (damage direction, offscreen icons, captions). TLOU2 enhanced listen mode = gold standard (enemy positions as screen pings).
- Assists as accessibility: Celeste Assist Mode (granular, shame-free, no content gated). Tactics version: undo, slower enemy turns, suggest-move hints.
- Text scaling: WCAG 1.4.4 — 200% readable, no clipping; canvas HUD text from scalable setting.
- Reduced motion: honor prefers-reduced-motion (matchMedia) + in-game toggle; kill shake/parallax/zoom, use fades/cuts.

## D. What to avoid
- Canvas with zero accessible alternative (#1 web-game a11y failure).
- Hover-only info (WCAG 1.4.13: dismissible, hoverable, persistent; keyboard focus triggers same).
- Color-only indicators (pair with shape/icon/text).
- Flashing without caps (WCAG 2.3.1).
- Tiny/non-scalable text (canvas fixed-pixel text).
- Keyboard traps (always Escape + focus return).
- "Accessible = screen reader only" (motor/cognitive/low-vision equally).
- Bolted-on untested a11y (definition of done = GO CONFIRMED before lock).

## E. Shipped
- The Last of Us Part II (Naughty Dog 2020): 60+ settings, full SR narration, high-contrast mode, enhanced listen mode. Co-designed with disabled consultants. Most accessible game of 2020 (CanIPlayThat).
- Celeste (2018): Assist Mode — granular, dignified, never gates content. Proved assists widen audience without diluting design.
- Gears 5 (2019): blind navigation ping system + SR menus, co-designed with blind consultant Brandon Cole.

## Implemented this round
- **Verified (code read, no changes — FROZEN):** announce() = single polite region, aria-atomic="true", clear-then-set via rAF (standard re-announce); wired to turn changes + barks only (naturally throttled by game pace — no per-frame spam). prefers-reduced-motion honored at boot (game.js:177 → FX defaults reduced) + 3-state shake toggle ✦/◐/✧ (Round 214). Research's two cheapest high-impact assists already in.
- **A11Y-SPEC.md:** 10-point pass as literal jam-day checklist (ordered); aria-live contract (one polite region, batch ~2s, assertive reserved); numeric gates (contrast checker receipt + PEAT run receipt); SR playthrough protocol (NVDA/VoiceOver, curtained, full mission).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
mdn · w3c · nngroup · xbox · gag · naughty dog · celeste · gears
