# i18n Part 3 (Font & String Hygiene) — Findings (Round 127)
**Date:** Thu 2026-10-15 ~04:55 EDT · **Source:** live web research (fonttools, machs.space, web.dev, mozilla hacks, apple, lokalise, microsoft, crowdin, phrase, translatebot, crobmaster, ad-astra)
**Project:** Mecha Protocol — i18n (Phase 3 week-1)

## A. Font
- pyftsubset: --unicodes/--text/--text-file, --flavor=woff2, --layout-features.
- unicode-range: 315KB→33KB (~89%).
- Noto Sans JP ~3.4MB/weight — never ship whole; Google Fonts text= saves 97.5%.
- Canvas: @font-face downloads on first use only; no auto re-render → gate on document.fonts.ready.
- iPhone: Hiragino Kaku Gothic ProN fallback chain. FORBID generic Noto Sans CJK (Han Unification).
- Audit: harvest keys + literals + ASCII; --text-file=; smoke-test all strings.

## B. String hygiene
- Never split: one sentence/key, ICU, no concatenation.
- Namespaced snake_case. Per-context duplicates. No god keys.
- Pseudolocalize: 40% expansion, ①-⑨, ^delimiters^ (Microsoft recipe).
- Expansion: DE/FI +30-40%; design +40% worst case; test LONGEST strings.

## C. Validation
- LQA vs functional QA checklist. Crowdin pre-launch checklist.
- Screenshots per key + pseudo-locale build (canvas ≠ in-context JS).

## D. What to avoid
- MT hallucination (never MT-only for JA). Tofu (audit early). Concatenation. Pronoun traps (write pronoun-free).

## E. Shipped
- Tap Tap Picture Book: 5.01MB→557KB (~89%), per-char fallback, dry-run rule.
- Unity TextMeshPro: SDF atlases + fallback chains (unverified details).

## Implemented this round (code)
- **js/game.js:** font preload gate (document.fonts.ready, 2.5s timeout).
- **css/style.css:** Hiragino fallback chain.
- **I18N-SPEC.md:** production i18n spec appended.
- 3,447 lines (+14).

## F. Sources
fonttools · machs.space · web.dev · mozilla · apple · lokalise · microsoft · crowdin · phrase · translatebot · crobmaster
