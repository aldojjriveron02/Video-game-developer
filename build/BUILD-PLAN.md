# Mecha Protocol — Build Plan
**Working title:** Mecha Protocol (Aldo names it) · **Phase:** Prototype → playtest gate
**Stack:** vanilla JS, canvas, PWA · **Targets:** iPhone 17 Safari/Chrome + desktop browsers · **Budget:** $0
**Code:** ~/workspace/mecha-strategy-game/build/ · **Research:** Google Drive "Mecha Strategy Game — Research"

## One-page plan (Round 47 — Phase 0)
- **Pitch:** Anime mecha tactics — build your mech in the hangar, fight 3v3 grid battles where every limb matters.
- **Core loop:** (1) Build/loadout in hangar → (2) turn-based 3v3 grid combat (limb damage, heat, enemy intent) → (3) rewards/debrief → back to hangar.
- **Platforms:** iPhone 17 (Safari/Chrome) + desktop browsers. PWA.
- **NOT list:** no real-time multiplayer (async MMO-lite is post-launch), no voice acting, no branching dialogue, no server backend, no seasons/battle passes, no new techniques during production.

## Phase gates
1. **Prototype** — full core loop playable. Gate: Aldo's "is it fun?" playtest (measurable: wave 0/1/2; ≥4/5 complete M1 unprompted, median time-to-first-action <90s, zero >3min stuck, ≥3/5 name a favorite moment + want to continue, intentional heat/undo use; sunset after 2 waves).
2. **Vertical slice** — one mission at final quality. Gate: fun + production-truth + cost + quality-baseline (see below).
3. **Production** — content multiplication against the slice bar (order: M2–M3 maps/mixes → roster variants → relay objective → VEX multi-component → Daily Sortie → sound layering → JA polish last; no new systems except relay). 4. **Alpha** — feature freeze: all systems playable end-to-end, zero placeholder mechanics. 5. **Beta** — bugs/balance only: content complete, no new features. 6. **Launch.**
**Production discipline (Round 59):** 6-week milestones, 20% buffer, per-milestone cut list; MoSCoW with a published "Won't have (this release)" list; no new features mid-milestone; 90/90 rule — the last 10% (polish, Safari quirks) takes as long as the rest, schedule for it; never rebuild systems mid-production (extend the vanilla-JS codebase); $0 resources only (freesound, rev-share music, r/playtesters); never outsource combat feel, per-limb tuning, heat, or creative direction.

## Vertical slice plan (Round 47)
**Named risk:** can a solo dev produce this game's quality bar repeatably, and what does one mission cost?
**Scope IN:** one mission (the strongest of the three — M3, the VEX duel) in one biome, at final art/sound/UI quality; 3v3 with ALL risky interactions live (per-limb damage, heat economy, pilot barks, enemy intent display); hangar loadout minimal (2–3 chassis, handful of weapons differing on range/heat/limb-targeting axes); full juice pass on the slice's feedback set (hit flash 50–100ms, scaled screenshake, 20–30 particles/event, every input acknowledged <100ms); mission→hangar→mission loop with win/lose; perf validation on iPhone 17 + desktop.
**Scope OUT:** M1/M2 content, full roster, extra biomes, meta-progression beyond the loop, localization, store/marketing assets, backend beyond telemetry, any new technique/tool.
**Round 58 refinements (vertical-slice research):** exactly ONE deferred item enters the slice — enemy intent telegraphs at final quality (the highest-leverage deferred feature; UI+AI+animation integration = the production risk to prove). Explicitly OUT: Daily Sortie playable, relay objective, VEX multi-component boss, full sound layering. No horizontal expansion.
**Acceptance criteria (defined BEFORE building — Nineva):** fresh player completes unassisted on iPhone 17 Safari at 60fps-class pacing; no game-breaking bugs; telemetry firing; real (non-placeholder) UI; at least one layered sound pass on core actions; cold URL, no dev cheats, real mobile load times.
**Build-hour log (Ismail's math):** track hours per content type (mission, chassis, weapon, biome) from day one — the log IS the slice's most valuable output; unit cost × remaining content = the real schedule.
**Deliverables:** slice build + risk report (what the pipeline proved, per-unit costs, what remains uncertain) + production backlog + quality record. Hard stop when acceptance criteria pass — resist the "polish the other missions" horizontal trap.
**Timebox:** 4–8 weeks solo.
**Milestones:** M1 combat at final quality (wks 1–3) → M2 hangar loop + juice/audio (wks 4–5) → M3 perf, playtest, slice review build (wks 6–8). Weekly: Monday 3 player-visible outcomes; art and code timeboxed separately; Friday 30-min own playtest; devlog.
**Slice → production gates (all must hold):** (1) FUN — blind playtesters complete unprompted, ≥1 unprompted engagement signal; (2) PRODUCTION-TRUTH — built with the production pipeline, shortcuts named with replacement costs; (3) COST — per-unit costs measured (hrs/mission, /chassis, /weapon, /biome) × content plan < ~12 months solo, else cut; (4) QUALITY-BASELINE — reviewed build preserved + written quality record, the floor production can't fall below. Fail → cut (MoSCoW, future-pitch list); extend only for a named unanswered production risk.
**Lock artifacts (finish before M1):** style guide · asset spreadsheet (make/buy + hour estimates) · technical budgets (sprites/textures/audio/draw-calls for iPhone 17) · placeholder inventory. Rule: no new techniques during production.

## Implementation history (condensed — full detail in RESEARCH-LOG.md)
- Rounds 1–30: core build (grid, limbs, heat, AI, hangar, campaign, save, telemetry, music/SFX engines).
- R31 sound ($0) → sfx.js rewrite, VEX audio identity. R32 save design → save.js (v1, atomic, suspend/resume). R33 launch strategy → telemetry gaps, help export/import. R34 balancing → assist disclosure, heat/limb/undo telemetry. R35 enemy AI → focus-fire knob, personalities, VEX enrage. R36 rewards → SKIP, EPICs, pity, manufacturers. R37 juice → trauma² shake, graded hit-stop, anticipation, squash. R38 FTUE → TFA telemetry, funnel instrumented. R39 hangar UX → preset recipes, mech naming, build share codes. R40 art direction → panel lines, art-lock checklist, frozen 16-color palette. R41 accessibility → end-turn confirm, 100–200% text size, photosensitivity audit. R42 playtesting → PLAYTEST-SCRIPT.md, measurable gate. R43 mobile perf → long-frame buckets, idle-to-zero. R44 retention → local streak/day-N tracking, LAUNCH-CHECKLIST.md. R45 narrative → bark engine (barks.js, 6 triggers, 13 lines EN+JA). R46 music → CRITICAL .m4a fallback for iPhone (Safari can't decode Vorbis), audio/README rewritten. R47 vertical slice planning → this plan.
- **Needs Aldo's hand:** GA keys · itch.io account · 2 Pixabay tracks (hangar + battle, ogg+m4a) · native JA speaker pass · "is it fun?" playtest verdict (wave 0).
- **Current:** 2,911 lines, all syntax-clean, harness-verified. Prototype gate pending Aldo's verdict.

## Round 97: Week-1 pillars + cut list (vertical slice research)
**Pillars:**
1. Every enemy turn is a readable puzzle (intent telegraphs = the fun)
2. Mechs feel modular via per-limb damage (not HP bars)
3. Plays on iPhone 17 in short sessions (touch-first, snappy)

**Cut list (MoSCoW):**
- MUST: M3 (VEX duel), 3v3, per-limb, heat, barks, intent telegraphs, hangar (2-3 chassis)
- WON'T: M1, M2, Daily Sortie, relay objective, VEX multi-component, full sound layering, extra archetypes beyond 3

**Go/No-Go:** any threatened feature gets ≤5 days to prove Conditions of Satisfaction, or it's cut.
**Intent telegraphs FIRST (weeks 2-3):** ItB spent half of 4 years on intent UI. Build the 3-step ladder early, restrict to ~3 attack archetypes with distinct glyphs, playtest "can players predict every enemy action?"
