# A11y Part 20 (Verification Round 2) — Findings (Round 281)
**Date:** Wed 2026-10-15 ~04:09 EDT · **Source:** live web research (gag, wcag, mdn, naughty dog, dino crawler)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 2)

## A. Mechanics
- Reduce-motion gauntlet (MDN): the OS matrix (Windows 10/11, macOS, iOS, Android 9+, Linux) — toggle each, verify the game boots reduced and EVERY animation source is covered (unit tweens, particles, shake, UI pulses, selection blink). Kill switch must be total, not per-effect.
- Contrast audit (WCAG 1.4.3/1.4.11; GAG): 4.5:1 text, 3:1 UI components. GAG: test palettes with a color-blindness simulator first, then with actual colorblind players. Never essential info by fixed color alone.
- Kill-switch test (WCAG 2.2.2; GAG; TLOU2): 2.2.2 requires pause/stop/hide for auto-starting motion >5s — and explicitly recommends ONE global mechanism over per-element toggles. TLOU2 ships the pattern: dedicated "HUD Flashing: On/Off" + graduated sliders.

## B. Validation
- OS-level reduce-motion (Naughty Dog; Playground): test against real OS flags, not just the in-game menu.
- Real device (Dino Crawler, GMTK 2026): validated with NVDA + TalkBack — real AT on real devices, not emulation.
- Keyboard-only (WCAG 2.1.1): all functionality operable via keyboard. Naughty Dog: full remapping + hold→toggle conversions.
- GAG fail protocol: "If it is not possible to avoid them without harming the game, ensure that adequate and obvious warning is given, and investigate providing an option to disable them." Every unpassable gate gets a documented fallback (warn + disable), not a silent miss.

## C. Techniques
- Full kill switches (TLOU2; GAG): the universal backstop for motion/flash triggers.
- Canvas labeling (MDN): canvas is "just a bitmap... not exposed to accessibility tools as semantic HTML" — implicit role "no corresponding role." Fix = role="img" + aria-label + fallback (what we have).
- Numeric gates (WCAG 2.3.1): ≤3 flashes/sec (red flashes stricter — more sensitive to saturated red); <10° visual field (~25% screen); hard 5s limit on flash sequences.
- Graduated intensity (TLOU2: 1–10 sliders; Celeste: 10% speed steps; Forza: game-speed slider). Graduated > binary.

## D. What to avoid
- "Epilepsy safe" claims (GAG): "the term 'epilepsy safe' must never be used... you risk harming players and risk legal action." Label by what the setting does. (Pokémon 1997: 600+ children in hospital, 3/4 with no prior symptoms.)
- Partial reduce-motion (WCAG 2.3.1): a runtime toggle alone is NOT sufficient for flashing — "the seizure could occur faster than most users could turn it off" → THE CONTENT ITSELF must stay within thresholds. (WCAG 2.2.2: per-element toggles satisfy the letter; a single global mechanism is the expected UX.)
- Unlabeled canvas (MDN): = shipping unlabeled images.
- Color-only signaling (GAG; WCAG 1.4.1): ~8–10% of males have red/green difficulty. Pair symbols with color (Puzzle Retreat, Splatoon, Destiny). Validates our circle-vs-triangle.

## E. Shipped
- TLOU Part II (Naughty Dog): 60+ settings, 3 one-tap presets (Vision/Hearing/Motor), graduated sliders, HUD Flashing toggle, 3 high-contrast modes, motion-sickness suite. Built with disabled consultants incl. Ian Hamilton.
- Forza Horizon 5 (Playground): first AAA with integrated ASL/BSL sign-language cinematics; game-speed slider; a11y prioritized from day one, consultants embedded early.
- Celeste (indie): Assist Mode — granular, unpatronizing, 10% speed steps. GAG best practice for "expose as many variables as possible."
- Dino Crawler (GMTK 2026, solo dev): "There is no 'accessible mode' — the game has one mode, and it works equally for NVDA, TalkBack, and sighted players." ARIA live regions; 3,000 simulated playthroughs for balance. Design a11y in from hour zero.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** WCAG 2.3.1's hard rule — THE CONTENT ITSELF stays within thresholds, not just the toggle.
  1. Flashes: single 0.15s pulse per hit (game.js:1148), "never a strobe" (Round 41). Discrete pulses, not a flashing sequence — well under 3/sec even at max combat density.
  2. No blinking/pulsing UI elements (no selection-ring blink, no banner pulse).
  3. ✧ off kills all flashes anyway (verified Round 254).
  The toggle is the backstop; the content is the compliance.
- **A11Y-SPEC.md:** verification round 2 (below). Spec only, +0 lines. **4,461 lines** (+0).

## F. Sources
gag · wcag · mdn · naughty dog · dino crawler · tlou2 · forza · celeste
