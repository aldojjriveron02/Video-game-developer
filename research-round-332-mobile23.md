# Mobile Part 23 (Verification Round 8) — Findings (Round 332)
**Date:** Wed 2026-10-15 ~07:43 EDT · **Source:** live web research (qawerk, proxx, lifecycle, wordle)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 8)

## A. Mechanics
- Device-matrix audit (QAwerk): "matrix of real devices across sizes, OS versions, chipsets, tiers — not a single flagship." "Compatibility, UI rendering, perf profiling per device."
- Orientation audit: "rotate mid-session; UI reflows, canvas resizes without state loss, no clipped controls."
- Interruption audit: "calls, SMS, notifications, alarms, low-battery, screen lock, network loss — game must pause/resume cleanly, preserve state, never corrupt saves or audio." "#1 mobile-specific bug class."

## B. Validation
- Real-device testing (QAwerk; BrowserStack): "cloud real-device farms are pro standard — emulators miss touch latency, GPU, sensors."
- Beta/TestFlight: "beta testing with real users to catch production-like issues."
- Crash reporting (Sentry): "error/crash reporting with breadcrumbs, device/release metadata, session context." "Ship Sentry browser SDK so field crashes on real iPhones captured."

## C. Techniques
- Responsive canvas (PROXX): "DPR-aware sizing, decouple sim from render, budget payload." "<25KB initial, <5s TTI on slow 3G, 60fps."
- Touch-first UI: "44pt minimum (Apple HIG), touch-action:none, pointer events for unified input."
- Background handling (Page Lifecycle API): "on hidden: stop UI updates and timers, save state, treat as likely end of session." "Never rely on unload; use visibilitychange + pagehide." "Safari/iOS doesn't fire freeze/resume — key off visibilitychange/pagehide."
- Install prompts: "beforeinstallprompt for in-app install; iOS Add-to-Home-Screen with manifest + apple-touch-icon."

## D. What to avoid
- Desktop-first ports: "mouse/keyboard layout resized to phone — touch targets for cursors, hover-dependent UI, no safe-area."
- Tiny targets: "below-44pt = systematic mis-taps."
- Unhandled interruptions: "calls/notifications/lock without pause-resume corrupt state and break audio."
- Battery drain: "continuous rAF, timers, network polling in backgrounded tabs." "Stop work when hidden — rendering behind tab is ship-blocker."

## E. Shipped
- PROXX (Chrome Labs): "mobile-first PWA, Web-Worker logic, <25KB initial, 60fps, playable on KaiOS." "Proved web could ship premium-feeling game with no native code."
- Wordle: "vanilla JS, ~250KB, no backend, no accounts — localStorage." "Zero-friction mobile web, phone-native feel."
- slither.io: "one-finger drag to steer." "Touch-first canvas scales from browser to app stores."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** Page Lifecycle. `visibilitychange` → hiddenPause stops rAF, restarts cleanly on visible with lastT=0 (no dt spike, game.js:274-277). Auto-save on hidden (game.js:314) and pagehide (game.js:315). Telemetry shutdown on pagehide (game.js:241). No unload reliance. iOS-safe (visibilitychange/pagehide, not freeze/resume). Interruption audit passes by code.
- **MOBILE-SPEC.md:** verification round 8 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
qawerk · proxx · lifecycle · wordle · slither · sentry
