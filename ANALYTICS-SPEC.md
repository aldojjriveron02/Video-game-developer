# Analytics — Production Spec (Round 94)
**Status:** telemetry.js exists with first-launch consent. GameAnalytics keys = Aldo's item. This spec is the production target.

## Event taxonomy (minimal, each tied to a decision)
- `session:start` → retention:day_N cohorts
- `tutorial:step:*`, `tutorial:complete` → activation
- `mission:start`, `mission:complete`, `mission:fail` (+ mission_id, difficulty, turn_count) → funnel + balance
- `mech:deployed` (+ loadout hash) → dominant-build detection
- `bark:*` → verbosity effectiveness
- `assist:toggle` → which assists get used
- `hangar:visit` → engagement depth

## Rules
- ALL transmission gated behind first-launch consent. Local-only buffering pre-consent.
- No PII. Random hashed player ID. Aggregate ≥100 before reporting.
- Every event must answer a pre-written question. No vanity metrics.

## Balance targets (Brazie loop)
- Normal first-clear win rate: 60–75% (PvE "lose convincingly," NOT 50/50).
- Flag dominant builds by loadout frequency + win rate.
- Loop: identify via telemetry → paper fix → ship → validate.

## Funnel
- Store → install → tutorial complete → M1 complete (activation gate) → campaign complete → D1/D7/D30.
- Stretch benchmark: 40/20/10. Not a gate.

## Privacy
- Plain-language privacy note on itch/Steam page BEFORE launch.
- Undisclosed telemetry = negative reviews (r/IndieDev).
