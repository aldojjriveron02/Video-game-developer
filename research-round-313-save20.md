# Save Part 20 (Verification Round 6) — Findings (Round 313)
**Date:** Wed 2026-10-15 ~06:35 EDT · **Source:** live web research (horneman, bugnet, portal ready, minecraft)
**Project:** Mecha Protocol — save (pre-jam; verification round 6)

## A. Mechanics
- State-coverage audit (Bugnet; Horneman): "save at every major checkpoint and verify the load restores exact state — not merely that it 'loads'." Enumerate: position, inventory, quest flags, unlocks, time played, settings, NPC state. Horneman: "robustness means accuracy beats recency — it is better to lose recent progress than to restore corrupted data."
- Fixture audit (Bugnet; Portal Ready): "keep save files from every major version in the test asset set and exercise migration logic against each explicitly." "Keep real save strings captured from each released version." Fixtures must be real captured payloads, not hand-authored mocks.
- Message audit (Bugnet; Portal Ready): corrupted data → "starting from the last valid checkpoint 'with a clear message'." "Crashing without explanation or silently loading partial state are never acceptable." Distinguish: unreadable (original untouched until recover()), newer (old build must never overwrite newer), read-error (blocked storage ≠ no save).

## B. Validation
- Corruption testing (Bugnet): "kill the process during a save (interrupted-write drill)." Three correct behaviors: (a) roll back to last complete write (atomic tmp+rename); (b) detect corruption and offer previous valid save (requires backup); (c) delete corrupted and resume from last valid checkpoint with clear message. (Portal Ready): localStorage reads can throw SecurityError — "even reading the store at boot must be wrapped in try/catch."
- Migration testing (Bugnet; Portal Ready): "version-stamp every save, test migration explicitly, and test loading future-version saves." "An old build must never overwrite a newer-version save."
- Storage limits (Portal Ready): "5 MiB per origin (MDN); writes beyond it throw QuotaExceededError (check err.name with err.code fallback)." "Safari's 7-day cap deletes script-writable storage." Poki: "saves wrapped in try/catch and the game stays playable in incognito." Y8: "throttle autosaves (about once a minute) and explicitly tell the player when a save failed."

## C. Techniques
- Atomic writes (Bugnet; Minecraft): "write to a temp file and rename." Minecraft: level.dat_new → rename to level.dat; prior kept as level.dat_old — "atomic replace plus previous-version backup in one mechanism."
- Versioned schemas (Horneman; Minecraft): "version all the things — per-bucket version numbers with a minimum supported version." Minecraft: DataVersion + version_history, migrated by DataFixerUpper.
- Graceful degradation (Portal Ready; Bugnet): "never destroy progress — recover() copies the unreadable payload to a backup key before doing anything else." "Back up before any irreversible migration." Poki: storage blocked must leave a playable game.
- Player communication (Bugnet; Portal Ready; Y8): corrupted → "clear message pointing at the last valid checkpoint." "Tell the player when a save failed." "Expose status (not just state) so UI can message precisely." Minecraft: session.lock "refuses a second writer instead of allowing two processes to fight."

## D. What to avoid
- Silent corruption (Bugnet): "crashing with no explanation" and "silently loading partial state" are hard bans.
- Unversioned formats (Horneman): "without a version stamp, old/new payloads are indistinguishable and misreads are silent."
- Untested migrations (Bugnet; Portal Ready): "migration logic must be tested explicitly against fixture saves from every major version." "A migration tested only against hand-made mocks is an untested migration."
- Lost player data: (a) "saving before load completes — Horneman calls it a guaranteed save wipe and says the save manager must assert against it." (b) "destroying the only good copy — overwriting a newer-version save with an old build, or swallowing QuotaExceededError."
- Single-slot saves (Minecraft; Terraria): "games that keep only one save file leave the interrupted-write drill with nothing to roll back to."

## E. Shipped
- Minecraft: atomic replace + versioned data + writer lock. "The three most common save disasters — torn writes, stale-format misreads, and double-writer corruption — are each structurally impossible rather than merely unlikely."
- Terraria: automatic .bak backups. "The backup is automatic, adjacent, and legible — even non-technical players can execute the recovery."
- Factorio: rotating autosaves (autosave-slots). "Rotation bounds disk use while giving players multiple restore points."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** Horneman's "save-before-load" assertion. Our localStorage API is synchronous — `SaveStore.read()` (game.js:282) completes synchronously at boot before any `export()` can be triggered (game.js:126, user-initiated only). There is no async load to race against; the wipe scenario is structurally impossible. Write path is atomic (TMP→verify→BAK→LIVE, save.js:47) with DIRTY flag (Round 277), budget guard (Round 259), and quota handling (Round 304).
- **SAVE-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
horneman · bugnet · portal ready · minecraft · terraria · factorio
