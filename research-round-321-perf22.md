# Perf Part 22 (Verification Round 7) — Findings (Round 321)
**Date:** Wed 2026-10-15 ~07:01 EDT · **Source:** live web research (yosoygames, cod mobile, filament, pcloudy)
**Project:** Mecha Protocol — perf (pre-jam; verification round 7)

## A. Mechanics
- Regression audit (Bugnet): "run a fixed benchmark scene in CI on every build, measure percentile frame times (not averages), and alert on deviation from a baseline budget." "Benchmark scenes must be deterministic; use percentile budgets + deviation gates because single-run thresholds are flaky; chart over time."
- Device-tier audit (Pcloudy; Filament): "define 2–3 hardware tiers and test on the weakest as the floor." "Simulators give inaccurate numbers since they proxy desktop-class resources." "Tag every metric with device model, OS, GPU, app version."
- Battery audit (Pcloudy): "does the app deserve to stay installed?" "Fully charge, run 15–30 min foreground + 1–3h background/idle." "Well-optimized: ≤1%/hour idle; >2%/hour needs investigation." "Simulators underestimate drain by 30–50% — real devices only."

## B. Validation
- Automated perf tests (Bugnet; Unity): benchmark scene + percentile budgets + deviation gates in CI.
- CI gates (web.dev/Lighthouse CI): "run N runs and take the median; set assertion levels — warn, error (build fails) — post as status checks on every PR."
- RUM (various.cloud): "captures what players actually experience." Minimum: FPS, frame-time percentiles, memory, CPU, GC pauses, battery — tagged by device/version. "Instrument early and cheap."

## C. Techniques
- Perf budgets in CI (web.dev): "a budget is a limit on metrics affecting performance." "20%-rule: users notice changes ≥20%, so set budgets at least 20% better." "Enforce throughout the project and incorporate into the build process."
- Adaptive quality (COD Mobile/Samsung): "per-frame bottleneck detection (CPU/GPU/frame-rate bound) plus temperature-trend analysis, staged Normal → NearThrottling → CloseThrottling." "CPU/GPU cores are least efficient at max clocks — proactively capping avoids the thermal-throttling death spiral." Result: "+7% FPS, −2°C avg."
- Background throttling (Playgama/MDN): "listen for visibilitychange, toggle a single isPaused flag that stops update loop, physics, timers, audio. On resume, reset delta-time FIRST."
- Honest metrics (Yosoygames): "You're calculating framerate percentiles wrong! The standard method measures frames, not time." "Correct: weight each sample by its duration (percentiles over time, not frame count)."

## D. What to avoid
- Perf regressions by omission: "measuring once per release; single-run assertions (flaky); relying on OS default thermal solution."
- Untested low-end: "testing only on flagship; trusting simulators."
- Battery drain: "relying on simulators, foreground-only testing, treating battery as generic perf bugs." Root causes: "unreleased wake locks, background timers, high-accuracy sensors, poor caching."
- Vanity metrics: "average FPS and naive percentiles hide spikes." "Absolute numbers instead of build-over-build deltas."

## E. Shipped
- COD Mobile: "attacked heat BEFORE the OS throttled, kept clocks in efficient range." "+7% avg FPS, far more stable, −2°C/−3°C." "Closest analogue to our 3-signal governor + render-scale ladder."
- Filament Games (HTML5): "real OOM budget was 275MB (not assumed 512MB)." "Per-frame object-creation budgets." "The budget number must come from measurement, not assumptions."

## Implemented this round
- **REAL BUG FIXED — time-weighted p95 (perf.js):** our p95 used the naive method (95th frame by count) — Yosoygames proved this hides rare-but-long frames. Example: 98 frames at 16ms + 2 at 100ms → naive p95 = 16ms ("all good"), but those 2 frames are 11.3% of total TIME. Fixed to time-weighted: sort by frame time, find where cumulative duration hits 95% of total. Verified: naive=16ms (hides), time-weighted=100ms (catches). The governor now correctly detects thermal throttling/jank. +6 → **4,565 lines** (+6).
- **VERIFIED (code read):** background throttling. visibilitychange → hiddenPause flag (game.js:274-275); clock reset on resume (game.js:276). Playgama/MDN pattern correct.
- **PERF-SPEC.md:** verification round 7 (below). **4,565 lines** (+6).

## F. Sources
yosoygames · cod mobile · filament · pcloudy · bugnet · web.dev
