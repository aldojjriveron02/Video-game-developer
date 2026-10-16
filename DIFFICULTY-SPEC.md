# Difficulty — Production Spec (Round 84)
**Status:** DEFERRED to production balance pass. Modes exist (Story/Normal/Hard); 4 assist toggles exist; intent ladder updated. This spec sets the numbers.

## Per-mode definition
- **Story** (onboarding/access): enemy damage ×0.75; −1 enemy per encounter (min 1); FULL intent telegraphs; overheat threshold +1 chevron; objective HP +50%. Target fail rate <10%.
- **Normal** (the intended game): all baseline; PARTIAL telegraphs (intents shown, target tiles hidden except bosses). Target first-clear win rate 60–75% (Round 94 — PvE "lose convincingly," NOT 50/50). Unlock/progression balanced here.
- **Hard** (mastery): enemy damage ×1.25; +1 enemy or one elite per encounter; NO telegraphs; heat builds 1.2×; flanking/focus-fire AI. Score ×1.5 + Hard-only medals (prestige, not content gates). Target fail rate 35%+.

## Global rules
- Difficulty changeable up/down mid-campaign (XCOM 2). Logged to telemetry.
- No mode locks endings, content, or achievements (Celeste/Hades).
- Assists: individually toggleable anytime, framed inclusively ("Pilot Assists tune the game to your needs"), never gate content, all usage telemetered.

## Banned (fake difficulty)
- HP/damage bloat as the ONLY Hard lever. Trial-and-error hidden spawns. Grind-gated upgrades (hangar = sidegrades). Failure that discards pilot progression.

## Fail-forward
- "Rewind Protocol": instant mission retry keeping pilot XP/unlocks/hangar (Celeste frictionless failure).
- Campaign = teaching staircase: M1 (move/attack/heat) → M2 (limb targeting) → M3 (full roster).

## Exit criteria (slice)
- Per-mode fail rates measured via telemetry; adjust counts/AI, never just stats.

## Round 106: No-stigma + Rewind charges (production difficulty pass)
**No-stigma rule (Celeste/Hades):**
- No save-file branding for assist users. No achievement lock. No Daily Sortie stigma.
- Language: "Tune the challenge to fit you." Never "cheating" or "easy."
- Story (not "Easy") — RE6's "Amateur (Story)" naming.

**Rewind Protocol charges (per tier):**
- Story: infinite (Fortune's Weave pattern)
- Normal: 3 charges (Divine Pulse pattern)
- Hard: 0–1 charges

**Always-on invisible DDA (never obvious):**
- Cap simultaneous attackers (Half-Life: ≤N per mech per round)
- Miss pity (XCOM:EU — small nudge after 2+ consecutive misses; displayed numbers stay honest)
- Deprioritize killing blows on crippled mechs off-screen

**Fake-difficulty bans:**
- No untelegraphed one-shot limb kills
- No pure HP inflation
- No obscured mechanics

## Round 118: Production difficulty spec (difficulty part 3)
**3-death assist prompt (Silent Hill f pattern):**
- After 3 consecutive deaths, PROMPT (don't force) to drop a tier or enable assists.
- Opt-in. Player finds the menu OR the game offers it. Never forced.
- Fiction-framed: "Pilot Assist" toggles, not "Easy Mode."

**Difficulty = config table (Half-Life skill.cfg pattern):**
- Each mode = JSON table: enemy HP/damage, repair economy, AI behavior unlocks.
- Numbers + economy + BEHAVIOR (e.g., flanking only on Hard).
- NOT stat bloat (Numerical Hard trap). Hard = smarter, not spongier.
- Cheap for solo dev: config, not new AI code.

**Invisible DDA (capped safety net):**
- Attacker cap (max N per player mech, 3v3 adapted).
- Miss-streak pity (uncapped, enemy hit rolls).
- Rank cooldowns (no yo-yo within mission).
- Hardest mode: DDA LOCKED OFF (RE4 Professional pattern).
- Disclosed in options ("how difficulty works"), not a badge of shame.

**Validation (telemetry + cohorts):**
- Per-encounter: deaths, turns, heat deaths, rewinds, quit points.
- 5-10 players, watch silently, tune to median/p90.
- Gate metrics: median 12-18 turns, p90 ≤2 rewinds.

**Banned (Fake Difficulty taxonomy):**
- TRUE hit chances (never fudge displayed odds).
- No Unstable Equilibrium (early choice bricking later).
- Checkpointing for mobile sessions (no Checkpoint Starvation).
- Difficulty from readable tactics, never hidden math.

## Round 132: Production difficulty spec (slice)
**Miss pity as bounded PRD (IMPLEMENTED in game.js):**
- Player-side only. +8% per consecutive miss. Hard guarantee on 6th attempt.
- Streak resets on hit. Never applies to enemies.

**One-directional DDA — HARD BAN:**
- DDA engages ONLY when player is failing. NEVER scales up on success.
- RE4's two-directional pattern (punish good play, punish continue) is BANNED.
- Rubber-banding BANNED. Assist/reward punishment BANNED. Lying odds BANNED.

**Assist framing (Celeste/Hades — already live):**
- "Tune the challenge to fit you. No punishment, no locked content — change anytime."
- 3-death prompt: optional, dismissible, re-offerable (Super Guide pattern).

**Validation:**
- Median/p90 per mission (right-skewed distributions; means lie).
- Death heatmaps on grid (free choke-point data).
- First-30-minutes smoothing. Long-tail: internal testers are the skilled minority.
- Peaks-and-valleys: M1/M2 valleys before M3 peak.

## Round 139: Production difficulty spec (slice)
**Failure ratchet (IMPLEMENTED in game.js):**
- Per-mission failure count (campaign.fails). Reset on success.
- Attempt 3+ (2 fails): enemy dmg −15% (0.85×).
- Attempt 4+ (3 fails): enemy dmg −25% (0.75×).
- Never raises. Never carries between missions. Unexploitable.
- Displayed intent threat numbers use the same multiplier (truthful).

**Miss pity (disclosed PRD):**
- Bounded PRD implemented (Round 132). Disclose in-game (XCOM lesson).

**Validation gates:**
- Median attempts-to-clear ≤3; p90 ≤6 (M3).
- No grid cell >40% of player-unit deaths (heatmap).
- High deaths + LOW abandonment = fine. High deaths + HIGH abandonment = spike.
- Balance maps (kills−deaths per cell) from self-play volume.

**Long-tail:** bottom-decile players ≥70% clear M3 with assists.

**NOT built:** rubber-banding; two-way DDA; hidden modifiers; number-tuning for teaching failures.

## Round 154: Validation + jam difficulty spec (slice)
**JAM DIFFICULTY: easy default (IMPLEMENTED in game.js).**
- JAM_BUILD = true → difficulty defaults to 'easy' (Story); harder one tap away.
- Rationale: raters play once, briefly (LD42: 1/3 <20 ratings); a wipe in M1 kills Fun.
- Hades/Celeste rule: easy path gates nothing, costs nothing. No assist stigma.

**Validation protocol:**
- Nielsen 5×3 per mission (5 players, fix, repeat). Each difficulty mode tested separately.
- KPIs: completion %; median + p90 attempts/mission; time-to-first-win;
  per-tile death heatmap (Halo 3 model); assist uptake %; abandonment point.
- Targets: M1 completion ~95%+; M3 beatable by first-time rater with assists.

**Jam rules:** M1 effectively unwinnable-to-lose (SMB 1-1 no-fail onboarding);
no hidden rubber-banding (intent telegraphs keep difficulty legible — Hunicke/Yabuki);
miss-pity + failure ratchet + 4 assists all stay in the jam build.
