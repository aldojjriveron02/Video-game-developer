# Save Part 21 (Verification Round 7) — Findings (Round 322)
**Date:** Wed 2026-10-15 ~07:05 EDT · **Source:** live web research (bugnet, mdn, stardew, factorio)
**Project:** Mecha Protocol — save (pre-jam; verification round 7)

## A. Mechanics
- Cross-session audit (Bugnet/Brandt): "save and load complete game states and assert they match — not just smoke-loading, but full state equality." Three mechanics: (1) round-trip full states, (2) test migrations, (3) cover corruption handling.
- Quota-recovery audit (MDN): "wrapping all storage writes in try/catch for QuotaExceededError, checking headroom first with navigator.storage.estimate()." Audit: fill near quota, attempt save, verify game stays playable and LIVE never clobbered.
- Export/import audit (Bugnet/Bauer; Reyes): "an undocumented save format is a risk." Professional audit = "save file inspector" view. Fixtures should be viewable/diffable.

## B. Validation
- Long-session testing (Bugnet): "test saves after hours of play, because state accumulates." Real bugs: "crop growth frozen after reload; strategy saves corrupting when saved mid-turn." Validate: save at every phase boundary, reload, verify continuity.
- Storage-pressure testing (MDN): "browsers evict best-effort origin data under pressure; Safari evicts origins with no interaction in 7 days; localStorage throws at ~5MB." "Request persistence via navigator.storage.persist()."
- User-data portability (Bugnet/Reyes): "naive conflict resolution mishandles diverged saves." For web: "can a player move their save between browsers/machines? Without export, the answer is no."

## C. Techniques
- Export formats: "human-readable, self-describing." Stardew: "saves are XML that players can open in Notepad." Factorio: "ZIPped but the autosave-slot scheme is the portability story." For us: versioned JSON file download (schema v1 stamped).
- Import validation: "never trust an imported file — validate schema version, required fields, value ranges, checksums before touching LIVE; load into scratch slot first, only promote on success." "Import must fail closed to the current LIVE save."
- Quota graceful degradation (MDN): "try/catch on every write, pre-check with estimate(), degrade by refusing new save (keeping old LIVE) with clear message." "Never let a failed write leave a half-written LIVE key."
- Session continuity (Bugnet): "gate saves on a stable state and serialize the logical grid." "Only auto-save when DIRTY and at a phase boundary."

## D. What to avoid
- Unexportable saves: "web games that keep saves only in localStorage trap players — browser data cleared, profile switched, or iframe storage blocked means progress is silently gone." (Bugnet/Okafor: SecurityError in itch.io iframes.)
- Import without validation: "loading untrusted data straight into live state is how you get impossible game states."
- Quota crashes: "letting QuotaExceededError propagate uncaught kills the session and can leave a torn write."
- Session loss: "overwriting the only good copy before the new one is verified." (Fire Emblem, Soul Calibur 3, Fallout 4, KOTOR II cases.)
- Silent overwrites: "naive newest-wins without surfacing the conflict — bites when the same player has two tabs open."

## E. Shipped
- Stardew Valley: "every character keeps the previous day's save as an `_old` file pair." "Backup-before-overwrite plus readable format turned recovery into a player-executable procedure."
- Factorio: "multiple rotating autosave slots." "Decouples 'latest' from 'only' — a bad write can never destroy all recovery points."
- Minecraft: "`level.dat_old` — previous known-good preserved beside `level.dat`." "Write new, keep old until new is proven."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** portability story complete. Export = real JSON file download via Blob (save.js:147-160, `mecha-protocol-save.json`). Import = validate-then-promote: bad-json → bad-shape → bad-checksum → write() (atomic chain) → ok/write-failed (save.js:163-167). Fail-closed to LIVE. `persist()` requests navigator.storage.persist() (save.js:170-174, MDN recommendation). `probeStorage()` detects silent iframe discard (Round 182, itch.io case).
- **SAVE-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,565 lines** (+0).

## F. Sources
bugnet · mdn · stardew · factorio · minecraft
