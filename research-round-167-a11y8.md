# A11y Part 8 (Jam & Validation) — Findings (Round 167)
**Date:** Wed 2026-10-14 ~20:05 EDT · **Source:** live web research (gag ×4, abratabia, webaim, colortutorial, pcgamingwiki, steam, playstation, naughtydog, tencent, polygon, ablegamers)
**Project:** Mecha Protocol — a11y (Phase 3, pre-jam)

## A. Jam a11y
- GAG (15%/20%; 8-10% males; basic tier; design-from-start cheapest).
- Tencent jam guide. Polygon.

## B. Validation
- abratabia 6-step (audits → keyboard-only → screen reader → CVD sim → 200% zoom/muted → playtesters).
- WebAIM (4.5:1 / 3:1). Touch targets (44px iOS; 48dp Material).

## C. Techniques
- Okabe-Ito palette (8 hex; blue+orange safest; grayscale test; cap 4-6).
- GAG text scaling. Redundant cues (TLOU2). Per-palette schemes (never whole-screen).

## D. What to avoid
- Color-only. Sound-only. Tiny text. Whole-screen filters. Screen shake.
- Silent dynamic content. Keyboard traps.

## E. Shipped
- Celeste (Assist Mode; stigma-free; our 4-assist model). TLOU2 (60+ settings; presets).
- ItB (structural a11y; red icons = color-only failure in our genre).

## Implemented this round (spec only — code already complete)
- **A11Y-SPEC.md:** jam decision (basic tier) + reduce-motion verification + validation + traps.
- Reduce-motion: toggle + OS respect + source-zeroing all verified present.
- 3,889 lines (+0).

## F. Sources
gag ×4 · abratabia · webaim · colortutorial · pcgamingwiki · steam · playstation · naughtydog · tencent · polygon · ablegamers
