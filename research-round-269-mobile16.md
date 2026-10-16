# Mobile Part 16 (Final Verification) — Findings (Round 269)
**Date:** Wed 2026-10-15 ~02:36 EDT · **Source:** live web research (webkit, web.dev, mdn, fozzedout, bugnet, paulau, cederhook)
**Project:** Mecha Protocol — mobile (pre-jam; final verification)

## A. Mechanics
- Real-iPhone smoke (fozzedout gist, shipped PWA): Xcode simulators don't emulate touch or safe-area insets reliably — test on an XR-class device as the worst case (smallest safe-area-adjusted screen of its era). Cold boot → one full turn → hard-kill Safari → relaunch → repeat.
- URL-bar geometry (web.dev + WebKit): WebKit collapses chrome on scroll, changing viewport height mid-session. visualViewport resize/scroll fire with sometimes-jittery values (Apple Forums 800125, WebKit Bugzilla 226689) — letterbox must recompute from LIVE visualViewport, never set once at load.
- Gesture-layer audit (MDN + paulau.dev 2026): modern iOS Safari ignores user-scalable=no/maximum-scale=1 — viewport meta alone is NOT a zoom lock. touch-action CSS is the mechanism. Attempt every browser gesture over the canvas: double-tap, pinch, long-press, edge swipes, three-finger. None should zoom/scroll/select or fire pointercancel mid-turn.

## B. Validation
- One real iPhone, boot-and-play-one-turn (fozzedout; qapractices: smoke test on oldest/limited device first).
- Zero console errors (Safari Web Inspector) — errors correlate with broken audio unlock, pointer handlers, viewport math.
- Zoom attempts on every HUD + canvas corner; page must not zoom.
- Ringer-switch audio: Web Audio defaults to ambient session, muted by the ringer switch (WebKit Bugzilla 237322; bugnet.io Jun 2026); <audio>/<video> play on media channel. Test switch both ways, or set playback audio session (navigator.audioSession).
- Honesty rule: report only what was verified on the physical device.

## C. Techniques
- dvh + visualViewport (web.dev): 100dvh / visualViewport.height for the letterbox container; recompute on resize AND scroll, debounced, never once at load. Keyboard popups can shrink visualViewport.height PERMANENTLY in standalone PWAs (cederhook Jul 2026: 932→873, never recovers until force-quit) — avoid text inputs entirely in a canvas tactics game.
- touch-action discipline (MDN): none on canvas; handle pointercancel as first-class (release held pointers / pause input) — it signals the browser stole the gesture.
- Safe-area insets (WebKit iPhone X): viewport-fit=cover + env(safe-area-inset-*); controls ≥44pt, clear of edges; home-indicator swipe zone kills edge-adjacent targets (fozzedout: "phantom top dead zone" in landscape).
- Letterbox math: scale = min(w/16, h/9) inside live visualViewport; center stage; surround = game background (URL-bar collapse changes surround only, never stage).
- Audio: unlock on first gesture; ringer-switch both positions; audioSession playback category if silence-with-ringer-off is unacceptable.

## D. What to avoid
- Simulator sign-offs (proves almost nothing about iPhone Safari).
- 100vh layouts (content under URL bar/toolbar; use dvh/visualViewport).
- Viewport-meta-only zoom lock (ignored by modern iOS; pinch/double-tap still fire mid-game).
- HUD in the bars (notch, Dynamic Island, home indicator, URL bar = missed taps + gesture conflicts).
- Late bolt-on mobile (serverboi.org js13k 2024: "deciding mobile late multiplies cost" — lock the mobile pillar before content, not after).

## E. Shipped
- 7tonshark "moth" (js13k 2022): first mobile attempt — playtesters "weren't sure what to do"; touch UI needed a tutorial + better button feedback, discovered only via real playtesting. Mobile QA = UX QA, not just geometry QA.
- bugnet.io silent-switch (Jun 2026): testers heard nothing on iPhone, fine on Android/desktop — physical ringer switch muting ambient-category Web Audio. No desktop test reveals this.
- cederhook PWA keyboard bug (Jul 2026): software keyboard permanently shrank viewport until force-quit. Lesson: no text inputs in canvas games; never trust one-time viewport measurements.

## Implemented this round
- **VERIFIED (code read, no changes):**
  1. No text inputs in the JAM path: jam hangar = preset squad-select (no inputs). `inp-mechname` exists only in the Phase 2 full hangar — the cederhook keyboard bug can't fire in the jam build. Documented as a Phase 2 rule below.
  2. Ringer-switch handled: `navigator.audioSession.type = 'playback'` already set in sfx.js (Round 198) + music.js. Web Audio survives the silent switch.
  3. Geometry: visualViewport resize + scroll listeners in place (Round 260); letterbox recomputes from live dimensions.
- **MOBILE-SPEC.md:** Phase 2 keyboard rule (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
webkit · web.dev · mdn · fozzedout · bugnet · paulau · cederhook · 7tonshark · serverboi
