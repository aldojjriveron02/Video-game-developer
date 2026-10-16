# Feel Part 15 (Game Feel / Juice) — Findings (Round 238)
**Date:** Wed 2026-10-14 ~23:12 EDT · **Source:** live web research (nijman, purho, swink, salyh, exekite, gmtk, wayline)
**Project:** Mecha Protocol — feel (FROZEN number sheet; verification only)

## A. Mechanics
- Juice canon: hitstop = WEIGHT (freeze tells brain "that hit mattered"); shake = POWER; flash = CONFIRMATION; particles = ENERGY/direction; floaters = READABILITY.
- Trauma system (Nijman/Vlambeer, GDC "Art of Screen Shake"): trauma 0–1, events add (kills > glancing), decays, shake = trauma² (small subtle, big explosive), clamp 1. **Exactly our implementation (Round 37, Eiserloh).**
- Purho & Jonasson "Juice it or lose it": juice is layered feedback, iterated with/without. Thesis: juice doesn't change rules, it changes how rules FEEL.
- 100ms rule (Swink, Game Feel): feedback >100ms after action becomes consciously noticeable. Every click's first feedback frame within 100ms.
- Sequencing: sound 0ms → flash 20ms → particles 50ms → text 100ms. Brain parses causality from temporal order; stacking all on frame 0 causes masking. **Matches our frozen sheet exactly.**
- Shake duration: 80–150ms per shake (Slashcev). Density: >3–5 events/sec = noise, brain stops parsing (see D).

## B. Validation
- Feel checklist per effect: first feedback ≤100ms? sequence ordered? trauma tier right? floaters 0.5–0.8s non-overlapping? particles 3–8? density ≤3–5/sec? (Mirrors Salyh's "6 Mistakes" checklist.)
- A/B juice: Purho/Jonasson with/without demos = pro standard. Hicks et al. (30 participants): no performance difference, strong preference for juicy, more satisfying. Test with debug toggle, not gut feel.
- Mute test: sound sells ~half of impact; if dead muted, visuals too weak. Effects must carry impact on visuals alone.
- Blind test: spectator reads game state from feel alone (who attacked, how hard, who died). Kills must feel categorically different from chip damage.
- Slow-mo review: 60fps capture at 0.25x, verify frame counts directly — only way to confirm a frozen number sheet.

## C. Techniques
- Hitstop: freeze counter in frames; skip sim, keep rendering. Light 2f / heavy 4–5f / kill 5–8f + weapon multipliers — matches pro ranges (Hades freezes 2–3f per Exekite).
- Shake: trauma accumulator, displacement = trauma² × maxOffset × noise. Directional (knockback) vs omnidirectional (explosions).
- Flash: white (or red for player damage) 1–2f — cheapest, highest-value effect.
- Particles: 3–8/event, fixed pool, spawn on impact frame.
- Floaters: spawn ~100ms (last), rise ease-out, 0.5–0.8s life, slight horizontal drift.
- Pitch: ±5–15% per play (Hollow Knight per Exekite — varied pitch = "a world," identical = "a recording").
- Knockback: small ease-out displacement along attack vector.
- **Frib's rule: NO public source found — resolved as INTERNAL project term.** Our spec defines it: "When something is done and works, leave it like that." (freeze discipline). Documented, not assumed.

## D. What to avoid
- Juice obscuring gameplay (Wayline "Juice Problem" Apr 2025): board state is sacred — shake/particles must never cover tiles, positions, targeting.
- Hitstop on every hit (desensitization) — tiered stops are the defense; constant small stops read as sluggishness. **Our 0.35s/sec budget cap (Round 205) is the implementation.**
- Shake during UI navigation — combat only, never menus/cursor.
- Particle spam on weak hardware — fixed pool + hard budget + quality toggle.
- Feel fighting tone — tactics = crisp, readable, deliberate.
- "Everything shakes" trap — trauma tiers + trauma² prevent hierarchy collapse (Dead Cells calibrated per-action per Exekite).
- Salyh clarity rule: "If something is important, make it big; high-contrast; make it wiggle."

## E. Shipped
- Hades: 2–3f hitstop on meaningful impacts; layered juice on minor actions too.
- Dead Cells: per-action shake calibration — blind test passed (know danger from feel alone).
- Celeste: feel over realism (coyote time, buffering, squash/stretch, dash particles, death shake).
- Nuclear Throne (Nijman's own): trauma-shake reference implementation, full canon composed readably.
- Hollow Knight: pitch variation on repeated SFX (anti-fatigue).

## Implemented this round
- **Verified (code read, no changes — FROZEN):** trauma 0..1, offset=trauma², clamped (Round 37); hitstop tiers + per-weapon multipliers (blade 1.5×, cannon 1.25×, missiles 0.7×; Round 128); 0.35s/sec hitstop budget cap (Round 205, anti-desensitization); juice density alarm — >5 events/sec → Telemetry 'feel:over_juice' (the research's smoke alarm, already shipped); particle pool prewarmed at boot, 300 (Round 199). All research recommendations already in code.
- **Frib's rule RESOLVED:** internal term, spec-defined ("When something is done and works, leave it like that."). Not a public standard — documented as project freeze discipline.
- **FEEL-SPEC.md:** slow-mo verification protocol (60fps → 0.25x, frame-count the sheet); mute test gate; blind test gate; A/B juice toggle note (doubles as accessibility fallback alongside shake-disable + particle quality).
- Spec only, +0 lines. 4,402 lines (+0).

## F. Sources
nijman · purho · swink · salyh · exekite · gmtk · wayline · hicks
