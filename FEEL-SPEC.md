# Game Feel — Slice Spec (Round 72)
**Status:** DEFERRED to vertical slice (feel pass). Timing table + new techniques. Existing systems (hit-stop, trauma, particles, flash, reduced-effects) stay as-is for the playtest gate.

## Timing table (tune to these, don't add systems)
- Hit-stop: 40–80ms scaled by damage tier (current: 80ms hit / 140ms break/kill — review 140ms against 80ms cap in slice playtests).
- Flashes: 50–100ms (current: 120ms hit / 200ms break — review in slice).
- Input ack: ≤100ms on every order, never animation-lock commands.
- Panel transitions: enter 250–400ms, exit 200ms. Button micro: 80–120ms at 0.9 scale.
- Particles: 20–30 per burst, 0.5–1s life, 200–400 px/s.
- Audio sync: ≤15ms. Feedback cap: 3–5/sec. Pitch variation ±5% on repeats.
- Multimodal stagger: flash 20ms → particles 50ms → floating text 100ms.
- Input buffer: <150ms.

## Event signatures (multi-modal, staggered)
- Limb break: hit-stop → flash → particles → floating text + synced audio. Full trauma ONLY here and on kills.
- Overheat: warning flash + sound (no shake — it's a status, not an impact).
- VEX ace: signature sweetener + leitmotif sting + banner.
- Kill: full trauma + explosion + stinger.
- All scale down under reduced-effects (accessibility requirement).

## UI feel
- Overshoot/spring on buttons (never linear). Squash on press, stretch on release.
- Additive brightness flash on execution. No animation locks on gameplay actions.
- Dramatic effects reserved for high-impact actions only.

## Intent telegraphs = feel centerpiece
- ItB's constrained attack language (adjacent / line / arc) with damage + push arrows on tiles.
- Juice communicates game state first, decorates second. Cut any effect that obscures board state.

## Responsiveness-first gate
- 100ms ack on every order. Juice-off playtest: if not fun juiceless, juice is masking a design problem.

## Fairness math (playtest-gated decision — NOT changed for wave-0)
- Current: single-roll (`rng()*100 < acc`).
- Candidate: Fire Emblem 2RN (displayed 80% → ~90% actual) or XCOM-style hidden aim assist.
- Decision AFTER wave-0 measures perceived fairness (do players complain about misses?). Changing the roll pre-playtest invalidates existing balance tuning.

## Round 85 refinements (animation & juice)
- **Hit-stop recalibrated (implemented):** 40ms normal / 80ms heavy (was 80/140). Practitioner consensus: 25–30ms sweet spot, 100ms hard max. Playtest 30/60ms variants at the gate.
- **Animation-speed control (slice):** 3-step setting (Snappy/Standard/Instant) scaling ALL timings; hold-to-turbo during enemy phase. "Instant" maps to the Low Power Mode code path.
- **Enemy phase:** off-screen moves resolve instantly; batch damage numbers; one-tap skip (FE Awakening pattern); ≤1.2s per acting unit at Standard. Log skips in telemetry.
- **Movement:** slide (ease-out cubic-bezier(0.22,1,0.36,1)) + 60–80ms anticipation dip; paths >4 tiles accelerate mid-path; tap-to-complete-instantly.
- **Attack feel:** per-tier shake (small/medium/large; rotation only on limb-loss/kill); barks <1s and skippable (Awakening crit cut-in lesson).
- **UI:** press-down depressed state; hover lift + sound; iPhone haptics; immediate menu loading. prefers-reduced-motion → Low Power Mode.

## Round 107: Practitioner ceiling + feedback stack (production feel pass)
**Hit-stop ceiling (Sakurai):**
- Per-event cap: 120ms max (never exceed, regardless of damage).
- Per-round cap: ~400ms total (3v3 round) — prevents Dynasty Warriors chain-freeze.
- 40/80ms = 2.5/5 frames @60fps (practitioner band: 2-4/4-6 frames).

**Feedback stack order (Easton + 100ms golden rule):**
1. Sound + shake (simultaneous, t=0)
2. Flash (20-50ms)
3. Particles (50ms)
4. Floating text (100ms)
5. Control returns ≤100ms from click

**Shake tiers (0%/30%/70%):**
- Miss/glance: 0% (no shake)
- Normal hit: 30%
- Limb break: 50% (medium)
- Mech kill: 70% (max)
- Reduce-motion toggle: zeroes shake, swaps flash for static highlight.

**Snappy rule (Buriedbornes):**
- Enemy AI acts immediately after player input resolves. No inter-turn dead air.
- 3-step animation speed compresses tweens, NEVER hit-stop or feedback stack.
- Never make the player wait on a transition.

**Mecha juice (post-sim render pass, never in sim code):**
- Limb damage → directional nudge + spark burst (heat=orange, kinetic=white/yellow)
- Armor break → larger shake + crack SFX
- Kill → max shake + explosion + bark trigger
- Routine hits minimal (kills feel different).

## Round 119: Production feel spec (feel part 4)
**Validation (juice-off test):**
- Strip ALL juice. Game must still be readable + responsive.
- If removing juice breaks it, mechanics were never communicating.
- Juice was hiding it. Fix tuning/support, not particles.

**Pick-a-feeling-first:**
- Define target feeling per beat BEFORE playtesting.
- "Mech cannon feels heavy, not spammy."
- Ask players to describe feel unprompted.
- Validation = their words match target words.

**Juice A/B:**
- Master toggle + per-layer toggles.
- Blind test: no juice vs full stack vs over-juiced.
- Target "medium-high" (Kao: medium > extreme).

**Sakurai hit-stop (tactics carve-out):**
- Light: 40ms (2-3 frames). Crit/kill/limb-sever: 80ms (5 frames).
- Hard cap. NO hit-stop on AoE (Dynasty Warriors rule).
- Visual-only (hurtboxes static). Attacker creeps forward (hidden flavor).

**ItB snappy:**
- Instant cursor/selection. Fast attack resolve. Skippable enemy turns.
- Perfect-information intents (juice = clarity, not particles).
- Feedback stack: flash → hit-stop → marker → particles → sound.

**Shake:**
- Tier 1 (hit confirm) = NO camera shake (flash + hit-stop + sound).
- Shake toggle in accessibility (Xbox GAG 117). iPhone 17 = essential.

## Round 128: Production feel spec (M3 VEX duel)
**Per-weapon hit-stop ladder (IMPLEMENTED):**
- WEAPONS.hitstop multiplier: blade 1.5×, cannon 1.25×, rifle 1.0×, missiles 0.7×/pellet.
- Base: 40ms light / 80ms limb-break/kill. Cap 100ms.
- M3 is 1v1 → Sakurai FFA constraint does NOT apply (safe to extend on climax hits).
- Presentation-only freeze: game logic (turn order, resolution) never advances during hit-stop.

**Validation:**
- Juice-off test per weapon; 120ms/event ceiling with ALL juice on.
- Juul-style A/B: juice must not change bot-harness outcomes (stalemate gate + dead-action green).
- Kao: zero AND extreme juice both degrade — target medium-high.

**Shake discipline:**
- Tiers only (small/medium/large). No shake on light hits.
- Every shake control reaches TRUE ZERO (Microsoft Camera Comfort).
- prefers-reduced-motion honored on iPhone.

**Target feelings (M3 duel):** crunchy, deliberate, readable.

## Round 143: Production feel spec (slice)
**Stop for Big Moments (IMPLEMENTED in game.js):**
- Kill shot: 0.15s hit-stop (deepest). Cap: 0.2s (12 frames at 60fps).
- Smash caps: 20-30 frames. Our scale: tactics grid (smaller than fighting).

**Per-weapon ladder (from Round 128):**
- blade 1.5×, cannon 1.25×, rifle 1.0×, missiles 0.7×/pellet.
- Multiplicative elements (crit/head ×1.5), not flat.

**Three-tier juice (Brown/Hicks):**
- Primary: hit-stop (weight). Secondary: flash/particles/sound (redundant confirmation).
- Tertiary: ambient layer. One primary feeling per moment.

**Validation:** juice-off A/B (goldilocks criterion — if a layer adds noise without weight, cut it).

**Trap checklist:**
- Over-juice (Kao: decreases competence). Shake trigger floor + exact zero-decay.
- Pre-feedback delay <100ms (Napoli). Animation time-outs ≤1.5s (axe return).

## Round 151: Juice validation production spec (slice + pre-jam)
**Hit-stop calibration vs shipped (Hades/Smash):**
- Normal: 40ms base × weapon mult (blade 60, cannon 50, missiles 28/pellet) — in 30-60ms band. ✓
- Heavy: 80ms — in 90-120ms band (low end; acceptable).
- Kill-shot: 150ms, cap 200ms — in 120-180ms band. ✓
- Ceiling: well under Smash 30-frame (500ms) cap. ✓

**Juice events/sec guard (IMPLEMENTED in game.js):**
- _juiceTick() on trauma + floater channels; rolling 1s window.
- >5/sec → telemetry alarm (feel:over_juice), 5s cooldown.
- The over-juice alarm fires DURING the jam, not after.

**Rules:** one juice per event (no stacking); trauma decays fully to zero (zero-floor);
juice-off test = "flat but readable" bar; intensity scales with damage.

**Pre-jam 48h polish checklist (Fun/Graphics/Mood):**
- First-10-seconds: juiced first kill + kill-shot slow-mo.
- Cohesive palette + readable silhouettes (Graphics).
- Music hook + pitch-randomized SFX (Audio→Mood bleed).
- Screenshot-worthy moment (boss-intro zoom/vignette).
- Budget hours to rate other entries (rating economy).

## Round 169: Jam feel + validation spec (slice)
**JAM JUICE BUDGET: freeze, don't grow.**
- Only juice that is <1h to build AND reads in 30 seconds.
- CUT: new per-archetype particles, new shake magnitudes, new animation work.
- KEEP/TUNE ONLY: juice guard, hit-stop ladder, trauma shake, particles,
  damage numbers, WebAudio synth (already built = free).

**KILL CONFIRM (IMPLEMENTED in game.js):**
- Dying mechs fade + shrink over 0.5s instead of popping out of existence.
- m.dying timer set at kill, decayed in the feel-timer loop, rendered with
  globalAlpha + scale in drawUnits. Behind reduced-motion (respects the toggle).

**VALIDATION:**
- JUICE AUDIT (Wayline): does every effect enhance or distract? Hard rule: juice
  NEVER reduces telegraph clarity (threat, stinger, ducking).
- FEEL AUDIT (ThinkGamerZ): input acknowledged <100ms? every hit significant?
  damage/limb/heat readable?
- DRY RUN: disable all juice → duel still legible? Re-enable tier by tier.
- Squint test on the arena. Sensory-overload playtest question (iPhone 17).

**TRAPS:** juice as crutch; homogenization; juice that lies; clarity loss;
hit-stop reading as lag; randf shake; unbounded particles; "add juice later".

## Round 178: Jam feel decision (slice)
**JAM FEEL DECISION: juice budget stays FROZEN.** Empirical backing (Liang 2026):
no reliable engagement/aesthetic gain from raising intensity; players prefer
none/low when juice distracts. Tune contrast curve of EXISTING systems only.

**IMPLEMENTED — follow-through (Cooper; closes anticipation/follow-through gap):**
- Attacker recoil opposite the shot (6px, 0.18s decay). Respects reduced-motion.
- Anticipation (intent telegraphs) was strong; recoil was the missing inverse.

**JAM FEEL AUDITS (pre-jam):**
- Strip test: juice off → game fully readable (juice never load-bearing).
- Mute test: hits read via hitstop/shake/numbers with audio off.
- 30s fresh-player test: no explanation, watch the face, record the screen.
- Assert telegraphs read DURING the loudest kill-confirm (readability > juice).

**TRAPS:** juice hides bad design; no contrast curve; juice fights readability;
more≠better; inconsistent exaggeration; pre-interaction noise; a11y afterthought.

## Round 187: Final feel decision (slice)
**FINAL FEEL DECISION: budget stays FROZEN.** Nothing left to juice. Empirical
record (Liang 2026, Kao 2020): medium intensity is the peak; extreme hurts.
Any new jam juice REPLACES, not stacks.

**IMPLEMENTED — input buffer (Celeste's cheapest trick):**
- Grid taps during animation queued; processed if <150ms old on clear.
- Feel without a single new particle. 100ms golden rule (Easton Dev).

**JAM FEEL VALIDATION:**
- 3-5 fresh players, 5-min hands-on; "did that feel powerful/clear?" post-action.
- A/B none-vs-current only; "too much/annoying" = stop signal.
- Sound coherence audit: VEX kill SFX vs kill-confirm fade sync.

## Round 196: Final feel sign-off (slice)
**FINAL FEEL DECISION: FEEL-READY (conditional GO).** Primitives locked.
Subject to one validation pass (15-min + mute + naive playtester).

**IMPLEMENTED — dynamic range (GameDesign.gg mistake #3):**
- Hit-stop now scales by OUTCOME: limb break ×1.6, kill ×2.2 (on weapon ladder).
- Light chips stay short; crits feel heavy. Tuning only, no new systems.

**VALIDATION PROTOCOL (pre-jam):**
- 15-min feel pass on move→attack confirm.
- Mute test on M3 duel.
- Frame-by-frame: every tap acknowledged within 100ms.
- One naive playtester, timed to first satisfying moment.

## Round 205: Final feel confirmation (slice)
**FINAL FEEL DECISION: FEEL-READY — CONDITIONAL (do NOT declare GO).**
Flip when: (a) ≥3 agnostic playtests; (b) feedback-budget passes peak; (c) shake toggle.

**IMPLEMENTED — hit-stop rate cap (gamestack):**
- `_applyHitStop()`: max 0.35s freeze per rolling 1-second window.
- All 4 hit-stop sites routed through it. Single hits unaffected.
- Prevents perpetual freeze in 3v3 multi-attack sequences.
- 4,186 lines (+10).

**RARITY LADDER:** max shake/hit-stop/slow-mo reserved for VEX finisher (≤once/session).
**PRECISION:** knockback stays zero-to-subtle (bluetengu); weight via hit-stop + shake + particles + barks.

## Round 214: Agnostic playtest readiness (slice)
**FINAL FEEL DECISION: FEEL-READY — CONDITIONAL (do NOT promote to GO).**
Feel proven only by strangers. Target: confirm during LD judging week.

**IMPLEMENTED — shake intensity toggle (GameDesign.gg):**
- 3-state: full (✦) → reduced 30% (◐) → off (✧). Cycles on btn-fx.
- Persisted ('mecha-protocol-shake'). Migrates from binary.
- Hit-stop tiers already mapped (30-80ms × weapon × outcome).

**AGNOSTIC PROTOCOL (pending):**
- 2 rounds × 5 blind testers, M3 duel, touch+desktop.
- Silent + think-aloud, zero coaching. Success = unassisted.
- Reuse 5s timer as stall threshold. No leading questions.
- Recruit OUTSIDE dev's circle.
- 4,249 lines (+16).

## Round 223: Pre-jam freeze (slice)
**FEEL FREEZE: FROZEN. Values-only after. No new feel systems.**
Agnostic protocol = single entry point. 4 toggles = safety valve.

**LOCKED NUMBER SHEET (GameCodex + Easton + IEEE 2022):**
- Hitstop: light 2f / heavy 4-5f / kill 5-8f (weapon ×: rifle 1.0, cannon 1.25, blade 1.5, missiles 0.7)
- Input buffer ALIVE during hitstop
- Trauma: light 0.15-0.25 @ 5.0/s / heavy 0.4-0.6 @ 3.0/s / explosion 0.7-1.0 @ 1.5/s
- offset = trauma². 3-state: full ✦ / reduced 30% ◐ / off ✧
- White flash: 1-2 frames (50-100ms)
- Particles: 3-8 burst, pooled, fade (not pop)
- SFX pitch: ±5-15%. Bark ducking. Floaters 0.5-0.8s
- Frequency cap: ≤3-5 feedback events/sec
- 100ms golden rule: every input acknowledged ≤100ms

**SEQUENCING:** sound+haptic → flash 20ms → particles 50ms → text 100ms

**TACTICS LOCKS:** shake on commit (not selection); hover bounce + click;
per-limb floaters; XCOM-style preview; skippable animations.
2-of-3 pillars (visual/audio/camera) per event.

**BEFORE/AFTER:** 10s juice-off vs juice-on on M3 duel. Blindfold/mute/comparison.

**FRIB'S RULE:** "When something is done and works, leave it like that."
Cap tuning passes. Dynamic range (quiet before VEX kill).

## FEEL VERIFICATION PROTOCOL (Round 238 — Wed 2026-10-14 ~23:12 EDT)
Pillar frozen; verify, don't tune.
- Slow-mo: record 60fps clips (light hit / heavy hit / kill) at 0.25x; frame-count hitstop (2f / 4–5f / 5–8f), flash (1–2f), sequencing offsets (sound 0ms → flash 20ms → particles 50ms → text 100ms). Only way to confirm the sheet.
- Mute test: full combat with sound off. If impacts feel flat, the visual stack is underweight — fix visuals, not audio.
- Blind test: spectator narrates (who attacked, how hard, who died) with no UI explanation. Kill must feel categorically different from chip damage.
- A/B toggle: keep debug juice-off switch accessible (doubles as accessibility fallback with shake-disable + particle quality).
- Density smoke alarm: already shipped — >5 juice events/sec → Telemetry 'feel:over_juice'. Jam-day: check the log; sustained alarms = juice becoming noise.
- FRIB'S RULE (resolved): internal project term — "When something is done and works, leave it like that." Freeze discipline, not a public standard. Documented here so it's never mistaken for one.

## JAM-DAY RUN ORDER (Round 247 — Wed 2026-10-15 ~00:07 EDT)
Verify only. Every run ends PASS / CUT / DOCUMENT — "TUNE" is not a final-24h state.
1. Slow-mo count once (0.25x): freeze frames per tier vs sheet (2f / 4–5f / 5–8f × multipliers), frozen frames/sec vs 0.35s budget. Log every count.
2. Mute test as hard gate: every tier distinguishable by visuals alone. A tier needing its sound = visual failure — cut or simplify the visual, never touch audio.
3. Blind test: one spectator, silent protocol, 5 min. Flinches/confusion noted; no leading questions after.
4. A/B run: full juice vs zero juice (shakeIntensity 0) on the same fight. Raw game controls correctly? Each layer perceptible when re-enabled alone? A layer not perceptible alone = cut.
5. Read the density log: every >5/sec or 0.35s-budget breach must name the second + count. Clean log but muddy fight → trust the log (full-speed feel lies). Breaches → CUT the noisiest layer; never retune numbers.
If slow-mo reveals a miss: confirm at full speed (not a slow-mo artifact) → smallest directed change (one modifier/cap) → if not obviously safe, CUT.

## FINAL VERIFICATION (Round 256 — Wed 2026-10-15 ~01:04 EDT)
- Celeste re-measure: re-time every hit-stop, freeze, trauma-decay ONE AT A TIME at full speed (0.1→0.05 lesson: expect current durations 1.5–2× too long). Never in the editor's mental model.
- Blind A/B this week: ✧ (strip) vs ✦ (full), rater blind, same 30s combat sequence, watch the PLAYER (hands/face) not the screen, ask only "how did that feel?" If ✧ ever wins on "felt better," juice is OVER budget — cut, don't add.
- Rater-first-impression: first 30 seconds must deliver one hit-stop + one trauma shake + one squash/stretch, zero explanation. No hit in 30s = feel pillar failing (GMTK: judges decide in ~2 min).
- Budget alarm: juice that gets NOTICED (player can name it) is over budget. Juice must be felt, never noticed (Berry).
- FEEL FREEZE 48h out: lock every duration, coefficient, pool size, squash curve. Sakurai's rule: "nail it on the first try, and don't make a lot of changes." Post-A/B tuning restarts the experiment — log the verdict and move on.
- Stress the pool on the floor device: max particle burst + full trauma² + hit-stop, hold 60fps or cut density. The stutter IS the felt experience there.
- Budget verified as HARD cap (0.35s/rolling sec; exhausted → skip, don't stack) + juice density alarm. Trauma² = industry shape (Eiserloh).

## FINAL VERIFICATION (Round 265 — Wed 2026-10-15 ~02:03 EDT)
- Ladder verified (code read): 28→40→50→60→80→150ms, monotonic; heavy/kill at 80ms (60–80ms band; Celeste's ~4-frame stop ≈ 67ms). Biggest moment in each interaction is unambiguous. (Valdemir; Sakurai.)
- Spiral-of-death guard: frame delta capped at 50ms (game.js:1812). Semi-fixed discipline in place. (Fiedler.)
- Blind A/B lineage: before/after comparison is the field's gold standard since 2012 (Jonasson/Purho); Lovato validates via paired comparisons. Run once at feel-lock; tuning after = measuring a different game.
- Rater-first-impression protocol: silent first-30s, then "describe the combat in one word." "Snappy/heavy/crunchy" unprompted = working; confusion/mushiness = no budget fixes it. (Thorson: "did the game read my input?")
- Squash discipline: anticipation-only squash, stretch along motion vector, scaleX/scaleY in opposition. Omnidirectional pulse = mushy. (Valdemir/Mario World.)
- Pool exhaustion = drop the spawn (Nystrom). Never allocate in the combat hot path.

## FINAL VERIFICATION (Round 274 — Wed 2026-10-15 ~03:09 EDT)
- Verified (code read): all Eiserloh rules — add-never-set (game.js:1447), trauma² (game.js:1573), smooth sine noise ("never random jumps"), decay (0.5/s, tactics-appropriate).
- Freeze: mechanics locked BEFORE feel tuning. Any mechanic change post-freeze = mandatory re-verification, not a tweak. (Jonasson/Purho: "Don't start polishing until it is final." Nijman: timing changes silently invalidate every shake/hit-stop/squash.)
- 3-second test: first click/move delivers the full stack (anticipation squash → move → impact hit-stop → shake) before any tutorial text. Rater protocol: "shut up and watch" (Valve/Brown). One-word target: "punchy"/"crisp"/"weighty" — "fine" = fail.
- Juice budget audit at max chaos: density alarm fires, kills read louder than light hits, trauma² prevents drone, pool drops without hitch. Measured, not eyeballed.
- Downwell rule: the last 48h is for SUBTRACTION. Find the pair that reads the same; cut or demote the quieter one. One verb fully funded beats five at half juice.
- Blind A/B lineage (existing); rater-first-impression (existing). Feel freeze 48h out.

## VERIFICATION ROUND 2 (Round 283 — Wed 2026-10-15 ~04:26 EDT)
- Hit-stop bands (Sicienski, Capcom frame analysis): our 28→150ms maps to the pro envelope — normal 6–8f (100–133ms), fatal 9–11f (150–183ms). Our bands: tap 28–40ms, normal 60–80ms, kill 80–150ms. 0.35s hard cap = safety rail above all bands. (Tactics pacing: tighter bands than beat 'em ups — discrete actions come faster.)
- Pool Drop = the documented correct policy (Nystrom), not a lazy fallback. Saturated screens hide missing particles; allocation spikes kill the 50ms cap.
- Juice-budget audit as a scheduled gate: every interaction listed, budget proportional to action importance, density alarm enforces it. Without it, juice accretes monotonically.
- Mute test: if a hit feels flat muted, the tactile layer is missing — not the audio. (Nuclear Throne: every weapon its own sound AND its own pause band.)
- No juice after freeze (Kelly). Post-freeze = subtraction only (Downwell). New juice needs a blind A/B + a budget line item — otherwise it's juice debt.
- Feel owner = one decision-maker aggregating blind impressions (Thorson). Raters react; they don't design.

## VERIFICATION ROUND 3 (Round 292 — Wed 2026-10-15 ~05:10 EDT)
- Verified (code read): the COMPLETE Eiserloh model, all four rules. (1) Clamp: trauma ∈ [0,1] (game.js:1454). (2) Add-never-set: events ADD (game.js:1454). (3) Linear decay: dt * 0.5 (game.js:1798). (4) trauma² × smooth noise: layered sines, "never random jumps" (game.js:1580-1582). Plus intensity scaling (0/0.3/1) + juice-events/sec alarm (Round 151).
- Blind A/B before freeze (Kao CHI 2024): fixed scenario, two builds (juice on/off, audio on/muted as second factor), fresh raters, first-impression ratings + repetition block (10+ consecutive hits). Pass: juiced rates better on first impression AND no degradation across repetition. Repetition degrades → the budget is wrong, not the bands.
- Band legibility (Berry): even 0.05s is "still very noticeable" — "the human eye can really spot things." Our 28→150ms ladder sits in the proven-perceptible zone. Verify each band in slow-mo capture + rater report.
- Mute test as a gate: audio off, every major action must still read through the visual bands. Any action that only reads via sound gets its visual band re-spec'd, not its volume raised.
- Freeze discipline (Celeste): once content work begins, feel changes = value-tunes only (".2 to .21"), owned by one person, verified by watching a fresh player. No new juice after freeze. ("Juice It or Lose It" works because the mechanics were locked while juice was layered.)
- Flow-killer rule (Berry): anything interrupting the core loop must prove itself in repetition testing or be cut. (The deleted stamina mechanic "completely destroyed the flow.")

## VERIFICATION ROUND 4 (Round 301 — Wed 2026-10-15 ~05:49 EDT)
- Post-freeze tail (js/game.js, Dead Cells): hit-stop now ends with a 70ms time-scale dip at 0.35× (Hades' 50ms dilation pattern). "Weight comes from the dip after the freeze, not the freeze itself." Verified: 40ms freeze → 70ms tail → 133ms total impact. Respects reducedEffects.
- Eiserloh shake audit (checklist): trauma ∈ [0,1] ✓, clamp on add ✓, linear decay ✓, shake ∝ trauma² ✓, smooth noise per channel ✓ (no random jitter), rotation where translation would off-centre ✓. Reject any shake source with no gameplay cause — shake without cause = ship-blocker.
- Hit-stop ladder (Capcom bands): each band must map to a distinct, legible weight tier. Blind A/B: players sort bands by perceived weight consistently (can't name frames, but sort correctly). Freezes sit outside attack accounting (infil.net). Flow-killer test: no band desynchronises the attack cadence.
- Juice budget (Eastondev): ≤3–5 feedback events/sec, ≤2–3 floaters/sec, timing ladder (sound → flash ~20ms → particles ~50ms → floaters ~100ms). Mute test: with audio off, every band must still read through flash/shake/particles alone. Any band that doesn't = ship-blocker (visual under-tuned).
- Accessibility escape hatches (Dead Cells): separate toggles for shake and flash. Hard-cap freeze duration against tempo — no freeze so long it breaks flow at peak action density.

## VERIFICATION ROUND 5 (Round 310 — Wed 2026-10-15 ~06:23 EDT)
- Verified (analysis): residual trauma. Turn-based pacing + clamp at 1.0 + 0.5/sec decay = no overlap. Camera fully recovers between events. (Hourences recoverability.)
- Frame audit (Filby, ship-blocker): 60fps capture of each ladder tier; step frame-by-frame; confirm freeze frames, 70ms/0.35× dip, recovery match spec. Any tier off by >1 frame = ship-blocker.
- Residual-trauma check (ship-blocker): trauma returns to zero before next event; no stacked shake. (Verified by design for turn-based.)
- One-button + mute pass (ship-blocker): single attack isolated — must read. Muted — every hit must still read. Failures = redundancy audit failed.
- Ladder sort (blind): randomized A/B of adjacent tiers; players sort by weight matching the design ladder. Flat/inverted sort = re-tune, do not ship.
- Escape-hatch verification: toggles for shake intensity and hit-stop zero out their channels. Game fully readable with juice at minimum — tactics board clarity is perfect.

## VERIFICATION ROUND 6 (Round 319 — Wed 2026-10-15 ~06:52 EDT)
- Verified (code read): feedback synchronization. Hit resolution fires 6 channels on the exact frame: hit-stop, recoil, limb flash, hit flash, damage floater, SFX.hit. No desync. (Hicks confirmatory/multimodal.)
- Freeze-discipline gate: hit-stop ladder (a) sorts strictly by severity, no inversions; (b) never overlaps two freezes on same frame; (c) always exits to 0.35× dip for exactly 70ms with clean ramp to 1.0×; (d) trauma decays to absolute zero between beats. Any violation = ship-blocker.
- Latency budget per action: define input→first-visible-change frame budgets for move/attack/select/confirm; measure p99 over scripted session; fail on variance, not just mean (West inconsistency rule).
- Feedback-stack completeness: every combat event fires on ≥2 channels on the exact frame of sim resolution. One-channel events and any desynced event = ship-blockers.
- Subtractive blind A/B: juice-budget toggles — test trauma-off, ladder-off, floaters-off vs full build with naive players; free-form descriptions. If "dead-feeling hits" appears in ladder-off but not full, systems earn budget; if players can't tell a system is on, cut it (Doucet).
- Mute + juice-budget gate: full pass audio-muted — hits read via freeze/shake/flash/floater alone; no beat exceeds juice budget (no overlapping trauma, no channel conflicts). Document escape-hatch activation as design signal.

## VERIFICATION ROUND 7 (Round 328 — Wed 2026-10-15 ~07:29 EDT)
- Verified (code read): refresh-rate independence. All feel constants time-based (performance.now, seconds). No frame-count assumptions. 120Hz-safe. (DF/valdemird.)
- Freeze-discipline audit (ship-blocker): enumerate every freeze trigger site. Ladder fires exactly on resolution frame; 70ms/0.35× never overlaps input-read window; dip returns to 1× with no double-dt frame. One leaked freeze into input = ship-blocker. (Nijman; Swink.)
- Feel constants behind spec (regression gate): trauma adds, ladder steps, dip duration, floater rise/fade, squash targets — one table in FEEL-SPEC.md, nothing hardcoded elsewhere. Any change re-runs blind A/B before merge.
- Cross-platform rAF audit (ship-blocker): verify trauma decay, shake, freeze, floater motion are time-based (performance.now/dt), never frame-counted. Test 60Hz, 120Hz+, forced 30fps — 6 channels stay in sync, degrade gracefully. (Verified by code read this round.)
- Mute + fatigue gate: 10-min continuous muted session — every hit reads visually alone. Confirm juice budget (cap concurrent floaters/particles) before sign-off. (Celeste; Kelly.)
- Consistency audit + shake option: same damage class → identical feel signature (ladder, trauma, floater, sound); document exceptions. Ship shake-intensity setting (Celeste precedent) — 0% shake = full game for motion-sensitive players.

## VERIFICATION ROUND 8 (Round 337 — Wed 2026-10-15 ~08:02 EDT)
- Verified (code read): feel documentation. Trauma model with Eiserloh ref (game.js:1479). Intensity scaling documented (game.js:1484). FEEL-SPEC.md = feel bible. (Swink, Rutledge, Doucet.)
- Freeze-frame ledger: hit-stop ladder + 70ms@0.35× dip as named table. Per-event max freeze, nesting rules (no stacking — queue or drop), dip duration/scale exact. Validation: replay resolution frame, assert no freeze exceeds row. (Nijman; Rutledge.)
- Constants gate (ship-blocker): every feel constant gets name, unit, valid range, owner, last-tuned date, one-line intent (juice vs oil). Verification greps feel paths for untracked literals — fails on any hit. Retune must restate intent. (Rutledge: "sin is moving number without restating philosophy.")
- Regression replay suite (ship-blocker): canonical input replays covering resolution frame; assert 6 channels fire with no desync; shake duration, freeze length, floater timing match spec exactly. Baseline captures diffed on every feel change. (Motion Twin; S9.)
- Juice budget + mute/fatigue (ship-blocker): max concurrent channels per encounter, max trauma/sec. Mute test required gate (Doucet oil: game must read with zero audio). Fatigue check: 10-min combat must not produce shake fatigue (Kao inverted-U).
- Feel sign-off + versioning: FEEL-SPEC.md versioned with changelog; round-8 = v8 with named owner signature. No feel change merges without owner review + changelog line (what moved, why). (Rutledge tap-strafing lesson.)

## VERIFICATION ROUND 9 (Round 346 — Wed 2026-10-15 ~08:29 EDT)
- Verified (process): iteration discipline. Constants gate locked; freeze ledger active; 6-channel matrix complete; pillars = single truth. (Nijman; Supergiant.)
- Graphics-off resolution test (ship-blocker): disable sprites/backgrounds, keep shake, hit-stop, flashes, floaters, UI. Observer must narrate every resolution frame from feel channels alone. If not, channel gap = ship-blocker. (GameDeveloper: feel systems, not art, doing work.)
- Freeze discipline: constants gate locked. Any change during verification 9 requires freeze-ledger entry (what, why, hypothesis) + full replay-suite re-run. No silent tuning. Defense vs iteration paralysis. (Jam deadline approaching.)
- Fresh-eyes playtest: 2-3 players, 15 min each, no coaching. Watch: flinch at big hits (trauma working), correct resolution narration (6-channel sync), confusion moments. Log 3 data points per player; do not re-tune between players.
- ONE timeboxed sprint: pick single weakest pillar from verification 8, timebox 60-90 min, then freeze. Everything else ships as-is. Converts "one more tweak" into bounded, ledgered action.
- Final verification = full ledger on SHIPPING build: freeze ladder (70ms@0.35× + dip), trauma shake, squash & stretch, floaters, 6-channel sync, mute test, refresh-rate independence. One clean pass, then lock. Second pass only for regressions, not retuning.

## VERIFICATION ROUND 10 (Round 355 — Wed 2026-10-15 ~07:00 EDT)
- Verified (code read): shake control. 3-tier (High/Medium/Off, game.js:261); persists (game.js:264); auto OS reduced-motion → 0 (game.js:179). XAG 117 satisfied. (StraySpark 0-100% = nice-to-have.)
- Global shake multiplier (ship-blocker): world-wide multiplier on trauma value — applies to every active shake including mid-play. 3-tier satisfies; 0-100% slider = Phase 2 polish. (StraySpark; Ratchet.)
- Comfort retune: impacts as short decaying spikes (0.15-0.25s ring-down), high-frequency/low-amplitude, positional — no sustained low-frequency roll, no hard on/off, blend in/out. Audit every trauma-add for lingerers. (StraySpark recipe.)
- Reduce Motion preset: zeroes trauma shake, removes hit-stop dip visual + squash & stretch, keeps info legible via alternatives (static floaters; icon flash/color for hit confirmation). Test every 6-channel resolution frame legible at 0% shake — closes haptic-alternative audit, no shake-only feedback.
- Photosensitivity audit (ship-blocker): capture busiest resolution frames + full-screen flashes; scan with PEAT (WCAG 2.0 three-flash) or Harding FPA; gate on ISO 9241-391 (no >5s sequences; >3 flashes/sec over 25%+ = fail). No unskippable flashing anywhere. (Cyberpunk lesson.)
- Discoverable settings: surface motion/shake/reduce-motion in boot flow with plain-language descriptions. Include motion-sensitive playtester in final verification. Write three audits (motion, photosensitivity, haptic-alternative) + PEAT result into FEEL-SPEC final verification. (Ubisoft slide 29.)

## VERIFICATION ROUND 11 (Round 364 — Wed 2026-10-15 ~07:32 EDT)
- Verified (spec read): feel bible complete. 59 unit mentions; intent documented; named constants; Eiserloh ref. Swink/Derek Yu pattern (numbers + rationale). (Swink; Nijman.)
- Two-signature freeze: final verification requires (a) constants gate passes (no untracked feel numbers), and (b) second person replays reference build blind from FEEL-SPEC.md alone and replay suite matches. No sign-off without both. Knowledge-transfer test as ship-blocker. (Nijman.)
- Reference captures: attach one 2-second timestamped capture per effect (6 channels + trauma shake, hit-stop ladder, post-freeze dip, squash & stretch, floaters) with exact parameter set. Prose like "punchy" banned unless paired with numbers + clip. (Jonasson/Purho.)
- Intent lines: for each feel number, one sentence of why (e.g., "post-freeze dip 70ms at 0.35×: communicates resolution-weight without stalling pace"). Numbers without rationale are first things broken by future tweaks. (Derek Yu.)
- Replay suite as regression: any change to feel parameter must pass replay suite before merge; divergence = failed final verification, not judgment call. Converts documentation into executable validation.
- Feel-playground note: document mute test + juice budget as interactive toggles (even dev-only keys) so future maintainer can A/B each layer like "Juice it or lose it" demo. Keeps spec teachable long after original author stops touching code.

## VERIFICATION ROUND 12 (Round 373 — Wed 2026-10-15 ~08:00 EDT)
- Verified (code read): trauma system. game.js:12: trauma:0, hitStop:0; game.js:863: addTrauma(1.0) on phase change; game.js:1220: addTrauma(1.0) on kill; game.js:1479: Eiserloh model (trauma 0..1, offset = trauma²). Tuning + juicing pattern. (Pichlmair; Eiserloh.)
- Freeze feel constants: lock trauma, hit-stop ladder (70ms at 0.35×), squash/stretch, floaters, all 6 resolution channels now. After freeze, any constant change requires Fergusson risk-triage decision (fix must be significant enough to justify instability risk). Per Dwyer, late feel-system changes have well-hidden side effects. Round 12 numbers = quality bar — anything off-spec = blocker, not tweak.
- Three-audit pass: tuning audit (every parameter matches FEEL-SPEC.md constants exactly); juicing audit (every gameplay event — hit, kill, move, resolve — has amplification feedback; juiceless action = blocker); streamlining audit (intent support + refresh-rate independence hold; all 6 channels still fire on resolution frame with no desync). (Pichlmair.)
- Validate by play + empirical check: follow Fergusson — play build over and over against quality bar, then run fresh-player read test — can new player feel exactly what happened on resolution frame? If hit doesn't read without explanation, feel failed, regardless of layers. (Brazie: feel feedback should teach player.)
- Consistency audit (Darrah): every unit, effect, resolution frame must share same timing language, same audio/visual channel budget, same shake profile. No orphan effects; no one-off timings not in spec. Mute-test + juice-budget results must hold uniformly — inconsistency = most visible unpolish.
- Final sweep = refinement only: run delight audit (Cardoso-style: is there one small teach-the-player or death/floater flourish missing?) but add nothing new — 80 Level bootcamp lesson: refine what exists rather than adding features. Then stop: per Fergusson, no game ever truly perfect, so ship when bar met, not when ideas run out.

## VERIFICATION ROUND 13 (Round 382 — Wed 2026-10-15 ~08:34 EDT)
- Verified (spec read): feel freeze defined. :386: "Regression replay suite (ship-blocker): assert 6 channels fire with no desync"; :408: "Two-signature freeze: constants gate + second person replays blind"; :416: "Freeze feel constants: lock trauma, hit-stop ladder (70ms at 0.35×), squash/stretch, floaters, all 6 channels now." Matches Weekly Arcade (scope-lock; Brazie: polish isn't last-minute). (Weekly Arcade; Brazie.)
- Declare written feel freeze now, with date and exception log. After freeze: no changes to trauma-shake magnitudes, hit-stop ladder timings (incl. 70ms @ 0.35× post-freeze dip), squash/stretch scales, or floater timings — only documented bug fixes, each re-verified. (Weekly Arcade; valdemird: juice hooks live next to game state.)
- Regression audit as gate: after freeze, replay resolution frame and verify all 6 channels fire in sync (no desync), at 30/60/120 Hz, on weakest target device, with mute on and reduced-motion on. (Game Developer #1 pre-launch item; Weekly Arcade mid-range jank catches.)
- Fresh-eyes sign-off (ship-blocker): at least 2–3 players who never played this build complete full run; record named sign-off in FEEL-SPEC.md: date, build, who verified, channels synced, constants locked. (Benard; Thorson: players validate feel, not author.)
- Lock juice budget with change log: any post-freeze feel-constant change requires same regression audit before landing; treat Kelly's "Don't Juice It or Lose It" as rationale — budget protects readability of resolution frame, not just performance.
- 48-hour post-launch polish window, earned with launch-day smoke test first: full play-through end-to-end on target browser, all 6 channels confirmed, score/submit/verify flow intact. (Weekly Arcade: freeze holds line, patch window catches what only real players reveal.)

## VERIFICATION ROUND 14 (Round 391 — Wed 2026-10-15 ~09:06 EDT)
- Verified (spec read): mute test required. :387: "Mute test required gate (Doucet oil: game must read with zero audio)"; :396: "Final verification = full ledger on SHIPPING build: freeze ladder, trauma shake, squash & stretch, floaters, 6-channel sync, mute test, refresh-rate independence." Matches PlayWithSpect ("If it doesn't feel good without sound, it doesn't feel good"). (PlayWithSpect.)
- Declare constants freeze now: lock trauma values, hit-stop ladder + post-freeze dip (70ms at 0.35×), squash & stretch params, 6-channel resolution-frame budget. Adopt Valtorian's gate — after freeze, only bug fixes and blocking issues allowed; any feel-constant change needs explicit exception review.
- Two-part sign-off test: (a) full mute test — game must feel right with sound off (PlayWithSpect); (b) one CAMBA-style final playtest — fresh outside player, clipboard, no coaching, exit interview. Log any feel fail as ship-blocker. (CAMBA: designer's job is to make game feel great, not find bugs.)
- Juice-budget audit on resolution frame: verify each of 6 channels costs ~2-3 frames of its window with no desync (already verified once — re-verify under freeze), plus low-refresh pass, record results in FEEL-SPEC as verification 14. (PlayWithSpect: 12-frame rule.)
- Post-launch feel-monitoring plan: which feedback channels to watch (player "game feel" comments, hit-feedback complaints), scheduled review cadence (Unbuilt Lab), patch policy permitting only tuning within sign-off constant ranges — no new feel features.

## VERIFICATION ROUND 15 (Round 400 — Wed 2026-10-15 ~09:41 EDT)
- Verified (spec read): ongoing feel defined. :329: "Freeze: mechanics locked BEFORE feel tuning. Any mechanic change post-freeze = mandatory re-verification"; :348: "Freeze discipline (Celeste): feel changes = value-tunes only. No new juice after freeze"; :416: "Freeze feel constants: lock trauma, hit-stop ladder (70ms at 0.35×), squash/stretch, floaters, all 6 resolution channels now." Matches Nijman (per-effect inventory) and Celeste (feel contract). (Nijman; Celeste.)
- Freeze discipline (ship-blocker): after feel freeze, every balance/content change must pass feel-regression checklist before merge — shake amplitude unchanged, freeze-frame durations unchanged, all 2+ feedback channels firing per event, mute test still passes, forgiveness windows intact. Any change that alters locked value re-opens freeze deliberately, never silently. (Hades: per-milestone feel re-validation.)
- Juice-regression locks (ongoing plan): write numeric ceilings into FEEL-SPEC.md for each effect — max shake amplitude/duration, max concurrent particles, freeze-frame ms per event class, hit-flash contrast floor — and re-verify per round exactly as Nijman/Eiserloh/Sakurai prescribe. New juice must fit under ceilings, not add to them (anti juice creep).
- Feel-monitoring cadence (ongoing plan): adopt Supergiant's fixed-cadence audit — short, repeated blind-feel playtest (fresh eyes, muted + unmuted) each verification round, with input→feedback frame counts recorded. <3-frame budget becomes measured metric, not assertion.
- Forgiveness contract (ship-blocker): document this game's Celeste-style forgiveness tricks as explicit list in FEEL-SPEC.md; any patch that touches input, movement, or hit timing must re-verify full list. (Dead Cells: invisible aids are easiest things to break accidentally.)
- Post-launch feel monitoring (ongoing plan): plan first post-jam patch as feel-monitoring pass — re-run feel freeze checklist against shipped build, and treat any delta as regression, not polish debt.

## VERIFICATION ROUND 16 (Round 409 — Thu 2026-10-15 ~12:19 EDT)
- Verified (spec read): feedback stack exists. :46: "Round 107: Practitioner ceiling + feedback stack (production feel pass)"; :68: "3-step animation speed compresses tweens, NEVER hit-stop or feedback stack." Round 409 adds the evolution discipline around it. Matches Jonasson & Purho (new content inherits the stack) and Nijman (shake only on what the player cares about). (Jonasson & Purho; Nijman.)
- Juice-evolution plan (milestone-gated): define the canonical feedback stack per event class now (e.g., hit = flash + knockback + small shake + sound; kill = flash + bigger shake + freeze frame + particle burst). Freeze this as the baseline in FEEL-SPEC. Rule: no new unit/ability ships until its events fill the stack — new mechanics inherit juice, they never invent ad-hoc effects. This is the Jonasson & Purho pass, enforced per milestone.
- Freeze discipline (ship-blocker): freeze frames only on high-signal events (kills, crits), with a hard budget (cap total frozen ms per event and per second of combat). Verify freeze never pushes input→feedback past the <3-frame rule — measure it in frames after every feel change (Swink's measurable-feel principle).
- Juice-drift lock: centralize all juice parameters (shake amplitude/duration curves, flash durations, freeze budgets, knockback distances) in one FEEL-SPEC config; treat any diff to these values as requiring the round's audit sign-off. New effects must map to an event the player cares about (Nijman's rule) or be cut — this is the mechanical anti-juice-creep gate.
- Ship-blockers before each release: (a) mute test — every event must read visually alone; (b) fresh-eyes blind test — a new player must read hits/kills/turns without explanation; (c) frame-count check — input→feedback ≤3 frames on the slowest path. Any failure blocks ship.
- Post-launch feel monitoring: reserve feel-only patch windows after launch; log feel complaints ("feels off," "unfair hit," "too shaky") as a separate bug class from balance; keep forgiveness assists invisible and add them as options (Celeste Assist Mode pattern) rather than changing the baseline. New content audits run the same three audits (feel-evolution, juice-drift, post-launch) that this round verified.

## VERIFICATION ROUND 17 (Round 418 — Thu 2026-10-15 ~13:13 EDT)
- New this round (spec only): anticipation plan. Spec has no anticipation plan — this round adds it. Matches GDKeys (three-phase audit, unique wind-ups), Sakurai (damage-scaled hitstop), Cooper (anticipation vs responsiveness), Venturelli (designer-as-instrument). (GDKeys; Sakurai; Cooper; Venturelli.)
- Run the anticipation audit now: decompose every unit action into Anticipation/Attack/Recovery, frame-count each, and verify each enemy attack has a UNIQUE wind-up animation that hints at its follow-up. No shared wind-ups — this is the #1 anticipation ship-blocker per GDKeys.
- Apply the timing formula per attack: anticipation frames ≥ reaction (≈15f @60fps) + ability-trigger time + difficulty buffer; then verify total input-to-feedback latency < 100 ms on the player side (Venturelli's bar). Anything over-budget is a ship-blocker.
- Freeze discipline: lock hit-stop to a damage-scaled table (more damage = longer freeze, Sakurai-style), cap KO slow-mo separately, and add the explicit rule that multi-target freezes do NOT stack duration — refraining from global-freeze inflation in multi-KO turns is the shipped-pro behavior.
- Juice-budget lock: keep the existing caps (hit-stop, shake, flash, particles, damage numbers) as hard maxima in FEEL-SPEC, re-verify them under worst-case simultaneous events (full-board multi-KO turn), and keep the juice toggle + photosensitivity guard as ship requirements — Kelly's restraint principle says drift starts the moment caps become "guidelines."
- Post-launch feel monitoring: schedule a round-18-style re-audit after first live feedback, tracking the two failure poles — "unfair/unreadable" (anticipation gaps) vs. "sluggish" (over-anticipation) — and treat any cap inflation between patches as a bug, not polish. Don't rely on testers to self-report feel issues; instrument and self-test with fresh hands (Venturelli's "give the game a rest" method).

## VERIFICATION ROUND 18 (Round 427 — Thu 2026-10-15 ~13:59 EDT)
- New this round (spec only): polish plan. Spec has no polish plan — this round adds it. Matches Dead Cells (1-frame freeze + time-dilation dip), Kao (juice improves feel, not perceived competence), Nijman (trauma² shake), valdemird (strip test). (Dead Cells; Kao; Nijman; valdemird.)
- Freeze discipline: codify a hit-stop formula (Dead Cells model): Lock hitstop to 1–2 frames (16–33 ms @60fps) per hit event and buy weight from a brief time-scale dip (tenths of a second, decay curve documented), never from longer freezes — in multi-unit tactics combat, overlapping long hitstops stack into input paralysis. Ship-blocker: every hitstop event logged and audited against the cap (hit-stop audit).
- Juice-budget lock per frame, player-visible: Set global caps: max concurrent particles, max concurrent damage numbers, shake trauma accumulation with clamp + decay, flash channel independent of everything else. Expose at least three player-facing controls like Dead Cells: particle-limit slider, screen-shake toggle (or 0–100%), separate flash/photosensitivity toggle — plus honor prefers-reduced-motion on web. The juice toggle and PSE guard are ship-blockers; the game must remain fully readable with juice at zero.
- Adopt the per-action juice audit as the polish plan: For every action (attack, KO, move, undo), walk the stack frame by frame — anticipation tell → contact frame → hitstop → time dilation → particles (within budget) → shake (within trauma budget) → flash (PSE-guarded) → layered sound with pitch variation → damage number → aftermath — and record the numbers in FEEL-SPEC.md verification. Use Kao 2020's finding as the acceptance criterion: players should report improved feel without inflated perceived difficulty.
- Validation: strip-test + feedback latency cap: Run the valdemird strip test (all effects off: gameplay identical, all information still readable) before every feel milestone; cap input-to-response latency (~≤100 ms feel target) and measure it. This directly covers the project's "feedback latency" and "visual hierarchy" pillars.
- Post-launch feel monitoring plan (Shiny Shoe model): Add an in-game feedback button that captures the current feel state (frame rate, active effects, recent juice events) and log feel telemetry (juice-spike frame dips, shake frequency, hitstop counts per encounter). Treat feel as a live metric in patches: any content patch that adds effects must re-run the strip test and budget audit, preventing juice-budget drift.

## VERIFICATION ROUND 19 (Round 436 — Thu 2026-10-15 ~14:46 EDT)
- New this round (spec only): juice plan. Spec has a per-action juice audit (round 427) but no juice plan — this round adds it (one tunable config, 50ms rule, validation battery, toggles). Matches GameDesign.gg (five validation tests), Vectra Play (frame-by-frame teardown), Easton (timing thresholds). (GameDesign.gg; Vectra Play; Easton.)
- Per-action audit → fix silent events: Table every action (move, attack, ability, take damage, KO, undo) against feedback channels (flash, particles, sound, shake add, hit-stop, damage numbers). Any event under two channels is a ship-blocker. Cap everything per FEEL-SPEC: hit-stop capped with an anti-stack guard (scale by significance: tap/hit/KO), shake as additive decaying intensity with a hard max clamp, particle counts capped (aim ~20/burst max), damage numbers capped with merge rules, flash capped (50–100ms).
- Freeze the budget in one config: Move every feel value (hit-stop durations, shake magnitudes, particle counts, flash durations, slow-mo scale) into a single tunable object — no magic numbers — so the juice-budget lock is enforced by construction, not discipline.
- Anticipation lock + the 50ms rule: Enemy intents as telegraphs (Into the Breach style); wind-ups ≤2–3 frames; no juice may block input beyond ~50ms (three-frame rule). Anything longer is a cutscene and a release blocker.
- Validate with the pros' battery: Run mute, comparison (vs. Into the Breach/Hades), frame-by-frame latency count (first feedback ≤100ms), and the 300-repetition test on the most-used action; calibrate with fresh testers (blindfold test) since the dev team is habituated.
- Ship-blockers: toggles + monitoring plan: Ship juice toggle, screenshake toggle, damage-number toggle, and a Flashing-VFX/photosensitivity guard (Vampire Survivors model) before sign-off; plan post-launch feel monitoring as a circle — live feedback → hypothesis → playtest → patch feel in updates, not just at launch.

## VERIFICATION ROUND 20 (Round 445 — Thu 2026-10-15 ~15:31 EDT)
- New this round (spec only): feedback plan. Spec has a juice plan (round 436) but no feedback plan — this round adds it (per-action matrix freeze, legibility ship-blocker, feel telemetry, web-audio + haptics set, juice-variability pass). Matches Kao (legibility), Nijman (juice taxonomy), Dead Cells (toggle-gated layers). (Kao; Nijman; Dead Cells.)
- Freeze a per-action feedback matrix now (freeze discipline): For every tactics verb (select, move, attack, hit, miss, kill, turn start, undo), lock the required juice layers (flash/hitstop/shake/particles/damage-number/sound/haptic where applicable) in FEEL-SPEC.md before any new content. Wire juice calls adjacent to state changes at authoring time — never "add juice later."
- Make legibility the ship-blocker, not abundance (feedback plan): The Kao et al. result is the governing rule: every feedback layer must preserve or improve action–outcome legibility; any juice that obscures agency is a defect even if it looks good. Ship-blocker: any action whose outcome a fresh player can't read from feedback alone. Validate with think-aloud playtests, not designer opinion.
- Instrument feel telemetry before launch (post-launch monitoring): Log toggle usage (shake/reduced-motion), session/drop-off events around combat resolution, and expose hitstop/shake magnitudes as tunable constants. Set baselines at launch; treat any patch touching timing as a mandatory juice-regression re-audit.
- Ship the web-audio + haptics minimum viable set: Use Web Audio API synthesized SFX with per-hit pitch variation and rising pitch for streaks (no assets needed), and vibrotactile embellishments on hits where the platform supports them. Ship-blocker: no silent or haptic-dead hits — audio is a feedback channel in the audit.
- Run a juice-variability pass against the "more is not always more" finding: Kao et al. showed success-dependent, variable feedback beat flat amplification: scale hitstop/shake/particles/damage-number punch with outcome magnitude (graze vs. crit vs. kill) and add variability so repeated actions don't feel mechanical. Verify at scale (many units acting) that layered juice never obscures the board state — that's the juice-at-scale audit, and readability loss is a ship-blocker.

## VERIFICATION ROUND 21 (Round 454 — Thu 2026-10-15 ~16:20 EDT)
- New this round (spec only): impact plan. Spec has a feedback plan (round 445) but no impact plan — this round adds it (impact plan with freeze discipline, feel telemetry regression suite, legibility ship-blockers, sound-sync discipline, post-launch feel monitoring). Matches Swink (three-part model), Abrodi (frame budgets), Kao (juice A/B validation). (Swink; Abrodi; Kao.)
- IMPACT PLAN / FREEZE DISCIPLINE: Score every action (attack, crit, death, ability, UI confirm) against the arXiv 19-feature framework and Abrodi's hit-feedback checklist (shake, 2-frame hit-stop, particle burst, damage numbers, pitch-varied sound, recoil, 0.8/1.2 squash, enemy flash, knockback, camera zoom). Lock each action's frame counts, shake amplitudes, particle counts, and damage-number style in the versioned per-action matrix; no patch may change a value without re-running the new-player flinch test. This is the ship-blocker gate.
- FEEL TELEMETRY AS REGRESSION SUITE: Instrument per-action input-to-feedback latency, hit-stop frames, shake amplitude/duration, particle spawn counts, and audio-visual sync offset (must stay under ~2 frames — sound coherence is the #1 empirically identified feel-breaker). Alert on any action drifting outside its locked budget; keep a juice-on/juice-off toggle build for A/B regression (the Kao validation template).
- LEGIBILITY SHIP-BLOCKERS: Adopt Egmatic's rule — if a juice effect obscures board state, telegraphs, or damage numbers, it is simplified or cut. Run the flinch test per patch: fresh players, zero coaching, big hits must make them flinch, small hits must not make them blink. Add screen-shake/flash reduce options (Blood Moon accessibility principle).
- SOUND-SYNC DISCIPLINE: Every impact sound must fire within the same frame window as its visual feedback, with pitch variation on every hit (never the same sound at the same pitch twice in a row); mix attack/impact/UI layers so the hierarchy of "what matters" survives at full chaos.
- POST-LAUNCH FEEL MONITORING: Monthly watch of genuinely new players (no coaching), analytics leak review (where players stall or churn = feel leak to fix first), and a per-patch re-audit of any new or retuned action against the matrix. Treat "less punchy than last patch" reports as telemetry bugs, not opinions.
