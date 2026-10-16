# A11y Part 23 (Verification Round 5) — Findings (Round 308)
**Date:** Wed 2026-10-15 ~06:15 EDT · **Source:** live web research (gag, xag 117, apx, ablegamers)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 5)

## A. Mechanics
- Color-independence audit (GAG): "strip all color (grayscale or CVD simulation) and verify every state is still readable." 8-10% of males have red/green difficulty. "Color must be a backup channel to shape/symbol/text, never the only channel." Best practice: named presets (deuteranopia/protanopia/tritanopia/custom) + fully custom. "Verify with simulators AND with colorblind playtesters." Warns against palette-filter "colorblind modes" — "players hate whole-game recoloring; prefer symbol integration." For this game: ▲/▼ markers = the prescribed solution.
- Motion-redundancy audit (XAG 117; GAG): "can every motion event be fully disabled, paused, or frequency-controlled?" XAG 117: "avoid camera shake, bobbing, motion blur, or provide an option to turn them off." GAG: "don't lump everything into one 'effects' toggle — offer separate granular options for strobes, shake, camera, particles, blur." With reduced-motion + shakeIntensity=0, canvas loop must show zero motion; every shake cue needs a non-motion redundant signal.
- Text-scale audit (GAG): "no single default size suits everyone" — adjustable text required. Best practices: UI scaling (EVE), magnified fonts (FFXIII-2), configurable typography. Audit: every tier, no clipping/overlap, layout reflows.

## B. Validation
- Disabled playtesters (AbleGamers): "paid remote/on-site play-testing with disabled gamers — this is the industry standard for validation, not a nice-to-have." APX built from research with players with disabilities.
- OS matrix: test against platform/OS a11y settings, not just in-game toggles — reduce-motion flags, system text-size/zoom, screen readers, platform remapping. For web canvas: prefers-reduced-motion per browser/OS, browser text scaling vs canvas HUD, keyboard-only with OS aids.
- Honest documentation (GAG): "never describe a game as 'epilepsy safe'; instead describe what each setting literally relates to." List what IS covered and what is NOT.

## C. Techniques
- Redundant channels (APX "Second Channel"): "players can select additional information channels across different modalities." Fortnite "Visualize Sound Effects"; L4D2 "Full Captioning"; Madden 18 rumble kick meter; Street Fighter distinct sounds per move.
- Granular toggles (Celeste; L4D2; GAG): Celeste Assist — speed, stamina, dashes, invincibility, skip chapter separately. L4D2 captions: none/subtitle-only/full (tiered because "all or nothing" overwhelmed). GAG: split strobes, shake, camera, particles, blur.
- Presets (TLOU2): accessibility presets for blind/low-vision, deaf/hoh, motor — "curated bundles so players can start fast and then fine-tune." Color-vision presets per GAG.
- Remapping (TLOU2; GAG; XAG): full remap + toggle-vs-hold per action = baseline. Keyboard game: every action rebindable + visible focus.

## D. What to avoid
- Single-channel info (APX): "players who cannot reliably receive a modality are locked out." Color-only, audio-only, shake-only all fail.
- All-or-nothing toggles (GAG; L4D2): "one master 'accessibility' switch forces players to take more than they need or abandon the game."
- Aspirational claims (GAG): "epilepsy safe," "fully accessible," palette-shift as "colorblind mode." "Describe what the setting does, never what harm it prevents." Inflated claims = fastest way to lose trust (pro reviewers).

## E. Shipped
- Celeste: Assist Mode — speed 50-100%, infinite stamina, extra dashes, invincibility, skip chapter. "Granular and non-judgmental — players tune exactly the variable they struggle with; the game never shames them."
- TLOU2: 60+ settings with presets + full remap + toggle/hold + color-vision options + shake toggle. "Presets got players in fast; granular controls let fine-tune — the AAA benchmark."
- Forza Motorsport: Blind Driving Assists — configurable audio cues (track-edge, steering, turn warnings). "Second Channel applied ambitiously — a driving game playable without sight."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** toggle granularity. `shakeIntensity` 0/1/2 (Off/Reduced 30%/Full) = granular shake control — the highest vestibular risk gets the granular toggle (GAG requirement). `reducedEffects` = master calm switch (gates hit-stop, squash, flash, knockback, render scale). Pragmatic jam-scale split: the most problematic effect (shake) is granular; the rest group under "calm." OS flag auto-enables reducedEffects at boot (respects system preference).
- **A11Y-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
gag · xag 117 · apx · ablegamers · celeste · tlou2 · forza
