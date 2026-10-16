# Mobile Part 6 (Jam Deploy & Validation) — Findings (Round 179)
**Date:** Wed 2026-10-14 ~23:55 EDT · **Source:** live web research (itch.io official, playgama ×2, cinevva, web.dev, mdn, butler docs, fit-tester, storeyline)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam deploy
- itch.io (click-to-play; fullscreen default; orientation by dimensions; Mobile Friendly warning).
- Playgama (zip root index.html; HTML kind; played-in-browser; iframe domain — test saves).
- Butler (push dir user/game:channel; live on upload; --hidden staging; push-preview).
- LD60 via ldjam.com + itch.io page linked [unverified].

## B. Validation
- Mobile Fit Tester (presets; overlays; report; smallest phone first; local server).
- Cinevva checklist (real devices; sizes; orientations; low-end; 3G; Safari quirks; interruptions).

## C. Techniques
- Viewport meta; CSS lock (touch-action:none); dvh over vh; Pointer Events;
  48dp targets; audio unlock (first-tap resume); rotate prompt; graceful fullscreen;
  DPR cap.

## D. What to avoid
- Unticked Mobile Friendly; pinch-zoom/pull-refresh; hover deps; <48px limb targets;
  fullscreen/lock on iPhone; vh units; keyboard resize; audio w/o gesture;
  localStorage in iframe; PWA for jam (skip).

## E. Shipped
- itch.io mobile-friendly tag (556). Storeyline (solo, vanilla JS, propose-confirm).
- Fit Tester tool. Cinevva TouchButton.

## Implemented this round (code)
- **js/game.js:** limb picker buttons 40px → 48px (web.dev rule).
- **MOBILE-SPEC.md:** pre-butler checklist (verified compliant) + deploy plan + traps.
- 4,060 lines (+1).

## F. Sources
itch.io ×2 · playgama ×2 · cinevva · web.dev · mdn · butler · fit-tester · storeyline
