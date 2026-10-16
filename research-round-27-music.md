# Music at $0: Adaptive & Loopable Music for Tactics — Findings (Round 27)
**Date:** Tue 2026-10-13 ~22:36 EDT · **Source:** live web research 2026-10-13 (Game Developer, PC Gamer/Ben Prunty, austinhaynesmusic, MDN, Pixabay/OpenGameArt licenses, iOS audio docs)
**Project:** Mecha Protocol — ending the silence between battles

## A. Adaptive music techniques
- **Vertical layering (stems):** same tempo/key/loop length, layers faded per an Intensity parameter; transitions on beats/bars, never mid-bar.
- **Horizontal resequencing:** full arrangements per state, switched at musical boundaries; transition matrix defines legal flows (explore→combat→victory).
- **Framework (stems / states / sections / endings / stingers / variations):** stems when intensity changes fast; states when each mood deserves its own arrangement; sections when music should go somewhere; stingers = one-shot accents; variations = 2–4 loop takes swapped at loop point.

## B. Tactics conventions — Into the Breach (Ben Prunty)
- Threw out "strategy music should be quiet" — energetic tracks instead. **The implementation finding matters more than composition:** constant music fatigues, so they built around **strategic silence** — menu fades on mission start, deployment = ambient only (tension builds), battle hits when the last mech's drop slams down. "Where the music is placed, how it starts, how it stops, how long the silence is between tracks — it all has an impact."
- Fire Emblem: map vs battle themes; dynamic calm→intense pairs. Music fatigue is the #1 risk — music must tolerate long thinking stretches (recede or stay silent).

## C. WebAudio generative music
- Tutorial book (meleyal.github.io); Markov-chain engines (dev.to demo); **Tone.js** (~14.8k stars — scheduling/synths/effects); Scribbletune; Magenta.js (overkill). Practical middle ground: chord-progression engine + Markov melody.

## D. Loop design
- No hook (earworms are the enemy); asymmetrical sub-loops of different lengths; frequency management vs SFX.
- **MP3 adds start-silence → audible gap. Use OGG Vorbis or WAV.**
- Gapless in WebAudio: decode once → `AudioBufferSourceNode` with `loop=true`, schedule on the audio clock — NOT `HTMLAudioElement.loop` (browser-dependent gap). Tail-overlap and intro-once→loop techniques.

## E. Free sources ($0)
- **Pixabay Music** — 27,964+ cinematic sci-fi tracks; no attribution required; can't resell standalone. Search "dark sci-fi", "sci-fi action", "suspense underscore".
- **OpenGameArt** — CC0 collection (no attribution) + CC-BY tracks; ships with credits files.
- **Incompetech** — 2,000+ tracks, CC-BY 4.0: credit REQUIRED on a visible credits screen. Games may chop/splice.

## F. Mixing under SFX
- Ducking: 12–15 dB under voice (50ms attack / 500ms release); lighter event-based dips for SFX-heavy games.
- Frequency separation: cut 2–4 dB mids in music for SFX room.
- WebAudio: separate GainNodes (music/sfx/ui) → one DynamicsCompressorNode → destination; duck via `gain.setTargetAtTime`.

## G. iOS gotchas
- `navigator.audioSession.type = 'playback'` (Safari 16.4+) plays through the silent switch.
- iOS 15+: AudioContext suspends on lock/background — re-sync on `visibilitychange`.
- Battery: avoid ConvolverNode/HRTF/Analyser on mobile; generative audio costs more than file playback; suspend when hidden.

## Applied to Mecha Protocol (implement-immediately, this round)
- **New `js/music.js` — Music engine:** bus architecture (music/sfx/ui gains → master compressor); gapless `loop=true` playback; ~2s crossfades; event ducking; iOS hardening (audioSession, visibilitychange); STATES model (ItB): hangar/briefing = calm, deployment = silence, battle starts on first combat, menu on victory/defeat.
- **SFX re-routed** through the sfx bus; `explode()` ducks the music.
- **No tracks shipped yet** — `audio/README.md` drop zone (`hangar.ogg`, `battle.ogg`; OGG not MP3; prefer no-attribution licenses; audition loops for 5 min). Every call is a silent no-op without tracks: game runs SFX-only today, zero code changes when tracks land.
- Verified: 3 buses, SFX routing, silent no-ops, crossfade, stop. 1,784 lines total, all syntax-clean.

## H. Sources
gamedeveloper.com (Whitmore adaptive guide) · departuremusic.com (vertical layering) · austinhaynesmusic.com (stems/states/sections; web-game loops) · pcgamer.com (Ben Prunty, ItB soundtrack) · meleyal.github.io (generative music book) · dev.to (Markov engine demo) · tonejs.github.io · scribbletune.com · incompetech.com/music/royalty-free/faq.html · pixabay.com/music + /service/license-summary · opengameart.org · freeaudiolab.com (ducking) · developer.mozilla.org (DynamicsCompressorNode) · joellof.com (iOS background audio) · HdM Stuttgart (Web Audio performance)
