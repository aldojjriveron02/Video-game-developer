# Mobile Part 11 (Pre-Jam Freeze) — Findings (Round 227)
**Date:** Wed 2026-10-14 ~22:12 EDT · **Source:** live web research (ldj.am, abratabia, supagamesai, mdn)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam mobile
- LD ideal (browser, minutes, alone). Friction costs ratings.
- Submission Hour (bug fixes only). Personal deadline 2h early.
- Mobile = containment, not features (NOT-ready kept).

## B. Validation
- abratabia (8-item: boot; controls; audio; text; no scroll; <16ms; real device; viewport).
- supagamesai (64px; coords; orientation; QA).
- iOS gotchas (touchcancel; 300ms; context-loss; ITP).

## C. Techniques
- Viewport meta. Canvas (DPR cap 2; resize). Pointer events.
- touch-action scoped. env() + dvh. Audio unlock. rAF only.

## D. What to avoid
- Mobile features in freeze. Fullscreen iOS. orientation.lock.
- 100vh. Global touch-action. Unresumed AudioContext. Memory.
- touchcancel. localStorage fragility. Desktop-only testing.

## E. Shipped
- Breakout Season (Nordic 2024). They Stole My Teddy Bear (1.5d).
- itch tag page (530 mobile-friendly).

## Implemented this round (verification)
- **Verified:** pointercancel → deselect (touchcancel covered). Buttons onclick (no stuck).
- **MOBILE-SPEC.md:** freeze discipline + one-device pass + submission plan.
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
ldj.am · abratabia · supagamesai · mdn
