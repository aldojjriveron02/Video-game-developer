# Mobile Part 5 (Jam & Validation) — Findings (Round 170)
**Date:** Wed 2026-10-14 ~21:00 EDT · **Source:** live web research (MDN ×6, W3C, Chrome Dev, Poki ×3, js13k, itch.io, 2048 GitHub)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam mobile
- js13k (mobile judging axis; one build). itch.io (Mobile Friendly toggle; forced fullscreen).
- Poki (desktop+mobile+tablet; fullscreen; adaptive controls; try/catch storage).

## B. Validation
- Chrome remote debugging. Poki Device Report (100M). WCAG 2.5.8 (24×24 AA).
- touch-action:manipulation (kills 300ms). Poki web-fit (CTR/time/C2P).

## C. Techniques
- Pointer Events. touch-action:none on canvas. viewport-fit=cover + env().
- passive:true. Audio unlock on tap. DPR canvas. Storage try/catch.

## D. What to avoid
- Hover-dependence. Tiny targets. Scroll traps. 300ms delay. Audio never starting.
- Split builds. External assets. Incognito crashes.

## E. Shipped
- 2048 (swipe first-class). js13k 2026 mobile winners. Poki (Drive Mad, Subway Surfers).

## Implemented this round (code)
- **js/game.js:** pointercancel handler (deselect on gesture takeover).
- **MOBILE-SPEC.md:** jam decision + audit + validation + traps.
- 4,017 lines (+4).

## F. Sources
MDN ×6 · W3C · Chrome Dev ×2 · Poki ×3 · js13k · itch.io · 2048 GitHub
