# Audio Part 6 (Jam & Validation) — Findings (Round 171)
**Date:** Wed 2026-10-14 ~21:20 EDT · **Source:** live web research (js2devlog, web.dev, chrome.dev, kentog751, loopsmith, abratabia, audiogamejam, dev.to, numberanalytics)
**Project:** Mecha Protocol — audio (Phase 3, pre-jam)

## A. Jam audio
- No-sample stack is standard. LoopSmith (36-step). kentog751 (1 file, MIT).
- FMOD war story (no new tooling mid-jam).

## B. Validation
- Speaker coverage. Fatigue/mute. Loop seams (equal-power). Scheduler (250ms abandon).
- LoopSmith checklist.

## C. Techniques
- ADSR always; cancelScheduledValues; layer voices. Vertical layering; resequencing.
- Ducking 30-40%. Variation pool (playbackRate ±%).

## D. What to avoid
- Autoplay lockout (iOS unlock). Stacked clipping. Harsh loops. Fatigue.
- Voice pile-ups. Middleware mid-jam.

## E. Shipped
- kentog751 (closest model). LoopSmith. js2devlog's game. OSHA Coaster.

## Implemented this round (code)
- **js/sfx.js:** priority voice steal — Tier 1 (critical, vexStinger) bypasses cap.
- **AUDIO-SPEC.md:** jam decision + validation + traps.
- 4,019 lines (+2). (Variation pool, limiter, cap already existed.)

## F. Sources
js2devlog · web.dev · chrome.dev · kentog751 · loopsmith · abratabia · audiogamejam · dev.to · numberanalytics
