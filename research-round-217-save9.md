# Save Part 9 (itch Round-Trip) — Findings (Round 217)
**Date:** Wed 2026-10-14 ~21:11 EDT · **Source:** live web research (ldjam, itch.io, mdn, aaryte, slodds, floaty)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- LD (72h; Submission Hour; bugfix = v2 release; binaries on itch).
- Save must survive deadline → fixed build. First-try on itch.

## B. Validation
- itch iframe = different domain. aaryte (3rd-party cookies block).
- Safari iOS (Prevent tracking breaks; wipe on quit; 7-day max).
- MDN (partitioning; Storage Access API; Chrome v115+).
- Probe: canary → embed → round-trip → degraded.

## C. Techniques
- floaty (validate/clamp/version/throttle/export; 4KB/5MB).
- Slodds (meaningful events; version day one; <10KB; 10x retention).
- Supagames (minimal; defensive; Continue gated; corrupt QA).

## D. What to avoid
- No version (Slodds #1). iOS embed as durable. No UX on denial.
- beforeunload-only mobile. Event history. postMessage. Secrets.

## E. Shipped
- SugarCube v2 (autosave; slots; version; export; warning).
- Fracas 3 (workaround + warning). floaty. Supagames. Slodds 14.

## Implemented this round (audit)
- **Verified:** probe order; SCHEMA v1; migration; Export-primary.
- **SAVE-SPEC.md:** conditional-probe + round-trip checklist + hour plan.
- Spec only, +0 lines. 4,258 lines (+0).

## F. Sources
ldjam · itch.io · mdn · aaryte · slodds · floaty
