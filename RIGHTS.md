# RIGHTS.md — Asset Origin & License Log
**Created:** 2026-10-14 (Round 82 — preservation research). **Purpose:** make any future source release, archive, or community continuation legally clean. Updated whenever a new asset enters the build.

## Code
- All game code (`build/js/`, `index.html`, CSS): written by El Loko (AI assistant) for Aldo, 2026. **License: UNDECIDED — Aldo to choose** (candidates: MIT for max reuse, GPL-3.0 for copyleft, or split code-GPL/art-proprietary à la Tales of Maj'Eyal). No license file ships until Aldo decides.

## Audio
- All SFX: synthesized in-browser via Web Audio (sfx.js) — no samples, no third-party audio. **No rights encumbrance.**
- Music: NO tracks shipped. `audio/README.md` documents the plan (Aldo to pick 2 Pixabay tracks → `audio/`). **When added: log each track's Pixabay license URL here.**

## Visuals
- All mech/unit/tile art: drawn procedurally on canvas (mech.js) — no image assets. **No rights encumbrance.**
- PWA icons (`build/icons/`): generated for the project. **Project-owned.**
- Fonts: system fonts only (no bundled webfonts as of 2026-10-14). **No rights encumbrance.** (If a CJK font is bundled for JA later: log its license here — ship-blocker per I18N-SPEC.md.)

## Text
- All writing (barks, briefings, tutorials, UI): original. EN by El Loko; JA draft by El Loko (native-speaker pass pending — Aldo's item).

## Third-party code
- None. Zero dependencies — vanilla JS, no npm packages in the shipped build, no CDN runtime dependencies.

## Telemetry
- GameAnalytics SDK: loaded only if keys are pasted (Aldo's item). Not bundled. No rights issue for the archive build (which ships without keys).

## Rules
1. Every new asset gets a line here BEFORE it ships.
2. "Free to download" ≠ "free to ship" — log the actual license, not the download page.
3. The archive/eternal build must contain ONLY assets logged here as clean.

## CDN Dependencies (Round 95 — preservation audit)
- **Google Fonts (Noto Sans JP):** loaded via fonts.googleapis.com. FALLBACKS EXIST: -apple-system, SF Pro Text, Segoe UI, sans-serif. If CDN dies, Japanese renders in system fonts. **Eternal build: vendor the woff2 files.**
- **GameAnalytics SDK (unpkg):** loaded async. Game works without it (consent-gated, optional). **Eternal build: remove entirely (zero network calls).**
- **Rule:** no runtime dependency without a fallback. The eternal build has ZERO network calls.
