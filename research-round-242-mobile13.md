# Mobile Part 13 (Mobile Readiness / Verify-Now) — Findings (Round 242)
**Date:** Wed 2026-10-14 ~23:38 EDT · **Source:** live web research (abratabia, chanmeng, helpmetest, mdn, apple hig, serverboi, js13k)
**Project:** Mecha Protocol — mobile (16:9 letterbox LOCKED, full touch = Phase 2; verify-now split)

## A. Mechanics
- Viewport meta: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no` — but iOS Safari ignores user-scalable=no since iOS 10 (accessibility). Cannot be the only enforcement.
- touch-action CSS = the real zoom killer: `manipulation` on interactive (kills double-tap zoom + 300ms delay), `none` on canvas (kills pull-to-refresh, pinch, double-tap). (MDN Sep 2026.)
- Canvas: size from innerWidth/innerHeight × DPR (cap 2), letterbox via scale = min(vw/refW, vh/refH). aspect-fit (bars) = jam-safe; aspect-fill crops.
- Orientation: iOS cannot programmatically lock (screen.orientation.lock = Android-only/PWA). Pro pattern: "rotate your device" prompt via matchMedia('(orientation: portrait)').
- Safe areas: viewport-fit=cover + env(safe-area-inset-*); never place controls in bottom gesture-bar zone.
- 44pt rule (Apple HIG): minimum 44×44pt tap targets — measured AS RENDERED in the letterboxed frame, not at reference resolution.
- Portrait letterbox breakers: HUD behind notch/gesture bar; `100vh` lies on iOS Safari (use dvh, re-read innerHeight on resize); audio suspended until gesture; touch coords must map through letterbox scale (chanmeng).

## B. Validation
- Real-iPhone 5-min smoke: load → letterbox intact with URL bar expanded AND collapsed → play one full turn → audio → no zoom/scroll → zero console errors (remote Safari Web Inspector). = our "boot and play one turn" gate (abratabia "staging smoke test").
- Simulator misses (helpmetest May 2026): real perf (desktop CPU in VM), memory/GC pressure, touch gesture fidelity (double-tap zoom, edge swipes), iOS-specific behavior (simulator runs on Mac processor), real-world conditions (notifications, battery). DevTools device mode does NOT test Safari rendering, iOS touch, or real-device perf.
- Jam layering: develop on desktop emulation, CI on emulators, one pre-release pass on real devices. One iPhone + one Android covers exploratory testing.

## C. Techniques
- Letterbox: hybrid — game world letterboxed at reference res, UI/HUD expands into spare space (HUD never eaten by bars). DPR cap 2 (fidelity) / 1.5 (perf).
- Zoom/scroll prevention stack: touch-action manipulation/none CSS + non-passive preventDefault on touchmove/touchend + viewport maximum-scale fallback + block iOS gesture* events in iframes (itch.io!).
- Touch grammar (tactics): Pointer Events (pointerdown/move/up), track by pointerId, preventDefault, clientX/Y → game coords via getBoundingClientRect + letterbox scale/offset. Grammar: tap = select / move / attack. Handle touchcancel (stuck selections).
- Audio unlock: decode during loading, resume() inside first tap handler.
- Chan Meng's three: resolution from screen, touch coords corrected for scaling, particle budget scaled down.

## D. What to avoid
- Half-broken mobile > none (abratabia: mark N/A honestly; Z0MB13 below). Honest "touch: N/A (Phase 2)" + rotation prompt beats janky half-touch.
- iOS quirks: edge touches stolen (home indicator, back nav); touchcancel required; double-tap zoom fires despite user-scalable=no; AudioContext needs gesture per context; stricter memory (tabs killed); no Fullscreen API in iOS browser Safari; localStorage evictable.
- URL bar: never trust 100vh; dvh + resize + visualViewport.
- HUD in bars: keep critical UI inside 16:9 frame; test notch + gesture bar in both orientations.

## E. Shipped
- Z0MB13 (js13k 2024, Jake Turner): top-down arena shooter. "Mobile compatibility introduced complexities in the final stages... necessitating touch controls and a mobile-adaptive interface." Lesson: "earlier determination of targeted platforms." = cautionary tale that DIRECTLY validates our verify-now/build-later split — bolting mobile on late is where jam hours go to die.
- js13k 2026 Mobile-category winners (Unicorn Tycoon, UniFind, Rainbow Rescue): games DESIGNED for mobile win the dedicated track. Design-for-mobile and verify-only are both viable — only when chosen deliberately up front.

## Implemented this round
- **Verified (code read, no changes — stance locked):** viewport meta (width/scale/user-scalable=no/viewport-fit=cover) + apple-mobile-web-app-capable; body `touch-action:none; user-select:none; -webkit-touch-callout:none` (Round 218); #app fixed inset:0; visualViewport + resize listeners (Round 206); getBoundingClientRect coordinate mapping; Pointer Events + pointercancel→deselect (Round 233). All verify-now checklist items present.
- **MOBILE-SPEC.md:** jam-day mobile smoke test (real iPhone, 5 min, boot+play-one-turn, URL bar up/down, audio, no zoom, zero console errors); explicit "full touch = Phase 2 N/A" honesty rule (Z0MB13 lesson); 44pt-as-rendered check for grid cells/HUD.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
abratabia · chanmeng · helpmetest · mdn · apple hig · serverboi · js13k
