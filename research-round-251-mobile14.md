# Mobile Part 14 (Final Verification) — Findings (Round 251)
**Date:** Wed 2026-10-15 ~00:28 EDT · **Source:** live web research (fiegel, euziere, drizz, mdn, web.dev, webkit)
**Project:** Mecha Protocol — mobile (16:9 letterbox locked; full touch = Phase 2)

## A. Mechanics
- Real-iPhone smoke = last word (Fiegel, "Giga Leland" 2026): desktop DevTools never showed — iOS 26 text-selection bleeding through fullscreen overlays (fix: user-select:none everywhere), phantom pinch-to-zoom on two-finger touches, selection loupe on rapid taps (fix: preventDefault on touchstart paths).
- EUZIERE (js13k21): desktop solid mid-jam; day-15 beta found Mac/iOS bugs; final day = summoned beta-testers for last pass. Rhythm: develop desktop, verify real-iOS before submission.
- drizz.dev: emulators lack real touch input, thumb reach, thermal — "final sign-off on physical devices." DevTools misses: dynamic toolbar geometry, gesture recognizers firing on real fingers, thermal throttling, thumb-reach targets (44×44 CSS px minimum, WCAG/Apple HIG).
- Portrait-letterbox final-48h: letterbox must not shift on URL-bar show/hide; touch coords through letterbox offset; no interactive zone in safe-area bars.

## B. Validation
- Boot-and-play-one-turn: real iPhone Safari, load → gameplay → one full turn, zero console errors (tethered Web Inspector or on-screen overlay).
- URL-bar up/down (web.dev): 100vh = large viewport on load (toolbar retracted), content JUMPS when toolbar retracts. Force toolbar show/hide — letterbox must not resize, jump, or reveal layout.
- Audio unlock (MDN): blocked until user gesture; first tap must audibly start sound (resume() in gesture handler).
- No-zoom (MDN): viewport meta alone does NOT disable double-tap zoom. Attempt pinch + double-tap on real phone — neither may zoom. EUZIERE's datum: forgot user-scalable=0 → shipped pinch-zoomable.
- 44pt as rendered: Apple HIG 44×44 points measured AS RENDERED, not DevTools CSS px. Validate with a real thumb inside the letterboxed area (letterbox scaling shrinks on-screen sizes vs full-bleed).

## C. Techniques
- dvh + visualViewport (web.dev Bramus): svh = toolbar expanded, lvh = retracted, dvh = clamped current. Size playfield from dynamic viewport; listen to visualViewport resize; caveat: dynamic values update throttled, NOT at 60fps — never drive per-frame transforms from them.
- touch-action: none on canvas (kills pan/pinch/double-tap), manipulation on buttons (kills double-tap delay, keeps pan). preventDefault touch listeners must be {passive:false} (Fiegel).
- Letterbox math: scale = min(cssW/9, cssH/16) for 9:16 portrait, center it, translate (clientX, clientY) minus origin ÷ scale — hit-test in game space, never raw page pixels.
- Safe areas (WebKit iPhone X + MDN env()): viewport-fit=cover + env(safe-area-inset-*); resolves to 0 on notch-less devices (safe degradation).

## D. What to avoid
- Simulator sign-offs (drizz.dev: not a sign-off).
- Half-broken mobile (EUZIERE day-27 D-pad-on-desktop; Fiegel's half-debugged gestures) — honest scope cut beats partial touch. Full touch = Phase 2, labeled.
- Trusting 100vh (jumps under toolbar).
- HUD in the bars (notch/home/toolbar — unreachable or obscured).
- Viewport-meta-only zoom lock (MDN: doesn't stop double-tap zoom).
- Audio without gesture-gated unlock (silent on iOS).
- pointer-events-only on iOS without loupe protection (Fiegel prefers touchstart/touchend; rapid taps → loupe unless default prevented).

## E. Shipped
- 2048 (Cirulli, 2014): weekend build, touch-native from day one → 100M+ plays, App Store. Touch-from-start is what made a weekend project the mobile-web poster child.
- LOSSST (EUZIERE, js13k21): forgot user-scalable=0 (pinch-zoomable); 2 days mid-jam replacing drag with D-pad; D-pad on desktop until day 27; still #57 overall, #15 Mobile. Lesson: lock zoom day one, never leave mobile for last minute, real-iOS beta before submission.
- Giga Leland (Fiegel, 2026): iOS 26 changed text selection → game broke (selection bleed, loupe) until user-select:none + touch-action:none + gesture prevention. Lesson: mobile web QA has no permanent finish line — verify on CURRENT iOS.

## Implemented this round
- **Verified (code read, no changes):** user-select:none + -webkit-user-select:none + -webkit-touch-callout:none on body (loupe/selection blocked); touch-action:none (gestures blocked); no touchstart/preventDefault handlers needed (Pointer Events + these CSS guards cover Fiegel's cases). iOS-Safari checklist all present.
- **MOBILE-SPEC.md:** iOS-Safari pre-jam checklist (user-select:none everywhere; touch-action none/manipulation; {passive:false} if preventDefault added; resume() on first gesture; no viewport-meta-only reliance; verify on current iOS); 44pt-as-rendered thumb pass; honesty rule restated.
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
fiegel · euziere · drizz · mdn · web.dev · webkit · 2048
