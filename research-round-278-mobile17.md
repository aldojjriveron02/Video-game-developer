# Mobile Part 17 (Verification Round 2) — Findings (Round 278)
**Date:** Wed 2026-10-15 ~03:43 EDT · **Source:** live web research (abratabia, chan meng, mdn, egmatic, playgama, nixiefx)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 2)

## A. Mechanics
- Real-iPhone smoke (Abratabia; Nixiefx): debug on device (Safari Web Inspector, chrome://inspect); record a Performance trace while playing on the phone; hunt GC segments + long tasks inside frames. Smoke = fresh-load → tap-to-start → play → rotate → background/foreground.
- URL-bar geometry (dev.to; Abratabia): 100vh jumps when the URL bar shows/hides; keyboard eats ~40% of visual viewport. Fix = visualViewport resize (+ window resize) + re-layout, debounced. Canvas sized to innerWidth/innerHeight × DPR (capped).
- Gesture-layer audit (MDN; Abratabia): preventDefault on touchmove; always handle touchcancel (fingers slide off → stuck state if ignored). Modern stack: Pointer Events + touch-action:none + multi-touch by pointerId in a Map. Audit every layer: no gesture leaks, cancel paths handled, multi-touch correct.

## B. Validation
- One real iPhone (Playgama/Chen): "The most revealing insight came when we tested on actual devices rather than emulators." Device matrix (iOS + Android, phone + tablet).
- Zero console errors (Playgama): clean console on the REAL device, not just desktop Chrome.
- Zoom attempts (Paulau 2026): test on an actual iPhone — iOS ignores viewport meta zoom locks (WebKit, iOS 10+). Zoom attempts = mandatory test step.
- Ringer-switch audio: hardware switch ON, first tap → audio must play through the playback channel.
- Thumb pass (Egmatic): (1) one-thumb run of every core interaction, (2) grip-shift audit, (3) small-device pass. Controls min ~60–90px, bottom-anchored, generous hit areas.

## C. Techniques
- dvh + visualViewport: 100vh is a lie on mobile. dvh tracks chrome; visualViewport.resize drives canvas layout (debounced).
- touch-action discipline (Paulau): touch-action:none on canvas = the modern robust gesture kill. MDN: preventDefault on touchmove for legacy paths.
- Safe-area insets (WebKit iPhone X): viewport-fit=cover → page extends under notch/home indicator; pad UI with env(safe-area-inset-*). Without cover, insets = 0. Canvas may bleed under bars; UI chrome must respect env().
- audioSession playback (bugnet; lans.cloud; feross/unmute-ios-audio): promote Web Audio to the playback channel — bypasses the mute switch. Abratabia's unlock ritual: create early, resume() in first tap handler, decode SFX to buffers, loop music via GainNode.

## D. What to avoid
- Simulator sign-offs (Playgama; Abratabia): emulators miss real geometry, gesture, audio behavior.
- 100vh layouts (URL bar slides → layout jumps mid-game).
- Viewport-meta-only zoom lock (ignored by modern iOS; denied for a11y on Android).
- HUD in the bars (notch, home indicator, URL bar = hidden controls).
- Late bolt-on mobile (Chan Meng; Abratabia): "mobile isn't about discovering new APIs; it's about respecting the constraints." Design in from the start.

## E. Shipped
- Starlight Breaker (Chan Meng, 2026): vanilla-JS canvas brick-breaker, mobile-ready from the start. Resolution tiers by viewport width (debounced resize); touch coordinates corrected via getBoundingClientRect ratios; controls bottom-center ≥90px; rotation prompt + first-play touch guide; haptics via Vibration API. Validated across Chrome/Edge/Firefox/Safari (iOS+macOS)/Samsung Internet.
- js13k 2024 postmortem (serverboi): even jam-scale web games need dedicated mobile work. Mobile = the part teams under-budget.
- nixiefx (2025): profiled on real devices — stutter was GC pressure + long main-thread tasks, not GPU. Fixes: cap DPR ~2, preallocate, zero-allocation hot paths, batch draws.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):**
  1. pointercancel handled (game.js:164-167, Round 170) — deselects on cancel, no stuck state. (MDN.)
  2. Touch coordinate correction via getBoundingClientRect (game.js:891) — CSS/canvas scaling corrected. (Starlight Breaker pattern.)
  3. Hit-slop: 8px near-miss taps count as edge tiles (game.js:894) — thumb-friendly. (Egmatic.)
  4. audioSession playback (Round 198); no text inputs in jam path; visualViewport resize + scroll (Round 260).
  5. No-inputs rule is LOAD-BEARING: virtual keyboard eats ~40% of viewport, breaks the 16:9 letterbox. Not cosmetic.
- **MOBILE-SPEC.md:** verification round 2 (below). Spec only, +0 lines. **4,461 lines** (+0).

## F. Sources
abratabia · chan meng · mdn · egmatic · playgama · nixiefx · starlight breaker
