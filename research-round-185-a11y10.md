# A11y Part 10 (Final Check) — Findings (Round 185)
**Date:** Wed 2026-10-14 ~18:10 EDT · **Source:** live web research (gag, itch.io, xag, accessjam, axe, wave, w3c ×3, specialeffect, gmtk, tinya11y)
**Project:** Mecha Protocol — a11y (Phase 3, pre-jam)

## A. Jam a11y
- GAG Basic (~29 guidelines). itch.io 8 filters. XAG 121 (publish features pre-jam).
- AccessJam. WCAG AA (4.5:1 / 3:1).

## B. Validation
- axe/WAVE (not canvas). NVDA/VoiceOver/TalkBack. Keyboard-only protocol.
- Contrast checker. CVD sim. Photosensitivity (≤3 flashes/sec). SpecialEffect.

## C. Techniques
- Focus (2.4.13: 2px, 3:1). Contrast (4.5:1/3:1). Labels (canvas DOM mirror).
- Touch (WCAG 24px; Apple 44pt; Material 48dp — our 48px clears all).
- Motion (reduced-motion on all juice). Color-independence (1.4.1). Tiny A11y Kit.

## D. What to avoid
- Audio-only cues. iOS autoplay (already fixed). Accessibility-washing.
- Canvas keyboard traps. itch page a11y. Settings-vs-design (GMTK).
- Button-mashing.

## E. Shipped
- Tiny A11y Kit (MIT). AccessJam entries. itch.io tagged games.
- Celeste Assist Mode. SpecialEffect DevKit.

## Implemented this round (audit)
- **Verified compliant:** reduced-motion on all juice; iOS audio; 48px targets;
  no color-only; no audio-only.
- **A11Y-SPEC.md:** ship-ready decision + pre-jam checklist + flip condition.
- Spec only, +0 lines. 4,095 lines (+0).

## F. Sources
gag · itch.io · xag · accessjam · axe · wave · w3c ×3 · specialeffect · gmtk · tinya11y
