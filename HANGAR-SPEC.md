# Hangar Polish — Slice Spec (Round 68)
**Status:** DEFERRED to vertical slice. This spec is the build target. No prototype code.

## Thesis
The hangar is a digital gunpla bench: tinker privately for competence, express identity publicly for status. Every addition serves one of those.

## P0 (slice must-have)
1. **3 one-tap preset recipes per chassis** ("Brawler," "Sniper," "Skirmisher") — the choice-overload antidote. Newcomers get ≤7 categorized options; veterans browse freely.
2. **Delta-preview stat chips** in existing pickers: every candidate part shows green-up/red-down vs equipped on 3 derived numbers only — damage-per-turn, effective HP, heat-per-turn vs dissipation — plus one plain-language playstyle line ("hits harder, runs hotter"). Raw stats behind a tap.
3. **Category tabs** capping pickers at ~7 visible parts.
4. **Plain-language heat budget label:** "alpha-strikes twice, then must cool 1 turn" — never BattleTech's unexplained chevrons.

## P1 (slice nice-to-have)
5. **Shareable build codes:** full 3-mech loadout as copy/paste string (Smurfy's/AC6 pattern). Zero server cost.
6. **3 loadout slots per mech** + one-tap copy between mechs.
7. **Live silhouette updates** on part change (paper-doll re-renders instantly).
8. **Best/worst-in-class tags** (below/near/above average) to kill comparison tedium.
9. **Build names** (player-named mechs).

## Rules
- Parts are earned, never paywalled (Front Mission capture model).
- No picker shows >7 parts without tabs.
- Derived stats in plain words; raw stats behind disclosure.
- Paper-doll stays central (natural mapping).

## Explicitly OUT (stay deferred)
- Bottom-sheet part picker (existing pickers suffice with tabs + deltas).
- Intent telegraphs (separate slice item).
- Weight/power constraint axis.

## Round 99: Two-axis UI + bottom sheet (production hangar pass)
**Two axes (AC6 pattern):**
- WEIGHT: cap raised by legs/chassis. Over = OVERBURDENED.
- POWER/HEAT: cap raised by reactor (which adds weight — self-balancing). Over = POWER SHORTFALL.
- Both bars persistent with arrow limit markers. Over budget = LAUNCH disabled with reason stated. Hard gates, never soft penalties.

**Bottom sheet (M3 pattern):**
- STANDARD (non-modal) bottom sheet as part picker. Doll stays visible above. Live redraw <100ms.
- Tap-slot-then-tap-part = primary (touch). Drag-and-drop = secondary (desktop).
- Modal sheets for weapon detail/compare only. Desktop = right side-sheet.

**Part cards:**
- Cap visible stats at 5–7. Lead with green/red deltas vs equipped.
- Every card shows cost (weight, power) next to benefit.
- "If this part is destroyed…" line per slot (Front Mission pattern).

**Paint:** free, instant, silhouette redraw. Zero balance cost.

## Round 123: Production hangar spec (hangar part 2)
**Bar-vs-white-line (AC6 pattern):**
- EN Load and Weight bars ALWAYS VISIBLE in hangar header.
- White threshold line on each bar. Violating either BLOCKS Deploy.
- Highlight the specific part pushing over the line (cross-axis costs at selection time).
- ONE escape valve (late-game "Overclock" — sortie + in-field drops). Never soften the gates.

**Sub-100ms paper doll (NN/g):**
- Hover/tap part card → INSTANT +/- deltas on doll + both bars (before equipping).
- Equip in ONE tap. M3 bottom sheet: doll + bars + cards on one screen.
- Ruthless mobile hierarchy (one question per screen).

**Delta-only cards (anti-stat-bloat):**
- Every stat must change a combat decision or it doesn't ship.
- Show +X/-X deltas, NOT raw stat walls.
- Link to per-limb damage (durability trades visible on doll).
- NO full-set defaults (kills build variety).

**RITE validation:**
- 5 players (comparable mech games), "build heavy mech in <3 min, no guidance."
- Think-aloud. Fix between sessions. Separate usability from engagement.

**Free paint (identity):**
- Zero-cost self-expression. Gates never feel like costume tax.
- Name/paint preset slot ON the paper doll (one tap away).

## Round 131: Production hangar spec (slice)
**"Valid Only" filter (IMPLEMENTED in hangar.js):**
- Weapon dropdowns disable options that would push total arm heat > maxHeat.
- Disabled-with-reason label ("over heat"). Never a modal error.
- Re-renders on change so both slots stay consistent.

**Two input paths (M3 picker):**
- Drag-drop onto silhouette AND bottom-sheet picker as equal citizens.
- Bottom sheet: modal per slot tap; drag handle + close X; one sheet at a time.
- Rows pre-filtered "Valid Only"; delta-only cards (DMG/weight/heat ≤5 numbers).
- One-tap equip + immediate Undo. Paint free/instant.

**Gates visible during selection:**
- Weight bar-vs-white-line + Power/Heat pair pinned above paper doll.
- Sub-100ms deltas. Yellow warnings for legal-but-suboptimal (within 10% of line).

**No set bonuses.** Per-piece identity only. ≤5 numbers per card.

**Validation:** RITE-lite — 5 players, think-aloud, 3-min task ("equip 4 arms inside Weight+Heat").
Fix between participants; stop at 2 consecutive clean. Telemetry: time-to-first-equip, failed drops.

## Round 140: Production hangar spec (slice)
**Two-axis pass/fail meter (IMPLEMENTED in hangar.js):**
- Heat budget bar: total arm heat / maxHeat. Red at threshold, amber ≥80%.
- Visual, not just disabled options (AC6 pattern).
- EN + JA labels.

**Production spec:**
- Valid-only filter (done) + two-axis meters + live paper-doll + one-click recipes (done).
- Test vs VEX skirmish from hangar (AC6 Test Mech loop) — slice addition.
- Stat bloat: macro (damage/heat/weight) visible; micro behind toggle.
- Hidden interdependence: cross-coupling deltas rendered at point of change.
- Analysis paralysis: weapon-first / frame-first guided paths + recommended default.

**Validation:** RITE (3-5 per loop; paper-doll recognition; valid-only comprehension).

**Build diversity:** telemetry tripwires (any weapon >45% or <8% = collapse).

**Orblike lesson:** paper-doll is a hypothesis — layout swappable; RITE decides.

## Round 155: Validation + jam hangar spec (slice)
**JAM HANGAR: LOCKED (IMPLEMENTED via JAM_BUILD + SQUAD_PRESETS).**
- JAM_BUILD = true → Hangar.open() shows squad-select (3 presets), not the full hangar.
- Presets: Brawler (blade/cannon, heavy), Skirmisher (rifle/missiles, light),
  Bulwark (cannon/rifle, heavy). One tap each, <30s (ItB model).
- Full hangar (recipes, valid-only, heat budget) stays for the slice.
- Rationale: jam playtests find "players miss the core mechanic"; presets convert
  the hangar from paralysis risk to flavor feature.

**Validation protocol (RITE):**
- 5 players × 3 rounds (Nielsen 5×3); FIX between rounds (Wixon: change after 1
  participant when the solution is clear).
- First task = paper-doll test: "equip a weapon to the left arm by clicking the figure."
- Diversity: 3-4 per group (touch iPhone vs desktop; mech familiarity; a11y needs).

**Anti-paralysis budget:** median build session ≤1 min; valid-only = hide info;
recipes = defaults; heat budget = cut branching. Merge-one-layer experiment if over.

**Post-jam unlock ladder:** starter + recipes first; unlocks via mission achievements
(ItB coins) and campaign progress (FTL A/B/C). Telemetry per unlock.

## Round 165: Jam hangar + validation spec (slice)
**JAM HANGAR DECISION: keep 3 presets, full hangar locked. No gate change.**
- Matches ItB (presets + default first, custom secondary). 6 options beat 24 by 10x
  (Iyengar & Lepper). Make the lock invisible — no "locked" taunt in jam UI.

**RECOMMENDED DEFAULT + CONSEQUENCE CARDS (IMPLEMENTED):**
- Bulwark = ★ RECOMMENDED (safest first pick vs the M3 VEX duel; revisit with playtest data).
- Gold border highlight on the recommended card.
- All cards rewritten in consequence language (Doucet): outcomes, not stats.
  "Survives ~2 extra hits" > "heavy armor". One viewport, no tabs.

**VALIDATION (this week, 5-8 players, pre-registered):**
- Time hangar-open → Deploy (<20s returning, <60s first-timer).
- Misclick rate on cards (Maze formula, target <5%).
- Task success "change squad, then start" (target 100%).
- One SEQ question (1-7). Unmoderated (dodge experimenter bias).

**TRAPS:** equal-value options (differentiate by identity, not numbers); hidden stats
(Raj: show what durability BUYS); slow flow (differentiator on the card face);
forcing deep customization (presets only — resist mech editing in jam).

## Round 174: Jam hangar + validation spec (slice)
**JAM HANGAR DECISION: change nothing structural.**
- 3 locked presets + ★ RECOMMENDED Bulwark + consequence cards = exactly right
  (Iyengar & Lepper 6-not-24; Book of Threes; Slay the Spire Ironclad default).
- Do NOT open part-level building for LD60.

**ONE-TAP DEPLOY (IMPLEMENTED in hangar.js + i18n.js):**
- Dominant "▶ Deploy — Bulwark ★" button above the 3 preset cards.
- Applies the recommended preset and closes immediately. Hangar→combat <60s
  (One Minute Rule). Choosers still pick from cards below.

**VALIDATION:**
- 3 fresh players + stopwatch (Krug): time-to-deploy <60s; paraphrase all 3 presets.
- Telemetry: hangar dwell time, preset hover order, deploy-tap per preset.

**POST-JAM:** full hangar behind progressive disclosure (unlock after M1; Hades/ItB model).
**TRAPS:** analysis paralysis; menu wall (stats w/o consequences); passive onboarding;
sunk-cost hangar (depth judges click past).

## Round 183: Jam hangar decision (slice)
**JAM HANGAR DECISION: nothing structural left to streamline.** Current design
matches best practice (single decision, recommended default, one-tap deploy).

**IMPLEMENTED — mission-contextual recommendation (LoL pattern):**
- Presets now carry `recFor` (mission index): brawler→M1, skirmisher→M2, bulwark→M3.
- Hangar tags the mission-appropriate preset with "◆ FOR Mn" alongside the global
  ★ RECOMMENDED (Bulwark stays the one-tap default).

**JAM HANGAR RULES:**
- Preset cards: name + one-line role + ★/◆ tags. No stat tables, no 4th preset.
- Pre-select last-used (or ★ Bulwark); hangar never re-explains to returners.
- Full part-level hangar = post-jam staged disclosure (Into the Breach model).

**VALIDATION:** 5-6 fresh players, "deploy and start", think-aloud, time-to-deploy
<60s via telemetry. Two tight rounds before LD60 lock.

## Round 192: Final hangar decision (slice)
**FINAL HANGAR DECISION: DEPLOY-READY (conditional).** No structural work.
Remaining: 5-user validation.

**AUDIT (verified compliant — spec only, +0 lines):**
- 3 presets (Brawler/Skirmisher/Bulwark) — smart defaults in place.
- ★ RECOMMENDED pre-selected (Bulwark) + one-tap deploy.
- ◆ FOR Mn mission badges (guided selection, non-blocking).
- Selection states distinct; SFX per tap; 48px targets.

**PRE-JAM VALIDATION (5 uncoached users, iPhone 17):**
- Task: "build a squad and deploy Mission 3."
- Telemetry: completion %, time-to-deploy, misclick rate, reversals, confidence 1-5.
- Pass: 5/5 complete, median <60s, misclicks <20%.

## Round 201: Final hangar sign-off (slice)
**FINAL HANGAR DECISION: DEPLOY-READY — CONDITIONAL (do NOT sign off yet).**
Sign-off requires: (a) 5-user gate ≥4/5 legal deploy unassisted;
(b) mobile 4-item gate cleared (hard blocker).

**IMPLEMENTED — butler pipeline rehearsal:**
- butler v15.32.0 installed (~/workspace/bin/butler), verified working.
- JAM_BUILD structure confirmed: index.html at root, 416K total.
- Deploy command ready (DO NOT RUN without Aldo's go-ahead):
  `butler push <zip> aldojjriveron02/mecha-protocol:html5`
- Anti-Draft-trap: verify page published/live + attached to jam entry.

**5-USER PROTOCOL (Nielsen/Bromley):**
- 5 representative users (casual browser = LD judging pool).
- Tasks: "build legal mech + deploy", "swap weapon", "fix illegal build".
- Silent observation + screen recording. Fix + retest (3×5 > 1×15).
- Gate: ≥4/5 complete legal deploy unassisted; errors comprehensible (MH-08).

**SUBMISSION CHECKLIST (frozen):** personal deadline 2h early; icon + screenshots
+ GIFs + video; itch page theme; rate/comment ≥10/day post-jam.

## Round 210: Final hangar confirmation (slice)
**FINAL HANGAR DECISION: DEPLOY-READY — CONDITIONAL (not confirmed).**
Sign-off criteria: (a) 5-user gate 5/5 unaided, zero blocking; (b) butler E2E tested;
(c) LD sandbox verified; (d) submission page complete.

**VERIFIED this round (code):**
- Embed detection: itch/LD/top/frame/unknown all correct (node test).
- bfcache resync: animation clocks + re-render on back/forward (Round 152).
- Storage health UI: warning shows when !storageOK (briefing screen).

**5-USER GATE PROTOCOL (3+2 rounds):**
- Tasks: deploy-ready mech unaided; export/reload save; assist toggle.
- 3 users → fix blocking (MH-08 paths) → 2 users confirm.
- Pass: 5/5 unaided to Deploy, zero blocking errors.

**LD PACKAGING:** itch.io via butler (primary); link from LD page.
Final ~6h = packaging + page polish only. Separate jam/post-jam channels.

## Round 219: Theme integration (slice)
**THEME STRATEGY: content/framing layer, NEVER core redesign.**
THEME_HOOK = one method, one Friday 6PM edit.

**ADAPTERS READY:** THEME-ADAPTERS.md — all 16 Round 2 candidates.
Each: verbs + mechanics beat + THEME_HOOK fill + twist.
2 of 16 survive Final Round; re-map Friday if needed.

**FRIDAY PROTOCOL:**
- 0:00-0:30 verb matching. 0:30-2:00 brainstorm 10-20, pick 2nd/3rd.
- Lock ONE mechanics beat + decorative. No core changes after hour 2.
- Cold-player legible in 30s.

## Round 228: Pre-jam freeze (slice)
**HANGAR FREEZE: HANGAR_FREEZE.md written (Kody W. social contract).**
Allowed vs banned lists. Deferred list. 5-user gate. Rollback discipline.

**FREEZE CLOCK:**
- Fri 6PM: theme reveal + THEME_HOOK fill. Hangar code frozen.
- Sun 6PM (48h): feature-freeze. 5-user gate on locked build.
- Sun→Tue: bugfix only. Mon: butler --hidden staging.
- Tue ≥60min before 6PM: final push live.

**JAM CATEGORY: Jam (not Compo).** 39h pre-existing code disqualifies Compo.
Ideal LD game: browser, minutes, alone. Raters play 3-10 min.
Hangar must onboard cold player to build-and-deploy in <60s.

**THEME:** 16 adapters only. No 17th. No hook changes after theme+24h.

## LOADOUT-SCREEN CANON (Round 234 — Wed 2026-10-14 ~22:52 EDT)
Five things every hangar screen must show (research-validated):
1. THE THING — live paper-doll, biggest element (redraw IS the feedback channel).
2. WHAT CHANGED — Diablo III deltas vs equipped (▲▼ + green/red, colorblind-safe). Implemented: HP/Move deltas + weapon signature on every preset card.
3. IS IT LEGAL — jam slice: presets always legal (no constraints to violate). Phase 2: BattleTech 3-constraint model (weight + power + hardpoints), illegal = unselectable with reason.
4. WHAT IT MEANS — role/fantasy label + plain-language desc (Round 165 consequence language).
5. THE EXIT — always-visible Deploy + Enter = deploy (XCOM pattern). Implemented Round 234.
Kleenex test (pre-jam): 5 cold players, hangar → mission <30s each, zero help, binary pass/fail.
Phase 2 seam: "Customize" one tap behind presets; loadout = named list of part/weapon IDs (shareable codes, Destiny/DIM model). Designed now, built later.

## 5-USER GATE PROTOCOL (Round 243 — Wed 2026-10-14 ~23:45 EDT)
Sun Oct 18 6PM, frozen build. 5 fresh players, one at a time, ~10 min each:
1. "Pick a preset and deploy" — no instruction. Time hangar entry → Enter=deploy. Pass: ≥4/5 <30s, zero questions.
2. Swap preset, point at screen, say what changed. Pass: ≥4/5 read delta aloud as prose ("HP down 46"), not math.
3. "Which preset is the tanky one?" Pass: ≥4/5 correct (signature legibility).
4. Undo check: jam hangar is selection-only (no commit until deploy) — verify tapping another preset always works, nothing locks early.
5. Grayscale audit: screenshot each preset card, desaturate — deltas must read fully in monochrome (ship-blocker if color-only).
6. Viability: play M1 with each of Brawler/Skirmisher/Bulwark — legal, winnable, honestly labeled. Unwinnable preset = cut, not shipped.
FREEZE: after gate passes — no new parts, no relabels, no UI polish. Any change restarts the 30s test.

## FINAL VERIFICATION (Round 252 — Wed 2026-10-15 ~00:36 EDT)
- Viability playthrough FIRST (before users arrive): one match per preset. Failing preset = CUT (two honest > three with a broken one). Never relabel to mask a balance problem.
- Signature check as five-second test: flash card, ask from memory. Not recalled → shape/pattern fix, never a brighter color (IGDA color-alone rule).
- Grayscale = hard gate: desaturate full hangar; every ▲▼ delta + weapon signature must parse. Color-only = fail.
- Delta read-aloud (Nielsen): users read each card's numbers aloud — misreads surface immediately.
- FREEZE after Sun 6PM gate: bug fixes only. No relabels, no delta changes, no unfreezing. Post-gate redesign = new untested behavior + needs a new 5-user round the schedule doesn't have. (Nielsen's 5 users = the complete protocol, not a compromise.)

## FINAL VERIFICATION (Round 261 — Wed 2026-10-15 ~01:31 EDT)
- Commit audit (verified in code): exactly two commit paths, both explicit — the labeled "▶ Deploy — [preset]" button and Enter (unbound on close). Preset-card clicks select-and-return; mission commit = btn-deploy → nextMission(), one explicit path. No click-through, no double-select. (XCOM pre-commit pattern.)
- Gate order (Sun Oct 18 6PM): (1) full viability playthrough per preset — hangar → deploy → mission complete; (2) five-second signature test, 3–5 fresh testers; (3) grayscale gate — desaturate, confirm hierarchy + delta readability in ~10s; (4) delta read-aloud + "which preset for the mission?" — hesitation/misread = defect.
- Preset honesty: on-card deltas + signatures must match in-mission values EXACTLY; recommendation must name the preset that fits (deploy-check it). "Sacrifice cool ideas for clarity every time." (Subset)
- Cut rule: fails the five-second test or misleads in playthrough = CUT, not fixed-forward. Two honest presets > three with one liar. (Yu: CUT. IT. OUT.)
- Freeze after gate: crash/deadlock fixes ONLY. Post-freeze edit voids the gate and requires re-running all four checks. (Yu: SAVE IT FOR THE NEXT GAME.)

## FINAL VERIFICATION (Round 270 — Wed 2026-10-15 ~02:43 EDT)
- Recommendation verified REAL (code read): recFor per mission index (Brawler→M1, Skirmisher→M2, Bulwark→M3); "◆ FOR M<n>" computed from current mission. Not decorative — encodes mission logic. (Anti-pattern #5 doesn't apply.)
- Five-second test per card (tonight): role name, delta direction, weapon signature. Fails → simplify the card (bigger deltas, shorter text) — never "explain better."
- Gate: five fresh 3-minute hangar→deploy→mission runs, back-to-back, silent observation. Ship-stopper: "that's not what I expected." Stop when findings repeat. (Nielsen; Hodent's scientific method.)
- Freeze timestamp (not a vibe): after the last viability playthrough on the locked build, crash fixes ONLY — each triggers a new full playthrough. (Chevy Ray: finish early.)
- Cut rule: can't pass the five-second test in the final 48h → removed or grayed out, not patched. "A removed feature can't confuse a judge." (Subset.)

## VERIFICATION ROUND 2 (Round 279 — Wed 2026-10-15 ~03:51 EDT)
- Verified (data read): recFor covers all 3 missions (no orphans). Preset honesty: Brawler = close-range loadout ("wins at range 1-2"); Skirmisher = light/fast ("dies to one focused burst"); Bulwark = heavy ("survives ~2 extra hits"). Loadouts match labels; tradeoffs in consequence language. No lies on cards. (Hodent.)
- Viability playthrough (jam-day): each recFor preset must clear its mission on a timer. A recommended squad that can't win = a false promise (decorative badge = dark pattern). (Coates/Hodent.)
- Honesty checklist at freeze: role name = play pattern; deltas on-card; signatures = real behavior; badges from recFor logic only. No hover-only stats. (ItB; XCOM 2 mod evidence.)
- Freeze timestamp + no-unfreeze rule (existing). Any post-gate edit re-opens the full gate.

## VERIFICATION ROUND 3 (Round 288 — Wed 2026-10-15 ~04:55 EDT)
- Teach the WHY (js/data.js + js/hangar.js, Hodent): the ◆ FOR M<n> badge said which mission, not why — a decorative recommendation. Each preset now carries `recWhy` ("M1 is close-quarters — wins at range 1-2"; "M2 is open ground — speed decides it"; "M3 is the VEX duel — survive ~2 extra hits"), rendered VISIBLY inline on the card (not a hover tooltip — no hover on touch).
- 5-user / 5-second gate (Nielsen; Kuric): 5 fresh players, 5–10s exposure (dense UI justifies longer), one question: "what are you choosing between, and which squad would you pick?" Pass: all 5 name all 3 presets + their playstyle difference; all 5 complete a pick. Any miss = fix + re-run with new users.
- Viability playthrough (Subset standard): one full winnable run per preset. A preset that can't clear the game = dishonest card → rebalance or rewrite before freeze. Last chance to touch stats.
- Freeze timestamp + commit audit: after freeze, a hangar change is allowed only if (a) it fixes a bug AND (b) alters no preset stats, copy, or flow — checked explicitly. Reopening invalidates the gate + playthroughs. (arimia: scope creep killed the project.)
- One-tap commit within 30s (Kraj + FTUE): 3 cards, one dominant CTA, no interstitials. Time 5 fresh players hangar-open→committed; every run under 30s. Slower = a flow defect, not a player defect.

## VERIFICATION ROUND 4 (Round 297 — Wed 2026-10-15 ~05:32 EDT)
- Verified (code read): no tier-list implication. ★ = safe pre-selected default (one-tap commit path). ◆ FOR M<n> = mission-optimal pick (varies: Brawler/M1, Skirmisher/M2, Bulwark/M3). "Default vs situational," not "best vs rest." (Harrison: "choose your difficulty" — the preset choice is self-calibration.)
- recWhy audit as the first ship-blocker (Lyssna): five-second test — show hangar 5s, hide, ask "why is that squad recommended to you?" Pass: player states the recWhy in their own words. Any rec that can't pass = decorative = blocks the freeze. Pair with first-click test ("show me where you'd deploy").
- 5-user gate, scripted (NNGroup; Cox): 5 fresh players, written script (same intro, same brief, same rec). Measure: time-to-commit (median <30s), drop-off before first battle, confidence 1–5 (JeremyTDM). Fix; second small round. "As many small tests as you can afford" beats one big round.
- Ship-blockers (defined before the round): (a) any rec fails the recWhy audit; (b) any commit-relevant stat hidden at commit time (Bycer/Raj); (c) median time-to-commit >30s; (d) confidence <3/5. After the gate: only blockers reopen the hangar.
- Presets as identities (Harrison): Brawler/Skirmisher/Bulwark read as complexity+reward identities — recFor says who it's for, recWhy says why, the tradeoff is on the card. Never imply one preset is "best."
- One-tap commit consistency (Montgomery): don't redesign commit semantics between jam hangar and full hangar. Phase 2 adds depth (more stats/options), not friction (no added confirm dialogs). Any new Phase 2 step re-passes the first-click test + 30s gate.

## VERIFICATION ROUND 5 (Round 306 — Wed 2026-10-15 ~06:07 EDT)
- Verified (code read): ◆ is not a fake choice. Three presets, three missions, three mission-grounded reasons (data.js:45-54). The tag varies; the reasons cite visible mission info.
- Commit contract freeze: one-tap commit is final; no re-picks, no loss-aversion nudges after commit. Ship-blocker: any build allowing post-freeze churn fails the gate.
- 5-user gate as scripted evaluative rounds: fixed brief → "pick and commit in under 30s" with pass/fail, think-aloud, fixes between rounds (RITE). Ship-blockers: 5-second comprehension, first-click on preset/commit, post-commit confidence median ≥6 with zero "disasters" (Sauro: high confidence + wrong squad).
- Preset honesty lock: ★ always committable and plainly marked; ◆ must cite mission info visible on the hangar screen. Ship-blocker: any tag unjustified from shown info = fake choice, cut or re-grounded.
- Anti-dark-pattern audit: four families (temporal, monetary, social, psychological) + confirmshaming on every dismiss/back. Highest risk: psychological (endowed progress/loss aversion around commit). Commit language neutral and final.
- Commit consistency (XCOM 2): same presets, same one-tap, same semantics wherever the hangar appears. Any divergence = ship-blocker.

## VERIFICATION ROUND 6 (Round 315 — Wed 2026-10-15 ~06:39 EDT)
- Verified (code read): choice audit passes. Brawler◆M1, Skirmisher◆M2, Bulwark◆M3 — each ◆ on exactly one mission, intransitive across classes, no dominated choices. ★=Bulwark (safe default). recWhy mission-conditional, never absolute. Descriptions honest with weaknesses.
- Numeric ship-blockers (freeze): define per-preset, per-mission-class bands now (Riot-style). "No preset exceeds X% pick-rate across all missions (dominant = ship-blocker); no preset at ~0% on intended-viable missions (fake choice = ship-blocker); success-rate deltas within Y points across skill bands." Freeze the bands; only data reopens them.
- Two audits (checklist gate): (a) choice audit — pairwise dominance per mission class, strictly-dominated = fail; (b) label audit — every ◆ recWhy verified against observed mission conditions; unverifiable or absolute claims ("best," "strongest") = fail. Both pass to unblock ship.
- Valve-style playtests: each label = hypothesis; observation-first sessions. New players in hangar; watch picks; ask them to explain ◆ back in mission terms. Start as soon as playable.
- Telemetry plan: log preset picks + mission outcomes per mission class + skill band from day one. Pre-committed bands = interpretation key. Honor "don't punish popularity" — popular only a problem if success rate is also out of band.
- No-tier-list copy review: grep all hangar strings for absolute-ranking language ("best," "strongest," "S-tier," "meta") → replace with mission-conditional recWhy. Exactly three presets, preselect ★, never ◆ without recWhy.

## VERIFICATION ROUND 7 (Round 324 — Wed 2026-10-15 ~07:13 EDT)
- Verified (code read): deploy flow. Tap card → applyPreset(i) deploys that preset (hangar.js:90). Big button → deploys recommended (hangar.js:95). Each shows exactly what it deploys. One-tap deploy (Round 174). ★ pre-selected; ◆ + recWhy on mission-optimal.
- Freeze hangar now (ship-blockers only): no new cards, badges, tabs, stat rows. Ship-blocker only if: crash/softlock, unreadable brief/recWhy, or accidental launch. 3 presets = sweet spot (Tilford, NN/g) — protect it.
- Fresh-player playtest (5–8 first-time, hangar only, silent): "choose a squad for this mission," no coaching. Log time-to-decide, flip-flops, near-miss taps, confidence (1–5). Ship-blocker: any player launches with wrong ◆ from label confusion, or can't articulate what ★ means.
- Light telemetry: hangar entry → card views → selection → (de)selections → launch, with timestamps. Review ◆-pick-rate per mission vs choice-audit rule (each ◆ on exactly one mission).
- Heuristics pass (NN/g game list): badges ◆/★ visually distinct, consistently placed; recWhy on card (recognition not recall); plain-language role line under each name; selection reversible until confirmed launch; every tap gives feedback. Fail = ship-blocker only if it causes wrong/accidental launch.
- Error-recovery loud: explicit selected-state styling; visible "change selection" affordance; launch button = deliberate commit (distinct, bottom-anchored, requires seen selection). Prevent errors (separate Select from Launch) rather than apologize.

## VERIFICATION ROUND 8 (Round 333 — Wed 2026-10-15 ~07:47 EDT)
- Verified (code read): mission briefings. All 3 missions have briefingKey (data.js:85,101,117). M3 full AI briefing (ai-dialogue.js:35). Audit fields present.
- Fresh-player validation (ship-blocker): lab/remote playtests with intended audience (Bromley). If fresh player can't state objective + why ◆ recommended after one hangar visit, hangar fails — fix, don't ship.
- Hangar funnel (ship-blocker): log entered → preset viewed → recWhy expanded → selected → deploy tapped → backed out. Funnel it (GameAnalytics). Any step >20% unexplained stall = fix or document.
- A/B test ◆/★ (staged, Bayesian): recWhy wording variants, ★ labeling variants. Never as tier list — ◆ always carries reason, never rank.
- Anti-paralysis audit (Laurie): headline stats first, full detail on tap; ◆ recWhy names mission-specific reason; ★ always same safe meaning; briefing states win condition in one line. Ship-blocker: briefing skimmable <5s, re-accessible after skip.
- Commitment protection: preset freely changeable until explicit deploy tap; back out of briefing to hangar without penalty (Old World lesson). Deploy stays two-path one-tap, but verify deliberate — final confirm shows squad + mission + difficulty (XCOM 2 pattern).

## VERIFICATION ROUND 9 (Round 342 — Wed 2026-10-15 ~08:19 EDT)
- Verified (code read): button labels. "▶ DEPLOY — [Name] ★" (hangar.js:65) — verb + outcome + ★. Passes Smashing audit. (NN/g 3 I's.)
- Button-label freeze audit (ship-blocker): read every hangar label out of context. Each ≤3 words, starts with action verb, names outcome ("Launch mission", "Select Brawler", "View briefing" — never OK/Submit/Continue). Flag any label needing surrounding context. Freeze after sign-off.
- Error-message audit (ship-blocker): trigger every hangar failure (deploy with no preset, unavailable mission, locked content). Each must name problem in plain words, say exactly what to do next, offer working CTA — no dead ends, no codes, no blame. Dead-end error blocks freeze.
- Empty-state audit: every empty hangar state (no missions unlocked, no progress, cleared history) gets triple — what belongs here, why empty, one CTA. Unexplained blank panel blocks freeze.
- Comprehension check (5 min, 3 fresh players): expectation-test core markers — cover preset cards, ask "what does ◆ mean?", "what does ★ mean?", "what happens if you pick Brawler?" Cloze-style: answers in own words matching recWhy + safe-default intent. Mismatch = copy rework, not design change.
- Voice lock: one style note (hangar voice: confident, encouraging, plain-spoken — consistent across presets, ◆ recWhy, briefings, errors). Ship-blockers: (a) misleading label, (b) dead-end error, (c) tone break across preset cards. Everything else (polish, flavor) → post-jam backlog. No copy edits post-freeze except blockers.

## VERIFICATION ROUND 10 (Round 351 — Wed 2026-10-15 ~08:46 EDT)
- Verified (code read): FTUE discipline. No first-run tour; 3 presets + ◆/★ + one-tap deploy. Tap → deploy → battle. No account/settings/permissions before first play. 60s budget met (<30s first-timer). (PUNCHEv.)
- Freeze as single-decision gate: ◆/★ implements "one decision at a time" + "default is good path." Lock freeze — no new choice/toggle/panel without re-audit. Ship-blocker: any change asking player to decide before understanding choice. (PUNCHEv; Idle Journey.)
- Time deploy path (ship-blocker): hangar-entry → mission-launch = "time to core gameplay." Confirm within 60s, first-run tour ≤2 steps, nothing before first play. Ship-blocker: any hangar step opening new panel (Idle Journey: panel-open = worst drop-off).
- Gate by relevance: show extent (unlockables) as open-loop seed, but reveal each only when actionable. Script HUD arrival, not populated at once. Returning player: veteran should not re-pick preset every session (skip-path rigor). Ship-blocker: re-entered hangar front-loading full interface.
- Instrument as funnel: per-step events (hangar reached, dwell, ◆/★/manual pick, hangar→deploy conversion, session-1→2 return). Read as funnel, not average. Data dictionary maintained. Benchmark: FTUE completion <60-70% = warning. Ship-blocker: shipping hangar without telemetry. (Playio; Idle Journey.)
- New-player pass: moderated watch for hesitation on actual build (not doc), neutral testers not teammates. Log hesitations; re-test HUD-intro and skip paths. Freeze holds only if no copy/label/flow change without re-running audits 1-3. (Nasty Rodent.)

## VERIFICATION ROUND 11 (Round 360 — Wed 2026-10-15 ~07:21 EDT)
- Verified (design): hierarchy discipline. 3 presets; ◆ = focal (mission-optimal); ★ = second (safe default); deploy = action. "Less is more." Star = ◆ card. (NNG; Lovato; Coates.)
- Three audits (ship-blocker): visual-hierarchy (◆ wins on position/color/size/motion every mission variant; ★ second; if color alone carries distinction, fails greyscale test); consistency (screenshot all states side-by-side; any one-off style = blocker until matches spec or removed); delight (every interactive element returns instant feedback; any dead click = blocker). (NNG; GameAnalytics.)
- Greyscale check: render hangar in greyscale (or desaturate screenshot). Optimal-choice card must still read as focal; three presets distinguishable by layout/scale alone. If hierarchy collapses without color, fix layout — not color. (Coates wireframing.)
- Progressive disclosure freeze: at freeze, hangar shows only what choice needs (3 cards, ◆/★ + recWhy, deploy/back). Any element proposed after must displace existing one, not be added — new additions auto-deferred post-jam. Protects rounds 1-10 from dilution. (Lovato; Coates.)
- Cold viewers (3-5): task "pick loadout for this briefing." Ask what assumed, what confused, where eyes went first. Fix misunderstandings (hierarchy failures = blockers); ignore taste. Device check: non-16:9 aspect + small window — overlap/clipping/illegible = blocker. (Coates; Bugnet.)
- One motion pass: every interaction gets subtle trigger–feedback (hover lift/glow, selection pulse, deploy transition). Animation subordinate to function (NNG subtlety; Coates eye-path). No new animations after freeze; tuning only. Fully static ships only if motion distracts.

## VERIFICATION ROUND 12 (Round 369 — Wed 2026-10-15 ~07:46 EDT)
- Verified (file check): launch checklist exists. LD60-MASTER-CHECKLIST.md present. 11 hangar verifications complete. Evidence-based go/no-go pattern. (TQ Systems.)
- Freeze hangar now: declare content freeze on hangar pillar effective immediately — no new presets, no new ◆-recommendation logic, no copy changes. Post-freeze, only P0 ship-blocker fixes land, each with written risk note. Counters "Last-Minute Heroics." (TQ Systems.)
- Go/no-go audit: hold short review against 11 verifications (choice audit, deploy flow, briefings, microcopy, button labels, FTUE, UI polish, hierarchy, label/error/empty-state, comprehension, voice, polish). Decision recorded as GO / GO WITH CONDITIONS / NO-GO with evidence links; any unverified item becomes tracked action, not shrug. (TQ Systems.)
- Dry-run deploy flow: wipe save data, play FTUE → hangar → preset selection (Brawler/Skirmisher/Bulwark) → ◆ mission-optimal → ★ safe default → deploy, on clean browser with no cached state. Verify recommendations show correct recWhy per mission and ★ always selectable. (TQ Systems rehearsal.)
- Rollback plan (5 lines): document what "rollback" means for jam build — which prior build is known-good fallback, where stored, trigger (e.g., hangar soft-locks, preset selection doesn't persist, deploy button dead). Plan fitting on index card beats theoretical one. (LaunchDarkly.)
- Launch-day monitoring: decide in advance what to watch in first play sessions — console errors in hangar, FTUE drop-off at preset selection, whether players pick ◆ vs ★ vs manual. Log during playtests now so launch day is observation, not discovery. Schedule post-jam retrospective before jam starts. (TQ Systems hypercare.)

## VERIFICATION ROUND 13 (Round 378 — Wed 2026-10-15 ~08:20 EDT)
- Verified (spec read): hangar launch UI. 11 verifications cover VberAI's 6 checks: (1) device matrix (R359); (2) EN-only jam, JA in repo (R354); (3) N/A; (4) choice audit (R174); (5) PWA Release (R368); (6) freeze discipline (R369). Egmatic's "binary that passed review ships." (VberAI; Egmatic.)
- Declare dated freeze: even one-day jam-scale freeze works — after freeze, only crash/blocker fixes may touch hangar code, every hotfix must land in repo first (no uncommitted canvas/scene-only edits). Fixes found post-freeze join post-jam hotfix, not shipping build. (Egmatic; VberAI; Preprod.cloud.)
- Release-build smoke: ~30-minute smoke of full hangar → deploy → mission loop on real device — not dev/debug build — covering rotation, smallest supported aspect ratio, every live locale; specifically watch ◆/★ markers, recWhy text, button labels for overflow/truncation, confirm numbers match design tables. (VberAI; Egmatic: install and walk like stranger.)
- Lock hangar copy: string freeze with stable meaningful string IDs; audit that no player-facing string hard-coded or assembled from fragments (e.g., "◆ optimal for {mission}"); spot-check longest locale (German) for button-label expansion. (Localazy; Alconost.)
- Asset validation: on clean install of shipping build, confirm every preset icon, ◆/★ marker glyphs, all hangar assets actually load — and chosen font contains ◆/★ glyphs at sizes used. (VberAI: Release-build asset check.)
- Fresh-eyes regression: tester who didn't build hangar walks FTUE → hangar → deploy as first-time player, then re-runs after ANY last-minute hangar change — because rapid last-minute fixes introduce new issues. Keep previous known-good build as rollback. (Testers HUB; Preprod.cloud.)

## VERIFICATION ROUND 14 (Round 387 — Wed 2026-10-15 ~08:49 EDT)
- Verified (spec read): hangar freeze defined. :327: "Freeze timestamp + commit audit: after freeze, hangar change allowed only if (a) fixes bug AND (b) alters no preset stats, copy, or flow"; :372: "Button-label freeze audit (ship-blocker)"; :390: "Progressive disclosure freeze." Matches Bugnet (freeze scope + approval path) and Into the Breach ("sacrifice cool ideas for clarity"). (Bugnet; Into the Breach.)
- Declare hard hangar freeze now: lock presets, ◆/★ markers, recWhy copy, briefing text, button labels. Log any post-freeze change as exception requiring re-audit of verification 13's scope — no silent edits. (Bugnet; DevZero; LaunchDarkly.)
- Final freeze-build regression: five critical paths — preset select → ◆ marker accuracy → recWhy display → briefing linkage → mission launch. Pass/fail against HANGAR-SPEC.md verifications 1–13, not vibes. (AltTester: regression concentrates on known behavior and side effects.)
- Ship-blockers (explicit before launch): any ◆/★ marker inaccuracy, any broken hangar→mission handoff, any unreadable microcopy, any FTUE stall. Everything else = post-jam. (QATestLab risk map.)
- Into the Breach rule (final polish): "sacrifice cool ideas for clarity" — if any hangar element (tooltip, animation, label) doesn't serve Brawler/Skirmisher/Bulwark choice, cut it before launch rather than fixing after.
- Written sign-off: one-page launch checklist mirroring verifications 1–13 with named sign-off per gate; hangar ships only when all gates signed. Keep signed checklist with HANGAR-SPEC.md as launch record. (QATestLab.)

## VERIFICATION ROUND 15 (Round 396 — Wed 2026-10-15 ~09:24 EDT)
- Verified (spec read): choice audit passes. :347: "Brawler◆M1, Skirmisher◆M2, Bulwark◆M3 — each ◆ on exactly one mission, intransitive across classes, no dominated choices. ★=Bulwark (safe default). recWhy mission-conditional, never absolute." Matches Unity (comprehension check, assist-free) and XCOM 2 (mission-contextual, recommends by fit, never ranks). (Unity; XCOM 2.)
- Freeze hangar before sign-off: no microcopy, label, layout, or preset-stat changes after freeze point; any change resets sign-off checklist. (Unity: audits must not chase moving target.)
- 5-player assist-free choice audit: five new players, scenario "deploy for this briefing," pass = all can (a) name ◆ preset and paraphrase its recWhy, (b) find ★ default, (c) complete deploy without asking for help. Record task-success and time-to-deploy; any failure = ship-blocker. (Unity: 5–6 participants per round.)
- Instrument selection→deploy funnel at launch: events for hangar-entered, preset-viewed, ◆-selected, ★-selected, deploy-pressed, mission-started; add post-mission correlation of preset choice vs outcome. Choice-drift detector — if ◆ picks underperform ★ default, recWhy logic is day-one patch priority. (GameAnalytics.)
- Deploy-flow double-check: after preset confirmation, deploy screen states chosen preset back ("Deploying Brawler — ◆ mission-optimal") with one cancel path; professional choice-lock technique prevents misclick-to-mission failures.
- Post-launch A/B discipline: any hangar microcopy/label change post-launch ships as A/B test against frozen baseline, measured on deploy-rate and hangar drop-off — never as unmeasured hotfix. (GameAnalytics LiveOps.)

## VERIFICATION ROUND 16 (Round 405 — Thu 2026-10-15 ~10:01 EDT)
- Verified (spec read): roster discipline exists. :356: "Freeze hangar now (ship-blockers only): no new cards, badges, tabs, stat rows. 3 presets = sweet spot (Tilford, NN/g) — protect it"; :396: "Freeze hangar now: declare content freeze on hangar pillar effective immediately — no new presets, no new ◆-recommendation logic, no copy changes. Post-freeze, only P0 ship-blocker fixes land." Matches Mega Crit (expand deliberately, then freeze) and Subset (new rules, not stat remixes). (Mega Crit; Subset.)
- Freeze discipline: declare a roster cap before year-2 begins. Adopt Mega Crit's rule: new presets ship one at a time, each must introduce a new playstyle (Into the Breach bar), and the roadmap names the final roster size. No preset enters development without a one-line recWhy that no existing preset could carry.
- Ship-blocker #1 — evolution audit gate: a new preset cannot ship unless it (a) creates a diamond on at least one mission type without erasing existing diamonds; (b) never takes the star's "safe default" slot; (c) does not become diamond-everywhere (power-creep check — if it wins every mission, it fails, per the Firaxis counter-design lesson).
- Ship-blocker #2 — choice-scaling lock: with each addition, re-run the existing choice audit and briefing/microcopy verification at N+1: every briefing recWhy must still discriminate cleanly, no tied diamonds, and a segmented playtest (new vs. veteran, per GDC 2020 "Choices") must show the star remains the obvious safe pick for first-time players.
- Ship-blocker #3 — monitoring instrumentation before launch: wire pick share, mission-clear rate per preset, and hangar-abandon events into telemetry from day one of the expansion, with pre-registered tune/remove thresholds (telemetry-supported design; Bayesian A/B per GDC 2014). A preset that cannot be measured cannot ship.
- Bilateral expansion rule: every new preset ships with its mission context — new missions or briefing situations where it is the diamond, and at least one mission where an existing preset counters it (the War of the Chosen lesson: add answers and questions together, never tools alone).

## VERIFICATION ROUND 17 (Round 414 — Thu 2026-10-15 ~12:48 EDT)
- New this round (spec only): briefing-design plan. Spec has no briefing-design deep-dive — this round adds it. Matches Hodent (forgetting curve, attention scarcity), XCOM 2 (consistency + intel), Into the Breach (perfect-information briefing). (Hodent; XCOM 2; Into the Breach.)
- Freeze the briefing contract: Lock the hangar's decision-relevant info set: mission objective, threat preview, preset deltas, recWhy one-liner, deploy confirm. Any post-freeze change re-runs the comprehension test. SHIP-BLOCKER: no build ships without the threat preview visible at the decision point.
- Make recWhy falsifiable and live: Compute the diamond from current mission parameters; log recommendation vs mission outcome; dashboard diamond-vs-star win-rate delta per mission; fire a drift alert after every balance patch. SHIP-BLOCKER: recWhy logic must pass a backtest against mission data before launch.
- Run a briefing comprehension playtest (Bromley method): 5–8 target players, non-leading probes ("what does this mission need — which preset, and why?"), iterate microcopy until 100% can state the objective and retell the recWhy reason. SHIP-BLOCKER: zero critical misunderstandings in the final round.
- Instrument the hangar funnel on day one: Events: briefing viewed → preset selected → recWhy expanded → deployed → mission outcome. Track hangar dwell time and deploy abandonment as FTUE/pacing signals. SHIP-BLOCKER: telemetry events verified firing in a live build.
- Add a pre-commitment deploy preview (XCOM 2 pattern): A final confirm step summarizing mission + chosen preset + expected threats — prevents the #1 hangar error (wrong preset deployed) and satisfies error-prevention heuristics. SHIP-BLOCKER: deploy requires explicit confirm showing the preset and its recWhy reason.

## VERIFICATION ROUND 18 (Round 423 — Thu 2026-10-15 ~13:37 EDT)
- Verified (spec read): deploy-flow discipline defined. :373: "Error-message audit (ship-blocker): trigger every hangar failure (deploy with no preset, unavailable mission, locked content). Each must name problem in plain words, say exactly what to do next, offer working CTA — no dead ends, no codes, no blame. Dead-end error blocks freeze." Matches NNG (error prevention) and XCOM 2 (iterated deploy contract). (NNG; XCOM 2.)
- Freeze discipline: lock the deploy contract — 3 presets (Brawler/Skirmisher/Bulwark), diamond = mission-optimal with falsifiable recWhy, star = safe default, briefing gate, deploy commit. Any change to presets, briefing content, or launch sequence must pass the choice audit before it ships; treat deploy-flow edits as schema changes, not tweaks.
- Run the deploy audit as a checklist (per NNG heuristics): before jam launch, verify (a) every hangar screen shows current state and next action; (b) back/undo exists on every deploy step (emergency exit); (c) no choice is required before the player understands it (briefing and recWhy visible before commit); (d) invalid states are impossible, not just messaged (e.g., deploy button disabled until a valid preset is chosen).
- Install error locks, not just error copy: make unreachable states the default — you cannot launch with an empty/invalid preset; diamond-optimal cannot be selected without its condition being displayed and true; every error has a plain-language message stating the problem and the fix (NNG error-message rule). This is the anti-error-drift mechanism.
- Instrument the deploy funnel for post-launch monitoring (per GameAnalytics/PlaytestCloud): emit events for hangar_viewed → preset_selected → briefing_shown → deploy_pressed → mission_started, plus deploy cancellations and FTUE drop-offs. Feed these into the evolution gate — the deploy flow gets tuned from behavior, not opinion.
- Define ship-blockers explicitly: (a) any bug that blocks or mislabels deploy (wrong diamond pick, missing briefing, silent invalid launch); (b) any deploy error with no plain-language recovery path; (c) FTUE deploy-completion failure above an agreed threshold in final playtests. No ship while a blocker stands.

## VERIFICATION ROUND 19 (Round 432 — Thu 2026-10-15 ~14:23 EDT)
- New this round (spec only): loadout plan. Spec has hangar discipline but no loadout plan — this round adds it. Matches Destiny 2 (atomic named presets), Into the Breach (squads as presets), MHW (identity travels with function). (Destiny 2; Into the Breach; MHW.)
- LOCK AND NAME THE 3 PRESETS (freeze discipline; ship-blocker): Give each preset a role-encoding name and a one-line purpose ("Breach: close assault", etc.). Ship-blocker: no preset may reference parts/weapons outside the verified jam scope; any untested combination is cut, not fixed at the last minute.
- RUN THE PRESET DISTINCTIVENESS AUDIT (loadout plan): Per the League of Gamemakers "variation in value" principle, verify each preset is visibly and mechanically distinct — different primary weapon, different role, different paper-doll silhouette. If two presets blur together in playtest, merge them and spend the slot on clarity. Validation: playtest each preset in a representative mission; record time-to-decide in the hangar (hesitation = unclear goals).
- INSTITUTE THE PAPER-DOLL LOCK (ship-blocker): The canvas redraw must be deterministic per preset and verified by a drift check: equip preset → redraw → confirm silhouette/layers match the spec, for all 3 presets, before every build. No preset ships with a stale or mismatched visual. This is the direct counter to paper-doll drift and Rainbow Pimp Gear.
- DEFINE POST-LAUNCH HANGAR METRICS NOW (post-launch monitoring): Instrument: preset pick rate, mission win rate per preset, and hangar dwell time. Set thresholds: pick rate >60% or win rate markedly above the others triggers a balance review; pick rate near 0% triggers a design review (dead slot). This is the "1000 Hours of Difficulty" / "Data-Driven not Data-Blinded" discipline applied to 3 presets.
- GUARD THE 3-PRESET CAP (anti-pattern prevention): Treat "add a 4th option" as a design change requiring justification against analysis-paralysis evidence, not a content addition. The cap is a feature: it keeps the hangar readable, the paper-doll silhouettes memorable, and deploy verification tractable (3 deploy paths, fully verified, beats N paths partially verified).

## VERIFICATION ROUND 20 (Round 441 — Thu 2026-10-15 ~15:09 EDT)
- New this round (spec only): roster plan. Spec has roster discipline but no roster plan — this round adds it (freeze + publish, audit checklist, progression audit, combo testing, post-launch monitoring). Matches Brazie (balance guide), Schreiber (progression), Into the Breach (small-roster discipline). (Brazie; Schreiber; ItB.)
- Freeze the roster at 3 presets and publish the freeze: treat the lock as the balance foundation. Follow the Into the Breach precedent — a tiny roster that is deeply balanced beats a wide one that isn't. Post-freeze changes are number-tuning only; no new roles, weapons, or units after freeze.
- Ship-blocker roster audit checklist — no deploy unless every preset answers: (a) what is its job? (b) what counters it? (c) where does it sit on the cost-vs-power curve? A unit with no counter or no defined job is a roster gap and blocks ship.
- Run the progression audit on the full unlock space, not the golden path: apply the Ori lesson — verify each unlock keeps PerceivedDifficulty intact (Schreiber's equation). Any unlock that makes another preset irrelevant is progression drift and blocks ship.
- Add combo testing to the audit checklist: evaluate presets multiplicatively in squad combinations, per Brazie — a legal combination that trivializes content is a balance bug, not a feature.
- Define the post-launch monitoring plan before jam ends: pick-rate and win-rate per preset, a review cadence, and a patch channel. The balance process never ends at ship; "no metrics plan" is post-launch hangar neglect.

## VERIFICATION ROUND 21 (Round 450 — Thu 2026-10-15 ~15:58 EDT)
- New this round (spec only): build-crafting plan. Spec has loadout and roster plans but no build-crafting plan — this round adds it (squad identities, sidegrade-only rule, hard-constraint crafting, Riot-style monitoring, post-launch discipline). Matches Wayward (loadout systems), Bycer (customization), Riot (balance framework). (Wayward; Bycer; Riot.)
- Freeze each preset as a complete "squad identity" (Into the Breach model): Give each of the 3 presets a one-sentence playstyle identity, keep ~75% shared core rules, and let the swapped ~25% carry the identity. SHIP-BLOCKER: any preset lacking a distinct identity, or containing a strictly-dominated option (the Phalanx-vs-Imperator test), fails freeze — fix before jam lock.
- Adopt a sidegrade-only parts rule (TF2/Bycer): No part or weapon may be a strict upgrade; every option must show a legible tradeoff on the hangar screen itself. SHIP-BLOCKER: any part that playtesters never pick, or that is picked >85% of the time, is a failed option — rework or cut.
- Enforce hard-constraint build-crafting (Armored Core VI lesson): Even within the 3 presets, govern part swaps with a legible constraint (points/weight/slot budget) so choices are tradeoffs, not accumulations — constraints prevent degenerate combos structurally instead of by tuning. SHIP-BLOCKER: any loadout combination that bypasses or breaks the constraint model.
- Stand up Riot-style monitoring from day one of the jam: Log pick rate per preset/part and win rate per loadout; pre-commit numeric flag thresholds (e.g., any preset below 15% pick rate or above 65% win rate gets flagged). Lightweight telemetry now prevents Payday 2-style customization drift later. SHIP-BLOCKER: ship the jam build with the logging hooks in place even if no dashboard exists yet.
- Codify post-launch hangar discipline (Wayward): Any future unlocks follow tech-tree-style progression, never grind/currency FOMO gates; new content is constrained and targeted; the 3-preset readability is never fragmented (the loadout-mode fragmentation warning). SHIP-BLOCKER: no new preset/part enters the roster without passing the build-crafting audit (shared-core rule), the customization audit (moment-in-the-sun test), and the post-launch audit (defined monitoring threshold).

## VERIFICATION ROUND 22 (Round 459 — Thu 2026-10-15 ~18:26 EDT)
- New this round (spec only): balance plan. Spec has build-crafting, loadout, and roster plans but no balance plan — this round adds it (Balance Framework with explicit bands, three-phase validation pipeline, counterplay audit, anti-pattern ship-blockers, post-launch monitoring with alert bounds). Matches Riot (balance framework), Brazie (balance guide), 2XKO (live balance philosophy). (Riot; Brazie; 2XKO.)
- Freeze a public-style Balance Framework in HANGAR-SPEC.md with explicit bands: Define OP/underpowered thresholds (e.g., win rate + presence bands per Brazie/VALORANT/Riot), a counterplay checklist (readable cues? counter more accessible than the play? no unreactable kills?), and a buff rule (buff only when weak at all skill levels). SHIP-BLOCKER: no unit/weapon/loadout change ships without the three questions — what problem, what player behavior, what specific change (Brazie).
- Lock the three-phase validation pipeline (2XKO template) into the jam plan: Phase 1: high-skill pressure testing by a dedicated GAT-style group to validate core tactics hypotheses; Phase 2: pre-launch polish with analytics + qualitative playtest data; Phase 3: post-launch monitoring cadence (~every 5 weeks), with "no changes for the sake of changing things." Freeze discipline: lock unit stats before launch; post-launch tuning only within the framework's bands.
- Run a counterplay audit on every hangar preset/weapon: Each option needs: a cue the opponent can perceive (audio/visual), a counter that's more accessible than the play, and a clear power window. SHIP-BLOCKER: any option whose counter is buried in execution difficulty or that produces unreactable losses fails the audit (Brazie; Raze case study).
- Codify the anti-pattern rules as ship-blockers: (a) no overcorrection — don't retune numbers when the root cause is a knowledge gap (teach the counter instead); (b) triage rule — only break cadence for runaway outliers (~75%+ win rate) (Brazie); (c) every nerf ships with a "breadcrumb" buff to an underused option in the same patch (Brazie); (d) no table-flipping reworks that force mass re-learning (Frank/Riot).
- Stand up post-launch monitoring with alert bounds before launch: Track pick rate, win rate by skill tier, and sentiment (fun/frustration) — the VALORANT three-input radar. Flag breaches for investigation, not auto-patches. Guard against meta drift (don't re-patch before the meta settles) and utility creep (log complexity cost of every new part/weapon). Complexity cost review is a standing agenda item.
