# Save Part 11 (Browser-Game Save Systems) — Findings (Round 232)
**Date:** Wed 2026-10-14 ~22:42 EDT · **Source:** live web research (kozak, mdn, abratabia, playgama, bugnet, leafo)
**Project:** Mecha Protocol — save (Phase 1, pre-jam freeze)

## A. Mechanics
- Storage tradeoffs (MDN Jan 2026): localStorage 5 MiB/origin, sync, throws QuotaExceededError (wrap in try/catch). IndexedDB/OPFS dynamic quota (Chrome ~60% disk; Safari iOS 17+ ~60% browser, ~15% embedded; cross-origin iframes ~1/10 parent). iOS: persistent storage only from macOS 14/iOS 17; private mode = different quotas, data deleted at session end.
- Practitioner rule: localStorage is right for saves <1MB with infrequent writes (Abratabia); treat missing keys as "no data yet."
- Atomic-write pattern (Kozak, 16-yr dev ex-Ubisoft, Oct 2026): "write, flush, validate, replace, retain recovery data" — temp file, validate, replace live, keep previous as .bak. **Exactly our architecture.**
- Checksums: detect truncation/modification, NOT anti-cheat (Kozak). FNV-1a/CRC32 is the pragmatic norm for localStorage games — validates our FNV-1a.
- Versioning: envelope = schema version + payload + integrity + metadata; sequential migrations on a copy; keep backup until migrated save loads. Defaults intentional first, then apply loaded values.

## B. Validation
- Failure-matrix testing (Kozak): missing/empty/truncated/invalid-checksum/future-version/every historical version/missing fields/removed IDs/duplicates/permission errors/interrupted temp write + backup recovery + load-save drift. Golden fixtures per version in VC.
- Make failure VISIBLE: silent reset to defaults → tester reports wrong bugs. Diagnostic mode.
- Cross-session probes (Abratabia + Bugnet): Safari private throws on ANY write (quota ~0); Firefox private silently discards at session end. **Our boot probe + canary is the correct detection pattern — the two browsers fail differently.**
- Embed reality: itch.io 2023 CDN migration orphaned ALL browser saves permanently (official notice); localStorage in embeds = cross-site iframe storage (partitioned Chrome/Firefox, blocked Safari ITP); shared domains clash. **Export/Import as primary escape hatch is exactly right — all sources endorse.**
- Backup-chain: verify RECOVERY FROM the backup, not just existence (Kozak); deliberately corrupt during testing (Playgama).

## C. Techniques
- Autosave triggers (Playgama/Abratabia/MDN): visibilitychange (hidden) + pagehide primary; synchronous writes only (async may be cancelled on unload); beforeunload unreliable on mobile; dedupe ~500ms; dirty flag; always show save indicator; never block gameplay.
- Slots: per-slot keys + metadata; never localStorage.clear(). Jam scope: "A reliable autosave with one recoverable slot beats an elaborate multi-slot interface on unsafe writes" (Kozak).
- Export/import: Base64/text strings = standard escape hatch (Cookie Clicker model).
- Cloud-save-lite: lz-string compressToEncodedURIComponent for ?save= share codes (~2KB URL ceiling); export-as-file the robust sibling.
- Version mismatch: deliberate product decision with clear communication; never block game start on load error (Playgama).

## D. What to avoid
- Writing every frame (quota churn + main-thread jank; localStorage is sync).
- JSON.parse without try/catch on stored data; validate types/ranges (negative currency is valid JSON, unusable state).
- Trusting localStorage in private mode (Safari throws / Firefox silently discards).
- "Worked in dev, wiped on player": itch.io migration, MDN eviction (LRU pressure, Safari 7-day), users clearing data. **Browser storage is best-effort; Export is the only durable guarantee.**
- Oversized saves: save durable player intent + stable IDs, not runtime snapshots.
- Checksum as anti-cheat: client-side checksums never provide security.

## E. Shipped
- Cookie Clicker (Orteil): Base64 "!END!" in localStorage; 60s autosave + Ctrl+S; Export/Import/Save-to-file/Load-from-file/Wipe×2; version-led format, packed bitfields, reserved section.
- A Dark Room: single-slot localStorage autosave — Kozak's reliable-slot in the wild.
- Universal Paperclips: small/frequent/version-tolerant; community raw-storage copy/paste as backup.
- Sean Walsh "Longshot": "localStorage for v1 with JSON export/import for backup. No backend needed." = industry-blessed version of our architecture.

## Implemented this round
- **SaveStore.selfTest()** — built-in backup-chain verification on scratch keys (Kozak rec #2): write→verify→promote; rotate old live to .bak; corrupt LIVE (truncated JSON) → BAK restores playable; wrong checksum → rejected; total loss → defaults, never throws. Restores live keys, cleans scratch, logs Telemetry. **All 5 checks pass headless (node), 0 scratch keys left, 0 live keys touched.**
- +39 → **4,353 lines** (+39). All node --check clean.

## F. Sources
kozak · mdn · abratabia · playgama · bugnet · leafo · walsh
