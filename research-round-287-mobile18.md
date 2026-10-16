# Mobile Part 18 (Verification Round 3) — Findings (Round 287)
**Date:** Wed 2026-10-15 ~04:50 EDT · **Source:** live web research (abratabia, chanmeng, mdn, starlight breaker)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 3)

## A. Mechanics
- iOS Safari quirk battery (abratabia, Jun 2026): (1) AudioContext starts suspended — resume() must run INSIDE the gesture handler, not setTimeout/Promise; per-context, persists for the session. "Tap to Play" unlock + 8–16 source pool. (2) Memory: ~300–400 MB tab limit (silent kill); GPU separate — 2048x2048 RGBA = 16 MB, crashes past ~256 MB; atlases ≤1024. Resizing canvas reallocates backing store without freeing — debounce, size once, CSS-scale. (3) No Fullscreen API in browser Safari. (4) 100vh clips under expanded address bar — use dvh or innerHeight on resize. (5) System edge gestures can't be disabled — inset controls ≥20px; touchcancel = finger-up or input sticks ("can get stuck in a 'finger down' state"). touch-action: manipulation kills the 300ms delay. (6) ITP evicts localStorage after 7 days (PWAs exempt). (7) position:fixed breaks in momentum scroll — overflow:hidden on body.
- Touch-coord audit (chanmeng, Jun 2026): clientX = CSS pixels, canvas = backing-store pixels. Correct: rect = getBoundingClientRect(), scale = canvas.width / rect.width, (clientX − rect.left) × scale. Drift grows with distance from origin — "reads as input lag." Tap all four corners. Only accept touch while a round is in progress.
- Viewport stress (abratabia + chanmeng): address-bar expand/collapse; rotate (debounced resize — un-debounced reallocates per gesture frame); home-indicator/Dynamic Island overlap.

## B. Validation
- Two-loop model (game-ace): fast automated smoke on every commit + manual pass on a curated device shelf per release candidate. Device matrix: reference (1–2 flagships), mid, low near min-spec; OS = current + previous two majors. Risk-based selection: "what is the minimum set of devices that covers the maximum percentage of our users."
- Jam compression: one real iPhone 17 + one older/low-spec iPhone (memory + GPU ceilings), Safari browser mode. Extended sessions: abratabia — Safari Web Inspector Timelines/Memory over minutes (leaks only manifest after minutes).
- chanmeng's key line: "Emulation is good enough for layout and touch geometry; it will not tell you anything useful about haptics or sustained frame rate, which need a real phone."

## C. Techniques
- Pointer events (MDN, Sept 2025; Baseline incl. Safari): unified model. MDN's canvas pattern includes handleCancel on pointercancel — = our pointercancel → deselect. Pair with touch-action on the canvas.
- Hit-slop (MDN, Aug 2026): Phaser pattern — "make the field of activity bigger without covering half of the screen with button images." Invisible interactive areas inflated beyond visuals. chanmeng: ≥90px tappable, bottom-center thumb-reach.
- Viewport units (abratabia): dvh for the container; innerHeight fallback on older iOS.
- Audio unlock (abratabia): "Tap to Play" splash resuming inside the gesture handler; sound pool round-robin.
- DPR handling (chanmeng): backing-store resolution from viewport at startup in tiers, fixed aspect ratio (logic resolution-independent); debounced resize.
- visualViewport/scroll: overflow:hidden on body (no page scroll); handle visualViewport resize + scroll. No text inputs = no keyboard-driven viewport churn, by design.
- Extras: Vibration API behind feature-detect (absent on iOS, degrades silently); particle budgets keyed to innerWidth tiers with generation-rate throttling.

## D. What to avoid
- Touch events only: pointer events = one code path (MDN). Ignoring touchcancel = stuck "finger down" (abratabia).
- Fixed viewports: 100vh clips behind the expanded bar. Never ship fixed-height without dvh/resize.
- Keyboard in the jam path: text input = visualViewport resize + scroll + keyboard chrome — a whole bug class in the critical path for zero gameplay value. No-inputs discipline removes it.
- Assuming desktop (serverboi/Z0MB13): "introduced complexities... necessitating the addition of touch controls and a mobile-adaptive interface." Decide platform at inception.
- Fixed-desktop canvas CSS-scaled to phones (chanmeng's original failure): resampled pixels, wrong touch math, unreachable controls.
- Recreating canvas per resize frame: memory accumulation → tab kill (abratabia).

## E. Shipped
- Starlight Breaker (Chan Meng): vanilla JS canvas brick-breaker, retrofitted for phones. Three-tier backing-store at fixed 4:3 (debounced resize), getBoundingClientRect correction, particle ceilings keyed to width, ≥90px thumb-reach buttons, rotation prompt + one-time touch guide. ~150 lines JS + ~200 CSS, zero changes to game logic — "making existing logic independent of the 'drawn at 800x600 with a mouse' assumption." Directly maps to our stack.
- Z0MB13 (js13k 2024): twin-stick tactics input in 13 KB. Lesson: decide platforms early.
- Chicken Road (InOut): one-tap-to-hop, haptics, sub-5 MB. 42M sessions, 70% mobile browsers, 97% first-session completion. One unambiguous touch verb = mobile-first success.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** iOS AudioContext gotcha (abratabia's #1). game.js:170 — `SFX.ensure()` (which calls `ctx.resume()` synchronously) runs DIRECTLY inside the `pointerdown` gesture handler, not in setTimeout/Promise. The unlock is in-gesture; the context resumes on first tap. Music.js:16 reuses the same path.
- **MOBILE-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,495 lines** (+0).

## F. Sources
abratabia · chanmeng · mdn · starlight breaker · z0mb13 · chicken road
