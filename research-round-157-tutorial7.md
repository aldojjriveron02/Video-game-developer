# Tutorial Part 7 (Jam & Validation) — Findings (Round 157)
**Date:** Wed 2026-10-14 ~16:35 EDT · **Source:** live web research (gamedeveloper ×4, gmtk, gamedesign.gg, emhance, mainstream404, blogofarcanesecrets, steamcommunity, jumpintogaming)
**Project:** Mecha Protocol — tutorial (Phase 3, pre-jam)

## A. Jam onboarding
- Liu (4-step pipeline; stuck at steps 1-2; static text ignored; in-world cues).
- Adams (learning-by-doing; 1:14 ceiling). Wawro (teach one verb; defer).
- PUNCHev (60s window; stall-points, time-to-first-win, completion).

## B. Validation
- GameDesign.gg (start/step/exit funnel; second-session rate; two-antenna rule).
- Emhance (6 users; FTUE leverage). Valve/Brown (weekly; silent; "don't look up").
- Liu (eye-tracking = stuck-point method).

## C. Invisible tutorial
- SMB 1-1 (safe screen; happy accidents; practice-test pairs; hidden 1-up).
- Liu (contrast markers; hand-drawn arrows; audio+visual). Wawro (as-needed unlocks).

## D. What to avoid
- Adams' 8 traps (forcing; text walls; bad refs; abandoning; punishing;
  patronizing; forcing completion; no tutorial at all).

## E. Shipped
- Portal (weekly playtests; GLaDOS = antagonist-as-teacher — VEX is ours).
- ItB (telegraphed intents; once-per-battle reset). VS (minimal onboarding).

## Implemented this round (code)
- **js/tutorial.js:** tutorial:start funnel event.
- **js/game.js:** tutorial:exit (M1 clear) + tutorial:stuck:<step> per-episode event.
- **TUTORIAL-SPEC.md:** jam tutorial decision + funnel + invisible beats + VEX-as-teacher.
- 3,799 lines (+16).

## F. Sources
gamedeveloper ×4 · gmtk · gamedesign.gg · emhance · mainstream404 · blogofarcanesecrets · steamcommunity · jumpintogaming
