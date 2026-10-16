# Save Part 12 (Jam-Day Save Verification) — Findings (Round 241)
**Date:** Wed 2026-10-14 ~23:32 EDT · **Source:** live web research (meta, mdn, webkit, sirlin, cookie clicker, itch.io, bugnet, r/gamedev)
**Project:** Mecha Protocol — save (pre-jam; verification + fixtures)

## A. Mechanics
- Seven-case corruption drill (each case's handling rule, sourced): truncated → footer/end-marker + JSON try/catch → fall back to .bak, else fresh state WITH player notification (Cookie Clicker '!END!' pattern). Flipped bytes → integrity check rejects (Meta: "Put an integrity check into your save file" — last line). Empty/missing → create on demand, no errors. Wrong checksum → reject + offer latest backup. Future schema → never read as current: migrate or deliberate abort (Meta: "increment the data version when anything changes"). Twilight Dungeons postmortem: schema change with no migration = lost 20% of player base. Kill-tab mid-write → never overwrite live directly: temp → validate → rotate (delete old .bak, promote current to .bak, promote temp to live) — exactly our TMP→verify→LIVE. Quota-exceeded → try/catch every setItem; drill by prefilling to ~5MB (Bugnet Construct 3: full-snapshot saves broke "after a few saves" — only at scale, never in dev).
- Golden fixtures: one known-good serialized save per shipped schema version (magic bytes, version tag, representative payload, expected checksum); load each through CURRENT loader, assert clean migrate or deliberate abort. Old loader functions retained per version.
- "Verify recovery FROM the backup": corrupt LIVE deliberately, boot, confirm game comes up on .bak DATA — not defaults. A never-booted-from .bak is a hope, not a backup. (Meta: alternate two autosave files, "do not delete the old file, keep it as backup.")

## B. Validation
- Self-test pattern: built-in diagnostics exercising the REAL chain on scratch keys (our SaveStore.selfTest() 5/5). Bugnet: "Reproducibility is the prerequisite for verification." Meta zombie-data: dev may discard old data freely; release must exercise every load path — headless self-test is how jam teams get that.
- Boot probe + canary per embed target: itch.io iframe = third-party storage (Bugnet: "may wipe it between sessions"); Safari ITP blocks third-party cookies by default (WebKit Jan 2024); Chrome/Firefox partition localStorage by top-level site (MDN) — same game, different buckets per embed; Firefox private discards on close. itch.io shared-domain: all games on html-classic.itch.zone share one origin — namespace every key with game ID; assume ~5–10MB shared.
- Quota drills: prefill to cap, attempt save + autosave; assert no uncaught exception, live save untouched, clear player message.

## C. Techniques
- Safe vs unsafe <24h: SAFE = additive-with-defaults + version bump. UNSAFE = rename/remove fields, change types, touch write path without re-running full drill + fixtures. (Twilight Dungeons = canonical unsafe.)
- Export-first communication: Cookie Clicker ships Export/Import/Save-to-file/Load-from-file/Wipe with "This is how your progress is saved." itch.io 2023 migration: community's only recovery was player-held exports (CrocMiam's tool). Jam action: surface Export prominently; "export before long sessions" in game description.
- Budget <50KB: headroom vs quota, fast sync writes (localStorage blocks the frame), paste-friendly export strings.
- Never block boot on load error (Meta zombie-data; Sirlin): failed load → fresh stable state + notification, never hang.

## D. What to avoid
- Silent resets to defaults (wrong bug reports; corruption hides for weeks).
- Untested backup chains (itch.io: "no way to restore from a backup" per player — in-game chain is all you have).
- Schema changes after freeze (Meta versioning rules; 20% lesson).
- Trusting embeds (partitioned, wiped, absent — storageOK + canary + Export-first = treat as cache, not vault).
- The itch.io 2023 lesson (leafo, Aug 2023): v6p9d9t4.ssl.hwcdn.net → html-classic.itch.zone, Nov 22 2023 — ALL browser saves orphaned platform-wide, "no way around this." Strongest Export-first argument there is.

## E. Shipped
- Cookie Clicker: base64 + '!END!', 60s autosave, full Export/Import/file UI — web-scale corruption handling.
- Twilight Dungeons: schema change, no migration, −20% players — the cost of unsafe changes.
- itch.io platform migration: every HTML5 save orphaned — you don't own the domain your saves live on.

## Implemented this round
- **Golden fixtures (test/fixtures/):** save-v1-good.json (517 bytes, markers), save-v1-truncated.json, save-v1-badchecksum.json — generated through the REAL write path.
- **test/save-fixtures-test.js:** 8 assertions through the current loader (good loads/markers/schema/checksum/budget; truncated→defaults; bad-checksum→.bak restores; future-schema→defaults).
- **REAL BUG FOUND + FIXED by the test:** future-schema save with valid checksum → migrate() returned null → read() returned NULL to the game (would crash on saveData access). Fixed: checksum-valid but unmigratable now falls through to backup → defaults. Never hands the game a null save. +3 lines.
- **8/8 pass.** +3 → **4,405 lines** (+3). All node --check clean.
- Note: "Kozak failure matrix" name could not be matched to any public source (researcher searched repeatedly) — the seven drill cases are sourced from professional guidance regardless; attribution treated as unverified.

## F. Sources
meta · mdn · webkit · sirlin · cookie clicker · itch.io · bugnet · r/gamedev · ct.js
