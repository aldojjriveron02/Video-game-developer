# Mod Support Part 2 (JSON API) — Findings (Round 105)
**Date:** Wed 2026-10-14 ~21:15 EDT · **Source:** live web research 2026-10-14 (steamcommunity.com, foundryvtt.com, github.com ×3, minecraft.wiki, stardewvalleywiki.com, nexusmods.com, mod.io, forum.babylonjs.com, arstechnica.com, bleepingcomputer.com)
**Project:** Mecha Protocol — mods

## A. Mod problem
- No filesystem; plugin systems; userscripts; load paths (file/URL/IndexedDB).

## B. JSON API
- Minecraft (dogfooding, versioning, Safe Mode); Stardew (JSON-only); Dawnfolk (examples); ItB (Lua caution).

## C. Distribution
- Foundry (manifest URL); Bitburner (wget); Dawnfolk (Workshop/archive/itch); mod.io.

## D. What to avoid
- Breaks on update; malicious (Fractureiser); fragmentation (one spec).

## E. Shipped
- Dawnfolk; Foundry; Bitburner; Minecraft; Stardew; ItB; mod.io.

## Applied this round (spec only — NO code)
- **MOD-SPEC.md:** manifest spec, Safe Mode, URL-first distribution, dogfooding, Tier 2-lite rules, update contract.
- 3,399 lines (no code change).

## F. Sources
steam · foundry · github ×3 · minecraft · stardew · nexus · mod.io · babylon · ars · bleeping
