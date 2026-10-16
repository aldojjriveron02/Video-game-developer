
## Round 162: Jam perf budget + validation spec (slice)
**JAM PERF BUDGET (LD60 build):**
- 60fps on iPhone 17 (target); 30fps floor on low-class hardware (budget Adreno,
  4-yr-old devices — intentional drop via battery-saver, never stutter).
- Frame: 16.7ms total — JS logic ≤8ms, render ≤8ms.
- Load: first paint / playable hangar ≤3s on throttled 4G; initial ≤5MB; total ≤20MB.
- DPR policy: cap 2 desktop/high-end; DPR 1 on iOS + low-memory Android (CrazyGames).

**LOAF OBSERVER (IMPLEMENTED in perf.js):**
- Long Animation Frames API (Chrome 123+); >50ms frames → telemetry (perf:longframe).
- Dev-only (?perf=1); feature-detected; buffered.

**VALIDATION:**
- Frame-time histograms + p99 (existing ring buffer); LoAF jank log (new).
- 15-20min thermal soak on M3 scorched arena (fps + thermal state).
- Device matrix: iPhone 17 + quad-core-Adreno Android + 4-yr-old phone.
- Chrome CPU throttling to simulate low class in the lab.

**TRAPS:** GC churn (per-limb loop, AI scoring, particle spawn — preallocate);
overdraw (M3 scorched + particles); uncompressed assets; shadowBlur/float coords;
audio preload before gesture; external requests (portals iframe you).

## Round 172: Jam perf + validation spec (slice)
**JAM PERF DECISION: change nothing structural.**
- Vanilla JS + synth audio + programmatic visuals already beat instant-play norms.
- Keep telemetry ON for the jam (cheap by design). Keep battery saver (thermal guard).

**LONGTASK FALLBACK (IMPLEMENTED in perf.js):**
- longtask PerformanceObserver as secondary jank signal — Safari doesn't support
  LoAF (Chromium-only), but longtask works there. Closes the iPhone blind spot.

**VALIDATION (pre-jam):**
- 30+ min soak test (M3 duel, auto mode) — watch heap + longframe accumulation.
- 4x CPU-throttle playthrough (judges' weak laptops) — 10ms/frame budget check.
- One real Safari pass (LoAF silent there; longtask + Perf.time carry the load).
- itch.io deploy: ZIP ≤1,000 files, relative paths, index.html at root,
  Mobile Friendly embed, audio resume on Click-to-Play gesture.

**TRAPS:** GC pressure in loop; layout thrash; overdraw/fill-rate; shadowBlur;
premature optimization (profile first).

## Round 181: Jam perf decision (slice)
**JAM PERF DECISION: adopt the ~10-12ms practical JS budget** (Sadil), not the
full 16.7ms — the browser keeps the rest. Turn-based tactics: 60fps applies to
juice/animation, not the sim. Nothing architectural left; work is measurement.

**IMPLEMENTED — tighter budget (perf.js):**
- Over-budget threshold: 16.7ms → 12ms (HUD + governor react to real budget).

**JAM PERF WORK (pre-jam):**
- Park rAF when no juice active (battery win); tie juice guard to frame time.
- Pre-render mech limb states to offscreen canvases at load.
- Zero-allocation frame path (pool particles/projectiles/floaters).
- Profile M3 duel on real iPhone 17 (Safari Web Inspector); mobile is 5-10× slower.
- Cap canvas DPR at 2.

**TRAPS:** layout thrashing; UI overdraw; per-frame text; shadowBlur; GC pauses;
desktop numbers lying about mobile.

## Round 190: Final perf decision (slice)
**FINAL PERF DECISION: BUDGET-HOLDING.** 12ms stays. HUD is a tripwire, not a
project. No new optimization unless HUD breaches in M3.

**IMPLEMENTED — particle pool (Playgama/Abratabia pattern):**
- 300 preallocated objects; reuse via freelist; zero per-spawn allocation.
- Dead particles returned to pool (not dropped). Prevents GC hitches.

**PRE-JAM VALIDATION:**
- Calibrate low-tier DevTools CPU preset; run M3 at 20x slowdown.
- Fix top 1-2 offenders only if 12ms breached (Wayline triage).
- Real budget Android once if obtainable (thermal throttling).

**GUARDS:** Juice stays frozen (stylistic simplification if breach, never removal).
No viewport culling (fixed grid; infinitecanvas warns of overhead). No shadowBlur.

## Round 199: Final perf sign-off (slice)
**FINAL PERF DECISION: BUDGET-HOLDING — YES.** 12ms avg, 28% headroom under 16.7ms.

**IMPLEMENTED — pool hardening (NixieFX):**
- Prewarm 300 particles at boot (no first-burst GC hitch).
- Exhausted behavior: drop newest (skip), never allocate.

**AUDIT (verified):**
- DPR cap 2 (biggest mobile win). alpha:false on terrain layer.
- No shadowBlur/per-frame-text in hot paths (MDN).

**JAM PERF GATE (baked in):**
- Hard ceiling: 16.7ms. Internal target: 10ms/frame.
- P95 < 16.7ms on cooled iPhone Safari after 5-min soak.
- Thermal soak: 5-min M3 duel, cooled device, LPM off, watch after 30s throttle.
- Freeze features 6h before deadline; Losh profiler hour + test butler deploy.

## Round 208: Final perf confirmation (slice)
**FINAL PERF DECISION: BUDGET-HOLDING — CONFIRMED (code side).**
Re-measurement on 3 signals + thermal soak remain (real-device tasks).

**AUDIT — emergency governors (verified in code):**
- DPR cap ≤2 ✓. Particle cap 300→50 ✓. Render scale 2→1 ✓.
- Hysteresis: 3× hot to step down, 10× cool to step up ✓.
- Low Power Mode detection → battery-saver ✓.

**AUDIT — zero-alloc hot loop:**
- Render path: dirty-flag only (no per-frame redraw).
- .map/.forEach confined to UI setup, never hot loop.
- Pools prewarmed (Round 199). Hit-stop cap bounds bursts.

**SUBMISSION CHECKLIST:** <100KB Brotli; <10s Fast-3G; itch iframe at budget;
JAM_BUILD verified; freeze ≥24h before; note LPM on itch page.

## Round 216: 120Hz + thermal validation (slice)
**PERF STATUS: BUDGET-HOLDING — CONFIRMED (code-side). Provisional until device gates.**

**120Hz VERIFICATION (iPhone 17 ProMotion):**
- Loop uses variable dt (not fixed steps) — inherently rate-independent.
- No 16.7ms/60Hz assumptions in code. No frame-count timers.
- dt clamped: raw ≤100ms (spiral of death), sim ≤50ms.
- Result: 120Hz-safe. Smaller dt = smoother, not faster.

**3-SIGNAL RE-MEASURE (pending, Safari fallback):**
- Frame time: rAF deltas, p50/p95/p99 (perf HUD).
- Long tasks: frames >50ms as surrogate (Safari lacks longtask API).
- Memory: iOS tab reload = OOM failure signal.
- Target: floor device (budget phone), not just iPhone 17.

**THERMAL SOAK PROTOCOL (pending):**
- 20-min continuous M3 duel, iPhone 17, room temp, case off, unplugged.
- Log every rAF delta via performance.now(). Plot time series.
- Budget for SUSTAINED (55-70% peak). Pass = no reload, no slope after settle.

## Round 225: Pre-jam freeze (slice)
**PERF FREEZE: theme-lock +24h (Sat Oct 17 6PM).**
After: re-measure only. No renderer/pool/audio-graph/DPR/timestep changes.

**VERIFIED (code):**
- dt clamped 0.05s (tighter than Gaffer 0.25s). Spiral-of-death safe.
- Perf HUD defaults OFF (dormant in JAM_BUILD).

**FREEZE BATTERY (on FINAL JAM_BUILD, iPhone 17 Safari):**
- 3-signal re-measure + 20-min thermal soak (record as locked baseline).
- DPR ~2, alpha:false, integer coords, no per-frame text/shadowBlur.
- Zero steady-state allocation in hot loop.
- Pool prewarmed + hard cap + free-list (never grows under M3 load).
- Audio unlock + ducking + locked mix on iOS.

**SUBMISSION:** butler deploy early, warmup build, done 2h before deadline.

**TRAP WATCH:** no new visuals after freeze (theme adapters only);
no render-target/DPR changes; no per-event audio nodes;
regression → revert to locked baseline, not optimize forward.

## 3-SIGNAL RE-MEASURE PROTOCOL (Round 231 — Wed 2026-10-14 ~22:35 EDT)
Formalized from research synthesis (no single canonical source — Android A/B discipline + Sukin + Lewis):
- Signal 1 — median: p50 frame time / average FPS.
- Signal 2 — tail jank: p95/p99 frame time, % frames missing vsync, long-task count.
- Signal 3 — thermal: late-session vs early-session frame times and CPU load.
An optimization ships ONLY if all three improve or hold. Median can look fine while the tail ruins feel; early numbers hide thermal reality.
Implementation: perf.js ring buffer already records p50/p95/p99, % over budget, per-layer draw timings, LoAF + longtask (Safari) — the rig is built. Gate = written sign-off on all three, not "feels fine."

## THERMAL SOAK PROCEDURE (pre-freeze)
- 30-min soak on real iPhone 17: scripted worst case (max units, max particles, rapid AI turns).
- Log fps, median/p99, JS heap in 5-min buckets. Diff first-5 vs last-5: any drift = root-cause before freeze.
- Repeat once with iOS Low Power Mode ON.
- Catches the 20-min jank: memory sawtooth (leak), frame drift (thermal/accumulation), longtask counts second half.

## ALLOCATION-SWEEP CHECKLIST
- Zero allocations per frame in update/render: typed arrays for particles/grids, reused vectors, no per-frame string building.
- HUD text ≤10Hz with cached strings; transform/opacity-only HUD animation.
- Pools sized so worst case fits 16.6ms; drop overflow spawns silently (Nystrom).
- No per-frame shadowBlur — pre-rendered glow sprites.
- Protects the dt=0.05s clamp from ever engaging.

## JAM-DAY PERF CHECKLIST
- Perf HUD dormant in JAM_BUILD, available on URL flag (fps, ms, p95, long tasks, draw calls, pool use).
- visibilitychange → cancelAnimationFrame + release Wake Lock + suspend AudioContext (timestamp reset on resume).
- Canvas DPR capped at 2 on mobile; debounced resize; audio latencyHint:"playback".
- Freeze gate: one recorded pass on iPhone 17 Safari AND one budget Android, 3-signal log attached.

## JAM-DAY PERF VERIFICATION CHECKLIST (Round 240 — Wed 2026-10-14 ~23:25 EDT)
1. Same-scene 3-signal on weakest phone: 3 canonical scenes (menu, mid battle, worst-case), median/p95/p99 + % over budget from ring buffer, diff vs last green build. Gate on the phone, never the laptop. (CrossCode method.)
2. Thermal soak: 15–20 min worst-case scripted battle, 5-min buckets, governor ON, with AND without Low Power Mode. Pass: last-bucket p95 <20ms, governor never oscillates. Cold numbers ≠ sign-off.
3. Allocation sweep: DevTools allocation timeline during heavy combat — zero per-frame allocations in hot loop.
4. Input latency: synthetic tap → rAF response ≤50–70ms on target phone (RAIL). Re-run after any input-path change.
5. 24h freeze discipline: numeric tweaks only (DPR cap, particle counts, governor thresholds, culling radii), each followed by same-scene re-measure. ?perf=1 flag still toggles (anti-bit-rot). visibilitychange cancels rAF + suspends audio + flushes telemetry. DPR cap confirmed by backing-store readback on high-DPR phone. Behavior/timing changes → post-jam.

## FINAL-FREEZE PROTOCOL (Round 249 — Wed 2026-10-15 ~00:15 EDT)
1. Same-scene 3-signal, governor ARMED, weakest phone: busiest tactical scene (particles near cap), ?perf=1 on, p50/p95/p99 before + after EVERY change. No change ships without the pair. (Glaiel: never trial-and-error on your own machine.)
2. Thermal soak 15–20 min, BOTH power modes: sign off on soak-END numbers. Watch p95 cross 20ms as heat builds; governor must produce STABLE degraded frames, not oscillation ("uneven framerate is worse than slow"). Cold p95 ≠ sign-off.
3. Allocation sweep last gate: zero per-frame allocation, flat p99. p99 spikes with flat p50 = GC — fix the allocation, not the budget.
4. Weakest-phone audit: tap-to-visible-response ≤100ms (RAIL); canvas backing-store readback (renderScale:2 fill-rate cost); tab-away/back + scene-load (no dt catch-up spiral; 0.05 clamp bounds it).
5. 24h freeze: NUMBERS ONLY (caps, thresholds), each with before/after 3-signal. No loop-structure changes, no timing edits (Glaiel's speedrunner lesson: timing tweaks are behavioral). ?perf=1 ON for every run until submission. "Whatever you don't gate on becomes the launch story" — the weakest phone is the gate.

## FINAL FREEZE (Round 258 — Wed 2026-10-15 ~01:13 EDT)
- Governor verification (?perf=1 on the RATER device, not desktop): worst-case spike scene, confirm it engages below budget, recovers after, no oscillation. Two-trace graph now in HUD: p50/p95/p99 frame time + scale-over-time trace (`scale 1.25x | gov: 2→2→1.5→1.25`). (Fuller DRS protocol.)
- 3-signal re-measure on frozen build: (a) frame-time distribution p50/p95/p99; (b) GC/alloc churn — zero per-frame allocations during spike, full pool hit-rate; (c) thermal drift — minutes 20–30 vs first 5. All three pass = frozen.
- Thermal soak: 20–30 min sustained worst-case on physical device. No sustained back-half regression. A clean 2-minute run is NOT a soak.
- visibilitychange check: hide tab mid-spike (loop self-terminates, autosave fires), restore — no time-step jump, no frame-time spike on return.
- Then freeze HARD. Post-freeze change = full protocol restart (before/during/after per Unity). The freeze is the last measurement, not the first. The rater's device is the only benchmark (Arkham Knight lesson).

## FINAL FREEZE (Round 267 — Wed 2026-10-15 ~02:19 EDT)
- Fuller's debug pair complete: (a) gov scale-over-time trace (Round 258), (b) resolution stress mode `?perf=stress` — cycles the governor every frame to expose resize/shader/sync issues (Round 267). Debug-only.
- 3-signal re-measure: 3 repeat runs, fresh page load each, run 1 = cold (discard/flag). Ship the freeze only if all three agree — separates real regressions from JIT/thermal noise. (Android; Digital Foundry.)
- Governor run (Fuller's protocol): sustained hot → 3-hot step-down engages BEFORE any frame drop; sustained cool → step-up reclaims within 10-cool windows. Read the trace for Fuller's two non-obvious failures: dropping too far, recovering too slowly. Adjust thresholds only from the trace.
- Thermal soak: 30–60 min worst-case loop on min-spec device; watch p99 + governor floor in last 15 min vs first 5. Throttling pinning the floor with drops = ship-blocker. Confirm autosave-on-hide mid-soak.
- Freeze hard and tag the build. Post-freeze: crash fixes only, each re-running the full governor verification. No "tiny" tuning commits. (Bloomsbury.)
- The rater's device is the only benchmark. Min-spec verification skipped = launch catastrophe. (Cyberpunk lesson.)

## VERIFICATION ROUND 2 (Round 276 — Wed 2026-10-15 ~03:25 EDT)
- Bottleneck signal (js/perf.js): the ?perf=1 HUD now shows OK / CPU / FILL?. Fuller's rule: DRS must read the right bottleneck signal or it degrades the wrong thing. CPU-bound → resolution scaling won't help much; FILL? → DPR step-down is the answer.
- Gauntlet spec: (a) ?perf=1 — p50/p95/p99 + bottleneck over scripted worst-case, min-spec device; (b) ?perf=stress — pool-exhaustion, max-entity frames, forced DPR swings, verify no oscillation; (c) DPR-cap check under stress — 1.25 cap holds where full DPR collapses.
- Soak spec: ≥30 min, heaviest scene, min-spec device, log percentiles + temperature (or governor state + p99 as thermal proxy). Pass = post-knee p95/p99 within budget, governor stable.
- Metrics discipline: freeze criteria in p50/p95/p99 ONLY — never averages. (Hole-in-my-Head; Digital Foundry.)
- Freeze = hard gate (Cities: Skylines II lesson). Post-freeze change to render/pool/governor/DPR paths = re-run the full triad before a new tag.

## VERIFICATION ROUND 3 (Round 285 — Wed 2026-10-15 ~04:42 EDT)
- Panic mode (js/perf.js, Fuller): p95 > 33ms (2 frames) on one eval = presentation latency exhausted → jump straight to max degradation (level 4). Recover gradually through the normal cool path (10 evals/step). Dead band prevents sawtooth. Telemetry: `perf:gov:panic`. Verified functionally (1→4 immediate; gradual 2→3 hot; gradual 4→3 cool).
- Gauntlet order (Fuller): cold boot → ?perf=1 scripted scene (p50/p95/p99 + drops) → ?perf=stress (incl. below-floor dips) → 10–15min soak (scale-over-time trace = temperature proxy) → hostile states (spike, oscillation, thermal recovery). Skip a leg = invalid run.
- Bottleneck-aware re-measure: every change re-captures OK/CPU/FILL attribution before AND after on the same scripted scene, same device, thermally rested. Accept only changes that move p95 or p99. Average-improving-but-p99-flat = rejected. (Fuller; Bugnet.)
- Freeze = hard gate (Wayline; Fuller). Evidence per run: p50/p95/p99, dropped frames, scale-over-time trace, device identity, build hash. No average FPS, no desktop-only numbers. (Bugnet: "Average frame rate is a lie." Cyberpunk: the cautionary tale.)
- Thermal recovery (Android ADPF): after the soak pushes scale down, settle at SUSTAINABLE not full. Drop below sustainable to dissipate, re-approach sustainable.

## VERIFICATION ROUND 4 (Round 294 — Wed 2026-10-15 ~05:17 EDT)
- Verified (code read): panic honors the Unreal "Over Budget Panic" audit — all three criteria. (1) Fires on real spike (p95 > 33ms, one eval). (2) Floor honored (level 4 max, no runaway). (3) Recovery gradual, no oscillation (10 evals/step + dead band). Asymmetric: cut hard, recover slow. (Doom Eternal pattern.)
- Bottleneck signal alongside percentiles: a passing p99 with signal=FILL = a governor mask, not a pass. Record OK/CPU/FILL with every percentile report. (Android: "a single number cannot distinguish 'fast because underloaded' from 'fast because governor is masking a CPU bottleneck.'")
- Re-seed determinism: reset the governor's confidence state mid-run + from cold start; require convergence to the same steady-state scale within the same frame budget. Non-convergence = non-deterministic governor = do not ship. (Unreal DRS heuristic validation.)
- Prewarm-then-measure: confirm the pool is fully prewarmed before the timed window. Stress numbers = steady-state entity throughput, never allocation warmup. (Vampire Survivors lesson.)
- Ban average FPS from evidence (CapFrameX): report p50/p95/p99 frame times + 1% worst-case from raw frame times. No ship decision cites a mean FPS. The scale-over-time trace accompanies the percentiles.
- Min-spec = the gate device (Arm; Appbot): "the min-spec user base is the one that reviews-bombs you." The freeze + gauntlet run on the weakest target, not the dev desktop. (Cyberpunk: the cautionary tale.)

## VERIFICATION ROUND 5 (Round 303 — Wed 2026-10-15 ~05:57 EDT)
- Verified (code read): 12ms frame budget (perf.js:128) reserves 28% idle — close to Unity's 35% mobile rule. Conservative for turn-based; governor handles degradation. No change.
- Merge gates (Bugnet): numeric thresholds (frame budget, p95, memory cap) + repeatable automated perf test on every change. Any post-freeze change re-runs the full gauntlet + soak, no exceptions. Freeze discipline is the ship-blocker.
- Percentile-only reporting: ban average FPS. Ship-blocker = p95/p99 within budget on min-spec (Android P90/P99 + Slow Session model). "A single over-budget frame is a hitch — report distributions, not means."
- Min-spec under thermal load: verify on lowest-spec target, not dev machine. 30+ min thermal soak; memory flat under 4.5 MP cap; governor responds when chip throttles.
- Prewarm-then-measure + re-seed: warm pools/shaders/caches before every run; fixed seeds for reproducible traces across verification rounds.
- Three audits (pass/fail): frame-budget (all scenes within budget, zero hitch frames); governor (smooth step-down, hysteresis up, panic at p95>33ms + recovery, UI fixed at max); memory (soak: flat line, zero hot-path allocation). All three pass before freeze.

## VERIFICATION ROUND 6 (Round 312 — Wed 2026-10-15 ~06:31 EDT)
- Verified (code read): zero steady-state per-frame allocations. Hot loop is allocation-free; pools prewarmed (Round 199). (Unity GC-Alloc discipline.)
- Budget as merge gate: 12ms/28%-idle = the sustainable thermal ceiling (Unity/Android doctrine: never budget the maximum consistently). Ship-blocker: p95/p99 ≤12ms on min-spec after 20+ min thermal soak, governor active — not a cold 60s run.
- Governor calibration: resolution scaling [2,2,1.5,1.25,1] = primary lever (Netmarble data: moves GPU/thermal most). Change one lever at a time; panic mode engages BEFORE throttling, not as reaction. Scale-down smooth, scale-up gradual.
- Allocation audit gate: zero per-frame allocations; total memory vs 4.5MP cap with LMK-style margin. Any byte over cap or any per-frame allocation blocks the freeze.
- Prewarm enforcement: every pool prewarmed during load/menu (Unity: "when a CPU spike is tolerable"). First-frames trace: no allocation or compile spike in first seconds of play.
- Measured-change protocol: every change ships with before/after traces (profile→optimize→compare); percentile-only reporting (p50/p95/p99); target device only. Unmeasured = not done.

## VERIFICATION ROUND 7 (Round 321 — Wed 2026-10-15 ~07:01 EDT)
- IMPLEMENTED: time-weighted p95 (perf.js). Naive p95 hid rare-but-long frames; fixed to weight by duration. Governor now detects thermal throttling correctly. +6 lines → 4,565.
- Verified: background throttling (visibilitychange → hiddenPause; clock reset on resume). Playgama/MDN pattern.
- Regression audit as CI gate (freeze): deterministic benchmark scene on every build; assert TIME-WEIGHTED p95 ≤12ms with warn/error levels (median-of-N, never single-run). Ship-blocker: breach or ≥20% regression (web.dev 20% rule).
- Device-tier + battery audit (ship-blocker): 2–3 tiers, weakest as floor; 15–30 min sustained session (p95, governor position, temperature) + idle drain observation (>2%/hr investigate, ≤1%/hr healthy). Real hardware only. Ship-blocker: p95 >12ms or OOM on min tier.
- Governor hardening (COD Mobile pattern): temperature-trend staging (Normal→NearThrottling→CloseThrottling); panic escalates through render-scale ladder before touching frame-rate. Log every transition; panic on mid tier = ship-blocker.
- Percentile audit: re-verified time-weighted (Yosoygames trap fixed). Report p50/p95/p99 per scene + prewarm status + allocation counter (stays zero). Minimal field telemetry (p95, memory, governor transitions, tagged by device/OS/version).
- Background throttling (ship-blocker): 5 min hidden → zero catch-up, no audio leak, no frame spike on return.

## VERIFICATION ROUND 7 (Round 330 — Wed 2026-10-15 ~07:36 EDT)
- Verified (code read): governor hysteresis. p95 > 20ms for 3 evaluations → step down; sustained headroom → step up (perf.js:3-4). _hot/_cool damping prevents oscillation. govHist traces decisions. (ADPF model.)
- Frame-budget checklist (ship-blocker): prewarm complete, fixed-clock device, ≥60s worst-case combat. Assert: (a) time-weighted p95 ≤ budget, (b) zero over-budget clusters attributable to JS (classify every one), (c) hot-loop allocation == 0. Regression = ship-blocker. Eyeball "feels fine" ≠ pass.
- Thermal calibration (ship-blocker): soak test on real mid-tier device until thermals rise; record governor decisions vs actual throttling. Ship-blocker: oscillation, or OS throttling before governor steps down. Verify hysteresis on hot device. (ADPF: app acts before throttling.)
- 4.5MP pixel audit (ship-blocker): instrument per-frame pixel-write estimates (drawn area × passes) on heaviest scenes incl. shadowBlur/gradient effects. Peak throughput must stay inside budget with headroom. Over → pre-render or fake (Grandevity). Ship-blocker: any scene exceeding on reference device.
- Hot-loop allocation gate: test/instrumented dev-build fails if frame loop allocates. Verify entity cleanup under late-game load (dozens of units + AoE + particles — Kiwi Defenders' GC-stutter scenario). Ship-blocker: any allocation, or sawtooth correlated with spikes.
- Device matrix (ship-blocker): fast desktop (fixed clock), mid-tier Android (soak/thermal), low-end (governor floor). Same trace on each. Ship-blocker: p95 regression or governor misbehavior on any device. Freeze: only measured changes, each re-profiled on same trace.

## VERIFICATION ROUND 8 (Round 339 — Wed 2026-10-15 ~08:09 EDT)
- Verified (code read): budget definitions. JS budget 12ms (perf.js:134, Sadil). All budgets with ship-blocker teeth. (Russell.)
- Harden gates (ship-blocker): every budget line (4.5MP, frame p95, allocation, thermal) = hard error in final verification, not warning. Any round-8 violation = FAIL. No exceptions without written, dated budget-change justification + re-baseline. (Russell: warnings → hard errors.)
- Owner per line: canvas pixel budget, frame-p95 governor, thermal governor, zero-alloc gate, time-weighted p95 methodology. Owner signs final verification. ("What's not reported won't be focused on.")
- Segmented validation (Riot): report frame p95 + governor behavior segmented by device band, scene complexity, thermal state — never single global average. Document noise floor in PERF-SPEC.md so verdicts distinguish signal from noise. Protects time-weighted p95 from averaging artifacts.
- Round retrospective: every verification ends with budget review — held? measured-change confirmed? dashboard reviewed by owner? Record in PERF-SPEC.md. Defense vs 40%-regress decay.
- Lock hysteresis, freeze budget: verify damping prevents oscillation once more, then FROZEN for ship. Post-freeze: only downward (stricter) or explicit justified re-baselines. Perf heroics banned; budget defends itself.

## VERIFICATION ROUND 9 (Round 348 — Wed 2026-10-15 ~08:34 EDT)
- Verified (code read): frame-time governor = web-equivalent of thermal-aware scaling. Native thermal APIs (iOS ProcessInfo.thermalState, ADPF) unavailable to web. Time-weighted p95 + 20ms/3eval + hysteresis = correct architecture. (wayline.io: frame-time as signal, thermal-first where available.)
- Sustained soak test (ship-blocker): 15+ min AI-driven gameplay, worst-case units, real iPhone. Log time-weighted p95 per 1-min bucket. Freeze criterion: p95 must not degrade >10% between min 2 and min 15. Closes benchmark-only gap. (ADPF best practice.)
- Freeze governor thresholds: lock 20ms/3eval + hysteresis in PERF-SPEC with freeze ledger. Any post-freeze change to thresholds, DPR caps, or batching = ship-blocker until re-verified. (Governor traces verify.)
- Verify recovery (ship-blocker): force thermal-stress (low-power mode + max units). Confirm governor sheds load (DPR cap → particles → effects, granular steps) and ramps back with hysteresis, not oscillation. Oscillation = #1 user-visible failure of adaptive quality.
- Battery budget gate: instrument energy per 10-min session (Xcode Instruments / Organizer). Set drain-per-hour ceiling in PERF-SPEC alongside 16.6ms budget. Regressions = ship-blockers, same as fps.
- Overdraw/batch audit: keep draw calls in low dozens via atlases/batching; cap DPR explicitly; minimize layered transparent draws. iPhone tile-based GPU: overdraw = heat. Verify with fill-rate stress in soak test, not cold benchmark. (Egmatic.)

## VERIFICATION ROUND 10 (Round 357 — Wed 2026-10-15 ~07:10 EDT)
- Verified (code read): minimal draw calls. 9 drawImage/fillRect in game.js. Layered canvases. Agar.io/Dino pattern. (web.dev; PixiJS.)
- Lock render path (freeze): no new draw calls, state changes, or textures before ship. Any proposed change re-runs audits 2-4. Change adding draw call/state change = ship-blocker until re-verified.
- Final audit (ship-blocker): instrument 2D context (wrap drawImage/fillRect/fillText/fillStyle setters); log per-frame counts over 10s worst-case stress; confirm headroom vs 16.6ms budget; total live canvas/texture bytes vs memory ceiling. Any frame over budget or memory growth = blocker. (MDN; Eastcott.)
- Re-verify p95 (ship-blocker): DevTools Performance trace (Memory checkbox on) of stress scene; confirm p95 < 16.6ms with no GC sawtooth. p95 regression or visible GC pauses = blocker. (Chrome DevTools.)
- Memory soak (ship-blocker): Task Manager baseline → 10+ min soak → heap snapshot. Allocation Timeline must show zero per-frame growth; no detached-canvas leaks. Monotonic heap growth = blocker.
- Thermal + governor (ship-blocker): sustained session; governor engages at 20ms/3-eval; hysteresis (no oscillation); recovers to full fidelity. Governor fails to engage, oscillates, or never disengages = blocker.

## VERIFICATION ROUND 11 (Round 366 — Wed 2026-10-15 ~07:38 EDT)
- Verified (spec read): perf budget locked. 16.7ms total (60fps); JS ≤8ms, render ≤8ms; 60fps iPhone 17; 30fps floor low-class. PulseGeek/Unity pattern (hard ms budget, split). (PulseGeek; Unity.)
- Freeze discipline: treat PERF-SPEC.md as locked budget spec — version with build. Any perf-relevant code change requires re-verification pass (profile before/during/after). Do not tweak draw calls, layer count, or governor thresholds without re-running full 10-round verification.
- Ship-blocker #1: governor cannot be bypassed or softened. Hard gate that frame-time governor (time-weighted p95 + 20ms/3eval + hysteresis) always active in release builds with no debug/override path. Verify empirically it engages under synthetic load (test scene forcing sustained >20ms frames must trigger all 3 evals + hysteresis recovery). One frame over budget = hitch.
- Ship-blocker #2: frame-pacing histogram, not just FPS. Verify against frame-time histogram on slowest supported device, looking for long tails (p95+). Average fps = deceptive (Unity; PulseGeek). Re-verify thermal discipline (soak) + fps discipline on that device as release gate.
- Ship-blocker #3: device-tier targets in writing. Add explicit per-tier targets (e.g., "60fps budget met on reference device X; degraded tier Y at 30fps with documented toggles"). Single-device verification = classic anti-pattern. Spec not "final" until it names devices. (Unity hardware tiers.)
- Hold line on draw calls (anti-premature-optimization): 9 drawImage/fillRect = measured win. Rule for freeze: no new draw calls or layer additions without profiling evidence they fit render slice; no "just-in-case" batching refactors. Profile first, always. (web.dev; ArchMan.)

## VERIFICATION ROUND 12 (Round 375 — Wed 2026-10-15 ~08:09 EDT)
- Verified (spec read): perf discipline. 16.7ms budget; frame-time governor (time-weighted p95); thermal soak procedure; freeze ≥24h before. grimoria's "actively managed from preproduction" pattern. (grimoria; Cardoso.)
- Enact perf freeze now: no change to rendering, sim, or allocation paths merges without before/after frame-time capture against worst-case scene. Document freeze in PERF-SPEC.md as verification 12's gate. (grimoria: any perf PR lacking before/after data rejected.)
- Define canonical worst-case: max units (6 mechs) + max FX (trauma shake, hit-stop, particles) + camera pan + all layers redrawing simultaneously. Budget each subsystem to 85% of frame target at this scene — last 15% reserved for interaction effects (cache pressure, driver spikes, OS interference). "Teams that budget to 100% ship at 52fps." (grimoria.)
- Governor ship-blocker: confirm hysteresis bands never oscillate under sustained worst-case load (no quality-level flapping), and 20ms/3-eval trigger fires before visible hitch, not after. Flapping governor worse than slow one. Re-run governor validation against worst-case on weakest target machine/browser — not dev PC.
- Regression gate: record current frame-time histogram (p50/p95/p99 + over-budget count) as locked baseline; any commit moving p95 beyond +8–10% of noise floor = ship-blocker until explained. (Bugnet; grimoria.)
- Soak + thermal final: run worst-case scene for ≥30 minutes; confirm (a) no memory growth, (b) no hitch-frequency increase, (c) thermal discipline holds — plus zero-per-frame-allocation audit of render path (in JS, per-frame allocation = scheduled GC hitch; pool all transient vectors/objects).

## VERIFICATION ROUND 13 (Round 384 — Wed 2026-10-15 ~08:39 EDT)
- Verified (spec read): 16.7ms budget locked. :6: "Frame: 16.7ms total — JS logic ≤8ms, render ≤8ms"; :45: "full 16.7ms — browser keeps the rest"; :49: "Over-budget threshold: 16.7ms → 12ms (HUD + governor react to real budget)". Matches web.dev (~10ms real budget) and Factorio (perf stipulations, measured against worst-case). (web.dev; Factorio.)
- Declare freeze in writing: from this point only crash/perf fixes land; every change re-runs canonical worst-case scene and must hold 16.7ms budget with governor headroom — Factorio's stipulated-feature-card rule: no change may increase frame cost.
- Lock ship-blocker list: frame-time governor must never trip during canonical worst-case soak; 9-draw-call budget holds; thermal discipline verified on sustained run (soak, not 60-second burst). No green soak = no sign-off.
- Regression audit per build: capture frame-time traces of canonical worst-case scene every build, diff against frozen baseline, revert-or-fix any regression before merge; keep trace history as sign-off evidence. (Unity-perf-framework model.)
- Sign-off validation on min-spec target hardware — not dev machine. Verify 16.7ms budget, rAF pacing, zero per-frame allocations (GC pauses), canvas layering intact, against written checklist with named owner. (Certification parallel-discipline model.)
- Clamp and bound loop per Fiedler: clamp delta-time (spiral-of-death guard), keep fixed-dt logic decoupled from render with accumulator, preserve governor headroom so temporary spikes absorbed; prove by injecting synthetic spike in soak test and confirming clean recovery.

## VERIFICATION ROUND 14 (Round 393 — Wed 2026-10-15 ~09:12 EDT)
- Verified (spec read): perf sign-off defined. :77: "Round 199: Final perf sign-off (slice)"; :158: "perf.js ring buffer already records p50/p95/p99, % over budget, per-layer draw timings — rig is built. Gate = written sign-off on all three, not 'feels fine'"; :307: "Regression audit per build: capture frame-time traces of canonical worst-case scene every build, diff against frozen baseline." Matches Game-Ace (sign-off after perf pass) and exoa.dev (budget enforced). (Game-Ace; exoa.dev.)
- Freeze→sign-off gate (Game-Ace + Bugzy model): declare content freeze, run performance pass, then hold formal perf sign-off with named approvers and frozen quality snapshot. After sign-off, no unbudgeted changes except ship-blockers.
- Lock budget against weakest target device (Innovecs model): document 16.7ms frame-time ceiling, 9-draw-call ceiling, load-time limits — written, per weakest device, with every remaining pre-launch change mapped to budget allocation. "Performance is the first feature" (exoa.dev).
- Encode budget as automated CI gate (PerfGuard/Gauntlet model): canonical worst-case replay scene run in Chromium on every build, recording frame-time percentiles against stored baselines, failing build on drift. Round-14 verifications (freeze, canonical worst-case, governor, regression, soak) become automated gate, not manual ritual.
- Post-launch perf telemetry from day one (Testriq + getgud.io): lightweight opt-in frame-time pings (p50/p99 frame time, long-task counts, draw-call counts) plus monitoring of crashes, errors, reviews — so post-launch content patches can't silently erode budget (AltTester: "performance relapses").
- Enforce and revisit budget — unenforced budget worse than none (exoa.dev). Revisit 16.7ms budget each milestone, publish sign-off result, keep perf regression pass in live cadence. (SnoopGame: QA never ends after launch.)

## VERIFICATION ROUND 15 (Round 402 — Wed 2026-10-15 ~09:48 EDT)
- Verified (spec read): ongoing perf defined. :15: "Frame-time histograms + p99 (existing ring buffer); LoAF jank log"; :49: "Over-budget threshold: 16.7ms → 12ms"; :121: "Frame time: rAF deltas, p50/p95/p99 (perf HUD)"; :155: "Signal 2 — tail jank: p95/p99 frame time, % frames missing vsync, long-task count." Matches Riot (percentiles, not FPS averages) and Epic (budget as contract). (Riot; Epic.)
- Freeze discipline on hot path: lock renderer, game loop, and asset-loading code paths in PERF-SPEC.md — any change touching them must pass 1000-battle bot + render-at-scale verification before merge. Counters cumulative drift, the silent frame-budget killer. (salivity.)
- Codify ship-blockers as CI-style gates, not advisories: frame p95/p99 ≤ 16.7 ms on reference harness, memory budget, node --check clean, jank audit, 1000-battle bot pass — fail release if any gate trips. (Epic: "build blocker" rule.)
- Budget re-audit cadence: re-run full verification suite (verifications 1–14 + final sign-off) on fixed schedule per release, using identical measurement conditions (same machine/browser, warmup, baselines) — per Unity's baselines-with-tolerance method.
- Measure in milliseconds with percentiles, retire FPS-average reporting: track p50/p95/p99 frame times and 1%-low equivalents from bot harness so hitches can't hide behind 60 FPS average. (FPS-monitoring-trap guidance.)
- Post-launch-style field check: add lightweight optional frame-time sampler to game itself (Riot live-tooling pattern) so long real play sessions can report their own frame-time distribution back to dev team, keeping budget honest after "launch."

## VERIFICATION ROUND 16 (Round 411 — Thu 2026-10-15 ~12:28 EDT)
- New this round (spec only): budget-evolution plan. Spec has no budget-evolution plan — this round adds it. Matches SpeedCurve (annual "make your budget better than ever" ritual), Fortnite (Performance Mode as budget evolution), Riot (15-year-old game still subject to budget evolution). (SpeedCurve; Fortnite; Riot.)
- Write the budget into CI as a blocking gate: the 16.7ms frame budget, 1000-battle bot, and memory budget become fail-the-merge checks on every PR (per SpeedCurve's CI/CD guidance), not documents in PERF-SPEC.md. Freeze discipline = no silent budget edits; changes need sign-off recorded in the spec's verification log.
- Adopt worst-case measurement: re-baseline on peak-week/p75 frame times, not averages — medians will hide drift. Track p75/p99 frame time and worst-case battle frame alongside the average in the 1000-battle bot, so slow creep triggers alerts. (SpeedCurve: use worst-of-2–4-weeks; averages hide drift.)
- Ship with RUM from day one: even for a canvas game, log real-player frame-time histograms per device tier and alert on distribution drift (web.dev field-first approach) — the bot can't represent players' hardware.
- Schedule the evolution audits: a quarterly "budget-drift audit" (compare current peak-week performance vs. frozen budget, vs. any competitors) and an annual "budget better than ever" review (tighten budgets where headroom was won, per SpeedCurve's ritual). Log each in PERF-SPEC.md as verification 17, 18, … continuing the existing 2-15 series.
- Plan a Fortnite-style escape valve now: define the tiered-fidelity fallback (what gets cut when the frame budget is blown on weak hardware) BEFORE launch, so post-launch perf problems have a designed response instead of emergency rewrites — and never do a Vampire Survivors-scale engine migration unplanned.

## VERIFICATION ROUND 17 (Round 420 — Thu 2026-10-15 ~13:21 EDT)
- Verified (spec read): GC discipline defined. :103: "**AUDIT — zero-alloc hot loop:**"; :189: "Allocation sweep last gate: zero per-frame allocation, flat p99. p99 spikes with flat p50 = GC — fix the allocation, not the budget."; :266: "Owner per line: canvas pixel budget, frame-p95 governor, thermal governor, zero-alloc gate, time-weighted p95 methodology."; :301: "plus zero-per-frame-allocation audit of render path (in JS, per-frame allocation = scheduled GC hitch; pool all transient vectors/objects)." Matches Unity (pooling doctrine) and Roblox (structural GC elimination). (Unity; Roblox.)
- SHIP-BLOCKER: zero-allocation render/update/input loops: Freeze the rule: no object/array/string/closure allocation inside the per-frame path (render, unit update, AI tick, mousemove/click handlers). Pre-allocate scratch vectors and buffers; pool particles, damage numbers, pathfinding nodes, and AI scratch state; store grid/entity numerics in TypedArrays. Enforce with an allocation-sampling pass over a scripted battle in CI — any new allocation hotspot fails the build, same as the frame-budget gate.
- SHIP-BLOCKER: GC budget in CI alongside the frame budget: Add to the existing CI gate: (a) no major GC during the 1000-battle bot run, (b) minor-GC time < 1ms/frame at p99, (c) heap growth across 10 consecutive battles ≈ 0 (leak check). Percentiles, not averages — p99 frame time and worst-case pause are the ship metrics, matching the PERF-SPEC percentile/audit pillars.
- GC audit as a verification-round artifact: run the Chrome DevTools allocation-sampling + heap-snapshot-diff workflow over a full battle before sign-off; publish the heap sawtooth graph and allocation hotspot list next to the frame-time percentiles. Re-audit on the same cadence as the jank audit — allocation drift is silent between audits.
- Freeze discipline for GC-adjacent code: any change to entity lifecycle, pooling, event wiring, or canvas/DOM creation is a GC-surface change and requires the allocation audit to re-pass. Ban per-frame string building (debug overlays, tooltips), per-event object literals in hot handlers, and property add/delete on hot objects (shape churn); flag them in review.
- Post-launch GC monitoring (field check): ship lightweight RUM — periodic performance.memory sampling (Chrome) or measureUserAgentSpecificMemory where cross-origin isolation allows, plus longtask PerformanceObserver entries tagged with battle/turn context. Alert on heap growth across sessions and on GC-attributed long tasks. This closes the loop the PERF-SPEC's "field check / RUM / ongoing" pillars require.
- Safe-point allocation policy: concentrate unavoidable allocation (turn setup, AI planning scratch, asset decode) at turn boundaries and loading screens — the game-side equivalent of V8 idle-time GC and Unity's safe-point collection — so the collector's work lands where no 16.7ms budget is at stake.

## VERIFICATION ROUND 18 (Round 429 — Thu 2026-10-15 ~14:09 EDT)
- New this round (spec only): canvas plan. Spec has LoAF logging but no canvas plan — this round adds it. Matches MDN (canonical canvas checklist), nixiefx (allocation discipline), T-Rex Runner/Kiwi Defenders/Boids (shipped canvas games). (MDN; nixiefx; Chrome.)
- Freeze the render path and make it a ship-blocker: Adopt the freeze discipline: static battlefield layers pre-rendered once to an offscreen canvas (context created with {alpha:false}), blitted per frame; snug offscreen caches for repeated sprites (never scaled in drawImage — cache sizes at load); entity rendering batched by type into single compound paths; per-frame text rendering banned from the hot path (pre-render digits/labels to atlases, à la T-Rex Runner). Ship-blocker: no feature merges if the Frame Rendering Stats dropped-frames delta for one full battle is >0 at 4× CPU throttle (browser-rendering.com methodology).
- Zero-steady-state-allocation in hot paths, enforced in code review: Typed arrays (Float32Array) for unit/projectile state; bounded, prewarmed pools for FX, damage popups, and projectiles with a defined drop-at-cap policy; no .map/.filter/spread/literals/closures in update or render loops; event payloads for hot events pooled or caller-owned. Ship-blocker: an allocation-timeline pass on a 1000-battle-bot run must show ~zero game-owned allocation after warmup (nixiefx discipline).
- Lock the frame budget in the loop: Fixed-timestep accumulator (physics decoupled from render, delta capped ~100ms), rAF only, DPR capped at ~2, culling of offscreen entities before update AND render. Map directly to the 16.7ms budget: per-battle p95 frame duration must sit under 16.7ms at 4× throttle; any battle spiking over budget fails the perf pillar.
- Adopt the lab validation loop as PR practice: Every perf-sensitive change ships with before/after DevTools Performance traces (identical 4× throttling, ~3s windows, Incognito) — flame-chart diff, not a claim. Profile-first rule: no optimization work begins without a trace naming the bottleneck (draw calls vs pixel work vs GC).
- Stand up post-launch RUM now, not after launch: Instrument a PerformanceObserver for long-animation-frame entries; beacon the worst-N per session (duration, blockingDuration, script attribution) on visibilitychange; trend p50/p95 frame duration and dropped-frame rate per battle. Alert on percentile regression — this is the field check that catches the thermal-throttling and low-end-device jank no lab bot can reproduce.

## VERIFICATION ROUND 19 (Round 438 — Thu 2026-10-15 ~14:54 EDT)
- New this round (spec only): performance plan. Spec has perf discipline but no performance plan — this round adds it (frame-budget slices, deterministic harness, memory lock, canvas checklist, post-launch plan). Matches Factorio (continuous optimization), proceduralpixels (frame-budget discipline), MDN/web.dev (canvas checklist). (Factorio; proceduralpixels; MDN.)
- Lock the frame budget and enforce it as a ship-blocker: 16.7ms total, with explicit slices (e.g., sim/AI ≤6ms, render ≤8ms, reserve ≥2.7ms); any build whose p95 exceeds budget on target-class hardware blocks shipping. This is the single highest-leverage action — it converts every other perf item from aspiration to gate.
- Freeze discipline via a deterministic perf harness: keep and extend the 1000-battle bot as the canonical benchmark — fixed seed, fixed scenarios, production build, worst-case entity counts — and store per-build frame-time stats (median/p95/max) in a history log; fail the build on regression.
- Zero-steady-state-allocation memory lock: audit the hot loop for per-frame allocations, pool high-churn objects (projectiles, particles, pathfinding nodes, damage numbers), cap entity/effect counts, and verify with a long-session heap timeline that allocation during gameplay is flat. Make "new in the frame loop" a review-blocker.
- Apply the canvas render checklist as a one-time render-path audit: offscreen pre-rendered sprites, batched draw calls with minimal state changes, layered canvases for static vs dynamic, {alpha:false}, integer coords, pre-scaled assets (no drawImage scaling), no shadowBlur, rAF-driven loop. Verify "render at scale" and "jank audit" items against this list.
- Post-launch perf plan from day one: define the re-audit cadence (every content patch re-runs the worst-case benchmark), add field frame-time telemetry (p50/p95/p99 from real players) as the post-launch RUM pillar, and treat content additions (new units/effects) as perf-gated — the Vampire Survivors lesson is that entity-count growth without perf gates forces an engine rewrite; the Factorio lesson is that continuous small optimizations compound into a permanent performance moat.

## VERIFICATION ROUND 20 (Round 447 — Thu 2026-10-15 ~15:43 EDT)
- New this round (spec only): profiling plan. Spec has a performance plan (round 438) but no profiling plan — this round adds it (CI deviation-threshold gates, heap-profiler allocation audit, written render budget, field telemetry, thermal re-audit). Matches Bugnet (CI perf gates), MDN (canvas checklist), Factorio (perf as feature). (Bugnet; MDN; Factorio.)
- Lock the benchmark in CI with deviation-threshold gates (Bugnet model): Extend the 1000-battle bot to record p95/p99 frame times (not averages) on fixed lab hardware for the three worst-case scenes (max units, max particles, full board). Baseline = current numbers; gate = fail the build on statistically significant regression (e.g., >5% p95 drift). SHIP-BLOCKER: red perf gate = no ship, no exceptions.
- Run the zero-steady-state allocation audit with the Sampling Heap Profiler on the hottest turn (Chrome DevTools deep-dive method): Pre-warm object pools for the per-turn allocators (vectors, projectiles/particles, damage numbers, pathing nodes); web.dev/MDN checklist as the audit sheet. SHIP-BLOCKER: any per-frame allocation in the render/update hot path found in a pre-release audit = must-fix, not nice-to-have.
- Freeze the render budget in writing: draw-call count, fill-rate, and offscreen-pre-render inventory per scene, per MDN/web.dev checklist; re-measure at max entity scale after every rendering change (AG Grid per-commit pattern). Freeze discipline = the checklist is versioned and changes to it require a measured justification.
- Add lightweight field telemetry from day one (post-launch audit): sampled frame-time p50/p95 per session, segmented by device class, trended against the lab baseline (SpeedCurve/RUM model). SHIP-BLOCKER for hotfixes: field p95 regression vs. shipped baseline = investigate before the next release, not after user complaints.
- Schedule the thermal/worst-case re-audit: quarterly jank audit on the weakest supported hardware with a thermal soak (low-power mode, sustained play), because desktop-only numbers are a best case (mobile gotcha list from Bugnet/nixiefx). This closes the profiling gap the pros all warn about.

## VERIFICATION ROUND 21 (Round 456 — Thu 2026-10-15 ~16:29 EDT)
- New this round (spec only): frame plan. Spec has performance and profiling plans but no frame plan — this round adds it (frame plan + freeze discipline, zero-allocation hot paths, canvas batching discipline, built-in frame audit, post-launch perf monitoring). Matches MDN (canvas optimization), Factorio (never guess about perf), web.dev (canvas performance). (MDN; Factorio; web.dev.)
- FRAME PLAN + FREEZE DISCIPLINE (ship-blocker): Lock the written render budget now — 33.33 ms total for the 30 FPS floor, split ~20 ms sim/logic, ~13 ms render/submit (per the 2026 frame-budget table). Freeze rule: any commit pushing p95 frame time over budget fails the CI deviation-threshold gate; no exemptions. Fixed-timestep sim (accumulator) + interpolated render, with accumulator clamp and a max-steps-per-frame guard so backgrounding can never spiral.
- ZERO-ALLOCATION HOT PATHS (ship-blocker): Ban per-frame allocation in update/render/particle code — verify with an allocation timeline on the min-spec target, not the dev machine. Pre-allocate all particle/effect pools at load sized from stress-test peaks + 20–30% margin; track pool utilization in debug builds. Audit destructuring and object literals in hot loops (hidden allocations).
- CANVAS BATCHING DISCIPLINE (ship-blocker): Pre-render repeated sprites to snug offscreen canvases; batch strokes into single paths; group draws by fillStyle; layered canvases for static background vs. gameplay; alpha:false context; integer coordinates; no shadowBlur in gameplay. Verify each technique with measurement (web.dev's JSPerf principle), not assumption.
- BUILT-IN FRAME AUDIT: Ship the frame-time histogram + p95/p99 overlay in the debug build; log frame-time percentiles and quality-tier switches to production telemetry so the post-launch audit is automatic.
- POST-LAUNCH PERF MONITORING (anti-neglect): Wire adaptive quality tiers with hysteresis + thermal watch events into telemetry; set alerts on p95 frame-time regression per version and crash-free rate; hold a fixed weekly perf review cadence after launch — catch regressions from data before players report them.
