# Tutorial Part 11 (Jam & Validation) — Findings (Round 193)
**Date:** Wed 2026-10-14 ~18:58 EDT · **Source:** live web research (eastshade, devtodev ×2, bugnet ×7, extracredits, wiki ×3, designthegame)
**Project:** Mecha Protocol — tutorial (Phase 3, pre-jam)

## A. Jam tutorial
- Eastshade (Kleenex: zero guidance; breadcrumbs; in-person > remote).
- Bugnet (teach through play; trust behavior). Extra Credits (first 5 min).

## B. Validation
- devtodev (completion rate; D1 25-40%; funnel; aha moment).
- Bugnet (step events + step_index; automated E2E). Time-to-first-action.

## C. Techniques
- Atomic skip (one function, full state, save). Hint discipline (once + cooldown).
- Prompt hygiene. Persistence (never re-trigger). No hard gates. Race hardening.
- Celeste (intent matching). KTANE (skill-grouped).

## D. What to avoid
- Text dumps. Half-set skip. Spam prompts. Re-triggering. Softlocks.
- Unmeasurable funnel. Remote unpolished testing.

## E. Shipped
- Baba Is You (Nordic Jam). Celeste (PICO-8). KTANE (GGJ 2014).

## Implemented this round (code)
- **js/tutorial.js:** atomic `skip()` + Skip button on coach mark.
- **TUTORIAL-SPEC.md:** teach-ready decision + Kleenex protocol.
- 4,127 lines (+15).

## F. Sources
eastshade · devtodev ×2 · bugnet ×7 · extracredits · wiki ×3 · designthegame
