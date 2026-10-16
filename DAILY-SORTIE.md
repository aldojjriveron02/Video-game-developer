# Mecha Protocol — Daily Sortie Spec (Round 50)
**Status:** spec + seed infrastructure built — full mode is vertical-slice scope
**Retention backbone:** local day-streak + day-N tracking (Round 44) — already live

## The sortie
One sortie per UTC day. Same seed + same modifiers for every player worldwide.
Up to 3 attempts per day; BEST score counts (Round 91 — tactics missions are long, Spelunky's 1-attempt harshness doesn't fit).
replays are watermarked "practice" (StS/OlliOlli hybrid — honor system, no server).

## Seed scheme
- `seed = FNV-1a(SORTIE_SECRET + '|' + 'YYYY-MM-DD' UTC)` → xorshift32 stream
- Seeded ONCE per sortie; EVERY gameplay random (map, spawns, hit/crit, AI, loot, rewards) draws from that one stream
- Cosmetic randomness (particles, barks, sfx) stays on Math.random
- UTC day boundaries; device-clock-rollback detection (freeze daily if clock moves backward vs stored time)
- Implemented: js/rng.js (xorshift32, FNV-1a, utcDay, dailySeed, stream, selfTest) — verified deterministic cross-instance

## Modifier pool (~8, 3 drawn deterministically per day)
1. **Supply Shortage** (red): −2 deployment points
2. **Overclocked Salvage** (green): double salvage, enemies +10% HP
3. **Fog of War** (red): enemy intent hidden until adjacent
4. **Ace Pilot** (green): one mech +1 move, +1 attack
5. **Minefield** (red): hazard tiles damage both sides
6. **Time Trial** (neutral): score bonus for finishing under par turns
7. **Draft Hangar** (green): build today's squad from a seeded 12-unit pool (the Draft agency hit)
8. **Elite Patrol** (red/green): more elites, better rewards
- Veto matrix: never two economy-breakers or two run-enders together (slice tooling)
- **Net-non-negative rule (Round 70):** every daily roll must be net-neutral-or-better — never stack pure-negative modifiers. A "suffering day" breaks the streak loop. At least one green/neutral in every draw.
- **Off-seed RNG audit (Round 70):** anything not derivable from the daily seed is neutralized in Sortie mode (Spelunky's locked gambling wheel) — bark triggers, cosmetic rolls, and any gameplay-touching randomness must derive from the seed stream or be locked out.

## Scoring (published in-game — fixed table)
- Mission complete: 100 · each turn under par: +10 · each surviving mech: +25
- No mech lost: +50 · optional objective: +30 · VEX defeated: +150
- **Story bonuses (Round 70 — the screenshotables):** PERFECT SORTIE (no limb lost): +75 · LAST STAND (win with 1 mech standing): +60 · OVERKILL (destroy 3 enemies in one turn): +40
- Theoretical max published → score-validity caps; per-day UTC rollover
- **Replay receipt (Round 70):** every Sortie score ships with seed + compact input log: `[MechaProtocol Sortie 10/14] ⬛🟩🟥 score 12,450 | seed 20261014 | r:8f3a…` — paste into the verifier to re-simulate. The receipt IS the anti-cheat; itch comments/Discord are the leaderboard; past-day runs labeled "Past".

## Leaderboard ($0)
- Phase 1 (slice): local daily best + all-time daily bests + copyable **Sortie Report** text block (date, seed hash, modifier icons, per-mission glyphs, score) — Wordle-grid spirit, for Discord/X
- Phase 2 (later): Cloudflare Worker + D1 free tier with plausibility checks (score ≤ theoretical max, 1 submission/account/day, duration sanity). NO unvalidated global board — an honor-system board gets cheated and becomes a trust liability.

## Streak kindness
- Weekly **Sortie Pass**: preserves streak through one missed day (Duolingo Streak Freeze: +0.38%)
- 7-day rolling archive of past sorties as practice — a missed day is never lost content
- Protect days 1–7 of new streaks (the 2→3-day "50% increase" effect)
- **Day-3 celebration (Round 70):** the most generous Sortie reward/animation lands on day 3 — early streaks are the leverage point
- **Cosmetic-only rewards (Round 70):** all Sortie rewards are prestige (pilot callsigns, hangar decals) — never gate progression or exclusive content behind unrepeatable days (Elusive-Targets FOMO backlash)

## Anti-exploit stance
- UTC boundaries + clock-rollback freeze · autosave per action (save-scumming = replay from scratch) · theoretical-max score caps · plain-language honor-system statement on local boards

## Slice vs later
- **Slice:** deterministic daily seed + modifier pool + scoring table + 3-attempts-best-score rule + local best + share-code report + streak/pass integration (Caveblazers: weekend-scale once RNG is deterministic)
- **Later:** server board + validation, archive UI, veto-matrix tooling, weekly debrief stats
- **Gate:** sortie unlocks after finishing the 3-mission campaign once (StS mastery-gate logic) — or M1 minimum, tuned after playtests

## Determinism audit (slice work — js/rng.js header)
- MUST seed: combat rolls (game.js — currently Date.now()!), AI (ai.js — turn+mech seeded, not run-seeded), reward draft (game.js — currently Math.random)
- MAY stay random: barks, particles, sfx

## Live-ops plan (Round 61 — the Sortie IS the live-ops program; refined Round 77)
- **Cadence (1-2-6):** hotfix week 1; QoL/balance patches ~monthly (telemetry-driven); one content beat every 4–6 months. No battle pass, no promises a solo dev can't keep.
- **Seasons = free themed beats (DRG model, Round 77):** each beat is ONE headline system (Cult of the Lamb) — never expires, explicitly anti-FOMO. All rewards cosmetic.
- **Systems-driven, never hand-built:** weekly rotating modifiers (heat-wave week, limb-targeting bonus week — config-only, zero new art); weekly Sortie rewards claimable once per week (DRG Deep Dive); seasonal palette reskins (reusable kits, near-zero year-2 cost); community votes on next archetype (the vote is engagement content).
- **Community events ($0):** mission-design contests via Discord, "Commander of the Month" spotlight, hangar paint schemes as prizes. Player-made content; dev curates.
- **Year one:** M1 stabilize → M2–3 QoL pack → M4–6 Beat 1 (6th archetype + 1 mission + weekly modifiers) → M7–12 Beat 2 + Steam port consideration + holiday event.
- **Free updates only** (Stardew/StS model); paid-DLC math doesn't close at $0. If monetization ever comes: cosmetic supporter pack, never paywalled missions.
- **Sunset (write on day one):** 90 days' notice; self-contained archive build players can host anywhere; final update as celebration (all seeds unlocked, Dead Cells farewell model). A clean sunset protects the next game's reputation.

## Round 91: Seasons as anti-FOMO Operations (DRG model)
- 8–10 week Operations: themed modifiers + cosmetic unlocks (decals, paint, bark packs) + 1 community tournament.
- Passes NEVER expire; old Operations selectable anytime; leftovers enter general pool after season.
- No expiring currencies, no stamina, no paid pass, no daily-login compulsion.
- 2026 market: absence of FOMO is a feature (LevelCap).

## Round 104: Anti-FOMO marketing copy (LevelCap 2026)
**Steam/itch description line:** "No stamina. No paid pass. Nothing expires. Play when you want."
**Pass screen promise (DRG-style):** "Missed rewards are never lost — unclaimed Operation rewards recycle into the Quartermaster pool when the Operation ends."
**Why:** the absence of FOMO is a feature worth marketing (2026). Cheapest trust-builder for a solo-dev tactics game.

## Round 116: Production live-ops spec (live-ops part 4)
**Season = "Service Record" pass (DRG pattern):**
- 6-month seasons, 100 ranks, fixed XP from normal play + Sortie bonus.
- FREE. No paid tier. No monetization.
- Old season tracks stay ACTIVATABLE forever (anti-FOMO).
- One season = one enemy variant + one modifier set + one frame set (solo-dev cost).

**Daily Sortie spec:**
- Shared seed for all players. Same squad preset + same modifiers.
- One scored attempt/day (score = turns − limbs lost + enemies destroyed).
- Misses cost NOTHING. Backlog sorties (max 7, Nightwave catch-up).
- Local leaderboard + weekly aggregates.

**Major Orders (bi-weekly):**
- Community goals (e.g., "50,000 sorties destroyed this week").
- Pay non-expiring hangar currency. Permanent unlocks (not expiring trinkets).

**Intermission pattern:**
- Between seasons: "Archive Sortie" months (recycle old modifiers, zero new assets).
- Buys 8-10 week build windows (Gate Zero time-box).

**Hard gates:**
- NO stamina/energy. NO paid pass. NO expiring rewards. NO power from seasonal grind.
- Anti-FOMO copy on season screen (not just DAILY-SORTIE.md).
