# Mobile Part 4 (Session & Performance) — Findings (Round 152)
**Date:** Wed 2026-10-14 ~14:45 EDT · **Source:** live web research (web.dev, abratabia ×3, webkit, mdn ×2, 148apps, strategygame.org, itch.io)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Session
- bfcache (no unload; pagehide for save; pageshow+persisted for restore; NotRestoredReasons).
- Autosave (event-driven; 30-120s; pagehide last-chance; small deltas; versioned).
- iOS 7-day cap (Home Screen exempt — strongest PWA argument).

## B. Performance
- Thermal (sustain 55-70% peak; 60fps=2× power; 70% resolution = best lever; locked 30 > jittery 60).
- Mobile perf (TBDR; DPR×0.5; mediump; GC churn; rAF pauses backgrounded).
- MDN (16.6ms budget; transform/opacity cheap).

## C. Jam mobile
- Touch (preventDefault; touchcancel; Pointer Events; touch-action CSS).
- VS web (no-install instant play; touch support — the template).

## D. What to avoid
- StS iOS (clunky touch; 44×44 defense). Swipe-away data loss (VS comment).
- 7-day wipe. Thermal traps. Occlusion/overdraw.

## E. Shipped
- ItB iOS (feels native; pausable sessions; offline). Polytopia (30-min sessions).
- Hoplite (save every move — gold standard). VS web (instant play; session caution).

## Implemented this round (code)
- **js/game.js:** pageshow bfcache-restore resync (clocks, re-render, telemetry).
- Autosave audited: no unload; visibilitychange + pagehide guards present.
- **MOBILE-SPEC.md:** production spec appended (session, thermal, pre-jam checklist).
- 3,706 lines (+11).

## F. Sources
web.dev · abratabia ×3 · webkit · mdn ×2 · 148apps · strategygame.org · itch.io
