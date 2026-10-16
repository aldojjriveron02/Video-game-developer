# Save Part 16 (Verification Round 2) — Findings (Round 277)
**Date:** Wed 2026-10-15 ~03:34 EDT · **Source:** live web research (blow, r/unity3d, bugnet, playgama, r/gamedev)
**Project:** Mecha Protocol — save (pre-jam; verification round 2)

## A. Mechanics
- Published-build drill (Blow): console certification subjects REAL builds to "a big list of these kinds of weird tests," including powering off during saves. Platform holders test the artifact players receive, not dev builds. (Fez: Fish was "floored that this wasn't found in testing" — the tested config wasn't the shipped one.)
- Interrupted-write kill test (r/Unity3D, ~200 upvotes): never write directly to the live save — temp file + atomic rename. Keep 2–3 completed saves as backups; verify integrity before rotating. M86Berg's flag: "save in progress" = 1 at save start, cleared only after write + verify → on boot, detect died-mid-write, notify the user (never silently reset), offer a previous save.
- Budget guard (Bugnet; Cyberpunk): localStorage ~5MB/origin; writes throw QuotaExceededError. Cyberpunk's 8MB cap SILENTLY corrupted saves permanently (no refusal, no guard) until Hotfix 1.06 removed it. A budget guard must refuse-per-write (never partial-write), leaving live+backup provably untouched.

## B. Validation
- Embed target matrix (r/Unity3D): text saves must use invariant locale + fixed newlines ("5.0" vs "5,0"). Web adds: browsers (quota behavior), hosting contexts (file:// vs https, itch.io iframe sandboxing), incognito/private (storage disabled/ephemeral).
- Fixture drill (Playgama): deliberately test corrupt-save handling — truncate JSON, delete keys, old-version object — confirm the game still boots. Corrupt paths are the most worth testing; QA never hits them by accident.
- Update drill (Fez): the update/patch flow is itself a corruption vector — old save + new build, new save + old build, interrupted patch. Every save carries a version + migration routine.

## C. Techniques
- Checksum discipline: verify after every write, before trusting any load; check backups too — each generation known-good before it becomes the fallback.
- Backup rotation: 2–3 completed saves; rotation only after the new save verifies.
- Atomic writes: tmp → verify → rename → live. Same directory (rename atomicity). Web: build the full payload in memory, commit in one setItem — never mutate across writes.
- Schema versioning: stamp every save; explicit migration routines; design for additive changes. "Hand-rolled versioning is the thing you will forget to bump" — the version check must be a tested code path, not a comment.

## D. What to avoid
- Silent resets (r/Unity3D consensus): notify + offer previous saves — never quietly wipe. Silent resets destroy trust and hide bugs.
- Unversioned schemas (first post-launch change orphans every player).
- Untested corrupt paths (Fez's "floored" = this at scale).
- Single slot (writing directly to the main save = biggest culprit in years of corrupted saves).
- Locale-dependent serialization (floats, dates, newlines with machine defaults).

## E. Shipped
- HORROR: Fez (2012) — patch 1.02 corrupted saves; Microsoft pulled it; Polytron re-released the identical broken patch (re-cert ~$40,000). The corruption lived in the UPDATE flow, never exercised by routine QA. <1% affected — exactly why it slipped through.
- HORROR: Cyberpunk 2077 (2020) — 8MB cap silently corrupted saves permanently, all platforms; Hotfix 1.06 removed the cap. An unstated ceiling + no refusal + no guard = silent data destruction.
- WIN: atomic-save + user-visible recovery (r/Unity3D consensus) — temp atomic writes + post-write verify + backup rotation + save-in-progress flag with "corrupt data detected — load a previous save?" = "eliminated save-corruption losses entirely." Maps 1:1 onto our pipeline + no-silent-resets.

## Implemented this round
- **SAVE-IN-PROGRESS FLAG (js/save.js, M86Berg pattern):** the one window tmp→verify→bak→live left open (death between commit steps). `mecha-protocol-save-dirty` set after the budget guard passes, cleared only after LIVE commits. On boot, a set flag → cleared + `_recoveredMidWrite = true`, so the game can surface a user-visible notice (never a silent reset). Verified functionally: normal write clears the flag; simulated mid-write death → recovery detected, flag cleared, valid save reads. +9 → **4,461 lines**, all clean. Fixtures 8/8, selfTest 6/6.
- **SAVE-SPEC.md:** verification round 2 (below).

## F. Sources
blow · r/unity3d · bugnet · playgama · r/gamedev · fez · cyberpunk 2077
