# Save Part 6 (Jam & Validation) — Findings (Round 191)
**Date:** Wed 2026-10-14 ~18:48 EDT · **Source:** live web research (ld embed, jambrain #2170, itch.io ×2, bountyboard, mdn ×2, web.dev, bugnet, adarkroom, gamebyte, vibegames)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- LD sandbox (no storage/fetch; #2170 open 2022). itch.io (leafo build-path;
  utunnels domain scope + backup). Brave ephemeral. itch.zone.
- Export ladder: Blob → clipboard → on-screen string.

## B. Validation
- Bugnet matrix (checkpoints, kill -9, versions, fixtures, telemetry).
- DevTools quota sim. Corrupt injection. Browser matrix.

## C. Techniques
- Dual-slot rotation (atomic). FNV-1a/CRC32. Chained migrations (A Dark Room).
- Quota (10 MiB). Perf (sync/blocking, debounced). persist().

## D. What to avoid
- Silent loss. LD trap. itch build-path. Brave/private. Quota. Schema drift.
- 3P-cookie blockers. Export-in-sandbox.

## E. Shipped
- A Dark Room (migrations, NaN heal). Gamebyte (SaveSystem). VibeGames.

## Implemented this round (audit)
- **Verified compliant:** checksum + version + dual-slot + LD-safe + Export.
- **SAVE-SPEC.md:** ladder locked + persistence-ready decision + validation matrix.
- Spec only, +0 lines. 4,112 lines (+0).

## F. Sources
ld embed · jambrain · itch.io ×2 · bountyboard · mdn ×2 · web.dev · bugnet · adarkroom · gamebyte · vibegames
