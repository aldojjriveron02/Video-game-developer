# I18n Part 4 (Production & Jam) — Findings (Round 153)
**Date:** Wed 2026-10-14 ~15:05 EDT · **Source:** live web research (crowdin ×2, itch.io, strayspark, ldjam, rumorgames, transang, dev.to, github, stardewvalley ×2)
**Project:** Mecha Protocol — i18n (Phase 3, pre-jam)

## A. Production
- Crowdin (8 principles; key discipline; Japan = mandatory l10n; AI pitfalls; community workflow).
- Crowdin Free = 60K words (effectively free at this scale).

## B. Jam language
- LD: no language requirement. itch.io (tick only shipped languages; tag AI use).
- Steam disclosure (disclose what player experiences; "if no fluent human reviewed, say that").
- Rumor Games (discoverability = cover, tags, browser build).

## C. Fonts
- Noto Sans JP = 65K glyphs, 5.5MB/weight; slicing (unicode-range / pyftsubset).
- Canvas breakage (CJK no spaces; 1.4-2× ratio; measureText auto-fit).
- Font gating (document.fonts.ready — validates existing gate).

## D. What to avoid
- MT hallucination (locked glossary). Hardcoded strings. Date/number formats.
- Key reuse. UI paradox. Translating churn. itch.io mislabeling.

## E. Shipped
- Vampire Survivors (spreadsheet→JSON, MIT). Stardew Valley (EN first, partners post-launch).

## Implemented this round (code)
- **js/data.js:** JAM_BUILD flag (false = dev; true = EN-only jam).
- **js/i18n.js:** SUPPORTED gates on JAM_BUILD (JA hidden when true).
- **I18N-SPEC.md:** production spec appended (jam decision, handoff package, fonts, traps, disclosure).
- 3,716 lines (+10).

## F. Sources
crowdin ×2 · itch.io · strayspark · ldjam · rumorgames · transang · dev.to · github · stardewvalley ×2
