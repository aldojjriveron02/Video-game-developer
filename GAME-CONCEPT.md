# MECHA STRATEGY GAME — Concept Document
**Date:** Tue 2026-10-13 · **Status:** concept phase, awaiting Aldo's call · **Constraint:** $0 total budget
**Research:** 3 rounds, live web, all findings in Drive ("Mecha Strategy Game — Research")

## The game (one paragraph)
An anime-style mecha tactics strategy game for the browser. You command a squad of customizable mechs in turn-based grid battles — positioning, flanking, heat management, and blowing enemy mechs apart piece by piece. Between battles, you're in the hangar: stripping parts, swapping weapons, tuning each machine, your pilots growing alongside their steel. Phase 2 adds async multiplayer MMO-lite — battles on your own schedule, guilds, leaderboards, a persistent hangar, world events. It looks like the reference: white-and-navy armor, glowing visor, neon hangar, every weapon system labeled like a technical schematic.

## Design pillars (from research)
1. **Tactical disassembly** — per-part destruction (Front Mission). Your build is what the enemy shoots off.
2. **Legible information** — telegraphed attacks, visible trade-offs (Into the Breach). Victories earned by foresight, never lost to dice.
3. **Pilot attachment** — players invest in people, not metal (BattleTech). That's what makes loss sting.
4. **Heat as the master constraint** — weapons balanced by heat-per-alpha, tying guns, engines, and sinks into one budget (BattleTech).
5. **The hangar is the second game** — assembly/customization "at the core" of the experience (Armored Core VI). Schematic framing with part callouts, real-time stat deltas, rotating preview under hangar light.

## Customization model
Front Mission's 4-part standard: body / left arm / right arm / legs + CPU + backpack. Weight capacity, power output, hardpoint types, heat budget. Pilots learn skills from weapon experience — pilots and parts grow on parallel tracks. Visual variety via paper-doll layering: 8×8×8 parts = 512 variants from 24 drawings, plus palette swaps for factions/rarity.

## Phase plan (the proven indie path)
- **Phase 1 — single-player tactics.** The only sane launch scope. Every tiny team that shipped did single-player first (Subset Games: 2 people; Phantom Brigade: 6 years; Kriegsfront: free prologue first). Multiplayer-first killed MechWarrior Tactics — the browser mecha tactics cautionary tale.
- **Phase 2 — async MMO-lite** (earliest). Async PvP ladder, guilds, leaderboards, persistent hangars/progression, world events as scheduled serverless jobs. NOT full MMO — team-sized job, ruled out.
- **Never:** real-time multiplayer, persistent connections, anything needing an always-on server (that's where $0 dies: $2–15/mo).

## The $0 production stack (all verified)
| Layer | Choice | Free tier |
|---|---|---|
| Art 3D | Blender (model once → rig → render 2D sprites, Dead Cells pipeline) | $0, open source |
| Art 2D | Krita (touch-up, UI, hangar screens) | $0, open source |
| Base meshes | Quaternius Animated Mech Pack (CC0, verified) | $0, public domain |
| Anime look | Toon shader: Standard view transform, cel bands, inverted-hull outlines, 1 key light, colored shadows, emissive visor | $0 (technique) |
| Multiplayer backend | Cloudflare Workers (100K req/day) + D1 (5GB) | $0, hard caps |
| Leaderboards | Upstash Redis free tier | $0 |
| Notifications | Push (FCM/Web Push) | $0 |
| Hosting | Cloudflare Pages / Render static | $0 |
| Anti-cheat | Server-side move validation + info hiding + replay logs | $0 (code) |

**Traps avoided:** Firebase-alone (Spark has no server code → no cheat-proof validation without paying); Fly.io (no free tier, card required); paid asset packs; hand-drawn frame-by-frame animation (linear cost forever); PBR realism (toon is cheaper AND reads anime).

## Minimum anime read (the 70% rule)
Strong silhouette + dark outlines + 2–3 tone cel shading + one accent color + glowing visor. Visor glow + outlines carry ~70% of the anime read; everything else is garnish. Don't gold-plate what the eye won't miss.

## Failure patterns we're dodging
1. Complexity without stakes — every system must connect to combat outcomes.
2. Multiplayer-first sequencing — single-player ships first, always.
3. Customization divorced from destruction — builds matter because builds get shot off.
4. Monetizing a beta / team churn / silence (MechWarrior Tactics).
5. Reused maps + muddy objectives — small set of hand-tuned maps with context/options/deadline beats sprawl.

## Open questions for Aldo
1. **Concept approval** — does this match the game in your head? What's different?
2. **Name** — it needs one.
3. **Robot Fighting Sim** — shelve, run alongside, or fold systems in? (Its forge/limbs/heat/gadgets are half this game's combat already.)
4. **Prototype greenlight** — the next phase is a playable tactics prototype (one squad, one map, the hangar). Say the word.

## What's next (after his call)
Prototype phase: grid combat core (initiative, heat, per-part damage) → hangar builder (4-part model) → one hand-tuned map → bot playtesting (the same pipeline that built Robot Fighting Sim). Research continues one phase ahead, as always.
