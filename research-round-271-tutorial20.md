# Tutorial Part 20 (Final Verification) — Findings (Round 271)
**Date:** Wed 2026-10-15 ~02:49 EDT · **Source:** live web research (mkoloch, nng, brouard, topielski, purdy)
**Project:** Mecha Protocol — tutorial (pre-jam; final verification)

## A. Mechanics
- Cold tissue protocol (mkoloch, SPHONGOS postmortem): hand the game cold ("Don't tell them anything about the game or how to play"), stay silent, never help, think-aloud only. Top takeaway: PLAYTEST as much and as soon as possible. The observer's silence is the instrument — every hint you give is a bug you're choosing not to file.
- Skip path as first-class (r/gamedev 2026, 180+ comments): skippers are the norm. Teach only the bare core loop; contextual just-in-time prompts; opener = low-stakes safe sandbox; re-openable tutorial/glossary as the safety net.
- Assist battery: test every toggle on/off in combination; offered at the friction moment, never forced; dismissing never punishes or blocks (Celeste model).
- Brouard (UX Collective): onboarding impacts acquisition, engagement, satisfaction, ratings, refunds, reputation. "We'll fix it with a tutorial" = red flag — the underlying UX is broken.

## B. Validation
- 5 fresh players (Nielsen 2000): ~85% of usability problems; after the fifth, diminishing returns. Jam: 5 genuinely fresh, in 2 rounds of 2–3, fixing between rounds — never batch all five then fix.
- Silent observation (mkoloch): no briefing, no mid-session help.
- One-word test: unaided word ("how did that feel?") immediately after the cold test, BEFORE the FFWWDD debrief. Captures the affective verdict fresh.
- Brouard's loop: peer review → design-team review → guerrilla → live — run tight, same day.

## C. Techniques
- Safe rooms (Brouard, BotW shrines): no time limit, no long-term punishment, short respawn, experimentation field. Audit the safe-room mission against all four.
- Offered-not-forced (Celeste Assist Mode, Thorson 2018): "challenging, but also accessible." Opt-in from the menu, offered at friction, never forced.
- Breadcrumb policy (Level Design Book): sparse, informational, never compulsory. "Most of this is wet bullshit until you verify it with a playtest."
- One sentence per beat (Topielski): "a single instructive sentence can make or break onboarding." The full tutorial is worth its cost for complex strategy — but prefer one sentence per beat over a rules page.

## D. What to avoid
- Unskippable intros (Purdy, Ars Technica 2023): "trust that your players know how to have fun, rather than verify it, every single time." Every beat skippable.
- Undismissable assist (gates progress = retention killer).
- Text walls (Topielski: "I know because I've written many such pages." Brouard: Northgard's contextual tips as the model).

## E. Shipped
- Into the Breach (Subset 2018): "sacrifice cool ideas for the sake of clarity every time" — the UI telegraphs every enemy action, so the interface IS the onboarding. Clarity-first eliminated the heavy tutorial.
- Celeste (2018): Assist Mode — offered-not-forced difficulty options, opt-in, no shame. Model for the assist battery.
- Elden Ring (2022): Cave of Knowledge so optional players walked past it. Tiers of engagement — real tutorial for those who want it, veterans ignore it. Shipped proof of the skip-path pattern.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):**
  1. One-sentence-per-beat (Topielski): all tutorial hints already one sentence ("Tap a blue mech, then a highlighted tile." / "Tap a red enemy, pick a limb, FIRE." / etc.). Satisfied.
  2. Safe sandbox (Round 184): player's first attack cannot overheat AND cannot miss (Celeste pattern). BotW-shrine criteria: no timer, no fail, no punishment, guaranteed success.
  3. Safety net (r/gamedev): re-openable help glossary exists (Round 24, btn-help → help-screen) — skippers who get stuck later can recover.
- **TUTORIAL-SPEC.md:** final verification (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
mkoloch · nng · brouard · topielski · purdy · into the breach · celeste · elden ring
