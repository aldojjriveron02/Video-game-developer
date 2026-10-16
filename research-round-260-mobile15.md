# Mobile Part 15 (Final Verification) — Findings (Round 260)
**Date:** Wed 2026-10-15 ~01:24 EDT · **Source:** live web research (plant, montag, mdn, web.dev, webkit, euziere)
**Project:** Mecha Protocol — mobile (pre-jam; final verification)

## A. Mechanics
- Real-iPhone smoke (html5gamedevs): "regularly check on a device," "definitely do need to test on a real device." Simulators are a trap — WebKit's own iPhone X article demos in the Simulator, which reproduces neither real URL-bar geometry nor real touch.
- URL-bar geometry (Chrome "Introducing visualViewport"): visual viewport = actually-visible region vs layout viewport. Use visualViewport resize (fires on width/height/scale change) AND scroll (fires on offsetLeft/offsetTop change — THE event that fires when the URL bar moves). window resize does NOT reliably fire on URL-bar show/hide.
- Gesture-layer audit (MDN touch-action): browser handles pan/zoom by default; app gets pointercancel once the browser takes the gesture. Declare intent via touch-action BEFORE listeners run — mid-gesture changes have no effect. Audit = pre-gesture: CSS, not reactive. Euzière (LOSSST): last-minute mobile bugs found by beta-testers with a link, not by the author.

## B. Validation
- One real iPhone, boot-and-play-one-turn, zero console errors (Safari Web Inspector), ACTIVELY attempt zoom. iOS Safari has IGNORED user-scalable=no since iOS 10 (2016) for accessibility (Luke Plant 2023) — a viewport-meta zoom lock silently does NOTHING on a real iPhone. Verify by attempting double-tap + pinch and observing.
- Audio: Web Audio needs a user gesture (console: "The AudioContext was not allowed to start..."), AND the physical silent/vibrate ringer switch kills Web Audio on iOS EVEN AFTER unlock — smoke-test with the switch BOTH ways (Montag). Commenters flag Safari's ~4 AudioContext limit: single context (we have it).
- Thumb pass: Apple HIG 44×44 points comfortable minimum — measured AS-RENDERED on the real phone, not devtools.

## C. Techniques
- Viewport units + visualViewport (web.dev): svh (stable), lvh (retracted), dvh (dynamic, throttled not 60fps). Shipped Safari 15.4+ — safe on current iOS. Drive resizable UI from visualViewport resize + scroll, not window resize.
- touch-action discipline (MDN + WebKit "More Responsive Tapping"): none on game layer (full gesture kill); manipulation on buttons (fast tap, keeps accessibility zoom). MDN caution: touch-action:none inhibits browser zoom low-vision users rely on (WCAG 1.4).
- Safe-area insets (WebKit): viewport-fit=cover + env(safe-area-inset-*) with max() fallbacks — HUD never under notch/home.
- Letterbox math: size #app from visualViewport.width/height, fit 16:9 portrait inside — never 100vh (chanind 2019: 100vh sizes to max viewport, bottom cut behind address bar).

## D. What to avoid
- Simulator sign-offs (real devices differ: URL-bar geometry, touch, ringer-switch rule).
- 100vh layouts (bottom cut off on real phones; modern fix: svh/dvh).
- viewport-meta-only zoom lock (ignored since iOS 10; bad for a11y — use CSS touch-action).
- HUD in the bars (notch/home/URL bar).
- Reactive gesture fixes (mid-gesture touch-action changes ignored; pointercancel = release stuck pointers).

## E. Shipped
- LOSSST (Euzière, js13k21): mobile left for last minute — drag-to-steer "wasn't precise enough on little screens"; virtual D-pad day 11, debugged day 13, hidden on desktop day 27; forgot user-scalable=0 (pinch-zoomable). Still #57 overall, #15 mobile, #2 best controls. Lesson verbatim: "don't fall in the trap of leaving something for the last minute (like mobile controls, or the music)."
- Web Audio unlock ritual (Montag): desktop-working game silent on iOS for two independent reasons — no gesture-unlock + ringer switch. Smoke test = audible first-gesture check, switch both ways.
- The 100vh clip (chanind 2019): correct on desktop/simulators, bottom cut behind Safari's bar on real phones. The URL-bar geometry check exists because this bug class is invisible until a real phone scrolls.
- Watch-item: unconfirmed anecdote that iOS 18.5 may re-suspend AudioContext after ~5s — treat as smoke-test watch-item, not fact.

## Implemented this round
- **THE SCROLL GAP (js/game.js):** we listened to visualViewport 'resize' (Round 206) but NOT 'scroll'. Per Chrome's guidance, URL-bar show/hide changes the viewport OFFSET on some iOS versions — scroll fires, resize doesn't. Added the scroll listener (1-line, additive; resize() is idempotent). Both events now drive the letterbox recompute.
- All `node --check` clean. +5 → **4,433 lines**.
- MOBILE-SPEC.md: final verification (below).

## F. Sources
plant · montag · mdn · web.dev · webkit · euziere · html5gamedevs · chanind
