# Save Part 15 (Final Freeze) — Findings (Round 268)
**Date:** Wed 2026-10-15 ~02:27 EDT · **Source:** live web research (r/gamedev, gamedev.net, eurogamer)
**Project:** Mecha Protocol — save (pre-jam; final freeze)

## A. Mechanics
- Published-build drill (r/gamedev Jan 2023, "Save files need to be taken extremely seriously!"): a dev's corruption surfaced only via real-world interrupted writes. Prescription: temp file → validate → swap in — rehearsed on the SHIPPING artifact, not a dev build.
- Interrupted-write drill: "kill the process mid-write" — the single most-recommended test in the r/gamedev corpus. Confirm the last known-good save survives and loads.
- Budget enforcement: check actual save size on the published build. Skyrim PS3 = cautionary tale (~6MB → crawl). A hard guard checked before touching storage = exactly the right shape.

## B. Validation
- Embed target matrix: itch.io page/iframe, direct browser tab, ≥2 browsers — localStorage quota, private-browsing behavior, iframe storage partitioning all differ per environment.
- Fixture drill: golden fixtures immutable, replayed through the real load path, checksum + schema verified every load (GameDev.net Yovel: "validate every stage of load").
- Update drill: load saves from older builds — confirm migration or clean rejection. Version mismatches = second-most-common save-killer after interrupted writes.

## C. Techniques
- Checksum discipline: hash payload, store alongside, compare before trusting. (r/gamedev 2021 + 2023 independently converge.)
- Backup slots: live + backup; backup overwritten only by an already-validated save. Never write directly over last known-good.
- Atomic writes: temp → fsync/flush → atomic rename over live. Caveat: rename alone doesn't guarantee readability — verify before/after the swap.
- Schema versioning: stamp every save; bump on shape change; migration functions; reject unknown versions cleanly.
- Hard budget guards: refuse oversize before touching storage (our 50KB guard = the pattern; Skyrim = the textbook case).

## D. What to avoid
- Silent resets (r/gamedev consensus): corrupt data fails gracefully to backup — never crashes, never silently restarts from zero. Silent resets = #1 trust-destroyer.
- Unversioned schemas (every future change = potential save-wiper).
- Untested corrupt paths ("if you have never killed the process mid-write and fed the loader garbage bytes, your recovery code is untested code").
- Post-freeze schema changes (invalidates fixtures + update drill).
- Single slot (one interrupted write = total loss).

## E. Shipped
- Fez (Xbox 360, 2012): save-wipe bug shipped; first patch REINTRODUCED it; Microsoft refused to waive re-cert fees ("tens of thousands of dollars") — the corrupted-save bug shipped AGAIN. Lesson: untested corrupt path + costly post-launch fixes = drill before the jam, when fixes are free.
- Skyrim (PS3, 2011): save bloat past ~6MB → crawl; Bethesda acknowledged across patches 1.2/1.4. Unbounded save growth = shipping defect; direct precedent for the budget guard.
- r/gamedev Jan 2023 incident: the community's converged playbook (checksum + temp-write-validate-swap + rotating backup + kill-mid-write testing) = exactly this game's SaveStore architecture.

## Implemented this round
- **VERIFIED (the research's two checks):**
  1. Budget guard byte-safety: oversize write refused AND live + bak BOTH byte-identical after refusal (functional test). The guard touches nothing.
  2. Silent-reset audit: every `removeItem` in save.js lives in selfTest (test cleanup) — the load path (`read()`) never deletes; it reads LIVE → BAK → defaults only. No silent resets anywhere in the loader.
- **SAVE-SPEC.md:** final freeze (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
r/gamedev · gamedev.net · eurogamer · fez · skyrim
