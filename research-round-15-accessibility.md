# Accessibility at $0 — Findings (Round 15)
**Date:** Tue 2026-10-13 ~21:11 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Protocol prototype — accessible from the start, not as an afterthought

## A. Colorblindness
- **~1 in 12 men (8%), ~1 in 200 women** — ~300M people (Colour Blind Awareness). ~99% of cases are red-green types (deuteranopia/protanopia/anomalous); tritanopia rare, not sex-linked. → Optimize for red-green first.
- **Rule #1 (Game Accessibility Guidelines):** never convey essential info by fixed color alone — pair every color cue with symbol/icon/pattern (double-coding).
- **Okabe-Ito palette** (the standard): orange #E69F00, sky blue #56B4E9, bluish green #009E73, yellow #F0E442, blue #0072B2, vermillion #D55E00, reddish purple #CC79A7. Use these hexes instead of inventing colors.
- Presets: deuteranopia/protanopia/tritanopia modes (EA: "over half a million current Madden NFL users are colorblind" — why they ship modes; Splatoon's colour lock = best practice). Test with a free simulator before shipping.
- **Tactics-specific** [synthesis]: team colors (red-vs-blue fails — add faction icons/shapes); range highlights differ by pattern/outline not hue; terrain = icon + color.

## B. Text and UI
- Canvas text is invisible to screen readers (MDN); fallback/ARIA needed for full compliance.
- **16px minimum body text** on phones (also prevents iOS Safari auto-zoom on fields <16px).
- WCAG: 4.5:1 contrast normal text, 3:1 large; resizable to 200%.
- Canvas-text fixes [synthesis]: render at devicePixelRatio (no retina blur); ship a UI text-size multiplier (OS settings can't enlarge canvas text); text outlines/shadows + solid backing panels over busy tiles.

## C. Motor accessibility
- Targets: Apple 44×44pt, Material 48×48dp, WCAG 24px min / 44px AAA. A finger is ~11mm — chunky tiles or zoom on phone grids.
- **Hit-slop/tap-radius tolerance** (accept near-miss taps — a few lines of code); tap-tap instead of drag; well-spaced slots.
- **Undo = accessibility feature:** Into the Breach's one-reset-turn-per-battle converts mis-taps from game-losing to consequence-free.

## D. Cognitive load
- Plain language, consistent UI, teach-as-you-play. **Turn-based = structural advantage: no time pressure.**
- Undo/reset lets players experiment without fear; **enemy-intent telegraphing offloads working memory** — the tactics-specific cognitive win.

## E. Photosensitivity
- **WCAG 2.3.1 (hard line): ≤3 flashes in any 1-second period.** GAG: avoid 2–55Hz flicker over large areas; ~1 in 4000 have photosensitive epilepsy.
- Safe line for juice [synthesis]: shake subtle + toggle; hit-stop fine (not flashing); impact flashes = 1–2, small-area, never full-screen white/red; **one "reduce effects" toggle** (kills shake + flashes) — near-zero cost. PEAT tool scans gameplay video [unverified].

## F. What indie devs actually do
- **Into the Breach:** colorblind mode (attack highlight red→pink), one reset turn per battle, larger text. Perfect-information grid = textbook tactics accessibility.
- **Celeste Assist Mode philosophy:** expose difficulty levers (speed 50–100%, invincibility, stamina, dash assist, chapter skip) — not one "easy mode."
- Splatoon colour lock; EA's 500k colorblind users.

## G. Prioritized checklist (5 cheapest, in order)
1. **Colorblind-safe palette + double-coding** — Okabe-Ito hexes; faction = icon/shape + color; ranges differ by pattern; terrain icon + color. (~an afternoon)
2. **Forgiving touch** — ≥44pt targets, hit-slop, tap-tap not drag.
3. **Readable scalable canvas text** — DPR rendering, ≥16px, 4.5:1, size multiplier.
4. **Undo/reset turn** — ✅ already shipped (one full-turn rewind/mission).
5. **Photosensitivity audit + effects toggle** — ≤3 flashes/sec, no full-screen white/red, subtle shake, one boolean toggle.

## Applied to Mecha Protocol (implement-immediately, this round)
- Palette: player cyan #2de2e6 → Okabe-Ito sky blue #56B4E9; enemy red #ff5d5d → vermillion #D55E00 (colorblind-safe pair).
- Faction badges: ● player / ▲ enemy shapes above every mech (double-coding, never color alone).
- Hit-slop: taps within 8px of a tile edge count (forgiving touch).
- "Reduce effects" HUD toggle (persisted): kills screen shake + impact flashes + banner animation; particles halved. Photosensitivity-safe by default (single 150ms small-area flash, ≤14px shake).
- Undo already shipped ✅.

## H. Sources
gameaccessibilityguidelines.com (full list + color rule) · colourblindawareness.org · iristech.co · wearecolorblind.com · conceptviz.app + siegal.bio.nyu.edu (Okabe-Ito) · w3.org/WAI/WCAG22 (2.5.8 target size, 2.3.1 flashes, 1.4.3 contrast) · developer.mozilla.org (canvas a11y) · pauljadam.com · celeste.ink/wiki/Assist_Mode · gamecritics.com (ItB colorblind mode) · bigbossbattle.com (ItB text/QoL)
