# Feel Part 24 (Verification Round 6) — Findings (Round 319)
**Date:** Wed 2026-10-15 ~06:52 EDT · **Source:** live web research (west, pichlmair, hicks, doucet)
**Project:** Mecha Protocol — feel (pre-jam; verification round 6)

## A. Mechanics
- Input-latency audit (West, 2008): "define 'response time' as input → first visible result and put it in the game spec with a measured frame budget." "Inconsistent response time is itself a bug (Heavenly Sword ranged 7–18 frames)." Instrument synthetic keypress→first-pixel; assert inside frame budget; log p50/p99.
- Feedback-stack audit (Pichlmair & Johansen 2021; Hicks et al. 2018): split into tuning, juicing, streamlining. "Feedback must be coherent, confirmatory (linked to player action), multimodal, unambiguous, relevant." For every event, enumerate expected channels; zero/one-channel = gap; every event's feedback must fire on the same frame the sim resolves.
- Pacing audit (Swink 2009): "predictable results, instantaneous response, easy but deep, harmony." Frame-audit event timeline; hit-stop ladder sorts by severity; trauma decays to zero between beats; no two juice systems compete on same channel.

## B. Validation
- Blind A/B (Jonasson & Purho; Doucet): "toggle juice systems on/off between builds and have players compare without knowing which is which." Doucet: "players report *where* feedback confuses them, not just whether it's present." Ask "what did you notice?" not "was there juice?"
- Slow-motion review (qdstaff 2025; West): "frame-by-frame review of recorded sessions — the 'frames lie, timing tells the truth' view." Verify input→onset, hit→flash/freeze/floater alignment, trauma decay curve.
- Player descriptions (Swink; Hicks): "ask players to describe the feel *in their own words*." "If players say 'snappy/impactful' for hits and 'floaty' for nothing, the pillars are landing."

## C. Techniques
- Anticipatory feedback (Jonasson & Purho): "telegraph intent before the payoff — wind-up poses, pre-attack camera lean, audio risers." Makes impact land harder.
- Follow-through: "recoil, overshoot-then-settle, particles, and critically the *trauma-decay* shake (Nijman)." "Shake amplitude ∝ trauma² with exponential decay, and shake must release fully."
- Exaggeration (Hicks): "making state-changes visible — bigger than realistic, shorter than realistic." Legitimate inside juice budget + mute test.
- Tempo control (Motion Twin; Pichlmair): "hit-stop, freeze frames, and post-freeze time-scale dips." "Brief time manipulation that reads as weight without breaking flow."

## D. What to avoid
- Input lag: "anything past the frame budget, or worse, variable latency — West treats inconsistency as a bug."
- Feedback desync: "juice firing late/early relative to the sim event." "Direct feedback must be *confirmatory* — desynced feedback actively misleads."
- Over-juicing (Doucet): "abundant feedback can confuse; the goal is to support the player, not drown them." "Juice must clarify, never obscure."
- Dead-feeling hits: "hits with no hit-stop, no shake, no flash, no floater, no audio — the exact inverse of the Motion Twin approach."

## E. Shipped
- Dead Cells: "tempo control + camera support made every strike readable and heavy without sacrificing responsiveness."
- Celeste: "input-forgiveness stack — coyote time, jump buffering — plus environmental feedback. Players blamed themselves, never the controls."
- God of War (2018): "every micro-interaction got anticipatory + follow-through treatment."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** feedback synchronization. On hit resolution (game.js:1181-1187), all channels fire in the same block: hit-stop (time-scale), attacker recoil (animation), limb flash (visual), hit flash (visual), damage floater (UI), SFX.hit (audio). Six channels on the exact resolution frame — no desync. Hicks' "confirmatory, multimodal" satisfied.
- **FEEL-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
west · pichlmair · hicks · doucet · dead cells · celeste · god of war
