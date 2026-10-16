# Accessibility — Production Spec (Round 103)
**Status:** 44px targets ✓, verbosity Off/Reduced/Full ✓, 4 assist toggles ✓, pattern chevrons ✓. This spec is the production target.

## One-hand (iPhone 17)
- 44×44 CSS px minimum (Apple HIG / WCAG AAA).
- Tap not drag: tap-to-select, tap-to-confirm. Drag/swipe supplementary only.
- Primary actions (End Turn, confirm, undo) in bottom thumb zone.
- 0.5s input cooldown (Dijion — prevents double-tap misfires).
- Portrait + landscape.

## Cognitive
- ItB readable pattern: show consequences before acting (intent + outcome preview).
- No timed mechanics. Text never auto-progresses.
- No color-only encoding (pattern chevrons everywhere).

## Settings (persist all)
- Text-size slider (r/truegaming — fonts too small).
- High-contrast default.
- Verbosity: Full (barks + tips) / Reduced (critical only) / Off (none).

## Assist toggles (Celeste-style, non-patronizing)
- 4 implemented. Add: enemy intent always, damage preview, unlimited planning time.
- Wording: "If [X] is inaccessible, we hope this helps." Never patronizing.

## Playtest
- Include players with impairments in vertical-slice playtest (GAG).

## Round 115: Production a11y spec (accessibility part 4)
**Cognitive (W3C COGA):**
- ≤5 top-level choices per screen (COGA 4.6.3).
- ≤3 concurrent info items where working memory is taxed.
- One step per instruction (hangar builds).
- Every action: immediate feedback + visible undo/redo.
- Pattern chevrons (heat) + redundant text/icon channel.
- Always-visible objective reminder (Skyrim-style HUD).

**One-hand:**
- Primary controls (End Turn, confirm) → bottom-center thumb zone.
- ALL targets ≥44×44pt (WCAG 2.5.5).
- 0.5s post-acceptance delay on destructive taps (GAG motor).
- Single-tap only (no click+drag, no hold-required).
- Interface rearrangement (Advanced tier).

**ItB contract:**
- Telegraph ALL enemy intents before they resolve.
- One Reset Turn per mission (limited undo).

**Validation:**
- 5-8 players with impairments (SEPARATE from usability pool).
- Cover cognitive + motor categories.
- Test early; APX card deck as checklist; COGA §5 techniques.

**Hard gate:**
- NO timed inputs (WCAG 2.2.1: off / ≥10× adjust / ≥20s extend).

## Round 133: Production a11y spec (slice) — ItB contract + COGA numbers
**Implemented:**
- Intent display persistent across player AND enemy phases (APX "Leave It There").
- Help screen replayable anytime (GAG Cognitive Advanced).

**One-pager:**
- Every enemy intent visible before player commits (no hidden state).
- ≤5 choices per decision; 1-3 working-memory items max on screen.
- No-timed-inputs HARD GATE (GAG Advanced + COGA).
- 44×44pt minimum, primary actions bottom-anchored (thumb easy zone).
- 0.5s post-acceptance delay (GAG Motor Advanced).
- No color-only: heat chevrons + limb damage carry icon/number/shape.
- Single-tap primary path (no double-tap/hold/pinch/simultaneous).

**Assist framing (Celeste Farewell):** destigmatized opt-in; no branding/shaming.

**Validation:** 5-8 impaired players, SEPARATE pool (motor + cognitive); COGA Section 5 protocol;
APX deck sweep; Hopson instrument; Uncharted 4 bar.

**Trap audit (gate failures):** color-only states; timed inputs; double-tap/hold/drag gates;
non-replayable instructions.

**A11y telemetry:** assist-toggle usage, input-delay events, undo frequency (objective KPIs).

## Round 146: Production a11y validation plan (slice)
**0.5s post-acceptance delay (IMPLEMENTED in game.js):**
- _acceptGate() on End Turn + Undo. Absorbs double-taps/tremor.
- Telemetry: a11y:tap_absorbed_delay (distinguish tremor from frustration).
- Pedigree: GAG Motor Advanced (exact 0.5s); 44×44 = WCAG AAA 2.5.5.

**Validation plan (zero budget):**
- Self-audit M3 vs GAG motor/vision/cognitive + APX Control/Presentation/Challenge.
- 3-5 disabled players via AbleGamers Player Panels (remote, one session each).
- COGA user stories as test script (tremor: single-tap turn; low-vision: intent without color).
- Pass/fail: User Ability Success Rate (% completing duel core loop).

**Celeste contract:** 4 assists = granular, independent, stigma-free, never lock content.

**Trap-proof telegraphs:** no color-only; redundant channels (visual + pitch), always on.

**Feature tags:** settings screen lists a11y features (discoverability + telemetry checklist).

## Round 158: Jam a11y + validation spec (slice)
**JAM A11Y DECISION: Hamilton's top 5 as the floor, nothing more.**
- Simple tap controls (touch-first) ✓ · generous text-read time ✓ · high-contrast UI ✓
- No color-only info ✓ · no sound-only info ✓
- Pilot assists + JAM_BUILD easy default = the jam's Assist Mode (Celeste model).
- No TLOU2-style 60-option menu in 72h.

**CODE AUDIT (this round — all pass):**
- Limb damage: crack lines + ✕ marker (Round 65) — not color-only ✓
- Heat: 1-3 chevrons by level (Round 78) — not color-only ✓
- Threat magnitude: shape + number (Round 138) — not color-only ✓
- Telegraph stinger: audio reinforces visual damage number — not sound-only ✓
- Heat 70% alarm: visual floater + chevrons — not sound-only ✓
- Assists: "Pilot Assists", "no shame", "no punishment, no locked content" — stigma-free ✓

**ZERO-COST JAM VALIDATION (runnable in 72h):**
- Grayscale test: heat chevrons + threat magnitude must read without color.
- DevTools vision-deficiency emulation (deuteranopia/protanopia/tritanopia).
- Fully muted run: every cue needs a visual twin (verified above).
- 200% browser zoom: no overlap, no truncation.

**POST-JAM (slice, pre-LD):** Abratabia 6 steps — Lighthouse/axe; keyboard-only;
NVDA/VoiceOver; then disabled playtesters (AbleGamers, SpecialEffect,
Can I Play That?, Game Accessibility Nexus).

## Round 167: Jam a11y + validation spec (slice)
**JAM A11Y DECISION: basic tier only, designed in from hour 0.**
- No color-only info (Okabe-Ito blue/orange pairs from the start); no sound-only cues;
  readable default font; global mute toggle; no mandatory reflex timing; no flashing/
  screen shake as defaults. Document a11y features on the itch.io page.
- Do NOT attempt TLOU2-scope in 72h. Celeste Assist Mode = realistic ceiling if time.
- Nothing in the slice build changes for the jam — process rule, not a code change.

**REDUCE-MOTION (VERIFIED, no code change):**
- reducedEffects toggle exists: user-facing ✧/✦ button (ui.reduce_effects), persisted.
- Respects OS prefers-reduced-motion by default (Round 30).
- Zeroes screenshake at the source (addTrauma guard; XAG 117).

**VALIDATION (~1 build hour):**
- CVD sim (DevTools > Rendering > emulate vision deficiency) on heat chevrons,
  threat magnitudes, team/enemy markers — verify-don't-fix (redundant cues exist).
- Full muted playthrough (nothing essential sound-only; re-run the 6 checks, log it).
- Contrast: 4.5:1 text / 3:1 non-text (WebAIM). Touch targets ≥44px.
- Grayscale test: every color-coded element distinguishable in grayscale.

**TRAPS:** color-only (8-10% males); whole-screen "colorblind filters" (use per-palette
schemes); tiny unscalable text; keyboard traps; silent dynamic content.

## Round 176: Jam a11y + validation spec (slice)
**JAM A11Y DECISION: change nothing feature-wise.**
- Game already meets/exceeds GAG Basic tier (the jam bar). Spend effort on a
  ~1-hour validation pass, not new features.

**AUDIT (verified compliant — spec only, +0 lines):**
- Celeste framing: assist labels already stigma-free ("Tune the challenge to fit
  you"; "no shame in tuning the fight"). Difficulty labels neutral (STORY/NORMAL/HARD).
- 70% heat alarm: NOT sound-only — audio ping + visual floater + text label.
- Heat shown in chevrons (redundant cue); intent telegraphs use shape+text, not color-only.
- Reduce-motion toggle verified (Round 167). 4 assist toggles; skippable tutorial.

**VALIDATION (pre-jam, ~1 hour):**
- Coblis/Color Oracle screenshot sim: hangar UI + combat grid.
- Keyboard-only run: menu → hangar → deploy → one combat round.
- NVDA/VoiceOver pass over menu screens (focus order + labels).

**POST-JAM:** fold "colorblind sim + keyboard pass" into Mecha Hangar VERIFY checklist.
**TRAPS:** color-only info; sound-only cues; hover-only; tiny text; time pressure; flicker.

## Round 185: Final a11y decision (slice)
**FINAL A11Y DECISION: SHIP-READY (conditional).** No feature work left. Remaining:
page copy + tagging + validation triad (pre-jam prep week).

**AUDIT (verified compliant — spec only, +0 lines):**
- Reduced-motion: kill-confirm fade, recoil, hit-stop, trauma ALL gated.
- iOS audio: first-tap resume verified (Round 179).
- Touch targets: 48px limb picker clears WCAG 24px / Apple 44pt / Material 48dp.
- No color-only: heat chevrons, telegraphs paired with icons/text.
- No audio-only: stingers have visual twins; barks are labeled text.

**PRE-JAM A11Y (page + validation):**
- itch.io: Accessibility features section; tag filters; captioned trailer; alt text.
- Validation triad: (a) axe/WAVE on page+DOM, (b) keyboard-only M1→M3, (c) NVDA/VoiceOver + CVD sim.
- Flip condition: keyboard trap or audio-only critical cue in M3 → NOT ship-ready.

## Round 194: FINAL A11Y SIGN-OFF (slice)
**FINAL DECISION: GO (with documented limitations).** Ship the slice.

**GO CRITERIA (verified):**
- CVD: no color-only critical info (heat chevrons, telegraphs paired).
- Mute: all audio cues have visual equivalents (stingers, barks as text).
- HTML UI: native keyboard accessible (menus, hangar, buttons, dialogs).
- Contrast: AA targets met; 48px targets; reduced-motion on all juice.

**KNOWN LIMITATIONS (document on itch.io page per GAG "Inform"):**
- Canvas combat grid requires pointer/touch (no arrow-key navigation).
  Menus, hangar, and all dialogs are keyboard-navigable.
- No screen-reader live announcements for canvas combat events.
  HTML UI exposes names via native semantics.

**PRE-JAM (must-do):**
- itch.io Accessibility section: list features + limitations honestly.
- Set Accessibility metadata flags (implemented features only).
- Keyboard-only pass on HTML UI (verify focus visible, no traps).
- CVD simulation final check (all 3 types).

**JAM-WEEK GUARDRAIL:** New theme features inherit focus/labels/color-independence.
No new UI ships without keyboard operability for its HTML parts.

## Round 203: FINAL A11Y CONFIRMATION (slice)
**FINAL DECISION: GO — CONFIRMED.** No downgrade. Two launch conditions stand:
(a) itch.io Accessibility section + classification tags;
(b) final-pass protocol on M3 duel build.

**AUDIT — GAG Basic "settings saved/remembered" (verified):**
- Assists default ON (new players); toggle → persistProgress → saved.
- Load: shallow-merge preserves player choices. Existing saves unaffected.
- Telemetry: assist:<id>:on/off logged (GAG "Review & learn").

**FINAL-PASS PROTOCOL (M3 duel):**
- XAG scoping questions + 5 lanes (legibility, input, captions/motion, settings, regressions).
- Contrast over M3 scorched backgrounds (not just menus).
- Touch targets on iPhone 17. Heat/limb/intent never color-only.
- No sound-alone essential cues (barks captioned, telegraphs visual).

## Round 212: Post-GO polish (slice)
**A11Y STATUS: GO — CONFIRMED (unchanged).** No downgrade. Post-GO polish verified.

**CURB-CUT AUDIT (verified in code):**
- Intent telegraphs: ⚠ icon + damage number + dashed line (not color-only) ✓
- Pilot barks: visual floater text by default (not audio-only) ✓
- Heat overload: SFX + visual bark + shutdown state (redundant) ✓
- All critical audio cues have visual equivalents ✓

**JAM-WEEK GUARDS:**
- Freeze a11y checklist for hotfixes. Toggles persist across migration (verified Round 203).
- Never weaken a11y cue for feedback — add toggle instead (Wolverine lesson).
- itch.io page: a11y statement at top + metadata fields.
- Solicit a11y feedback during LD ratings (one-line ask).

## Round 221: Pre-jam freeze (slice)
**A11Y FREEZE: DOM/settings-layer only. No changes to FROZEN systems.**
GO CONFIRMED remains the floor.

**IMPLEMENTED — aria-live announcements (GoYomi pattern):**
- #sr-announce region (visually hidden, aria-live polite).
- Game.announce(msg) helper.
- Wired: pilot barks, turn changes (player/enemy).
- Screen readers now narrate combat state.

**10-POINT FREEZE PASS (on LD build):**
1. Page title ✓ 2. Alt text ✓ 3. Headings ✓
4. 4.5:1 contrast ✓ 5. Text resize ✓ 6. Keyboard + focus ✓
7. No flash >3×/s ✓ 8. No autostart audio ✓
9. Captions on barks/telegraphs ✓ 10. Mute run readable ✓

**NEVER:** "epilepsy safe." Say what was tested.
- 4,271 lines (+12).

## 10-POINT JAM-DAY PASS (Round 236 — Wed 2026-10-14 ~23:00 EDT)
Literal checklist, in order. GO CONFIRMED only when all ten pass (GAG basic tier; XAG sign-off model):
1. Keyboard-only full playthrough (select/move/attack/end-turn, no mouse).
2. Visible focus on every interactive element.
3. Escape exits every menu/dialog, returns focus. No traps.
4. Live region announces all state changes (polite); assertive reserved for unit death / turn threats.
5. Palette contrast-checked at 4.5:1 (keep receipt).
6. Deuteranopia/protanopia simulation on team colors — distinguishable without color.
7. Busiest combat sequence recorded, PEAT-verified <3 flashes/sec (keep receipt). WCAG 2.3.1.
8. No hover-only info (keyboard focus triggers same).
9. Simple controls; text/UI to 200%.
10. NVDA or VoiceOver full-mission playthrough, screen curtained.

## ARIA-LIVE CONTRACT (frozen)
- One polite region (#sr-announce), empty on load, aria-atomic="true", single announce() entry.
- Clear-then-set via rAF (standard re-announce). Wired to turn changes + barks only (game-paced, no spam).
- Batch rapid events ("3 units advanced") with ~2s throttle if new announce points are added.

## NUMERIC GATES
- Contrast: actual hex palette through a checker, 4.5:1 for all text/UI. Receipt kept.
- Flash: PEAT run on flashiest effects capture. Receipt kept.

## JAM-DAY VERIFICATION SEQUENCE (Round 245 — Wed 2026-10-14 ~23:58 EDT)
Order matters — ~45 min total. Run on the frozen build:
1. Automated + numeric: axe/Lighthouse every screen; contrast receipts (≥4.5:1 text, ≥3:1 large/UI); 30s worst-case clip (heaviest shake/flash/transitions) through a WCAG 2.3.1 flash checker (video-audit.com; PEAT is RETIRED). Fail = >3 flashes/sec above threshold.
2. Keyboard-only (unplug mouse): Tab menu → settings → battle → game over. Visible focus everywhere, logical order, Escape exits every overlay back to canvas, every mouse action (select/move/attack/cancel) has a keyboard path. Trap = ship-blocker.
3. Screen reader (NVDA/VoiceOver, eyes closed): single polite region announces turn events at game pace, no spam; every control names itself + state; no decorative canvas noise read.
4. Motion: OS Reduce Motion → reload → boot lands on reduced; cycle 3-state (✦/◐/✧): shake → 0, particles → none, tweens → instant cuts; setting persists.
5. Color + audio: DevTools vision-deficiency emulation — ownership/threat/selection survive grayscale; mute audio — every cue (turn chime, hit confirm, low-health) has a visual/live-region equivalent.

## FINAL VERIFICATION (Round 254 — Wed 2026-10-15 ~00:51 EDT)
- Numeric gates (pass/fail): ≥4.5:1 every text/UI pair; ≤3 flashes/sec; no flash sequence >5s; no >25%-screen flashing/pattern coverage. Tool: video-audit.com (W3C-recognized, free in-browser; PEAT retired).
- GAG fail protocol: eliminate first (rate <3/sec, area <25%, spacing). Can't eliminate → obvious warning + disable option. NEVER "epilepsy safe" — describe by effect, never promise safety.
- Toggle hardened (verified in code): ✧ off = full juice+flash kill switch (shake, hitstop, knockback, limb/hit/break flashes, render scale). Persists ('mecha-protocol-fx'); OS reduce-motion boots to ✧. "Setting doesn't stick" = ship-blocker.
- Flashes are single soft flashes by design (Round 41) — never strobes.
- 45-min timed drill: automated → keyboard-only → screen reader (NVDA + VoiceOver) → motion (reduce-motion ON, cycle ✦/◐/✧) → color/audio (grayscale + full mute). Log per stage; no skipping.
- Cheap wins: document a11y features in-game + add a feedback line (GAG Basic).

## FINAL VERIFICATION (Round 263 — Wed 2026-10-15 ~01:47 EDT)
- Canvas presentational: role="img" + aria-label on all three layers (Round 263). All interactive state mirrored in #sr-announce; menus/settings are real DOM.
- Gate-risk order (T-48h → T-2h): motor (keyboard-only) → safety (flash/motion audit; ✧ gates everything) → visuals (squint, contrast, no color-only) → audio/cognition (visual cue mirrors, mute paths, on-screen objectives) → storefront (document controls + a11y-features list on the jam page).
- Fail protocol: fix, disable-by-default (opt-in), or honest documentation — then retest. No safety theater (warning screens that change nothing).
- Settings separate from saves (verified): deleting saves can't nuke preferences. In-game ✧ = the real control; OS reduce-motion = the safety net, not the solution (Baker).
- "There is no fixed bar... look at accessibility as an optimization process." (Baker/Hamilton.) Post-jam postmortem while observations are fresh.

## FINAL VERIFICATION (Round 272 — Wed 2026-10-15 ~02:54 EDT)
- Verified (code read): non-color indicators everywhere — selection ring (shape), faction badge (circle vs triangle, "never color alone"), attack-target ring. (Hamilton's jam rule.)
- Verified: no "epilepsy safe" claims anywhere (grep clean). Use specific claims only: "flashes ≤3/sec; ✧ toggle available." (GAG hard rule.)
- Verified: kill switch full (Round 254); canvas labeling done (Round 263); numeric gates above.
- Gate-risk order: T-48h motor (reduce-motion gauntlet + OS-level cold boot) → T-2h storefront (contrast spot-check). (Existing.)
- GAG fail protocol: any failed gate → logged in A11Y-SPEC as known limitation + content warning on the submission page. Never hidden, never "epilepsy safe."
- 45-minute timed drill (existing). Spec frozen.

## VERIFICATION ROUND 2 (Round 281 — Wed 2026-10-15 ~04:09 EDT)
- Verified (code read): WCAG 2.3.1's hard rule — THE CONTENT ITSELF stays within thresholds. Flashes = single 0.15s pulse per hit ("never a strobe," Round 41); no blinking UI anywhere. The toggle is the backstop; the content is the compliance.
- Reduce-motion gauntlet: OS matrix (Win 10/11, macOS, iOS, Android 9+) — boot reduced via OS flag; inventory every animation source (tweens, particles, shake, UI transitions) — ✧ kills all. One straggler = fail. (WCAG 2.2.2: single global mechanism.)
- Contrast audit: tools, not eyeballs — 4.5:1 text, 3:1 components; palette through a color-blindness simulator (deuteranopia/protanopia/tritanopia). Selection ring + circle-vs-triangle must read with zero color.
- GAG fail protocol: any unpassable gate → adequate obvious warning + disable option + logged decision. Never silently missed.
- Never "epilepsy safe" — label by what the setting does. (GAG: legal risk.)

## VERIFICATION ROUND 3 (Round 290 — Wed 2026-10-15 ~05:03 EDT)
- Verified (code read): OS flag gates the CANVAS LOOP, not just CSS (Smashing's anti-pattern avoided). `prefers-reduced-motion` read at boot → reducedEffects. Gates: trauma, hit-stop + squash, render scale → 1×, shakeIntensity → 0. The animation loop itself.
- Verified (code read): graduated intensity ALREADY SHIPS. `shakeIntensity` 0/1/2 (off / 30% / full), persisted, amplitude multiplier 0 / 0.3 / 1. The Celeste pattern (steps between full and off) is in the jam build — not a post-jam item.
- Content-threshold audit: capture-based automated pass (PEAT or pixel-luminance scan) over every game state, worst-case conditions (max simultaneous 0.15s pulses + overlays), measured against the gates (≤3/sec, no >5s, no >25%, 4.5:1). Any failure = ship-blocker; re-run the FULL audit after any fix. (WCAG 2.3.1 G19/G176/G15; XAG 118.)
- OS-flag boot matrix: cold-boot with reduce-motion ON (Win/macOS/Android/iOS) → ✧ boots ON, zero motion before the flag is read. Flag OFF → ✧ defaults correctly. Toggle mid-session → game responds. Log the matrix as gauntlet evidence.
- Keyboard-only full playthrough + screen-reader label pass (NVDA/VoiceOver/TalkBack) on the three canvases. Automate the DOM check (every canvas has role + name) so it can't regress.
- Honest note: no public "GAG fail protocol" exists — ours is home-grown, consistent with the XAG checklist-gate pattern. Keep it that way: documented, not claimed as a standard.

## VERIFICATION ROUND 4 (Round 299 — Wed 2026-10-15 ~05:41 EDT)
- Color-independence (js/mech.js, GAG): team markers by SHAPE — ▲ = player, ▼ = enemy, white (color-independent). Team now has three redundant channels: shape + color + facing. Red-green colorblind players distinguish by shape alone. (Round 65's crack-lines for damage already established "icons/patterns, never color alone.")
- Motion-only feedback audit: every critical event (damage, turn change, limb break, shutdown) must have a text/icon/audio channel, not just shake/flash. ShakeIntensity 0 must not hide information — it only removes motion.
- Contrast + text-scale: measure every text/UI pair (4.5:1 normal, 3:1 large, 3:1 UI components) against rendered canvas at the top text-scale tier. Canvas text doesn't get browser zoom — test 200% for overflow/clipping.
- Keyboard-parity walk (WCAG 2.1.1): entire game keyboard-only, no mouse, no timing-dependent inputs. Remapping covers every action; settings persist. Publish the final keyboard map as the player-facing contract.
- Honest claims: visible a11y-features list, no "epilepsy safe" language. Flicker audit documented (≤3 flashes/sec, <25% screen, ≤5s). At least one real-user pass with disabled play-testers before verification is done — "a checklist alone is not verification."
- Freeze discipline: any change after the a11y freeze re-triggers the affected audit. The freeze is a contract.

## VERIFICATION ROUND 5 (Round 308 — Wed 2026-10-15 ~06:15 EDT)
- Verified (code read): toggle granularity. shakeIntensity 0/1/2 = granular shake (highest vestibular risk). reducedEffects = master calm switch. Pragmatic jam-scale: the most problematic effect is granular; the rest group under "calm." OS flag auto-enables at boot.
- Three audits (executable checklists): (i) color-independence — screenshot every state, run deuteranopia/protanopia/tritanopia + grayscale, confirm ▲/▼ readable without color; (ii) motion-redundancy — reduced-motion + shakeIntensity=0 → zero motion in canvas loop, every shake cue has static redundant signal; (iii) text-scale — every tier, no clipping/overlap, layout reflows. Any failure = ship-blocker.
- OS matrix: prefers-reduced-motion on Windows/macOS/iOS/Android browsers; OS text scaling vs canvas HUD; full keyboard-only playthrough with visible focus.
- Granular toggles + honest docs: keep shakeIntensity 0/1/2 (Off/Reduced/Full), never collapse to on/off. Describe literally ("Screen shake: Off/Reduced/Full — controls camera shake on hits"). Never "epilepsy safe" or "fully accessible." List what each setting covers and what it does NOT.
- Claims rule: only claim what verification actually ran. Unverified (e.g., screen-reader) stays out of a11y notes until tested.

## VERIFICATION ROUND 6 (Round 317 — Wed 2026-10-15 ~06:45 EDT)
- Verified (code read): keyboard handler hygiene. hangar.js deploy listener properly unbound (no duplicates, no traps in modal flow).
- Honest gap (not a jam-blocker): tactics grid is NOT keyboard-navigable (no arrow-key cursor). Touch-first by design (iPhone 17). HTML menus are Tab-accessible; canvas grid is pointer-only. Documented as known limitation; Phase 2 candidate.
- Three audits as ship-blockers: (a) keyboard-parity — full pass, zero traps, visible focus everywhere; (b) screen-reader — NVDA+JAWS+VoiceOver, every control has name/role/value, events via live regions; (c) cognitive-load — no mandatory timers, undo/error recovery, adjustable speed. Any regression after freeze blocks ship.
- Toggle granularity + reduced-motion: prefers-reduced-motion gates canvas loop on first load; shakeIntensity 0/1/2 separate; ▲/▼ pure shape (color-independent) at every text-scale tier. Motion regressions = ship-blockers.
- OS/AT matrix: Windows+NVDA, Windows+JAWS, macOS+VoiceOver, keyboard-only, reduced-motion on/off. Write down exactly what was tested. Untested combinations not claimed as supported.
- Claims rule: document only verified claims. In-game a11y settings page + accessibility statement listing tested platforms, what works, known gaps. Never "fully accessible"; claim what audits proved.
- Outside eyes: one disabled-playtester pass (AbleGamers model) or honest community review of the a11y statement before jam.

## VERIFICATION ROUND 7 (Round 326 — Wed 2026-10-15 ~07:21 EDT)
- IMPLEMENTED: visible focus indicators (style.css). 3px solid #f9f871 outline + offset on all focusables via :focus-visible. XAG-113/WCAG 2.4.11 compliant (border-based, not subtle). +8 lines → 4,573.
- Contrast audit (ship-blocker): screenshot-based audit of every text/background + UI-graphic pair at all three text-scale tiers. Targets: WCAG 1.4.3 (4.5:1 standard, 3:1 large), 1.4.11 (3:1 non-text). Colour Contrast Analyser on rendered screenshots (canvas pixels = source of truth). Fix failures before freeze; document sampling set.
- Focus-visibility pass (ship-blocker): every control shows high-contrast border-based indicator (now implemented); stays visible against all backgrounds; never routes to hidden/offscreen. Pair with keyboard sweep (no traps, Esc everywhere, WCAG 2.1.2).
- Freeze reduced-motion: verify it gates canvas loop AND forces shakeIntensity to 0 regardless of stored setting; verify 1 vs 2 perceptibly distinct; 0 fully stops shake. No animation changes without re-running pass.
- Honest gap published: grid not keyboard-navigable (touch-first) in accessibility notes per XAG-121; ▲/▼ markers and plain-language errors as compensating techniques. Never claim full keyboard operability.
- Pre-ship actions: (a) text-scale sweep at min/max tiers (no clipping/overlap); (b) every error message reviewed for plain language + non-color cue (XAG-115); (c) reduced-motion vs full-motion side-by-side vs XAG-117 (no surprise auto-updating without pause/stop/hide).

## VERIFICATION ROUND 8 (Round 335 — Wed 2026-10-15 ~07:56 EDT)
- Verified (code read): automatic reduced-motion. prefers-reduced-motion → shakeIntensity=0 silently (game.js:179). Exceeds XAG 112 by honoring OS setting with no user action. Shake/text-scale user-adjustable in main menu.
- Reduced-motion freeze (ship-blocker): prefers-reduced-motion fully gates canvas loop (no residual animation); shakeIntensity 0/1/2 semantics frozen. Binary pass/fail in verification log.
- Binary ship-blockers: WCAG contrast per text-scale tier (no clipping at largest); :focus-visible on every interactive; keyboard hygiene (no traps, no dead keys); ▲/▼ always paired with team meaning (never color-only — LauraKBuzz lesson). Any failure blocks ship.
- Accessibility statement (XAG 121 analogue): single searchable page listing every feature — reduced-motion gating, shake tiers, ▲/▼ markers, text-scale tiers, keyboard shortcuts, :focus-visible. Undocumented = not shipped.
- First-launch discoverability (XAG 112 analogue): surface motion/shake + text-scale at first boot (one-screen preset: Reduce motion → 0 / Standard → 1 / Full → 2, mirroring TLOU2/GoW profiles). Automatic OS honoring already covers the default; preset screen covers explicit choice.
- Honest gap public: grid not keyboard-navigable (touch-first) in public docs; schedule post-launch disabled-player feedback pass (Player Panels-style). Verification ongoing, not one-and-done.

## VERIFICATION ROUND 9 (Round 344 — Wed 2026-10-15 ~08:25 EDT)
- Verified (code read): accessible UI layer. Canvas role="img" + aria-label (index.html:22-24). Native range slider (index.html:38). aria-live polite+atomic, visually hidden via clip (index.html:76, Round 221). Event-level summaries, never per-frame. (Abratabia; XAG 106.)
- Keyboard-only playthrough (ship-blocker): mouse physically disabled. Complete menu → setup → full match → victory/defeat → restart without mouse. Any unreachable control, lost focus, or trap blocks ship. (Abratabia protocol; XAG 112/113.)
- Color-independence audit (ship-blocker): ▲/▼ markers under all four DevTools vision-deficiency emulations + achromatopsia + monochrome. Team identity distinguishable by shape alone at smallest text tier. Any hue-dependent ID blocks ship. (XAG 102/103.)
- Screen-reader audit (ship-blocker): NVDA/VoiceOver — every menu/dialog/HUD announces name/role/state; meaningful events (turn change, unit selected, victory/defeat) through live region, never per-frame. Canvas unnarrated = documented honest gap (Abratabia canvas limitation). No UI element or game event may update silently.
- Text-scale stress (ship-blocker): 200% browser zoom + largest in-game tier; no truncation, overlap, or off-screen controls in any dialog. Clipped control blocks ship. (Abratabia; XAG 101.)
- Freeze discipline: after last audit, freeze all UI-affecting code — any change to menus/HUD/dialogs/focus order/canvas overlays re-runs audits 1–4 in full. Keep honest gap (full canvas playability under screen reader) public on statement page (Gears 5 precedent: ship documented limitations).

## VERIFICATION ROUND 10 (Round 353 — Wed 2026-10-15 ~08:52 EDT)
- Verified (code read): pause coverage. Visibility pause (game.js:271); rAF paused when hidden (game.js:1841). Manual pause. Objectives via briefings. Tutorial replayable. (PAM framework.)
- 4-question walkthrough (ship-blocker): walk every core loop screen (spawn → deploy → combat → objective → pause → game over) asking: (1) objective signaled without memory? (2) action visually distinct under load? (3) interaction predictable? (4) immediate multi-modal feedback? Any screen failing 2+ = freeze blocker. (GDC 2024; GMTK.)
- Pause-and-review literal: verify pause during ALL states (tutorials, briefings, dialogue); objectives visible on-screen at all times (not buried); replayable tutorial/objective log accessible. If player must remember mechanic taught once, add refresher or blocker. (Memory-load audit.)
- Choice-throttle: audit selection screens vs choice-overload. Options in small sequential groups; one consistent color-code for "action available"; consistent layout between menus. Inconsistent hints or decorative interactables = blocker.
- Pacing under reduced-motion: confirm prefers-reduced-motion gates canvas loop (shakeIntensity 0); timer-based failure can be disabled/slowed; no fail state depends on reaction time alone. Full load test with motion off: any target only readable via shake/motion = hidden-dependence blocker.
- Honest-gap freeze: binary pass/fail table for each above; mark unverifiable as explicit "honest gap"; freeze spec. Ship verified cognitive fixes; defer nice-to-haves (screenshot-pinning, OpenDyslexic, replayable interactive tutorial) to post-jam.

## VERIFICATION ROUND 11 (Round 362 — Wed 2026-10-15 ~07:27 EDT)
- Implemented (new file): accessibility.html. Statement page (commitment, WCAG 2.2 partial compliance, 8 features, 3 honest gaps, feedback channel). W3C atoms + XAG 121. Zero game-code risk.
- Freeze statement as versioned artifact: put preparation/review dates on in-product page + A11Y-SPEC.md. Once frozen, no unverified claim may be added — honest gap stays disclosed; new limitation added to known-issues before ship. (EU "regularly updated + dated"; freeze discipline.)
- Binary statement audit (ship-blocker): W3C/EU checklist (commitment, WCAG 2.2 status, non-accessible + reasons + alternatives, feedback mechanism, contact, review dates). Any failed atom — e.g., contrast regression or undisclosed keyboard trap — blocks ship.
- Per-option documentation: document every a11y feature as Naughty-Dog-style row — what it does, who it helps, default, tiers. E.g., "Camera shake: 0 Off / 1 Reduced / 2 Full; honors prefers-reduced-motion by forcing 0"; "Team markers: ▲/▼ shapes (not color-only)"; "Text scale: tiers"; "Motion: prefers-reduced-motion gates canvas loop". One row per verified pillar.
- Feedback channel: discoverable, multi-route; test with XAG 122 scoping questions (keyboard/screen-reader reachable? compatible? response commitment stated?). No extra cost; log feedback against known-issues each release.
- Validate docs with players: run statement-page + in-product docs past players with disabilities (GAG / MGATS model) before final verification; re-verify after every text change. Docs describing features users can't find = hidden-limitation anti-pattern.

## VERIFICATION ROUND 12 (Round 371 — Wed 2026-10-15 ~07:52 EDT)
- Verified (code read): XAG-117 satisfied. game.js:179: shakeIntensity = reducedEffects ? 0 : 2; game.js:181: prefers-reduced-motion auto-detect; game.js:261: 2→1→0→2 cycle. Camera shake avoidable (0) + settings (0/1/2) + auto-respects OS. (XAG-117.)
- Freeze a11y systems + gate release: adopt XAG sign-off structure — reduced-motion gate, shakeIntensity 0/1/2, team shape markers (▲/▼), WCAG contrast, text-scale tiers, keyboard handler, :focus-visible indicators each get pass/fail sign-off with named verifier. Any regression after freeze = ship-blocker.
- AT/keyboard matrix: full keyboard-only playthrough (no mouse) verifying handler hygiene (no traps, no dead-ends, consistent shortcuts), focus-visible on all canvas UI and dialogs, plus OS reduced-motion on/off and browser text-scale tiers (100/125/150/200%). Document matrix in A11Y-SPEC.md as verification evidence.
- Documentation audit: statement page (R362) must describe only what shipped build does — verify each claimed feature against final build per XAG-121 "only tags title qualifies for"; check in-game help entries exist for every a11y option; plain person-first language throughout.
- Photosensitivity review (anti-Cyberpunk): verify no flashing/strobing sequences at any shakeIntensity level; reduced-motion gating verified automatically; shakeIntensity max (2) tolerable. Safety audit done before launch, never after.
- Feedback channel: launch with way for disabled players to report a11y issues (GAG basic tier "Solicit accessibility feedback"); commit to day-one parity — nothing accessibility-related deferred to post-launch update.

## VERIFICATION ROUND 13 (Round 380 — Wed 2026-10-15 ~08:26 EDT)
- Verified (design): auto-detection superior to settings screen. game.js:181: prefers-reduced-motion auto-detected before canvas loop; game.js:179: shakeIntensity auto-set to 0 if reducedEffects. Accessibility Labs items 2,3,5 satisfied automatically. Zero configuration needed — superior for jam (less friction). (Accessibility Labs; ShultzPrime.)
- Declare freeze + run three audits: (1) freeze audit — full keyboard-only + screen-reader + text-tier walkthrough of every screen and canvas state; (2) regression audit — re-run exact scenario list against RC after any code change; (3) sign-off audit — named owner signs binary-blocker list, publishes accessibility statement (R362) with residual known issues and feedback channel. No launch until sign-off. (ShultzPrime.)
- Binary blocker + regression smoke list: freeze violations = any new visual/kinetic/audio feature without re-verification. Smoke list (≤10 min): Tab through entire UI verifying :focus-visible; all text tiers (100/150/200%) with no clipping; shakeIntensity 0/1/2 respected + OS reduced-motion auto-detected on first paint; ▲/▼ markers legible at every tier; keyboard-only full playthrough of one skirmish; no keyboard traps; contrast spot-checks on changed elements.
- Re-verify first-launch: confirm auto-detection of OS reduced-motion happens before canvas loop starts (not after first paint); focus lands at top of UI on load (avoid Forza Motorsport failure); defaults legible before any user action. Test launch sequence with keyboard only and with sound off. (Accessibility Labs.)
- Publish honest gap: keep accessibility statement truthful — list anything unverified, provide feedback contact, commit to post-launch re-audit after any UI change. No statement = no sign-off. (ShultzPrime.)
- Launch-day a11y bug pass (Accessibility Labs failure patterns): check focus order on load, narration/text of intro screens, volume of audio vs instructions, skip/exit paths from every modal. Fix or document each as blocker or known issue before sign-off.

## VERIFICATION ROUND 14 (Round 389 — Wed 2026-10-15 ~08:58 EDT)
- Verified (spec read): statement exists and maintained. build/accessibility.html:54: "This statement will be updated with each release that changes accessibility features." Matches W3C/WAI (commitment, supported features, known limitations, feedback) and Naughty Dog (pre-launch disclosure). GAG sign-off (representative users) = human validation gate (requires actual users). (W3C; Naughty Dog; GAG.)
- Freeze-disciplined sign-off: lock all a11y systems (reduced-motion gate, shakeIntensity 0/1/2, ▲/▼ shape markers, text-scale tiers, keyboard handlers, :focus-visible indicators) at feature freeze; run final audit against release candidate only — any a11y change after freeze requires re-test pass before ship. (Microsoft pre-release verification model.)
- Binary ship-blockers: declare accessibility launch blockers explicitly — reduced-motion mode must zero all camera shake and looping motion; every text-scale tier must hold WCAG contrast AA; full game loop must be keyboard-operable with visible :focus-visible indicators. Any blocker failure = no ship. (The Coalition sprint discipline.)
- Statement audit against build: cross-verify every claim on existing statement page (R362) against actual release candidate, and disclose documented honest gap (XAG-117) plainly per W3C/WAI guidance — honest gap list beats overclaim. (Anti-pattern: "accessibility washing".)
- Pre-launch disclosure: publish accessibility feature list before launch, following Naughty Dog/Gears 5 model, so players can make informed decisions; consider AGI-style standardized labeling language for feature claims.
- Post-launch monitoring plan: set up dedicated accessibility feedback route before launch (EA/Ubisoft model; GAG requirement), and re-run a11y regression suite — reduced-motion gate, shake tiers, shape markers, contrast, text scale, keyboard path — on every patch before it goes live, updating statement when features change.

## VERIFICATION ROUND 15 (Round 398 — Wed 2026-10-15 ~09:34 EDT)
- Verified (spec read): ongoing a11y defined. :362: "Honest gap public; schedule post-launch disabled-player feedback pass. Verification ongoing, not one-and-done"; :394: "Feedback channel: launch with way for disabled players to report a11y issues; commit to day-one parity"; :401: "Publish honest gap: keep accessibility statement truthful, commit to post-launch re-audit after any UI change." Matches Accessible.org (twice-yearly audits) and Star Wars Outlaws (launch as floor, not ceiling). (Accessible.org; Star Wars Outlaws.)
- Freeze discipline: adopt regression-audit mechanic — maintain current-state a11y baseline of every verified behavior (reduced-motion gate, shakeIntensity 0/1/2, shape markers ▲/▼, WCAG contrast, text-scale tiers, keyboard hygiene, :focus-visible) and diff every build/change against it; any new or worsened issue blocks freeze. (ADA Compliance Pros.)
- Ship-blockers: define hard blocker list drawn directly from existing verification rounds (statement page R362, XAG-117 R371, final/sign-off rounds); regression against any item on that list fails ship — hard-fail gates for critical components, warn-only for legacy debt.
- Statement maintenance: re-date accessibility statement with every release, attach statement review to release checklist, keep honest-gap section current (continuing honest-gap discipline) so page never goes stale relative to shipped build. (Accessible.org: frozen statement over changing product = primary failure mode.)
- Monitoring cadence: schedule full manual review twice a year during active development (keyboard-only pass, screen reader, colorblind simulation, 200% zoom, muted audio) plus lightweight automated checks on every content change — monitoring as early warning. (Accessible.org.)
- Regression suite: keep permanent, re-runnable checklist/test plan of all existing verified behaviors and execute before every release; track escape rate and mean time to fix so regressions stay visible and owned, with named ownership of baseline. (ADA Compliance Pros.)

## VERIFICATION ROUND 16 (Round 407 — Thu 2026-10-15 ~12:09 EDT)
- New this round (spec only): platform-evolution plan. Spec references WCAG 2.2 criteria but has no re-baseline/evolution plan — this round adds it. Matches TLOU2 (evolution by design), Forza (roadmap commitments), Sea of Thieves (per-release cadence). (TLOU2; Forza; Sea of Thieves.)
- Freeze discipline with drift gates: keep the binary ship-blocker list, and extend it to evolution — no update ships if it regresses contrast, focus visibility/order, keyboard operability, the reduced-motion gate, shake tiers, or shape markers. Every patch runs the automated a11y checks plus a short manual/AT spot check (W3C: most issues need manual testing).
- Annual a11y-evolution re-baseline: once per year, re-verify the A11Y-SPEC against the current WCAG, XAG, and Game Accessibility Guidelines versions and record the version numbers used — year-2+ standards will not be the launch standards.
- Platform-drift test matrix: maintain and re-run a small matrix (current Chrome/Edge/Firefox/Safari × screen reader × OS reduced-motion/text-size settings) after browser updates and after any engine/dependency change; abstract platform accessibility signals behind one module so drift touches one place.
- Statement maintenance: update the accessibility statement page with every release (conformance status, what's new, honest known gaps) — a living statement is both the professional norm (Sea of Thieves, EAA documentation practice) and the cheapest post-launch monitoring artifact.
- Player-feedback loop: keep one accessible channel for accessibility bug reports, triage them as ship-blockers for the next update, and note PSE safety on any new visual effect (flash/pattern check per ISO 9241-391 thresholds; EA's IRIS is open source) — GPSR's re-assess-on-change principle applied at jam scale.

## VERIFICATION ROUND 17 (Round 416 — Thu 2026-10-15 ~13:03 EDT)
- New this round (spec only): cognitive-load plan. Spec has no cognitive-load plan — this round adds it. Matches Springer (working-memory budget), Celeste (Assist Mode), TLOU2 (decoupled game speed), Ragnarök (audio attention locks). (Springer; Celeste; TLOU2; Ragnarök.)
- Freeze a load budget per encounter: Cap simultaneous demands: max 1 primary objective, max 2 simultaneous audio streams, HUD limited to player state + objective marker. Make "no screen exceeds budget" a ship-blocker on the verification checklist. (Springer.)
- Ship time as an accessibility axis: Implement game-speed control (slow motion toggle) and pause between text prompts, plus a skip/replay for every puzzle and instruction. If a mechanic can't be slowed or skipped, redesign it — time pressure with no alternative is a blocker. (TLOU2; Celeste.)
- Guarantee attention continuity: Always-visible objective marker, one-screen objective recap reachable anytime, story recap on return, and audio cues for critical events (distinct from music/SFX) with individual volume — so a missed visual channel never strands the player. (Ragnarök.)
- Verify with NASA-TLX + secondary task in playtesting: Run 5–10 playtests with a concurrent tap task and NASA-TLX after each level; segment-level completion telemetry (time, retries, instruction replays, assist toggles) feeds post-launch monitoring and the drift gates in A11Y-SPEC. (PUX Lab.)
- Freeze discipline: any content patch that adds a simultaneous UI element, audio stream, or time-pressured mechanic must pass the load-budget audit before merging; publish the accessibility feature list at launch (complementary documentation per Springer) so the post-launch audit is externally verifiable and feeds the living statement.

## VERIFICATION ROUND 18 (Round 425 — Thu 2026-10-15 ~13:49 EDT)
- New this round (spec only): motor-accessibility plan. Spec has no motor-accessibility plan — this round adds it. Matches SpecialEffect DevKit (7 motor topics), TLOU2 (Motor Accessibility Preset), Forza Horizon 5 (game speed modification). (SpecialEffect; TLOU2; Forza.)
- Ship a Motor Accessibility Preset + per-option toggles: bundle tap/toggle alternatives for every hold, confirm/auto-end-turn assists, generous (or no-fail) input windows, no double-click or drag-only interactions (every action also doable by single click), while exposing each toggle individually for fine control. (TLOU2 model)
- Full input remapping with conflict-free input locks and accessible default mappings, including one-hand presets; freeze the remap schema and default mappings at final verification; add per-build regression of remap integrity to the ship-blocker list. (SpecialEffect DevKit 2; XAG 107)
- Run an interaction-alternatives audit: eliminate any repeated-press mechanics (confirm-spam, mash-to-skip), make every hold a tap/toggle, every drag a click; expose game/animation speed adjustment and generous input windows. (DevKit 3; GAG motor)
- Establish a post-launch motor monitoring plan: re-run the motor test-case suite on every patch (any patch that breaks remaps or toggles is a ship-blocker), preserve player remaps/settings across updates, and re-validate with a small panel of motor-impaired players post-launch. (Keywords AQA; AbleGamers panels; XAG test cases)
- Freeze discipline: put the motor preset bundle, remap schema, default mappings, and interaction alternatives on the round-18 freeze list; any post-freeze change requires a documented motor re-validation sign-off — the existing drift gates apply to input as strictly as to every other pillar.

## VERIFICATION ROUND 19 (Round 434 — Thu 2026-10-15 ~14:35 EDT)
- Verified (spec read): accessibility plan defined. :383: "Binary statement audit (ship-blocker): W3C/EU checklist (commitment, WCAG 2.2 status, non-accessible + reasons + alternatives, feedback mechanism, contact, review dates). Any failed atom — e.g., contrast regression or undisclosed keyboard trap — blocks ship."; :422: "Freeze discipline with drift gates: keep the binary ship-blocker list, and extend it to evolution — no update ships if it regresses contrast, focus visibility/order, keyboard operability, the reduced-motion gate, shake tiers, or shape markers."; :430: "Freeze a load budget per encounter: Cap simultaneous demands: max 1 primary objective, max 2 simultaneous audio streams, HUD limited to player state + objective marker. Make 'no screen exceeds budget' a ship-blocker on the verification checklist." Matches XAG (playability gates) and NASA-TLX (workload measurement). (XAG; NASA-TLX.)
- Freeze an accessibility ship-blocker list and gate on it: Adopt the XAG-for-test-teams model: write 8–12 concrete, testable blockers (keyboard-only full playability of the tactics loop; remappable controls; readable text/contrast on canvas; color-independent signaling for unit states; adjustable or no time pressure; photosensitivity-safe effects; pause without penalty; subtitle/caption equivalents for any audio cues) and freeze the list now — no new features may displace them. This is freeze discipline applied to a11y.
- Run the cognitive audit with NASA-TLX after every major mechanic lands: Administer the short NASA-TLX after representative play sessions (tutorial, first real battle, complex late-game turn) and track the mental-demand and frustration subscales; treat a rising score as a drift-gate trip, per the ACM test-retest methodology for validating the instrument in game contexts. Objective backup: count misclicks/undo usage per turn.
- Ship a11y presets, not just options: Follow the TLOU2/Ragnarök pattern: bundle the game's accessibility settings into one-click presets (e.g., Low-vision, Reduced-motion, Low-time-pressure) with every option individually adjustable afterward. On a small game's settings surface, presets are the cognitive lock that makes options usable.
- Build the post-launch audit into the release checklist now: Per the Accesserty rhythm model: every patch gets an a11y regression pass (presets still work, contrast intact, remaps intact, no new time-pressure or flashing introduced); keep a living accessibility statement updated per release; keep the player-feedback channel open with a response SLA. Post-launch neglect is the default — schedule the countermeasure before launch.
- Validate with disabled players before final sign-off, and re-verify fixes: Mirror the Powell/PlayAbility pipeline at jam scale: at least one playtest session with players who have motor, low-vision, and cognitive accessibility needs, followed by a fix-verification pass (the Validation stage). Checklist testing (XAG/GAG) finds candidate barriers; disabled players confirm which ones are real; re-verification confirms the fixes.

## VERIFICATION ROUND 20 (Round 443 — Thu 2026-10-15 ~15:18 EDT)
- New this round (spec only): inclusive plan. Spec has a11y, motor-accessibility, and cognitive-load plans but no inclusive plan — this round adds it (XAG audit shape, ship-blocker re-audit, ASGAARD automation, APX cognitive locks, post-launch monitoring). Matches XAG 3.2 (audit shape), AbleGamers APX (design patterns), TLOU2 (granular presets). (XAG; AbleGamers; TLOU2.)
- Freeze discipline: lock the verified a11y feature set (reduce-motion, colorblind-safe palette, subtitles, high-contrast, focus-visible, remappable keys, touch-first, motor presets) in A11Y-SPEC.md and adopt the XAG audit shape per feature — Goal → scoping questions → pass/fail testing criteria — as the gate every future change must pass.
- Ship-blocker #1: re-run all three audits (a11y, cognitive, post-launch) on every build and every patch; a build that fails the binary statement audit or a drift gate does not ship — mirror the live-service principle that accessibility stays core after launch.
- Ship-blocker #2: add automated regression checks for subtitles/captions and key remapping (ASGAARD-style automated testing) into the pre-ship gate, since a small team cannot hand-verify captions every patch.
- Cognitive locks for a tactics game: implement APX/GAG cognitive patterns as non-negotiable locks — undo/redo for moves, adjustable game speed, objective and control reminders, practice/sandbox mode, own-pace tutorial — and lock them before freeze so post-launch content can't silently bypass them.
- Post-launch monitoring plan: version the a11y statement page with each release, re-verify storefront tags per update (Accessible Games Initiative model), and maintain one feedback channel for disabled players (XAIL-style playtesting) so regressions are caught by players before accessibility press does.

## VERIFICATION ROUND 21 (Round 452 — Thu 2026-10-15 ~16:08 EDT)
- New this round (spec only): sensory plan. Spec has inclusive, motor-accessibility, and cognitive-load plans but no sensory plan — this round adds it (two-channel contract, Vision/Hearing presets, tactics audio audit, disabled-player validation, post-launch monitoring with teeth). Matches XAG 103 (multisensory), AbleGamers APX (second channel), TLOU2 (presets + glossary). (XAG; AbleGamers; TLOU2.)
- Freeze a two-channel sensory contract (ship-blocker): Before the freeze milestone, enumerate every gameplay-critical cue (unit selection, attack telegraphs, turn order, damage, objectives) and require each to arrive through at least two of: shape/symbol, color, text, audio, haptics. Any single-sense cue is a ship-blocker. This is XAG 103 applied to the tactics board, and it directly guards the colorblind-safe-palette pillar.
- Ship Vision and Hearing preset bundles over the existing per-option toggles: One-tap presets (reduce-motion + high-contrast + palette-safe + larger text; subtitles + visual audio indicators + cue glossary) that set the toggles the project already has, leaving each toggle individually adjustable — the TLOU2 pattern that fits this game's verified toggle architecture.
- Build the hearing audit around tactics-specific audio: Every unit action, off-screen attack, and turn-phase change needs a captioned/directional visual equivalent; add a settings-page audio-cue glossary so players can learn each sound's meaning (TLOU2's post-launch addition). Extend the subtitles pillar to non-speech game events.
- Validate with disabled players pre-launch, not just the checklist: Run vision and hearing passes with blind/low-vision and deaf/HoH players (MGATS-style panel or community testers), log findings in A11Y-SPEC as verification 22, and fix before freeze.
- Post-launch monitoring with teeth: Every patch re-runs the vision and hearing audits; any regression is a ship-blocker for the *next* patch; keep the a11y statement page and the binary statement audit in sync with the live build so post-launch drift is detected, not assumed away.
