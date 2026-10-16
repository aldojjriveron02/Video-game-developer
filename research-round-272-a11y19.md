# A11y Part 19 (Final Verification) — Findings (Round 272)
**Date:** Wed 2026-10-15 ~02:54 EDT · **Source:** live web research (gag, wcag, hamilton, paul j. adam)
**Project:** Mecha Protocol — a11y (pre-jam; final verification)

## A. Mechanics
- Reduce-motion pass (GAG): the setting must apply EVERYWHERE, not just one screen effect — enabling the kill-switch end-to-end, playing the full loop (combat, hitstop, knockback, transitions, UI). GAG's last-48h: review, not new features.
- Contrast audit (WCAG 1.4.3 / Hamilton): ≥4.5:1 text, ≥3:1 large text/UI. Hamilton's jam top-5: "high contrast visuals" + "don't communicate by color alone." Sample every HUD text against actual backgrounds; critical state (turn order, selection, damage) needs a non-color indicator (shape, icon, text).
- Kill-switch test (GAG photosensitivity): with the toggle on, play through — no flashing sequences, no repeated parallax, no auto-motion UI transitions survive. Anything surviving = QA fail.

## B. Validation
- OS-level reduce-motion (Apple evaluation criteria; MDN prefers-reduced-motion): enable in the OS, cold-boot, confirm the game starts reduced without the player touching anything. (Our design: boots to ✧ on OS reduce-motion.)
- Real device (Hamilton; AccessJam): test on a machine that's not the dev's — different screen, brightness, calibration. Keyboard-only playthrough; screen reader over menus where feasible.
- GAG fail protocol: when a guideline can't be met in time, don't stay silent — DISCLOSE. AccessJam: content warnings for triggering content (flashing, jumpscares) ship in the submission. Failed gate = logged as known limitation + content warning, never hidden.

## C. Techniques
- Full kill switches: one master toggle killing trauma, hitstop, knockback, flashes, particles, render scale. GAG motion-sickness guideline: partial toggles (shake off but hitstop still firing) leave vestibular triggers — worse than no toggle (trains users to trust a switch that doesn't protect).
- Canvas labeling (Paul J. Adam): role="img" + aria-label = the accepted minimal technique. All 3 canvases labeled; fallback content inside.
- Numeric gates: hard numbers beat adjectives — 4.5:1, ≤3 flashes/sec (WCAG 2.3.1), no >5s sequences, no >25% coverage.
- Fail protocols: AccessJam model — can't engineer it out → warn for it + point to the mitigating settings.

## D. What to avoid
- "Epilepsy safe" claims (GAG: the term must NEVER be used — no game can guarantee safety; creates liability + false confidence). Use specific claims instead.
- Partial reduce-motion (worse than no toggle).
- Unlabeled canvas (empty void to screen readers).
- Color-only or sound-only signaling (Hamilton flags both).

## E. Shipped
- Celeste (2018): Assist Mode — difficulty-agnostic options, unpatronizing framing. Proved options don't dilute a precision game. The kill-switch template.
- TLOU Part II (Naughty Dog 2020): 60+ settings, 3 one-step presets, high-contrast mode, traversal/combat audio cues. Presets collapse the option space into a 2-minute decision.
- Grounded (Obsidian 2020): Arachnophobia Safe Mode with graduated levels — changes visuals without changing gameplay. The model for graduated intensity.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):**
  1. Non-color indicators (Hamilton): selection = drawn ring (shape); faction badge = circle vs triangle ("shape + color double-coding, never color alone"); attack targets = ring. Satisfied.
  2. No "epilepsy safe" claims anywhere (grep clean). GAG's hard rule satisfied.
  3. Kill switch full (Round 254 verified); canvas labeling done (Round 263); numeric gates in spec.
- **A11Y-SPEC.md:** final verification (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
gag · wcag · hamilton · paul j. adam · celeste · tlou2 · grounded
