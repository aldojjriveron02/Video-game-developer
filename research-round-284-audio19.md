# Audio Part 19 (Verification Round 3) — Findings (Round 284)
**Date:** Wed 2026-10-15 ~04:34 EDT · **Source:** live web research (quarles, splice, mdn, mojo kid, outer wilds)
**Project:** Mecha Protocol — audio (pre-jam; verification round 3)

## A. Mechanics
- Priority audit (Quarles; Splice): priority system + hard channel cap. When sounds exceed the cap, priorities decide. Splice's decision rule: "What does the player need to hear right now?" + the "law of two-and-a-half" — listeners track ~2.5 simultaneous threads; beyond that = virtualization candidates. For us: force the 12-voice cap to saturation; UI Tier 1 (Lester) must always win.
- LRA spot-check (Splice): test the FINAL mix on the target platform (not studio monitors); leave headroom in every bus. Maps to our frozen -18 LUFS — spot-check on actual playback devices (Sony portable reference), not the DAW.
- Ducking stress (Quarles; Fracture): ducker timed to engage at the START of the priority line (not before). QA: rapid state churn — trigger duck/unduck repeatedly; confirm no stuck-ducked or doubled beds.
- Zero-layer rule (Mojo Kid; Halo): in vertical systems, pros prove the "no music" state is TRUE silence — every layer fades to zero, not a bed at -60. = our Prunty silence rule.

## B. Validation
- Device matrix (Game Audio Learning Portal; Splice): consumer-grade devices — laptop speakers, cheap earbuds. The player hears through those, not studio monitors.
- First-tap unlock (MDN, Sep 2026): audio outside a user input event = autoplay blocking. Cold-load test on mobile: silence before first tap, full resume after.
- Lock-pass log (Splice): document the freeze — every state, layer, gain. Any post-freeze change = re-verification event.
- Fresh ears (r/GameAudio; Outer Wilds): someone who hasn't heard the game all day does the final listen. Players immediately identify when a mix "fights itself."

## C. Techniques
- Vertical re-orchestration (Mojo Kid; Halo/O'Donnell): stems added/removed per state + horizontal re-sequencing + randomization. Music mapped to actual gameplay states — composed for each moment, never repeating identically. Our 4s hysteresis = the pro anti-flutter guard.
- Ducking discipline (Quarles; Splice): bus hierarchy (SFX ducks under VO; music under SFX); fixed depths per bus, never ad-hoc per-sound.
- Voice tiers (Splice): prioritize by gameplay importance; cap simultaneous voices; virtualize the rest. Our 12-voice cap + UI Tier 1 = the pattern.
- Mix-as-you-go (Splice): "get into the mix early, don't save mixing for the end." Our early lock follows this.

## D. What to avoid
- Post-lock additions: freeze is sacred — a new asset = re-verification.
- Volume creep (Splice): each bus nudged up to "sit right," the stack clips, the mix dies on real devices. Most common late-jam failure.
- Unlocked contexts (MDN): created/started outside a gesture = blocked. Ships silent on mobile with no error.
- Late-audio thinking (King's Ascent postmortem): treated music as "plugged in" late → structural problem. Audio in the build from day one.

## E. Shipped
- Halo (O'Donnell): vertical + horizontal + randomization. Music mapped to states, never repeating identically.
- Monkey Island 2 (Land's iMUSE): horizontal transitions respecting musical grammar — no hard cuts, musically continuous world.
- Outer Wilds (r/GameAudio): "restraint — layers are sparse and the mix keeps the environment audible." Layering that never fights the sound design.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** zero-layer = TRUE silence (music.js:124-130). stop() fades gain to 0.0001 THEN calls src.stop() — the source is stopped, not left running at -60. `this.current = null`, `this.state = 'off'`. The pro zero-layer rule satisfied structurally.
- **AUDIO-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,479 lines** (+0).

## F. Sources
quarles · splice · mdn · mojo kid · outer wilds · halo · monkey island 2
