# Mobile Part 12 (Mobile Browser Readiness) — Findings (Round 233)
**Date:** Wed 2026-10-14 ~22:45 EDT · **Source:** live web research (mdn, webkit, fozzedout, playkovo, sitepoint, apple, bugnet, chrome)
**Project:** Mecha Protocol — mobile (Phase 1 NOT-ready by design; mobile = post-jam Phase 2)

## A. Mechanics
- Touch model (MDN): touchstart/move/end/cancel on canvas, preventDefault() with {passive:false} to take control. Pointer Events unified model works on iOS 13+ (iPhone 17 target) but Touch Events remain most battle-tested; gesturestart is WebKit-only (no Pointer Events equivalent) — needed for pinch suppression.
- 300ms tap delay: dead on modern iOS — <meta viewport width=device-width> kills it; touch-action:manipulation is the CSS equivalent (Safari-safe route = meta tag).
- touch-action:none on canvas + overscroll-behavior:none + -webkit-user-select:none.
- iOS pinch: iOS 10+ ignores user-scalable=no for accessibility — gesturestart preventDefault is the working lever. Double-tap zoom killed by viewport + touch-action.
- Tactics = direct manipulation (tap-select, drag, no virtual gamepad — that's for action games). PlayKovo: floating joysticks, visible feedback per tap (no hover on touch), controls where thumbs rest.
- 100vh problem: iOS Safari 100vh includes area behind toolbar. window.innerHeight is the reliable dimension source for Safari-hosted games.

## B. Validation
- 4-item gate (synthesis): (1) touch playability — zero hover dependency, ≥44pt targets (Apple HIG); (2) performance/thermal on real mid-range phone; (3) layout integrity — safe areas, chrome, orientation on real devices; (4) input robustness — no scroll/zoom interference, multi-touch, edge swipes.
- Real-device protocol (SitePoint Oct 2026): emulators miss — mouse≠touch events, virtual keyboards, desktop CPU hides slowness, iOS WebKit differs, battery/heat/interruptions. iOS tooling: Safari Web Inspector via USB.
- Fat-finger: 44pt Apple / 48dp Google; test one-handed, thumbs-only, on the move.
- Touch latency: measure on-device (touchstart timestamp vs rAF paint); never trust desktop timeline.

## C. Techniques
- Canvas scaling: window.innerHeight for sizing; DPR cap 2× (iOS 256MB combined canvas memory cap; DPR 3 eats most of it); WebKit canvas-resize memory leak (~1.25GB → tab crash) — minimize resizes.
- LD 16:9 frame on portrait phone: letterbox (contain) is tactics-safe — fill/crop hides play-critical cells.
- HUD safe areas: viewport-fit=cover REQUIRED (else env(safe-area-inset-*) = 0). Full-bleed canvas + inset HUD: padding max(20px, env(top)) etc. Dynamic Island = 59–62pt top. Phantom landscape top dead zone (~20px buffer, undocumented).
- iOS chrome: requestFullscreen UNSUPPORTED on iPhone; only PWA standalone (manifest display:standalone) removes chrome. screen.orientation.lock() unsupported on all iOS — detect + rotate prompt.
- Haptics: navigator.vibrate NOT on iOS (Safari intentionally omits) — Android-only; use WebAudio clicks + animation; no-op wrapper.
- Wake Lock: unreliable on iOS Safari; feature-detect, re-request on visibilitychange, never gate gameplay. iOS PWAs killed on background → persist continuously.
- env() in JS: read via DOM probe (WebKit bugs on CSS-var bridge); re-probe on orientation change.

## D. What to avoid
- Hover-dependent UI with no touch equivalent (tactics classic offender: hover-to-preview stats).
- <44pt targets; <16px inputs (iOS auto-zoom); position:fixed for game UI (visual-viewport bugs); ignoring safe areas (content under notch = dead taps).
- Pointer-Events-only design can't cover pinch suppression (WebKit-only gesturestart).
- Battery: uncapped background rAF, full-DPR rendering.
- "Mobile support" tested only in desktop emulation — never reproduces iOS WebKit bugs.

## E. Shipped
- 2048 (Cirulli): swipe deltas → moves; single-gesture control scheme; the mobile-web reference.
- Paper.io (.io): relative touch steering, one-finger, whole screen = target.
- Dasgar.io: floating dual joysticks + PWA standalone — competitive real-time in a browser.
- Wordle: touch-native from day one (tap big cells, viewport stability) at massive scale.

## Implemented this round
- **Verified (already in code):** input layer is gesture-agnostic — all gameplay input routes through Pointer Events (pointerdown → onTap); pointercancel → deselect (Round 170); audio unlock on pointerdown. Phase 2 becomes a controls-mapping exercise, not a rewrite.
- **MOBILE-SPEC.md:** verify-now vs build-later split recorded; 16:9 letterbox decision locked (tactics-safe); iOS game-shell stack spec'd for Phase 2; tactics touch grammar (tap-select + tap-confirm, no virtual gamepad, no text inputs, no iOS vibrate); no-new-mobile-code-during-jam discipline reaffirmed.
- Spec only, +0 lines. 4,353 lines (+0).

## F. Sources
mdn · webkit · fozzedout · playkovo · sitepoint · apple · bugnet · chrome · wwdc24
