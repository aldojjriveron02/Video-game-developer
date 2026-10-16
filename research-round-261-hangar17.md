# Hangar Part 17 (Final Verification) — Findings (Round 261)
**Date:** Wed 2026-10-15 ~01:31 EDT · **Source:** live web research (yu, perfetti, subset, xcom, nng)
**Project:** Mecha Protocol — hangar (pre-jam; final verification)

## A. Mechanics
- Viability playthrough (Yu, "Finishing a Game" 2011): complete start-to-finish run (hangar → deploy → mission → back) — surfaces defects no isolated screen test can (a preset deploying into an unwinnable mission). Yu: "the last 10 percent is really 90 percent"; deadlines force hard decisions (point #8).
- Five-second test (Perfetti, mid-2000s; Smashing Mag 2023): show hangar 5s, hide, ask what they remember — presets, differences, how to deploy. Caveat: 5s isn't magical; don't over-fit to a stopwatch.
- Freeze discipline (Yu): #12 "SAVE IT FOR THE NEXT GAME" (new ideas written down, not implemented); #13 "CUT. IT. OUT." (cut until only provably-fun core); #14 "SCALE DOWN, NOT UP." Jam equivalent: after gate, no new card fields, no new presets, no rewording — bugfixes only.

## B. Validation
- 5-user gate (Nielsen NN/g): 5 users ≈ 85% of issues; 3 minimum (fewer risks spurious behavior); multiple small rounds > one big session. Gate = all 5 select, read deltas, deploy without prompting.
- Preset honesty (Subset/Justin Ma, Game Developer 2018): weapon descriptions rewritten after watching playtesters "investigate a weapon and fail to understand it." Rule: "we would sacrifice cool ideas for the sake of clarity every time." Hangar: on-card deltas + signatures must match in-mission reality; recommendation must point at the fitting preset.
- The cut rule (Yu): not provably working by the gate = cut, not fixed-forward. Two honest presets > three with one liar.

## C. Techniques
- Full-disclosure cards (Into the Breach): perfect information is the design pillar — Ma: the player "has to understand what's going on in any situation." No hover-to-reveal, no hidden stats.
- One-commit actions (XCOM 2, Hannah Montgomery): room construction shows a projection BEFORE the player commits resources — selection is preview, commitment is a separate explicit act.
- Honest labeling (Subset): labels describe what the thing DOES, not flavor. "Skirmisher" = fast/fragile on card AND in mission; if a name promises what numbers don't deliver, rename or restat, never decorate.

## D. What to avoid
- Unfreezing after gate (classic jam killer — late additions break what was verified; post-freeze edits void the gate and require re-running all checks).
- Mislabeled presets (if two testers misread "Bulwark" as the fast one, the label is wrong, not the testers).
- Hidden stats (fails the five-second test by construction; forces memorization).

## E. Shipped
- Into the Breach (Subset 2018): squad/mech selection shows HP, movement, weapon loadout per mech; perfect-information; clarity = non-negotiable constraint ("sacrifice cool ideas for clarity every time").
- XCOM 2 (Firaxis 2016): squad-select shows class, stats, loadout; layout reused across modes; UI added only from playtesting; pre-commit previews. Consistent layout + playtest-driven additions + selection≠commit.

## Implemented this round
- **AUDITED (code read, no changes — frozen):** commit paths = exactly two, both explicit: the labeled "▶ Deploy — [preset]" button and the Enter key (Round 234, unbound on close). Preset-card clicks select-and-return (apply loadout, close to hangar) — they do NOT start the mission. Mission commit = btn-deploy → nextMission(), one explicit path. No click-through, no double-select quirk. The XCOM pre-commit-preview pattern, verified.
- **HANGAR-SPEC.md:** final verification (below). Spec only, +0 lines. 4,433 lines (+0).

## F. Sources
yu · perfetti · subset · xcom · nng
