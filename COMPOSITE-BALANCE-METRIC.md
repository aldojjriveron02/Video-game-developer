# Composite balance metric — spec v0.1
[EL-LOKO · 2026-10-15] Whole-system improvement loop, Round 6 Topic 3 (pro indie
build pipelines & automated balance testing 2026). Research-confirmed standard:
balance loss = |win-rate spread| + stalemate penalty (+ skill-tier disagreement),
one scalar a CI gate can threshold. Sources: RuleSmith (arXiv:2602.06232,
black-box balance objective); buildaloud Scout 2026-07-23 ("the bots'
disagreements are the signal").

## Status
SPEC ONLY — not wired into the Playtest Robot. Proposed as a Mecha-pipeline
ticket (Lab drafts, El Loko dispatches per the pipeline sync protocol; the loop
never self-assigns build-room work). Grounded on the REAL report fields the bot
already emits (verified against mh-11/baseline.json): `ladder[]`, `skillGap.gaps[]`,
`stalemateGate`, `anomalies[]`, `buildVersion`, `overallPass`.

## Definition
For one bot run, balance loss L (0 = perfectly balanced, higher = worse):

    L = w1 * WR_SPREAD  +  w2 * STALE  +  w3 * INVERSION  +  w4 * ANOM

- **WR_SPREAD** — mean over (player, tier) cells of
  (max agent winRate − min agent winRate), from `ladder[]`.
  Catches degenerate strategies and unwinnable matchups. Uses the existing
  agent set (random / greedy / smart); no new agents required.
- **STALE** — mean drawRate over `ladder[]`, plus 1.0 if `stalemateGate.pass`
  is false (keeps the existing hard gate authoritative).
- **INVERSION** — mean over `skillGap.gaps[]` of max(0, −gapSmartRandom) and
  max(0, −gapSmartGreedy). The buildaloud signal, oriented correctly: skill
  BEATING random is healthy expression, random beating smart means luck
  dominates (degenerate); greedy consistently beating smart means the game is
  solved. Only inversions penalize.
- **ANOM** — len(`anomalies[]`) / total checks in the run.

## Proposed weights and threshold (PROPOSAL — calibrate before gating)
w1 = 0.45, w2 = 0.25, w3 = 0.20, w4 = 0.10. PASS while L ≤ 0.25 (proposal).
Report L alongside the raw numbers in every ticket's baseline diff, per the
pipeline's report format (baseline diff + bot numbers). First calibration run:
compute L on the last 3 ticket reports; adjust weights/threshold so the metric
agrees with the human-readable verdicts — the metric must track judgment, not
replace it (the buildaloud "butter" caveat: a fine-scoring config was still
rejected by human feel).

## Power statement
This metric fails if it cannot move: a ticket that changes matchups but leaves L
unchanged is a dead metric — recalibrate or drop it. First-time passes are the
most suspicious: a ticket whose L passes on first run gets re-verified against
the raw ladder, not celebrated. (Pipeline hardening rules.)

## What this doesn't cover
Feel, pacing, readability, and the first-5-minutes experience — the bot ladder
decides numbers; human sign-off (small checklist on balance-ticket reviews:
boss pacing, hit feedback, onboarding pacing) stays separate and stays Aldo's.
