# Hangar Part 20 (Verification Round 3) — Findings (Round 288)
**Date:** Wed 2026-10-15 ~04:55 EDT · **Source:** live web research (kuric, nielsen, hodent, kraj, into the breach)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 3)

## A. Mechanics
- Five-second test (Perfetti; Kuric 2023): measures first impressions — what players perceive, not deep usability. Attitudes crystallize in LESS than 5 seconds; visual complexity demands MORE exposure (10s+ for dense stimuli). For the hangar: longer exposure + targeted questions ("which squads can you choose between?" not "describe everything"). Don't apply naively to complex UIs.
- Viability playthrough: the internal term for "can each preset actually win." Nearest pro practice: playtest-driven balance validation. Into the Breach GDC 2019: 4 years of iteration ending in explicit "final balancing decisions," systems validated by full playthroughs. r/gamedev: "If you don't playtest the game, it's impossible to know how it feels and if it's balanced." Minimum: one complete winnable run per preset.
- Commit audit: the internal term; nearest = pre-ship QA change control + jam freeze discipline. After freeze, every proposed change checked against the spec (stats, copy, flow) — rejected or re-tested if it alters any of the three.

## B. Validation
- 5-user gate (Nielsen 2000): "test no more than 5 users and run as many small tests as you can afford" — ~85% of problems surface with 5. Hangar: 5 fresh players, 5-second exposure + one task ("pick a squad"), fix, repeat.
- Under-30s pick (FTUE literature): Crossy Road analysis — "the first 30 seconds of a user's interaction with your product is the most important"; game-developers.org — FTUE "determines Day 1 retention"; Veremiev — "the first 30 seconds set the emotional tone." Hangar-open to committed pick in <30s = a legitimate industry-grounded gate.
- Honesty checklist: the project's term (stats shown = stats in game; tradeoffs real; recommendation reason visible). Grounded in Hodent's "teach the why" + Into the Breach's perfect-information philosophy. Home-grown — its value comes from the audit, not an external standard.

## C. Techniques
- Preset squads: GameDesignSkills — MOBA "Recommended" tab filters to "only the items most beneficial for the hero" because the full mass "is too much to manage as a new player." Hodent: in learning mode, 3 simultaneous items = the maximum. The 3-preset design lands exactly on the cognitive limit.
- Honest tradeoffs (Kraj): "If everything is important, nothing is important." Per-context display — each card shows only its decisive stats; tradeoffs symmetric and real (strength + visible cost). Dota 2's 3–4 category comparison = the shipped pattern.
- recFor logic (Hodent): "teach the why" — the rec must surface its criterion ("recommended for aggressive play: highest burst, lowest HP"), not a bare badge. GameDesignSkills' tab works because it's tied to a stated beneficiary, not decoration.
- One-tap commit (Kraj): minimize eye-travel; one dominant commit CTA adjacent to the cards, no intermediate dialogs. Pick-to-commit = a single flow, not a menu tree.

## D. What to avoid
- Decorative recommendations: a "recommended" badge with no stated reasoning = UI decoration. Every rec must name its logic (recFor) or be removed.
- Hidden stats: Into the Breach's perfect-information UI — showing exact outcomes builds trust. Any stat affecting the pick but not shown (or shown inaccurately) breaks the checklist.
- Unfreezing: Into the Breach's postmortem = 4 years of cutting, not reopening. Reopening invalidates the five-second test + viability playthroughs.
- Scope creep (arimia): "Nothing to show for their work, because the scope creep was too large and killed the entire project." Full hangar = Phase 2. One Phase 2 feature in the jam hangar = the canonical failure.

## E. Shipped
- XCOM 2 (Firaxis): reused the single-player squad-select in multiplayer — "consistent across all game modes." Iteration via playtest observation, not opinion.
- Into the Breach (Subset): 3-mech squad presets (Rift Walkers, Rusting Hulks, Zenith Guard) with distinct playstyle identities + plain-language descriptions. Deterministic perfect-information UI = the description is a CONTRACT the game honors. Years of cutting produced a tight roster where every option is viable — the viability-playthrough ideal.
- Dota 2 (honorable mention): hero-select compares across 3–4 categories so a new player decides in seconds. The 3-category trick the preset cards should steal.

## Implemented this round
- **TEACH THE WHY (js/data.js + js/hangar.js, Hodent):** the ◆ FOR M<n> badge said WHICH mission, not WHY — a decorative recommendation. Added `recWhy` to each preset:
  - Brawler: "M1 is close-quarters — wins at range 1-2"
  - Skirmisher: "M2 is open ground — speed decides it"
  - Bulwark: "M3 is the VEX duel — survive ~2 extra hits"
  The badge now renders the criterion VISIBLY inline (not a hover tooltip — no hover on touch). Verified: all 3 present, renders inline. +3 → **4,498 lines**, all clean.
- **HANGAR-SPEC.md:** verification round 3 (below).

## F. Sources
kuric · nielsen · hodent · kraj · into the breach · xcom 2 · dota 2
