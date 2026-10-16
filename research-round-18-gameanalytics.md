# GameAnalytics JS SDK Integration — Findings (Round 18)
**Date:** Tue 2026-10-13 ~21:34 EDT · **Source:** live web research 2026-10-13 (official docs, GitHub, privacy notice, pricing)
**Project:** Mecha Protocol — practical telemetry wiring for the prototype

## A. Setup steps
1. Account at gameanalytics.com (free tier: no card, no MAU limits) → create game → copy **Game Key + Secret Key** from game settings.
2. Include SDK — no npm needed: `<script src="https://unpkg.com/gameanalytics/dist/GameAnalytics.min.js"></script>` (53KB; 65KB with logging).
3. Init: `configureBuild("0.1.0")` → `initialize(GAME_KEY, SECRET_KEY)` → `startSession()`.
4. Pre-register enum lists (max 20 values each): `configureAvailableCustomDimensions01(["easy","normal","hard"])` + `setCustomDimension01("normal")` — the documented way to track difficulty as a filterable dimension.
5. GDPR toggle from day one: `setEnabledEventSubmission(false)`.

## B. Event design for this game
- Types: Business, Ad, Resource, **Progression** (mission start/fail/complete), **Design** (undos, quits, retries, picks, heat), **Error** (JS exceptions). Business/Ads unneeded; Resource only with an economy.
- Design format: `addDesignEvent("mission:complete:1", turnCount)` — 1–5 `:`-separated segments, ≤32 chars each; float value aggregated as SUM/MEAN. Convention: `[category]:[sub]:[outcome]`.
- **Limits:** 500 events/user/day; cardinality 15k design / 8k progression / 4k resource per day — over-limit events are STILL COLLECTED (excluded from AnalyticsIQ only, no penalty). **Dynamic data goes in the value field, never the ID** (no coords/user IDs in IDs). Custom dimensions do NOT attach to design/error events — difficulty via session-level dimension-01.
- Our schema: progression Start/Complete/Fail on ("mission","1"[,turns|seconds]); design: `combat:undo`, `mission:quit:1`, `combat:retry:1`, `hangar:weapon:select:Railgun`, `combat:heat:overload`, `game:difficulty:select:Hard`; error: `addErrorEvent(Warning, "Combat:NullTarget")`.

## C. Funnels
- **Progression Funnels** for mission completion (adds Complete/Start + Fail/Complete ratios); Standard Funnels mix event types. 6-step campaign funnel (M1 Start→Complete→M2→…→M3) or 2-step per mission for the tightest red-flag signal. "Any Order" default; Strict Order needs SegmentIQ (NOT free). Keep 2–6 steps.

## D. Free-tier limits
- Includes: dashboards, custom dashboards, design/custom events, offline events, live events, funnels, realtime, explore, cohorts, retention, matrix, health (errors/FPS/memory), AI agent (daily quotas).
- NOT included: distributions, hourly granularity, sharing, SegmentIQ (A/B, remote config, segments), PipelineIQ (data export, BigQuery, Metrics API). $29/mo tier; PipelineIQ from $499/mo.
- **Retention: design events fully available 1 month only** (then unavailable); error stack traces 1 month. → Export/screenshot red-flag data monthly.

## E. Privacy and consent
- GA (Denmark, UK ICO): collects persistent device identifiers automatically. SOC 2 II, ISO 27001, ePrivacy, KidSafe+ (COPPA).
- SDK: `setEnabledEventSubmission(false)`; dashboard: collect-all / session-only / disable / 4 wildcard filters. External user IDs optional, hidden from AnalyticsIQ UI.
- **Practical:** GA forces no banner, but EU needs a lawful basis → check `navigator.doNotTrack` (treat "1" as opt-out) + first-launch consent toggle. Anonymous by default: no user IDs/emails in event IDs. DNT not honored natively [unverified] — wire manually.

## F. Performance and reliability
- 53KB; local DB queue, **one batched submit per 8s max**; offline queuing; `endSession()` flushes — call on pagehide so the final event isn't stranded. Silent by design; debug logs OFF in production.
- **Never-crash pattern:** async/defer script load + guard wrapper (`const GA = window.gameanalytics ? ... : null; try/catch` around every call). SDK never returns data to the game loop → can't corrupt gameplay. Verify via Realtime dashboard.

## G. Alternatives check → recommendation: GameAnalytics free tier
- Pays off exactly where a solo dev can't DIY in an afternoon: funnels, retention cohorts, realtime, difficulty-dimension breakdowns — zero backend.
- Custom beacon: trivial to SEND, but you own storage/querying/charts; funnels are the expensive part. Only wins for zero-third-party posture or raw streams (not in GA free tier anyway).
- Plausible/Umami: page-centric, lack game semantics (progression states, per-mission funnels).
- **Verdict: GA free tier.** Less work than custom; limits don't bite at prototype scale.

## Applied to Mecha Protocol (implement-immediately, this round)
- New `js/telemetry.js`: guard-wrapped module (game runs identically with zero telemetry if SDK/keys absent); DNT respect; difficulty as custom dimension 01; schema from §B; `endSession()` on pagehide; `window.onerror` → error events.
- Hooks in game.js: mission start/complete/fail (+turns, +duration), undo, retry, hangar weapon/armor picks, heat overloads, difficulty select.
- **Keys:** `GA_GAME_KEY` / `GA_SECRET_KEY` constants at top of telemetry.js — Aldo pastes from GameAnalytics dashboard → game settings. Until then: silent, game unaffected. Consent toggle UI queued as pre-EU-launch task (BUILD-PLAN).

## H. Sources
docs.gameanalytics.com (JS SDK setup, event tracking, SDK features, design events, cardinality limits, data retention, funnels, event collection settings, external user ID) · github.com/GameAnalytics/GA-SDK-JAVASCRIPT (README, unpkg CDN, MIT) · gameanalytics.com/trust/privacy-notice · gameanalytics.com/pricing
Research-only; nothing changed/signed/purchased. Pricing-page cookie banner rejected.
