# Mobile Part 9 (Final Confirmation) — Findings (Round 206)
**Date:** Wed 2026-10-14 ~20:02 EDT · **Source:** live web research (itch.io, ldjam, abratabia ×4, stelabouras, lacombe, deepestsword, tinycolony)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam mobile
- LD60 (Oct 16 6PM; 72h; Submission Hour; bug fixes w/ changelog).
- itch canonical; "browser, minutes, alone." Mobile friction hits Fun/Overall.
- Mobile Friendly flag; ZIP limits (1000 files, 500MB, 240 chars); click-to-play.

## B. Validation
- Abratabia (lowest-end device; remote debug; touchstart; thermal 15min; dvh; notch; audio gesture; ITP).
- Lacombe (device list; scenarios; edge cases; ≥30fps; battery).

## C. Techniques
- Abratabia (70-80% render; prewarm; batch; ASTC; iOS gotchas: no fullscreen; touchcancel; context loss; touch-action).
- Stelabouras (stable URL; iframe storage; visibility API; orientation lock iOS-disabled).
- Audio (Web Audio SFX; one element BGM; resume in gesture; voice cap).

## D. What to avoid
- No Mobile Friendly flag. Absolute paths. iOS fullscreen assumptions.
- Gesture-less audio. Flagship-only. LocalStorage-only. URL instability. touchcancel.

## E. Shipped
- Deepest Sword (LD48 → native). Tiny Colony (web + APK). 458 phone-browser LD entries.

## Implemented this round (code)
- **js/game.js:** visualViewport sizing + resize listener (iOS address bar).
- **MOBILE-SPEC.md:** NOT-ready kept + iOS audit + Submission Hour plan.
- 4,191 lines (+5).

## F. Sources
itch.io · ldjam · abratabia ×4 · stelabouras · lacombe · deepestsword · tinycolony
