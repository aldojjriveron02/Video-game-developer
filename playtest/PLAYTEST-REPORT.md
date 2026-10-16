# Mecha Protocol — Scripted Browser Playtest Report
**Date:** Tue 2026-10-13 ~23:25 EDT · **Method:** headless Chromium (Puppeteer, pipes) driving the real game with synthetic pointer input at mobile viewport 390×844 · **Script:** `playtest/playtest.js` · **Shots:** `playtest/shots/`

## Flow verified end-to-end
Welcome ("Show me the ropes") → briefing → M1 battle → coach move → mech move → end turn → enemy phase → turn 2 → select → forecast (limb picker) → FIRE → damage applied → undo → help → JP toggle → speed toggle → perf HUD. **Zero JavaScript errors.**

## Bugs found and fixed
1. **Welcome/help overlays rendered UNDER the canvases** — `#welcome-screen` and `#help-screen` were missing from the overlay positioning rule. First boot showed a dead screen (welcome invisible, buttons unclickable). Fixed in CSS.
2. **Line-of-sight only allowed orthogonal + perfect-diagonal** (`hasLine`) — combined with manhattan weapon ranges, most attacks could never target. The game's core verb was broken. Replaced with Bresenham LOS (blocked only by `blocksSight` terrain; none exists yet → open desert reads open).
3. **Coach mark (z-60) floated above the help overlay (z-10)** and ate its clicks — lang/speed buttons appeared dead. Added `Tutorial.suspend()/resume()` + MutationObserver on all full-screen overlays; coach also suspends while the forecast panel is open.
4. **"Got it ✓" button had `pointer-events:none`** (inherited) — visible but unclickable. Fixed in CSS.
5. **favicon 404** — added inline SVG data-URI icon.

## Remaining console noise (not bugs)
- `fonts.googleapis.com` / `unpkg.com/gameanalytics` fail in the sandbox (no proxy in headless env); load fine on real devices. GA is guard-wrapped.
- `audio/hangar.ogg` / `audio/battle.ogg` 404 — expected until Aldo picks tracks (Music engine is a silent no-op).

## Screenshots
1-welcome, 2-briefing, 3-coach-move, 4-after-move, 5-forecast, 6-after-attack, 7-enemy-phase, 8-turn2-intents, 9-help, 10-japanese, 11-perf-hud — all in `playtest/shots/`. Game renders correctly: grid + coordinates, paper-doll mechs, intent lines, coach ring, forecast panel, damage floaters, particles.

## Honest note
The -52px canvas offset seen mid-test was a headless-Chromium viewport quirk; the game reads the live bounding rect for input, so real taps are unaffected. The harness now uses the live rect too.
