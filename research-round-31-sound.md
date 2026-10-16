# Sound Design at $0 for Tactics Games — Findings (Round 31)
**Date:** Tue 2026-10-13 ~23:40 EDT · **Source:** live web research 2026-10-13 (PC Gamer/Prunty, GDC, A Sound Effect/Riviere, jsfxr, BBC/webaudioapi, uisfx.com, GDC 2026, freesound, OpenGameArt, Pixabay, BBC Rewind, lans.cloud, WebKit bugs)
**Project:** Mecha Protocol — heard, not just seen

## A. Tactics game audio
- No public ItB SFX breakdown exists (two-person team, in-house). Transferable pillar from the GDC 2019 postmortem: **legibility** — sparse, discrete cues where every sound carries game-state information, not decorative noise. Turn structure means audio can be sparse, so each cue must read.
- Riviere (mixing): the #1 goal of a game mix is **readability**. Pre-dub method: group related features, pre-mix separately, set early rules per sound type (panning, loudness, spectrum, dynamics, sends, attenuation).

## B. WebAudio synthesis recipes (jsfxr defaults — concrete)
- **LASER/SHOOT:** square, 31.9% duty, 1316 Hz, pitch slide −25.89 oct/s, min 144.6 Hz, attack 0, sustain 0.024 s, decay 0.234 s.
- **EXPLOSION:** noise, 84 Hz, +0.39 oct/s slide, sustain 0.038 s, punch +78.7%, retrigger 25.23 Hz (grain trick), flanger. Short/percussive — layer for body.
- **HIT/HURT:** square, 1868 Hz, −42.88 oct/s, decay 0.189 s — the "impact zap."
- **PICKUP/COIN:** square, 699 Hz, arpeggiation ×1.335 at 0.06 s — the DNA of every UI confirm.
- **BBC gunshot** (Apache 2.0): looping 5 s white-noise buffer → gain envelope (0→1 in 1 ms, →0.3 at 101 ms, →0 at 500 ms) → lowpass 800 Hz Q=1 → master gain 5. **10-voice round-robin pool** = the canonical voice-limiting pattern.
- **Explosion layering:** (1) noise burst lowpass swept 3000→200 Hz, 0.4–0.6 s; (2) sine sub 60→30 Hz, ~0.3 s; (3) 30–50 ms highpassed noise crack.
- **Anti-machine-gun:** randomize pitch ±5–10% per trigger.

## C. UI sound design
- Decision matrix: frequency × uncertainty. Hovering toolbar (high freq, low uncertainty) = usually silent; important submits = distinct success vs error.
- 7 principles: every cue answers did-it-work/fail/move/arrive/continue; hierarchy (frequent = quiet/small); one coherent family; contrast success vs error via **direction/rhythm/density/timbre, not volume**; judge after 50× in a row; leave silence; test on phone speakers.
- Semantic naming (success/error, never bright-pluck-02). **Up = yes, down = no.** 45 ms retrigger cooldown. Unlock from gesture. Reward cues scale with achievement.

## D. Combat sound hierarchy
- Tools: side-chaining, ducking, HDR audio, state mixing + voice-level scenario logic. Bus architecture = the vehicle.
- **3-tier scheme:** T1 critical (limb break, shutdown, VEX attack) — always plays, ducks music+SFX 3–6 dB ~300 ms, owns 1–3 kHz; T2 standard (shots/hits) — voice-limited 8–12, round-robin steal, pitch jitter, booms lowpassed <500 Hz; T3 UI/ambience — deprioritized in combat.
- Frequency carve per bus (UI 2–5 kHz, explosions low, signature mid) prevents masking.

## E. Rival audio identity at $0
- GDC 2026: signature sounds = foundational stylistic pillars aligned with narrative, evolving across content.
- Creature craft: layered recordings + manipulation + pitch matching; repeatable variation systems.
- **VEX kit:** (1) 3–5-note leitmotif stinger (minor 2nd, detuned saws) on intent reveal + attacks; (2) signature weapon timbre (different waveform family, lower register, longer tail); (3) one processed voice moment per mission (record it yourself, pitch down 30–50%, distortion + delay). **Scarcity = identity.**

## F. Free SFX sources + licenses
- **Pixabay:** free, no attribution, modifiable. SAFE (in-game = adapted use).
- **freesound:** CC0 (anything) / CC-BY (commercial OK + attribution) / **CC-BY-NC (UNSAFE for commercial-leaning)**. Filter "Free Cultural Works." Modify before shipping (Content ID claims on raw sounds).
- **OpenGameArt:** CC0/CC-BY/CC-BY-SA/OGA-BY/GPL/WTFPL (multi-licensed = pick one). **GOTCHA: App Store terms conflict with GPL/LGPL/CC-BY-SA/CC-BY** — PWA-over-web unaffected, but source CC0/OGA-BY if an App Store wrapper is ever planned.
- **BBC Sound Effects:** RemArc = non-commercial ONLY. **NOT SAFE to ship** — reference/temp only.
- **jsfxr:** Unlicense/public domain. Safest path for core SFX.

## G. iOS Safari gotchas
- **Silent switch mutes WebAudio but NOT <audio>** (ambient session); AudioContext.state still says "running." Fix: `navigator.audioSession.type = 'playback'` (Safari 16.4+, feature-detect; interrupts user music — needs a settings toggle).
- **WebKit 'interrupted' state** (call/lock): currentTime freezes; scheduled tones pile up and machine-gun on return. Handle it, not just 'suspended'.
- Background tabs suspend audio; visibilitychange resume path needed.
- **Bluetooth:** 100–250 ms+ latency, glitch bugs (WebKit 221334/258864). Never hard-sync visuals to audio. QA on Bluetooth + silent-switch ON + lock/unlock mid-battle.

## Applied to Mecha Protocol (implement-immediately, this round)
- **sfx.js rewritten:** jsfxr-derived recipes (laser shot 1316 Hz/−25.9 oct/s; layered explosion with swept body + sub thump + HP crack; hit zap; rising two-tone UI confirm; falling UI error); **12-voice cap** (BBC round-robin pattern; drop-don't-stack; meter resets on frozen clock); **bus routing** (UI sounds → uiBus, combat → sfxBus); **VEX kit** (minor-2nd leitmotif stinger on detuned saws + dark signature shot timbre); **3-tier ducking** (critical = limb break/mech down/shutdown ducks 50%; explosions 35%).
- **Wiring:** ace attacks → stinger + signature shot; limb destroyed / mech down / heat shutdown → critical tier.
- **music.js:** WebKit 'interrupted' state handler added (re-sync instead of machine-gun).
- Verified in stub harness: all sounds run, cap holds at 12, UI bus routing correct. 2,158 lines, all syntax-clean.

## H. Sources
pcgamer.com (Prunty) · gdcvault.com (ItB postmortem; creature vocalizations) · asoundeffect.com (Riviere mixing) · webaudioapi.com (BBC recipes) · sfxr.me + github.com/chr15m/jsfxr · uisfx.com · schedule.gdconf.com (GDC 2026 signature sounds) · shapingwaves.com · pixabay.com/service/license-summary · freesound.org/help/faq · opengameart.org/content/faq · sound-effects.bbcrewind.co.uk/licensing · blog.lans.cloud (silent switch) · joellof.com · bugs.webkit.org (221334, 258864) · github.com/vinsidious/ios-audio-routing
