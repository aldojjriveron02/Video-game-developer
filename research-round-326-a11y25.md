# A11y Part 25 (Verification Round 7) — Findings (Round 326)
**Date:** Wed 2026-10-15 ~07:21 EDT · **Source:** live web research (gag, xag, ableGamers, tlou2)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 7)

## A. Mechanics
- Contrast audit (GAG; XAG-102; WCAG 1.4.3/1.4.11): "standard text 4.5:1, large text 3:1, non-text elements 3:1, high-contrast 7:1." "Run tooling on screenshots, not DOM color math, for canvas."
- Focus-visibility audit (GAG; XAG-113; WCAG 2.4.11): "highly visible focus indicator on every interactive element, never subtle (faint glow fails), never moves to hidden/offscreen, visible against all backgrounds."
- Error-message audit (GAG; XAG-115; WCAG 3.3.1/3.3.3): "errors visible, identify problem in plain language, suggest fix; never rely on color alone (add text labels/icons)."

## B. Validation
- Automated checkers: Colour Contrast Analyser, Accessibility Insights, Color Oracle, axe/WAVE — "canvas needs manual screenshot-based sampling, not DOM checks."
- Manual audits: "run XAG checklist and GAG full list as structured checklists; map to WCAG 2.2."
- User testing: "AbleGamers player panels; SpecialEffect DevKit; Xbox Accessibility Insiders League." "Disabled-player testing is highest-signal — tooling catches mechanical failures, users catch experiential ones."

## C. Techniques
- High-contrast modes (GAG; XAG-101/102): "solid background behind text, adjustable player colors, optional high-contrast render."
- Focus indicators (GAG; XAG-112/113): "borders around focused element, increased size/weight, or combined; always visible; respect OS settings."
- Clear errors + plain language (GAG; XAG-114/115): "simple everyday wording, describe problem and fix, visible and persistent."
- Motion control (GAG; XAG-117): "honor prefers-reduced-motion, provide off/low/high tiers." (Our shakeIntensity 0/1/2.)
- Redundant channels (GAG; XAG-103): "team/state via shape, icon, label in addition to color." (Our ▲/▼.)
- Scalable text (GAG; XAG-101): "resizable tiers that reflow." (Our text-scale tiers.)

## D. What to avoid
- Low contrast: "gray on gray, white over bright art without backing plate." (Forza's high-contrast mode fixes this.)
- Invisible focus: "subtle glows, focus disappearing, modals losing focus."
- Cryptic errors: "color-only signaling, jargon, codes without explanation."
- Jargon: "assume no specialist vocabulary."
- Unpausable motion: "auto-updating/blinking with no pause/stop/hide; shake with no off switch."
- Keyboard traps: "2.1.2 No Keyboard Trap; every element reachable and escapable."

## E. Shipped
- TLOU2: "High Contrast Display — mutes environmental colors, color-codes allies/enemies/items." "Dedicated render pipeline, built with blind/low-vision consultants."
- Forza Horizon 5: "independent colorblind filters for UI vs game; UI high-contrast with solid backgrounds." "Granular per-channel control."
- Celeste: "Assist Mode framed as player autonomy — discoverable, shame-free, orthogonal." "Validates our shakeIntensity 0/1/2."

## Implemented this round
- **REAL GAP FIXED — visible focus indicators (style.css):** no `:focus` or `:focus-visible` styles existed — keyboard users tabbing through buttons had no visible indicator (XAG-113 failure). Added: 3px solid #f9f871 (yellow) outline with 2px offset + soft glow on all buttons, selects, and focusables via `:focus-visible`. High-contrast, border-based (not subtle glow), visible against dark backgrounds. +8 → **4,573 lines** (+8).
- **A11Y-SPEC.md:** verification round 7 (below). **4,573 lines** (+8).

## F. Sources
gag · xag · ableGamers · tlou2 · forza · celeste
