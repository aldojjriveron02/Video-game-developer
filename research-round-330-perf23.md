# Perf Part 23 (Verification Round 7) — Findings (Round 330)
**Date:** Wed 2026-10-15 ~07:36 EDT · **Source:** live web research (pinterest, sadil, grandevity, adpf)
**Project:** Mecha Protocol — perf (pre-jam; verification round 7)

## A. Mechanics
- Frame-budget audit (Pinterest/Chrome DevRel): "at 60 FPS ~16.6ms per frame — constant-rate ideal, not average." "Consistent frame rate matters more than peak FPS." "Profile in Incognito, extensions off." "Flag every over-budget frame, classify by cause (JS/paint/composite/GC)."
- Memory/GC audit (Sadil; Grandevity): "GC stutters = primary enemy." "Rapid creation/destruction triggers aggressive GC mid-gameplay." "Watch for sawtooth in memory graph correlated with frame spikes." (Matches our "hot loop clean" verification.)
- Battery/thermal audit (ADPF): "Thermal API lets app monitor thermal state and take proactive action (cut workload) before throttling." "Fixed Performance Mode enables benchmarking on stable clock." Two halves: "(a) benchmark mode — fixed clocks for repeatable numbers; (b) soak mode — sustained play to measure degradation under heat."

## B. Validation
- DevTools workflow (Smashing/Pinterest): "Timeline frame recording; show paint rectangles; hide/isolate systems and walk scene; toggle properties and re-measure." "Don't guess it, test it."
- On-device matrix (Eastcott; Pinterest): "measure paint on both desktop and mobile — characteristics vary wildly." "Device farms exist because throttling, GPU fill, memory pressure are device-specific."
- Fixed-clock + thermal (ADPF): "lock clocks, warm-cache (prewarm), then measure." "Confirm adaptive quality reacts before OS throttling."
- Measurement discipline: "frame-time distributions, not FPS averages." "Find-fix-reprofile on same trace, never eyeball."

## C. Techniques
- Object pooling: "avoid GC in loops, reuse preallocated objects, typed arrays." (Grandevity alternative: "disciplined entity cleanup — dead entities filtered at end of each frame.")
- Dirty-rect: "don't redraw whole canvas — clear/redraw minimal bounding rectangle." (Smaller win for fully dynamic combat.)
- Canvas layering: "split scene across stacked canvases; only redraw changed layer." "Pre-render static to offscreen, blit per frame."
- Adaptive quality (ADPF; Eastcott): "cut workload proactively when heat rises." "Reduce resolution, particles, effect passes under pressure." "Loop must be calibrated (hysteresis/damping to avoid oscillation)."
- Micro-efficiency (Sadil): "minimize state changes, batch draw calls, sprite atlases, avoid float coords, avoid getImageData, avoid re-rendering text."

## D. What to avoid
- GC pressure: "#1 anti-pattern — allocating per frame in update/render."
- Unthrottled loops: "don't run update/draw faster than display; don't do frame work in input handlers."
- Overdraw: "painting large areas redundantly; shadowBlur/gradients most expensive; pre-render or fake."
- State thrashing: "unnecessary state changes; redrawing unchanged regions; save/restore cost."
- Measuring wrong: "extensions on, desktop-only, average FPS, guessing bottleneck."

## E. Shipped
- Kiwi Defenders (Grandevity): "entity cleanup patterns, pre-rendered WebP backgrounds, save/restore isolation, simplified geometry." "Attacked observed costs, designed in from start."
- Snap Games/PlayCanvas (Eastcott): "texture optimization, device detection, systematic device testing." "Low-end-mobile-first budgets."
- Pinterest (Osmani & Lewis): "measured instead of guessed — hid subsystems, re-profiled, fixed measured bottleneck." "40% reduction from one style change."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** governor hysteresis. p95 > 20ms for 3 evaluations → step down (perf.js:3-4). `_hot`/`_cool` counters provide damping — single spike won't flap quality. Sustained headroom required to step up. govHist traces decisions (Round 258, Fuller). ADPF hysteresis requirement satisfied.
- **PERF-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
pinterest · sadil · grandevity · adpf · eastcott · mdn · web.dev
