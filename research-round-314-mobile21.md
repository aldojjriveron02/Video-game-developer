# Mobile Part 21 (Verification Round 6) — Findings (Round 314)
**Date:** Wed 2026-10-15 ~06:38 EDT · **Source:** live web research (pqina, abratabia, rad ui, playcanvas)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 6)

## A. Mechanics
- Canvas-limit audit (PQINA): iOS Safari caps — "max canvas area 16.7 MP," "max dimension 4096×4096 px," "per-document total ~288 MB on iPhone." "A canvas of 4096×4096×4 = 64 MB, so ~4 such canvases hit the budget and everything silently fails." Audit: sum all backing stores (main + offscreen). "Release retired canvases by setting width/height to 1×1 and clearing before dereferencing."
- Touch-target audit (Apple HIG; Rad UI): "Minimum 44×44 CSS px." "24×24 is the WCAG 2.2 AA floor but 44px is the standard for games." Measure every control on the actual device, including at max zoom-out. "Confirm touch-action: none / manipulate on the canvas so scrolling/pinch/double-tap-zoom never steal gestures."
- Orientation audit (PlayCanvas; Apple): "mobile screens are small and recommend landscape." Verify portrait AND landscape; handle resize/orientationchange without state loss; define supported-orientation policy explicitly.

## B. Validation
- Real-device matrix (Rad UI): "test on real devices because simulators and devtools miss real behavior." "Test on a slow or low-quality phone." Minimum: iPhone 17 (Safari), older iPhone (Safari), Android Chrome (sanity control).
- Safari specifics (abratabia): (a) "iOS auto-suspends AudioContext until a user gesture resumes it — unlock inside pointerdown/touchend." (b) iOS 17+ drops the visibility requirement. (c) "100vh/100dvh inconsistencies — use visualViewport and height:100%." (d) iOS 17.0–17.3 WebKit zero-day. Verify on real iPhone 17, not devtools.
- Touch testing (Rad UI): "tap feedback within 100ms; pinch-to-zoom doesn't interfere; hover-dependent UI gets tap equivalents; double-tap zoom doesn't hijack; test edge cases — taps near screen edges, multi-touch."

## C. Techniques
- Memory ceilings (PQINA): "Cap total canvas backing store well under iOS's 288 MB." Our 4.5 MP cap (18 MB) is stricter than platform — keep it. "Keep one compositing canvas; pre-render static layers; release unused via 1×1+clear."
- Touch-first design: "targets ≥44 CSS px, touch-action: none on the game canvas, no hover-only mechanics, pointer events with pointerdown entry (which doubles as the audio unlock point)."
- Safe-area handling (web.dev): "viewport-fit=cover and lay out HUD using env(safe-area-inset-*)." "Never hard-code margins for the iPhone 17 screen; insets differ per device and orientation."
- Orientation support (PlayCanvas): "landscape-friendly responsive layout for tactics boards; handle orientationchange + visualViewport without losing state."

## D. What to avoid
- Desktop assumptions: "mouse hover as the only affordance, small dense controls, assuming precise clicks — all fail on touch."
- Untested Safari: "iOS Safari's canvas caps, audio-session suspension, fixed-position bugs, and image-format restrictions bite only in real Safari."
- Small touch targets: "sub-44px buttons cause fat-finger misses and double-tap-zoom interference."
- Ignored safe areas: "HUD under the notch/home indicator with no viewport-fit=cover/env() — unrecoverable without redesign late in the jam."
- Backing-store blowup: "full-devicePixelRatio on 3x displays compounds toward the 288 MB budget." Cap per resize().
- Audio without gesture gate: "creating/playing AudioContext outside a user gesture → silent SFX on iOS."

## E. Shipped
- 2048: "swipe/keyboard input, viewport-fit meta, no hover dependency, single-canvas-free DOM/CSS tiles." "Input model matched fingers; zero audio/canvas-limit risk."
- js13kGames: "mobile-playable winners routinely run single-canvas vanilla JS with strict memory budgets, touch controls, and no assets — exactly this game's stack."
- PlayCanvas: "publish → device-test → store wrap" validation flow.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** mobile touch/safe-area stack. `viewport-fit=cover` (index.html:5). `env(safe-area-inset-*)` on turn banner, controls, and HUD (style.css:13,17,37). `touch-action:none` on canvas (style.css:5); `touch-action:pan-y` on scrollables (style.css:45). All touch targets ≥44px: .ctl-btn 110×52, .big-btn 56h, .mech-tab 48h, selects 44h, minimum 44×44 (style.css:85).
- **MOBILE-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
pqina · abratabia · rad ui · playcanvas · 2048 · js13k
