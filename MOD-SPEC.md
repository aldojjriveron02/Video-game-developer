# Mod Support — Production Spec (Round 83)
**Status:** DEFERRED to vertical slice (Tier 1) and post-launch (Tier 2+). No prototype changes — the architecture doesn't block future moddability.

## Tier 1: JSON is the mod API (slice work, ~1–2 weeks)
- Move into versioned JSON (`schema_version: 1`): missions, mech chassis/weapons, enemy archetypes, pilots, pilot barks, difficulty tuning.
- Ship `MODDING.md`: every field documented + one official example mod (bonus mission or weapon pack).
- Doubles as the dev's own content pipeline.

## Tier 2-lite: behavior strings (post-launch)
- Data files reference behaviors by string key (`"attackPattern": "spread3"`) resolved against a built-in function registry.
- Safe: only existing functions callable. No arbitrary code.

## Distribution ($0, browser-native)
- Export mod (JSON download) / Import mod (file picker + drag-drop).
- Share codes via URL hash (`game.html#mod=<payload>`).
- itch.io "Game Mods" pages with `mecha-protocol-mod` tag (Dawnfolk convention).
- Steam Workshop ONLY if a Steam release happens (it doesn't work outside Steam).

## Mod-proofing (build in from day one of Tier 1)
- Validate all JSON against schema at load — loud, specific errors.
- Error isolation: one bad mod disables itself, never bricks the game (SMAPI pattern).
- Schema version gate: refuse incompatible mods with a clear message.

## Policy
- Mod EULA in RIGHTS.md: non-commercial, no full-game redistribution, no obfuscated code, no cheat/hack mods.
- Telemetry: tag all events `modded=true` when any mod is loaded (keeps playtest data clean).

## Explicitly deferred
- Tier 3 (scripting/Lua) and Tier 4 (loader/SDK): post-launch. Promise only data mods in v1.

## Round 105: Manifest + Safe Mode (production mod pass)
**Manifest (every mod):**
```json
{
  "id": "my-mech-pack",
  "name": "My Mech Pack",
  "version": "1.0.0",
  "api_version": { "min": "1.0", "max": "1.x" },
  "author": "name"
}
```

**Safe Mode (Minecraft pattern):**
- Validate manifest on load. Malformed/incompatible → disabled with player-readable message.
- Game boots clean — never crashes on bad mod.
- Log mod id + version with every telemetry event.

**Distribution (URL-first):**
- "Install from URL" (manifest JSON anywhere — gist, itch.io, personal site).
- Drag-and-drop .zip. Paste-box fallback for JSON.
- IndexedDB = the browser's "mods folder."
- Curation: itch.io "Game Mods" + shared tag + Discord #mod-vault.

**Dogfood Tier 1 (Minecraft pattern):**
- Vanilla mechs/weapons/pilots/enemies expressed in the SAME JSON mods use.
- Forces schema stability. Self-documenting. Copy-paste examples.

**Tier 2-lite = data, not code:**
- Whitelist of triggers/effects. No eval(), no arbitrary JS.
- EULA: human-readable, non-obfuscated, malware-free, non-commercial.

**Update contract:**
- api_version gates. Changelog with migration notes.
- Previous stable build URL stays live ("try older version").
- ONE blessed spec. Never bless a second.

## Round 117: Production mod spec (mod support part 3)
**Distribution (URL-first + static registry):**
- Mods = signed JSON manifest + content files (hosted anywhere: GitHub Releases, itch.io).
- In-game "Mod Browser" fetches versioned JSON index (GitHub Pages, $0).
- Categories: Mechs, Missions, Pilots, Audio, Cosmetic. Tags. Version badges (Factorio pattern).
- Trending sort. Download counts. No Steam Workshop (browser game).

**Tier 2-lite = content-only (Stardew lesson):**
- JSON data mods (mechs, missions, barks, balance) — NO code execution, zero trust.
- JS mods = opt-in "unsafe" tier (Safe Mode + consent gate).

**Safety (Nexus badge system):**
- Green = hash verified + schema validated. Yellow = pending. Red = quarantined.
- Quarantined = never auto-installs. Manual review required.
- Show uploader identity + first-published date (account-age heuristic).

**Anti-Fractureiser:**
- Per-mod isolated storage (one bad mod can't poison the folder).
- Manifest hash re-verified on EVERY load. Refuse if files changed.
- NO runtime downloads (manifest lists ALL files up front).
- Publisher 2FA. New-account uploads held for manual review.

**Dogfood:**
- Ship 2-3 first-party mods (bonus mission, mech variant) in vertical slice.
- Prove install/update/disable/uninstall, version-mismatch, broken-mod UX.

**Hard gates:**
- NO paid mods (2015 lesson). NO platform lock-in.
