# Save Part 19 (Verification Round 5) — Findings (Round 304)
**Date:** Wed 2026-10-15 ~06:00 EDT · **Source:** live web research (stardew, factorio, skyrim, console cert)
**Project:** Mecha Protocol — save (pre-jam; verification round 5)

## A. Mechanics
- S1 blocker (console cert): "any failure mode where player progress can be lost or corrupted without a working, player-facing recovery path." Failing save requirements = submission rejection, not just bugs.
- Save QA battery: (1) normal save/load + visual indicators; (2) interruption/power loss — "after each, the game must recover to a playable state — no stuck boot, no bricked slot"; (3) corruption fixtures (corrupt/zero-byte/truncated) — "graceful error prompt, never a crash"; (4) storage-full — "caught and surfaced as a clean prompt, not a crash"; (5) patch compatibility — N-1 to N must load.
- Stardew's version rule: every save tagged `<gameVersion>`; older build cannot load newer save; newer loads older; one-way tagging on first write by new build.
- Notice audit: "every state where progress is at risk (save-in-progress, write failure, corruption detected, recovery performed, storage full) needs a player-visible, timestamped notice." Silent recovery AND silent failure = audit failures.

## B. Validation
- Hostile environments (Factorio t=102958): full-disk corrupted saves; studio: "there is nothing we can do about this." The pros validate GRACEFUL FAILURE, not impossible prevention. Rotating autosaves (3 slots) limited blast radius — "one corrupted write did not destroy everything."
- Update drills (Stardew): one-way version tagging; new loads old; old refuses new cleanly; never silently "fix" schema mismatch by dropping data. SE consensus: version header, kCurrentVersion/kMinimumSupportedVersion, explicit upgrade paths.
- Export round-trips (Stardew): saves portable PC/mobile/Switch/Vita; receiving build must not be older than save's version tag. Bar: export importable on different device/build; import validates (version, schema, checksum) before touching live slot.

## C. Techniques
- Dual-slot: Stardew keeps `FarmName_123456789_old` + `SaveGameInfo_old` — "delete the current files, strip `_old`, reload." Minecraft: `level.dat_old`. Factorio: rotating autosaves. "No save system ships with a single writable copy."
- Atomic writes: Stardew's `*_STARDEWVALLEYSAVETMP` — write to temp, rename on success. "A power cut mid-write corrupts only the temp file, never the live slot."
- Checksums: validate-then-load, corrupt-then-prompt. Anti-pattern: load garbage and crash.
- Versioned migrations: `<gameVersion>` + one-way upgrade; never mutate destructively; unknown fields preserved or warned, never silently dropped.

## D. What to avoid
- Silent data loss: Stardew wiki — "save issues are almost always caused by the game itself, not mods." Factorio: corrupted + crash on restart, no recovery offered. "Failure must be loud, dated, and actionable — never silent."
- Single-slot: "a single writable copy plus one crash equals total loss."
- Untested quota: Factorio — "the save code was fine, the environment was not." localStorage QuotaExceededError is real and spec'd — "a budget/quota guard never exercised against a genuinely full store is an untested claim."
- Post-freeze schema: "once saves are tagged and players hold them, a schema change is a migration contract."
- Cloud silent overwrites: Steam Cloud "replacing newer local saves with older cloud copies" — sync conflicts as hostile environment.

## E. Shipped
- Stardew Valley (ConcernedApe): dual files per slot (`_old`), temp-then-rename, version-tagged one-way migration, mobile `_SVEMERG`/`_SVBAK`, SMAPI 10 daily backups. "Corruption became a documented, recoverable event instead of a catastrophe."
- Factorio (Wube): full-disk corruption; "could not be prevented." Survived via rotating autosaves — "blast radius contained by redundancy, not by the impossible goal of never failing."
- Skyrim PS3 (Bethesda): saves grew past ~6 MB → slowdown/crashes. Patch 1.4 reworked save data. "Save-size budgets are not cosmetic — unbounded save growth is a ship-blocker-class defect discovered in production."

## Implemented this round
- **FIVE RISK STATES (js/save.js + js/game.js + js/i18n.js, console cert):** audit found two silent gaps. (3) Corrupt LIVE → BAK fallback had NO notice (player gets older save, no why). (5) Oversize/quota refusal had NO notice (save silently doesn't happen). Fixed:
  - New `_recoveredCorrupt` flag: set when LIVE is corrupt but BAK loads. Notice: "Main save was damaged — loaded your backup instead. (Backup: <timestamp>)" — amber, 6s, one-shot.
  - New `_saveRefused` flag: set on budget-guard refusal ('oversize') or quota failure ('quota'). Notice in saveNow(): "Could not save — storage is full or the save is too large. Export your save as a backup." — red, 6s, one-shot.
  - All five states now player-visible: in-progress (internal/instant), write-failure (recovered), corruption (corrupt), recovery (both), storage-full (refused). "Failure must be loud, dated, and actionable — never silent."
  +24 → **4,559 lines**, all clean.
- **SAVE-SPEC.md:** verification round 5 (below).

## F. Sources
stardew · factorio · skyrim · console cert
