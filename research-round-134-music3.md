# Music Part 3 (Adaptive & Licensing) — Findings (Round 134)
**Date:** Thu 2026-10-15 ~06:40 EDT · **Source:** live web research (splice, abratabia, pcgamer, pixabay, gamedeveloper, thegameaudioco, hud thesis, ftl wiki, r/gamedev)
**Project:** Mecha Protocol — music (Phase 3 week-1)

## A. Adaptive
- Mraz: vertical remixing + horizontal re-sequencing; JC4 layers fade with enemy count.
- "More complex" ≠ better. Default state. Mobile constrains.
- Abratabia: stems as AudioBuffers, same currentTime, GainNode each, 1-2s fades, bar quantization.
- State machine + hysteresis (min 1 phrase + re-entry cooldown). 200-400 lines. Vertical first.

## B. Licensing
- Pixabay: free, no attribution, modify. Prohibited: standalone, trademarks.
- Traps: standalone OST violation; non-exclusive branding fatigue; Content ID claims.
- Fix: License Certificate per track; dispute via YouTube Studio.

## C. Validation
- Martins: intolerance to repetition; 5 techniques (inversion, mute melody, 3× silence, random playlist, expandable end).
- Mute-rate proxy (Game Audio Co). Abratabia checklist (headphones, smooth, responsive, stable).
- Reference A/B.

## D. What to avoid
- Constant loop fatigue (Prunty). Wrong trigger (Morrowind). Over-engineering.
- Abrupt transitions (quantize). Mobile stem cap. Late audio.

## E. Shipped
- ItB (deploy silence; desperation; guitar). FTL (explore/battle pairs).
- XCOM 2 (adaptive). JC4 (vertical+horizontal hybrid).

## Implemented this round (code)
- **js/music.js:** hysteresis (4s min per state; battle exempt).
- **AUDIO-SPEC.md:** production music spec appended.
- 3,494 lines (+5).

## F. Sources
splice · abratabia · pcgamer · pixabay · gamedeveloper · gameaudioco · hud · ftl wiki · r/gamedev
