# Localization — Production Spec (Round 81)
**Status:** JA draft exists in i18n.js; native-speaker pass + glossary + Crowdin decision are Aldo's items. This spec is the production target.

## Word count (measured 2026-10-14)
- **189 string keys, 1,087 EN words, 519 unique** (43% repetition — TM-friendly).
- Bucket: hyper-casual (500–2,000). Text-light by design.
- **JA budget:** ~$140–$200 agency ($0.13–0.18/w) or ~$100–$130 solo native; +50% LQA ≈ **$210–$300 total**. Affordable — not the $2.7K mid-core estimate.
- Only 2 hardcoded strings found ("Dismiss", "Multiple Volume Controls") — externalize before slice.

## Glossary (lock FIRST — before any translation)
- Mech classes, limb names, heat/chevron terms, pilot ranks, weapon names, VEX titles.
- Per-pilot JA voice guide: fixed keigo level + speech register (p0 leader / p1 hothead / p2 professional must stay distinct — Silksong lesson).

## Technical
- i18n.js → JSON locale files keyed by string ID (ja-JP.json bundled).
- ICU MessageFormat placeholders, never concatenated, reorderable variables.
- UTF-8; locale codes (ja-JP), never flags.
- Expansion headroom: +40% for DE/RU; JA density test on hangar/combat UI at iPhone widths.
- CJK font plan: subset Noto Sans JP or verified system fallback (ship-blocker, not polish).
- Pseudo-localization pass before slice locks.
- Text-free tutorial graphics where possible.

## Process
- **Crowdin:** hybrid Balatro model — pro native JA for launch, Crowdin open post-launch (corrections + future languages). Decision is Aldo's.
- **No MT shipped.** Never change a shipped translation without versioning + reason.
- **Beta the JA build** with Japanese players before slice done (Stardew lesson).
- LQA: native speaker plays the build — overflow, line breaks, variables.

## Storefronts
- Localize itch + Steam page + screenshots (JA). Playism as the JP route if Steam gate passes.

## Round 88: +6 bark lines (heat50 × 3 pilots × EN/JA)
- Word count now ~1,100 (was 1,087). JA budget unchanged (~$210–$300).

## Round 111: Crowdin production spec (localization part 2)
**$0 path:**
- Free plan (1,087 hosted words for beta JA fits).
- Open Source license (request it).
- Community: Translation → Voting → Proofreading.
- Buy ONCE: "Proofread by vendor" pass (hybrid model).
- Net Rate Scheme: TM matches discounted; zero-edit proofread = 30% rate.

**Per-pilot JA voice guide (JA-only Style Guide):**
- One row per pilot: pronoun (ore/boku/watashi/atashi), sentence endings, keigo level, address forms.
- NEVER default あなた (distant/condescending). Use name+suffix, title, or omission.
- Register-shift rule for VEX arc (stranger → comrade).
- Feeds Crowdin AI QA checks automatically.

**Glossary (seed BEFORE opening project):**
- Concepts: chassis names, archetypes, heat/chevron terms, pilot names.
- Translatable = OFF for proper names.
- Volunteers: draft-term proposals only (managers approve).
- Status "not recommended" for bad coinages.

**Font pre-flight:**
- Subset Source Han Sans / Noto Sans CJK to actual corpus.
- Gate canvas on document.fonts.ready (no tofu).
- Pseudolocalize NOW (40% expansion buffers).

**Automation (XIVLauncher pattern):**
- Scheduled: push source → Crowdin, pull completed → auto-PR.
- Crowdin = single source of truth. Regenerate strings from it.

## Round 127: Production i18n spec (font & string hygiene)
**Font pipeline (IMPLEMENTED in build):**
- Boot gated on document.fonts.ready (2.5s timeout fallback) — game.js.
- Font stack: 'Noto Sans JP','Hiragino Kaku Gothic ProN','Hiragino Sans',sans-serif — style.css.
- Per-locale pyftsubset woff2 (harvest 189 keys + literals + ASCII 0x20-0x7E).
- Re-run subsetting on ANY text change (dry-run CI check).
- FORBIDDEN: generic Noto Sans CJK as JA fallback (Han Unification).

**String hygiene:**
- One complete sentence per key. No concatenation. ICU for plurals.
- Namespaced snake_case (bark.ace.kill_confirm). Per-context duplicates.
- English source pronoun-free (no he/she/his).
- Crowdin pseudo-locale (40% expansion, ①-⑨, ^delimiters^).

**Validation:**
- Screenshot per key in Crowdin. Review per mission/archetype.
- Longest-string +40% check. Native-speaker LQA for JA barks.
- MT may draft; JA voice/barks REQUIRE native human review.

## Round 153: Production i18n spec + jam language decision (slice)
**JAM LANGUAGE DECISION: EN-only for LD60 (IMPLEMENTED via JAM_BUILD flag).**
- data.js: JAM_BUILD = false (dev). Friday night: set true → JA hidden from toggle.
- Rationale: 72h jam; ratings hinge on instant playability; LD has no language rule;
  unreviewed JA risks tofu/truncation; itch.io guidance = only tick shipped languages.
- Jam page: tick English only. JA draft stays in repo (post-jam: Crowdin + native reviewer).

**Native-speaker handoff package (post-jam, $0):**
- Crowdin free project (60K words; glossary/QA/screenshots included).
- Glossary: mech names, VOICE_BIBLE vocab, VEX register, heat/limb nouns.
- Style guide (one page): VEX observant; barks terse military.
- Screenshots of every UI surface; string keys with context; strings frozen first.
- Recruit one native JA reviewer (Translation→Voting→Proofreading).

**Font plan:** Hiragino first (iOS/macOS, free); pyftsubset Noto Sans JP fallback
(Android/Windows); extend document.fonts.ready gate; pre-warm glyphs at boot.

**Canvas traps (encoded):** never split(/\s+/) for JA (CJK-aware breaker);
measureText auto-fit; tofu detector in test matrix; DOM↔canvas break agreement.

**MT disclosure:** JA draft is AI-assisted — if it ever ships, disclose honestly:
"AI-assisted draft, not yet reviewed by a fluent speaker." Never imply human review.
