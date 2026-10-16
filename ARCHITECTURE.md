# Mecha Protocol — Architecture (Bus-Factor Doc)
**Purpose:** if the lead dev is hit by a bus, a competent JS dev rebuilds from this + BUILD.md.

## Stack
- Vanilla JS (no framework, no build step). HTML + CSS + 16 JS modules.
- Canvas 2D rendering. Web Audio API (synthesized SFX, file-based music).
- localStorage (saves, settings, tip dismissals). No backend. No database.

## Module map (~/workspace/mecha-strategy-game/build/js/)
- **data.js:** MISSIONS, MECHS, WEAPONS, PILOTS, ENEMIES (all game data).
- **game.js:** Game state machine (menu → hangar → deploy → battle → victory/defeat). ~1,100 lines.
- **mech.js:** Mech class (limbs, heat, weapons, per-limb HP).
- **ai.js:** Enemy AI (enumerate → score → pick).
- **grid.js:** 10×8 grid, pathfinding, targeting.
- **hangar.js:** Mech-building UI (paper doll, part picker).
- **barks.js:** Pilot bark engine (8 triggers, cooldowns, verbosity).
- **tutorial.js:** Coach marks, 2-dismiss shut-off.
- **music.js:** STATES model (menu=silence, deploy=silence, battle=first contact).
- **sfx.js:** Synthesized SFX (Web Audio).
- **i18n.js:** EN + JA strings (189 keys, 1,087 words).
- **telemetry.js:** First-launch consent, event taxonomy.
- **save.js:** localStorage persistence.
- **perf.js:** Performance monitoring.
- **rng.js:** Seeded RNG (xorshift32).

## Key systems
- **Per-limb damage:** each mech has 6 limbs (head, torso, armL, armR, legL, legR) with independent HP. Destruction = functional loss.
- **Heat:** pattern chevrons (not color-only). 70%+ = +1/-1. 100% = shutdown.
- **Intent telegraphs:** 3-step ladder (Story=FULL, Normal=PARTIAL, Hard=NONE). Deferred to slice.
- **VEX:** ace enemy (M3). 2 actions/round, phase2, taunt=tell.

## CDN dependencies (2)
- Google Fonts (Noto Sans JP) — fallbacks exist.
- GameAnalytics SDK (unpkg) — async, optional.
- Eternal build: vendor fonts, remove GA.

## License
- Code: [Aldo's call — MIT / GPL-3.0 / split]
- Assets: procedural (code), synthesized (audio), system fonts.
