# Audio Part 24 (Verification Round 8) — Findings (Round 329)
**Date:** Wed 2026-10-15 ~07:33 EDT · **Source:** live web research (testdevlab, smus, mdn, adenot)
**Project:** Mecha Protocol — audio (pre-jam; verification round 8)

## A. Mechanics
- Web Audio audit (TestDevLab): "(a) sound design — every SFX matches its action; (b) music — triggers fire on changes, crossfades smooth; (c) in-engine — randomization, concurrency ('the best way to test concurrency is to spam away'), max voice cap."
- DevTools WebAudio panel (Chrome): "per-AudioContext metrics — state, sample rate, Render Capacity — plus GC button, and graph visualizer (ideal for spotting node accumulation)."
- web.dev (Smus): "detect clipping (exceeding [-1,1]), prevent with master gain staged for worst case, then DynamicsCompressorNode as last node before destination." "Pause/suspend on tab background via Page Visibility."

## B. Validation
- Browser matrix (MDN 2026): "Chrome, Safari (macOS+iOS), Firefox, Android." "Opera Mini does not support Web Audio." Libraries: howler.js, tone.js, standardized-audio-context.
- Autoplay denial: "check navigator.getAutoplayPolicy('audiocontext') and catch NotAllowedError to drive 'tap to enable' fallback."
- Device testing (TestDevLab; Audiokinetic): "measure ACTUAL device output — not the middleware meter — because final summing happens after the app."
- Automated: "OfflineAudioContext renders graph into memory — automated regression tests without listening." "W3C web-platform-tests for conformance."

## C. Techniques
- Context: "ONE AudioContext per page — multiple contexts cause performance hit." "Create/resume inside user gesture."
- Node cleanup: "source nodes are one-shot — create new AudioBufferSourceNode per trigger, share decoded AudioBuffer." "Disconnect finished nodes; let GC run."
- Efficient synthesis: "preload/decode at load via async decodeAudioData; reuse typed arrays; stay monomorphic; prefer cheap nodes (EQ/LPF over convolution)."
- Mastering: "master gain staged for worst-case + DynamicsCompressorNode last before destination."
- Graceful degradation: "baseline <audio>, enhanced Web Audio where supported; handle resume on gesture, suspend on visibility."
- Timing: "AudioParam automation for timing-critical; schedule off context.currentTime (not setTimeout)."

## D. What to avoid
- Context leaks: "multiple AudioContexts or never closing."
- Node accumulation: "firing one-shot sources without cleanup; graph grows invisibly."
- Main-thread processing: "ScriptProcessorNode, sync decode, DOM in audio callbacks."
- setTimeout scheduling: "background-tab throttling makes timed audio 'go weird'."
- Untested browsers: "HRTF, convolver cost, autoplay policy all vary."
- Fighting iOS: "silent switch is system-level — detect and message, don't fight."
- No autoplay fallback: "NotAllowedError with no 'tap to enable' path."
- Clipping by stacking: "no master gain/limiter, 'sounded fine' in happy path."
- Music fatigue: "short predictable loops; fixes: fade when stuck, intensity crossfades."

## E. Shipped
- Field Runners: "matched the tool to platform's reality instead of fighting <audio> tag."
- Angry Birds (HTML5): "sample-accurate triggering and master-mix control."
- Skid Racer: "unitless PannerNode positioning made spatialization nearly free."
- Plink: "textbook DynamicsCompressorNode — unpredictable human sounds controlled."
- Songs of Diridum: "pushing Web Audio to its limits — but CPU-intensive (~80% Firefox)." Caution: "our cheaper node choices are the pro move for 2D."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** Web Audio architecture. ONE AudioContext (singleton, sfx.js:42-44 — Chrome FAQ rule). Master gain between buses and destination (sfx.js:48-52, Round 224 — Smus worst-case staging). DynamicsCompressor before destination (music.js:29 — "bus architecture: music/sfx/ui gains → master compressor → destination"). iOS audioSession guard (sfx.js:46, Round 198). Resume on suspended/interrupted (sfx.js:54 — gesture resume). MAX_VOICES=12 (concurrency cap, TestDevLab "spam away" tested).
- **AUDIO-SPEC.md:** verification round 8 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
testdevlab · smus · mdn · adenot · audiokinetic · field runners · angry birds
