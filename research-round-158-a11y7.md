# A11y Part 7 (Jam & Validation) — Findings (Round 158)
**Date:** Wed 2026-10-14 ~16:55 EDT · **Source:** live web research (ian-hamilton, gameaccessibilityguidelines, abratabia ×3, celeste.ink, naughtydog, reddit)
**Project:** Mecha Protocol — a11y (Phase 3, pre-jam)

## A. Jam a11y
- Hamilton's top 5 (simple controls; read time; high contrast; no color-only; no sound-only).
- GAG basic tier first.

## B. Validation
- Abratabia 6 steps (automated; keyboard; screen reader; colorblind sim; zoom+mute; disabled testers).
- Standards (WCAG 2.2; XAGs; GAG tiers; EU EAA).

## C. Techniques
- Colorblind (8% men; grayscale test; redundancy default; Okabe-Ito; CSS variables).
- Motor (remappable; single-input; 44×44). Cognitive (granular difficulty; plain language).
- Audio (no sound-only; captions; visual indicators).

## D. What to avoid
- Color-only info (#1 trap). Sound-only cues. Tiny controls. No remap.
- Time limits. Assist stigma (Celeste's stamp removed).

## E. Shipped
- Celeste (Assist Mode; stigma reversal). TLOU2 (60+ settings; presets).
- ItB (colorblind mode).

## Implemented this round
- **CODE AUDIT:** all 6 color/sound-only checks pass (Rounds 65/78/138 + stinger + heat alarm + assist framing).
- **A11Y-SPEC.md:** jam decision + zero-cost validation + post-jam plan appended.
- No code changes needed — research validated existing work. 3,799 lines (unchanged).

## F. Sources
ian-hamilton · gameaccessibilityguidelines · abratabia ×3 · celeste.ink · naughtydog · reddit
