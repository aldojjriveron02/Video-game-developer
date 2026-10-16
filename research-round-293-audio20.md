# Audio Part 20 (Verification Round 4) — Findings (Round 293)
**Date:** Wed 2026-10-15 ~05:14 EDT · **Source:** live web research (zlobin, quarles, mongeau, greenaway, botw)
**Project:** Mecha Protocol — audio (pre-jam; verification round 4)

## A. Mechanics
- Saturation audit (Quarles 2009): "set the number of allowed simultaneous channels. After the highest priority sounds finish playing, the lower priority sounds pick them up." Deliberately fire more voices than the cap; verify (a) highest-priority tiers never stolen by ambience, (b) the steal sounds musical not hard-cut. Our 12-voice + UI Tier 1 = the pattern. Hammer all buses simultaneously; confirm tier order under saturation.
- Hysteresis stress (Zlobin 2016): vertical re-orchestration constraints — layers share key/harmony/tempo + fixed duration; zero layer first; each new layer "a very noticeable element" so state changes read clearly. Rapid combat on/off must never produce musical "chatter" or phase-y collisions. Our 4s hysteresis = the pro answer. Stress: rapid on/off edges at 2–3× the hysteresis rate.
- LUFS pass (Mongeau; Sony ASWG-R001): console −23 LUFS (±2), portable −18 LUFS, true-peak −1 dBTP. Measure whole titles, minimum 30-minute window. Also LRA (consistency across states — where our silence zero-layer + music machine must be verified) and true peak, not just integrated LUFS. Our −18 LUFS = exactly the Sony portable standard — correct for a small-screen web game.

## B. Validation
- Device matrix (Rogut 2026): "test across different devices, speakers, and headphones to make sure the sounds hold up." Minimum: phone speaker (iOS + Android), earbuds, laptop speakers, desktop. Small speakers expose: masked UI clicks, boomy music states, ducking that pumps on tiny drivers.
- First-tap unlock (Greenaway & Choi 2018): create AudioContext, resume() on user interaction. Matrix: tap-to-start unlocks on first gesture; no audio before gesture; backgrounded tab suspends/resumes; iOS: navigator.audioSession "playback" (iOS 17/18, WebKit bug 237322 — "Apple Quietly Fixed a 10-Year Web Audio Bug," huddee.com 2026) so Web Audio bypasses the hardware silent switch. Verify "playback" set before first tap; re-verify with silent switch engaged.
- Fresh ears (Vintage King; Mixdown; Berklee): "sleep on it and listen back the next day with fresh ears." Ear fatigue → over-compensation on loudness + brightness. Our fresh-ears LUFS step = textbook: final measurement after a rest break, never at session end.

## C. Techniques
- Vertical re-orchestration (Zlobin): stack layers on a neutral zero layer, same key/tempo/harmony, add/remove per state. Shipped: Banjo-Kazooie, Uncharted 2, Mario Odyssey. Pro rule: "write the zero layer FIRST (his mistake was writing character themes first) — it is the most important because everything else stacks on it." Our Prunty silence zero-layer = the recognized pro variant. (sfxengine: silence-as-design for UI audio.)
- Ducking discipline (Quarles): sidechain-driven, surgical. Gameplay sounds route through a ducker triggered at the start of each VO file so VO cuts through; "used wisely in conjunction with other techniques" — not a constant crutch. Master-bus hierarchy (Master → grouped buses); ducking targets buses, not sounds. For us: duck music under UI Tier 1 + critical feedback, not under everything; never pump during hysteresis transitions.
- Voice tiers (Quarles): "The human ear cannot distinguish between hundreds of sounds going off at the same time" — tiers let lower-priority wait. UI at the top of the attention stack (sfxengine's "audio hierarchy"). Our UI Tier 1 + 12-voice cap = the design; the steal order = the implementation. Verify steal order matches the tier table under saturation.

## D. What to avoid
- Post-lock additions (Quarles): "As the project gets closer to final lock-down, the audio team needs to do a final mix of the entire game" — after that, nothing new. Adding a sound breaks LUFS/LRA balance, voice budget, ducking map. Our lock-pass discipline = the pro posture.
- Volume creep: per-sound loudness arms races — each new sound authored slightly hot, integrated loudness drifts, −18 LUFS breaks silently. Prevent: loudness pass (integrated + LRA + true peak, ≥30 min) + persist the player's volume setting (don't re-scale content). Re-measure after every content change.
- Unlocked contexts: audio before gesture (blocked, silent failure); new AudioContext per sound (multiple contexts fight + leak); iOS ignoring silent-switch. Pro: one AudioContext, resumed on first interaction, audioSession "playback" on supporting platforms.
- Masking / untested small speakers: skipping the device matrix = UI clicks buried under music on phone speakers. Never finalize on studio monitors alone.

## E. Shipped
- Ape Out (Cuzzillo/Boch): reactive generative jazz — every action triggers drum fills/cymbals/hi-hats as both score and feedback. "The music IS the game feel." Critics: "one of the most intense games of the year."
- Breath of the Wild (Wakai): sparse minimalist adaptive score — piano fragments bloom only as the player engages; silence = the default exploration state. "Treats silence as a musical choice (the Prunty zero-layer principle at AAA scale)." When music arrives it carries maximum weight.
- Uncharted 2 (Naughty Dog): vertical remixing across exploration/suspense/combat — layered stems over a shared harmonic framework. Layers share key/tempo/harmony (Zlobin's constraint set) — seamless, cinematic, combat reads as more intense without a hard cut.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** iOS audioSession "playback" (WebKit bug 237322). sfx.js:46 — set inside ensure() during AudioContext creation, before any sound plays. Called from the pointerdown gesture handler (game.js:170). The silent-switch bypass is armed on first tap. music.js:35 redundantly sets it (idempotent).
- **AUDIO-SPEC.md:** verification round 4 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
zlobin · quarles · mongeau · greenaway · botw · ape out · uncharted 2
