# Audio Part 2 (Sound Design & Music) — Findings (Round 126)
**Date:** Thu 2026-10-15 ~03:55 EDT · **Source:** live web research 2026-10-14/15 (splice.com, gamedeveloper.com, asoundeffect.com, developer.mozilla.org, pcgamer.com, daracrawford.com, linkedin.com, reddit.com)
**Project:** Mecha Protocol — audio

## A. Sound
- Mraz (procedural: infinite variation, CPU budget); Prosser (pitch 1.06^N); MDN (PannerNode, iOS).

## B. Music
- Prunty (silence verbatim, implementation > composition, fatigue); Crawford (XCOM horizontal).

## C. Validation
- Jacobsen (nuisance score); LinkedIn (analytics); Reddit (mute test, <5%).

## D. What to avoid
- Constant fatigue; frequency clashes; identical samples; loudness-trap; wrong placement.

## E. Shipped
- ItB (silence); XCOM; Peggle Blast; Two Dots.

## Implemented this round (code)
- **js/sfx.js:** pitch variation (±1 semitone, 1.06^N, per play; anti-fatigue).
- 3,433 lines (+3).

## F. Sources
splice · gamedev · asoundeffect · mdn · pcgamer · crawford · linkedin · reddit
