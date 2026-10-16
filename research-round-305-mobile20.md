# Mobile Part 20 (Verification Round 5) — Findings (Round 305)
**Date:** Wed 2026-10-15 ~06:03 EDT · **Source:** live web research (pqina, tagumpay, playgama, unity, poki, mdn)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 5)

## A. Mechanics
- Three drills (Tagumpay, NinoGames): (1) Pointer-lifecycle — center/edge taps, hold, drag, finger-leaves-control; "pointercancel means the browser/system took over the stream... it is not an exception. If an action fires only on pointerup, a canceled pointer must not count as a successful tap." (2) Scroll-conflict — drag into scrollable area, verify pointercancel appears, scrolling works outside game. (3) Rotation/interruption — rotate mid-press, keyboard open/close, retest lowest control.
- Memory ceiling (Pqina, Jun 2026): iOS Safari total canvas memory 384MB — "once exceeded, getContext() returns null and canvases render blank with no console error." Per-canvas 16,777,216 px (4096×4096). "Canvas memory is never released even when the canvas is done — the documented release trick is resize to 1×1 and clear." Canvas-count + lifetime = hard QA metric.
- Gesture audit (Google Devs; NinoGames): touch-action scoped to game region, not global none ("breaks expected page navigation/zoom"). touchstart on document defaults passive:true — preventDefault ignored; use touch-action CSS instead.
- Audio unlock (Playgama, Oct 2026): AudioContext starts "suspended"; unlock synchronously inside first tap — not after async gap. "Both resume() and a fresh source.start() are required; buffering and programmatic volume control stay disabled until playback actually starts."

## B. Validation
- Real devices (Unity): "test on a range of devices within the target platforms (devices have more performance constraints than PCs)." Endurance tests "over long periods of time." Don't leave QA to the end.
- Poki Web fit test: ~10,000 real players over 3–5 days, gameplayStart() signal; click-through, time on page, play conversion → 0–5 score vs benchmarks. "Actual humans on actual hardware."
- Handset matrix (NinoGames): lower-memory phone + different density; log device model, OS, browser, orientation, zoom, viewport per test. "Never rely solely on desktop emulation."
- Poki Requirements: desktop + mobile + tablet; full-screen portrait/landscape; "game scrolling must never scroll the parent page"; must work with ad blocker enabled.

## C. Techniques
- Memory budgets (MDN; Pqina): Google Maps per-pixel VRAM technique — max VRAM ÷ (window pixels × DPR) = portable constant. "Consider rendering to a smaller back buffer" = easy quality-for-speed tradeoff. Delete GPU objects eagerly; lose contexts eagerly.
- DPR policy (SO; MDN): full-DPR on retina "MUCH sharper but performance tanks so as to be unusable"; DPR 1 restores speed. Consensus: cap DPR (commonly 2; drop tiers for weak GPUs); pre-snap to integer coordinates.
- Viewport units (web.dev): dvh tracks Safari toolbar; svh/lvh variants; Safari 15.4+ covered. Caveats: dvh throttled (not 60fps); keyboard doesn't change viewport units (harmless here — no text inputs).
- Gesture handling: touch-action:none narrowly scoped; pointercancel as first-class → deselect, never noise.

## D. What to avoid
- Over-limit canvases: "blank canvas with no warning or console error" past 16.7M px or 384MB. Budget pixels at authoring; never exceed 4096×4096.
- Dead canvases: "memory never reclaimed automatically" — release via 1×1 + clear.
- Unhandled gestures: pointercancel as completed tap (stuck states); global touch-action:none breaking zoom.
- Emulation-only: Device Mode doesn't reproduce touch slop, cancellation, fill-rate, or iOS memory cap.
- Full-DPR on mobile GPUs: "doubling/tripling canvas pixels on weak GPUs kills frame rate."
- Audio before first gesture: silent/broken (suspended context).
- Scroll bleed + ad-blocker breakage: both explicit Poki ship-blockers.

## E. Shipped
- Agar.io: JS client + C++; "single ultra-lean canvas rendering simple circles." Fill-rate + memory far below ceilings — "DPR and canvas limits were never a threat."
- Slither.io (Howse): one 2D canvas, neon aesthetic, ad-hoc JS. "The entire rendering budget stayed inside what mobile GPUs and Safari's canvas memory can do all day."
- Diep.io: "plain JS" canvas, geometric primitives. "Tiny memory footprint and DPR-independent art style, so it never approached the 384MB/16.7M px walls."

## Implemented this round
- **VERIFIED (analysis, no changes — frozen):** all iOS canvas limits respected from boot. Per-canvas 4.5MP cap < 16.7M px limit ✓ (never hits 4096×4096 at 16:9). Three canvases × 4.5MP × 4 bytes = 54MB < 384MB total ✓. iPhone 17 landscape: 3123×1440 per canvas ✓. The 4.5MP memory cap (Round 296) already enforces all of Pqina's ceilings.
- **MOBILE-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
pqina · tagumpay · playgama · unity · poki · mdn · agar.io · slither.io · diep.io
