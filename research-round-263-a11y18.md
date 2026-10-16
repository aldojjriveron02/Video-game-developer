# A11y Part 18 (Final Verification) — Findings (Round 263)
**Date:** Wed 2026-10-15 ~01:47 EDT · **Source:** live web research (baker, abratabia, hamilton, mdn, web.dev)
**Project:** Mecha Protocol — a11y (pre-jam; final verification)

## A. Mechanics
- Gate-risk order (T-48h → T-2h): motor (keyboard-only run, no mash-QTEs, relaxed-mode toggle) → safety gates (flash/motion audit; shake toggle gates EVERY effect) → visuals (squint test, font sizes, no color-only) → audio/cognition (visual alternatives, master+SFX/music/mute, on-screen objectives) → storefront (document controls + a11y-features list on the submission page).
- Fail protocol: log every failed gate; fix it, disable-by-default behind opt-in, or document honestly on the submission page — then retest. No warning-only "safety theater."
- Framing (Baker via Hamilton): "There is no fixed bar for you to hit or miss. Instead, look at accessibility as an optimization process…" Post-jam: structured postmortem.

## B. Validation
- Abratabia order: automated (axe/Lighthouse; contrast analyzers) → keyboard-only (tab order, visible focus, no traps) → screen reader (NVDA/VoiceOver: menus, dialogue, inventory, settings, game state) → colorblind sim (Color Oracle) + 200% zoom → audio-off playthrough (no audio-only cues) → disabled playtesters when possible.
- Canvas games specifically: all menus/settings as REAL DOM (not canvas-drawn) so assistive tech reaches them; maintain focus outline; every canvas state change mirrored in DOM/live-region.

## C. Techniques
- Live-region discipline: single polite region, assertive for genuinely urgent only, aria-atomic, clear-then-set via rAF (no queue pile-up); announce only what changed, at game pace — no log-dump narration.
- 3-state toggles + persisted settings: granular, not global on/off (Grounded per-element HUD; AC icon/HUD/background sliders). Store settings SEPARATELY from save data (deleting saves must not nuke preferences); export/import them (Abratabia). A toggle that misses effects is worse than none.
- High contrast: ≥4.5:1 text (7:1 body per Xbox); high-contrast HUD option (Hyperdot dark+light at 7:1; TLOU2 letterboxed subtitles + speaker colors + direction arrows).
- Bake it in (Baker): symbol + color, not color alone (Two Dots/Among Us/Sea of Thieves); Fortnite "visualize sound effects" as multi-channel option. Celeste assist mode = options-menu gold standard.
- Baker: OS reduce-motion "is a safety net and not a solution" — in-game controls must ACTUALLY disable effects.

## D. What to avoid
- Live-region spam (throttle/coalesce to one polite region at game pace).
- Undisablable motion (gate at effect source, not UI label).
- Color-only info (Xbox: graying pairs with lock icon; Color Oracle in final 12h).
- Keyboard traps (canvas swallowing Tab).
- Safety theater (photosensitivity warning that changes nothing; OS-only reduce-motion as the sole control).
- Conflicting elements (HUD pile-ups unreadable for cognitive/vision users — customize, don't overlay more).

## E. Shipped
- Celeste Assist Mode: game speed, stamina, air-dashes, invincibility — normal menu, not cheat. Difficulty-as-options expanded audience; normalized "assist" as good design.
- TLOU2 (2020 Innovation in Accessibility): subtitles 3 sizes + letterbox backgrounds + speaker colors/names + direction arrows; high-contrast modes; 60+ toggles. ~30% of Uncharted 4 players used one-hand motor options — universal-design value.
- Hades God Mode: subtle compounding damage-resistance each run — one small persistent opt-in that expanded who could finish. Universal-design essence.

## Implemented this round
- **CANVAS PRESENTATIONAL MARKUP (index.html):** the three canvases had no ARIA presentation role. Per Abratabia: canvas purely presentational (all interactive state mirrored in #sr-announce). Added role="img" + aria-label to terrain-layer ("Battlefield terrain"), unit-layer ("Mecha units on the battlefield"), fx-layer ("Combat effects and animations").
- **Verified:** settings stored separately from save data ('mecha-protocol-fx', 'mecha-protocol-volume', 'mecha-protocol-perf' — deleting saves can't nuke preferences); in-game ✧ toggle gates ALL effects (OS reduce-motion is the safety net, not the solution — Baker).
- +3 → **4,436 lines**. index.html patched; JS untouched (no node check needed for HTML, markup verified by grep).
- A11Y-SPEC.md: final verification (below).

## F. Sources
baker · abratabia · hamilton · mdn · web.dev · xbox · celeste · tlou2 · hades
