# Save Part 17 (Verification Round 3) — Findings (Round 286)
**Date:** Wed 2026-10-15 ~04:46 EDT · **Source:** live web research (flukz, bugnet, qaskills, mdn, stardew valley)
**Project:** Mecha Protocol — save (pre-jam; verification round 3)

## A. Mechanics
- Corrupt-path battery (Flukz): test the failure mode directly — kill the process at randomized points mid-write across hundreds of runs. Browser analog: truncate at random byte offsets, inject invalid JSON/UTF-16 surrogates, delete keys, flip the dirty flag mid-write. "Normal playtesting never exercises interrupted saves, so the battery must simulate what play can't."
- QuotaExceededError hardening (MDN): ~5 MiB per-origin. setItem either succeeds fully or throws — a throw leaves the old value untouched. Drill: fill to ~95% with junk, save, verify no unhandled exception, LIVE never half-written (byte-identical guard), user gets a clear message. The throw-not-return behavior is the trap.
- Published-build drill (Flukz; MDN): "run this kind of test against every platform you ship on, not just the primary development machine." MDN risks: LRU eviction under pressure, Safari 7-day proactive eviction, private-browsing deletes localStorage on close. Jam "platforms": dev server, itch iframe, Chrome/Firefox/Safari, private-window.

## B. Validation
- Update drill (Bugnet; QASkills): version-stamped saves, migration functions per version, explicit tests per step. Seed v0/none saves, load in new build, assert every migration lands. No version stamp = unknown, never auto-migrated silently.
- Itch round-trip probe (itch.io docs): HTML games run in an iframe on itch's CDN — different origin, different storage policies. Save → reload → verify byte-identical LIVE+BAK inside the iframe. Catches origin-keying surprises, storage partitioning, third-party-cookie gating.
- Fixture immutability (QASkills): freeze real samples after every schema change — once frozen, never change. Any code change breaking a frozen sample fails loudly. "Frozen fixtures make old saves a contract, not a suggestion."

## C. Techniques
- Dual-slot redundancy (Flukz; Stardew): rotating generations — write new, verify checksum, THEN demote previous to .bak. Stardew ships this (main save + _old, one day behind). Our LIVE+BAK + byte-identical guard = the pattern.
- Dirty flags (M86Berg; Flukz): the flag marks an incomplete write so the loader distrusts the in-progress slot. Cleared only after both slots verified. User-visible recovery notice (not silent) = endorsed by Flukz.
- Budget guards (MDN): 5 MiB ceiling. localStorage never partially writes — reject oversized payloads before writing. Truncation-as-fallback is ruled out (see D).
- Versioned schemas (Bugnet; QASkills): version stamp on every payload; stepwise migrations (v0→v1→v2, never jumps); corrupt (invalid JSON) = fallback path; unknown version = refuse with clear message, never silently reinterpret.

## D. What to avoid
- Silent resets (Flukz): "Silent failure — loading a corrupted save as if it were valid... is the outcome to avoid above all else, since it turns a save problem into a much harder-to-diagnose gameplay bug report days later." Every reset must be loud.
- Truncation: no source endorses it. MDN: catch and free space. Flukz: checksum-before-parse. Truncation creates saves that parse but are semantically wrong — the worst failure mode.
- Single-slot (Flukz): "a half-written file that is neither the old save nor the new one." Never overwrite the live copy until the replacement is verified.
- Post-freeze migrations (Bugnet): migrations are planned tested steps, not emergency patches. After freeze, a schema change invalidates the frozen fixtures.

## E. Shipped
- Stardew Valley (survived): _old backups, one day behind. Thousands of crash-during-save reports end with "restored the _old backup."
- Cyberpunk 2077 (failed): 8 MB cap → corrupted, unrecoverable. The case for measure-before-write + user-visible quota messaging.
- Pokémon Sword/Shield (failed): autosave corruption — the "save happened while nobody watched" window. The dirty-flag targets exactly this.

## Implemented this round
- **REAL GAP FOUND + FIXED:** `_recoveredMidWrite` was set in save.js but NEVER displayed to the user — the M86Berg pattern was half-implemented (flag without the notice = near-miss of Flukz's silent-reset anti-pattern).
- **Fix:** (1) i18n key `ui.save_recovered`: "Save was interrupted — restored your backup. At most one session was lost." (Flukz's three requirements: detected ✓, done ✓, lost ✓). (2) game.js boot: when the flag is set, show the banner (4s, amber) + Telemetry. Verified: key present, wired, all three Flukz elements in the copy. +8 → **4,495 lines**, all clean.
- **SAVE-SPEC.md:** verification round 3 (below).

## F. Sources
flukz · bugnet · qaskills · mdn · stardew valley · cyberpunk · pokemon
