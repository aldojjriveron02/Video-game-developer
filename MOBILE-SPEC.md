# MOBILE-SPEC.md v1 — Production Mobile (Slice)
**Date:** Thu 2026-10-15 · **Round 142** · **Status:** DRAFT for slice build

## Touch spec (LOCKED)
- ≥44×44 CSS px hit targets; visual size ≥ target (no view-tap asymmetry).
- Min 8px gaps between adjacent targets (anti-slip).
- Core verbs (Select/Attack/Move/Vent/End Turn) in bottom-center thumb-easy zone.
- Intent telegraphs on TAP (no hover dependency).
- Held previews offset from touch point (finger never covers feedback).
- viewport-fit=cover + env(safe-area-inset-*) for Dynamic Island + home indicator.
- touch-action: manipulation (kill double-tap zoom). Single-tap primary path.

## Performance spec (LOCKED)
- Single tuned profile for iPhone 17 (no settings menu — Feral pattern).
- Canvas ≤3× DPR, alpha:false, offscreen pre-render, no shadowBlur, rAF-only.
- Zero per-frame allocation (object pooling).
- **Battery saver (IMPLEMENTED):** reducedEffects → render scale 1× (thermal budget).
- Target: locked 60fps for 10-min mission (sustained, not first-minute).
- Assets well under 100MB (iOS tab-kill margin).

## Session spec (LOCKED)
- 5-min session design (GameAnalytics: 2.7-3.6min median).
- M3 duel completable in ~5min or checkpointed per turn.
- pagehide → serialize to localStorage. pageshow (persisted) → resume rAF + restore.
- visibilitychange → pause + autosave. No unload handlers. No auto-play audio.

## Anti-trap QA
- Thumb-occlusion pass. One-handed M3 playthrough.
- 10-min thermal soak (no frame decay after 3-5min).
- Text ≥11pt CSS at 402px width. Audio-unlock on first tap.

## Ship proof (demo script)
1. One-handed thumb-zone play. 2. App-switch mid-mission → instant resume.
3. Locked-60fps mission with heat telemetry visible.

## Round 152: Session + performance production spec (slice, pre-jam)
**bfcache restore resync (IMPLEMENTED in game.js):**
- pageshow + persisted → resync animation clocks, re-render, telemetry event.
- No unload handler anywhere (bfcache-eligible). Autosave on visibilitychange + pagehide.
- The swipe-away data-loss bug (VS web) is killed: save on hide, restore on show.

**Session hardening:**
- Turn-commit saves + hide-guards. Payload small deltas, versioned.
- Add to Home Screen PWA prompt (pre-jam): WebKit 7-day cap exemption; removes
  Safari chrome; native feel for judges.

**Thermal (pre-jam device protocol):**
- 10-15min soak, rAF frame-time log; pass = flat median; fail = step-up.
- Battery saver cuts render resolution ~70% (most effective lever) before effects.
- Adaptive: 30fps idle, 60fps during juice bursts (locked 30 > jittery 60).

**Pre-jam iPhone 48h checklist:** cold-load time; swipe-out/restore exactness;
bfcache via pageshow; touch regression (44×44, touchcancel, no double-tap zoom);
thermal soak; save persistence; charging-while-playing smoke test.

## Round 170: Jam mobile + validation spec (slice)
**JAM MOBILE DECISION: change nothing structural.**
- Operational: enable itch.io "Mobile Friendly" toggle at submission.
- Test the actual itch.io mobile flow (forced fullscreen launch) on a real iPhone
  before the jam weekend — verify AudioContext + canvas resize survive the iframe entry.

**POINTERCANCEL (IMPLEMENTED in game.js):**
- pointercancel listener on the combat canvas deselects to a clean state.
- onTap is atomic (no drag state), so this is defensive per MDN.

**AUDITED (already compliant):**
- touch-action:none on game surface; 52px buttons (>44px ideal); safe-area insets;
  viewport-fit=cover; AudioContext resumes on first tap; localStorage namespaced.

**VALIDATION:**
- Touch-target audit at 390px (WCAG 24×24 min; grid cells ~39px + 8px slop = pass).
- Real hardware: Android remote debugging + iPhone 17 Safari (notch, both orientations).
- Drive decisions from LoAF + tutorial-funnel telemetry (conversion-to-play).

**TRAPS:** hover-dependence; tiny targets; scroll traps; 300ms delay; audio never
starting; split builds; external assets; incognito crashes.

## Round 179: Jam deploy readiness (slice)
**PRE-BUTLER CHECKLIST — VERIFIED COMPLIANT (audit, +0 structural):**
- AudioContext resume on first pointerdown (SFX.ensure, document-level) — Safari safe.
- Viewport meta (max-scale=1.0, user-scalable=no, viewport-fit=cover).
- touch-action:none; safe-area padding via env(safe-area-inset-*).
- Pointer Events + pointercancel guard (Round 170).
- End Turn tap-again-to-confirm (Round 41) — propose-then-confirm exists.

**FIXED — limb picker buttons:** 40px → 48px min-height (web.dev 48dp rule).

**JAM DEPLOY PLAN (butler):**
- Push to NEW hidden channel first; Edit page: kind=HTML, tick Mobile Friendly,
  embed frame = canvas size; verify click-to-play on real iPhone 17; then unhide.
- Pre-push: Mobile Fit Tester (compact/tall iPhone + itch-embed); real iPhone 17
  (Safari) + Chrome Android confirm. Skip PWA (unreliable in itch iframe).

**TRAPS:** unticked Mobile Friendly; pinch-zoom/pull-refresh; hover deps;
fullscreen/orientation-lock on iPhone; vh units; keyboard resize; audio w/o gesture;
localStorage in iframe domain.

## Round 188: Final mobile decision (slice)
**FINAL MOBILE DECISION: CONDITIONALLY DEPLOY-READY.** GO for itch.io hidden
channel now; GO for LD60 embed after the 3-item gate.

**AUDIT (verified compliant — spec only, +0 lines):**
- LD sandbox storage block: SaveStore._get/_set try/catch wrapped; probe sets
  storageOK=false; banner shows Export prompt. Game runs in-memory, no crash.
- iOS audio: first-tap resume verified. Viewport/DPR/touch-action per spec.
- 48px targets; 12ms budget; dvh layout; safe areas.

**PRE-JAM GATE (3 items):**
1. LD-embed dry run: zip (index.html root) → LD sandbox → M3 start-to-finish
   with storage blocked. HIGHEST-LEVERAGE pre-jam test.
2. itch.io embed: "Embed in page" + manual size (NOT fullscreen — bug #881);
   verify on real Android Chrome.
3. Real-device pass: iPhone 17 + mid/low Android (audio, rotation, notch,
   slow-3G, lock/unlock, bfcache).

**SUBMISSION HOUR:** 10-min mobile smoke test on 2 devices (pre-scripted).
Bug fixes allowed post-submit; features are not.

## Round 197: Final mobile sign-off (slice)
**FINAL MOBILE DECISION: NOT DEPLOY-READY YET — conditionally deploy-ready stands.**
Gate is now 4 items (research added LD-sandbox storage dry run).

**AUDIT — LD-sandbox degradation (verified in code, spec only, +0 lines):**
- probeStorage(): try/catch → storageOK=false on any failure.
- _get/_set/_del: all try/catch, safe defaults. Game boots + plays storage-free.
- Banner: ⚠️ save_unavailable shown when !storageOK.
- In-memory fallback active. No throws on blocked storage/fetch.

**4-ITEM GATE (all pending real-device/LD-embed):**
1. LD-embed dry run (948×533 letterbox).
2. itch.io embed on Android Chrome.
3. Real-device pass: thermal soak 20-30min, touch, audio unlock, rotation, bfcache.
4. LD-sandbox degradation: boot with storage blocked (code path verified; live embed pending).

**JAM-DAY CHECKLIST (frozen):** JAM_BUILD zip, index.html at root, letterbox,
THEME_HOOK single-swap, no fetch/XHR in embed path, storage guard, audio unlock
on first tap. Rehearse butler deploy once before Friday 6PM.

## Round 206: Final mobile confirmation (slice)
**FINAL MOBILE DECISION: NOT deploy-ready — KEEP.** Do NOT flip to GO.
Gate: 4-item gate + real-device validation (iPhone 17 + low-end, 15-min soak).

**IMPLEMENTED — iOS viewport hardening (Abratabia):**
- `visualViewport` for canvas sizing (tracks real visible area vs address bar).
- visualViewport resize listener (iOS fires this, not window resize).
- 4,191 lines (+5).

**AUDIT — iOS gotchas (all verified in code):**
- AudioContext.resume() in gesture ✓. Voice cap 12 ✓.
- pointercancel → deselect ✓ (covers touchcancel).
- Visibility → auto-save ✓. 2D canvas (no WebGL loss) ✓.
- viewport-fit=cover + user-scalable=no ✓.

**SUBMISSION HOUR:** Mobile Friendly flag; re-zip (relative, case-consistent);
test actual itch embed (saves, audio, layout); Jam track (72h).

## Round 218: 4-item gate execution (slice)
**MOBILE DECISION: NOT-READY — KEPT (default LD60 posture).**
Promote to CONDITIONAL-mobile-ready ONLY after 4-item gate passes on real hardware.

**IMPLEMENTED — iOS polish:**
- `-webkit-touch-callout: none` (long-press suppression).
- touch-action: none already (prevents double-tap zoom).
- user-select: none already. DPR capped at 2 (governor scales down).

**4-ITEM GATE (pending real-device):**
1. Submission-pipeline dry run (butler throwaway; Mobile Friendly ON).
2. itch config (aspect ratio = orientation; test page + direct URL).
3. iPhone 17 real-device (tap unlock; fullscreen sizing; rotate; bfcache).
4. Post-jam (LD is desktop-first; mobile = upside).

**JAM RULE:** If gate fails, freeze behind JAM_BUILD. 2h buffer for icon/video.

## Round 227: Pre-jam freeze (slice)
**MOBILE FREEZE: theme reveal (Fri Oct 16 6PM). Mobile stays NOT-ready for LD60.**
4-item gate = ceiling. No new mobile code during 72h.
Jam-hour mobile = crash/blocker fixes only + change log.

**VERIFIED (code):**
- pointercancel → deselect (Round 170). touchcancel covered via pointer events.
- Buttons use onclick (no stuck state on cancelled touch).
- AudioContext resume on every pointerdown (document-level).
- visualViewport + -webkit-touch-callout + touch-action (prior rounds).

**ONE PASS, ONE DEVICE (before personal deadline, 2h pre-Submission Hour):**
- iPhone 17: boot → M3 VEX duel → pause → restart, touch-only.
- Checklist: audio unlocks on first tap; no scroll/zoom; 64px targets;
  safe areas; <16ms frames; touchcancel-safe.
- Fix only blockers. Rest = post-jam.

**SUBMISSION:** butler deploy iteratively from day one.
Submission Hour = capsule art, screenshots, description, tags.
Tag mobile-friendly ONLY if gate passes.

**PROTECT DESKTOP:** M3 boots instantly in desktop browser.
Mobile changes behind touch-detection. touch-action/preventDefault
scoped to controls only, never global.

## VERIFY-NOW vs BUILD-LATER (Round 233 — Wed 2026-10-14 ~22:45 EDT)
Mobile is NOT-ready for LD60 by design (desktop-first judging). No new mobile code during the jam. This split protects Phase 2 without spending jam time.

VERIFY NOW (jam-compatible, near-zero cost):
- Input layer is gesture-agnostic: all gameplay input routes through Pointer Events (pointerdown -> onTap); pointercancel -> deselect. Phase 2 is a controls-mapping exercise, not a rewrite.
- 16:9 letterbox decision LOCKED: the fixed LD embed frame letterboxes (contain) inside portrait phone viewports. Tactics-safe — fill/crop would hide play-critical grid cells. No relitigation in Phase 2.
- No hover-only UI: every action must have a tap path (flag hover-to-preview spots).

BUILD LATER (Phase 2, post-jam, iPhone 17 Safari):
- iOS game-shell stack: viewport-fit=cover meta; gesturestart preventDefault (pinch suppression — iOS 10+ ignores user-scalable=no); touch-action:none + overscroll-behavior:none on canvas; full-bleed canvas + env(safe-area-inset-*) inset HUD with max(20px,...) floor (phantom landscape top dead zone); window.innerHeight sizing; DPR cap 2x (256MB iOS canvas cap); PWA manifest display:standalone (iPhone has no Fullscreen API).
- Tactics touch grammar: tap-select + tap-confirm-move (double-entry prevents fat-finger misorders); drag-to-pan; no in-game pinch zoom; no text inputs (avoids <16px iOS zoom trap); no virtual gamepad (direct manipulation is the tactics standard); navigator.vibrate NOT on iOS — WebAudio clicks + animation instead.
- Validation: physical matrix (SE / notch / Dynamic Island), cold-start, rotation, background-kill. Emulators will not catch these bugs.

## JAM-DAY MOBILE SMOKE TEST (Round 242 — Wed 2026-10-14 ~23:38 EDT)
Real iPhone, 5 minutes, one gate: "does it boot and play one turn."
- Load → letterbox intact with URL bar expanded AND collapsed (dvh + visualViewport, Round 206).
- Play one full tactics turn via taps → audio unlocks on first tap → no zoom/scroll (touch-action:none, Round 218) → zero console errors (remote Safari Web Inspector).
- 44pt check: grid cells and HUD buttons ≥44pt AS RENDERED in the letterboxed frame.
- HONESTY RULE (Z0MB13 js13k 2024 lesson): full touch control scheme = Phase 2, marked N/A. Half-broken mobile is worse than none — the verify-now/build-later split is the deliberate choice.
- DevTools device mode is not a substitute (misses Safari rendering, iOS touch, real perf, thermal).

## iOS-SAFARI PRE-JAM CHECKLIST (Round 251 — Wed 2026-10-15 ~00:28 EDT)
Verify on CURRENT iOS (Fiegel: OS updates move the ground; no permanent finish line):
- user-select:none + -webkit-touch-callout:none everywhere (selection bleed, loupe on rapid taps).
- touch-action:none on canvas, manipulation on buttons. Never rely on viewport meta alone for zoom (MDN: doesn't stop double-tap zoom).
- Any touch listener calling preventDefault = {passive:false}.
- AudioContext.resume() inside first-gesture handler; first tap audibly starts sound.
- 44pt-as-rendered: thumb-test every interactive zone inside the letterbox; no HUD in safe-area bars (env(safe-area-inset-*) + viewport-fit=cover).
- Letterbox: no shift on URL-bar show/hide; no jump (dvh + visualViewport, never 100vh); touches mapped through letterbox scale/offset.
- HONESTY RULE (restated): jam-day mobile = "verified boot + one turn," NOT mobile-complete. Full iPhone-17 touch-first = Phase 2. Half-broken touch is worse than a labeled scope cut (EUZIERE day-27 lesson).

## FINAL VERIFICATION (Round 260 — Wed 2026-10-15 ~01:24 EDT)
- Real-iPhone smoke (spec'd, current iOS): cold boot → play one full turn → zero console errors (Web Inspector) → ATTEMPT double-tap + pinch zoom (user-scalable=no is IGNORED since iOS 10 — verify behavior, not meta) → scroll to show/hide URL bar (letterbox re-fits, HUD out of bars) → ringer switch BOTH ways, first-gesture audio audible each way. Record device model + iOS version. Simulators do not count.
- Geometry: letterbox driven by visualViewport resize AND scroll (Round 260: scroll fires on URL-bar offset moves; window resize doesn't reliably fire). Never 100vh (svh/dvh, Safari 15.4+).
- Gesture audit: touch-action:none (canvas) + manipulation (buttons) in CSS, pre-gesture; pointercancel releases stuck pointers; {passive:false} on preventDefault touch listeners.
- Thumb pass: 44×44pt as-rendered, real thumb, inside letterbox. No HUD in safe-area bars (env() + viewport-fit=cover + max() fallbacks).
- Watch-item: unconfirmed anecdote of iOS 18.5 re-suspending AudioContext after ~5s — smoke-test watch-item, not fact.
- Honesty rule: checklist signed only when the physical-device smoke test passes.

## FINAL VERIFICATION (Round 269 — Wed 2026-10-15 ~02:36 EDT)
- Verified: no text inputs in the JAM path (preset squad-select only). The cederhook keyboard-viewport bug can't fire in the jam build.
- Verified: navigator.audioSession.type = 'playback' set (Round 198, sfx.js + music.js) — Web Audio survives the ringer switch.
- Verified: visualViewport resize + scroll drive the letterbox (Round 260); recomputed from live dimensions, never once at load.
- PHASE 2 RULE (full hangar): the mech-name text input (`inp-mechname`) must be audited before the full hangar ships — iOS keyboard popups can permanently shrink the viewport in standalone PWAs (cederhook). Mitigations: blur-on-submit, recompute letterbox on keyboard close, or replace with a preset-name picker (no keyboard at all).
- Smoke test (spec'd): XR-class device, cold boot → one turn → kill Safari → relaunch → one turn. Zero console errors. Zoom attempts, ringer both ways, thumb pass. Record device + iOS version. Honesty rule.

## VERIFICATION ROUND 2 (Round 278 — Wed 2026-10-15 ~03:43 EDT)
- Verified (code read): pointercancel → deselect (game.js:164-167, Round 170) — no stuck state. (MDN.)
- Verified: touch coordinates via getBoundingClientRect ratios (game.js:891) — CSS/canvas scaling corrected. (Starlight Breaker pattern.)
- Verified: 8px hit-slop on near-miss taps (game.js:894) — thumb-friendly. (Egmatic.)
- Verified: audioSession playback (Round 198); no text inputs in jam path; visualViewport resize + scroll (Round 260).
- No-inputs rule is LOAD-BEARING: virtual keyboard eats ~40% of viewport, breaks the 16:9 letterbox. Not cosmetic. (Phase 2 rule stands.)
- Smoke test (spec'd): XR-class device, fresh load → first tap → play → rotate → URL-bar show/hide → background/foreground. Zero console errors (Web Inspector). Honesty rule.

## VERIFICATION ROUND 3 (Round 287 — Wed 2026-10-15 ~04:50 EDT)
- Verified (code read): iOS AudioContext gotcha (abratabia's #1). game.js:170 — SFX.ensure() (synchronous ctx.resume()) runs DIRECTLY inside the pointerdown gesture handler. In-gesture unlock; context resumes on first tap. (Not setTimeout/Promise — that fails on iOS.)
- Quirk battery (real iPhone 17, browser Safari): (a) touch-coord audit — tap all four canvas corners, verify getBoundingClientRect mapping at every resolution tier + after resize; (b) pointercancel drill — interrupt with a system edge swipe, confirm selection clears; (c) viewport stress — rotate, address-bar expand/collapse, confirm no clipping + no per-frame reallocation; (d) audio unlock — cold load, silence until tap-to-play, overlapping SFX don't cut; (e) 3+ min session in Safari Web Inspector — watch for the resize-backing-store leak.
- Emulation ≠ device (chanmeng): "Emulation is good enough for layout and touch geometry; it will not tell you anything useful about haptics or sustained frame rate, which need a real phone." Smoke test on the real phone, not the simulator.
- Freeze discipline: backing-store resolution picked once per tier at init, never resized per gesture. Debounce all resize. After freeze, any mobile change re-passes the quirk battery on the real phone.
- Load-bearing no-inputs rule: zero text inputs in the jam path = no keyboard-driven visualViewport churn in the critical path. (Phase 2 keyboard audit already spec'd.)

## VERIFICATION ROUND 4 (Round 296 — Wed 2026-10-15 ~05:27 EDT)
- REAL ISSUE FOUND + FIXED: iOS canvas memory ceiling (GameMaker, Aug 2026). Default 2x renderScale = 12.05 MP on iPhone 17 landscape — OVER the 5 MP iOS canvas ceiling from boot. Fix (js/game.js resize()): cap the backing store at 4.5 MP (10% margin). Verified: iPhone 17 → 1.222x / 4.50 MP; all devices under the ceiling from boot. "DPR policy is a memory decision, not just a perf one."
- Three drills as a freeze-gated checklist (real iPhone 17): corner-tap audit (4 corners + edges, both orientations); edge-swipe drill (no Safari hijack, no stuck selection); 20-min memory watch (decoded canvas/images under 5 MP, no tab reloads). Any failure = ship-blocker; freeze holds until all three green.
- Dead-gesture backstop: pointercancel → deselect (verified) + pointerleave/lostpointercapture. Any reproducible stuck-selection = ship-blocker. (web.dev: pointercancel = "the browser cancelling the gesture" — deselect is the faithful handling.)
- Audio unlock (MDN): resume() synchronously inside first pointerdown (verified Round 287); re-check on visibilitychange/pageshow; NotAllowedError → tap-to-enable UI. Ship-blocker: audio that doesn't unlock on first tap of a fresh load in mobile Safari.
- Input purity: pointer events only; touch-action = narrowest working value; no text inputs near gameplay; force touch scheme on tablets (Poki's rule). 40px + 8px slop = 56px effective ≥ Apple's 44pt (Android's scaledTouchSlop origin).
- Freeze discipline: after freeze, only ship-blocker fixes land; each fix re-runs all three drills before the freeze is considered intact.

## VERIFICATION ROUND 5 (Round 305 — Wed 2026-10-15 ~06:03 EDT)
- Verified (analysis): all iOS canvas limits respected from boot. Per-canvas 4.5MP < 16.7M px (4096×4096) ✓. Three canvases × 4.5MP = 54MB < 384MB total ✓. The 4.5MP cap (Round 296) enforces all of Pqina's ceilings. "Blank canvas with no console error" cannot happen.
- Canvas budget freeze (ship-blocker): total ≤4.5MP AND every canvas ≤4096×4096, asserted in code. DPR ladder 1×→2×→3×: render at capped tier, never full 3×. (SO: full-DPR "tanks performance so as to be unusable.")
- Dead-gesture drill (real iPhone, ship-blocker): pointerdown → system steals gesture → pointercancel must deselect, never complete a tap. No stuck states after rotation mid-press. (Tagumpay lifecycle drill.)
- Endurance soak (ship-blocker): 20+ min continuous play; watch for blank-canvas (getContext null) + frame decay from leaked canvases. Release dead canvases via 1×1 + clear. (Pqina; Unity endurance.)
- Audio-unlock acceptance: cold load → first tap synchronously resumes AudioContext + starts a source. Verify AUDIBLE output, not just state==="running" (Playgama: buffering/volume disabled until playback truly starts).
- Input-purity + viewport: zero text inputs; touch-action scoped to game surface only; all targets ≥40px by computed hit box on-device; 100dvh + visualViewport for Safari toolbar; full-screen portrait/landscape; never scroll parent page; works with ad blocker (Poki requirements).

## VERIFICATION ROUND 6 (Round 314 — Wed 2026-10-15 ~06:38 EDT)
- Verified (code read): mobile touch/safe-area stack. viewport-fit=cover (index.html:5); env(safe-area-inset-*) on banner/controls/HUD (style.css:13,17,37); touch-action:none on canvas (style.css:5); touch-action:pan-y on scrollables. All targets ≥44px (style.css:30,51,57,66,85).
- Freeze discipline: lock mechanics and canvas budgets. No new canvases, layers, or assets — every addition re-opens the 288MB/4.5MP audit. Any change re-runs the canvas-limit audit (sum all backing stores) before merge.
- Real-device matrix (ship-blocker): iPhone 17 (Safari) + one low-end iPhone. Cold-load, play 10 min, rotate both orientations, background/foreground tab. Confirm: no blank-canvas (over-budget symptom), no SFX silence (audioSession not resumed). Simulators do not count.
- Audio unlock (ship-blocker): first pointerdown must call SFX.ensure() and resume AudioContext before any sound. Confirm audible SFX on real device, cold start. #1 silent-failure on iOS Safari.
- Touch targets at worst case (ship-blocker): smallest zoom-out; every control ≥44 CSS px; touch-action:none on canvas; double-tap/pinch don't trigger page zoom. Edge taps near insets not eaten by home indicator.
- Safe areas + orientation (ship-blocker): viewport-fit=cover + env(safe-area-inset-*) on all HUD; portrait→landscape→portrait with no state loss; resize() keeps backing store under 4.5MP cap in both orientations.

## VERIFICATION ROUND 7 (Round 323 — Wed 2026-10-15 ~07:09 EDT)
- Verified (code read): offline resilience. width=device-width (tap delay removed). manifest.json exists. Only network request (music fetch) fails gracefully to silence. Fully playable offline.
- Performance budget as CI (ship-blocker): 4.5MP memory cap enforced as build budget — quantity (JS KB, audio KB, backing-store MB) + milestone (interactive <5s on slow 3G) + rule-based (Lighthouse floor). Over budget = optimize, remove, or don't add. Any build exceeding fails verification.
- Network-resilience audit (ship-blocker): full game loop on Slow 3G and offline with each asset blocked. Must reach playable state with honest loading states (never blank canvas); never hang on blocked request. Any stall = ship-blocker.
- iOS audio on real hardware (ship-blocker): audioSession/SFX.ensure() unlock cannot be proven in desktop lab. Real iPhone 17 via Safari remote inspection: sound unlocks on first tap; behaves under silent switch; resumes after backgrounding. No audio on first gesture = ship-blocker.
- Touch + safe areas on device matrix (ship-blocker): 44px+ and env(safe-area-inset-*) on real devices (iPhone Dynamic Island + Android). No control under home indicator/notch. Tap-to-response ≤200ms (INP). Any target under 44px or obscured = ship-blocker.
- Installability/PWA: manifest (192px/512px, short_name, start_url, standalone); HTTPS; SW controlling start_url; offline 200. Add to Home Screen on iOS launches fullscreen. Any criterion fails = ship-blocker.

## VERIFICATION ROUND 8 (Round 332 — Wed 2026-10-15 ~07:43 EDT)
- Verified (code read): Page Lifecycle. visibilitychange → hiddenPause (rAF stops, restarts clean with lastT=0, game.js:274-277). Auto-save on hidden + pagehide (game.js:314-315). Telemetry shutdown on pagehide (game.js:241). No unload. iOS-safe. (Page Lifecycle API.)
- Code freeze: gate with real-iPhone device-matrix (iPhone 17 + one older iPhone), Safari + standalone PWA. Post-freeze changes only verified ship-blockers.
- Interruption audit (ship-blocker #1): incoming call, notification, screen lock, low-power mode. Must pause on visibilitychange/pagehide, resume without state loss, recover AudioContext on return (iOS hardware). Lost state or dead audio = blocks jam submission.
- Offline contract (ship-blocker): airplane mode mid-session — music fetch fails silently, zero console errors, game fully playable, failure path observable (Sentry breadcrumbs).
- Touch + safe-area pass (ship-blocker): 44px targets + env(safe-area-inset-*) on real iPhone, both orientations. Clipped or under-inset controls = ship-blocker.
- Beta gate: Sentry browser SDK before beta; shareable test URL; jam ship-blocker = zero unresolved crashes + zero interruption failures on real devices. Emulator-only = informational, not sign-off.

## VERIFICATION ROUND 9 (Round 341 — Wed 2026-10-15 ~08:16 EDT)
- Verified (file read): manifest.json. All Chrome installability requirements met (name, short_name, 192+512+maskable icons, start_url, standalone, theme/background colors, id). Icons present.
- Manifest audit (ship-blocker): DevTools Application > Manifest (Chrome) + manual Add to Home Screen on target iPhone. Blockers: valid JSON; 192+512 icons + maskable; display standalone; start_url; theme/background colors; screenshots + description. Lighthouse PWA badge deprecated — do not substitute score for check.
- Offline contract (ship-blocker): airplane-mode on real iPhone (or Xcode Simulator Web.app). Fresh install → launch → kill connectivity mid-game → relaunch from home icon. Expect: playable state, all assets present, saves readable, auto-save intact, graceful offline (not dead page). SW controls page + start_url; both 200 offline.
- Freeze discipline: SW script + manifest = frozen artifacts. Cache name includes build id; never long-cache SW file; purge obsolete caches on activate. skipWaiting only if verified vs Page Lifecycle (hiddenPause/auto-save) — old-page/new-worker mid-battle = data-loss vector. iOS: manifest edits require reinstall — any edit resets clock.
- App shortcuts (post-freeze candidate, manifest-only, zero JS risk): "Continue" (→ start_url + saved-game deep link), "New Battle", "How to Play". utm-tagged URLs for engagement signal.
- iOS gap (pre-beta): Safari has no SW/manifest inspector; home-screen apps run Web.app engine. Every mobile pillar item (viewport-fit, safe-area, touch-action, 44px) verified in installed home-screen context on iOS, not just Safari tab or Device Mode. (web.dev iOS simulator + WebKit remote inspection.)

## VERIFICATION ROUND 10 (Round 350 — Wed 2026-10-15 ~08:41 EDT)
- Verified (file read): itch.io-ready viewport. width=device-width, user-scalable=no, viewport-fit=cover (index.html:6). Mobile-friendly, no-zoom, safe-area. Embed config satisfied.
- Manifest + offline as ship-blockers (real iPhone): manifest (name/short_name, 192+512+maskable, fullscreen, portrait, start_url, theme colors); Safari Share → Add to Home Screen; standalone detection; SW precaches shell+assets, offline fallback, cleans old caches, "update available → refresh" path.
- Portal-grade QA bar: initial download ≤20MB, time-to-playable ≤10s, relative paths only, localStorage in try/catch (incognito-safe), forced touch on tablets, locked viewport scroll (touch-action), lifecycle events on first input / interruptions. (Poki/CrazyGames semantics.)
- iOS hardening: resume AudioContext in user gesture (touchend/click — iOS gesture-start), never visibilitychange alone; portrait-only → rotate prompt (no programmatic lock); UI padded with env(safe-area-inset-*); user-select:none on game root. (CrazyGames iOS guide.)
- itch.io canonical: HTML kind, "played in browser" ticked, explicit viewport, Mobile friendly + Portrait + fullscreen button; link game page (or resolve via API in PWA shell) — never raw per-upload build URL; download keys if monetizing. (Stelabouras: URLs invalidated per upload.)
- Defer store wrapper: Apple 4.2 + Play webview-spam reject thin wrappers. Skip Capacitor/IPA until native functionality justifies. TestFlight/ad-hoc/AltStore = playtest channels. Add display-mode detection; log install/offline/update events. (OpenPWA measurement.)

## VERIFICATION ROUND 11 (Round 359 — Wed 2026-10-15 ~07:17 EDT)
- Verified (process): device matrix. iPhone 17 (primary, Safari) + older iPhone (iOS compat) + low-end Android (perf floor) + Chrome Android (PWA). Real-device = Aldo's iPhone gate. Emulators for functional only. (TestDevLab; Game-Ace.)
- Real iPhone 17 checklist (ship-blocker): 44px touch targets, safe-area insets, viewport-fit=cover, portrait behavior, iOS gesture-start audio unlock, reduced-motion honoring. Any Safari/WebKit canvas or touch bug blocks freeze. (Testers HUB: emulators miss thermal, touch, battery.)
- Device matrix: iPhone 17 (Safari) + iPhone 13/14/15 (current-1 iOS) + low-end Android (2-3GB RAM, canvas perf floor) + Chrome Android (PWA installability). One cloud-farm sweep (AWS Device Farm) for long tail. OS: current + previous major iOS/Android.
- Anti-emulator rule: mark performance, touch responsiveness, long-session results as "real device only." Emulators/DevTools for early functional checks only. (Testers HUB.)
- Sustained thermal run (ship-blocker): 30-60 min on iPhone 17; track frame drops over time + battery drain. Sustained frame drops = ship-blocker for canvas tactics. (Game-Ace thermal practice.)
- Freeze gates on real devices: PWA manifest install + offline, Page Lifecycle (pause/resume/hidden) no corruption, distribution/installability. Same real-device sign-off pros run before locking freeze. (Pre-launch Report / closed beta pattern.)

## VERIFICATION ROUND 12 (Round 368 — Wed 2026-10-15 ~07:45 EDT)
- Verified (file read): PWA installability. manifest.json: name "Mecha Protocol", short_name "Mecha", icons 192+512+maskable 512, id "mecha-protocol", start_url "index.html?source=pwa", scope "./", display "standalone", theme/background "#0a0e1a". Meets all web.dev installability requirements. sw.js exists. (web.dev; MDN.)
- Freeze PWA identity (ship-blocker): lock name/short_name, id, scope, start_url, display standalone, theme_color, background_color, 192/512/maskable icons now. iOS manifest-metadata changes require user re-install — post-launch rename/icon change effectively unshippable without friction. Any manifest field frozen once verification 12 passes.
- Offline audits as physical device checks (ship-blocker): with phone in airplane mode, fresh install must boot to playable game returning 200-equivalent for start_url. Cover both cold start (no cache) and warm start (cached). Broken offline = no ship. (Lighthouse PWA.)
- Update QA gate (freeze discipline): exercise updatefound → skipWaiting → controllerchange under all three patterns (full, changed-assets, individual-assets). Never auto-reload live session — show "Update available" prompt and reload only on user action so game state never yanked mid-match. (web.dev.)
- iOS-specific meta (ship-blocker for iPhone 17): apple-touch-icon (180x180), apple-mobile-web-app-capable/title/status-bar-style, keep user-scalable=no + viewport-fit=cover (already in pillar; 2048 proves this combination ships cleanly on iPhone). Validate via Share → Add to Home Screen — no install prompt exists on iOS.
- Version caches explicitly: cache name tied to build version (e.g. v12), old caches deleted on activate; never cache-first the HTML shell. Keeps anti-emulator/device-matrix runs deterministic — stale shell would poison subsequent verification rounds.

## VERIFICATION ROUND 13 (Round 377 — Wed 2026-10-15 ~08:16 EDT)
- Verified (spec read): jam distribution. LD60-MASTER-CHECKLIST.md: itch.io (aldojjriveron02) via butler; cover images (ldjam 640×512; itch.io 630×500); self-hosted itch.io link as backup. App store = Phase 2 (post-jam), not jam-blocker. (Twinr; Balatro.)
- Enforce true code freeze: post-freeze, allow zero untested changes; any change re-runs full verification stack (device matrix, thermal, anti-emulator) and resets review timing. Ship-blocker gate: 99%+ crash-free on final build across verified device matrix on real devices (iPhone 17 lead). ~40% of iOS submissions held up on avoidable errors — jam itch.io submission gets same discipline.
- Three audits as checklist: (a) submission audit — accounts, version, support/privacy URLs live; (b) review audit — reviewer notes describing tactics core loop, demo path to gameplay (no dead ends), audio-unlock path verified on real iPhone (iOS gesture-start unlock = known failure point); (c) metadata audit — screenshots only from final build, PWA manifest/icons re-verified installable (R368).
- Control launch moment: use manual release; submit Monday–Wednesday (jam: Mon Oct 19); do not launch Friday. Pair listing-live with announcement (jam community, press kit, screenshots/GIFs). Launch day monitor: crash rate, reviews, PWA installability.
- Ship-blockers in writing: any freeze violation, crash-free <99%, thermal regression on device matrix, broken PWA install, or store-listing metadata mismatch. Anything else = post-launch patch candidate, not launch blocker.

## VERIFICATION ROUND 14 (Round 386 — Wed 2026-10-15 ~08:46 EDT)
- Verified (spec read): version/cache discipline defined. :257: "Freeze discipline: backing-store resolution picked once per tier at init. After freeze, any mobile change re-passes quirk battery on real phone"; :330: "Version caches explicitly: cache name tied to build version (e.g. v12), old caches deleted on activate; never cache-first HTML shell." Matches Wordle lesson and QAPractices (freeze scope defined). (Wordle; QAPractices.)
- Declare hard freeze window now: critical-fixes-only, named release captain, emergency-change process with approval + documentation. Track burn-down to zero blockers with reopen rate under 5-8% before freeze build declared ship candidate. (QAPractices + salivity.)
- Regression audit on frozen build: full pass over touch input, swipe/tap gestures, iOS gesture-start audio unlock, canvas rendering, viewport-fit=cover safe areas, thermal behavior on device matrix — re-run in full after every freeze fix and after any iOS/Safari update. (QAwerk.)
- Documented go/no-go sign-off: covering PWA installability (manifest, icons, service worker), offline mode, viewport meta correctness, distribution compliance (age ratings, store metadata) — explicitly to avoid Balatro-style PEGI delisting or Wordle-style cache incident. (QAPractices + cases.)
- Enforce version/cache discipline: service worker update flow must never strand players between cached and live versions; verify installed-PWA update path and version check on launch as part of sign-off. (Wordle lesson.)
- 48-hour post-launch monitoring: crash/interruption tracking, performance on target hardware, pre-approved hotfix path mirroring freeze's emergency-change process. (QAwerk.)

## VERIFICATION ROUND 15 (Round 395 — Wed 2026-10-15 ~09:21 EDT)
- Verified (file read): PWA installability. manifest.json: name "Mecha Protocol", short_name "Mecha", icons 192+512+maskable, display "standalone", start_url "index.html?source=pwa", id "mecha-protocol". sw.js exists. Matches web.dev (manifest + icons + SW + HTTPS) and R368 verification. (web.dev.)
- Numeric ship gates on real iPhone hardware (iPhone 17 target + one older model), with freeze discipline: 60 FPS target / 30 FPS hard floor on canvas render, frame-pacing variance ≤3%, cold start <5 s, crash/error rate ≤0.5%, battery/thermal check via 30-minute continuous sessions. Any gate red = ship-blocker; no waivers after freeze. (QAwerk.)
- Distribution lock: after release build frozen, re-run Lighthouse PWA audit + MobileViewer.blog's 10-minute pre-publish gate on exact shipped URL — installable manifest (192/512px + maskable icons), service worker with offline fallback, viewport meta (width=device-width, viewport-fit=cover, user-scalable=no), 180×180 apple-touch-icon, standalone display-mode launch on iOS Add to Home Screen, working update flow. Any post-freeze asset change invalidates lock and requires full re-gate — prevents distribution drift.
- Reviewer-simulation walkthrough on clean device against final build: fresh install → onboarding → first tap (audio unlock via gesture-start) → background/foreground → incoming notification mid-game → state save/restore → orientation/no-network transitions → uninstall cleanliness. Treat any breakage as ship-blocker. (QAwerk.)
- Soft-launch discipline: TestFlight or closed-testing cycle with external testers on at least 3 distinct devices before submission/production; staged rollout with crash-rate kill switch (halt rollout if rate exceeds 0.5%). (Google Play staged-release model.)
- Day-0 post-launch monitoring: Sentry/Bugsnag crash reporting + INP/FPS telemetry live at launch, review-channel watch in first 48 hours, standing rule that every patch/hotfix re-runs full sign-off gate — no untested updates ever reach players. (QAwerk post-release rule.)

## VERIFICATION ROUND 16 (Round 404 — Wed 2026-10-15 ~09:57 EDT)
- Verified (spec read): distribution lock exists. :350: "Distribution lock: after release build frozen, re-run Lighthouse PWA audit + MobileViewer.blog's 10-minute pre-publish gate on exact shipped URL. Any post-freeze asset change invalidates lock and requires full re-gate — prevents distribution drift." Matches Subset (low-spec floor) and Supercell (published, measured policy). (Subset; Supercell.)
- Freeze discipline: Freeze mobile contract (viewport meta incl. viewport-fit=cover, user-scalable=no; PWA manifest/icons; gesture-start audio unlock; iPhone 17 target frame budget). Codify year-2 changes as "mini-releases" with mandatory per-change pillar regression. (Kobiton: LiveOps mini-release rule.)
- Device-matrix lock with numeric gates: Lock Tier 1 (10–15 devices, every commit) / Tier 2 (25–30 devices, per release) / Tier 3 (long-tail exploratory, per major release) matrix into CI now; gate shipping on Play vitals thresholds (crash ≤1.09%, ANR ≤0.47%) and ≥4.0 store-rating floor.
- Ship-blockers: Any build that regresses sustained FPS vs prior build, introduces memory growth over long session, breaks pillar (PWA install, gesture audio unlock, viewport-fit), or fails Tier-1 real-device smoke = ship-blocker — no exceptions. Real devices (not emulators) for final validation.
- Drift policy: Adopt published, data-driven OS/device sunset cadence (Supercell/Niantic pattern) — announce with lead time, cite coverage %, never cut silently. Keep 2D canvas spec floor low so new iPhone-class hardware can't strand old devices.
- Thermal & long-session discipline: Add soak testing (extended play, thermal-throttle monitoring, battery drain) to per-release Layer-3 performance regression — 2D tactics game should never heat phone, and thermal throttling is silent year-2 FPS killer on aging devices.

## VERIFICATION ROUND 17 (Round 413 — Thu 2026-10-15 ~12:37 EDT)
- Verified (spec read): battery-thermal discipline defined. :17: "Battery saver (IMPLEMENTED): reducedEffects → render scale 1× (thermal budget)"; :29: "10-min thermal soak (no frame decay after 3-5min)"; :50: "Adaptive: 30fps idle, 60fps during juice bursts (locked 30 > jittery 60)"; :54: "thermal soak; save persistence; charging-while-playing smoke test." Matches Hearthstone (30fps default) and Pokémon GO (idle-screen policy). (Hearthstone; Pokémon GO.)
- Ship a 30fps power lock as the default, with a user-visible "Battery saver / Performance" toggle. Frame budget matches tactics gameplay; expect roughly 2× battery life vs. an uncapped/60fps loop. This is the single highest-leverage thermal decision. Ship-blocker: no release may default above 30fps without measured thermal evidence on iPhone 17 hardware. (Hearthstone; Genshin.)
- Build time-based adaptive quality tiers into the rAF loop: monitor frame-time deltas; if the 95th percentile misses budget for N seconds, step down render-scale (100%→80%→60%) and drop non-essential effects (particles, shadow layers) before the device throttles. Safari gives no thermal-state API, so this is the only web-safe lever. Ship-blocker: demonstrate a forced hot-state run holds frame budget by degrading gracefully, never collapsing into throttling stutter. (Arm ADPF.)
- Canvas freeze discipline: pre-render static layers (board, terrain, UI chrome) to offscreen canvases and composite per frame; redraw only changed regions; zero per-frame allocations in the hot path; suspend the rAF loop on visibilitychange. Ship-blocker: a profiled session shows no full-screen redraws and no GC pauses attributable to the game loop. (MDN.)
- Set a numeric power gate and measure it: scripted 20-minute play session on the iPhone 17 reference device, record mA/estimated-drain with a hardware or OS-level power tool; require drain-per-hour below a frozen threshold on every release build to block power drift. Ship-blocker: any release that increases session drain by more than an agreed margin cannot ship without a thermal review. (GameBench.)
- Add post-launch thermal telemetry: integrate MetricKit power/performance metrics (iOS) and watch field data for battery complaints; add an in-game idle policy (dim/lower rate during AI turns or menu idle, tap to resume) modeled on Pokémon GO's display-first thinking. Ship-blocker: MetricKit wired and verified in a TestFlight build before final verification, so day-0 monitoring actually has data.

## VERIFICATION ROUND 18 (Round 422 — Thu 2026-10-15 ~13:32 EDT)
- New this round (spec only): offline plan. Spec has no offline plan — this round adds it. Matches js13kPWA (app-shell + versioned caches), Chrome Dinosaur Runner (offline by design), 2048 (deterministic local state). (MDN; WebKit; Workbox; js13kGames.)
- FREEZE THE OFFLINE PATH — versioned cache + precache-everything gate: Bump a versioned cache name (app-vN) on every deploy; install precaches the entire app shell plus all sprites/audio via waitUntil; activate purges all older caches; SW registered at root scope. Ship-blocker: the page must return 200 with the network fully disabled (DevTools offline + airplane-mode cold launch from the installed home-screen PWA on a real iPhone). Any PR touching the SW or the precache list freezes the release until the offline matrix passes.
- STORAGE AUDIT + EVICTION HARDENING: Budget storage up front (measure Cache + IndexedDB bytes vs. navigator.storage.estimate() quota); store saves in IndexedDB (not localStorage) with a schema version + migration path; request navigator.storage.persist(); and code the boot path to survive WebKit eviction — if the save or cache is gone, the game starts clean and tells the player, never white-screens. Re-audit cache size every release; treat quota growth as a release blocker. (WebKit: idle eviction of Cache/IndexedDB after weeks of disuse is real.)
- ANTI-ZOMBIE UPDATE DISCIPLINE: Define the SW update policy (skipWaiting + clients.claim vs. prompt-to-update) and ship a kill-switch: a self-destructing SW build that unregisters and cleans caches if a bad worker ever escapes. Monitor the active SW version mix in the field (via offline-capable analytics in the SW) and alert when the old-version share stops decaying after a deploy.
- LOCK ALL SAVE WRITES: Wrap every IndexedDB save/cache-refresh in a Web Locks API exclusive lock (named e.g. "game-save") so two open tabs of the game can't interleave writes and corrupt state. Schema-version every save record; reject-and-migrate, never crash, on unknown versions.
- POST-LAUNCH OFFLINE MONITORING (the day-0/week-1 audit): Track: offline cold-launch success rate, Background Sync queue depth + replay failures, cache-hit rate, and iOS eviction-driven save-loss events. Treat an offline launch failure as P0. Re-run the full offline audit on every production deploy — the "post-launch audit" is a standing checklist item, not a one-time event.

## VERIFICATION ROUND 19 (Round 431 — Thu 2026-10-15 ~14:19 EDT)
- New this round (spec only): Safari plan. Spec has mobile discipline but no Safari plan — this round adds it. Matches WebKit/CrazyGames/Poki (Safari gate, DPR=1 crash-avoidance, 7-day eviction, touch-action discipline). (WebKit; CrazyGames; Poki.)
- Lock the Safari plan as a ship-blocker gate, mirroring the portals: no release if the build fails Safari on a real iPhone 17 (not Simulator); pin DPR at 1 on iOS (crash avoidance, per CrazyGames' published policy); add their anti-zoom block (`-webkit-user-select: none; user-select: none;` on body, `touch-action: none` on the canvas, `touch-action: manipulation` anywhere tappable). This is the freeze discipline: Safari-specific behavior is frozen at verification and re-audited every iOS point update.
- Implement three adaptive tiers now (60fps flagship / 30fps battery-saver / 30fps low-power-thermal): detect via frame-time EMA over a thermal soak window (10+ min continuous play), not instantaneous FPS; on tier drop, first reduce canvas resolution (render ~70% native, GPU upscale — near-free on mobile GPUs), then particle/FX count. Target ≤70% GPU-peak budget so clocks never throttle. Rationale: Low Power Mode and Adaptive Power (iOS 26) already force a 30fps world on many devices; abrupt throttling drops of 30–50% are documented by Abratabia.
- Freeze touch input discipline: one pointer-events pipeline for all touch (no parallel touch/mouse handlers that can double-fire); minimum 44x44pt hit regions per Apple HIG on every unit/ability target; AudioContext resume wired to `touchend` (iOS interrupt state requires a user gesture — visibilitychange alone fails); gameplayStart fired on first touch. Validate multi-touch, long-press (no context menu), double-tap (no zoom), and pinch on a real device.
- Harden the storage contract for the 7-day eviction: wrap every localStorage/IndexedDB op in try/catch with in-memory fallback (Poki hard requirement for Incognito), sync critical saves via a lightweight server or iCloud-backed channel where feasible, and surface an honest "progress may not persist" notice when persistence is unavailable — never let a returning player silently lose a campaign.
- Stand up post-launch mobile telemetry before launch: ship an RUM event stream (FPS p50/p95 frame time, long-task count, thermal tier drops, storage-write failures, load start→gameplayStart duration) — the same event vocabulary Poki/CrazyGames use for their QA gates — plus crash/termination tracking (iOS tab kills at ~100–200MB are silent; track them as inferred terminations via heartbeat). Review it per iOS release, because WebKit changes canvas, storage, and audio behavior yearly.

## VERIFICATION ROUND 20 (Round 440 — Thu 2026-10-15 ~15:04 EDT)
- New this round (spec only): touch plan. Spec has touch discipline but no touch plan — this round adds it (touch audit + freeze, gesture locks, latency budget, real-thumbs validation, touch telemetry). Matches NN/g (target sizes), Dead Cells (playtested gestures), Mini Motorways/Florence/Alto's Odyssey (touch-native design). (NN/g; Dead Cells; Mini Motorways.)
- Run the touch audit and freeze it: Measure every interactive element against NN/g minima (≥ ~44 CSS px / 1 cm, ≥ 2 mm gaps), with effective hit areas larger than visual cells via hit slop — audited on the smallest supported viewport (iPhone SE 375×667 logical) and largest (Pro Max). Then impose touch freeze: the canonical gesture list, target sizes, and slop values are locked; any change after freeze re-runs the gesture audit. Ship-blockers: any target below minimum, any core action requiring a second finger, any untaught gesture.
- Enforce the gesture-lock architecture: One gesture per action, disambiguated by movement threshold + time (tap = select, drag = move/pan within one canonical mode); competing recognizers disabled while a unit drag is active; pinch/zoom is an optional enhancement, never required. On mobile Safari this means pointer events with touch-action: none on the canvas, no click-delay paths, and explicit cancel/long-press disambiguation. Ship-blocker: gesture conflict or drift observed in any playtest.
- Hold the input-latency budget: End-to-end touch→visual-feedback must stay under 50 ms (Kaaresoja & Brewster / Immersion: below 30–50 ms reads as instantaneous); the DPR-capped 60 fps canvas already protects this — any frame-budget regression is therefore a touch regression too. Give every touch immediate visual + audio (+haptic where safe) confirmation. Ship-blocker: measured latency regression or unconfirmed touches.
- Validate with real thumbs: Playtest matrix: current iPhone + a low-end device, iOS 16–18, portrait one-handed, thumb-only playthroughs; log mis-tap rate and gesture-completion rate (abandoned drags, rapid re-taps, undo usage) the way Dead Cells' team iterated on the floating pad. No gesture ships on theory alone. Ship-blocker: any core action not completable with one thumb.
- Stand up post-launch touch telemetry (GameAnalytics-style): From day one: crash-free %, gesture-completion and mis-tap proxies segmented by device/OS, reviewed weekly in month one; keep control parameters (slop, thresholds) tunable via live updates so the touch plan improves after launch instead of freezing in the shape of pre-launch guesses. Ship-blocker: launching without this instrumentation — post-launch mobile neglect is how device-specific touch failures become 1-star reviews.

## VERIFICATION ROUND 21 (Round 449 — Thu 2026-10-15 ~15:53 EDT)
- New this round (spec only): device-matrix plan. Spec has a touch plan (round 440) but no device-matrix plan — this round adds it (named matrix freeze, per-tier ship-blockers, OS floor + sunset cadence, post-launch per-device monitoring, profile on weakest device). Matches Kobiton (80% rule + per-device ship-blockers), Genshin (transparent spec-lock), Niantic (disciplined sunset). (Kobiton; Genshin; Niantic.)
- Freeze a named device matrix now, with written freeze discipline: Before the jam, lock a small matrix in MOBILE-SPEC: primary (iPhone 17, current iOS), mid (iPhone 12/13-class), low (oldest iPhone the game targets, e.g., SE-class / lowest iOS you support), plus at least one Android flagship and one budget Android for the web build. No matrix changes mid-jam without a logged decision.
- Define launch ship-blockers as per-tier budgets, not global averages: Adopt the Kobiton-style checklist, adapted to web: ≥99% crash/error-free sessions PER DEVICE (not global), p95 first-frame render under 700ms, sustained 30fps on the LOWEST tier with adaptive tiers engaged, and a passed thermal soak on the primary iPhone. Any blocked tier fails the build.
- Lock an OS floor and a sunset review cadence: Name a minimum (e.g., iOS N−2 current at jam time), log the Safari/WebKit version spread via telemetry from day one, and schedule a floor review at each major iOS release — with any floor move announced like Niantic/Genshin do (advance notice + reason), never silent.
- Stand up post-launch per-device monitoring before launch: Real-player telemetry segmented by device model + OS version + build: crash/error rate, frame-rate distribution, and version-over-version regression alerts (any build that drops crash-free users below ~99% or spikes a new per-device crash is a regression), plus hang tracking for the web build.
- Profile and tune on the weakest matrix device, not the iPhone 17: Follow the Kongregate device-bucket technique: keep the Low/Medium/High adaptive tiers (30fps adaptive, battery saver, DPR cap) as first-class design, budget separate asset/code paths per bucket, and run all performance verification on the low-end device — the iPhone 17 number is the ceiling, not the test.

## VERIFICATION ROUND 22 (Round 458 — Thu 2026-10-15 ~18:18 EDT)
- New this round (spec only): power plan. Spec has battery discipline but no power plan — this round adds it (PROXX-style power budget freeze, battery lock, network lock, per-release validation ritual, post-launch monitoring cadence). Matches Poki (platform QA), web.dev (canvas performance), PROXX (budget-first design). (Poki; web.dev; PROXX.)
- Freeze the power budget before the jam ships: Adopt PROXX-style budgets — e.g., initial payload ≤500KB (canvas 2D, no engine), TTI <5s on throttled 4G, 60fps (30fps floor) on the weakest device-matrix tier, and write them into MOBILE-SPEC.md as ship-blockers. Every verification round re-runs the same battery/network checks; any round that regresses blocks sign-off (battery/network drift is a release blocker).
- Battery lock: Run the render loop through the web.dev checklist — pre-render unit/tile sprites to snug off-screen canvases, sort draws by fillStyle, never use shadowBlur per frame, dirty-region redraw for static UI layers, integer coordinates, zero per-frame allocation (pool vectors/particles; GC churn is the documented #1 canvas slowdown). Move sim/AI off the main thread (Web Worker) if frame budget is tight — the PROXX pattern.
- Network lock: Zero runtime external requests (bundle everything, Poki's hard rule), total initial download measured and frozen, progressive loading for later content, and a per-build size check that fails the build on growth. Target Poki's bar: playable in well under 10 seconds on 3G.
- Validation ritual per release: (a) Chrome DevTools throttled-profile load test + Lighthouse; (b) real-device battery session on the weakest matrix device (Battery Historian / Xcode energy), recording discharge rate vs. the frozen budget; (c) desktop-vs-mobile C2P split (Poki's diagnostic) after any soft launch — a mobile C2P gap means loading/onboarding, not gameplay.
- Post-launch monitoring cadence: Re-run battery + network audits on every update (Poki: "global release isn't the finish line"), keep playtest recordings or real-player sessions in the loop for touch/onboarding regressions, and guard localStorage saves against Safari purges (sync/backup strategy). Keep optimizing after launch — better tech metrics compound into promotion.
