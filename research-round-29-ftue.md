# FTUE & Interactive Tutorial Design for Tactics Games — Findings (Round 29)
**Date:** Tue 2026-10-13 ~22:53 EDT · **Source:** live web research 2026-10-13 (Game Developer, CHI 2012, r/gamedev, PUNCHev, Ars Technica, Bugnet, PC Gamer, DoonDookStudio)
**Project:** Mecha Protocol — the first 60 seconds, engineered

## A. Tutorial patterns
- **Invisible tutorials** (5 methods): affordances (design teaches itself — ItB's perfect-information timeline), skill gates (teach before progression needs it), demonstrative (game shows the skill), trial-and-error (safe rooms), context-sensitive (teach in context). Fail on advanced/novel skills — those need explicit instruction.
- **ItB:** perfect information at every decision (reason, don't memorize); squad choice = difficulty choice; no overbearing tutorial — trusts the player.
- **Fire Emblem:** early chapters ARE the tutorial arc (FE7 Lyn mode ~10 chapters; FE12 prologue; FE8 Eirika). Best tutorials don't force themselves; players hate tutorial arcs that segue into a level reset.
- **XCOM 2:** first-hour story mission teaches new factions by playing against them. "Hard games should not have hard tutorials."

## B. Contextual vs front-loaded (Andersen et al., CHI 2012 — 45,000+ players)
- Tutorials boost engagement in COMPLEX games; no effect or negative in simple ones. Context-sensitive just-in-time help boosted play time in the complex game. **Forced movement restriction helped NOTHING.** Optional on-demand help: good for complex, bad for simple.
- "Information acquired at the moment of need is encoded with context. Information dumped upfront becomes noise." / "Players don't hate reading; they hate reading text that's not relevant."

## C. First 60 seconds
- **Most games lose players in the first minute** — menus, sign-in, tutorial-explains-before-playing. Rules: one decision at a time; first win FAST; teach by doing; default = good path; feedback on everything; respect veterans; test the first 60s hardest. **Top quit reasons: confusion, not difficulty.**
- ~15 min to show the core loop (Bycer). Browser bar: time-to-first-playable-moment in SECONDS.

## D. Progressive disclosure (teaching order)
- Just-in-time; reveal the loop at the right pace; tips reviewable later (glossary = archive).
- Our order: (0) premise, one sentence → (1) select+move → (2) attack w/ visible payoff → (3) heat-as-bet as the first "aha" (M1) → (4) per-limb + positioning + hangar + drafts (M2+). Withhold anything unusable within 60s.

## E. Failure-safe
- **Undo as teaching tool** (Old World borrowed Ctrl-Z): every mistake = free experiment. Make it free, instant, visible.
- **ItB:** define failure downward — mechs expendable, pilots persist; the real fail-state protects experimentation.
- Allow mistakes; NO forced-click railroading (teaches nothing). Hints on detected struggle, not timers.

## F. Tooltips & coach marks
- **Animated > static** (motion draws eyes — independent confirmation of our earlier finding). One at a time. Guide through a test run instead of tooltips. Dynamic prompts pointing at real UI; disappear when done. Glossary = last resort.

## G. Skippability
- Good: Fallout NV (ignorable), BG1 (walk away), Elden Ring (optional cave), Witcher 3 (skip sections). Bad: BL2, Death Stranding, FFXIII, KH2, Pokémon S/M. "Trust that your players know how to have fun."
- **Bugnet trap:** skip buttons that only hide UI leave half-set state — route skip through the same finalization. FE7's forced replay tutorial = "crime against humanity."

## H. Tutorial metrics (the playtest-gate battery)
- Tutorial completion per step; game start rate; time to first playable moment; drop-off funnel; difficulty spikes; Day 1 retention.
- **Minimum viable:** coach-mark completion/step, time-to-first-win M1, M1→M2 continuation, undo usage rate, glossary opens per topic (topics opened often = tutorial failed there).

## Applied to Mecha Protocol (implement-immediately, this round)
- **New `js/tutorial.js`:** M1 coach marks (move → attack → heat → undo) as animated bottom-sheet + pulsing canvas target ring; event-wired (onMove/onAttack/onTurn), "Got it" dismiss, per-step telemetry (`tutorial:step:show/done`).
- **Veteran ask** on first boot: "Show me the ropes" / "I know tactics — skip it" (persisted; skip = same mission + same rewards, Bugnet-safe).
- **M1 training wheels:** enemy damage halved (min 1) on mission 1 — un-losable but not railroaded; M1 briefing says so ("practice rounds — they hit soft").
- **Telemetry:** `tutorial:choice`, `tutorial:step:*`, `mission:start:<n>` (M1→M2 continuation now measurable).
- Verified in harness: ask flow, veteran persistence, key resolution (en+ja), handicap math. 1,938 lines, all syntax-clean.

## I. Sources
gamedeveloper.com (invisible tutorials; ItB failure; Bycer onboarding) · blog.prototypr.io (ItB UX) · grail.cs.washington.edu (CHI 2012) · reddit.com/r/gamedev (petrucio onboarding) · punchev.com (first 60 seconds) · uxdesign.cc (Dzyubina) · arstechnica.com (skippable tutorials) · bugnet.io (skip-button trap) · pcgamer.com (undo in strategy) · doondook.studio (HTML5 metrics) · reddit.com/r/fireemblem (tutorial arcs)
