# Save Part 22 (Verification Round 8) — Findings (Round 331)
**Date:** Wed 2026-10-15 ~07:40 EDT · **Source:** live web research (horneman, 0xkiire, bugnet, mdn)
**Project:** Mecha Protocol — save (pre-jam; verification round 8)

## A. Mechanics
- Corruption audit (Bugnet): "corrupt your own saves on purpose; validate on load, not on faith; keep a backup you actually test." "Deliberately corrupt real saves (bit-flips, truncation, zero-fill, malformed JSON) and interrupt writes mid-flight."
- Migration audit (Bugnet; Horneman): "keep saves from every shipped version in a fixture corpus; load each old save in every new build." "Stamp per-bucket version numbers (minimum + current) and check 'all versions >= minimum' at load."
- Quota audit (MDN; BrowserStack): "localStorage ~5 MiB per origin; Safari private mode setItem throws." "Drive storage to limit; verify QuotaExceededError caught and surfaced, never silently dropping data."

## B. Validation
- Fuzz testing (OWASP): "mutation fuzzing — valid saves with random byte mutations, truncation, invalid UTF-8, wrong-typed fields." "Loader must never throw uncaught; must reject-and-fallback."
- Version-migration tests: "automated suite loads every fixture from every prior schema, runs migration chain, asserts field-level equality." "Content changes (not just structure) = real migration risk."
- Cross-browser storage: "test probeStorage on Chrome, Firefox, Safari incl. private/incognito." "Safari throws where others silently fail."

## C. Techniques
- Atomic writes (0xkiire): "write to temp, fsync, rename — atomically replace, never patch in place." localStorage equivalent: "dual-slot rotation: write to inactive slot, verify, flip active pointer."
- Checksums: "store checksum alongside payload and verify before parse; cheap integrity tripwire converting silent corruption into loud, recoverable rejection."
- Schema versioning (Horneman): "Version all the things; write explicit v→v+1 migrations; use defaults for missing keys."
- Graceful degradation (Horneman): "invalid save → fall back to other slot, then defaults, never crash." "Accuracy beats recency — 5-min-old correct > 30-sec-old corrupted."

## D. What to avoid
- Partial writes: "overwriting live save in place — interrupted write leaves neither old nor new." (Root cause of most corruption.)
- Silent corruption: "trusting 'it parsed' means 'it's valid' — validate on load, checksum first, schema second."
- Version lock-in: "renaming fields without version bump; auto-wiping old saves; no migration path." (Horneman: "saving before load completes wipes save — assert against it.")
- Quota surprises: "assuming localStorage infinite (~5 MiB cap); uncaught QuotaExceededError; ignoring private-browsing."
- Single-backup complacency (Terraria): "one .bak covers exactly one bad write, overwritten on next save; rotation beats single copy."

## E. Shipped
- Minecraft: "level.dat_old beside level.dat; on corruption rename back." "Automatic, adjacent, public recovery — zero player effort."
- Celeste: "backup copies per save slot; corruption contained to one slot." "Slot-local backups prevent shared failure domain."
- Terraria: "single .bak survives crash-during-save, but overwritten every save — two failures defeat it." Lesson: rotate.
- Factorio: "rotating numbered autosaves give time-based rollback."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** save integrity. FNV-1a checksum (save.js:2, 38-42 — "cheap integrity tripwire," checksum verified before parse). Schema versioned (save.js:18, `schema: 1` — Horneman "version from day one"). Atomic two-key rotation A/B (save.js:2 — 0xkiire pattern: write inactive, verify, flip). All pro requirements implemented.
- **SAVE-SPEC.md:** verification round 8 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
horneman · 0xkiire · bugnet · mdn · minecraft · celeste · terraria · factorio
