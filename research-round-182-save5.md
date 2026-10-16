# Save Part 5 (Jam & Validation) — Findings (Round 182)
**Date:** Wed 2026-10-14 ~18:00 EDT · **Source:** live web research (aaryte, itch.io ×2, webkit, mdn ×2, helptmetest, qaskills, flukz, cookieclicker, templatefoundry)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- Chrome 3P-blocking = total denial. Safari iOS = silent non-persistence (try/catch blind).
- itch.io iframe MUST be cross-domain (leafo). WebKit: 3P storage partitioned+ephemeral; 7-day ITP cap.
- IndexedDB shares iframe fate. Net: localStorage best-effort; Export = reliable path.

## B. Validation
- HelpMeTest (failure modes; 16-point checklist). QASkills (risk/migration matrices; idempotency; Playwright).
- Flukz (fault injection: kill mid-write).

## C. Techniques
- Crash-safe: TMP→flush→rename; single-key atomic unit. Checksums (fnv1a/CRC32) before parse.
- Backup rotation. Versioning (Cookie Clicker pattern).

## D. What to avoid
- Quota (5MB; Safari iframe 1/10). Whole-origin eviction. 7-day ITP.
- Private mode. Silent-failure trap (probe!). Schema drift. IndexedDB ≠ jam fix.

## E. Shipped
- Cookie Clicker (base64+!END!; 60s autosave+toast; export/import/file; double-confirm wipe).
- Template Foundry kit. Godot IDBFS.

## Implemented this round (code)
- **js/save.js:** `SaveStore.probeStorage()` — write marker → read back → `storageOK`.
- **js/game.js:** probe at boot + warning banner on briefing when `!storageOK`.
- **js/i18n.js:** `ui.save_unreliable` (EN + JA).
- **SAVE-SPEC.md:** jam decision + hardening + traps.
- 4,081 lines (+21).

## F. Sources
aaryte · itch.io ×2 · webkit · mdn ×2 · helptmetest · qaskills · flukz · cookieclicker · templatefoundry
