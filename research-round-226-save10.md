# Save Part 10 (Pre-Jam Freeze) — Findings (Round 226)
**Date:** Wed 2026-10-14 ~22:06 EDT · **Source:** live web research (itch, mdn, abratabia, floaty, flukz)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- itch iframe (CDN origin; ITP/eviction risk).
- LD Survival (4-8h publish; halfway freeze; "Cut. Cut. Cut.").
- Export-primary = only controlled save.

## B. Validation
- Round-trip test. Defensive load. Version + migration.
- Boot probe (MDN). Failure modes (quota/corrupt/unknown).
- Lifecycle saves. Device matrix.

## C. Techniques
- Single state + version. Throttled autosave. Base64 export/import.
- Checksum (CRC32/FNV). .bak rotation. Save indicator.
- Graceful degradation (2048 fakeStorage).

## D. What to avoid
- Schema drift. localStorage-only. SecurityError. Quota traps.
- Direct overwrite. Skipping validation. Silent failure.
- Desktop-only testing. Debug-only export.

## E. Shipped
- Cookie Clicker (60s; Base64; migration). A Dark Room (debounced).
- 2048 (probe + fakeStorage).

## Implemented this round (verification)
- **Verified:** checksum + TMP→verify→LIVE + .bak + probe + canary all present.
- **SAVE-SPEC.md:** freeze discipline + lock checklist + timeline.
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
itch · mdn · abratabia · floaty · flukz
