# Hangar Part 19 (Verification Round 2) — Findings (Round 279)
**Date:** Wed 2026-10-15 ~03:51 EDT · **Source:** live web research (hodent, coates, toem, nng, into the breach)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 2)

## A. Mechanics
- Five-second test (fivesecondtest.com; NN/g): 5s view → unprimed recall ("What is this? What stood out? What is the primary action?"). For loadout: name the squad's job, recall HP/Move deltas, identify the deploy action. Measures hierarchy, scannability, icon clarity, affordance. If they can't — the card fails, not the player.
- Viability playthrough (gamedesign.gg): "can this preset, as built and as shown, actually complete the mission it is offered for?" For each mission, run the recommended preset (recFor) end-to-end on a timer. A recommended squad that can't clear its mission = a false promise, not decorative data — the mission or preset ships broken.
- Commit audit (NN/g): selecting vs committing must be visibly, mechanically different. Walk both explicit paths; log every state change vs preview. Any click mutating the deployed squad without explicit deploy/confirm = implicit commit = fail. Enter=deploy must be discoverable and reversible.

## B. Validation
- 5-user gate (Nielsen 2000): "Elaborate usability tests are a waste of resources. The best results come from testing no more than 5 users and running as many small tests as you can afford." ~85% of problems; iterative (test → fix → retest), not a one-time stamp.
- Preset honesty (Hodent): games UX = player understanding — "does the player know what they can do, what just happened, and what to do next." A "Bulwark" that dies to one hit = trust violation, not balance issue. Every number on the card must be literally true in the mission.
- Cut rule (TOEM postmortem): "Kill your darlings." Any card element failing validation gets cut, not polished. Decoration = a bug.

## C. Techniques
- Full-disclosure cards (Into the Breach): "perfect information" — difficulty in the decision, never in guessing the machine's intent. On-card deltas + signatures = this at squad scale. (XCOM 2 mod evidence: players mod full disclosure BACK IN when games hide it — the community proves the demand.)
- One-commit pattern (ItB): full information first, then exactly one explicit commit. Protect: never add a silent trigger (no click-to-deploy on card art, no auto-deploy on timeout).
- Honest labeling (JeremyTDM): clearer role labels reduce time-to-select (measurable). Role names must predict play pattern; signatures must name real weapon behavior; recommendations must come from verified recFor logic, never flavor text.

## D. What to avoid
- Unfreezing after the gate (gate is iterative; post-gate edits without re-test = void).
- Mislabeled presets (fastest trust-burn; Hodent's criterion).
- Hidden stats (ItB: "Nothing is hidden" — hidden decisive numbers = guessing, not strategy).
- Implicit commits (the audit exists to hunt these).
- Decorative recommendations (Coates/Hodent: a dark pattern — "manipulative UI destroys trust"). "A stale or hardcoded recommendation is indistinguishable from a decorative one to the player" — regression-test per mission.

## E. Shipped
- Into the Breach (Subset 2018): perfect information incl. squad/mech selection. Trusts every number on screen — the precondition for believable preset cards. (GDC 2019 postmortem, Davis.)
- XCOM 2 (Firaxis 2016): class/rank/abilities on squad-select; hard "Launch Mission" commit. The mod community modded convenience (not honesty) back in — the commit boundary was respected.
- Fortnite (Epic/Hodent): cosmetics-only store; Battle Pass rewards playing. Interface aligned WITH the player. The hangar analog: verifiable labels build the same trust.

## Implemented this round
- **VERIFIED (data read, no changes — frozen):**
  1. recFor coverage: all 3 missions have a recommended preset (no orphans). PASS.
  2. Preset honesty: Brawler = heavy/medium + blade/cannon (close-range, "wins at range 1-2") ✓; Skirmisher = light + rifle/missiles ("fastest," "dies to one focused burst") ✓; Bulwark = heavy + cannon/rifle ("survives ~2 extra hits," "slow") ✓. Loadouts match labels; descriptions state tradeoffs in consequence language (Doucet). No lies on cards.
- **HANGAR-SPEC.md:** verification round 2 (below). Spec only, +0 lines. **4,461 lines** (+0).

## F. Sources
hodent · coates · toem · nng · into the breach · xcom 2 · fortnite
