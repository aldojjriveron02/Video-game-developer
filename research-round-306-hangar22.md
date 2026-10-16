# Hangar Part 22 (Verification Round 5) — Findings (Round 306)
**Date:** Wed 2026-10-15 ~06:07 EDT · **Source:** live web research (perfetti, bailey, sauro, nng, deceptive.design)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 5)

## A. Mechanics
- Five-second test (Perfetti; Smashing): "participants need ~2–3 s for attitude-level questions but longer for memory-dump questions." Lindgaard: 50ms first impression. Nielsen: ~10s to communicate the key message. Hangar: "what is this screen for and what do you do here?" → "pick a squad, then launch."
- First-click test (Bailey & Wolfson 2009): "87% chance of task success when the first click is right." Optimal Workshop: "first clicks predict ~70% of task success; correct first clicks correlate with 3× higher success." Hangar: first click lands on a preset or commit control — elsewhere = layout fails.
- Confidence metric (Sauro, MeasuringU): post-task 1–7 scale. Mean 5.7, median 5.8; "a score of 5 is only the 20th percentile." Critical combo: "disasters" — high confidence + task failure (e.g., confidently committing the wrong squad). Target: median ≥6, zero disasters.

## B. Validation
- Think-aloud (Game Developer): player narrates while playing — "surfaces the 'why' behind hesitation and misclicks."
- Fast-cycle scripted rounds (UXR Institute): playtests every 1–2 weeks; exploratory (open-ended, problem unknown) vs evaluative (task-based, success criteria, candidate fix). Hangar: scripted evaluative — "pick a squad for this brief, commit in under 30s."
- Small samples, with caveat (NN/g; ResearchGate): "5 users is a per-round floor for formative fixes, not a summative guarantee." The 5-user gate = recurring, not one-shot certification.

## C. Techniques
- Honest presets: "genuinely different and fairly presented." Counterpoint: "games making the user think they can win" (near-miss deception). Brawler/Skirmisher/Bulwark "should each win some missions and lose others."
- Visible tradeoffs (XCOM 2): class, rank, full ability lists on the select screen — "information needed to judge a pick is present before commit, not hidden behind it."
- Consistent commit (Montgomery): XCOM 2 reused single-player select for multiplayer — "squad selection would be consistent." Commit semantics identical across contexts.
- No dark patterns (deceptive.design; NN/g): Nagging, Obstruction, Sneaking, Interface Interference, Forced Action; confirmshaming. Back/decline controls must not shame reconsidering.

## D. What to avoid
- Fake choices ("illusion of choice"): "A ◆ 'mission-optimal' tag is a fake choice if the game always rewards the same preset regardless of mission."
- Hidden information: "burying enemy composition or win conditions until after commit makes the pick a guess."
- Confirmshaming (EULE): "emotional manipulation that pressures opt-in." Commit copy must stay neutral.
- Post-freeze churn: "letting players re-tweak squads after commit via sunk-cost pressure, or nudging re-pick through loss-aversion timers — once committed, the decision should stand."

## E. Shipped
- XCOM 2 (Firaxis): class/rank/abilities + loadout editing pre-commit; select reused SP→MP. "All decision-relevant info visible before commit; the commit contract never changes."
- Into the Breach (Subset): pre-built named 3-mech squads, distinct identities, clear tradeoffs. Davis (GDC 2019): "board-game-inspired design with small, easy-to-understand, meaningful numbers — transparency as a design value."
- Fire Emblem (IS): "Preparations" menu — "Pick Unit: Select which units to field." "Deployment is a stable, predictable ritual — same screen, same rules, every chapter."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** the ◆ tag is NOT a fake choice. Three different presets for three missions: Brawler→M1 ("close-quarters — wins at range 1-2"), Skirmisher→M2 ("open ground — speed decides it"), Bulwark→M3 ("VEX duel — survive ~2 extra hits"). Each recWhy cites mission characteristics visible in the hangar. The tag varies; the reasons are grounded. (data.js:45-54)
- **HANGAR-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
perfetti · bailey · sauro · nng · deceptive.design · xcom 2 · into the breach · fire emblem
