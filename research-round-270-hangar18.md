# Hangar Part 18 (Final Verification) — Findings (Round 270)
**Date:** Wed 2026-10-15 ~02:43 EDT · **Source:** live web research (ray, nng, subset, hodent, fire emblem)
**Project:** Mecha Protocol — hangar (pre-jam; final verification)

## A. Mechanics
- Viability playthrough (Chevy Ray, 2× LD winner): "Finish early. I always finish Ludum Dare hours before the deadline, so I can submit it." Professional reading: a full fresh-player run of the whole loop (hangar → deploy → mission end) on a LOCKED build, hours before submission. Anything untested in the last build = broken.
- Five-second test (fivesecondtest.com): flash each card 5s, hide, ask: role name, HP/Move delta direction, weapon signature. Card fails, not the player.
- Freeze discipline: features stop, polish only, nothing new touches the build between the last playthrough and submission. The freeze has a TIMESTAMP, not a vibe.

## B. Validation
- 5-user gate (Nielsen): five fresh 3-minute hangar sessions (show card, pick squad, explain why) beat one long session. Multiple tiny rounds; stop when the same issues repeat.
- Preset honesty (Subset/Ma): "we would sacrifice cool ideas for the sake of clarity every time." Gate test: after reading a card, the player must predict the unit's battlefield behavior correctly. A "Brawler" that plays like a skirmisher fails honesty regardless of fun.
- Cut rule (Subset): when descriptions were too complex to communicate, they simplified the DESIGN, not the text. Jam: any hangar element that can't pass the five-second test in the final 48h gets removed or grayed out, not patched. "A removed feature can't confuse a judge."
- Commit audit (NNGroup error prevention): every commit the player didn't explicitly choose is an error-prevention failure. Enumerate all commit paths; each must be a labeled button/key, never selection/hover/timer.

## C. Techniques
- Full-disclosure cards (Into the Breach): "perfect information" as a UI constraint — the player must understand exactly what every unit will do before it does it. Deltas + signatures visible without hover/tooltip/drill-down.
- One-commit pattern (XCOM 2 / Fire Emblem): one unambiguous commit control ("Launch Mission" / "Fight") after free browsing. Montgomery reused the same squad-select flow across XCOM 2 modes for consistency. Fire Emblem's "Battle preparations" ritual separates browsing (free, reversible) from commit — decades of iteration prove the pattern.
- Honest labeling (Hodent): apply the scientific method — make claims about the design, then TEST them with players instead of assuming labels communicate.

## D. What to avoid
- Unfreezing after the gate (most common jam postmortem failure — last-hour changes are untested changes).
- Mislabeled presets (internal review never catches labeling lies — only watching playtesters does).
- Hidden stats (Into the Breach treats a hidden stat as a design bug, not a UI nicety).
- Implicit commits (deploy on selection/timer/unlabeled key).
- The decorative recommendation: a "recommended" badge that doesn't encode mission logic is WORSE than no badge — it teaches players to distrust the hangar. Cut or fix per the cut rule.

## E. Shipped
- Into the Breach (Subset 2018): squad-select shows complete loadout up front; perfect information; clarity = hard constraint ("sacrifice cool ideas for clarity every time").
- XCOM 2 (Firaxis 2016): class, rank, abilities, loadout per slot; one explicit "Launch Mission"; consistent across modes.
- Fire Emblem (Intelligent Systems): "Battle preparations" pre-battle screen in nearly every game — browsing vs commit separated by ritual.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** the recommendation is REAL logic, not decorative (anti-pattern #5 doesn't apply). Each preset carries `recFor: <missionIndex>` (Brawler→M1, Skirmisher→M2, Bulwark→M3); hangar.js:58 computes `recMission` from the current mission index; cards show "◆ FOR M<n>" for the match. The global ★ = Bulwark (default safe pick). Deploy button defaults to the recommended preset.
- **HANGAR-SPEC.md:** final verification (below). Spec only, +0 lines. **4,446 lines** (+0).

## F. Sources
ray · nng · subset · hodent · fire emblem · xcom
