# Save Part 14 (Final Freeze) — Findings (Round 259)
**Date:** Wed 2026-10-15 ~01:18 EDT · **Source:** live web research (bugnet, checkpoint64, r/gamedev, itch.io, cdpr)
**Project:** Mecha Protocol — save (pre-jam; final freeze)

## A. Mechanics
- Canonical checklist (Bugnet, Reyes Mar 2026): versioned saves (old versions handle new saves, new handle old — always test migration across versions); atomic writes (write temp, then rename); checksum validation on every load; rolling backups (n-1, n-2). Core line: "A player will forgive a crash. They will never forgive losing their save."
- Failure anatomy (Checkpoint64 Jun 2026): (i) interrupted write → truncated JSON mid-save; (ii) bad in-place edit → half-updated JSON; (iii) format/schema mismatch → parseable but wrong shape. Single save slot = single point of failure.
- r/gamedev: "When your game creates a new save file, don't replace old saves" — multiple slots. Small saves (~1MB) rewrite whole each time; huge saves need delta strategies. A dev lost Subnautica saves to power outages — interrupted-write drill exists because power/tab kills are real.

## B. Validation
- Embed target matrix (itch.io threads): localStorage differs per embed — itch.io/t/2346400 "localStorage lost at every update" (CDN-URL changes wiped saves); iPad issues; iPhone tab eviction clears saves. Validation must run on the SHIPPED target: itch.io page, fullscreen, mobile, iPad — not localhost.
- The update drill (Humane Tiger, Fall of Days devlog #31, Feb 2024): save → devtools inspect → publish new version → restart → confirm persistence ("Phew... all is good!"). Re-run the fixture drill after EVERY publish — the embed context, not your code, can invalidate saves.
- Export as backstop: when localStorage can't be trusted (sandbox, iPad, private mode), manual export/import = the fallback.

## C. Techniques
- Checksum discipline: embedded with payload, verified every load; mismatch = hard rejection routed to backup/defaults, never loaded optimistically.
- Backup slots: primary + previous-generation minimum; failed validation → restore backup before defaults.
- Atomic writes: write-temp-then-rename; crash mid-write leaves last good save intact.
- Schema versioning: every save carries version; loader migrates old→new, diverts unknown future versions (→ backup → defaults). Unversioned = format drift undetectable.

## D. What to avoid
- Silent resets (CDPR on Cyberpunk 8MB: damaged saves unrecoverable — players told EXPLICITLY, not silently wiped). Never discard data without visible message + export path.
- Unversioned schemas (Checkpoint64 format-mismatch case).
- Untested corrupt paths (Bugnet: test migration across versions, not just happy path).
- Post-freeze schema changes (re-opens every case above). Locked means locked.
- Single slot (Checkpoint64: "if that save is the only one and something goes wrong, you're not having a good day").

## E. Shipped
- Cyberpunk 2077 8MB bug (Dec 2020): saves >8MB permanently corrupted; Hotfix 1.06 removed the limit going forward, but damaged saves unrecoverable. Why: fixed-size budget with no handled overflow path — budget exceeded = total loss. Direct lesson: enforce BEFORE shipping; make overflow a handled case.
- Subnautica/power-outage (r/gamedev): interrupted writes = #1 real-world corruptor. At 1,222 bytes our saves rewrite atomically in milliseconds — the interrupted-write drill proves the backup catches it.
- itch.io localStorage wiped on update (itch.io/t/2346400; Humane Tiger): the win story = the update drill. On jam platforms the storage context is outside your control — validate against the published build, keep an export fallback.

## Implemented this round
- **THE CYBERPUNK LESSON, in code (js/save.js):** the 50KB budget was asserted in selfTest but NOT enforced at runtime. Added a hard guard in `write()`: if the serialized payload exceeds 51,200 bytes, the write is REFUSED before touching storage (telemetry logged) — old LIVE stays intact, the corrupt path is never entered. Verified functionally: good write OK, 60KB write refused, LIVE intact after refusal, normal writes still work after.
- Fixtures 8/8 pass, all `node --check` clean. +7 → **4,428 lines**.
- SAVE-SPEC.md: final-freeze protocol (below).

## F. Sources
bugnet · checkpoint64 · r/gamedev · itch.io · cdpr · humane tiger
