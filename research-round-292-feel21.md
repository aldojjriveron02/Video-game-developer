# Feel Part 21 (Verification Round 3) — Findings (Round 292)
**Date:** Wed 2026-10-15 ~05:10 EDT · **Source:** live web research (eiserloh, berry, kao, sicenski, capcom)
**Project:** Mecha Protocol — feel (pre-jam; verification round 3)

## A. Mechanics
- Band mapping (Capcom; Sicienski; Sonic Hurricane): SFII era — tiered hit-stop by attack strength (9–14 frames light/medium/heavy), freezing both characters on melee contact (physical resistance + wider 2-in-1 windows); projectiles froze only the victim. Community calibration: start ~25–30ms, ~100ms absolute longest (r/gamedev). Short legible bands, not long freezes.
- Micro-duration legibility (Berry, RPS 2018): Celeste's 0.1s crystal freeze cut to 0.05s — "far too long," and even 0.05s is "still very noticeable," since "the human eye can really spot things." Strongest evidence that sub-100ms bands are perceptible and band mapping below the cap matters.
- Juice-budget audit (Kao et al., CHI 2024): "coherent" (not maximal) feedback — prior guidance supported specifically for coherent juicy feedback; overloaded amplified feedback likely backfires. Celeste's team: "we play with a lot to make sure there's impact on everything" but "careful not to go overboard, balancing the effect so you feel it but are not distracted by it." Directional shake + particle wake; nothing decorative for its own sake.
- Mute test (r/gamedev; GameAnalytics): juice = the visual/auditory layer enhancing immersion without changing gameplay. Audio QA treats every interaction as needing a sound cue. The mute test is the inversion: if a hit only reads through sound, the visual bands are under-spec'd.

## B. Validation
- Controlled A/B (Kao et al., CHI 2024, 27 citations): juicy vs dry feedback, measuring curiosity/competence/effectance. Empirically supports prior juice guidance; warns against overload. Closest to a lab-validated blind A/B protocol.
- Observational first-impression (Berry/Thorson): "did a lot of testing" inviting friends and watching. Players "probably wouldn't recognise anything was particularly wrong," but observers could see it. Distinguished level-design problems from "feeling" problems (too slippery, jump not high enough) purely by watching first-time players. The observer, not the player, is the instrument.
- Repetition tolerance (Berry): floats changed ".2 to .21 or something to get the feeling just right." The stamina mechanic deleted because "nobody was having fun when they had to stop and do nothing for two seconds" — "completely destroyed the flow." Repeated actions = the test; what doesn't survive repetition gets cut.
- Industry framing (GameAnalytics; Swink 2008): playtesting as the design instrument. Swink's "Game Feel" = the canonical measurable framework.

## C. Techniques
- Trauma² shapes (Eiserloh, GDC 2016): trauma in [0,1]; events add (+=0.2 or 0.5); decays linearly; shake = trauma² (or ³); offset from noise. Squaring: small hits tremble, big hits rattle — nonlinear response from one number.
- Hit-stop bands: Capcom's tiered frames; Celeste's 0.05s crystal; 25–30ms start / 100ms ceiling. Placement: the pause sits exactly at impact, brief and deliberate (vlvd.net).
- Squash discipline (CGWire; Pixune): squash on contact, stretch during anticipation before/after. Overuse "will have the opposite effect." = our anticipation-only rule.
- Pool policies (Game Developer; Unity; Envato): pre-allocate fixed sets. Exhaustion: (1) drop, (2) recycle oldest, (3) grow. For juice: drop-on-exhaustion = the disciplined choice — "turns the pool cap into an enforced juice-density ceiling instead of a perf liability or a visual blowout."

## D. What to avoid
- Unbudgeted/everything-juiced dilution (Game Developer): "shaking the entire screen on a lightning strike and chipping armor with sparks on every enemy fall; juice applied to everything stops meaning anything." r/gamedev: screen shake is "the worst thing you can add to add 'juice' and everyone does it" — lazy unbudgeted shake is a smell.
- Adding feel after freeze (Celeste): once level design began, Berry/Thorson had to be "very careful about making changes to the way Madeline controls, because they'd affect all the work they'd done." Late feel changes = expensive + destabilizing. Freeze the feel spec before content lock; then value-tunes only.
- Flow-killing additions: the deleted stamina mechanic "completely destroyed the flow." Anything interrupting the core loop must prove itself in repetition testing or be cut.
- Committee tuning: Berry/Thorson changing floats by 0.01 by hand; Fumoto single-handedly designing Downwell. No source endorses multi-stakeholder feel votes. Feel owned by one or two people + silent observation.

## E. Shipped
- Celeste (Thorson/Berry; PICO-8 jam origin, "made in four days"): coyote-time grace, dash course-correction, benefit-of-the-doubt input, 0.05s crystal freeze, directional shake + particle wake on the 0.15s dash, months of early float-tuning + friend observation. Feel tuned before level design, owned by two people, verified by watching fresh players. Effortlessness from invisible systems.
- Downwell (Fumoto): one key mechanic (gunboots = movement + attack). One mechanic = one feel target — all juice served the same verb, so the budget audited itself.
- "Juice It or Lose It" (Jonasson/Purho, GDC): boring game cranked "up to eleven, live on stage," particles layered progressively, source released. The reference implementation — and inverted, the argument for freeze: it works because the mechanics were locked while juice was layered.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** the COMPLETE Eiserloh model, all four rules.
  1. Clamp: `trauma = Math.min(1, ...)` (game.js:1454) — trauma ∈ [0,1]. ✓
  2. Add-never-set: `(this.trauma || 0) + x * mult` (game.js:1454) — events ADD. ✓
  3. Linear decay: `this.trauma - dt * 0.5` (game.js:1798). ✓
  4. trauma² × smooth noise: `this.trauma * this.trauma * 20` with layered sines (game.js:1580-1582) — "never random jumps." ✓
  Plus intensity scaling (0 / 0.3 / 1) and the juice-events/sec alarm (Round 151).
- **FEEL-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
eiserloh · berry · kao · sicenski · capcom · celeste · downwell · juice it or lose it
