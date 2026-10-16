# Localization / i18n at $0 — Findings (Round 23)
**Date:** Tue 2026-10-13 ~22:04 EDT · **Source:** live web research 2026-10-13 (Valve/GDC data, Game Developer, MDN, web.dev, DeepL/Crowdin docs)
**Project:** Mecha Protocol — reaching the audience the art style was born for

## A. Language priority
- Steam full-year 2024 (Valve, GDC 2025): Simplified Chinese **33.7%**, English 33.5%, Russian 9.3%, PT-BR 2.8%, German 2.5%, Korean 2.2%, French 2.1%, **Japanese 1.7%**. itch.io: US 32.5%, RU 5.4%, DE 4.8%, UK 3.8%, BR 3.6%.
- **The "strong Japanese mecha audience" is real as genre affinity, NOT as raw share** — Japan is ~2% of Steam while China is ~34%.
- Dev consensus: "English, Russian, and Chinese" rule of thumb; Chinese repeatedly the #1 ROI language; EFIGS expected as baseline; Russian players "leave low ratings for games that lack a Russian version."
- **Our top-5:** English (source) → Japanese (genre bet, differentiator) → Simplified Chinese (33.7%, #1 ROI) → Russian (9.3%, most vocal) → German (2.5%, high-spend EU). Bench: Korean, PT-BR.

## B. Code architecture (vanilla JS)
- JSON string tables per language (`/locales/en.json`); lazy-load via fetch; fallback chain requested → base → **English, never blank**.
- Namespaced keys (`hud.end_turn`); one `t(key, vars)` with `{placeholder}` interpolation; NEVER concatenate sentences (breaks word order).
- Plurals via `Intl.PluralRules` (EN 2 forms, PL 4, AR 6, JA 1); `Intl.NumberFormat`/`DateTimeFormat` for numbers/dates.
- Canvas text: **preload fonts before first paint** (`document.fonts.load` — canvas bakes fallback into pixels); own line-breaker (CJK breaks on characters, not words); `measureText` auto-fit; `ctx.direction='rtl'` if ever needed.
- What breaks: fixed-size panels (**design +30–40% slack**; DE/NL +30%, FI/HU +50%; CJK contracts); run **pseudo-localization** early (`[!!! Éñd Tûrn !!!]`) to catch overflow before real translations exist; text baked into art; gender/word-order logic.

## C. Free translations
- Crowdin free plan / Weblate free hosting: **OSS-only** — a closed commercial game doesn't qualify. Google Sheets + volunteers = the classic $0 indie pipeline (fans "found us themselves").
- **DeepL API Free: 500,000 chars/month (~80–100K words)** — ~50–100× our game's text; JSON supported. Quality: best MT engine, strongest on European pairs; devs rate MT "usually pretty bad" beyond simple UI; cautionary case: translators publicly flagged a dev's MT'd Steam page.
- **Never machine-translate the store/itch page** (conversion surface; partial translation → negative-review waves). MT for in-game UI scaffolding is acceptable; hand-write/review store page + story.

## D. Fonts
- **Noto family (OFL, free):** Noto Sans (Latin/Greek/Cyrillic) + Noto Sans JP (Hiragana/Katakana/Kanji) + KR/SC/TC.
- CJK fonts are megabytes (all of Noto = 1.1GB+ ZIP). Strategies: (1) hotlink Google Fonts CSS (unicode-range auto-subsets; CDN dependency); (2) self-host WOFF2 subsets; (3) `pyftsubset` minimal build (regenerate on string changes).
- Prototype answer: Google Fonts link + system-CJK font-stack fallback — free, covers real devices.

## E. RTL: CUT for now
- Neither Arabic nor Hebrew is in Steam's top languages; RTL canvas is real work (Farsi digit-symbol gotcha documented). Russian + EFIGS massively outrank on ROI. Tactics note: never mirror the grid (spatial ≠ reading order).

## F. Locale detection
- Resolution order: `?lang=ja` URL param (shareable/testable) → saved `localStorage` choice → `navigator.languages` prefix-match → English. Always ship an in-game switcher; set `documentElement.lang`.

## G. Scope discipline (the honest answer)
- Word counts: 12 Is Better Than 6 ~15K words; Stoneshard 40K+; our prototype **~500–2,000 words**.
- **Do NOT fully localize at prototype stage.** Build the i18n architecture NOW (retrofitting is "far more complicated"); defer translation until text lock. Exception: **Japanese-only experiment** (MT draft + native review) to test the audience thesis; localize the itch page into JA/ZH (store-page translation moves conversion).

## Applied to Mecha Protocol (implement-immediately, this round)
- New `js/i18n.js`: `I18N` module — `t(key, vars)` interpolation, en full dict, **ja draft dict** (short UI labels, native-review-needed; story text falls back to English), detection (?lang → saved → navigator → en), `setLocale`/`cycle`, `documentElement.lang`.
- `data.js`: all display strings → keys (weapons/armor/limbs/difficulty/missions).
- `game.js` + `hangar.js`: every user-visible string through `t()` (HUD, briefing, hangar, forecast, floaters, taunts, banners, A2HS hint).
- `index.html`: 🌐 language button (persisted, re-renders visible overlay), Noto Sans JP font link; `sw.js` caches i18n.js.
- Verified in node: en/ja lookups, interpolation, ja→en fallback chain, every data-driven key resolves. 1,558 lines total, all syntax-clean.

## H. Sources
store.steampowered.com/hwsurvey · quantumrun.com + icon-era.com (Valve GDC 2025) · similarweb.com/website/itch.io · gamedeveloper.com (localization roundtable 2020) · automaton-media.com · serkantoto.com · steampageanalyzer.com (store-page localization) · MDN (Navigator.language, Canvas font, Font Loading API, Intl.PluralRules) · web.dev (reduce webfont size) · fonts.google.com/noto · github.com/jfcherng/Noto-Sans-JP-CSS · crowdin.com/pricing · po-file.com · support.deepl.com · developers.deepl.com · weglot.com · r/gamedev (MT thread) · locize.com (plural rules) · simplelocalize.io (pseudo-localization) · frontendchecklist.io
