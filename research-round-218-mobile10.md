# Mobile Part 10 (4-Item Gate) — Findings (Round 218)
**Date:** Wed 2026-10-14 ~21:17 EDT · **Source:** live web research (itch.io, leafo, gamedev, playgama, mdn)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam mobile
- LD60 (Fri 6PM EDT; 72h). itch.io (mobile forces fullscreen; Mobile Friendly flag).
- leafo (aspect ratio = orientation). ZIP (index.html root; ≤1000 files; relative; case-sensitive).

## B. Validation
- Gate 1 (dry run; 2h buffer; warmup). Gate 2 (config; aspect; page+URL).
- Gate 3 (iPhone 17 real; tap unlock; sizing; rotate; bfcache).
- Gate 4 (post-jam; desktop-first; mobile = upside).

## C. Techniques
- Audio unlock (sync resume; volume-0). touch-action: manipulation.
- iOS callout (none + user-select none). visualViewport + safe-area.
- 120Hz-safe ✓. DPR cap.

## D. What to avoid
- Android fullscreen cutoff (Jul 2026; itchio#881). Game-page ≠ direct URL.
- Absolute paths. ZIP limits. Jam hours on mobile (desktop-first scoring).

## E. Shipped
- Hextris (touch+keyboard; open source). itch mobile-friendly (557 games).
- Jul 2026 thread (HTML5 mobile is real; sizing not "doesn't run").

## Implemented this round (code)
- **css/style.css:** -webkit-touch-callout: none.
- **MOBILE-SPEC.md:** NOT-ready kept + 4-item gate.
- 4,258 lines (+1 CSS).

## F. Sources
itch.io · leafo · gamedev · playgama · mdn
