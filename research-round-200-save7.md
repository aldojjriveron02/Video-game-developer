# Save Part 7 (Final Validation) — Findings (Round 200)
**Date:** Wed 2026-10-14 ~19:33 EDT · **Source:** live web research (bugnet, abratabia, floaty, mdn, aaryte, itch.io, shelsoloa, gamedev)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- itch iframe sandbox (leafo: different domain; 3P blocking → denied storage).
- Fracas 3 (blocked cookies; workarounds + warning). itch/t/2636350 (lost hours).
- Survival Guide (4h publish budget). abratabia (browsers clear storage).
- persist() (MDN one-liner).

## B. Validation
- bugnet (validate before write; never overwrite good backup; checksums).
- Migration (versioned; chain v1→v2→v3; validate after).
- Quota (try/catch; 22/1014; 18; 5MB cap). Test matrix (versions; crashes).
- Probe (write→read→verify→delete; beats try/catch on Safari).

## C. Techniques
- Atomic writes (temp → verify → swap). Rolling backups (3-5 slots).
- Versioned + migrations. Throttled (dirty flag; 1/sec; never frame loop).
- visibilitychange + Page Lifecycle (iOS beforeunload unreliable).
- Export/import (base64 round-trip).

## D. What to avoid
- localhost-only. try/catch-only detection. iOS defaults (mainstream path).
- Frame-loop saves (12ms budget). beforeunload-only. Overwriting good backup.
- Trusting durability. Pipeline discovery at Submission Hour.

## E. Shipped
- Fracas 3 (degrade + warn). bugnet.io (4-layer stack). Construct 3 (widespread).

## Implemented this round (code)
- **js/save.js:** requestPersist() (MDN one-liner + telemetry).
- **js/game.js:** persist wired at boot alongside probe.
- **SAVE-SPEC.md:** conditional decision + GO gate (a-d).
- 4,176 lines (+12).

## F. Sources
bugnet · abratabia · floaty · mdn · aaryte · itch.io · shelsoloa · gamedev
