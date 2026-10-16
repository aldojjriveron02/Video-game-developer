# Mecha Protocol — Wave-0 Playtest Plan (Round 49)
**Gate:** "is it fun?" · **Status:** ready to execute — needs itch.io account (Aldo's hand)
**Method:** remote unmoderated, 5 strangers, 30-min cap, "play mission 1 cold"

## Who (5 strangers, 0 friends/family)
- Screen: "what's the last tactics game you finished?" (Into the Breach / Fire Emblem / Advance Wars / XCOM / BattleTech / Front Mission players)
- Recruit 8 to land 5 (no-show buffer). Fresh players each wave — never retest.

## Where
1. r/playtesters — offer a playtest trade (reciprocity posts work)
2. Game forums via "<game> + forum/help/stuck" search — engaged players (Bromley method)
3. NOT game-dev forums (too hardcore), NOT friends (too nice)

## How
- Unlisted itch.io browser build (zero install) + limited keys; wharf binary patching for wave-1 updates
- Google Form survey linked from the build's victory screen (create when wave 0 launches)
- Incentive: credit in game + a pilot/mech named after each tester + playtest trade
- Build versioned + timestamped events (wave-0 vs wave-1 separable)

## Survey (send immediately after; pilot on 1 person first)
- **Fun measurement (Bromley, Round 75):** 1–10 rating PER MISSION ("which mission was most fun, and why?") + why-interview. Benchmark across missions, never average into a single "fun score" (Hopson). Pair with telemetry proxies (completion rate, abandon, voluntary replay).

## Protocol (RITE discipline — Round 75)
- **Blind:** zero coaching during play. Observers sit back, record, take notes. No helping, no hints.
- **Fix between sessions, never during.** One tester fully blocked = note it, fix after their session.
- **Neutral questions only:** "what happened just now?" not "was the heat system confusing?"
- **Don't ask what they want** — mine behavior + words for the underlying problem.
1. What was your favorite moment or interaction?
2. What was your least favorite moment or interaction?
3. When did you feel the most clever?
4. Was there anything you wanted to do that the game wouldn't let you do?
5. If you had a magic wand and could change anything, what would it be?
6. Would you boot this up again tomorrow? (behavior, not opinion)
7. Can I email you when the next build is ready? (commitment test — a yes costs something)
8. Overall, how was the game? (1–5 + "why?")
9. What's the last tactics game you played? (sampling check)
Rules: broad → specific; no leading questions; no yes/no; no "would you pay/buy".

## Reading n=5 (qualitative, not quantitative)
- Pothole rule: ONE tester fully blocked (>3min stuck) = fix immediately, no quorum needed
- Design changes need ≥2 testers hitting the same problem
- Completion % and averages are noise at n=5; median TFA + funnel drop-off locations are pointers only
- Log every decision with evidence: "2/5 stuck in hangar >3min → simplify loadout step"

## Decision rules
- **PASS** (all gate criteria met): open the build wider — public itch page, beta branch
- **ITERATE** (criterion fails, fixable cause in ≥2 testers): fix ONLY that, ship via wharf, wave 1 with 5 fresh testers within 2 weeks
- **SUNSET** (still fails after wave 2, or wave 1 shows no improvement): stop — cut scope or kill, no wave 3
- Never add features during the gate — only remove friction and clarify

## Gate criteria (measurable)
≥4/5 complete M1 unprompted · median time-to-first-action <90s · zero >3min stuck · ≥3/5 name a favorite moment + want to continue · intentional heat/undo use observed

## Recruiting post draft (r/playtesters)
**[Playtest trade] Browser mecha tactics prototype — 15 min, feedback for feedback**
> Hey! I built a free browser tactics game (3v3 grid combat, mech-building hangar, anime mecha style). Looking for 5 players for a 15-minute cold playtest of mission 1 — no install, runs in your browser.
> Happy to playtest your game in return, and every tester gets a credit + an in-game pilot named after them.
> Tactics fans especially welcome (Into the Breach / Fire Emblem / Advance Wars players). DM me and I'll send the link + a 2-minute survey.

## Timeline
Week 1: itch.io account → unlisted build + keys → post recruiting → survey form live
Week 2: run wave 0 (5 testers) → read results → PASS / ITERATE / SUNSET decision
