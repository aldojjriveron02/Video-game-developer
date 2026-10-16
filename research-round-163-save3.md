# Save Part 3 (Jam & Validation) — Findings (Round 163)
**Date:** Wed 2026-10-14 ~18:10 EDT · **Source:** live web research (slodds, itch.io, idlekit, cookieclicker, helpmetest, bugnet, liz6, shresthaco, altimit, webkit, 2048)
**Project:** Mecha Protocol — saves (Phase 3, pre-jam)

## A. Jam save
- Slodds ("no save = toy"; autosave + pagehide). LocJAM (autosave + delete-confirm).
- IdleKit (localStorage sync beats IndexedDB for close-time). Cookie Clicker (export/import/wipe).

## B. Validation
- HelpMeTest (corruption categories; golden files; mutation; kill-mid-save).
- Bugnet (reference corpus; backup before migrate). liz6 (fault injection; CAS).

## C. Techniques
- Versioned schema (stepwise migrations). Header (magic; checksum before decode).
- Atomic writes (tmp→verify→bak→live). Checksums (CRC32C/xxHash). Autosave (safety predicate; ring).

## D. What to avoid
- Safari 7-day wipe (iPhone trap; export = only durable path). Unversioned saves.
- Async close-time writes. Silent corruption. Saving mid-animation.

## E. Shipped
- Cookie Clicker (base64 + !END!; 60s autosave). 2048 (per-move; probe; fallback).
- LocJAM entry. Slodds ×14. IdleKit.

## Implemented this round (code)
- **js/tutorial.js + i18n.js:** 7-day wipe nudge + Export button on welcome screen.
- **SAVE-SPEC.md:** jam decision + validation + traps.
- 3,862 lines (+16).

## F. Sources
slodds · itch.io · idlekit · cookieclicker · helpmetest · bugnet · liz6 · shresthaco · altimit · webkit · 2048
