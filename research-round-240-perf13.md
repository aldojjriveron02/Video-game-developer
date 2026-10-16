# Perf Part 13 (Jam-Day Perf Verification) — Findings (Round 240)
**Date:** Wed 2026-10-14 ~23:25 EDT · **Source:** live web research (radical fish, godot, chrome, unity, mdn, playcanvas, eliasku, tanki)
**Project:** Mecha Protocol — perf (pre-freeze; verification only)

## A. Mechanics
- 3-signal in practice (CrossCode, Radical Fish): freeze canonical scenes, re-measure IDENTICAL scenes after each change. Their collision stress: 10.7–11.6 → 5.9–6.4 ms/frame (45%) after component-izing entities. Lesson: never ad-hoc gameplay.
- Godot docs: three slowness flavors = (1) continuous low fps (median/budget), (2) intermittent spikes (tail/GC), (3) slow non-gameplay processes. Loop: Profile → Identify → Optimize → retest after every change.
- Histogram reading (Chrome LoAF docs): low-blockingDuration LoAFs = frame-rate limitation (budget problem); high blockingDuration = input-blocking spikes (tail jank). p99 spikes → yield/split the task; sustained elevation → cut work or scale quality.
- Auto-governor = industry standard: Unity Adaptive Performance (thermal/power/bottleneck → quality scalers, restores on headroom). Browser precedent: Tanki Online ships FPS counter + "Image resolution" setting + laptop mode as features.

## B. Validation
- Thermal soak: sustained load raises thermal state → clocks clamp. 15–20 min worst-case scripted session, 5-min buckets; pass = last bucket p95 under budget. Test WITH and WITHOUT Low Power Mode (changes clock ceiling).
- Allocation sweep (CrossCode root cause): V8-hostile polymorphism + huge objects deoptimized inline caches; fix = flat single-shape components + pooled scratch (replace per-frame `new Vector2D()`). Method: DevTools allocation timeline; hot loop must show zero.
- Input latency (web.dev RAIL): respond <100ms, 50ms processing budget, 10ms/frame animation budget. Our ≤50–70ms tactics budget sits inside RAIL's 50ms. Measure synthetic tap → rAF response on real device.
- Weakest-target rule (Godot): relative perf varies enormously; benchmark low-end with V-Sync off. Never gate on laptop numbers.

## C. Techniques
- Safe vs unsafe last-24h tweaks (Godot): profile → change exactly one thing → re-measure. Safe = numeric only (budgets, thresholds, particle counts, culling radii). Cat Survivors model: behavior-preserving simplifications, play-verified ("doesn't lag").
- Dormant HUD on flag (PlayCanvas Profiler: Ctrl/Cmd+Alt+T): QA instruments without rebuild. URL-flag path must stay exercised (anti-bit-rot).
- DPR cap verification: read back canvas backing-store size on high-DPR phone; don't trust the code path. (Cat Survivors checked; Tanki ships it as a lever.)
- Background-tab discipline (MDN): browsers stop rAF for hidden tabs BUT audio keeps a tab foreground — suspending AudioContext on visibilitychange is load-bearing. Pattern: visibilitychange → cancel rAF + suspend audio + flush telemetry (Chrome LoAF guide: report at visibilitychange).
- Battery: getBattery() is Chrome-only (Baseline "Cross") — never the cross-browser thermal signal; on iOS the proxy is frame-rate decay across soak buckets.

## D. What to avoid
- "Works on my machine" sign-off (CrossCode: regression with NO new content — browser/JS-engine shift deoptimized entities; same-scene re-measurement caught it).
- Profiling only the menu (CrossCode: Chrome +45% collision, Firefox +29% GUI — different bottlenecks per scene/browser).
- Ignoring thermal (cold 60s phone run = fiction; soak buckets exist for a reason).
- Last-minute behavior-changing "optimizations" (Cat Survivors: bolted-on gamepad = main bug source). Only numeric tweaks <24h from freeze.
- No real-device trace (every source converges: Godot, Unity, Tanki).

## E. Shipped
- CrossCode (Radical Fish): Canvas 2D HTML5 action RPG; flat components fixed V8 deopt; 45% collision win on fixed scenes × 3 browsers.
- Cat Survivors (js13k 2025): DPR-aware, cached emoji sprites, layered collisions, flattened stat math — perf as design constraint from hour one.
- Tanki Online: shipped FPS counter + resolution setting + laptop mode — performance observable/adjustable in-product.

## Implemented this round
- **Verified (code read, no changes — pre-freeze):** ?perf=1 URL flag + localStorage toggle (PlayCanvas pattern, exercised); rAF chain self-terminates on hiddenPause (line 1798, no orphaned frames); timestamp reset on return (Sukin start/stop); audio suspends on hide / re-syncs on visible + bfcache (music.js, Round 215); autosave on hide + pagehide; DPR renderScale:2 default (line 17).
- **PERF-SPEC.md:** jam-day perf verification checklist (same-scene 3-signal on weakest phone; thermal soak with governor, both power modes, no-oscillation criterion; allocation sweep; input-latency spot check; 24h freeze discipline — numeric tweaks only + re-measure; flag-HUD toggle check; backing-store DPR readback).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
radical fish · godot · chrome · unity · mdn · playcanvas · eliasku · tanki · web.dev
