# Roguelite Loop Design for Mecha Tactics — Findings (Round 25)
**Date:** Tue 2026-10-13 ~22:23 EDT · **Source:** live web research 2026-10-13 (Steam pages, Grimdark Magazine, TurnBasedLovers, Game Design Analysis, thom.ee, GameAnalytics benchmarks)
**Project:** Mecha Protocol — turning 3 missions into a tight replayable loop

## A. Mech Armada (2022, Very Positive, 656 reviews)
- Proc-gen levels; branching campaign map with risk/reward path choice (2 bosses/stage) — added because the loop "felt fairly linear."
- Mech assembly (bodies/movement/weapons/specials); energy = build currency; mid-run re-spec at cost; parts made limited-use to force diversity over min-maxing.
- **Failure feeds unlocks:** every run unlocks points buying NEW parts for future runs; upgraded parts persist.
- Difficulty via **enemy hard-counters** (Dodgers immune to non-close-combat), not stat scaling. Instant-death fog removed from Act 1 (frustrating on small maps). Sandbox mode = theorycrafting lab. ~7h54m main.

## B. Ignited Steel (2022) — heat as tradeoff
- **Overheated mechs deal MORE damage but take more in return** — a risk/reward dial, not a penalty bar. 3 fixed chassis, recruited pilots, FTL star-map, harsh turn limits, randomized events. Meta = roster growth, not stats. Cautionary: short + seemingly abandoned — loop depth must carry replayability.

## C. Death Ring: Second Impact (2025 EA)
- 4-mech squad; objective shuffle (evac/decapitation/mining/defense); dynamic FTL event maps; "Heat Mode" remix.
- **Module synergy engine:** hundreds of modules from 9 manufacturers combine into "Synergy Skills" (one-turn kill chains, DOT builds); early growth modules snowball runs. "Into the Breach meets Front Mission, only with permadeath pressure." Victory = permanent Command-Center perks; loss = restart with banked tech.

## D. Slay the Spire lessons (portable vs not)
- Anatomy: 3 acts × ~17 floors; branching paths; **reward after every fight**; relics as build-definers; 20-level Ascension (cumulative modifiers, loss doesn't reset); meta minimal by design (score/achievements).
- **Portable:** (1) 1-of-3 reward draft after every mission; (2) elites as opt-in risk/reward; (3) relics → hangar augments; (4) ascension ladder from the 3 difficulties; (5) branching map.
- **Not portable:** deckbuilding (no deck equivalent); 2.5h runs (too long for browser); combos must be spatial (adjacency, limb-targeting), not hand-based.

## E. Into the Breach model (non-roguelite replayability)
- Pilot travels back with XP (L1 at 25, L2 at 75); unlocked pilots permanently selectable; coins unlock squads; achievements grant conveniences. **"Not designed around massive advantages" — unlocks are options, not power.** Replayability = portable leveled asset + squad variety + score chase (perfect island 30k). Anti-pattern: "perfect island or restart" score distortion.

## F. Meta-progression: persist OPTIONS, never stats
- ItB/StS guardrail: **"player's skills and choices, not luck or grind, are the path to success."** Increase decision space; let decisions build on each other (synergies); "don't treat the early game as a warm-up" — missions 1–2 need real decisions.
- **Failure mode: grind-to-win** — persistent stats substitute for skill; players optimize the meta-shop instead of the tactics.

## G. Run variety (for 3 missions)
- Branching map w/ risk-reward; objective shuffle; enemy comp as counter engine; FTL node events; modifier/remix modes; proc-gen maps.
- Our budget: (1) pre-mission node choice w/ shown rewards/threats; (2) objective shuffle; (3) enemy comp counter-rotation; (4) ascension-lite modifier deck.

## H. Session length
- Lane runs are LONG (StS ~2.5h; ItB ~6h; Mech Armada ~7h54m) — **that's the gap**. Mobile median 3.1–3.5min sessions; PC ~18min (GameAnalytics 2026).
- **Target: 5–8 min/mission, 20–30 min/run**, autosave between missions. Pressure via wave timers, not instant-death (Mech Armada's fog lesson).

## Applied to Mecha Protocol (implement-immediately, this round)
1. **Post-mission 1-of-3 reward draft** ✅ — 5 rewards (Overclocked Servos +1 move, Coolant Flush +4 maxHeat, Targeting Computer +10 acc, Field Repairs +4 HP all limbs, Spare Battery +1 undo); run-scoped via `runBuffs` (reset each run); shown after victory before hangar; telemetry `game:reward:select:<id>`.
2. **Heat-as-bet** ✅ — hot mechs (70%+ heat) deal +1 AND take +1 (Ignited Steel model); mirrored in combat forecast (`+dmg 🔥` indicator); help glossary updated (EN+JA).
3. **Undo is now a resource** ✅ — `undosLeft` (1 + Spare Battery), replacing the boolean.
- **Deferred to vertical slice (backlog):** branching mission contracts (2 nodes per mission w/ reward-vs-threat), pilots w/ utility perks + XP, ascension-lite modifier ladder, perfect-mission score bonus.
- Verified: reward keys resolve, heat math (3/4/5), move buff 4→5. 1,673 lines, all syntax-clean.

## I. Sources
grimdarkmagazine.com (Mech Armada review) · store.steampowered.com/app/1389360 (Mech Armada) · howlongtobeat.com/game/97002 · store.steampowered.com/app/1550740 (Ignited Steel) · turnbasedlovers.com (Death Ring overview) · store.steampowered.com/app/3415580 (Death Ring) · anuflora.com (StS analysis) · slay-the-spire.fandom.com (Ascension) · gaming.stackexchange.com (ItB persistence) · gamefaqs.gamespot.com (ItB XP) · reddit.com/r/IntoTheBreach (scoring) · thom.ee (roguelike agency) · gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks
