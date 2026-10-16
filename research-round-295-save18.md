# Save Part 18 (Verification Round 4) — Findings (Round 295)
**Date:** Wed 2026-10-15 ~05:22 EDT · **Source:** live web research (meta, mdn, aaa thread, minecraft, codedragons)
**Project:** Mecha Protocol — save (pre-jam; verification round 4)

## A. Mechanics
- Notice-copy audit (Meta Horizon OS): "notify the user that a previous save had a problem and that an older version is available," and "for each save display the date/time it occurred and total play time so the user can make an informed decision as to which file is the right one to load." The notice must contain (a) what happened, (b) that a fallback exists, (c) timestamps. Audit: trigger on every recovery path; name the fallback; show timestamps; appear before gameplay state is overwritten.
- Battery fixtures (Meta; AAA thread): "it's better to not only rely on this and use a checksum directly" — the battery must include truncated-but-parseable payloads and valid-JSON-with-bad-checksum, not just garbage. Akira675: a migration crash caused a week-long CS incident — fixtures must exercise every migration path; battery runs against all retained historical versions.
- Quota proof (MDN): 5 MiB per origin. The proof: (1) measure real serialized size, (2) enforce budget well under 5 MiB (headroom for key overhead + dual-slot duplication), (3) fill quota in test, prove the write throws QuotaExceededError, refuses, leaves the good slot untouched, surfaces the notice.
- QA severity (Ocean View Games, ex-Jagex): "crashes, data loss, or issues that block progression" = S1 Critical — release blockers. Any save failure that can lose progress = a ship-blocker, not polish.

## B. Validation
- Itch probe (Codedragons 2024; itch.io support 2025): Unity WebGL's persistentDataPath embedded a per-build GUID — every new build wrote to a new path, old saves vanished. Fix: pinned, build-independent path. Separately: Brave's "ephemeral site storage" silently clearing site storage — not itch at all. The probe must run on the real hosted page, in the real browser matrix (incl. Brave), and distinguish "game bug" from "environment wiped my storage" — the latter is why export/import exists.
- Update drill (AAA thread): version number in the data; migration routine per update, run in order. _sulimo: keep old saves for upgrade testing. Akira675: catch crashes inside migration, abandon the upgrade rather than writing a half-migrated save. _Auron_: backup the original before stepping through versions, warn the user, only save the finalized copy. Drill = old fixture × new build × every historical version.
- Fixture immutability (_sulimo; Meta): retain old-version saves permanently as test inputs. Schema version "does NOT have to be the same exact number as build version, but it does need to be incremented when anything changes." Fixtures: version-stamped, append-only, never edited. "A fixture that mutates is not a fixture."

## C. Techniques
- Dual-slot (Meta): "at least two files that are alternated between," never delete the old, keep as backup. Write rule: do not directly overwrite; do not delete the previous until the new is correctly written; on integrity failure load the previous, delete the bad, notify the user. Write-then-swap: serialize fully, single setItem per slot (one atomic store per key), verify by re-reading, then promote.
- Dirty flags (Meta): "Don't let an autosave process start while an old one is still running. Use a semaphore, queue, or have a method to abort the old autosave cleanly." = our save-in-progress flag. Crash-left-set → user-visible recovery notice ("an interrupted save is a good indication of something else going wrong").
- Budget guards (MDN; Meta): 5 MiB ceiling; keep save data small as policy. Defined byte budget enforced at write time (refuse + warn before attempting, never after partial write), with margin for dual-slot duplication + key overhead.
- Versioned schemas (Meta; AAA thread): version code in the save; increment on any structural change; on mismatch migrate (chained v4→v5→v6, never skips) or abort. _Auron_: "make it validate the data at the end." Live apps: migrate, never silently discard.

## D. What to avoid
- Silent resets: "never discard out-of-version data in a live app when migration is possible, and always notify the user when falling back." Quietly resetting = trust-destroying.
- Truncation without integrity check (Meta): relying on "missing data" as the corruption signal is insufficient; without a checksum, truncated-but-valid JSON silently loads a broken world. The battery must prove truncated payloads are caught by the checksum.
- Single-slot overwrite (Meta): "Do not directly overwrite an existing save solution." One interrupted write = total loss. (Factorio community feature request exists because even seasoned players fear the single-slot window.)
- Post-freeze migrations (SE.SE): "resist the urge to keep changing the file format." New data = new additive fields, never redefined ones, unless a migration ships with it.
- Environment assumptions (Brave): the browser can delete storage outside your code's control. Ship export/import; detect "no save where one existed"; probe the real deployment.

## E. Shipped
- Minecraft (SURVIVED): level.dat / level.dat_old — dual-slot at planetary scale for over a decade. "level.dat_old or a backup typically restores everything but the last save." = Meta's guidance, shipped.
- Cyberpunk 2077 (FAILED, then fixed): 8 MB cap → permanently corrupted, unrecoverable. Hotfix 1.06 removed the cap; GOG: "no way to recover the corrupted save." Root cause: no size budget guard on unboundedly-growing payload. Survived only because older saves existed (multiple slots).
- Brave vs Scott's itch games (ENVIRONMENT): game code correct, Brave's ephemeral storage wiped it. Lesson: the storage layer is adversarial; ship export/import, detect missing saves, probe the real environment.

## Implemented this round
- **TIMESTAMP IN THE NOTICE (js/game.js, Meta):** the recovery notice had (a) what happened + (b) fallback, but not (c) timestamps. Now appends the backup's `savedAt`: "Save was interrupted — restored your backup. At most one session was lost. (Backup: 10/15/2026, 12:46:00 AM)". Banner duration 4s → 6s (longer text). Verified: all three Meta elements present. +7 → **4,505 lines**, all clean.
- **SAVE-SPEC.md:** verification round 4 (below).

## F. Sources
meta · mdn · aaa thread · minecraft · cyberpunk · brave · codedragons
