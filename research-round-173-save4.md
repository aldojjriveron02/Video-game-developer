# Save Part 4 (Jam & Validation) — Findings (Round 173)
**Date:** Wed 2026-10-14 ~21:50 EDT · **Source:** live web research (itch.io forum, ddmeow, playgama ×3, MDN, webkit, slothbytes)
**Project:** Mecha Protocol — saves (Phase 3, pre-jam)

## A. Jam save
- itch.io: no cloud API; localStorage is everything. CDN-address trap (fixed but untrustworthy).
- Fixed key prefix. WebKit 7-day ITP rule (7-day nudge grounded).

## B. Validation
- try/catch + validate; hand-corrupt battery; migration chain; quota (5MB; estimate()).
- "No save" = first-class state.

## C. Techniques
- Versioned + migration. Autosave: visibilitychange+pagehide SYNC (not beforeunload).
- Save jank guard (debounce; safe moments). Export = the jam "cloud".

## D. What to avoid
- In-place overwrite; no checksum; uncaught quota; beforeunload-only; blocking saves.
- Assuming itch storage; sessionStorage; ignoring 7-day wipe.

## E. Shipped
- Humane Tiger (itch persistence). ddmeow (fixed path). Steam Cloud pattern. Playgama.

## Implemented this round (audit)
- **Verified compliant:** dual-slot, checksum, fallback, migration, autosave, nudge, Export.
- **SAVE-SPEC.md:** jam decision + validation battery + traps. Spec only, +0 lines.
- 4,036 lines (+0).

## F. Sources
itch.io · ddmeow · playgama ×3 · MDN · webkit · slothbytes
