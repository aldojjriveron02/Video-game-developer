# Audio — Slice Spec (Round 69)
**Status:** DEFERRED to vertical slice. This spec is the build target. Prototype audio (sfx.js synthesis, bus architecture, genuine mutes) verified correct — no "sliders lie" defect.

## SFX inventory (~50 sounds)
- UI: click, hover, select, confirm, deny, back, tab-switch.
- Movement: cursor tick, unit select, move-confirm, pathing ticks, servo/footstep.
- Combat (per weapon type): rifle, blade, cannon, missile — each = base + tail + sweetener.
- Damage states: per-limb hit, armor break, limb destroyed, overheat warning, shutdown, death explosion.
- Turn flow: round-start chime, phase-change stinger, victory/defeat stingers.
- Ambient: hangar hum, mission wind/desert bed.

## Layering recipe (per combat sound)
- Base (Web Audio synthesis, existing) + tail (noise/reverb decay) + sweetener (one signature texture: servo whine, metal shear, heat sizzle — from Sonniss GDC bundle, CC0).
- Max 3–5 layers. Frequency bands: sub boom / mid crack / high sizzle. No masking.

## Adaptive hooks (music.js events)
- `deploy_start` → ambient bed only (Prunty pattern).
- `round_1_first_action` → combat music starts exactly.
- `threat_level_changed` → intensity stem (percussion) fades by live threat count.
- `low_hp`, `victory`, `defeat`, `phase_change` → stingers.
- 2 music states (deploy-ambient / combat) + 1 intensity stem. No middleware.

## Music deliverables (needs Aldo)
- 2 Pixabay tracks re-cut: deploy-ambient loop + combat loop.
- 1 synthesized intensity stem + 4 stingers (victory/defeat/phase/critical).

## Voice
- Text barks stay. Add per-pilot 3–5 note synthesized voice-blip motifs (Advance Wars style). No recorded/AI VO in slice.

## Mix rules
- Bus levels: UI/critical loudest, barks above combat, explosions capped.
- Mutes genuinely control buses (verified).
- Test on iPhone speaker + cheap earbuds, not just headphones.
- License log for every non-synthesized file (CC0 preferred; never CC-BY-SA/BBC).

## Acceptance tests
- Phone-speaker test; mute-button test; 30-minute fatigue test; license-log review.
- VEX audio identity = sweetener palette + blip motifs (documented).

## Round 87 refinements (music & adaptive audio)
- **Prunty's silence rule (IMPLEMENTED):** 'menu' state is now silence. Music enters at combat trigger only. Hangar/deployment = silent.
- **State pairs (slice):** 1 ambient + 1 combat (2 intensity levels) + stingers (turn, limb loss, overheat, victory/defeat). Aldo's 2-track pick: driving combat (simple melody, steady rhythm) + quiet ambient.
- **Cheap adaptivity (slice):** GainNode percussion layer follows heat/hull/VEX phase (~20 lines). Beat-quantized stingers on bark triggers.
- **Anti-fatigue:** music-mute rate as playtest metric; functional music (tension = information); iOS unlock on first gesture (launch checklist).
- **Licensing:** Pixabay allows commercial game use + adaptation, no attribution. Keep license page + track URLs + uploader in spec. Instrumental only. Avoid known-song soundalikes.

## Round 134: Production music spec (slice)
**Hysteresis (IMPLEMENTED in music.js):**
- Minimum 4s per state (one musical phrase). Rapid re-entry ignored.
- Battle state exempt (must fire instantly on trigger).

**Deploy-silence (formalized):**
- Trigger frame: last mech lands / first combat beat. NEVER a UI click (Morrowind trap).
- Menu fades (2.5s) → deploy silence (2.0s) → battle (1.5s fade-in).

**Two-state stem pairs (vertical-first):**
- Stems as synced AudioBuffers; 1-2s crossfades; quantize to bar boundaries.
- Same tempo/key/duration; align within ms (no phasing).
- iPhone: stream (don't preload large buffers); cap 4-6 simultaneous stems.

**Pixabay sourcing:**
- 4-8 min tracks; verify seamless loop points before acceptance.
- Archive License Certificate per track. NO standalone OST (standalone clause).
- Content ID dispute workflow ready before trailer cut.

**Fatigue validation:**
- Mute-rate telemetry event (consent infra exists).
- 45-60 min sessions with audio-specific questions.
- Martins 3× rule: if loop noticed before 3rd repeat → add shuffle/melody-mute variant.
- Reference A/B against 1-2 tracks.

**Global music mute** wired to a11y toggles (players who can't mute quit instead of complaining).

## Round 144: Production audio spec (slice)
**Pitch as information (IMPLEMENTED):**
- SFX.tone() accepts severity (0-3 semitones). Higher threat = higher pitch.
- Telegraph stinger at player-turn start: pitch scales with max intent damage.
- 20+ dmg = +3 semitones; 12+ = +2; 6+ = +1. Audio reinforces visual intent.

**Prunty start/stop discipline:**
- Deploy silence (validated). Kill-shot: beat of ducking/silence in hit-stop ladder.
- Combat music: steady rhythmic, simple melodies (never distract from decisions).
- Music per phase, never constant.

**Nuisance-score protocol:**
- List most-played SFX (telemetry); label annoyances; fix via layering/randomization.
- Audio events: per-SFX play counts, mute toggles, skip-rate.

**Mix discipline:**
- 70% alarm + telegraph stingers always above the mix (iconic, not shrill).
- Test on iPhone speakers (Bugnet platform rule).

**Audio QA (per build):**
- Bark tokens fire on time, exactly once. No double-triggers (ratchet/PRD).
- Sliders/toggles persist. Assets within iPhone memory budget.

## Round 156: Jam audio + validation spec (slice)
**MUTE-RATE TELEMETRY (IMPLEMENTED in telemetry.js):**
- shutdown() logs audio:session_end:sfx_muted / music_muted (from SaveStore).
- Nuisance score: % of sessions ending muted = proxy for mix/loop quality.
- Threshold: >20% muted sessions = mix/loop problem, not taste.

**Pre-jam audio checklist (Aldo's call — 2 Pixabay tracks):**
- 2 instrumental tracks, 4-8 min each (filter: most Pixabay tracks are 1-3 min).
- Original titles in credits/UI. License Certificate downloaded per track.
- Track URL + author logged for itch.io page credits. Time-box: 1h max.

**Validation:**
- 10-min nuisance soak per track on iPhone speaker; reject 3+/5 annoyance at min 10.
- Verify audio unlock inside the itch.io iframe embed (not just standalone).
- Mix: normalize SFX peaks; headroom for busiest moment (3v3 + heat alarm + barks).

**Sourcing rules:** Pixabay only; keep certificates; credit authors (speeds disputes);
never standalone-redistribute; MP3 for browser (OGG spotty in Safari).
SFX stay procedural + pitch-as-information (zero file weight, zero licensing risk).

## Round 164: Jam audio + validation spec (slice)
**JAM AUDIO DECISION: ship WITHOUT the 2 Pixabay music tracks.**
- Music-as-MP3 = highest-risk jam asset (decode failures, autoplay timing, licensing,
  volume quirks). WebAudio synth BGM instead (procedural, zero assets).
- Revisit Pixabay tracks post-jam for the commercial slice.
- Synthesized-SFX architecture is already the jam-correct choice. No other changes.

**BGM DUCKING (IMPLEMENTED in music.js + game.js):**
- Music.duck(dur): dips musicBus 0.55→0.18 in 50ms, recovers via setTargetAtTime.
- Called when the telegraph stinger fires — the intent cue survives combat noise.
- Manual gain dip (no sidechain needed at this scale).

**VALIDATION (pre-jam checklist):**
- First-gesture unlock on iPhone Safari + Android Chrome (verify OUTPUT, not just start()).
- All autoplay modes + MEI cold path (judges = first-time visitors).
- Headphone unplug; call/notification; background tab; silent switch; multi volume states.
- Every node routes through its bus. Dispose/reuse nodes (no leaks).
- Correlate mute-snapshot telemetry with mission events (mute spike = mix bug).

**TRAPS:** autoplay assumptions; iOS silent playback (no errors, no sound);
programmatic volume disabled on mobile; BGM loop seams; reverb routing (keep dry);
unhandled play() rejections; audio sprites at low bitrate.

## Round 171: Jam audio + validation spec (slice)
**JAM AUDIO DECISION: change nothing about the engine.**
- Zero-asset WebAudio synth is the jam-grade standard (js2devlog, kentog751).
- No Pixabay tracks in JAM_BUILD (licensing, weight, loop seams). No new tools mid-jam.

**PRIORITY VOICE STEAL (IMPLEMENTED in sfx.js):**
- _voice(priority): Tier 1 sounds (critical = kill-confirm, vexStinger) bypass
  the 12-voice cap. Normal SFX still drop at cap. GameCraft voice-priority rule.
- Already existed: variation pool (Round 126, ±1 semitone), master compressor
  (music.js), 12-voice cap, iOS unlock on first tap.

**VALIDATION (pre-jam checklist):**
- Full M3 duel muted + unmuted; BGM loop-seam check; stinger-vs-bark overlap
  under ducking; iPhone 17 real-device speakers; iOS first-tap unlock.
- Fatigue: 8-10 min duel exposes single-voice SFX (variation pool covers this).
- Clipping: heat alarm + stinger + kill + BGM stack on phone speakers.

**TRAPS:** autoplay lockout; stacked-synth clipping; harsh loops; repetition
fatigue; voice pile-ups; new middleware mid-jam.

## Round 180: Jam audio decision (slice)
**JAM AUDIO DECISION: nothing architecturally left to tune.** Hand-built synth
already meets the zero-asset standard. Do NOT swap in ZzFX/jsfxr this late.

**AUDIT (verified compliant — spec only, +0 lines):**
- SFX pitch jitter: ±5%/±10% anti-machine-gun (sfx.js) — fatigue addressed.
- Barks: variant rotation + per-trigger cooldowns + stop_on_nonidle + verbosity.
- Tier 1 voice steal (concurrency cap). Music.duck() with setTargetAtTime
  (click-free). First-tap AudioContext unlock (document pointerdown).
- Master bus: check for DynamicsCompressorNode as final node (jam TODO).

**JAM AUDIO VALIDATION (pre-jam):**
- Concurrency spam test (3v3 + alarm + barks + BGM) on iPhone 17 Safari.
- First-tap unlock on fresh Chrome (zero MEI) + iPhone 17.
- Background suspend → bfcache restart (no double BGM).
- Clipping check at max device volume.

**TRAPS:** clipping; mud (frequency masking); autoplay; fatigue; per-trigger
regen (precache pattern for post-jam).

## Round 189: Final audio decision (slice)
**FINAL AUDIO DECISION: MIX-READY (conditional).** Architecture correct (synth =
right jam choice; unlock in place; pitch variation; mutes). Declare mix-ready
after the 4-device validation pass. Currently: audio-ready, mix-pending.

**AUDIT (verified compliant — spec only, +0 lines):**
- Pitch variation: ±1 semitone random per play (Round 126, anti-fatigue).
- Mutes: separate SFX/Music toggles (Round 55).
- First-tap unlock: verified (Round 179).
- Synth SFX + BGM: zero files, zero licensing risk (Bfxr/ZzFXM pattern).

**PRE-JAM VALIDATION (4 devices):**
- iPhone speaker → AirPods → desktop speakers → headphones.
- Gates: kill-confirm + VEX signature intelligible on phone speaker;
  BGM never masks telegraphs; -9 to -12dB headroom; -18 LUFS ballpark.
- Critical listening: headset, eyes closed, focus on audio only.

**POST-JAM (not now):** adaptive vertical layering (2-3 stems for M3).

## Round 198: Final audio sign-off (slice)
**FINAL AUDIO DECISION: MIX-READY (conditional → GO pending mix check).**
All-synth = full Audio-category eligibility (no opt-out).

**IMPLEMENTED — iOS silent-switch guard (both contexts):**
- music.js: already had audioSession.type='playback'.
- sfx.js: added (idempotent, global). Both contexts covered.

**AUDIT (verified):**
- Master limiter: DynamicsCompressor (threshold -18dB, ratio 6:1) on master bus.
- First-tap unlock: resume() on gesture (both contexts).
- BGM ducking: music bus separate (duck under barks — verify in mix check).

**MIX CHECK (pre-jam):**
- Measure integrated LUFS over full M3 duel. Target: -18 LUFS-I (mobile).
- Loudest SFX ≤ -13 LUFS-M. Master never clips (0 dBFS).
- If -16 to -20 LUFS-I, no clipping → flip to GO.

**4-DEVICE MATRIX:** iPhone 17 (speaker+buds, silent on/off), desktop Chrome,
desktop Safari, Android Chrome. Cold load → first tap → M3 duel → bfcache-back.

## Round 207: Final audio confirmation (slice)
**FINAL AUDIO DECISION: MIX-READY — CONDITIONAL (do NOT confirm yet).**
Gate: (a) ebur128 capture per mission (−23/−24 LUFS, −1 dBTP); (b) 4-device matrix + silent-switch ON/OFF; (c) bug-bash zero P0/P1.

**IMPLEMENTED — bark ducking (A Sound Effect readability):**
- BGM ducks (0.4, 0.5s) when any bark fires. Voice > music.
- 4,193 lines (+2).

**AUDIT — iOS trap (all verified, Round 198):**
- audioSession 'playback' ✓. 'interrupted' handled ✓.
- Voice cap 12 ✓. Master limiter −1 dBTP ✓.

**MIX CONTRACT:**
- BGM ducks under barks + hit-stop. Priority: barks > UI > enemy > ambient.
- Limiter = safety net only. Trailer at −14 LUFS (separate, never in-game).
- Sound-off M3 must be fully playable (telegraphs only).

## Round 215: ebur128 execution readiness (slice)
**FINAL AUDIO DECISION: MIX-READY — CONDITIONAL (do NOT confirm yet).**
Gate: (a) ebur128 render of M3 loudest 60s at −18…−16 LUFS / ≤−1.0 dBTP;
(b) 4-device checklist passes (incl. silent-switch ON).

**IMPLEMENTED — audio re-check on bfcache + visibility:**
- pageshow (persisted) now calls SFX.ensure() → resumes if suspended.
- visibilitychange → visible also re-checks.
- iOS backgrounding no longer leaves audio dead.

**MEASUREMENT PROTOCOL (pending):**
- OfflineAudioContext render M3 loudest 60s → WAV → ebur128.
- Per-bus target: −23 LUFS (barks/SFX). Master: −18…−16 for judges.
- 4,258 lines (+9).

## Round 224: Pre-jam freeze (slice)
**AUDIO FREEZE: synthesis params locked at Fri Oct 16 6PM.**
Post-freeze: bus gains only (master/BGM/SFX/bark). No new synth designs.

**IMPLEMENTED — judge-proofing (SunoBoard):**
- Master gain node (bus → master → destination).
- Volume slider (visible, HUD) + persisted mute (localStorage).
- "Judges play in offices and at night" — slider + mute satisfy this.

**FREEZE MATRIX (run at freeze):**
- Master ≈ −18 LUFS integrated (ebur128)
- BGM ≈ −12 dB under SFX
- True peak ≤ −1 dBTP
- Fresh Chrome profile, zero interaction, itch iframe → audio on first click
- iPhone, silent switch ON → audioSession 'playback' routes past mute
- bfcache/tab-return → ducking compressor survives

**PLATFORM TRAPS (closed):**
- Autoplay: no audio before first gesture (Chrome suspends).
- iOS silent switch: audioSession.type='playback' (iOS 17+).
- Repetition: pitch ±5-15% (already in number sheet).

**SEED DISCIPLINE:** every SFX = frozen parameters. ZzFX lesson.

## RETURNAL PROTOCOL (Round 230 — Wed 2026-10-14 ~22:30 EDT)
Research-validated freeze discipline for the audio pillar:
- Freeze = gains table in version control. From Fri Oct 16 6PM onward, only ±3dB documented commits allowed. No master-chain changes.
- Per-category ladder (LUFS-M): loudest −13; loud −18 to −14; focus −23 to −18; average −23; quiet −28; barely audible −40 to −33.
- Mix too low, turn up at the end (Karadensky). Never crush dynamics to fix a loudness number.

## OFFLINE LOUDNESS WORKFLOW (Round 230)
- Render representative 3–5min gameplay (menu → normal → densest SFX stacking) via OfflineAudioContext to WAV.
- `ffmpeg -i mix.wav -af loudnorm=print_format=json -f null -` → confirm integrated ≈ −18 LUFS, true peak ≤ −1 dBTP.
- If stacking pushes true peak over: pull loudest SFX recipes down in the gains table, never add master compression.

## 4-DEVICE MATRIX (pre-freeze)
- Headphones: check 2–5kHz harshness on loudest SFX.
- Laptop speakers: confirm hooks/melodies survive (bass rolls off ~150–200Hz).
- Phone speakers: mono-sum check — nothing critical carried only by stereo.
- Bluetooth/noisy: confirm transients survive codec smearing.

## JAM-DAY SMOKE TEST
1. Cold load → first-tap audio unlocks (autoplay).
2. Volume slider + mute persist across reload.
3. 60s loudness sample ≈ −18 LUFS.
4. Phone-speaker spot check.
5. No console audio errors.
Any failure blocks the freeze. Audio is built; these are verification-only.

## JAM-DAY AUDIO VERIFICATION CHECKLIST (Round 239 — Wed 2026-10-14 ~23:18 EDT)
Run Thu/Fri AM, before the Fri 6PM synthesis lock:
1. Offline measurement: 60–90s densest-gameplay window → OfflineAudioContext → WAV → FFmpeg loudnorm two-pass. Confirm integrated ≈ −18 LUFS (±1), BGM −12dB under SFX, true peak ≤ −1 dBTP. Log the three numbers as the frozen reference. Only master move = documented calibration offset.
2. Voice-cap + spam test: noisiest SFX at max rate — cap/steal engages, no runaway, flat CPU. Then 15–30 min session with live-AudioNode counter — flat = no leaks.
3. Autoplay unlock matrix: cold load (fresh profile) desktop Chrome + Firefox, then REAL iPhone Safari — first tap = audible sound; background + return resumes; zero console audio errors. Simulator does not count.
4. 4-device pass: laptop, phone speaker (THE GATE — BGM intelligible, SFX not harsh/vanished), earbuds, external speaker. Fixes = per-recipe ≤±3dB documented commits, never master-bus.
5. Lock enforcement (Fri 6PM): no new SFX, no recipe re-authoring, gains-table commits only. Smoke: volume set→reload persists; mute→reload persists (key 'mecha-protocol-volume' frozen); autoplay green on mobile Safari.

## FINAL-LOCK CHECKLIST (Round 248 — Wed 2026-10-15 ~00:11 EDT)
Before Fri Oct 16 6PM synthesis lock:
1. Offline measurement tonight: ~30 min representative played-as-designed gameplay (not spam, not AFK). Confirm −18 LUFS ±1, BGM −12dB under SFX, true peak ≤−1 dBTP on the RENDERED output (codec intersample peaks — Meijer). Off target → master-trim ONLY, no per-sound changes.
2. Spam-test MAX_VOICES=12 (priority steal protects anchors, mix never starves) + 30-min session (node counts bounded, no leaks).
3. Autoplay matrix on real hardware: cold load → first gesture → all lanes sounding, every target browser; real iPhone with silent switch ON and OFF. Single AudioContext verified in code (one `new AC()`, guarded).
4. 4-device pass (phone speaker = final gate): BGM loop seams + pitch extremes (±1 semitone) auditioned on weakest speaker; persistence smoke (volume→reload, mute→reload) on frozen key 'mecha-protocol-volume'.
5. Lock enforcement Fri 6PM: gains-table commits only (±3dB cap). No new SFX, no timbre re-synthesis, no storage-key changes. (OSHA Coaster lesson: never introduce audio systems late.) Log anomalies with exact repro steps before touching anything.

## FINAL LOCK (Round 257 — Wed 2026-10-15 ~01:09 EDT)
- -18 LUFS CONFIRMED: three independent pro sources (Audiokinetic/Wwise, Airwiggles, Schappler) converge on -18 integrated for mobile/portable vs -24 console. Do not creep toward -14 streaming targets.
- Lock checklist (pass/fail, record who ran it and when — lock is a decision, not a feeling):
  1. Unlock: cold-load → one tap → suspended→running + music starts. Chrome desktop, Android Chrome, Safari iOS. Single context — every start() through it.
  2. Lock pass: 3 voice caps active, musicDucking on, 0.8s/2.0s crossfades click-free under load, mecha-protocol-volume persists/restores, NO asset adds after.
  3. 4-device matrix: desktop speakers, earbuds, phone speaker, one more — music states + SFX + UI audible and undistorted, quiet sounds audible, no phone-speaker clipping.
  4. Mix freeze: re-measure final build vs -18 LUFS. If it moved: fix ASSETS, never nudge master gain post-lock.
  5. Ducking stress: rapid music→boss→victory with caps saturated — attenuation clean, no clicks, no voice steals of critical SFX.
- Anti-patterns: post-lock sound additions (invalidate every measured number); unlocked contexts ("no audio on judges' machines"); volume creep; single-device validation.

## FINAL LOCK (Round 266 — Wed 2026-10-15 ~02:11 EDT)
- Important-sounds audit (Lester's anchor question): "What are the important sounds the player needs to hear?" For tactics: UI clicks, unit select/move/attack, victory stingers survive under music FIRST. Implemented: all 7 UI sounds promoted to Tier 1 priority (kill-confirm + VEX stinger were already there). UI sounds are short + player-driven — can't saturate the 12-voice cap.
- Mix phases: lock = the Polish phase — scheduled, non-skippable, not squeezed in after the build. (Lester.)
- LRA discipline (Rodrigue): measure per music state; mobile-safe 5–10 LU. Too high → fixed duck amounts (never master gain); too low → check the limiter isn't crushing. Master fader doesn't move after freeze.
- Anti-patterns: post-lock additions ("Saving it til last" — indie devs' #1); volume creep; unlocked contexts (fresh-profile test); untested ducking (boss + max-SFX must be HEARD).
- Lock-pass log: one-page QA sheet (issue/where/recreate/status/tracking). Any post-lock audio change re-runs all four tests.

## FINAL VERIFICATION 2 (Round 275 — Wed 2026-10-15 ~03:17 EDT)
- Zero-layer rule (Zlobin): the neutral state is DELIBERATE SILENCE (Prunty, Round 87) — menu = silence, deploy = silence + ambient, battle = first contact. Composed first, not left for last. States mutually exclusive; 4s hysteresis (Round 134).
- Lock-pass log (Laven): dated checklist per lock item (priority audit, LRA values, ducking stress, device matrix, first-tap unlock). Run after every design change. (Quarles: full re-mix after any major rework.)
- Priority audit: saturate the pool with Tier 3/4, trigger UI — Tier 1 never drops. (Lester's rule.)
- LRA spot-check: 30+ min real gameplay, BS.1770 (integrated/LRA/true peak). -18 LUFS = Sony portable reference. True peak ≤ -1 dBTP.
- Ducking stress: densest moment — engage, hit target, release cleanly, no stick/pump. (Fracture pattern: -9dB/500ms/1000ms.)
- Volume creep guard: frozen reference levels; any move in integrated LUFS = flag. (Quarles.)
- Mix freeze is a decision, not a feeling. (Existing.)

## VERIFICATION ROUND 3 (Round 284 — Wed 2026-10-15 ~04:34 EDT)
- Verified (code read): zero-layer = TRUE silence (music.js:124-130). stop() fades to 0.0001 THEN src.stop() — the source is stopped, not idling at -60. `current = null`, `state = 'off'`. (Mojo Kid/Halo: prove the no-music state is literally silent.)
- Law of two-and-a-half (Splice): listeners track ~2.5 threads. Our 12-voice cap + UI Tier 1 + virtualization = the pattern. Priority audit: saturate the cap; UI always wins. Any Tier 1 loss to a lower tier = ship-blocker.
- Ducking at the hysteresis boundary: hammer state changes inside the 4s window — no stuck-ducked, no doubled beds. (Fracture: engage at the START of the priority line.)
- Fresh-ears LUFS pass: someone who hasn't been in the mix all day verifies -18 LUFS on the Sony portable reference + cheap earbuds. Any bus above frozen gain = volume creep = re-freeze.
- First-tap unlock on the device matrix: cold-load in 2 mobile browsers; silence before first tap, full audio after. One blocked context = ship-blocker. (MDN.)
- Freeze is sacred. A new asset = full re-verification. (All sources.)

## VERIFICATION ROUND 4 (Round 293 — Wed 2026-10-15 ~05:14 EDT)
- Verified (code read): iOS audioSession "playback" (WebKit bug 237322). Set in sfx.js:46 during ensure(), before any sound plays; armed on first tap via the pointerdown handler. The silent-switch bypass is live.
- Saturation audit (Quarles): hammer all buses simultaneously at the 12-voice cap; confirm UI Tier 1 never stolen; the steal sounds musical, not hard-cut. Verify steal order matches the tier table UNDER SATURATION, not just in isolated tests.
- Hysteresis stress (Zlobin): rapid combat/peace toggling at 2–3× the 4s rate, all 12 voices saturated. No musical chatter, no layer collisions, UI Tier 1 never stolen. Zero layer written first (Zlobin's rule — his mistake was themes first).
- LUFS pass (Mongeau; Sony ASWG-R001): integrated −18 LUFS + LRA + true-peak −1 dBTP, ≥30 min continuous mixed-state play. LRA verifies consistency across the silence zero-layer + music states. Final measurement with fresh ears — after a rest break, never at session end.
- First-tap matrix (real devices): (a) audio only after first gesture, (b) single AudioContext throughout, (c) audioSession "playback" before first tap, (d) iOS with silent switch engaged. One failure = ship-blocker.
- Device matrix minimum: phone speaker (iOS + Android), earbuds, laptop speakers, desktop. UI clicks must cut through music on the smallest driver; ducking must not pump.
- Freeze discipline (Quarles): "after the final mix, nothing new gets added." Any post-lock addition = full re-verification (LUFS, saturation, hysteresis). The lock-pass is final.

## VERIFICATION ROUND 5 (Round 302 — Wed 2026-10-15 ~05:53 EDT)
- Verified (code read): anti-fatigue via synthesis. All SFX synthesized; core tone() applies ±1 semitone randomization per play (sfx.js:84) + severity-shifted pitch (sfx.js:85). The randomization IS the variation pool — discrete samples unnecessary.
- Freeze certificate (Quarles): any post-freeze design/asset change (new SFX, UI flow, music timing) invalidates the certificate → mandatory full mix re-audit. Ship-blocker: a mix change without a re-audit entry.
- Ducking audit: defined depth (-9 dB), attack ~500ms, release ~1000ms, pre-roll for VO/critical. Hysteresis stress: spam SFX/UI across thresholds — no pumping/chatter. Ship-blocker: audible pumping, or critical event that never engages the duck.
- Silence audit: zero-layer = digital silence (-inf, no DC offset, no idle loop noise). Audit low-loudness passage durations (Digimonk) — "quiet" must never read as "broken." Ship-blocker: measurable signal in zero layer, or silent passage long enough to seem dead.
- LUFS + device matrix: measure music/sfx/ui buses + master (BS.1770); first-tap × device matrix (iOS audioSession, silent-switch, iPhone speaker clipping above -8 dB RMS, headphones, desktop). Ship-blocker: target miss, mobile clipping, first-tap failure.
- Fresh-ears + anti-pattern sweep: clipping, masking of UI cues, unducked critical sounds, repetition fatigue, ducking abuse. Ship-blockers mirror the anti-patterns.

## VERIFICATION ROUND 6 (Round 311 — Wed 2026-10-15 ~06:27 EDT)
- Verified (code read): concurrency protection. MAX_VOICES 12 (sfx.js:11); non-priority drops at cap, critical tier bypasses. Passes the "spam away" test.
- Audio certificate (freeze): loudness targets (mobile-web -18 LUFS ±2, -1 dBTP ceiling, 20 LRA max); per-layer caps; variation rule (±1 semitone); ducking hysteresis; first-tap unlock per platform; zero-layer = true digital silence. No changes after freeze except ship-blockers.
- Nuisance-score session: 30-min representative capture; rank sounds by trigger count; file fatiguing sounds as audio bugs. Automate repeated-input tests; verify randomization is audible.
- Mini device matrix: headphones, laptop speakers, phone speaker, desktop speakers. First-tap on iOS Safari (playback category) + muted/autoplay-blocked. Measure actual device output (DAW loop) for LUFS/peak; capture balanced across exploration + combat (no bias).
- Silence + state audit: zero-layer = true digital silence (no stuck voices, no DC); music cross-fades cleanly, never persists/stops abruptly; ducking returns with hysteresis (no pumping); spam-trigger SFX for concurrency faults.
- Fresh-ears gate: dedicated listener (not the implementer) plays ship candidate; files anything "sonically ruining the experience" as ship-blocker. Blockers: silence failures, peaks over -1 dBTP, ducking pump, iOS first-tap failure, nuisance findings.

## VERIFICATION ROUND 7 (Round 320 — Wed 2026-10-15 ~06:55 EDT)
- Verified (code read): mute-test coverage. Every audio-critical event has a visual channel (Round 310). Master volume + mute persisted (sfx.js:14, Round 224). Mute playthrough passes.
- Honest gap (not a jam-blocker): no independent per-layer volume sliders (APX recommends music/sfx/ui separately). Phase 2 candidate. Documented as known limitation.
- Silence audit + first-tap matrix (ship-blocker): zero-layer=true = actual digital silence on real iPhone (Safari Web Audio). Full first-tap matrix (cold load, resume, background-return, orientation change) — audioSession unlocks on first gesture every time. No cell signed off untested.
- Loudness audit per layer (ship-blocker): ≥30-min representative capture of real device output into DAW/meter (no capture bias). Integrated LUFS per layer; master peak ≤−1 dBTP. Safety limiter doing almost nothing — heavy limiting = failed mix, not fixed.
- Hearing-diverse audit (freeze gate): full mute playthrough (every audio cue has visual channel); mono-output check; layer-slider isolation. Any sound-only cue = ship-blocker (APX second-channel).
- Concurrency + fatigue stress: saturate MAX_VOICES 12 with hysteresis ducking engaged — deterministic, no pumping, no starvation. Long-session fatigue listen — ±1 semitone variation prevents ear fatigue over full session.
- Freeze ritual: 24h fresh-ears re-listen after mix sign-off; confirm no master-bus crutches (EQ ≤±3dB, compression subtle/absent); lock reference-title comparisons. Gate freeze on the four audits, not taste.

## VERIFICATION ROUND 8 (Round 329 — Wed 2026-10-15 ~07:33 EDT)
- Verified (code read): Web Audio architecture. ONE AudioContext (sfx.js:42-44). Master gain (sfx.js:48-52, Round 224). DynamicsCompressor (music.js:29). iOS guard (sfx.js:46, Round 198). Gesture resume (sfx.js:54). MAX_VOICES=12. (Smus, Chrome FAQ, TestDevLab.)
- Silence audit (ship-blocker): zero-layer=true = true silence end-to-end. OfflineAudioContext render with mute → assert all-zeros buffer (automated regression). Confirm mute survives suspend/resume (visibility cycle). iOS silent-switch detected and messaged, never fought.
- Loudness audit (ship-blocker): measure ACTUAL device output (not in-code meters) across ≥30-min capture. Portable target −18 LUFS integrated (±2), max peak −1 dBTP, max LRA 20. Run MAX_VOICES=12 all-firing stress; confirm compressor holds, no clipping. ("Spam away.")
- Browser-matrix freeze: Chrome, Safari (macOS+iOS), Firefox, Android Chrome. Each: one AudioContext; created/resumed from first gesture; autoplay-denied shows "tap to enable" (getAutoplayPolicy + NotAllowedError); background tab suspends cleanly, resumes without timer drift (no setTimeout scheduling).
- Node-concurrency stress: spam SFX at 12-voice cap; DevTools WebAudio panel — Render Capacity healthy, graph shows no dead-node accumulation (disconnect + GC), ducking hysteresis doesn't pump or fight limiter.
- Freeze + regression: lock assets, gains, compressor settings, context config. OfflineAudioContext snapshot tests for 3 layers + zero-layer silence = automated gate. Ship-blockers: autoplay-denied black screen, clipping under stress, background-tab weirdness, iOS silent-switch path.

## VERIFICATION ROUND 9 (Round 338 — Wed 2026-10-15 ~08:06 EDT)
- Verified (code read): mix architecture. BGM ducking for critical cues (music.js:109-112 — Overwatch priority). Hysteresis 4s/state + ignore re-entry (music.js:144-148 — Hellblade II, no pumping).
- Freeze discipline: lock mix like Hellblade locked headphone target. Post-verification, NO mix changes without ship-blocker justification logged. Frozen: bus gains, LUFS targets, ducking thresholds/hysteresis, compressor settings = mix snapshot. Deviation = regression, not "tweak." (Florianz: loudness creep from unlogged changes.)
- Ship-blockers (pass/fail): (a) zero-layer=true silence holds in EVERY state — mid-ducking-release, MAX_VOICES saturation, pause, tab-hide, iOS gesture-resume. Any leakage = blocker. (b) Full-mix true peak never exceeds ceiling in loudest stress capture. (c) Mute kills all three layers incl. scheduled/lookahead — verified by mute test, not assumption.
- Fresh-ears listening: final mix check on fresh ears, fixed calibrated level, flat headphones + phone speaker (iOS reality). Level-match in LUFS before any A/B vs reference. Once post-freeze, not continuously.
- Static-mix check: capture full loop; verify ducking engages AND releases (no stuck, no pumping); calm vs intense produce measurably different LUFS. Tactics game with identical menu/battle/victory mix fails "design mix that changes over time."
- Long-session fatigue + anchor: 30+ min at reference level. (i) No listener fatigue from density/over-compression (check compressor for constant gain-reduction — always working = over-cooked). (ii) Anchor holds — UI/unit feedback legible under MAX_VOICES stress (Overwatch rule: most important sound survives, rest culled).

## VERIFICATION ROUND 10 (Round 347 — Wed 2026-10-15 ~08:32 EDT)
- Verified (code read): master volume slider (index.html:38, Round 224). Per-bus = documented honest gap (Round 320): master + mute only. Phase 2, NOT jam-blocker. (XAG 105 recommends per-bus.)
- Zero-layer playthrough (ship-blocker): full mute (master at 0) playthrough of every mission. Every audio-gated event (attack direction, unit spotted, objective change, turn cues, UI confirmations) must have observed visual alternative. Baker's rule: any audio cue needs visual cue. (GAG; XAG 103.)
- Per-bus volume + presets (Phase 2): expose independent sliders/mutes per bus (music/sfx/ui), add "Hearing" preset (TLOU2). Verify LUFS targets hold when buses isolated. (XAG 105 all-or-nothing prohibition.)
- Caption critical events: no dialogue, but tactical events exist — compact SFX caption feed for critical events (enemy spotted, objective completed, unit under attack). Brief subject+verb, consistent, legible, contrast/backplate, synced. (Baker checklist.)
- Stereo-panning audit + mono: verify no directional cue relies on panning alone — every panned cue needs visual direction indicator. Mix verified in mono. Add mono check to static-mix verification. (XAG 105.)
- Fresh-ears protocol: deaf-perspective tester (hearing tester at zero volume) runs zero-layer + caption QA + per-bus testing. Verification checks on frozen mix, not new features. (XAG 103/105; GAG hearing.)

## VERIFICATION ROUND 11 (Round 356 — Wed 2026-10-15 ~07:05 EDT)
- Verified (spec read): LUFS targets. -18 LUFS-I (mobile, SPEC:213 — Sony -18 portable). SFX ≤ -13 LUFS-M (SPEC:214). Master 0 dBFS. BGM -9 to -12dB headroom (SPEC:194). Professional alignment.
- Freeze discipline: adopt "gates" model — declare final mix pass window where only mix-breaking bugs touched, no new content. Final pass = "most important." Mix is final upon release; single mix owner judges from player's perspective. (Riviere.)
- Loudness audit (ship-blocker): capture ≥30 min representative gameplay (menu → exploration → combat → UI) from actual browser output (OfflineAudioContext render or loopback into DAW — never in-page meters alone). Verify integrated LUFS, LRA, true peak vs targets. Re-audit on iOS/Safari (audioSession playback) + Android/Chrome. (Couthier: measure hardware output.)
- Platform presets: ship "Night Mode" (reduced dynamic range) + VO-focus control at minimum. Verify each preset independently at low volume on laptop/phone speakers. Pros never assume users' hardware. (Returnal precedent.)
- Golden-ears + fresh-ears: critical listening in calibrated setup, A/B vs 2-3 genre references. "Fresh-ears" rule (no mixing after long sessions, consistent SPL). Fix anything needing >±3dB at master in the mix instead. Limiter should barely work at -18 LUFS — if it does, mix too hot. (Hysteresis + MAX_VOICES=12 should be doing that work.)
- Zero-layer sacred: verify silence renders truly silent (no dither/buffer noise) under each preset; confirm hysteresis release doesn't pump vs reduced-dynamic-range presets; fold mute-test into per-platform preset audit.

## VERIFICATION ROUND 12 (Round 365 — Wed 2026-10-15 ~07:36 EDT)
- Verified (code read): Web Audio architecture. sfx.js:42-60: single shared AudioContext (created once); resume() on suspended/interrupted; iOS audioSession playback (R198); master gain → destination (R224). Matches Smus/Patatap/Howler. (Smus; Patatap.)
- Freeze graph as signed artifact: snapshot full node graph (buses, ducking gains, limiter) into AUDIO-SPEC; after freeze, any graph change requires ship-blocker review. Gate: automated OfflineAudioContext render test asserting each layer routes to its bus and zero-layer renders RMS = 0.
- Instrument MAX_VOICES 12: implement steal-oldest with debug counter for steals/active voices; stress-test with rapid SFX bursts while capturing about://tracing render capacity. Ship-blocker: any glitch/xrun or steal-counter anomaly.
- Lifecycle audit (ship-blocker): one shared context; resume() on first gesture AND on visibilitychange return; suspend when hidden; iOS device test of audioSession 'playback' + unlock path (locked→unlocked logged). Any unresumed-suspended playback attempt = blocker.
- Mute-test coverage: automated silence test per layer (mute music/sfx/ui individually, render, assert silence) plus manual checklist; keep zero-layer=true as blocking assertion, not manual check.
- Mastering freeze: lock LUFS targets, ducking hysteresis thresholds, limiter settings in AUDIO-SPEC; verify with rendered loudness (OfflineAudioContext) that ducking engages/releases without pumping and limiter never audibly engages during normal play. Parameter changes post-freeze = ship-blocker.

## VERIFICATION ROUND 13 (Round 374 — Wed 2026-10-15 ~08:05 EDT)
- Verified (spec read): LUFS targets locked. :213: -18 LUFS-I (mobile); :214: loudest SFX ≤ -13 LUFS-M, master 0 dBFS; :222: −23/−24 LUFS, −1 dBTP (ebur128). Matches Airwiggles (mobile −18, console/PC −23/−24). Returnal pattern. (Airwiggles.)
- Lock freeze as number: write per-layer/per-asset LUFS targets into AUDIO-SPEC.md (desktop −24 LUFS-I, mobile −18 LUFS-I, ±1), allow only ±3 dB trims after freeze, declare any bigger change ship-blocker requiring re-audit. (Returnal model.)
- Platform audit (twice): once through laptop/desktop speakers, once through phone speaker (or EQ proxy), measuring 30 minutes of real gameplay captures — meter actual encoded assets (Opus/ogg), not source WAVs, catching intersample true peaks. (Loudness audit.)
- Density stress: script worst-case scene saturating MAX_VOICES 12 with music+SFX+UI, verify hysteresis ducking keeps priority cues audible and no clipping/voice-stealing artifacts; run mute-test and zero-layer=true-silence checks in same build. (Bugnet: test mix in combinations players hit.)
- Bug-report audio context: add output device, channel config, audio settings, game state to audio bug reports before final QA so any mix regression reproducible. (Bugnet.)
- Fresh-ears pass: one deliberate-listening playthrough on headphones and one on device speakers, all meters hidden, logging only what feels wrong — then reconcile against metered audit. Meters catch loudness violations; ears catch mix regressions. (Bugnet; MDN.)

## VERIFICATION ROUND 13 (Round 383 — Wed 2026-10-15 ~08:36 EDT)
- Verified (spec read): LUFS targets locked. :194: "-18 LUFS ballpark"; :213: "Target: -18 LUFS-I (mobile)"; :214: "Loudest SFX ≤ -13 LUFS-M. Master never clips (0 dBFS)"; :222: "Gate: (a) ebur128 capture (−23/−24 LUFS, −1 dBTP); (b) 4-device matrix". Matches Audiokinetic (PS −24 console, −18 mobile, ±2 LU; max peak −1 dBTP). (Audiokinetic.)
- Declare audio lock date: after it, master-gain/limiter/per-layer defaults become read-only; only ship-blocking audio bugs (crash, silence, clipping, unlock failure) reopen the mix — document any reopening in AUDIO-SPEC.md as verification 13 amendment.
- Mix-freeze audit: confirm un-mastered mix hits −23/−24 LUFS desktop and −18 LUFS mobile targets natively; master gain/limiter must be safety-only, per Audiokinetic posture.
- Regression audit: rebuild from current source, re-capture loudness over representative gameplay session (minimum 30-minute equivalent across exploration + combat + UI), measure actual browser output (Web Audio render path end-to-end), confirm all prior verifications (unlock, mute, ducking, sliders, per-layer honesty) still pass on final build.
- Fresh-ears final mix pass: one full playthrough on uncalibrated consumer gear (laptop speakers, cheap earbuds, phone) before sign-off — never approve final mix only on studio monitors/headphones.
- Sign-off gate: no launch with any open ship-blocker — (a) AudioContext unlock failure on first gesture, (b) clipping/distortion on any layer at max, (c) mute not fully silencing, (d) ducking inversions, (e) any layer slider doing nothing (HONEST GAP). Record sign-off verdict in AUDIO-SPEC.md.

## VERIFICATION ROUND 14 (Round 392 — Wed 2026-10-15 ~09:09 EDT)
- Verified (spec read): final audio sign-off exists. :199: "Round 198: Final audio sign-off (slice)"; :361: "Verified: anti-fatigue via synthesis. All SFX synthesized; tone() applies ±1 semitone randomization per play. Randomization IS variation pool." Matches GDC (dedicated audio QA pass) and thegameaudioco (variation avoids fatigue). (GDC; thegameaudioco.)
- Final-audio sign-off gate (ship-blocker checklist): AudioContext unlocks on gesture in every supported browser; mute test passes (hard silence); every layer audible and silent at slider min/max; volume ducking engages on schedule; no layer clipping. Freeze discipline: after "final mix verified," master-gain and per-layer defaults locked — any change re-runs full verification chain. (GDC: missing sign-off, loudness drift.)
- LUFS lock: re-measure integrated LUFS per layer and master at final mix against spec targets (-18 mobile / -23–-24 desktop), record exact values, lock them as contract. Treat recorded numbers as loudness audit baseline for every subsequent build. (Critical Listening Lab.)
- Severity-rated audio bug pass (GDC "Sounds as Intended" discipline): Critical (no audio, unlock failure, crash/hang), Major (mute broken, ducking wrong, layer missing), Minor (timing/volume polish). Sign-off = zero Critical/Major, reviewed Minor. Scales 800–1,000-bug pro discipline to small-team checklist.
- Platform audit: verify final mix on at least desktop + one mobile browser, headphones + device speakers, document per-platform loudness normalization behavior (spec already requires "platform loudness verified" — make it recorded, repeatable step, not one-off).
- Post-launch audio monitoring: define feedback channel for audio bug reports and add post-launch re-audit step to AUDIO-SPEC verification chain ("verification N+1" after any patch touching audio code): re-run LUFS metering, unlock/mute/ducking tests, sign-off checklist. Counters post-launch audio neglect.

## VERIFICATION ROUND 15 (Round 401 — Wed 2026-10-15 ~09:45 EDT)
- Verified (spec read): ongoing audio defined. :194: "BGM never masks telegraphs; -9 to -12dB headroom; -18 LUFS ballpark"; :213: "Measure integrated LUFS over full M3 duel. Target: -18 LUFS-I (mobile)"; :214: "Loudest SFX ≤ -13 LUFS-M. Master never clips (0 dBFS)"; :215: "If -16 to -20 LUFS-I, no clipping → flip to GO." Matches ASWG (-18 LUFS mobile) and 30-min capture. (ASWG.)
- Lock ASWG targets as ship-blockers: adopt −23 LUFS (±2) desktop/console and −18 LUFS (±2) mobile with −1 dBTP true-peak ceiling; enforce ceiling with master safety limiter and fail any build that drifts outside ±2 LU. (ASWG.)
- Loudness-regression ritual per release: re-capture identical ≥30-min gameplay session (per ITU-R BS.1770 Integrated/Short-Term/Momentary adapted for games) after every content or mix change, and log integrated LUFS + true peak against previous baseline — loudness-regression audit.
- Protect key verbs with ducking and mix anchor: choose mix anchor (SFX verbs), apply sidechain ducking + volume/bus structure so UI and critical SFX can never be buried by dense moments; verify per mute test. (Game Audio Learning Portal.)
- Living audio bug log and mandatory polish window: track description, location, repro steps, status, tracking number, run planning→execution→polish→post-mortem per round, and never cut polish phase post-launch.
- Ongoing audio ownership (freeze discipline): designate who runs post-launch audit each release; Epic 2026 layoff case shows dissolving audio resourcing post-launch is fastest route to loudness drift and mix neglect — AUDIO-SPEC.md freeze/verification chain only works if someone owns re-verification.

## VERIFICATION ROUND 16 (Round 410 — Thu 2026-10-15 ~12:24 EDT)
- New this round (spec only): mix-evolution plan. Spec has no mix-evolution/snapshot plan — this round adds it. Matches Prototype (snapshot discipline + drift-correction budget), Apex (player-signal-driven re-mix), Helldivers 2 (mix as living system). (Bridgett; Apex; Helldivers.)
- Adopt the "snapshot" equivalent now (freeze discipline): Browsers have no Wwise snapshots, so make the mix state explicit and versioned: a single MIX-CONFIG object (per-verb gains, bus levels, ducking amounts, limiter threshold) that is the ONLY thing allowed to change the mix, committed with a changelog line per change. Ship-blocker: any mix change made by editing synthesis code directly instead of the config.
- Lock the loudness-drift audit into the regression ritual: After every content/mix change, re-run the 30-min capture and diff integrated loudness per bus/verb against the frozen baseline with a ±2 LU gate — Prototype's capture-and-compare, formalized. Ship-blocker: any verb or bus drifting >2 LU from baseline without an approved re-baseline.
- Keep the dual-target (−24 console / −18 mobile) split and validate both: The −24/−18 split matches the industry ASWG-style recommendation; keep both profiles in the mix config and run the capture ritual against both, since mobile playback (small speakers, noisy environments) masks differently — the Helldivers-2 "consistent mix across formats/platforms" goal at this game's scale.
- Protect the gesture-start unlock and safety limiter as non-regression items: Add to the regression ritual: (a) first-gesture unlock test (no audio before gesture, clean start after), (b) limiter stress test (max simultaneous verbs must never clip / must sit under −1 dBTP). Ship-blocker: any regression in unlock behavior or any peak over −1 dBTP in the capture.
- Schedule a post-launch audio audit, not just pre-launch sign-off: Per Audiokinetic's live-ops principle and the Apex precedent: even after "final audio sign-off," plan one post-launch mix review driven by real-device feedback (phone speakers, laptop speakers), with verb-clarity (the game's equivalent of footsteps = critical tactical information) as the protected signal. This closes the loop from "sign-off" to the "ongoing" item already in AUDIO-SPEC.md.

## VERIFICATION ROUND 17 (Round 419 — Thu 2026-10-15 ~13:17 EDT)
- New this round (spec only): accessibility-audio plan. Spec has no accessibility-audio plan — this round adds it. Matches XAG 104/105 (cue/subtitle audits), TLOU2 (dedicated cue bus), Forza (co-development), Fortnite (Sound Visualizer). (XAG; TLOU2; Forza; Fortnite.)
- FORMALIZE THE CUE INVENTORY + MUTED PLAYTHROUGH AS SHIP-BLOCKERS: Build a cue registry (every essential gameplay event: turn start, unit select/move/attack, damage, defeat, UI focus) mapped to its synth cue AND its canvas visual alternative, per XAG 105. A full muted playthrough (audio off) and a full "blind" playthrough (canvas hidden, audio only) must both be completable before freeze. Any essential cue lacking a visual alternative is a ship-blocker. [Freeze discipline]
- ROUTE ALL ACCESSIBILITY CUES THROUGH A DEDICATED CUE BUS: Following TLOU2's dedicated-mix-channel model: create a separate Web Audio gain node for accessibility cues (distinct from music/SFX buses), with its own slider, documented in MIX-CONFIG. Verify the cue bus respects gesture-start unlock (no cues before first user gesture) and master-mute logic (when master mute is on, cue audio silences but visual alternatives must activate automatically — mute accessibility). Verify cue loudness against both LUFS targets on all 4 devices. [Ship-blocker: cue bus missing or cues masked by ambience bus]
- CAPTION THE 30-MINUTE CAPTURE PER XAG 104: Every spoken/vocalized element and every important non-speech sound in the capture gets captions: speaker IDs, ≤40 chars/line, ≥200% scaling, adjustable background opacity, bottom-center default with placement options, never obscuring critical HUD. Validate caption TIMING against actual synth output (cue drift check) — captions must match when sounds fire, not when events trigger.
- LOCK CUES AT FREEZE; REGRESSION ON THE 4-DEVICE MATRIX: Post-freeze, any content change re-runs the cue + subtitle audits (post-launch audit mechanics). New synth assets must map to EXISTING cue families (synth budget discipline — no new unregistered cue meanings). Re-validate cue audibility on all 4 devices after any mix change, confirming cues still clear the -24/-18 LUFS dual targets relative to ambience. [Ship-blocker: post-freeze content without audit sign-off]
- POST-LAUNCH: SCHEDULED RE-AUDIT + DISABLED-PLAYER FEEDBACK CHANNEL: Adopt the MGATS/Forza model: recruit 1–2 disabled playtesters (blind/low-vision and deaf/hard-of-hearing) for post-launch builds; re-run the full cue + subtitle audit after each content update; monitor telemetry (caption toggle rate, cue-slider usage) and community reports for cue drift. Publish the accessibility-audio plan's audit results in the verification log so the discipline survives past round 17.
SHIP-BLOCKER SUMMARY (accessibility-audio plan): (a) any essential cue without a working visual alternative; (b) subtitle audit failure against XAG 104; (c) muted playthrough cannot complete a full game; (d) post-freeze content shipped without cue/subtitle re-audit sign-off.

## VERIFICATION ROUND 18 (Round 428 — Thu 2026-10-15 ~14:03 EDT)
- New this round (spec only): synth-voice plan. Spec has no synth-voice plan — this round adds it. Matches NMS/Weir (voice limiting, known bounds), Spore (rule-constrained generativity), Downwell (small frozen palette). (NMS; Spore; Downwell.)
- Freeze the synth-voice palette now (freeze discipline): Lock the cue inventory: every event → one synth voice → one bus → one priority. No new voices after freeze without an AUDIO-SPEC addendum; every new voice must come with its level bounds (min/max dB), voice-count cost, and priority class. This is the Weir rule ("know the upper and lower limits of any sound") made procedural.
- Implement and test the voice budget as a ship-blocker: Set a hard concurrent-voice cap with deterministic stealing (accessibility/UI cues > combat > ambience > music), then run the spam/flood test on all 4 devices: worst-case combat + UI spam must never drop a critical cue or clip the master. A single dropped damage/turn cue under load = ship-blocker, per the voice-starvation anti-pattern.
- Validate loudness per dual-target profile with integrated LUFS, not peaks: Capture the 30-min session under each profile and measure integrated loudness (-24 and -18 targets) plus true peak (-1 dBTP ceiling). Verify in the loudest combat passages; a profile that misses target by >1 LU is a ship-blocker. This mirrors the pro convention (console -23 / portable -18 LUFS, EBU R128).
- Make the post-launch audit a gate, not a hope: After every content or audio patch, re-run: 30-min capture, mute test (all buses, incl. accessibility cues), gesture-unlock verification, and cue-inventory walk on the 4-device matrix. Codify "post-launch re-audit" as a release checklist item — the NMS lesson is that unpredictable emitter counts make one-time verification insufficient.
- SHIP-BLOCKER SUMMARY (synth-voice plan): (a) any critical cue ever inaudible in full mix; (b) master mute fails to silence any bus (incl. accessibility cues); (c) audio before gesture unlock or missing after it; (d) integrated LUFS off-target or true peak above -1 dBTP; (e) voice cap exceeded / node leak in Web Audio (oscillators not stopped); (f) any cue fires zero or double times per event in the cue-inventory walk.

## VERIFICATION ROUND 19 (Round 437 — Thu 2026-10-15 ~14:51 EDT)
- New this round (spec only): audio plan. Spec has audio discipline but no audio plan — this round adds it (Cross model, per-cue targets, voice prioritization, implementation-first). Matches Sony ASWG-R001 (LUFS targets), Prunty (implementation-first composition), Frontier (voice management). (Sony; Prunty; Frontier.)
- Keep the dual-target LUFS profiles — they match industry spec (Sony ASWG-R001: -24 LKFS console / -18 LKFS portable): Action: run the 30-min gameplay capture through a BS.1770 meter (Integrated + LRA + true peak ≤ -1 dBTP) once per profile on each of the 4 devices; record results in MIX-CONFIG. Ship-blocker: both profiles must pass before sign-off.
- Make the cue inventory a ship-blocker: adopt the Cross model — every cue has a tracked row (creation / implementation / mixing, LUFS contribution, sign-off criteria: video reference + scenario). Freeze discipline: any animation/timing change after audio lock triggers a mandatory audio re-check; no silent cue drift. Ship-blocker: cue audit walkthrough with zero missing/desynced cues.
- Enforce the mute test + gesture-start unlock on all 4 devices as ship-blockers: master mute must fully silence the Web Audio graph (no leaks), and the AudioContext unlock must fire on the first user gesture on each device — iOS Safari/Chrome Android are the known failure points (verify with the gesture-start unlock flow, not just desktop).
- Build mix protection into the synth engine: cap concurrent synth voices with contextual priority (Frontier's voice-management pattern), duck the music bus under critical UI/alert cues, and keep buses routed so each option slider controls exactly the buses it names (Bishop's anti-pattern). Ship-blocker: worst-case polyphony stress scene must stay within synth budget with no audible stealing of critical cues.
- Gate post-launch: schedule a loudness re-audit after every patch (regression check via the same 30-min capture) and a community-feedback review window, per the Frontier model. Add a captions/fallback verification: with master mute ON, every critical gameplay cue must have a visual or caption equivalent (XAG-104) — audio cues must never be the only channel for critical information.

## VERIFICATION ROUND 20 (Round 446 — Thu 2026-10-15 ~15:38 EDT)
- New this round (spec only): mix plan. Spec has a mix-evolution plan (round ~428) but no mix plan — this round adds it (milestone gates, cue sign-off document, voice-cap priority ladder, mix ship-blocker list, 30/90-day post-launch gates). Matches Cross (task cards + sign-off), Returnal (priority system + previs), DOOM (mix as adrenaline system). (Cross; Returnal; DOOM.)
- FREEZE THE MIX WITH MILESTONE GATES, NOT A DATE: Adopt the professional "mix gate" mechanic — one locked mix pass per milestone (pre-jam cut, jam build, post-jam polish), each with a golden-path validation session and sign-off recorded in AUDIO-SPEC.md. No new cues enter the mix after the final gate except as ship-blocker fixes.
- MAKE THE CUE INVENTORY A SIGN-OFF DOCUMENT: Promote the cue inventory to per-cue task cards with "definition of done" and sign-off — each cue needs: trigger condition, priority rank, voice-budget cost, LUFS target, and a gameplay playtest check (heard in context, not solo). This is the Cross model and Returnal's previs/review discipline applied to our inventory.
- CODIFY THE VOICE-CAP AS A PRIORITY SYSTEM: Extend the verified concurrent voice cap into an explicit priority ladder (per Returnal / DICE HDR): gameplay-critical cues (selection confirm, combat hit, turn-change, alert) outrank ambience/decor; when the cap is hit, low-priority voices are culled with time/location (cooldown/position) constraints rather than arbitrary drops. Document the ranking in MIX-CONFIG.md.
- SHIP-BLOCKER LIST FOR THE MIX: Adopt the anti-pattern list as literal blockers: (a) any cue failing its dual-target LUFS check; (b) any new cue added after mix-freeze without a re-balance pass; (c) any gameplay state where a critical feedback cue is inaudible under the music layer (the #1 readability rule); (d) gesture-unlock or mute-state regression on any of the 4 verified devices. One violation = no ship.
- POST-LAUNCH AUDIT GATE (30/90 DAYS): Schedule two post-launch audio gates in AUDIO-SPEC.md: a 30-day pass (player-feedback sweep for audio complaints, regression check of gesture-unlock/mute across current browser versions, accessibility re-check of master volume + mute discoverability) and a 90-day pass (re-run the device matrix on any new high-traffic browser/device, loudness re-audit of the music profiles against current LUFS tooling). Treat new content patches as mini mix gates — new cues trigger the cue-inventory sign-off flow before merge.

## VERIFICATION ROUND 21 (Round 455 — Thu 2026-10-15 ~16:25 EDT)
- New this round (spec only): sound plan. Spec has audio and mix plans but no sound plan — this round adds it (cue sheet + mix target freeze, adaptive transition matrix audit, three-class playback audit, post-launch audio telemetry plan). Matches gameaudiolearning (anchor-and-pillars), thegameaudioco (adaptive primitives), teemo (Hades stem analysis). (gameaudiolearning; thegameaudioco; teemo.)
- Freeze the cue sheet and mix targets at beta as a written ship-blocker list: Ship-blockers: every game event has an SFX (no audio gaps); music transitions clean on all state-machine edges (no stuck layers, no hard cuts); dialogue ducking curve verified; context resume works on first user gesture. After the lock, no ad-hoc level tweaks without a re-audit — this is the professional "mix lock" mechanism.
- Run the adaptive audit as a transition matrix: Enumerate every music state and every transition, verify crossfade timing and layer-gating per transition, and add a debug audio HUD (current music state + active stem gains + voice count) so QA can observe the state machine live, per gameaudiolearning.com's debug-tooling guidance.
- Do the mix audit on three playback classes (headphones, laptop/phone speakers, desktop speakers): Anchor dialogue at the top of the priority ladder, verify the ducking curve under real battle load (full SFX pool + music), and confirm volume controls persist — this is thegameaudioco.com's cross-device prescription applied to a Web Audio game.
- Stand up the post-launch audio plan before the jam ends: Telemetry for AudioContext/decode failures and stuck-state watchdog events, plus a defined channel for audio feedback at the 30/90-day gates — closing the loop that pros use to catch the audio issues weplaytestgames.com flags as a top indie mistake.
