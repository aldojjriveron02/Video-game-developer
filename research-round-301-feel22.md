# Feel Part 22 (Verification Round 4) — Findings (Round 301)
**Date:** Wed 2026-10-15 ~05:49 EDT · **Source:** live web research (eiserloh, eastondev, dead cells, hades, nuclear throne)
**Project:** Mecha Protocol — feel (pre-jam; verification round 4)

## A. Mechanics
- Shake audit (Eiserloh, GDC 2016): trauma ∈ [0,1]; events add; linear decay; shake = trauma² (small hits barely register, big hits compound); smooth noise per channel (Perlin), not random offsets — "random jitter looks like camera bug"; rotation reads as shake without pushing the subject off-centre.
- Hit-stop audit (infil.net; Street Fighter Wiki): hitstop exists outside startup/active/recovery — "the game putting the characters on hold while someone shakes the camera a bit." Ibuki's hard punch: 15f freeze on block. Heritage: "likely originated accidentally from processing delays in early Street Fighter; when hardware got faster developers intentionally preserved it because removing it made hits feel weak." Band ladder: hit class → frame count → perceived weight; more frames = beefier (infil.net).
- Juice budget (Eastondev, May 2026): 3–5 feedback elements/sec max ("more becomes visual noise"); floaters max 2–3/sec; stagger in time — sound first, flash ~20ms, particles ~50ms, floaters ~100ms. Flash 50–100ms; particle bursts 20–30/event. (Swink: measure response lag and timings, don't tune on intuition.)

## B. Validation
- Blind A/B: testers play without knowing what changed; "can they tell the difference?" Non-negotiable for objectivity — "the designer's presence makes players defer to expertise instead of reacting honestly." For the ladder: "players can't name frame counts, but they should sort bands by perceived weight consistently."
- Mute test (Eastondev): sound is "the unsung hero." Strip audio; check if the visual stack (flash, shake, particles, floaters) still carries impact. "If a hit reads only because of its sound, the visual channel is under-tuned."
- Frame analysis (GMTK/Celeste): coyote time, asymmetric jump arcs, jump buffering — "all measured in frames, not vibes." ("Why Does Celeste Feel So Good to Play?", 3M views.)
- Metrics (Swink; AquiGorka): response time, physics consistency, polish coverage as testable quantities.

## C. Techniques
- Trauma shake (Eiserloh; Lunt's "Screenshake++": trauma blending, layering, camera impulse, FOV kicks).
- Hit-stop / freeze frames (fighting-game heritage).
- Squash & stretch + springs (m2-md micro-engine: time-dilating hit-stop, trauma-decay shake, spring squash, brightness flash — one unified impact pipeline).
- Anticipation frames: Dead Cells authors pose-to-pose at 30fps and interpolates.
- Layered stacks: Hades' dash-strike = 9 layers — anticipation freeze → dust → hit flash → 60ms shake → 50ms time dilation → particles → glow trail → damage number (40–50ms) → audio thwack.
- Foundational: Jonasson & Purho "Juice It or Lose It"; Nijman "The Art of Screenshake" (Vlambeer).

## D. What to avoid
- Juice without meaning (Eastondev): particles "high-risk/high-reward"; floaters clutter; overused sound annoys. "Each explosion should have meaning — tie every effect to a game event."
- Shake without cause (Eastondev): "camera should shake only for player actions or events directly affecting the player; keep shakes short and infrequent." Dead Cells ships shake + flash as SEPARATE toggles — always provide an off-ramp.
- Post-freeze neglect (Dead Cells): "the weight comes from the time-scale dip after the freeze, not the freeze itself." Hades' 2-year patch trail: damage numbers 30→50ms, own render layer, crits separate channel, 60ms final freeze. "The freeze is one line item; the recovery curve after it is the feel."
- Flow-killers (Dead Cells): freezes at 1 frame because "players may kill six enemies in two seconds — a long hitstop would desynchronise the combo rhythm." Freeze must match tempo, never break it.

## E. Shipped
- Dead Cells (Motion Twin): 1-frame freeze on crits + time-scale dip ("weight comes from the dip"); anticipation pose-to-pose; leniency stack that "cheats in the player's favour"; shake/flash as separate a11y toggles. "Freezes sized to the combo rhythm."
- Hades (Supergiant): 9-layer stack per dash-strike; damage numbers tuned publicly over 2 years (size up, own layer, 30→50ms, crits separate, 60ms freeze). "Feel iterated as a feature, not fixed at ship."
- Nuclear Throne (Vlambeer): "performative development" — feel tuned live on Twitch with real player reactions to every shake/flash tweak. Nijman's screenshake systematized: persistent corpses, shell casings, particle-heavy kills, hit flash, trauma shake.

## Implemented this round
- **POST-FREEZE TAIL (js/game.js, Dead Cells):** our hit-stop was a hard freeze with NO recovery curve — "a freeze with no post-freeze tail reads as a stall, not a hit." Added: when hitStop ends, time-scale dips to 0.35× for 70ms (the Hades 50ms dilation pattern). Verified: 40ms freeze (3f) → 70ms tail at 0.35× (5f, 29ms effective) → total 133ms impact. Respects reducedEffects (no tail when motion off). +5 → **4,535 lines**, all clean.
- **FEEL-SPEC.md:** verification round 4 (below).

## F. Sources
eiserloh · eastondev · dead cells · hades · nuclear throne · gmtk · swink
