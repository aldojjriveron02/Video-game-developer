# Save Part 13 (Final Freeze / Budget Assertion) — Findings (Round 250)
**Date:** Wed 2026-10-15 ~00:22 EDT · **Source:** live web research (clews/salivity, bugnet, grimoria, web.dev, pawel, terraria, stardew, skyrim)
**Project:** Mecha Protocol — save (pre-jam; final freeze)

## A. Mechanics
- Freeze order: schema, write path, checksum (grimoria: save-version test = "single highest-value test file-for-file in a live game"; cross-direction tests where sync spans versions). Altimit: "once a game ships, its save format is fixed for every existing player" — schema changes are post-jam.
- Fixture re-run = last gate (Clews/salivity): golden-master saves per public release + migration unit tests (missing/new fields → defaults, round-trip load→migrate→save→re-load). Ritual: re-run against the EXACT shipped bundle, not a dev build.
- Boot-from-backup = distinct QA step (Clews: headless smoke — world must FUNCTION post-load; corrupt/truncated fuzzing with graceful degradation. Bugnet Feb 2026: test "interrupted writes, full storage, corruption handling, edge cases, and recovery… not just the happy path").
- Minimal data (Pawel, GamedevJS Jam 2026): "design simple data first… reduce it to the minimum" — jam-scale schema discipline.

## B. Validation
- Seven-case drill on SHIPPED build (Bugnet): each case a deliberately induced fault (kill mid-rotation, quota-blocked, bit-flipped, future-schema, empty slot, missing .bak, wrong embed origin) → clean boot + correct player-facing state each.
- Canary per embed target (Bugnet Jan 2026): itch.io/Crazy Games embeds lose progress to third-party-cookie blocking. itch.io (Aug 2026): Chrome 142+/Edge/Firefox require new permissions for embedded games. Embeds are a moving target — probe + canary in EVERY embed context (direct, itch iframe, file://) on jam day.
- Export-first comms: storage can be denied without warning (thecodeforge.io: try/catch + in-memory fallback). storageOK=false → primary action = Export. Jam-page one-liner: "If the game says storage is unavailable, use Export now — your progress is safe in the exported file."
- Platform reference (web.dev, LePage): localStorage ~5MB, synchronous, blocks main thread; navigator.storage.estimate() for quota; always catch QuotaExceededError; "best effort," evictable (Safari 7-day cap). Grounds storageOK + <50KB budget.

## C. Techniques
- Golden fixtures per version (Clews): one per public release + milestone/edge variants, CI-loaded in new build. = our test/save-fixtures 8/8. Rule: add a fixture per schema bump, NEVER edit an existing one.
- Never block boot (Clews "graceful degradation"): detect incompatible data, isolate corrupted sub-systems. Boot → safe player-readable state (fresh + visible notice), never crash/hang. = our boot probe + storageOK (keep load-bearing; never gate title screen on save read).
- Save-budget enforcement (Skyrim PS3, Eurogamer 2011): saves past ~6MB = crippling lag/crashes — a shipping defect discovered by players. Turn <50KB into a HARD ASSERTION inside selfTest(). "Budgets that aren't asserted are wishes."

## D. What to avoid
- Schema changes after freeze (grimoria: migration path is where live games break). Any post-freeze change = version bump + migration fixture, no silent edits.
- Untested backup chains (No Man's Sky: corruption "during" save while "current and previous saved games are the same" — a backup the write path can clobber is decoration). Interrupted-write drill must prove LIVE and .bak never simultaneously corrupt.
- Trusting embeds (cookie blocking, sandboxed iframes, Chrome 142 prompts). embedCtx + Export/Import = correct posture.
- Silent resets (Bugnet: "losing player progress is the most unforgivable failure a game can have"). Corrupt save → player SEES the recovery (booted from .bak) or is offered Export/Import. Silent data loss ends trust permanently.

## E. Shipped
- Terraria: .bak alongside live (one save deep) — interrupted write → backup absorbs the failure. Same architecture as ours.
- Stardew Valley: _old backups, player-executed recovery from forum instructions — chain legible (LIVE + .bak, not clever) so plain-text recovery works.
- Skyrim PS3: no budget → 6MB+ saves → lag/crashes → public explanation. The cost of unasserted budgets.

## Implemented this round
- **Hard budget assertion (Skyrim lesson):** SaveStore.selfTest() check 6 — worst-case payload (999 missions, 20 lances, max stats) serialized through the REAL write-path format (schema + savedAt + checksum). **1,222 bytes — 6/6 pass.** Budget is now asserted, not assumed.
- **Caught + fixed mid-round:** first draft used an invented `_seal()` method (threw); replaced with the real serialization pattern copied from write(). The self-check caught it before shipping.
- +12 → **4,417 lines** (+12). All node --check clean. Fixtures 8/8 pass.
- **SAVE-SPEC.md:** final-freeze rules — SCHEMA v1 locked; fixtures immutable (add, never edit); seven-case drill on shipped build per embed target; Export-first comms template; budget asserted by selfTest().

## F. Sources
clews/salivity · bugnet · grimoria · web.dev · pawel · terraria · stardew · skyrim
