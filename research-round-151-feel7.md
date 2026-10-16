# Feel Part 7 (Juice Validation) — Findings (Round 151)
**Date:** Wed 2026-10-14 ~14:30 EDT · **Source:** live web research (youtube ×2, gdcvault, gamedesign.gg ×2, egmatic, teemo.dev, esorhizome, eastondev, gamedeveloper, ssbwiki, dragdown, reddit ×2, ldj.am)
**Project:** Mecha Protocol — feel (Phase 3, pre-jam)

## A. Juice
- Juice It or Lose It (feedback layering; redundant juice). Swink (control+space+polish, in order).
- Hades (one juice/event; tiered ladder; intensity ∝ damage). Trauma² recipe (zero-floor).
- Feedback framework (hit stop/sound/camera top-3; 3-5 events/sec; sequence timing).

## B. Validation
- Juice-off test (flat but readable). Hades toggles (independent; patch history).
- Kao goldilocks [unverified — internal term]. Juul A/B [unverified — internal term].
- Input generosity (<150ms).

## C. Polish
- Chevy Ray (visual flair; oomph; EXPLODE). First 10 seconds. Cohesive palette.
- Audio→Mood bleed. Rating economy (must rate to get rated).

## D. What to avoid
- Kelly counter (juice can cost immersion). Trap list (juice before controls; shake everything).
- Frequency discipline (3-5/sec). Readability floor (aggregate small numbers). Zero-floor.

## E. Shipped
- Hades (9-layer; 30-60/90-120/120-180ms; 2-6px shake; 0.25-0.4x slow-mo; 60-100ms flash).
- Smash (hitlag formula; 30-frame cap). ItB (telegraphs ARE tactics feel).

## Implemented this round (code)
- **js/game.js:** _juiceTick() — rolling 1s juice events/sec guard; >5/sec → telemetry alarm.
- Hit-stop ladder audited vs Hades/Smash: all in band.
- **FEEL-SPEC.md:** production spec appended (calibration, guard, pre-jam checklist).
- 3,695 lines (+16).

## F. Sources
youtube ×2 · gdcvault · gamedesign.gg ×2 · egmatic · teemo.dev · esorhizome · eastondev · gamedeveloper · ssbwiki · dragdown · reddit ×2 · ldj.am
