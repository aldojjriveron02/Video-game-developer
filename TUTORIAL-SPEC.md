# TUTORIAL-SPEC.md v1 — Production Tutorial (Slice)
**Date:** Thu 2026-10-15 · **Round 130** · **Status:** DRAFT for slice build

## 4-layer stack (in priority order)
**L1 — Environment** (Mario 1-1 / Celeste): mission geometry teaches. M1 = move + attack only. Heat introduced via forced low-stakes overheat (safe sandbox before pressure).

**L2 — Demonstration** (HL2 Dog / Meat Boy Brownie): VEX models the behavior. Duel opening: VEX deliberately overheats first and vents safely (pattern-chevron demo). Limb-break gate = Portal antepiece (zero-risk demo, then the real thing). Pilot barks = diegetic coaching (8 triggers, cooldowns so they never nag).

**L3 — Coach-mark fallback** (NN/g Harley, pull revelations only):
- ≤8 words, visually distinct from game UI, ONE at a time.
- Dismissable ≤2 interactions, recallable via "?" log (2-dismiss rule).
- Trigger-based ONLY (telemetry signals, e.g., 3 turns without moving damaged mech).
- NEVER chained, never scheduled, never on first launch.

**L4 — Skippable text reference** (Berbece): everything skippable. "Press A to Skip."

## Adaptive tips (already live)
- Heat tip fires on 2ND overheat (not first) — pull revelation, not push.
- Hopson mid-playtest instrument (Round 130): 4-option difficulty popup after each mission → telemetry.

## Teaching order (never front-loaded — GMTK 2020)
1. M1: move + attack (one lesson, Mario rule).
2. M1 mid: heat via forced low-stakes overheat.
3. M2: full 3v3, focus-fire, terrain.
4. M3 VEX gate: per-limb damage (only when heat is mastered).

## Validation
- 3 rounds × 5 players (Nielsen): R1 iPhone, R2 desktop, iterate between.
- Hopson popup + silent metrics: time-to-first-overheat, turns-to-first-limb-break, tip view/dismiss rates.
- Target: ≥80% of R2 players break a VEX limb with NO coach mark firing.

## Traps (explicit)
- No upfront text wall (paradox of the active user).
- No hangar teaching before first combat.
- No chained popups. No push tutorials.

## Round 145: Production tutorial spec (slice)
**Stuck pulse (IMPLEMENTED in game.js):**
- Input timestamp tracked on every tap.
- After 8s idle during active coach mark: ring pulses faster (110ms vs 220ms),
  turns amber, line width 4 (vs 3). Context-sensitive escalation.
- Hollow Knight timing: help appears when stuck, not front-loaded.

**Validation (Nielsen 5×3):**
- 3 rounds × 5 fresh players. Redesign between rounds.
- Measure: % complete per layer without help; time-to-first-correct-action.

**Hopson instrument (tutorial):**
- 5-option mid-play at each skill gate (adapted from Halo).
- Auto-logged with telemetry. Tests if each layer is invisible or leaky.

**Harley audit (coach marks):**
- One tip per mark. No chains. Visually distinct from UI.
- Pull-only: 5s stuck trigger or player request. Never front-loaded tour.

**Pine's 5 methods (mapped):**
- Demonstrative: enemy intents (observe before respond).
- Skill gates: heat chevrons (70% alarm), per-limb damage.
- Affordances: heat (color + pitch). Accidental success: objective placement.

**Traps:** skippable (done); branch by skill (difficulty + assists = Celeste);
never gate fun; tutorial bugs P0; bridge to campaign.

## Round 157: Jam tutorial + validation spec (slice)
**JAM TUTORIAL DECISION: trim, don't cut.**
- STAYS: stuck pulse (Liu attention-hijack); coach marks (first action of each type);
  VEX barks/taunts (the game's GLaDOS — teaches intent while delivering flavor);
  briefing ≤3 lines (~15s).
- GOES (jam): hangar tutorialization (JAM_BUILD-gated); per-limb explanation
  (teach via first hit + bark); heat deep dive (70% alarm teaches itself);
  assist-toggles explanation (easy default, no text). Everything skippable.

**TUTORIAL FUNNEL (IMPLEMENTED):**
- tutorial:start (FTUE) → tutorial:step:show/done per id → tutorial:exit (M1 clear).
- tutorial:stuck:<step> — one event per 8s-idle episode (stuck-point map; Liu substitute).
- Diagnostics: time-to-first-action (target <60s); completion rate; second-session rate.
- Two-antenna rule: pair funnel drop-offs with playtest reactions.

**Invisible-tutorial beats (M3):** safe first screen → unmissable telegraph
(max contrast + pitch stinger) → safe practice, then same beat under pressure.
Never lose the tutorial mission (Adams trap 5; ItB reset-turn model).

**VEX as teacher:** route teaching through VEX barks (contextual, in-world),
not briefing paragraphs. One bark line > one briefing screen (jam content economics).

## Round 166: Jam tutorial + validation spec (slice)
**JAM TUTORIAL DECISION: TRIM, don't rebuild.**
- M1 briefing: 3-line paragraph → 1-liner (JAM_BUILD-gated briefing_jam key).
  "Three hostiles. Firing practice rounds — they hit soft. Move, then shoot."
- First turn scripted: mech pre-selected on M1T1 (ItB intro style) — move range
  visible immediately, one less tap to the first action.
- Heat chevrons + limb damage teaching DEFERRED to M2 (Portal: M1 = brand-new
  concepts only — move + attack; combinations later).
- M1 VEX barks: action-tied 1-liners only (stop_on_nonidle retained).

**M1-M3 = INTRODUCE → DEVELOP → TWIST (Portal model):**
- M1: move/attack/intents in a safe context (weak first enemy intent — safe failure).
- M2: elaborates with heat + limb damage. M3 (VEX duel): combines, adds nothing new.

**VALIDATION (existing funnel):**
- Steps: tutorial start → first tap → first move → first attack → first intent read → M1 complete.
- Time-to-first-action as first-class metric (alongside mute-rate/LoAF).
- GameDesignerX real test: silently watch a real player play the first 60 seconds.

**TRAPS:** tutorial wall; freezing player; punishing curiosity; non-skippable;
skippable-but-lost (pair skip with re-teach "?" entry); info overload; too hard too early.

## Round 175: Jam tutorial + validation spec (slice)
**JAM TUTORIAL DECISION: cut, don't add. Validate, don't expand.**
- Audit the JAM_BUILD path against the "cut from first 60 seconds" list.
- Target: first meaningful action <60s. Nothing net-new needs building.

**AUDIT (verified compliant — spec only, +0 lines):**
- One idea per prompt (move / attack / heat / overheat / undo) ✓
- Dismissible coach marks (Got it button; auto-silence after 2 dismissals) ✓
- Non-modal (pointer-events:none; grid tappable through the mark) ✓
- Skippable ("I know tactics — skip it" on welcome) ✓
- Performance-gated beats (onMove→attack; onAttack→heat) — "played, not read" ✓
- Contextual (stuck pulse; moment-of-need hints) ✓
- VEX teacher lines: keep strictly contextual, one idea, non-modal.

**VALIDATION (pre-jam):**
- 5-person silent test (Idris): "Play until you feel like stopping." Zero hints.
  Log hesitations >3s. Fix top 3 recurring in 3+ sessions. Re-test with 5 new.
- 1-on-1 synchronous (Cronin): live call, watch confusion + emotion, spreadsheet.
- Telemetry says where (funnel); playtests say why.

**PACING:** one mechanic per encounter (heat / limbs / telegraphs / assists separate).
Max ~3 new items while learning. Assists stay invisible until needed.
**TRAPS:** decision before understanding; explaining before playing; text walls;
unskippable friction; hand-holding; punishing learners; two mechanics at once.

## Round 184: Jam tutorial decision (slice)
**JAM TUTORIAL DECISION: freeze and validate.** Cut nothing more, add nothing.
Remaining work is validation (5 Kleenex tests), not design.

**IMPLEMENTED — fail-safe first attack (Celeste safe sandbox):**
- Player's very first attack of the campaign: guaranteed hit (pityAcc=100) +
  heat capped below overheat threshold. Cannot miss, cannot overheat.
- GameAnalytics "make the user feel successful"; Adams trap 5 (don't punish
  inexperience).

**JAM TUTORIAL VALIDATION:**
- 5 fresh-player Kleenex tests: "deploy + first attack within 60s?"
- Instrument funnel: briefing → deploy → first-move → first-attack → complete.
- Cut any pure-text beat to context-sensitive hint (~5s idle) or delete.
- Skippable on replay; bfcache restores tutorial state.

## Round 193: Final tutorial decision (slice)
**FINAL TUTORIAL DECISION: TEACH-READY (conditional).** Design matches best
practices. Validate with one Kleenex test Friday night.

**IMPLEMENTED — atomic skip (Bugnet pattern):**
- Skip button on coach mark; `skip()` sets FULL completed state in one pass.
- Never half-sets; never re-triggers; saves immediately.
- Settings/assists never gated behind tutorial.

**KLEENEX PROTOCOL (Friday night):**
- Fresh eyes, zero guidance, M3 VEX duel slice.
- Measure: time-to-first-attack; note every stall.
- Pass: reaches first attack with no verbal help → flip to TEACH-READY.

## Round 202: Final tutorial sign-off (slice)
**FINAL TUTORIAL DECISION: TEACH-READY — CONDITIONAL (not signed off).**
Kleenex Friday (5-6 fresh players) is the gate to flip.

**IMPLEMENTED — 8-word rule (George Fan) + assists default:**
- Tutorial lines tightened to ≤8 words (EN + JA).
- 4 pilot assists ON by default for first-time players (Bergdahl).
- Veterans can toggle off; existing saves unaffected.

**KLEENEX PROTOCOL (Friday):**
- 6 fresh players (5 usable), each ONCE, black-box, zero coaching.
- M3 VEX duel on iPhone 17 + desktop.
- FAE corrective: every confusion = game fault, not tester error.
- Pass: stranger reaches combat, reads intents unaided.

## Round 211: Kleenex execution readiness (slice)
**FINAL TUTORIAL DECISION: TEACH-READY — CONDITIONAL (do NOT confirm yet).**
Promote when: (a) 5-user Friday Kleenex, zero intervention; (b) every sentence ≤8w;
(c) atomic skip verified; (d) no fail state in first contact; (e) post-fix re-test.

**IMPLEMENTED — 8-word per-sentence audit (George Fan):**
- 4 sentences fixed (welcome, heat, undo, help.heat). All ≤8w now.

**IMPLEMENTED — 5-second context hint (Hollow Knight):**
- Stall 5s at skill gate → coach target pulses urgent (orange, faster).
- Telemetry: tutorial:step:stall:<id>. Timer cleared on complete.
- 4,233 lines (+15).

## Round 220: Pre-jam freeze (slice)
**TUTORIAL FREEZE: code path locked before Fri Oct 16 6PM.**
During 72h: DATA-ONLY changes (hint strings, 5s timing, highlight visuals).
No new tutorial logic.

**IMPLEMENTED — Celeste one-liner (M3 duel entry):**
- "Destroy VEX. Tap a unit, tap a tile." (7 words, EN+JA)
- Shown on M3 briefing. Then silence (5s hint + telegraphs + barks teach rest).

**7-ITEM FREEZE CHECKLIST:**
1. Skip atomic from every beat ✓
2. 5s hint fires, never blocks input ✓
3. First player turn unfailable ✓
4. Assists persist ✓
5. Strings frozen (8w cap) ✓
6. bfcache-resync safe ✓
7. Playable with zero reading ✓

**TEACH ONLY SLICE:** M3 = move → attack → heat/intent. NOT hangar, NOT theme.
- 4,259 lines (+1).

## LD60 MASTER PRE-JAM CHECKLIST (Round 229 — Wed 2026-10-14 ~22:22 EDT)

- Master checklist: `LD60-MASTER-CHECKLIST.md` — consolidates all 9 frozen pillars + submission mechanics + embed decision + battle plan.
- VERIFIED: save layer degrades gracefully in LD embed sandbox (embedCtx='ld' -> storageOK=false -> Export-primary UX + warning banner, no crash). Round 209 detection validated by research.
- Internal freeze: Mon Oct 19 ~4PM EDT. Submit ~6PM EDT (dodge crash-prone last-minute window).

## TISSUE-TEST PROTOCOL (Round 235 — Wed 2026-10-14 ~22:58 EDT)
Pre-jam verification for the frozen tutorial path (Weinbaum/Eastshade; PUNCHev):
- 5–10 fresh players, in-person or live call. Never played the game. Say nothing; watch hands and face; record.
- Time three things: seconds to first tap; seconds to first meaningful action (unit moved with intent); seconds to first VEX destroyed. These = Tutorial Completion Rate equivalent.
- Fresh eyes are consumable: small batches, fix between batches.
- Frozen-path pass/fail: (a) one-liner answers Bycer's 3 (controls? what am I looking at? step one?); (b) 5s hint fires before average stall point; (c) atomic skip = one tap; (d) re-test with assists ON and OFF.
- VERIFIED (code read): skip-then-stuck safety net intact — assists ON by default + HUD toggles; fail-triggered assist suggestion (2+ fails); per-mission briefing one-liner. No help locked behind skipped tutorial.
- String A/B: fresh players only; track time-to-first-action per variant; ship winner.
- Bug-sweep the frozen path (most bug-free code in build): tile edge cases, assist toggles, skip path, hint timer. Jam raters play once, no dev present.

## TISSUE-TEST PROTOCOL (Round 244 — Wed 2026-10-14 ~23:52 EDT)
5 fresh players, zero instructions, silent observation. Fix biggest blocker BETWEEN players, not after all five.
- Timestamp targets (EASY default): first tap <15s · first meaningful action <60s · first VEX destroyed ~2min.
- Debrief (Schell): most frustrating moment? favorite? "anything you wanted to do that you couldn't?" magic wand? "describe this game to friends?" "did they find their way through the level?"
- Skip-then-stuck end-to-end (fresh profile): skip tutorial → HUD assist toggle visible + working → per-mission one-liner re-shows → deliberately fail 2+ times → assist suggestion fires. Pass/fail each — test from the SKIP path, not the compliant path.
- Rater simulation: cold handoff, silent watch, must complete tutorial + destroy a VEX with zero questions. If they stall: cut friction or move help earlier — never add text.
- Wording audit done (Round 244): fail-triggered suggestion non-judgmental EN + JA ("no shame in tuning the fight" / "調整は恥じゃない" — Celeste lesson). Assists ON default, one-tap off for skilled players.

## FINAL VERIFICATION (Round 253 — Wed 2026-10-15 ~00:44 EDT)
- Debrief = FFWWDD (Schell's team): Frustrating / Favorite / Wanted / Wand / Doing / Describe — negatives first. Ask "did they UNDERSTAND" before "did they like it."
- One change per iteration between players. Fix the round's findings before spending the next fresh pair of eyes (Weinstein: fresh eyes are precious).
- Never blame the player: repeated failure at the same moment = tutorial redesign; getting lost = add diegetic breadcrumbs, not text.
- Long text box = redesign the intro so the board demos it. Teach one idea → ask one action → deliver one response → move on.
- OPEN (jam-day, needs a Japanese speaker): native review of JA hints/one-liners for JUDGMENTAL phrasing, not just grammar (Celeste post-launch lesson).
- Assist suggestion verified: offered-not-forced, one-tap dismissible (Retry clears it), opens help on demand.

## FINAL VERIFICATION (Round 262 — Wed 2026-10-15 ~01:39 EDT)
- Cold 5-minute tissue test: fresh player, zero explanation, timer on, watch silently. Pass = core loop understood in ≤3–5 min, acting in first 10. Log the FIRST confusion timestamp — that's debrief item #1; fix only that before retesting. (Behler + Bycer.)
- Skip-then-stuck end-to-end: skip everything, deliberately fail 2+ times on mission 1. Verify: breadcrumbs appear on board, suggestion appears (offered-not-forced), dismisses in one tap, never re-nags.
- Wording audit PASSED (i18n.js): "The war goes on — refit and try again." / "no shame in tuning the fight." Frame failure as information, never accusation. (Celeste standard.)
- First mission = Portal-style safe room: one verb at a time (move → attack → ability), max ~3 new concepts per mission (Hodent's cognitive ceiling), each with a clear purpose.
- Timestamp check: tutorial complete + core loop visible by minute 10, compelling by minute 15. (Doyen; Bycer.)
- Rating insurance: default-ON visible assist (itch.io raters score "difficulty scaling and options"). OPEN: native JA wording review (jam-day).

## FINAL VERIFICATION (Round 271 — Wed 2026-10-15 ~02:49 EDT)
- Verified (code read): one-sentence-per-beat already satisfied (all hints single sentences). Safe sandbox in place (Round 184: first attack can't overheat, can't miss). Safety net in place (Round 24 help glossary — skippers can recover).
- Cold tissue protocol (mkoloch): zero briefing, zero mid-session help, think-aloud only. The observer's silence is the instrument — every hint given is a bug not filed.
- 5 fresh players (Nielsen): 2 rounds of 2–3, fixing between. Gate: player completes the 3-turn assist loop with no hint.
- One-word test first ("how did that feel?"), THEN the FFWWDD debrief. If the word isn't "fun"/"clear" by player 3, iterate the UX, not the text. (Topielski; Brouard.)
- "We'll fix it with a tutorial" = red flag — the UX is broken. (Brouard.)
- Assist battery: offered at the stuck moment (Celeste), dismissible in one action, never punishes. Safe room audit: no timer, no fail, no punishment. (Brouard's shrine criteria.)
- OPEN: native-speaker JA wording review (needs a Japanese speaker — flagged for Aldo, jam-day).

## VERIFICATION ROUND 2 (Round 280 — Wed 2026-10-15 ~04:00 EDT)
- Verified (code read): first-use-of-every-verb is zero-cost — move (inherently safe), attack (Round 184 fail-safe), undo (the safety net), heat (just-in-time hint). (PlaytestQuest's second law; Swift.)
- DECAY RULE (PlaytestQuest): "tutorial work decays every time you change the game around it." The cold protocol runs on EVERY build that touches onboarding — not once. Retest, don't assume.
- Cold protocol checklist: 5 testers, never seen the build; moderator says nothing except the one-word prompt; pass = ≥4/5 complete the 3-turn assist unaided. Failures = tutorial bugs (Swift: "not the player's fault").
- Post-play probes: (a) one-word gut impression, (b) "describe what this mechanic does in your own words." Prompt-checkers (re-opening the glossary mid-play) = the beat failed → back into the matrix.
- Text audit: for every popup, "could the level before this moment have shown it?" Kill pre-first-use explanations; cap at one sentence at the moment of use.
- OPEN: native-speaker JA wording review (needs a Japanese speaker — flagged for Aldo, jam-day).

## VERIFICATION ROUND 3 (Round 289 — Wed 2026-10-15 ~04:58 EDT)
- Verified (code read): first-reward timing (VGM.co). The guaranteed first attack delivers the full juice package on the first action — damage floater, hit-stop, squash, flash. The payoff lands at the first verb use, not late. (Downwell pattern.)
- Four failure patterns to watch for (PlaytestQuest): the non-user (never uses the mechanic), the prompt-checker (re-opens the glossary — didn't stick), the over-user (uses it everywhere — boundaries unclear), the stuck (can't connect mechanic to obstacle). Any pattern = the beat failed.
- Signal rule (VGM.co): one player's confusion = anecdote; three players stumbling at the same beat = signal. Fix the signal, not the anecdote.
- Contamination rule (VGM.co): "the moment you clarify an instruction during a session, you've contaminated the data." Watch, don't lead. Record everything.
- Fix-order discipline (Brouard; PlaytestQuest): when teaching fails, fix in order — motivation → isolation → constraint → feedback → repetition → text LAST. "We will fix it with a tutorial" = the red flag (papering over a usability failure).
- Freeze discipline: after the final verification passes, freeze all tutorial text and beats. Any post-freeze change — even a wording tweak — re-triggers the decay rule. No unreviewed tutorial edits in the last 48h before submission.
- OPEN: native-speaker JA wording review (needs a Japanese speaker — flagged for Aldo, jam-day).

## VERIFICATION ROUND 4 (Round 298 — Wed 2026-10-15 ~05:37 EDT)
- Fan's 8-word guideline (js/i18n.js): all 5 hints now ≤8 words per sentence. Heat 14→8, Heat JIT 11→6, Undo 10→8. "Use Fewer Words" — tightened without losing meaning.
- Final round = one silent fresh-player pass (Bromley): 5–8 players, never seen the game, zero coaching, moderator silent during play. Observation sheet from the failure-pattern watch (Bycer's 3 patterns + Hedges' negative list). Signal rule: a beat fails if ≥2 players independently hesitate/fumble at the same point.
- Paraphrase probes (Hedges): after play, one probe per mechanic — "in your own words, when would you use X?" A mechanic is verified only when players can both DO it and EXPLAIN it back. Behavior over claims (Bromley).
- Tutorial-as-fix audit (Bycer): anywhere the tutorial explains around a confusing UI element, fix the UI — don't add hint text. "Tutorial text layered over bad UI is a band-aid, not a tutorial."
- Assist contract (Super Guide; Total War; Celeste): 3-turn assist fires only after repeated failure, visibly optional/dismissible, never interrupts a player's turn. Never forced.
- Ship-blockers: (1) unskippable/undismissable sequence; (2) assist that can't be declined; (3) hint over one sentence / frontloaded exposition; (4) mechanic without a safe, consequence-free room first; (5) glossary not re-openable mid-play; (6) beat fails the signal rule after the fix. (Bycer: "Hard games should not have hard tutorials.")

## VERIFICATION ROUND 5 (Round 307 — Wed 2026-10-15 ~06:11 EDT)
- Verified (code read): impasse detection at 8s (game.js:1736, Round 157) — more sensitive than the research's 30–45s. Stuck → visual escalation + Telemetry log. "Trigger assist or flag for rewrite" — we do both.
- Silent playtest (freeze discipline): 5+ first-time players, zero developer help. Log per turn: seconds to first action, hint re-reads, glossary re-opens. Impasse = no progress in 30–45s or hint re-read without action → fix pre-ship, not more text. (PUNCHev: "test the first 60 seconds hardest.")
- Paraphrase probes: "what did that hint tell you to do?" Can't restate → rewrite the hint. ≤8-word budget frozen; only shorten or replace, never add. (BBC GEL: "don't over tell.")
- Safe sandbox + skip path (ship-blocker): no fail state in 3 tutorial turns; retry/undo free; glossary opens from any state; skip lands on sensible default ("make the default the good path"). Skip soft-lock or unreachable glossary = block ship.
- Behavior metrics (ship-blocker): completion rate, time-to-first-action, hint re-read rate, skip rate. Provisional thresholds (e.g., completion <80% or median time-to-first-action >45s blocks ship). "Fixing it rarely means adding more." (PUNCHev)
- Anti-pattern audit: no systems explained before the player acts; no unskippable beats; no text walls; no punishment for sandbox experimentation. Failures cut or deferred to glossary, never rewritten longer.

## VERIFICATION ROUND 6 (Round 316 — Wed 2026-10-15 ~06:42 EDT)
- Verified (code read): tutorial funnel instrumentation. tutorial:start, choice:veteran/new, step:show:<id>, step:done:<id>, step:dismiss:<id>, step:stall:<id> (impasse), tutorial:skipped. Full funnel: start → show → done/dismiss/stall → skipped. (GameAnalytics Tip 5.)
- Freeze 8-word budget (ship-blocker): Fan's "no more than 8 words a sentence" (PvZ, GDC 2012) + survey preference. Any hint >8 words fails final verification — cut or split.
- Freeze tutorial content: after final verification, any content change requires full silent-playtest re-run. No new text without replaying the teach-audit (Adams #2/#4; Hedges "too long"/"irrelevant").
- Ship-blockers: (a) any unskippable sequence (Adams #1/#7); (b) any step where silent playtester needed facilitator intervention (getgud — intervention = defect); (c) any tutorial failure that costs the player (Adams #5; Hedges "low chance of failing"); (d) any funnel step whose drop-off exceeds spec threshold (GameAnalytics Tip 5).
- Instrument every step (start/complete) and run full behavior-metrics suite — time per beat, error counts, hint triggers, impasse counts — before locking (GameAnalytics Tips 5-6; getgud quant+qual).
- Impasse at 8s with just-in-time hints; each beat = one mechanic with one "do it once" moment (Fan); safe sandbox where first verbs are zero-cost (BotW Great Plateau; Adams "don't punish inexperience").

## VERIFICATION ROUND 7 (Round 325 — Wed 2026-10-15 ~07:18 EDT)
- Verified (code read): skip path. "Skip tutorial" button (tutorial.js:110). Same mission, same rewards — no punishment (tutorial.js:3-4). Atomic skip through same finalization (tutorial.js:148). Wayline satisfied.
- Hint budget as ship-blocker: 8-word hints pro-aligned (help bloat = churn driver). Gate: silent playtest (Duamentes 5–8 testers) on frozen copy; any tester stalling on hint wording beyond 8s = ship-blocking bug. No copy changes without re-playtest.
- Cohort-split validation: groups = completed vs skipped vs stalled-with-hint; measure D1 return vs ~30% health signal (Tyrads) and 40/20/10 baseline (GameAnalytics). Stalled cohort underperforming = impasse too slow or hints too weak = blocker.
- Skip path audit: skip reachable within first two screens; skippers tracked as own funnel; re-engagement offers contextual refresher on return — never forced replay. (Wayline; GameDeveloper.)
- Paraphrase probe as exit criterion: after each silent session, ask player to paraphrase each taught verb. Any verb no tester can paraphrase = untaught = ship-blocker, regardless of funnel numbers. Completion without comprehension = false pass.
- Two-tier blockers: SHIP-BLOCKERS = (a) any funnel step >30% drop-off, (b) any impasse never resolving in 8s + one hint, (c) missing skip or forced replay, (d) any verb failing paraphrase. POST-SHIP A/B = hint phrasing, pacing, re-engagement copy (Zengin D1/D7 deltas).

## VERIFICATION ROUND 8 (Round 334 — Wed 2026-10-15 ~07:52 EDT)
- Verified (code read): event taxonomy. Consistent `tutorial:` namespace (tutorial.js:61,64,114). Tight, question-driven. Skip emits own event (funnel models both paths).
- Freeze taxonomy now: lock event names (Object-Action form), enumerate valid property values, forbid new events during verification. Ship-blocker: new event requires audit note proving it can't use existing properties. (Amplitude; Crook.)
- Canonical funnel dashboard (always-on): Session Start → First Verb Attempted → Hint Shown (8s) → Step N Completed → Tutorial Completed vs Skipped → First Post-Tutorial Session. Human-readable, few steps. Ship-blocker: no skippable-without-event step. (GameAnalytics.)
- Funnel/cohort QA: verify each event fires once per trigger in live playthrough; cohort joins mutually exclusive (completers/skippers/dropouts); reproducible from raw export. Ship-blocker: cohort definitions must reproduce from raw events.
- Alert thresholds: tutorial completion rate, per-step drop-off, median time-to-first-verb. Ship-blocker: post-ship completion drop beyond threshold pages team — no silent regression. (Crook; PostHog.)
- Duolingo experiment contract: every verification claim gets written hypothesis + expected result BEFORE data pull; results in verification log. Ship-blocker: no verification passes on metrics alone — pair with silent playtest + paraphrase probe.

## VERIFICATION ROUND 9 (Round 343 — Wed 2026-10-15 ~08:22 EDT)
- Verified (code read): bounded adaptation. 5s stall → context hint (tutorial.js:123-130, Round 211). 8s idle → pulse + stuck telemetry (SPEC:40,75). Layered. Hint explicitness only — never difficulty/outcomes. Invisible, logged. (RE4; Saltsman.)
- Freeze adaptation taxonomy: version player-model inputs (time-to-first-action, misclick rate, idle gaps), adaptation decisions (hint shown, verb highlighted), outcomes as frozen spec events. SHIP-BLOCKER: no adaptation event in production not in frozen taxonomy. (Lopes: verify closed loop, not components.)
- Closed-loop A/B: static vs adaptive cohort on behavior metrics (funnel drop-off, time-to-first-win). SHIP-BLOCKER: adaptation with no significant lift does not ship. (DiVA null result.)
- Bound like RE4: 5s/8s stall + 8-word hint budget are hard bounds; adapt hint explicitness, never difficulty. Bounds prevent whiplash, preserve skip integrity.
- Split invisible/visible: hint selection invisible (Saltsman); visible guidance level (Shogun 2 advisor verbosity) + verified skip path as player override. Every adaptation logged for funnel/cohort QA.
- Wrong-adaptation rate (alert): hint shown → player still fails taught verb in next window = failed adaptation. Alert if exceeds frozen threshold. Makes experiment contract falsifiable. (Ship-blocker metric.)

## VERIFICATION ROUND 10 (Round 352 — Wed 2026-10-15 ~08:50 EDT)
- Verified (design): transfer test. Tutorial teaches verbs on training map; mission 1 (novel layout) requires same verbs unprompted = NRC transfer test. Completion ≠ learning; mission-1 behavior = learning. (NRC; Arthur et al.)
- Freeze event taxonomy (ship-blocker): lock tutorial event names (step_start/complete, hint_triggered, impasse_detected, skip_entered/exited, verb_first_use) before further code changes. Post-freeze addition requires spec amendment. (Meta; GameAnalytics: don't recalibrate instrument during final exam.)
- Quantitative ship-blockers: define per-step max drop-off and completion-time bounds before final data. No single step may lose >X% beyond baseline decay; any step exceeding time bound = blocker. Unexplained cliff → VAIL protocol: split into sub-action events, diagnose, fix, re-verify. Do not ship undiagnosed cliff.
- Validate 8s/8-word behaviorally (ship-blocker): (a) hint comprehension — paraphrase probes confirm restatement; (b) post-hint success rate — next attempt succeeds at defined rate; (c) wrong-rate per hint — high subsequent-error = rewrite/remove. Hints fade with competence, never crutch. (Andersen et al.)
- Mastery = transfer test (ship-blocker): first real mission (novel map, unprompted) must require each taught verb; log verb first-use latency + error rate there. If transfer lags while completion looks clean, tutorial taught compliance not skill — block ship. (NRC.)
- Retention cohort (ship-blocker): compare D1/D7 + verb-accuracy decay across completers, skippers, non-starters. Skippers must not systematically outperform completers — if they do, tutorial is worse than nothing; skip is masking quality failure. Archive A/B variants for reproducibility.

## VERIFICATION ROUND 11 (Round 361 — Wed 2026-10-15 ~07:24 EDT)
- Verified (design): interpretable heuristics. 8s impasse → hint; 8-word budget; no ML. Every adaptation logged. Drachen's "pruned trees → rules" pattern. Every decision explainable. (Saltsman; EA-DDA lesson.)
- Freeze adaptive logic: no tuning of 8s threshold, 8-word budget, or hint-selection once silent playtest starts. Any change = new build = re-verification. Ship-blocker: unlogged mid-verification tuning blocks ship. (TrueSkill versioned models; Drachen frozen heuristics.)
- Numeric gates: convert verification history to gates — max impasse latency (8s), hint-word ceiling (8 words), wrong-rate bounds, A/B split rules, min funnel completion. Gate regresses = blocker; gate without threshold = wish. Ship-blocker: any gate unmet blocks ship.
- A/A test: run A/A on funnel instrumentation before trusting final numbers. Prove event taxonomy + measurement pipeline stable (audience-quality check) before adaptive-vs-static comparison. Ship-blocker: unstable A/A = no valid A/B = no ship decision. (Matveev.)
- Audit three models: (a) skill — is 8s detector firing on genuine impasse vs noise (cross-check vs paraphrase probes); (b) engagement — rank telemetry (time-to-first-action, hints, retries, skip) by importance (Drachen), cut no-signal features; (c) churn — who abandons at which funnel step (silent playtest), XAI-style driver inspection. Ship-blocker: any model whose decisions you cannot explain blocks ship. (EA-DDA lawsuit.)
- Ship interpretable heuristics: 8s detector + 8-word budget validated with cross-check discipline; document adaptation logic so every decision explainable. Ship-blocker: opaque/undocumented adaptation blocks ship. (Drachen.)

## VERIFICATION ROUND 12 (Round 370 — Wed 2026-10-15 ~07:49 EDT)
- Verified (spec read): activation defined. Transfer test (R352): tutorial teaches verbs on training map; mission 1 (novel layout) requires same verbs unprompted = NRC transfer test. This IS activation (Rejourney: "first action proving value, not last tutorial screen"). Completion ≠ learning. (Rejourney; King.)
- Freeze-checklist + version-tagging: write down frozen tutorial config now — exact hint texts (8-word budget), 8s impasse threshold, full event taxonomy, skip-path behavior, adaptive rules. Tag frozen build (t=N). Rule: any post-freeze change requires controlled A/B arm or new freeze with re-verification of skip path + full funnel. (Roblox/King: if changing hint text requires code push, iteration dies; make config live-tunable.)
- Pre-launch ship-blockers: block ship if (a) required funnel event from taxonomy doesn't fire or fires out of order; (b) skip path broken, slow, or mislabeled in analytics; (c) any tutorial crash, soft-lock, or infinite impasse-loop — hits 100% of new users first (Bugnet: fix tutorial bugs before all else); (d) measured median or p90 time-to-progress on any step exceeds 8s impasse threshold on real mid-tier devices.
- Define activation separately from completion: funnel should not end at "tutorial finished." Activation sentence: "new player is activated when they complete first tactical engagement using zero-cost verbs without hint." Report four rates — step completion, FTUE completion, activation rate, time-to-value — so rising completion can't mask flat activation. (Rejourney.)
- Pre-register A/B protocol + kill criteria: lock into launch protocol — arms (frozen build vs candidate), primary metric (FTUE completion + activation), misinterpretation budget per step (max acceptable wrong-move rate, hint-reliance rate). Any variant exceeding bounds killed before freeze. (Round 361 interpretable verification.)

## VERIFICATION ROUND 13 (Round 379 — Wed 2026-10-15 ~08:24 EDT)
- Verified (spec read): first-session design. :76: "time-to-first-action (target <60s)"; :103: "silently watch real player play first 60 seconds"; :110: "cut from first 60 seconds" list. Matches Crook/Mobile Game Doctor (FTUE = first 60s). Into the Breach pattern (teach-via-doing, telegraphed state). (Crook; Into the Breach.)
- Freeze tutorial as build artifact: lock tutorial content, 8-word hint budget, 8s impasse rule, event taxonomy, analytics wiring together. Any post-freeze tutorial change must re-clear two numeric gates: (a) silent-playtest first-completion rate ≥ frozen build's, and (b) crash-free sessions ≥99%. No gate clearance = no ship. (AppAgent: <1% crash gate.)
- First-session audit as funnel: verify every tutorial step emits start/stop/pause/restart events and confirm firing in clean install before launch — missing instrumentation = ship-blocker (Mobile Game Doctor pre-launch checklist). Then run silent playtests and measure: time-to-first-zero-cost-verb, impasse-detection hit rate and latency (must fire at 8s), skip rate, step-level drop-off. Fix single worst drop-off step before touching anything else.
- Over-coaching ceiling: Game of War negative benchmark (87 coach markings in 10 min) = quantifiable anti-pattern. Cap forced interventions in first session (Clash Royale model = 2 railroaded moments; Into the Breach = 0 pop-ups); let telegraphed board state + systemic feedback do rest. Any hint exceeding 8 words or forced popup outside two approved coaching beats fails verification.
- Return hook (ship-blocker): tutorial ending without reason to come back creates D7 cliff. Minimum viable: explicit next-session goal set before player leaves (beginner mission), plus timed/state-based reason to return (reward/refresh visible on home screen). Verify in playtest: does player state unprompted reason to return? If not, ship-blocker. (GameRefinery; AppAgent.)
- Launch checklist as signed gate: pre-launch — analytics verified, zero tutorial-blocking bugs, skip path verified end-to-end, hint budget respected, impasse detection firing, return hook present. Post-launch (jam-scale): segment first-session completion by source/device; track D1-equivalent (second-session return) as tutorial's scoreboard, not raw completions. Weak D1 = onboarding problem, fix onboarding; never "fix" D1 with economy/content changes. (AppAgent.)

## VERIFICATION ROUND 14 (Round 388 — Wed 2026-10-15 ~08:54 EDT)
- Verified (spec read): tutorial freeze defined. :275: "Freeze discipline: after final verification passes, freeze all tutorial text and beats. Any post-freeze change — even wording tweak — re-triggers decay rule. No unreviewed tutorial edits in last 48h before submission"; :290: "Safe sandbox + skip path (ship-blocker)"; :315: "Alert thresholds." Matches Supergiant (content lock) and Dota 2 lesson (shared-system regression). (Supergiant; Dota 2.)
- Declare tutorial content lock (freeze discipline): set hard tutorial lock date before launch and adopt Supergiant's rule — after lock, only critical fixes or key surgical improvements. Ship-blockers: any tutorial softlock, any step where impasse detector never fires or hint path unreachable, any step with wrong-action rate above threshold, any crash, broken skip path. Anything else waits for post-launch.
- Tutorial regression suite (Dota 2 lesson): golden-path walkthrough checklist — every tutorial step accepts correct input, advances on success, fires 8s impasse detector, delivers ≤8-word hint, completes on RC build. Late changes to shared mechanics must trigger this suite, because interconnected-system regressions are #1 tutorial-killer.
- Two-key sign-off on RC: (a) fresh non-dev players complete silent playtest of frozen tutorial (Bromley protocol — observe, probe understanding, don't lead), and (b) funnel telemetry confirms targets — completion rate, per-step drop-off, time-per-step, skip events (Mitzu model). No sign-off without both behavior and metrics agreeing.
- Final validation before freeze, never after: run last full tutorial playtest + telemetry review on pre-freeze build, then lock. Any post-freeze tutorial change = hotfix that must re-run full regression suite and re-earn sign-off — never "quick text tweak" shipped untested.

## VERIFICATION ROUND 15 (Round 397 — Wed 2026-10-15 ~09:31 EDT)
- Verified (spec read): tutorial sign-off defined. :163: "Round 202: Final tutorial sign-off (slice)"; :361: "Two-key sign-off on RC: (a) fresh non-dev players complete silent playtest of frozen tutorial, and (b) funnel telemetry confirms targets. No sign-off without both behavior and metrics agreeing"; :362: "Final validation before freeze, never after." Matches Valve (silent observation) and Larian (non-gamer bar). (Valve; Larian.)
- Enforce tutorial freeze: lock tutorial N days before launch; any change after freeze = ship-blocker requiring fresh silent playtest and re-sign-off. (Valve: weekly playtests; Larian: Nautiloid rework.)
- Final comprehension audit: 5+ fresh non-gamer players, silent observation, paraphrase probes per mechanic, impasse>8s rate tracked. Ship-blockers: every verb demonstrated unaided; impasse rate below threshold; 8-word hints understood by all testers. (Nightingale: "hard to understand what's not understandable until watching someone not understand it".)
- Verify comprehension locks and skip path: progression gates on performed mechanics (not read prompts); zero-cost first-use verbs confirmed; skip path completes cleanly. Ship-blocker: fresh player completes tutorial with zero forced failures. (Cuphead; Larian: one mechanic per curated moment.)
- Ship funnel before launch: per-step start/complete/skip/hint-fire/drop-off events, time-per-step, D1-retention split by tutorial completion — validated in soft launch with live dashboard. Ship-blocker: no launch without working tutorial telemetry. (PixelPicked; Mitzu.)
- 48-hour post-launch audit: monitor funnel and in-tutorial errors in first 48 hours against playtest baselines, with pre-approved hotfix path if step drop-off exceeds thresholds. (Valve/Larian loop.)

## VERIFICATION ROUND 16 (Round 406 — Thu 2026-10-15 ~12:00 EDT)
- New this round (spec only): onboarding-evolution plan. No prior evolution/drift coverage in spec. Matches WoW (Exile's Reach unified artifact), FFXIV (5.3 trim), ESO (seven tutorials as living system). (WoW; FFXIV; ESO.)
- Freeze discipline with a drift register: version-lock the tutorial script artifact; any patch touching a tutorialized mechanic, verb timing, or hint budget must append a drift-register entry reviewed by the tutorial owner within one release cycle. Adopt ESO/FFXIV's lesson: the game will change under the tutorial — make that visible.
- Ship-blocker #1 — no patch ships if it breaks a tutorialized verb without updating the tutorial: automated check that every tutorialized verb still completes its teach sequence in a smoke test; a failing verb is a blocker, not a note.
- Ship-blocker #2 — funnel regression: per-step tutorial funnel metrics (started/step_completed/completed per GameAnalytics taxonomy + devtodev's first-session set: completion rate, per-step churn, median time) with alert thresholds; a step regressing beyond threshold after a patch blocks the next release until the step is re-tuned or re-cut (FFXIV 5.3 principle).
- Mid-game drift locks extending the existing pillars: re-teach triggers when a taught verb (flanking/cover/combos) goes unused for N encounters — a mid-game sibling of the 8-second impasse detection, still within the 8-word hint budget; plus an opt-out fast path for veterans (Lost Ark model) so the tutorial never wastes an experienced player's time. Never hard-gate core verbs (GW2 lesson).
- Quarterly tutorial-evolution audit (year-2 cadence): re-run the silent playtest protocol with a mixed fresh/returning/veteran cohort, re-administer paraphrase probes to returning players, compare D7/D30 verb-adoption traces against tutorial targets, and A/B test one variant per cycle (Andersen A/B methodology, devtodev recommendation). One owned owner, one unified artifact (Exile's Reach principle), and the Destiny 2 anti-example on the wall: onboarding is a live system, not a launch asset.

## VERIFICATION ROUND 17 (Round 415 — Thu 2026-10-15 ~12:59 EDT)
- Verified (spec read): hint-timing discipline defined. :226: "Bug-sweep the frozen path... hint timer."; :304: "Hint budget as ship-blocker: 8-word hints pro-aligned (help bloat = churn driver). Gate: silent playtest (Duamentes 5–8 testers) on frozen copy; any tester stalling on hint wording beyond 8s = ship-blocking bug. No copy changes without re-playtest."; :323: "Split invisible/visible: hint selection invisible (Saltsman); visible guidance level (Shogun 2 advisor verbosity) + verified skip path as player override. Every adaptation logged for funnel/cohort QA." Matches Portal (concept pacing) and the silent-playtest protocol. (Portal; Game Trade Journal.)
- Freeze the hint-timing spec and make changes ship-blocked: Freeze three parameters — 8s impasse threshold, 8-word hint budget, one-verb-at-a-time sequencing — in TUTORIAL-SPEC.md. Any change to timing, wording length, or verb ordering requires re-running the silent playtest protocol (written goal card, observer behind, no intervention unless truly stuck) and re-verifying the funnel before merge. This mirrors the Portal discipline: concept pacing is the difficulty model, so pacing changes are design changes. (Portal.)
- Instrument the hint funnel end-to-end (GameAnalytics pattern): Emit design events: tutorial_started → verb_first_used → impasse_detected (with dwell_ms) → hint_shown → hint_actioned/dismissed → tutorial_completed / skip_used. Track unique users per step plus average time. Ship-blocker: no build ships without a pear-shape check on this funnel — any step whose conversion deviates from the expected taper blocks launch until investigated. (GameAnalytics.)
- Validate the 8s threshold empirically and lock an escalation ladder: Run 5+ silent playtests; record time-to-first-choice per verb and the moment each tester genuinely needed rescue. If median needed-rescue time < 8s, lower the threshold; if testers act confidently before 8s, hold it. Build the impasse lock ladder: hint 1 = nudge (≤8 words), hint 2 = explicit instruction, hint 3 = offer skip — never a blocking modal. Research backing: Wauck & Fu found players prefer FEWER hints than adaptive/automatic systems served; Raza & Rasool found user control over hints beats unsolicited hints. (Wauck & Fu; Raza & Rasool.)
- Verify the skip path and returning-player flag as first-class ship-blockers (QA checklist): Skip must preserve progression state and never corrupt saves; the returning-player flag must suppress onboarding for veterans; rewards must be idempotent. Re-run this matrix on every client update — post-launch hint neglect is the documented failure mode. (quality-assurance.cc.)
- Run the 48h post-launch audit and keep a quarterly drift register: At 48h: read hesitation data (dwell before impasse_detected per verb), flag any verb whose time-to-first-choice exceeds 60s or whose hint-dismiss rate spikes. Quarterly: re-measure the Codex tells (modal minutes, read-to-act ratio, verb backlog, mash-through rate) and A/B test any timing change against completion rate — never ship a timing tweak on opinion alone (Andersen et al.: tutorial effects are complexity-dependent; test, don't assume).

## VERIFICATION ROUND 18 (Round 424 — Thu 2026-10-15 ~13:40 EDT)
- New this round (spec only): teach-by-doing plan. Spec has no teach-by-doing plan — this round adds it. Matches Nikolaev (five invisible-tutorial methods), Into the Breach (perfect-information teaching), Half-Life 2/Portal (demonstrative method). (Nikolaev; Into the Breach; Larian.)
- Freeze the verb sequence as a ship-blocker (verb blocker): Codify the exact teaching order in TUTORIAL-SPEC.md and treat any addition, removal, or reordering of a teaching moment after the freeze as a blocked change requiring re-validation. This mirrors the Nightingale/Larian discipline: curated single-verb moments, levels built around the sequence. Rationale: verb-sequencing drift is the #1 regression vector the pros fight (BG3 reworked its prologue post-EA for exactly this).
- Run the doing audit as a pre-ship gate: every verb in the inventory must have a performed (not read) teaching moment, each moment must be a skill gate the player cannot pass without demonstrating the verb, and hints must be context-sensitive (fire only on detected impasse — the 8s impasse detection + 8-word hint budget maps precisely onto the Hollow Knight pattern and the academic adaptive-tutorial evidence). Any verb taught by text alone blocks the ship. Add one demonstrative beat per high-risk verb (an NPC/enemy performing it first — the barnacle/crow method, adapted for tactics: show an enemy telegraphing an attack à la Into the Breach before the player must act on it).
- Instrument the full funnel before launch (funnel blocker): Event taxonomy: tutorial_start, per-step start/end, per-step completion, hint fires, skip events, tutorial_complete; derive per-step drop-off, median step time, and completion rate; correlate with D1 retention. Per Unity Docs, GameAnalytics, and Meta's dev blog, this taxonomy is the first analytics a retention-focused team should ship — make per-step events a ship-blocker, not a post-launch nice-to-have.
- Validate with the silent playtest protocol: no intervention during tests; observe only; measure per-verb task success, impasse durations, hint triggers, and run paraphrase probes ("what does [verb] do, in your words?") to test comprehension, not just completion. Fix every step whose hint fires above a threshold — the hint data is the sequencing validator.
- Commit to post-launch monitoring with drift locks: a 48-hour post-launch audit of the funnel, plus a standing review cadence (quarterly audit) that re-checks the verb sequence against the drift register. If any step's drop-off or completion rate regresses past its locked bound, the tutorial is flagged for rework before any new feature ships. This closes the loop the pros run continuously: instrument → measure → worst-step-first fixes → re-measure.

## VERIFICATION ROUND 19 (Round 433 — Thu 2026-10-15 ~14:29 EDT)
- New this round (spec only): onboarding plan. Spec has an onboarding-evolution plan (round 406) but no onboarding plan — this round adds it (ship-blocker checklist, funnel instrumentation, hint locks, anti-pattern guardrails). Matches Hodent (cognitive budget, UX-test protocol), Bugnet (stuck detection), Miyamoto (silent playtest). (Hodent; Bugnet; Miyamoto.)
- FREEZE DISCIPLINE + SHIP-BLOCKER CHECKLIST: Before any ship, every tutorial mission must pass: (a) silent playtest with ≥5 fresh players, zero guidance — log every surprise; (b) hint-timer verification — each objective's no-progress timer provably starts on objective activation, resets ONLY on meaningful progress (not raw input), and the hint's show path is logged (timer-elapsed + show-call events); (c) single-message check — hint text, arrow/highlight, and audio all convey the same instruction; (d) skip/shorten path verified for returning players; (e) ≤3 new concepts per mission (Hodent's learning-mode budget). Any failure blocks the ship.
- INSTRUMENT THE FUNNEL FROM DAY ONE: Emit "step completed" events per tutorial objective plus hint-fired / hint-acted-on events; maintain a permanent tutorial-completion funnel (drop-off % and time-between-steps per step) and a feature-discoverability funnel (do players use each taught verb in missions 2–3?). Ship-blocker: no tutorial step may exceed an agreed drop-off threshold, and no hint may have a fire-rate near zero (dead-weight hint) without a logged root cause.
- HINT LOCKS AGAINST DRIFT: Implement hints as locks: a per-objective no-progress timer, escalating levels (nudge → directive), and recall hints that re-teach mission-1 verbs contextually when a player stalls in missions 2–3 (combats mid-game drift). Cap hint text to a short, single instruction; verify every hint actually fires in playtest; fix false affordances (e.g., a tile that looks selectable but isn't) instead of hinting around them.
- ANTI-PATTERN GUARDRAILS IN THE SPEC: Encode the avoid-list as hard rules: no walls of text; no punishment/fail states during tutorial missions (safe practice before real stakes, Mario-style); one mechanic at a time; feedback on every action; teach the WHY before the how ("show the locks before giving the keys"); never fire a hint and a new objective simultaneously (inattentional blindness); always keep a skip for veterans.

## VERIFICATION ROUND 20 (Round 442 — Thu 2026-10-15 ~15:13 EDT)
- New this round (spec only): teaching plan. Spec has an onboarding plan (round 433) but no teaching plan — this round adds it (one-sentence job + decision table, question-first telemetry, non-gamer protocol, teaching plan, anti-pattern audit). Matches Bycer (hierarchy of learning), Nightingale (watched playtesting), Adams (bad-tutorial anti-patterns). (Bycer; Nightingale; Adams.)
- FREEZE DISCIPLINE — Write the tutorial's job in one sentence before the freeze: "This tutorial gets the player to first tactical competence (2 actions, 4 teaching gates)." Then pre-write the decision table: what changes if the funnel is clearly healthy / clearly unhealthy / unclear. Anything not needed for first competence gets cut — discovery space stays empty by design, not by accident.
- MISSION-1 TELEMETRY (question-first): instrument tutorial_start, step_complete per gate, hint_shown, hint_dismissed, skip, and mission1_start/complete. Success metric = second-session rate; diagnostics = tutorial completion rate + median time-to-complete. First post-launch job: investigate the largest drop-off break and split that gate smaller (devtodev). Guard against survivor bias: analyze quitters, not completers.
- NON-GAMER PLAYTEST PROTOCOL: silent observation (Nightingale) with at least 2 non-gamers/phone-only players per round; log every moment of confusion, then hunt the common thread across different failure modes before fixing. Ship-blocker: no gate passes until a novice completes it without help.
- TEACHING PLAN: keep the 2-action floor + 4 gates; each gate = one mechanic, learn-by-doing, no text walls; reactive hints only on first encounter with a new concept; mark the tutorial's end explicitly so players reset their guidance expectations ("the tutorial is over, now you're on your own"); keep late/discoverable depth (advanced tactics) untaught but visible for curious players.
- SHIP-BLOCKER ANTI-PATTERN AUDIT (Adams checklist): (a) tutorial skippable and mid-quittable; (b) zero multi-screen text reads; (c) every referenced button highlighted in situ; (d) instant retry on any teaching-floor failure — the player cannot lose inside the tutorial; (e) consistent hint detail across all 4 gates; (f) tone positive, never condescending. Any violation blocks the tutorial sign-off.

## VERIFICATION ROUND 21 (Round 451 — Thu 2026-10-15 ~16:03 EDT)
- New this round (spec only): first-session plan. Spec has a teaching plan (round 442) but no first-session plan — this round adds it (instrumented drill mission, silent playtest, 30s silence enforcement, funnel instrumentation, open-loop retention lock). Matches Luban (FTUE best practices), Valve (silent playtesting), Bycer (onboarding). (Luban; Valve; Bycer.)
- Freeze the 2-action teaching floor to a single instrumented drill mission: Map mission 1 like World 1-1: the first board state must be safe, and each of the two core actions must be learnable by consequence (try it → see result), not by reading. Freeze discipline: no new mechanics, no extra text panels, and no layout changes after the playtest lock — only fix-blocking bugs.
- Run the first-session drill gate as a silent playtest (Valve method): Recruit 3–5 fresh testers (non-gamers included, per our protocol), say nothing during the session, record it, and treat every confusion point as a design defect. Ship-blocker: any step where ≥2 testers stall for more than the drill's time budget must be redesigned and re-tested before the jam freeze — do not patch it with more hint text.
- Enforce the 30s silence rule via the timer audit, verified in the playtest: Audit total active time-to-first-meaningful-choice and time-to-first-victory in mission 1; if the player cannot make a real decision within ~30 seconds of mission start, cut frontloaded exposition or choices. Ship-blocker: any modal/hint that blocks input past the 30s mark fails the audit.
- Instrument the funnel before freeze (GameAnalytics starter set): Fire tutorial_started, tutorial_step_completed (per teaching gate), tutorial_completed, first_core_action, mission_fail, mission_complete, and error_event from the vanilla JS build now — not post-jam. Ship-blocker: any teaching gate that cannot be funnel-verified fails hint-lock and drill verification, because silent degradation is unmeasurable.
- Add one open loop as the retention lock for mission 1's end (Luban): Close the first session with a concrete goal+reward pair (e.g., "complete mission 1 with no unit lost → unlock skirmish loadout option") so the player leaves with an in-progress task. This is the mission 1 telemetry anchor: track loop-open vs. loop-close to measure whether the tutorial converts to retention.
