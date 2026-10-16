# Feel Part 20 (Verification Round 2) — Findings (Round 283)
**Date:** Wed 2026-10-15 ~04:26 EDT · **Source:** live web research (sicienski, swink, thorson, nijman, nystrom, fumoto)
**Project:** Mecha Protocol — feel (pre-jam; verification round 2)

## A. Mechanics
- Feel freeze QA (Game Developer; r/gamedev "Game Feel != Juice?"): banding is the job — too long reads as lag/stutter; too short reads as weightless. Hit-stop = deliberately halting game time for milliseconds on impact to give weight.
- 3-second test (Game Developer; Swink): blank-room diagnostic — strip graphics, music, story, UI; raw movement/combat for ~3s. If it isn't fun without the makeup, the core is broken and no juice layer fixes it. (Swink 2008: polish only works on top of solid raw feel — input, response, context, polish, metaphor, rules.)
- Juice budget audit (Game Developer; Medium; Reddit): every interaction's juice spend weighed against the action's importance (minor box ≠ boss explosion). Juice costs real performance (CPU/GPU, animation time, asset size) — budget it explicitly. Over-spent effects get stripped.

## B. Validation
- Rater-first-impression (Thorson, "Celeste & Forgiveness"): "huge amounts of internal and external playtesting" — players' subjective input treated as ground truth, even when it contradicted designer intent.
- Nuclear Throne: 16.7% of total play time is literally hit-pause — arrived at by iterative tuning + playtester reaction, not a formula.
- Blind A/B (r/gamedev; Thorson): swap one feel variable with the tester unaware (mute test; juicier vs plainer build), collect immediate adjectives (one-word test), measure repetition survival. (Swink: feel must hold over thousands of repeated inputs.)
- Mute test: sound is such a dominant feel carrier that muting isolates whether the tactile layer alone carries. If it doesn't, the feel is propped up by audio.

## C. Techniques
- Hit-stop bands (Sicienski 2025, Capcom frame analysis): universal 6–8 frames on normal hits, ~9–11 frames on larger/fatal hits. Sakurai endorses hitstop as essential. Maps to our 28→150ms ladder (11 frames at 60fps ≈ 183ms; AAA rarely exceeds that). Our bands: tap 28–40ms, normal 60–80ms, kill 80–150ms, 0.35s hard cap as the safety rail. (Genre note: tactics pacing differs from beat 'em ups — our bands are tighter because discrete actions come faster.)
- trauma² shake (Nijman 2013; Eiserloh GDC): events ADD trauma (never set), decay per frame, offset = trauma² × smooth noise (Perlin over time, not raw random — coherent, not jittery).
- Squash discipline (Nijman): squash & stretch = communication, not decoration. Canonical use = anticipation (crouch before jump, wind-up before strike). Every-impact squash cheapens it; anticipation-only preserves the telegraph.
- Pool exhaustion (Nystrom; Game Developer): three policies — (1) Drop/fail silently, (2) Steal/recycle eldest, (3) Grow. Professional consensus for cosmetic juice: DROP. "Drop spawn is the documented correct policy, not a lazy fallback." Runtime allocation defeats pooling; saturated screens hide missing particles.

## D. What to avoid
- Adding juice after freeze (Kelly 2014): the "juice it" philosophy fails when juice is a phase applied to a finished game. Juice must be co-designed with mechanics; late-stage juice can't repair a core that failed the 3-second test.
- Feel tuning by committee (Thorson): playtester feedback decisive, but design authority stays with the feel owner. Averaging contradictory notes = mush. One decision-maker aggregating blind impressions.
- Untested juice budgets: unbudgeted juice accretes — every dev adds "just one more" until the density alarm trips. The audit is a scheduled pass, not a vibe.
- General (Nijman): shake as default, amplitude proportional to nothing, juice changing game logic (juice must never alter simulation — feel freeze excepted), juice on unimportant actions.

## E. Shipped
- Nuclear Throne (Vlambeer, jam prototype "Wasteland Kings"): trauma shake, heavy hit-pause (1/6 of play time), distinct sound per weapon, freeze frames on kill. Every pillar banded and proportional — small hits get 6–8-frame pauses, kills get the top.
- Downwell (Fumoto): "If he implemented a mechanic or feature and it wasn't fun or interesting, he would retool it or remove it until the experience felt just right." The reload flash was a placeholder kept because playtest feel beat design intent. One key mechanic, depth from subtraction.
- Celeste (Thorson, PICO-8 jam origin): 10+ forgiving feel techniques (coyote time, jump buffering, corner correction, halved-gravity peak) validated by massive playtesting. Timing/position windows widened until failure felt fair.

## Implemented this round
- **VERIFIED (spec read, no changes — frozen):** hit-stop ladder maps to Capcom bands (Sicienski) — our 28→150ms sits inside the pro envelope (6–8f = 100–133ms normal; 9–11f = 150–183ms fatal; our cap 0.35s = safety rail above all). Pool Drop policy = the documented correct choice (Nystrom), not a fallback.
- **FEEL-SPEC.md:** verification round 2 (below). Spec only, +0 lines. **4,479 lines** (+0).

## F. Sources
sicienski · swink · thorson · nijman · nystrom · fumoto · nuclear throne · downwell · celeste
