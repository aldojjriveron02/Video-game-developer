# Tutorial Part 27 (Verification Round 8) — Findings (Round 334)
**Date:** Wed 2026-10-15 ~07:52 EDT · **Source:** live web research (amplitude, gameanalytics, crook, duolingo)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 8)

## A. Mechanics
- Event-taxonomy audit (Amplitude): "three elements — event names, event properties, naming conventions." "Object-Action framework (verb_noun)." "Context lives in properties rather than new event names; valid values enumerated."
- Funnel-definition audit (GameAnalytics): "funnels fit linear processes with ≥4 stages." "Keep simple (fewer steps = faster + more accurate)." "Use human-readable names; verify one-way traffic." Canonical: "Installed → Launched → Tutorial Started → Completed → Level 1 Started → Completed."
- Cohort-definition audit: "cohort = users sharing characteristic (typically start date)." "Is boundary unambiguous; are re-entries handled; reproducible from raw exports."

## B. Validation
- Data validation (Crook): "define clear event parameters, explicit triggers, monitor data flow in flight, verify accuracy before transmission." "Clean data → clean dashboards."
- Funnel QA (GameAnalytics): "confirm linearity, minimize steps, each step fires exactly once per user in one direction." "If a step can be skipped or repeated, model both paths explicitly or it lies."
- Cohort QA (Crook): "analyze behavioral differences across groups; QA cohort join — membership stable and mutually exclusive." "Save and re-run identical cohorts."

## C. Techniques
- Event naming (Amplitude): "Object-Action, verb_noun, consistent capitalization, actor perspective, properties carry context."
- Funnel visualization (GameAnalytics): "per-step conversion + retention bars make bottlenecks visible." "Keep onboarding funnel as first-class always-on dashboard."
- Cohort retention curves: "plot retention per start-date cohort; compare completer vs skipper to measure actual retention lift."
- Anomaly detection (PostHog; Crook): "alert when metric deviates from expected pattern." "Warning/critical thresholds on KPIs."

## D. What to avoid
- Vanity metrics (Amplitude): "put optics before rigor." "Raw 'tutorial started' counts without completion/drop-off context."
- Broken funnels (GameAnalytics): "non-linear, duplicated, or missing/skippable-but-unmodeled steps mislead." "Garbage in = garbage out."
- Cohort pollution: "loose membership criteria (mixing first-time with returning, test traffic in production)." "Segregate test traffic."
- Data overload (gamedesign.gg): "biggest mistake: tracking wrong things — most studios instrument everything." "Track tight, question-driven set."

## E. Shipped
- Clash Royale: "pure teach-by-playing — guided actions, reward per interaction, progress bar." "Every step is measurable action — each onboarding step doubles as analytics checkpoint." "Measure and optimize each step."
- Duolingo: "100s of A/B tests; every change with hypothesis written BEFORE running." "Onboarding decided by measured behavior, not opinion."
- Supercell: "onboarding funnels = standing priority tied to early retention, validated in soft launch against KPIs." "Tutorial as product with own funnel dashboard."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** event taxonomy. Tutorial events use consistent `tutorial:` namespace: `tutorial:start`, `tutorial:choice:veteran/new`, `tutorial:step:dismiss:<id>` (tutorial.js:61,64,114). Tight, question-driven (funnel steps + cohort splits), not "instrument everything." Skip path emits own event (funnel models both paths — GameAnalytics one-way rule satisfied).
- **TUTORIAL-SPEC.md:** verification round 8 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
amplitude · gameanalytics · crook · duolingo · clash royale · supercell
