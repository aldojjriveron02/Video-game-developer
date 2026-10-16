
## Round 163: Jam save + validation spec (slice)
**JAM SAVE DECISION: change nothing structural.**
- Versioned schema + atomic tmp→verify→bak→live + checksums + export/import already
  exceed jam needs. Rotating backup (BAK slot, live→bak fallback) already live.

**WIPE NUDGE (IMPLEMENTED in tutorial.js + i18n.js):**
- Welcome screen now carries a 7-day iOS Safari wipe warning + one-tap Export button.
- Export/import front and center (not buried in Help) — the jam save safety net.
- Telemetry: export:welcome event.

**VALIDATION (pre-jam battery):**
- Golden saves per schema version; mutation tests (truncate, bit-flip, checksum-corrupt);
- kill-mid-save; quota-full; multi-tab overwrite. Loader NEVER silently loads garbage.
- Synchronous localStorage close-time save on pagehide (IndexedDB loses the unload race).
- Safari private mode: try/catch (SecurityError). ~5MB quota respected.

**TRAPS:** 7-day ITP wipe (export-to-file = only durable path); unversioned saves;
async close-time writes; silent corruption; saving mid-animation (safety predicate).

## Round 173: Jam save + validation spec (slice)
**JAM SAVE DECISION: nothing structural changes.**
- Audit confirmed the save system already implements every research recommendation:
  dual-slot write (TMP → verify → BAK → LIVE), fnv1a checksum, LIVE→BAK→defaults
  fallback, migration chain, sync autosave on visibilitychange+pagehide,
  7-day iOS wipe nudge (tutorial.js), Export button, stable key prefix.

**VALIDATION (pre-jam corruption battery):**
- Truncate JSON, delete keys, 0-byte save, force QuotaExceededError.
- Every case must boot to playable defaults, never a black screen.
- Simulate itch.io update (two builds) — same key prefix loads across both.
- Safari: confirm 7-day-nudge path boots fresh.

**POST-JAM:** IndexedDB/cloud builds on the same versioned-save core (strict subset, not a fork).
**TRAPS:** in-place overwrite; no checksum; uncaught quota; beforeunload-only;
sessionStorage for progress; assuming itch storage survives updates.

## Round 182: Jam save decision (slice)
**JAM SAVE DECISION: localStorage = best-effort on the jam page; Export = primary
continuity.** Safari iOS silently discards iframe writes; Chrome 3P-blocking denies
outright; IndexedDB shares the iframe fate. NOT a jam fix.

**IMPLEMENTED — persistence probe (save.js + game.js + i18n.js):**
- `SaveStore.probeStorage()`: write marker → read back → sets `storageOK`.
  try/catch CANNOT detect Safari's silent discard; the probe can.
- Wired at boot (before `SaveStore.read()`).
- Briefing screen shows persistent warning banner when `!storageOK`:
  "Saves may not persist in this browser — Export your progress regularly."
  (EN + JA).

**JAM SAVE HARDENING (pre-jam):**
- Export button on post-mission/game-over screen (not just settings).
- "Saved ✓" toast on autosave; distinct warning when probe fails.
- Jam page copy: iOS workaround (open in new tab / allow cross-site).

**TRAPS:** quota (5MB; Safari iframe 1/10); whole-origin eviction; 7-day ITP cap
(reword nudge around it); private mode; silent-failure (probe, don't trust);
schema drift; IndexedDB ≠ jam fix.

## Round 191: Final save decision (slice)
**FINAL SAVE DECISION: PERSISTENCE-READY (conditional).** Jam bar met. Full
readiness after validation matrix passes.

**SAVE LADDER (locked):** localStorage = best-effort cache → Export file =
primary portable → clipboard copy = sandbox fallback. Never treat localStorage
as truth (LD blocks it; itch.io builds move it; Brave discards it).

**AUDIT (verified compliant — spec only, +0 lines):**
- FNV-1a checksum + version stamp on every payload; verify-on-load.
- Dual-slot rotation (atomic two-key); LD-safe fallback (try/catch + probe).
- Export-primary design; banner on !storageOK.

**PRE-JAM VALIDATION (must-dos before Friday 6PM):**
- DevTools quota simulation (storage-full banner path).
- Corrupt-save injection (truncate JSON, flip bytes via Application panel).
- Migration fixture per schema version.
- Kill-during-autosave rollback test.
- Browser matrix: Brave + private + Safari iOS.
- Telemetry: save_write_failure / save_version_mismatch tags.
- Export: verify Blob download on LD embed + itch.io; ship clipboard regardless.

**POST-JAM:** navigator.storage.persist(); re-test saves after every build upload.

## Round 200: Final save sign-off (slice)
**FINAL SAVE DECISION: PERSISTENCE-READY — CONDITIONAL (not signed off).**
Export-primary architecture validated. Gate to GO:
(a) probe tested in itch embed on iPhone Safari (not localhost);
(b) export/import round-trip validated;
(c) corruption matrix (kill mid-write, invalid JSON, downgrade, quota, denied);
(d) publish/submit dry-run before jam.

**IMPLEMENTED — persist() (MDN one-liner):**
- requestPersist() at boot; telemetry logs grant/deny.
- May reduce eviction; honoring is browser's discretion.

**AUDIT (verified compliant):**
- Probe: write→read→verify→delete (robust vs Safari partial-fail).
- Export + ImportJson (base64 round-trip with validation).
- Dual-slot atomic rotation. validate-before-write.
- Save triggers: visibilitychange + bfcache + pauses (never mid-combat).
- 4,176 lines (+12).

## Round 209: Final save confirmation (slice)
**FINAL SAVE DECISION: PERSISTENCE-READY — CONDITIONAL-PROBE (do NOT confirm unconditionally).**
Flips to CONFIRMED when itch-deployed build passes round-trip probe on iPhone 17 Safari + desktop Chrome.

**IMPLEMENTED — storage health indicator (Round 209):**
- Embed detection (Toddpocalypse): 'top' | 'itch' | 'ld' | 'frame' | 'unknown'.
- Cross-session canary: LIVE save exists but canary gone → unreliable.
- LD embed → storageOK=false (definitionally no storage).
- Telemetry: save:probe:<ctx>:<ok|fail>.
- UI warning already shows when !storageOK (Export banner).
- 4,218 lines (+25).

**LD STRATEGY:** LD page = export/import-only OR link to itch.io build.
Test butler zip end-to-end before Submission Hour.

## Round 217: itch round-trip validation (slice)
**FINAL SAVE DECISION: PERSISTENCE-READY — CONDITIONAL-PROBE (do NOT confirm).**
Sign-off blocker is EXECUTION, not design. Confirm when on-itch iPhone round-trip passes.

**ARCHITECTURE VERIFIED (matches all shipped examples):**
- Version field from day one (SCHEMA: 1) ✓
- Migration chain (migrate + migrateLegacy) ✓
- Probe order: embed → cross-session canary → live probe ✓
- Export-primary when storageOK=false ✓
- LD embed forces Export-primary ✓

**ROUND-TRIP PROBE (pending, on real iPhone):**
1. New → progress → reload → continue (same session)
2. Quit Safari → relaunch → verify save persists
3. Corrupt save → clean failure (not silent)
4. Storage blocked → warning + Export UX
5. Export → import → checksum match

**SUBMISSION HOUR = save-validation window:**
- Run full checklist on deployed itch build, then submit.
- Freeze schema at v1 before hour. Bugfix = v2; migrate or fail cleanly.

## Round 226: Pre-jam freeze (slice)
**SAVE FREEZE: SCHEMA v1 locked before Fri Oct 16 6PM.**
Post-freeze: tested one-step migration only, or cut.

**VERIFIED (code, research-validated):**
- FNV-1a checksum on every save.
- TMP → verify → LIVE (write-then-verify; never direct overwrite).
- .bak rotation (previous known-good preserved).
- Boot-time probe + cross-session canary (iOS silent non-persistence).
- storageOK flag → Export banner when unreliable.
- Export-primary (user-held JSON). localStorage = cache, not truth.

**SAVE LOCK CHECKLIST (itch iframe, iPhone 17):**
a. Round-trip export→import across two browsers
b. Corrupted-import rejection (clean error, current save kept)
c. Quota-full behavior (graceful + message)
d. Private-mode session (in-memory fallback + notice)
e. Tab-close-mid-autosave integrity (previous save intact)

**TIMELINE:**
- Now→Thu: schema frozen, checklist (a)-(e) passing.
- Fri 6PM→halfway: feature freeze on ALL save code.
- Final 8h: publish & submit only. Save bug → cut feature, keep frozen path.

## BACKUP-CHAIN SELF-TEST (Round 232 — Wed 2026-10-14 ~22:42 EDT)
- SaveStore.selfTest() — exercises the real write/read/rotate path on scratch keys: write→verify→promote; rotation to .bak; truncated-LIVE → BAK restores playable; bad checksum → rejected; total loss → defaults (never throws, never blocks boot). Restores live keys, cleans scratch. All 5 checks pass headless.
- Run from console on any machine: `SaveStore.selfTest()`.
- Jam-day drill (Kozak failure matrix): truncated payload, flipped bytes, empty string, wrong checksum, schema v999, kill-tab mid-TMP-write, quota-exceeded — each must boot, restore from .bak, and report correct canary/storageOK state.

## GOLDEN FIXTURES (Round 241 — Wed 2026-10-14 ~23:32 EDT)
test/fixtures/ — generated through the REAL write path; test/save-fixtures-test.js (8 assertions, 8/8 pass):
- save-v1-good.json (517 bytes): loads clean, markers intact, checksum valid, <50KB budget.
- save-v1-truncated.json: rejected → defaults, never half-applied.
- save-v1-badchecksum.json: rejected → .bak restores playable.
- future-schema (synthetic v999): rejected → defaults (Round 241 BUG FIX: migrate() returned null → read() returned null to the game. Now falls through to backup → defaults. Never hands the game a null save.)
Rule: every schema change adds a fixture + re-runs the test. Golden fixtures are the operational form of "verify recovery FROM the backup."

## FINAL-FREEZE RULES (Round 250 — Wed 2026-10-15 ~00:22 EDT)
- SCHEMA v1 LOCKED. Any post-freeze change = version bump + new migration fixture + re-run. No silent edits (grimoria: migration path is where live games break).
- Fixtures IMMUTABLE: test/fixtures/ — add per schema bump, never edit an existing one (Clews/salivity golden-master rule).
- Seven-case drill on the SHIPPED build, per embed target (direct, itch iframe, file://): induced faults → clean boot + correct player state each. Includes boot-from-.bak (hand-corrupt LIVE, confirm boots from .bak, canary storageOK).
- Interrupted-write drill: kill page mid-save → LIVE and .bak never simultaneously corrupt (No Man's Sky failure = the thing this proves against). Rotation code untouched in final 48h.
- Budget ASSERTED: selfTest() check 6 — worst-case payload through real serialization <50KB (6/6 pass; current worst-case 1,222 bytes). Skyrim lesson: budgets asserted, not assumed.
- Export-first comms: storageOK=false → boot screen's primary action = Export. Jam-page one-liner: "If the game says storage is unavailable, use Export now — your progress is safe in the exported file."
- Silent resets FORBIDDEN (Bugnet: "losing player progress is the most unforgivable failure"). Recovery always visible or Export/Import offered.

## FINAL FREEZE (Round 259 — Wed 2026-10-15 ~01:18 EDT)
- Hard budget guard (Cyberpunk 8MB lesson): write() REFUSES payloads >50KB before touching storage — old LIVE stays intact, corrupt path never entered. Overflow = handled case, not silent corruption. Budget asserted in selfTest (1,222 bytes worst-case) AND enforced at runtime.
- Full drill on the PUBLISHED build, not dev: 7-case drill + interrupted-write drill (kill tab mid-save) in itch.io page, fullscreen, and one mobile browser. Record selfTest 6/6 per target.
- Fixtures IMMUTABLE from here; any change invalidates the drill. After EACH itch.io publish: Humane Tiger's update drill (save → publish → reload → verify persistence) — the platform can invalidate storage context.
- Export-first: manual export/import stays visible in the shipped build. Every failed-validation path surfaces a message + export option; silent resets forbidden ("A player will forgive a crash. They will never forgive losing their save." — Bugnet).
- Schema v1 LOCKED. No post-freeze edits; future-schema payloads route migrate→backup→defaults with explicit notice.

## FINAL FREEZE (Round 268 — Wed 2026-10-15 ~02:27 EDT)
- Budget-guard byte-safety (verified): oversize write refused; LIVE + BAK byte-identical after refusal. The guard touches nothing. (Skyrim precedent: unbounded growth = shipping defect.)
- Silent-reset audit (verified): every removeItem in save.js = selfTest cleanup. The load path never deletes — LIVE → BAK → defaults only. No silent resets anywhere. (r/gamedev: silent resets = #1 trust-destroyer.)
- Published-build drill (this week): full drill (interrupted write, corrupt bytes, oversize) against the jam build artifact — the exact files judges run. Confirm .bak restores, boots without silent reset.
- Live kill test per embed target: terminate the tab mid-save on itch.io iframe, direct browser, 2 browsers. tmp→verify→bak→live leaves loadable state every time.
- Fixtures immutable; update drill = pass/fail gate. Post-freeze schema change fails the gate by design.
- Fez lesson: drill before the jam, when fixes are still free.

## VERIFICATION ROUND 2 (Round 277 — Wed 2026-10-15 ~03:34 EDT)
- Save-in-progress flag (js/save.js, M86Berg): `mecha-protocol-save-dirty` set after the budget guard, cleared only after LIVE commits. Boot with flag set → `_recoveredMidWrite = true` → user-visible notice (never silent reset). Closes the death-between-commit-steps window.
- Published-build drill (this week): the exact shipped bundle in its real hosting context (https, itch.io iframe). Kill the tab mid-save; confirm LIVE+BAK recovery identical to dev. (Blow; Fez.)
- Update drill: old save + new build, new save + old build. Schema v1 locked; v2 = explicit migration or clean refusal (never silent).
- QuotaExceededError: every write path catches → refuses → LIVE+BAK byte-identical. Boot-time assertion: stored payload under budget; log headroom.
- Corrupt-path battery (Playgama): truncated JSON, deleted keys, bad checksum, wrong version, oversize — each asserts boot + notice + BAK restore. Frozen as the permanent regression set.

## VERIFICATION ROUND 3 (Round 286 — Wed 2026-10-15 ~04:46 EDT)
- REAL GAP FOUND + FIXED: `_recoveredMidWrite` was set but never displayed — the M86Berg pattern was half-implemented. Now: boot shows the banner (4s amber) + Telemetry when the flag is set. (Flukz: a notice that says only "save recovered" is a near-miss of silent-reset.)
- Notice copy (Flukz's three requirements): "Save was interrupted — restored your backup. At most one session was lost." Detected ✓, done ✓, lost ✓.
- Corrupt-path battery: scripted, repeatable — truncate LIVE at 0%/50%/99%; invalid JSON; wrong schema; missing keys; unknown versions; dirty flag set with LIVE intact. Each maps to the spec'd path. Battery inputs become immutable fixtures (QASkills).
- Itch round-trip probe: on the REAL uploaded build, before jam — save → reload → byte-identical LIVE+BAK in the itch iframe; private window; Safari. Pass = identical to localhost.
- QuotaExceededError: pad to near-quota, save, confirm (a) no exception escapes, (b) LIVE+BAK byte-identical to pre-attempt, (c) user sees the quota notice. (MDN throw semantics.)
- Freeze discipline: after freeze, no new migrations. A post-freeze migration = freeze exception + full selfTest 6/6 + 8 fixtures + update drill on real v0 saves. Document the exception or it didn't happen. (Bugnet.)

## VERIFICATION ROUND 4 (Round 295 — Wed 2026-10-15 ~05:22 EDT)
- Timestamp in the notice (js/game.js, Meta): the recovery notice now shows WHEN the backup was saved — "(Backup: <locale date/time>)". All three Meta elements: (a) what happened, (b) fallback exists, (c) timestamps. Banner 4s → 6s for the longer text.
- S1 ship-blocker (Ocean View Games): any save failure mode that can lose player progress blocks the jam submission. No "known issues" for data loss.
- Battery against frozen fixtures: truncated payload, valid-JSON/bad-checksum, garbage bytes, version-mismatch, quota-full refusal, interrupted-write (flag left set). Each ends in exactly two states: clean load, or BAK fallback + the user-visible notice with timestamps. Anything else fails. (Meta: don't rely on parse failure alone — use the checksum.)
- Quota proof: measure real serialized size; enforce budget with margin under 5 MiB (dual-slot doubles resident bytes + key overhead); fill quota in test; verify the write refuses, the good slot survives, the notice appears. (Cyberpunk's 8 MB incident = why this test exists.)
- Itch probe (hostile browsers): real itch.io page in Chrome, Firefox, Safari, Brave (ephemeral storage), + one private window. Saves persist across sessions + across a game update (pinned storage key, never derived from build metadata — Codedragons' GUID lesson). Export/import round-trips as the escape hatch.
- Freeze: schema v1 stays v1 through the jam. No structural changes without a migration routine. Unavoidable change = chained migration + frozen-fixture test + pre-migration backup + user warning. Otherwise it waits. (SE.SE: "resist the urge to keep changing the file format.")

## VERIFICATION ROUND 5 (Round 304 — Wed 2026-10-15 ~06:00 EDT)
- Five risk states (js/save.js + js/game.js, console cert): two silent gaps fixed. Corrupt LIVE → BAK now shows "Main save was damaged — loaded your backup instead. (Backup: <timestamp>)" (amber, 6s). Oversize/quota refusal now shows "Could not save — storage is full or the save is too large. Export your save as a backup." (red, 6s). All five states player-visible. "Failure must be loud, dated, and actionable — never silent."
- Schema v1 frozen (Stardew rule): every save carries schema version; loader accepts v1, explicitly rejects newer/unknown with a dated notice. Ship-blocker: any post-freeze schema change without a tested migration.
- Hostile-write proof: interrupted write (kill between LIVE start and flag clear) → timestamped notice + BAK loads. Quota-exceeded → budget guard fires with clean prompt. "A quota guard never exercised against a genuinely full store is an untested claim." (Factorio lesson.)
- Update drill + export round-trip: export v1 → re-import on fresh profile → byte-identical state. "New build, old save" must migrate/load cleanly; "old build, new save" must refuse loudly; neither silently drops fields.

## VERIFICATION ROUND 6 (Round 313 — Wed 2026-10-15 ~06:35 EDT)
- Verified (code read): Horneman's save-before-load assertion. Synchronous localStorage — read() completes at boot before any export() can trigger. The wipe scenario is structurally impossible. (Atomic writes + DIRTY flag + budget guard + quota handling already in place.)
- Fixture gate (ship-blocker): schema v1 locked. save-fixtures-test requires at least one fixture as a real save string from the frozen build, run through load() every run. Any schema-key or fixture-count change fails the build until freeze is re-cut.
- Corruption drill (ship-blocker): Bugnet's interrupted-write drill (truncated JSON, garbage, missing keys). Verify: corrupted-save banner with correct i18n key; prior valid payload untouched; Telemetry fires (save_load_failure/save_write_failure/save_version_mismatch). Banner without telemetry = fail.
- Refused-save as playable state (ship-blocker): simulate QuotaExceededError/blocked storage. Verify: refused-save banner (distinct i18n key); in-memory session preserved; game stays playable; autosaves throttled/stopped. "Storage full," "corrupted," "newer version" = three distinguishable messages, no shared fallback.
- Backup-before-overwrite: extend SaveStore.selfTest with "recover preserves the original." No path (autosave, manual, migration, recovery) may delete/overwrite before replacement is validated and backed up.
- i18n audit + banner budget (final): all 5 states resolve through i18n keys in every locale, no missing-key fallbacks in banner path. Stress-test: force simultaneous corrupted + refused + newer-version → one prioritized banner, never a stack. Then verification 5 (freeze) signs off.

## VERIFICATION ROUND 7 (Round 322 — Wed 2026-10-15 ~07:05 EDT)
- Verified (code read): portability story complete. Export = real JSON download (save.js:147). Import = validate-then-promote, fail-closed (save.js:163-167). persist() requests navigator.storage.persist(). probeStorage() detects silent iframe discard (Round 182).
- BAK player-recoverable (ship-blocker): corruption drill end-to-end. Corrupt LIVE → game detects, restores BAK automatically or one-click restore, player never sees crash/blank. Stardew/Minecraft bar. Freeze TMP→verify→BAK→LIVE order — no reordering after this point.
- Portability gap closed (ship-blocker): export (versioned JSON, schema v1 stamped) + validated import (scratch → full validation → promote, fail closed). Audit: export → wipe localStorage → import → full state equality.
- Freeze discipline: lock schema v1 + 51.2KB budget guard as final. Any new saved field = schema version bump + migration test. CI/fixture assertion: serialized fixture size stays under budget — enforced by test, not convention.
- Hostile audits (ship-blockers): (a) quota-recovery — fill near quota (or stub QuotaExceededError), verify refused-save-playable and LIVE untouched; (b) long-session — play to latest phase, save at every boundary with DIRTY set, reload each, verify no frozen timers or half-resolved state.
- Persistent storage: request navigator.storage.persist() at first save; surface storage risk states honestly. 5/5 visible through jam. Quota/budget warning fires while player can act (export!), not after refusal.

## VERIFICATION ROUND 8 (Round 331 — Wed 2026-10-15 ~07:40 EDT)
- Verified (code read): save integrity. FNV-1a checksum before parse (save.js:38-42). Schema versioned (save.js:18). Atomic two-key rotation A/B (save.js:2). (Horneman, 0xkiire, r/Unity3D.)
- Loader spine (ship-blocker): checksum + schema-version gate before promote. Corruption drill (mutated/truncated/zero-filled saves for both slots) = passing automated gate. Corrupt slot must never poison good one — SHIP-BLOCKER if drill fails.
- Freeze + backup-before-overwrite: no write path destroys last-known-good until new write checksummed and verified. BAK recoverable end-to-end; demo recovery (corrupt A → fall back to B → BAK rescue) as ship-blocker test.
- Quota drill (ship-blocker): fill localStorage to 5 MiB boundary, attempt persist(). Require: caught QuotaExceededError, user-visible message, export-JSON escape hatch. Safari private-browsing in test matrix — unhandled denial = SHIP-BLOCKER.
- Fixture gate: corpus of export-JSON saves at every schema version; automated migration tests load each fixture, assert field-level correctness. Real-playthrough canary save per build (content-driven, not just structure-driven).
- Horneman race: persist() blocked (asserted, not documented) until load fully complete and validated. Import validate-then-promote fuzz pass in final checklist.

## VERIFICATION ROUND 9 (Round 340 — Wed 2026-10-15 ~08:13 EDT)
- Verified (code read): save indicator. flashSaved() non-blocking (game.js:436-437). Only on ok (game.js:425) — honest. (Mockitt; NN/g.)
- Save indicator + toast (ship-blocker): every persist()/export shows brief "Saved HH:MM:SS" chip; every failed write shows error with recovery action. Indicator cosmetic-only — never blocks input or delays write. "Saved" only after bytes durable. Ship-blocker: any silent save failure.
- Slot screen audit (ship-blocker): each slot shows last-saved timestamp, scenario/turn summary, checksum-valid badge, active marker, one-click "Restore backup (BAK)". Ship-blocker: indistinguishable slots, or BAK unreachable from slot screen. (Mawhorter.)
- One-click recovery (ship-blocker): on checksum/validation failure show what happened ("This save looks damaged"), what's safe ("Your backup from HH:MM is intact"), one primary ("Restore backup"), one secondary ("Try anyway / export"). No hex dumps, no dead ends. (NN/g 9; Bugnet.)
- Destructive-action gate: backup-before-overwrite + Horneman save-before-load extended — delete/export-overwrite/import-promote each require (a) automatic backup first, (b) explicit confirm naming slot, (c) undo path (BAK restore). Import keeps validate-then-promote with visible pass/fail. Ship-blocker: overwrite/import destroying only good copy.
- Validation triad (freeze): (i) 5-player usability on save/quit/resume-next-day, slot pick, export/import, corrupt-recovery — record success + time-to-recover; (ii) trust question ("I trusted the game kept my progress," 1–5) + watch for compulsive double-saving; (iii) Bugnet recovery matrix — kill mid-write, quota-full, corrupted bytes, schema versions — one-click recovery every time. Freeze exits only when all green.

## VERIFICATION ROUND 10 (Round 349 — Wed 2026-10-15 ~08:37 EDT)
- Verified (code read): export/import. Export to JSON file (save.js:146-155). Import validates via FNV-1a (fail-closed). Schema v1. Atomic A/B on imports. Salt Keep pattern for itch.io origin lock.
- Export/import path (ship-blocker): portability pillar incomplete without it. Downloadable JSON or copyable text; every import through FNV-1a (fail-closed: reject invalid, never partial). Verify inside itch.io embed, not just standalone. (Playgama; Salt Keep.)
- Freeze discipline: no schema change without tested migration. Keep one real save snapshot per schema version; automated test runs full migration chain (v1→v2→…) against each. Stardew rule: older→newer migrates; newer→older refused with message, never loaded. (Playgama snapshot pattern.)
- Non-destructive import: import validates (schema + FNV-1a) before touching A/B slots. Atomic A/B applies to imports. Failed import leaves existing save untouched; successful import preserves previous as fallback. (Stardew backup model.)
- itch.io embed audit: export in embed → import in different browser/incognito (new origin) → verify checksum passes and state loads. Device-transfer test for browser game; proves embed origin doesn't trap saves.
- Indicator honesty: indicator fires during export/import; integrity verification on every imported read. Extends verified indicator + integrity pillars to portability. Silent import failure or un-indicated write = ship-blocker.

## VERIFICATION ROUND 11 (Round 358 — Wed 2026-10-15 ~07:14 EDT)
- Verified (code read): plain FNV-1a (save.js:29,38). No secret key. Jam threat model (offline single-player, no leaderboards/multiplayer/paid) = cheating harmless. Checksum = corruption detection, not anti-cheat. Keyed MAC = Phase 2 (leaderboards/guilds). Honest scope, not gap. (GameMaker; GuardingPear.)
- Key checksum before freeze (Phase 2 ship-blocker): mix constant secret into digest (FNV-1a over key‖payload) while keeping FNV-1a as corruption check. Document residual risk: browser-embedded key extractable, deters casual tampering. Pair with load-time sanity/range checks (impossible values rejected). Freeze key + algorithm with schema v1 — changing orphans saves. (GameMaker "5 minutes to fool.")
- Verify-before-parse (ship-blocker): recompute keyed checksum before JSON.parse on every load path including import. Mismatch → fail over to other slot automatically (Pokémon pattern); indicator = explicit "save failed verification" — never silently load suspect data, never crash, never wipe good slot. (Bugnet; GuardingPear.)
- Adversarial test matrix (final verification): edited values, flipped bytes, truncated payload, slot A over B, older-schema save, hand-made future-version, killed mid-write, quota-exceeded, export→tamper→import. Assert exact expected outcome per case: which slot loads, indicator state, what logged. (Bugnet; OZero.)
- Migration discipline: keep one golden save per shipped schema version; every migration runs against all in CI. Never hard-fail honest old save — migrate, or quarantine with clear message + backup kept; never delete. Checksum/key/schema change = version bump + migration test. (GuardingPear; Bugnet.)
- itch.io embed hardening (ship-blocker): missing storage = "no valid save" (new-game path, clear messaging), not corruption. Indicator shows "no save found" not error. Export/import files carry keyed checksum; file round-trip verified identically to slot load. Log verification failures (slot, check, version) post-launch to distinguish tamper vs bug.

## VERIFICATION ROUND 12 (Round 367 — Wed 2026-10-15 ~07:42 EDT)
- Verified (code read): save integrity architecture. save.js:2: versioned schema + atomic two-key rotation + FNV-1a; save.js:81: read live → backup → defaults, never throws; save.js:229-230: self-test verifies RECOVERY FROM backup (Kozak). Matches Minecraft/Factorio/Stardew. (Bugnet; Sinfull.)
- Ship-blocker: kill-during-save drill. Terminate browser mid-quicksave, mid-autosave, mid-export, for every slot; assert journal always recovers to previous valid generation and CRC rejects torn write. "Interrupted-save testing is non-negotiable." (Bugnet.)
- Ship-blocker: localStorage quota/full-disk test. Fill quota (QuotaExceededError) during save; verify (a) no partial slot commits, (b) failure message surfaces to player, (c) in-memory game state untouched. localStorage gives no atomicity beyond journal.
- Freeze: lock save schema now. Bump saveVersion with written migration function per step even for "trivial" changes (Sinfull: same commit, no exceptions); add migration matrix test to SaveStore.selfTest() — keep one fixture per historical schema version, assert all load with invariants intact. Extends 6/6 to 7+.
- Ship-blocker: quicksave+autosave overlap drill. Force both to fire on same tick repeatedly; assert payloads never interleaved/torn and loads always see exactly one committed generation. Verify load never reads slot mid-write — reads go through journal commit point. (Concurrency audit.)
- Freeze: export/import round-trip with integrity. Export → corrupt one byte → import must fail closed (FNV-1a) with clear message, never partial-load; export → import into fresh profile must reproduce exact game state. Add clamp-on-load for all numeric fields post-migration/import so hand-edited JSON cannot inject NaN/Infinity. (Bugnet; UhiyamaLab.)

## VERIFICATION ROUND 13 (Round 376 — Wed 2026-10-15 ~08:13 EDT)
- Verified (code read): launch-save readiness. save.js:3: "version field from day one"; atomic two-key rotation (alternating files); FNV-1a integrity (verify on load, fail-closed); read live→backup→defaults; JSON export (cloud backup tier). Matches Meta's five checks + Stardew/Terraria/Minecraft. (Meta; Stardew; Minecraft.)
- Freeze schema now (ship-blocker): lock save schema version at end of round 13; any post-freeze change bumps version and must ship with documented migration path plus fixture save from each prior verification round (Minecraft DataVersion/version_history pattern). No unverified schema change enters launch build.
- Fault-injection launch gate (ship-blocker): before launch, run kill/chaos suite — terminate tab mid-write, force localStorage quota exhaustion, feed CRC-invalid and FNV-1a-mutated payloads, confirm every case fails closed into verified recovery messaging (never silent load, never wiped slot). Untested-failure = launch blocker. (Bugnet.)
- Mandatory restore drill (ship-blocker): treat JSON export like Steam treats cloud sync — on fresh browser profile, download export, wipe localStorage, import, play-verify. Also verify tampered export rejected by FNV-1a. Log drill result as launch artifact — untested restore is not backup. (Steamworks.)
- Export portability matrix: verify JSON export imports on different machine/browser than creator (Steam cross-platform rule); audit export for environment-specific fields that would break on another machine. One cross-device success per supported browser family before launch.
- Slot hygiene + self-test as launch gate: confirm 4 journaled slots behave like Meta's alternating-file rule (no in-place overwrite of live journal entry; corrupt active entry falls back to older journaled entry, not empty state). Keep SaveStore.selfTest() 6/6 and wire as launch gate running on every boot — not just dev — so regression = blocked launch, not discovered bug.

## VERIFICATION ROUND 13 (Round 385 — Wed 2026-10-15 ~08:42 EDT)
- Verified (spec read): save freeze defined. :161: "Fri 6PM→halfway: feature freeze on ALL save code"; :214: "Freeze discipline: after freeze, no new migrations. Post-freeze migration = freeze exception + full selfTest 6/6 + 8 fixtures"; :232: "Fixture gate (ship-blocker): schema v1 locked." Matches Momentic/PressKit.gg (freeze and build gate) and Sinfull (schema + migration in same commit). (Momentic; Sinfull.)
- Declare save freeze now (ship-blocker rule): schema version, migration table, FNV-1a algorithm, and live→backup→defaults read chain are locked. Any post-freeze save change requires written exception and re-runs full fault-injection + restore-drill suite. (Momentic/PressKit.gg; Testriq: last-minute changes = top regression vector.)
- Version-compatibility regression (final audit): saves written by earlier builds (at least oldest supported schema version) must load and migrate correctly in launch build, verified in automated pass — Sinfull CI rule. Ship-blocker: any failed migration.
- Launch-day fault matrix (final run on release build): kill/partial-write during save (both live-key and mid-rotation writes), corrupt live key, corrupt both keys, quota-exceeded write, private-mode/no-localStorage fallback — confirming live→backup→defaults fallback each time with no crash or soft-lock. (Bugnet.io; Ocean View Games: "must not corrupt save data if power is lost".)
- Explicit sign-off checklist (not generic pass): save, load, autosave cadence, backup rotation integrity, JSON export round-trip, quota handling, cross-browser portability, boot self-test result — each individually signed off. Ship-blocker: no launch without all boxes checked. (PressKit.gg/Momentic/QATestLab.)
- Cap save size (Cyberpunk 8MB lesson): add launch-build test asserting save payload stays well under localStorage quota limits (with quota-handling path exercised, not just coded), since tactics-game state (grids, unit lists, logs) can grow unbounded across long campaign.

## VERIFICATION ROUND 14 (Round 394 — Wed 2026-10-15 ~09:15 EDT)
- Verified (code read): self-test covers invariants. save.js:234: selfTest() runs 6 checks: (1) write-tmp-verify-promote (atomic write); (2) rotate-old-live-to-bak (two-key rotation); (3) corrupt-live-falls-back-to-bak (corruption resilience). Matches gamineai invariants (1) round-trip, (4) atomic write, (5) corruption resilience. Runs on boot. (gamineai.)
- Freeze discipline (ship-blocker): pin SAVE_SCHEMA_VERSION constant and gate it — any schema change must bump version in same PR and ship with incremental migration routine; add checklist item that version bump exists before any RC. (Meta: version must increment when anything in structure changes.)
- Six-invariant sign-off on real browsers (ship-blocker): round-trip, monotonic version, schema-evolution with frozen old-schema fixtures, atomic two-key rotation under injected write aborts and QuotaExceededError, single-byte/char corruption of stored JSON, size-bounds/quota rejection. Treat any invariant failure as release blocker; log failures with build + storage state so post-launch failures reproducible. (gamineai.)
- Validate live→backup→defaults chain by fault injection (ship-blocker): corrupt live key and confirm backup restores; corrupt both and confirm clean defaults with no crash; confirm FNV-1a mismatch fails closed (loud error + fallback, never silent zero-fill). Keep keyed MAC documented as Phase 2 — plain FNV-1a is corruption detection only. (Meta; HelpMeTest.)
- Boot hygiene: keep on-boot self-test, and mirror Meta's deferred-load principle — show game shell/UI first, then process saves, so malformed data can never hard-block launch; keep JSON export as player's escape hatch and document restore path.
- Recurring audit cadence: re-run full verification suite (invariants + fault injection + portability matrix + restore drill) every release, not just at round 14 — integrity drifts between releases, and audit only works if honest, data-driven, and leads to ranked fix list. (Bugnet.)

## VERIFICATION ROUND 15 (Round 403 — Wed 2026-10-15 ~09:52 EDT)
- Verified (spec read): ongoing save defined. R394: "Recurring audit cadence: re-run full verification suite every release"; "Freeze discipline (ship-blocker): pin SAVE_SCHEMA_VERSION constant and gate it"; "Six-invariant sign-off on real browsers (ship-blocker)." Matches Microsoft (monitor and resolve live-site issues) and Factorio (translator chain). (Microsoft; Factorio.)
- Freeze discipline + version-bump ship-blocker. Keep SAVE-SPEC.md frozen: every future feature must route through frozen save writer with zero silent format changes. Ship-blocker: any change to save keys/structure without schema version bump AND translator entry fails review. (Meta: "bump schema version whenever save data structure changes"; Factorio's translator chain.)
- Integrity-regression suite as permanent gate. Keep golden fixtures of every schema version's saves plus corrupted fixtures (bit-flip, truncation, quota-exceeded simulation); every build must boot-load, self-test, migrate, and recover across full fixture set. (r/gamedev: "unit tests on loading code with old-version copies".)
- Post-launch save telemetry. Instrument save pipeline now: count/log integrity-check failures, migration failures, backup-rotation events, and QuotaExceededError occurrences, and route them to analytics/crash reporting the game ships with, with alert thresholds. Ship-blocker: save-path failures that are invisible post-launch. (Microsoft GDK: "monitor and resolve live-site issues".)
- Audit cadence. Schedule recurring save-monitoring audit (each milestone): re-run fault-injection suite, verify two-key rotation intact, check localStorage quota headroom (5MB limit — bound save size and test full path), and review schema drift. Keep six-invariant checks running in production builds, not just dev.
- Player-facing recovery story. Two-key rotation already mirrors Meta/Minecraft/Terraria pattern; add Stardew layer: document recovery path (export/import as user-visible escape hatch) in short troubleshooting note shipped with game, so worst-case corruption event is known procedure, not support crisis.

## VERIFICATION ROUND 16 (Round 412 — Thu 2026-10-15 ~12:32 EDT)
- New this round (spec only): format-evolution plan. Spec has no format-evolution/golden-corpus plan — this round adds it. Matches Minecraft (DataFixerUpper), Factorio (per-version migrations), Stardew (version-tagged one-way upgrades). (Minecraft; Factorio; Stardew.)
- FREEZE DISCIPLINE — make the schema version the ship-blocker: Adopt Meta's rule as policy: any change to a serialized field (add/remove/rename/retype) REQUIRES a schema version bump + a named migration op (add-with-default, rename) before merge. Keep SAVE-SPEC.md's version-bump blocker as the enforcement mechanism: the bump is the lock, not just a number.
- GOLDEN-SAVE CORPUS — capture one reference localStorage save per shipped schema version and run the full load→migrate→integrity-verify→boot cycle against every build. This is Bugnet.io's "collection of save files from every released version" applied to localStorage: export the corpus via the existing export/import path, store as fixtures, and fail the build on any migration error or boot-self-test failure. This single suite covers both evolution testing and migration-drift validation (drift = a corpus failure with no matching migration).
- MIGRATION-DRIFT LOCK — automate the check Bugnet.io describes: on every build, serialize the current schema's key set and diff it against the registered migration chain. Any field added/removed/renamed/retyped without a registered migration step for the new version fails the build. Drift can never reach the player.
- POST-LAUNCH SAVE TELEMETRY — extend the existing corruption-recovery pillar with per-version counters: integrity-check failures, migration executions per version-step, corruption-recovery invocations, and export/import fallbacks. The ship metric is save-load failure rate per schema version; a spike after a release means the migration path has a bug (Bugnet.io). Stage any save-affecting release and watch the metric before full rollout.
- BREAKING-CHANGE POLICY — never silently break old saves. If a future schema change cannot be migrated, follow the Minecraft/Terraria pattern: prompt the player to back up (export) before upgrading, convert on a copy, and keep the pre-upgrade save restorable via the existing two-key rotation + corruption-recovery path. Document the policy in SAVE-SPEC.md as the version-bump blocker companion.

## VERIFICATION ROUND 17 (Round 421 — Thu 2026-10-15 ~13:27 EDT)
- Verified (spec read): corruption discipline defined. :296: "Declare save freeze now (ship-blocker rule): schema version, migration table, FNV-1a algorithm, and live→backup→defaults read chain are locked. Any post-freeze save change requires written exception and re-runs full fault-injection + restore-drill suite."; :306: "Validate live→backup→defaults chain by fault injection (ship-blocker): corrupt live key and confirm backup restores; corrupt both and confirm clean defaults with no crash; confirm FNV-1a mismatch fails closed (loud error + fallback, never silent zero-fill)."; :308: "Recurring audit cadence: re-run full verification suite (invariants + fault injection + portability matrix + restore drill) every release." Matches SQLite (crash tests) and Stardew (two generations). (SQLite; Stardew.)
- Freeze discipline: lock the save envelope now — schema version, FNV-1a placement, two-key rotation order, and the export format are frozen; any change requires a version bump plus a migration test against the golden corpus. Ship-blocker: no save-format change lands without bumping schema version and re-running the integrity-regression suite.
- Add the "verify before publish" gate to the write path: write inactive key → read back → verify FNV-1a + trial parse → only then flip the active pointer. A write that fails verification must leave the previous generation untouched. Ship-blocker: fault-injection test proving a crash/kill at each write step still boots to the previous good save. (0xkiire.)
- Add a trailer sentinel to the payload (Stardew's </SaveGame> lesson): a fixed end-marker inside the integrity envelope distinguishes truncation (browser tab killed mid-setItem, quota hit) from logical corruption, giving recovery code and players a diagnosable signal instead of a generic "corrupt" dead end.
- Post-launch telemetry + player-facing recovery copy: log checksum failures, backup-fallback events, quota-denied writes, and migration failures per build; ship an in-game recovery screen that names the backup generation being restored ("Restored autosave from [date] — your last manual save could not be verified") instead of a bare error. Ship-blocker: recovery path tested end-to-end from a corrupted primary, not just from clean state.
- Treat export as the durability tier: per web.dev, localStorage is best-effort and evictable — request persistent storage where available, catch quota errors on every write, and keep the manual export/import path (already in the pillar) as the documented durable backup, surfaced to the player before storage pressure becomes data loss.

## VERIFICATION ROUND 18 (Round 430 — Thu 2026-10-15 ~14:14 EDT)
- New this round (spec only): persistence plan. Spec has save discipline but no persistence plan — this round adds it. Matches Horneman (three-layer architecture), Bugnet (fault-injection), DataFixerUpper (migration lock). (Horneman; Bugnet; Minecraft.)
- Save-freeze discipline (ship-blocker): No format change merges without a saveVersion bump, a chained migration transform, and a golden-corpus test migrating saves from every prior version. Adopt Horneman's rule: decide per-system "minimum supported version" before 1.0, and record the freeze decision explicitly in SAVE-SPEC.md.
- Make the write path crash-consistent (ship-blocker): staging-key write → FNV-1a checksum verify → promote to live slot, under Web Locks serialization; never write the live slot in place. Boot guard: saving is impossible until load completes (the "never save before load" rule, verified by test).
- Keep the three-step load net as a verified invariant: primary slot → backup slot → fresh state, with clamp/validate on every loaded field. A boot that throws is a ship-blocker — verify-before-publish must include corrupt-primary and corrupt-primary+backup fault-injection runs.
- Autosave at turn/mission boundaries with a visible "saving" indicator (prevents quit-during-write), and keep autosave throttling so storage is never hammered every frame.
- Recurring post-launch audit cadence: treat every "recovered from backup" and every migration-failure event as counted telemetry incidents; add one audit line to the publish checklist — migrate the golden corpus, inject the standard fault set, confirm checksums — before every publish. Continue the save-freeze and verify-before-publish gates already recorded in SAVE-SPEC.md.

## VERIFICATION ROUND 19 (Round 439 — Thu 2026-10-15 ~15:00 EDT)
- New this round (spec only): save plan. Spec has a persistence plan (round 430) but no save plan — this round adds it (determinism oracle, quota/eviction guard, async batched writes). Matches Factorio (determinism as test), Mimimi (save-everything friction-free), Pingle (async batched writes). (Factorio; Mimimi; Pingle.)
- Freeze discipline + golden corpus as the ship-blocker: Freeze the save schema before the jam; keep a golden corpus of versioned saves; every build runs save→load→compare (Factorio-style determinism check) plus FNV-1a checksum validation. Ship-blocker: any round-trip mismatch or checksum failure blocks release.
- Determinism as the test oracle: adopt the Factorio property — "running game -> save -> exit -> load -> running game" must produce exactly identical state. Any serialization mistake shows up as a round-trip diff; the automated check runs on every build.
- Web Locks + quota/eviction guard: serialize all save writes with Web Locks; wrap every write in try/catch for QuotaExceededError; request navigator.storage.persist(); monitor with navigator.storage.estimate(). Treat browser storage as best-effort and evictable (MDN: 10 MiB cap, LRU eviction, 7-day Safari ITP) — the backup/export path is the durability guarantee.
- Autosave only at defined boundaries: autosave at turn/phase transitions, never mid-animation; keep writes async and off the frame budget (the Pingle lesson: even async save calls freeze if too frequent or unbatched). Single entry point for all save operations.
- Post-launch audit cadence: log every load failure with save version + checksum state; track save-version distribution to time the breaking-policy cutoff (Factorio model); keep fault-injection tests (corruption, quota, mid-write kill) in CI and run the recurring audit on the cadence already defined.

## VERIFICATION ROUND 20 (Round 448 — Thu 2026-10-15 ~15:48 EDT)
- New this round (spec only): durability plan. Spec has verify-before-parse and a save plan (round 439) but no durability plan — this round adds it (version-bump blocker, CI checksum gate, write-path lockdown, save telemetry, breaking-change policy). Matches Flukz (crash-safe writes), Factorio (migration lock), Minecraft (previous-generation insurance). (Flukz; Factorio; Minecraft.)
- Enforce freeze discipline with a version-bump blocker: SAVE-SPEC.md is frozen at verification round 20; any format change after freeze is a ship-blocker unless it ships with (a) a version bump, (b) a migration script, and (c) a golden-corpus pass. Unknown save versions are hard-refused at load — never silently loaded.
- Make the checksum audit a blocking CI gate: FNV-1a over raw payload bytes, verified on every load path (manual load, autosave load, backup-slot load); mismatch → backup-slot fallback, never parse. Pair with fault-injection validation (randomized kill mid-write across hundreds of runs) run on every target platform — this is the gate that proves the atomic write + flush + rename path.
- Lock down the write path: temp-file → flush → atomic rename; write → verify checksum → rotate backup generation (Web Locks serializing autosave vs manual save); autosaves fire only at defined safe boundaries (turn/round boundaries), never mid-mutation.
- Ship save telemetry as a post-launch audit instrument: emit load-failure events (checksum mismatches, backup fallbacks, migration errors) into the crash-free-rate dashboard with per-build tracking and spike alerts; keep the recurring audit cadence after launch.
- Codify breaking-change policy: additive-only changes within a save version; any breaking change = version bump + migration script + idempotent applied-migration ledger + full golden-corpus regression + fault-injection re-run. No bypass path.

## VERIFICATION ROUND 21 (Round 457 — Thu 2026-10-15 ~16:35 EDT)
- This round (spec only): strengthen the persistence plan. Spec has a persistence plan (round 430) — round 457 validates it and strengthens it with: deliberately corrupted-save fixtures as test assets, explicit eviction priority order, localStorage-specific hardening (write probe, prototype-pollution ban, UTF-16 accounting), deferred load until after boot renders, notify-on-recovery UX with date/time + playtime. Matches Meta (save best practices), UhiyamaLab (safe writes), Minecraft (DataVersion + rotation). (Meta; UhiyamaLab; Minecraft.)
- Add deliberately corrupted-save fixtures as test assets (ship-blocker): UhiyamaLab explicitly advises intentionally breaking saves during development to prove the recovery path works — torn JSON, wrong checksums, missing fields, future-version tags — run as fixtures against every load path (primary, backup, autosave). Load fallbacks + clamping under failure, not just happy-path loads. Any fixture that loads as valid or crashes the boot fails.
- Define the eviction priority order now (ship-blocker): Undo/redo history and old backups shed first, campaign progress and settings last. Never let a quota failure silently eat the campaign save. This is the concrete eviction order the quota/eviction guard (round 439) executes.
- Apply localStorage-specific hardening (ship-blocker): Feature-detect availability with a write probe (MDN storageAvailable pattern) — zero-quota private mode and SecurityError must degrade gracefully, never throw. Never write properties directly onto localStorage (MDN: prototype pollution and method collisions — setItem/removeItem only). Account UTF-16 sizing (2 bytes/char) against the ~5 MB per-origin budget — undo/redo history is the first budget line watched.
- Defer first load until after the boot screen renders (ship-blocker): A bad save must never black-screen launch. Boot screen renders with the build version visible first, then saves load (Meta's deferred-load advice). Any boot that throws on a corrupt save fails.
- Notify-on-recovery UX (ship-blocker): On integrity failure, load the backup, quarantine the bad file, and TELL the player a recovery happened — show each save's date/time + playtime so the player can choose intelligently (Meta). Silent recovery is a trust defect.
