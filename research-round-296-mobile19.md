# Mobile Part 19 (Verification Round 4) — Findings (Round 296)
**Date:** Wed 2026-10-15 ~05:27 EDT · **Source:** live web research (gamemaker, web.dev, mdn, poki, 2048)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 4)

## A. Mechanics
- Corner-tap audit: tap every corner + edge, portrait + landscape. No control under the notch/Dynamic Island, home indicator, or rounded corners. (Apple HIG safe area; Poki: "cover the full screen in portrait or landscape with a responsive design.")
- Edge-swipe drill: swipe inward from each edge. The game neither fights Safari's system gestures nor leaves a stuck selection. web.dev: "touch-action: none is somewhat a nuclear option" — use the narrowest value that works.
- Memory watch (GameMaker, Aug 2026): decoded GIF/PNG/TIFF capped at 3 MP (<256 MB RAM) / 5 MP (>=256 MB); JPEG to 32 MP via subsampling; canvas elements capped at 3 MP / 5 MP; JS limited to 10s per top-level entry point; max 8 open documents on iPhone. "A full-screen canvas on a 3x-DPR iPhone sits around ~3.2 MP — inside the 5 MP ceiling but close enough that DPR policy is a memory decision, not just a perf one."

## B. Validation
- Real device, always (Poki Inspector; MDN): Poki's QA has a dedicated mobile mode — QR code, testers play on a physical phone while SDK events stream to desktop. Emulation = layout aid, not verification.
- Low-spec ceiling: validate on the weakest claimed device, against hard ceilings (iOS 10s JS cap, canvas MP caps, Poki's ~10s load tolerance before players bounce). web.dev: dvh updates are throttled/debounced during toolbar motion — "a game that resizes only on CSS units will visibly lag behind the real viewport."
- Extended sessions: the memory watch is a duration test — leaks + unbounded growth only show after 15–30 min of real play, when iOS jetsam kills the web content process ("A problem repeatedly occurred"). Short smokes miss it.
- Gate model (Poki): published requirements bar — mobile control schemes forced on tablets, adaptive controls per input method, visual/intuitive tutorials, streamlined entry. Borrow the gate: no submission while any check is red.

## C. Techniques
- Pointer events (web.dev): pointerdown/move/up/cancel merge mouse/touch/pen. pointercancel "is called when the browser cancels the touch gestures" — pointercancel → deselect is the correct semantic ("the platform telling you the gesture is dead"). setPointerCapture for drag continuity; release on up/cancel.
- Hit-slop 8px (Android ViewConfiguration): scaledTouchSlop default 8 dp — the industry-standard origin of the 8px figure. "40 px visual + 8 px slop = 56 px effective hit region, which clears Apple's 44 pt minimum even though the visual is slightly under it."
- dvh with fallbacks (web.dev): 100vh bleeds off-screen with expanded toolbars; svh = guaranteed-visible; lvh = full-bleed backgrounds; dvh = adaptive (Safari 15.4+). Never bare 100vh. Pair with visualViewport resize for canvas sizing (CSS dvh is throttled).
- Audio unlock (MDN): media/Web Audio only after user interaction. Pro: create lazily, resume() synchronously inside first pointerdown; re-check on visibilitychange/pageshow (iOS suspends on backgrounding); NotAllowedError → minimal tap-to-enable UI, not an error.
- DPR tiers: cap backing-store scale (1x low-end, 2x mid, native 3x only where fill rate allows) — driven by frame cost AND the iOS 3/5 MP ceiling. Measure with Safari Web Inspector on-device.
- Touch coordinates (web.dev): getBoundingClientRect at event time (clientX/Y are viewport-relative); prefer pointer events' clientX/Y per the getGesturePointFromEvent pattern. Batch per-frame work through rAF.

## D. What to avoid
- Touch-only wiring: breaks mouse, pen, assistive tech. web.dev: Pointer Events as the unified approach.
- Fixed viewports: bare 100vh bleeds under dynamic toolbars; goes stale on retract; ignores throttled dvh cadence.
- Keyboard/text input in the jam path (web.dev): "the on-screen keyboard is not part of the UA UI and does not affect viewport units — it shrinks the visual viewport instead, which is precisely the layout earthquake this game's 'no text inputs' pillar avoids." Poki: keep tutorials visual, entry streamlined.
- Desktop assumptions: hover-dependent affordances (iOS doesn't reliably apply :active/hover); desktop schemes leaking onto tablets (Poki hard-requires mobile schemes on tablets).

## E. Shipped
- 2048 (Cirulli): gesture-first — swipe on touch, arrows on desktop; iPhone startup images in the repo. "One input vocabulary per device, zero small tap targets to miss, instant load straight into play."
- slither.io: steering = moving a finger across the screen — continuous analog touch, no on-screen buttons in the play path. "The input is the game (no translation layer between intent and action)."
- Wordle (Wardle): built as a gift for his partner's phone — web-first, no app store, no accounts, no onboarding; touch-sized keyboard. "Mobile-first viewport design, frictionless entry (load → play in seconds), input sized for thumbs from day one."

## Implemented this round
- **REAL ISSUE FOUND + FIXED:** iOS canvas memory ceiling (GameMaker, Aug 2026). At the default renderScale 2x on iPhone 17 landscape (2556×1179 CSS), the backing store was 12.05 MP — OVER iOS's 5 MP canvas ceiling. The game started over-limit; only the governor (kicking in later) brought it down. "DPR policy is a memory decision, not just a perf one."
- **Fix (js/game.js, resize()):** cap the effective scale so the backing store never exceeds 4.5 MP (10% margin under 5 MP). Verified: iPhone 17 (both orientations) → 1.222x, exactly 4.50 MP; Desktop 1080p DPR2 → 1.473x, 4.50 MP; Desktop DPR1 → 1.0x (DPR-limited), 2.07 MP. All under the ceiling from boot. +6 → **4,511 lines**, all clean.
- **MOBILE-SPEC.md:** verification round 4 (below).

## F. Sources
gamemaker · web.dev · mdn · poki · 2048 · slither.io · wordle
