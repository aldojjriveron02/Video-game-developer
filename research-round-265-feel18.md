# Feel Part 18 (Final Verification) — Findings (Round 265)
**Date:** Wed 2026-10-15 ~02:03 EDT · **Source:** live web research (lovato, thorson, fiedler, nystrom, nijman, valdemir)
**Project:** Mecha Protocol — feel (pre-jam; final verification)

## A. Mechanics
- Re-measure (Lovato's central rule): juice must reinforce existing core mechanics, applied deliberately — never random. Final-48h re-measure = stopwatch ledger: hit-stop ms per event, trauma added per event, particles per event, summed per second vs the 0.35s/sec hard cap. The before/after format = "Juice it or lose it" (Jonasson/Purho GDC 2012) — diff against a stripped control, never eyeball absolutes.
- A/B protocol: fixed build hash, fixed script, fixed questionnaire; run once, then freeze. The blind A/B result is only meaningful against a frozen build — tuning after = measuring a different game.
- 60fps floor (Fiedler "Fix Your Timestep" 2004): variable delta + heavy frame = spiral of death. Fix: fixed/semi-fixed timestep with capped delta. Stress the FULL juice budget on the floor device, not the dev machine.

## B. Validation
- Blind A/B lineage: no canonical paper, but the before/after comparison demo is the field's gold standard since 2012 (S8); Lovato validates via paired comparisons (foundation vs juiced). Rig: ✦ vs ◐/✧, raters blind, fixed script, "which felt better" + free-form. Run once at feel-lock.
- Rater-first-impression (Thorson "Celeste & Forgiveness" 2018): coyote time + jump buffering exist because first contact decides perceived control quality — "did the game read my input?" Protocol: silent first-30s observation, then "describe the combat in one word." "Snappy/heavy/crunchy" unprompted = juice working; confusion/mushiness = no trauma budget fixes it.
- Budget alarm (Nijman trauma model): trauma 0–1 reservoir; offset = trauma² × max; decays linearly. The alarm = QA instrumentation of the model: log trauma/sec + hit-stop ms/sec per encounter, flag over-cap moments. Hard numeric limits, not vibes.

## C. Techniques
- Hit-stop ladders (Valdemir 2026): 60–80ms freezes on impact, tiered by event weight (bigger hit = longer stop). Lovato: "pausing the game for a split second" reinforces collisions. Discipline: fixed documented rungs; the biggest moment in a combo is unambiguous; total stop-time is in the per-second budget.
- Trauma-based shake (Nijman 2013): single trauma 0–1; add on impacts; offset/rotation from trauma² (small hits tremble, big hits convulse); linear decay. The squaring IS the budget curve; one global reservoir prevents shake-stacking chaos.
- Prewarmed pools (Nystrom): particles = the motivating example. Tune to peak usage; prewarm at load (spawn/despawn once during loading); exhaustion policy = DROP the spawn. Never allocate in the combat hot path.
- Squash/stretch (Valdemir via Disney/Mario World 1990): squash in ANTICIPATION (before motion), stretch ALONG the motion vector during it; scaleX/scaleY in opposition; volume preserved. Inconsistent/omnidirectional squash reads "mushy," not juicy.

## D. What to avoid
- Post-A/B tuning (measured a different game).
- Juice creep after lock (Lovato: juice on non-core mechanics dilutes everything — 0.35s/sec silently becomes 0.6s/sec).
- Unfrozen feel changes (foundations first; final 48h = crash/perf fixes only).
- Frame drops on rater devices (spiral of death + allocation: dropped frames read as bad feel, not "more juice").
- Ignoring reduced-motion (Valdemir: matchMedia pattern; toggle without OS signal = a11y miss + rater risk).

## E. Shipped
- Celeste (2018): forgiveness (coyote, buffering, halved apex gravity, corner correction) + layered juice (dash: ~4 frames hitstop, directional shake, squash along trajectory, afterimages, wake particles). Control reliability first, spectacle second.
- Nuclear Throne (Vlambeer 2015): trauma reservoir — camera shakes with combat rhythm; squared curve self-balances, no per-scene tuning. The design ancestor of the trauma² budget.
- Super Mario World (1990): anticipation-only squash before jumping — one disciplined rule taught the industry that anticipation sells weight better than post-impact decoration.

## Implemented this round
- **VERIFIED (code read, no changes — pre-freeze):**
  - Hit-stop ladder vs the 60–80ms band: base 40ms × 0.7–1.5× weapon multipliers = 28–60ms (light rung); heavy hits 80ms; kills 80ms; special 150ms (capped 200ms). Monotonic: 28 < 40 < 50 < 60 < 80 = 80 < 150. Heavy/kill moments sit exactly at 80ms (Celeste's ~4-frame dash stop ≈ 67ms — same ballpark). Sakurai's rule satisfied: bigger hit = longer stop.
  - Spiral-of-death guard: frame delta capped at 50ms (game.js:1812). Fixed-delta discipline in place.
- **FEEL-SPEC.md:** final verification (below). Spec only, +0 lines. 4,442 lines (+0).

## F. Sources
lovato · thorson · fiedler · nystrom · nijman · valdemir · jonasson · swink
