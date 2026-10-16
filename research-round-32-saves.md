# Save-System Design for Web Games — Findings (Round 32)
**Date:** Tue 2026-10-13 ~23:50 EDT · **Source:** live web research 2026-10-13 (MDN, Playgama, Abratabia, Pokerogue #7580, Firebase/Supabase/Cloudflare pricing, XCOM wiki, Sirlin/gamedeveloper.com)
**Project:** Mecha Protocol — never lose the commander's progress

## A. What to save (and what not to)
- Persist: progress (mission/chapter), inventory/resources, unlocks, stats/customization, settings (audio, language, difficulty), tutorial completion. For browser games: the data that lets players continue across sessions.
- Do NOT persist: recomputable/cached stats, transient UI state, re-rollable RNG. Sirlin's rule: "A save system should allow the player to stop playing at any time, allow the player to pick up where they left off, and not in any way reduce the game's challenge."
- Fire Emblem (GBA) exemplar: one-shot save marker that quits to title; resuming DESTROYS the marker — saving as pause, not as difficulty lever.
- Pokerogue #7580 lesson: client saves are user-mutable; syncing corruption to a server makes it worse. Validate before syncing.

## B. Schema versioning
- Explicit `version` field in every save; small sequential migration functions (v1→v2→v3); run until save.version == current; write the upgraded save back; NEVER mutate raw in place; test against truncated JSON and missing keys; load path always returns usable defaults and never blocks game start. Start at schema 1 NOW — adding it later doesn't help already-shipped saves.

## C. Corruption & recovery
- Breakage: QuotaExceededError, private-mode restrictions, truncated/crashed writes, user tampering, sync propagating corruption.
- Recovery: backup slots (previous-known-good), validation (schema shape, version, checksum), try/catch on parse AND write with fallback to defaults, ATOMIC writes (tmp key → verify → swap live, so a crash mid-write never kills the only good copy), export/import JSON for manual recovery. Never block startup — corrupted save boots to fresh state with a message, never a black screen.

## D. Autosave design
- Three patterns: event-driven (mission end, settings change), interval-based (dirty flag, only write on change), lifecycle-based (visibilitychange, pagehide, beforeunload — CRITICAL for mobile; browsers kill background tabs).
- Save at stable boundaries: mission end, hangar return (perfect hub boundary), transitions. Per-turn scratch autosave is fine for KB-sized saves (sub-millisecond writes).
- UX: brief "Saving…" indicator; autosaves separate from manual slots; never silently overwrite player-valued state.

## E. LocalStorage limits
- 10 MiB total per origin on ALL browsers (5 localStorage + 5 sessionStorage); QuotaExceededError on overflow — wrap every setItem in try/catch.
- iOS 17+/Sonoma: up to ~60% of disk per origin for installed web apps. Eviction is LRU by origin; `navigator.storage.persist()` excludes you. WebKit may purge data for origins with no interaction in 7 days [unverified] — another reason to offer export.
- KB-sized saves never approach quota — but still try/catch everything.

## F. Cloud saves at $0
- **Firebase Spark:** Firestore 1 GiB / 50K reads/day / 20K writes/day free. Catch: Blaze recalculates daily — spikes can bill; stay on Spark deliberately.
- **Supabase free:** 500 MB DB, 5 GB egress. Catch: projects PAUSE after 1 week idle.
- **Cloudflare free:** KV 1K writes/day hard ceiling + eventual consistency (bad for save round-trips); D1 better (5 GB, no egress fees). Catch: don't sync per-turn.
- Verdict: for KB saves any tier is infinite — the real cost is implementation + identity. SKIP cloud until cross-device is a proven need.

## G. Save-scumming & ironman
- XCOM Ironman: no manual saves, one autosave, permadeath. "Bronzeman" (Long War): no mid-mission saves, free between missions.
- XCOM Second Wave "Save Scum": re-rolls the RNG seed on every load — design so reload can't deterministically game outcomes.
- Prototype verdict: SKIP anti-scum. Client saves are inherently editable. Ship generous saving; keep Ironman as a future difficulty option.

## Applied to Mecha Protocol (implement-immediately, this round)
- **New `js/save.js` — SaveStore:** schema v1 envelope (settings/campaign/hangar/run/stats/meta); FNV-1a checksum; atomic two-key rotation (tmp → verify → live, previous → backup); read chain live → backup → defaults (never throws, never blocks boot); sequential migrate(); v0 importer (old {loadouts, missionIndex} blob + scattered settings keys); export/import JSON; `navigator.storage.persist()`.
- **Mid-mission suspend save:** end-of-turn battle snapshot (per-limb HP, heat, positions, weapons, armor, buffs, undos) at the clean turn boundary; welcome screen offers "▶ Resume — Mission N"; resume rebuilds the exact battle state (verified: no double heat-cooling, intents recomputed).
- **Lifecycle autosave:** visibilitychange/pagehide persist (iPhone Safari kills background tabs); "Saved ✓" HUD pulse on explicit saves.
- **Campaign progress:** unlocked/completed mission tracking; run cleared on mission end, victory, defeat.
- Verified in harness: checksum round-trip, truncated-LIVE→BAK recovery, total-corruption→defaults, v0 migration, tamper rejection, battle serialize/deserialize round-trip, full resume flow. Full regression playtest green. 2,452 lines, all syntax-clean.

## H. Sources
developer.mozilla.org (Storage quotas) · playgama.com/blog (corrupted saves/migration) · abratabia.com/game-saves (autosave patterns; cloud architecture) · github.com/pagefaultgames/pokerogue/issues/7580 · firebase.google.com/pricing · supabase.com/pricing · developers.cloudflare.com/workers/platform/pricing · xcom.fandom.com/wiki/Ironman · gamedeveloper.com/design/saving-the-day-save-systems-in-games (Sirlin)
