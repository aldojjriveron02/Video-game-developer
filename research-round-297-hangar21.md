# Hangar Part 21 (Verification Round 4) — Findings (Round 297)
**Date:** Wed 2026-10-15 ~05:32 EDT · **Source:** live web research (lyssna, jeremytdm, cox, harrison, bycer, raj)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 4)

## A. Mechanics
- recWhy audit (Lyssna): the "why is this recommended?" justification test as a five-second test — show the hangar 5s, hide, ask "why was that squad recommended?" If a fresh player can't answer, it's decorative. Pair with first-click tests ("click where you'd deploy") + think-aloud protocol (narrate why the recommended squad fits while selecting).
- 5-user gate (NNGroup): "testing with 5 users finds almost as many usability problems as testing with many more (~85%)." "Elaborate usability tests are a waste of resources — the best results come from testing no more than 5 users and running as many small tests as you can afford." For the hangar: 5 fresh players, one small focused round, fix, second small round. Not one giant playtest.
- Commit timing (JeremyTDM): time to select, drop-off before game start, selection confidence (1–5). "Faster and more confident selections" from "clarity of character roles, visual hierarchy, interactive elements." The under-30s pick = a directly measurable ship-gate. Drop-off before first battle = the hangar's failure signal.

## B. Validation
- Fresh players (Cox): "not all feedback is equal: consider the source." Test with players who've never seen the game — the five-second test only works with truly fresh eyes.
- Targeted questions (Cox): "match questions to stage of development." Two scripted layers: (a) fixed (why is this squad recommended? what's its weakness?), (b) dynamic probes on hesitation/misclicks.
- Testing consistency (Cox): written script — same intro, same mission brief, same rec shown. "The worst case is forgetting to mention an important rule, which biases the test."
- Flow timing (Cox; JeremyTDM; Lyssna): measure hangar time-to-commit end to end. "Selecting a character, customizing it, and navigating the controls" = the onboarding flow.
- Prototype fidelity (Cox): polished UI gets polish feedback; don't ask stat-balance questions on gray-box. Match verification to the phase.

## C. Techniques
- Preset squads as difficulty self-selection (Harrison, Into the Breach): "Each time you attempt Into the Breach, you're asked to choose a squadron of mechs... The mechs you choose drastically change how complex the game becomes." "Choose your difficulty. Then choose it again. And again… You are given modifiers relative to your team." The preset choice IS the player's difficulty/experience calibration.
- Honest tradeoffs (Mario + Rabbids): pre-battle select differentiates by "how they do damage and their roles." recFor/recWhy in the same register: what this squad is FOR + what it sacrifices.
- Explainable recs (Bycer): "a good UI must improve the player's understanding of the game mechanics." "Being able to learn through the UI is important." A recommendation the UI can't teach = decorative.
- One-tap commit (Harrison; Montgomery): Into the Breach "doesn't give you an overbearing tutorial, or constant tooltips… it trusts [players]… as a result, you feel smart." Single confident action, clear consequences, not a multi-step interrogation. XCOM 2's squad select reused verbatim in multiplayer — "consistent across all game modes." Don't redesign commit semantics between jam and full hangar.

## D. What to avoid
- Decorative recs: the recWhy audit (five-second test) = the detection mechanism. If the reason can't survive 5 seconds, it's decoration.
- Hidden stats (Bycer; Raj): "UI should inform the player as to what's going on, less time flipping between screens is key." "Balancing information with immersion… While avoiding unnecessary clutter should be a guiding principle, the key word here is 'unnecessary.'" Any commit-relevant stat must be visible at commit time.
- Unfreezing (Bycer; NNGroup): Planetary Annihilation — "so much of the game's information was spread around the screen requiring split attention." Late UI churn = scattered-information regression. Freeze after the 5-user gate; only ship-blockers reopen.
- Scope creep (Cox): "match questions to stage of development." Define ship-blockers before the round, not after.

## E. Shipped
- Into the Breach (Subset): named 3-mech squads (Rift Walkers, Rusting Hulks, Zenith Guard) with distinct mechanical identities + explicit complexity/reward profiles. "The squad choice is self-calibrating difficulty and playstyle in one tap ('Choose your difficulty. Then choose it again. And again')." Perfect-information from squad select into mission UI. Direct model for Brawler/Skirmisher/Bulwark + recFor/recWhy.
- XCOM 2 (Firaxis): full pre-mission select — every soldier's stats, class, loadout visible; explicit tradeoffs; same UI in multiplayer. "Perfect information at commit time (no hidden stats), and consistency across modes." Direct model for the full hangar Phase 2.
- Mario + Rabbids (Ubisoft): pre-battle team comp, each hero differentiated by role + damage type at selection. "Three-choice legibility — a small set of sharply differentiated picks beats a large roster of muddy ones." Direct model for the 3-preset jam hangar.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** the UI does NOT imply a tier list. ★ RECOMMENDED (Bulwark) = the safe pre-selected default for one-tap commit ("Safest first pick"). ◆ FOR M<n> = the mission-optimal pick (varies by mission: Brawler for M1, Skirmisher for M2, Bulwark for M3). These are DIFFERENT presets on different missions — "default vs situational," not "best vs rest." The big deploy button = the "I don't want to deliberate" path; the cards = the "I want to optimize" path. (LoL's recommended-vs-situational pattern; Harrison's "choose your difficulty" — the preset choice is self-calibration.)
- **HANGAR-SPEC.md:** verification round 4 (below). Spec only, +0 lines. **4,511 lines** (+0).

## F. Sources
lyssna · jeremytdm · cox · harrison · bycer · raj · into the breach · xcom 2 · mario rabbids
