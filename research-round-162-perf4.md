# Perf Part 4 (Jam & Validation) — Findings (Round 162)
**Date:** Wed 2026-10-14 ~17:55 EDT · **Source:** live web research (rune ×2, crazygames, poki, mdn, nixiefx, madhawasadil, android, chrome, playgama, gamedeveloper)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- Rune (two device classes; design for low class; 30fps cap low-end).
- CrazyGames (250MB/1500 files/≤50MB initial/≤20s; DPR 1 iOS).
- Poki (10s abandonment; progressive loading). LD tips (finish 2h early).

## B. Validation
- Frame-time logging (p99). LoAF API (>50ms; Chrome 123+).
- DevTools (FPS meter; CPU throttling). Thermal soak (ADPF headroom).
- Device matrix (real hardware + inspect).

## C. Techniques
- MDN (offscreen pre-render; integer coords; layered canvases; alpha:false).
- nixiefx (zero-alloc; pooling; DPR≤2; low-hundreds draw calls).
- Sadil (~10-12ms JS; zero-alloc loops). Playgama (minimal bundle; audio sprites).

## D. What to avoid
- GC churn (limb loop; AI scoring; particles). Overdraw (M3 + particles).
- Uncompressed assets. Timer traps. Audio preload. Portal traps.

## E. Shipped
- Rune (30fps low-end). Medieval Defense Z. Sadil (vanilla-JS 60fps).

## Implemented this round (code)
- **js/perf.js:** LoAF observer (>50ms → telemetry; dev-only; feature-detected).
- **PERF-SPEC.md:** jam budget + validation + traps.
- 3,846 lines (+20).

## F. Sources
rune ×2 · crazygames · poki · mdn · nixiefx · madhawasadil · android · chrome · playgama · gamedeveloper
