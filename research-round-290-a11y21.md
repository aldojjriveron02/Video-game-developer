# A11y Part 21 (Verification Round 3) — Findings (Round 290)
**Date:** Wed 2026-10-15 ~05:03 EDT · **Source:** live web research (wcag, gag, xag, peat, celeste, tlou2)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 3)

## A. Mechanics
- Content-threshold audit (WCAG 2.3.1; GAG; XAG 118): the numeric gates — ≤3 flashes/sec (W3C G19); flashing area small (G176); PEAT tool (G15). GAG for games: no flash sequence >5s; no >3 flashes/sec covering 25%+; no moving repeated patterns 25%+; no static repeated patterns 40%+. XAG 118: ALL games tested for photosensitive triggers regardless of intent; flash = ≥10% luminance change. PEAT (Trace RERC, free): captures a recording, evaluates luminance-flash + red-flash sequences. The audit = capture-based automated pass over every game state, worst-case conditions (max simultaneous pulses), measured against the gates.
- OS-flag boot test (web.dev; MDN; Smashing): query the OS flag BEFORE the first rendered frame; boot directly into the reduced variant — no motion shown before the flag is read. "Reduce, not remove" is the spec word, but games legitimately treat it as a full kill switch for non-essential motion (never promising medical safety). DevTools emulation = the QA path; real-device = toggle the OS setting + cold-boot.
- Canvas labeling check (MDN): canvas = plain bitmap, content NOT exposed to AT. role="img" + aria-label (or fallback). WCAG 4.1.2 + 1.1.1. QA: automated DOM check (every canvas has role + name) + manual screen-reader pass (NVDA/VoiceOver/TalkBack).

## B. Validation
- Real AT on real devices (AbleGamers Player Panels; GAG; Naughty Dog): playtesting by disabled gamers, not just automated checks. Naughty Dog's TLOU2: 3-year process, 60+ features, disabled consultants. Can I Play That? = the disabled-led de-facto audit.
- Keyboard-only + screen-reader (web.dev; WCAG): full task completion keyboard-alone; screen-reader pass on real devices confirming names/roles/states.
- Fail protocol (XAG model; project-internal): no public "GAG fail protocol" exists — ours is home-grown but matches the industry pattern: guidelines as test-team checklists; any criterion failure blocks the milestone; the fix triggers full re-verification of the affected gate; results documented.

## C. Techniques
- Full kill switches (GAG Intermediate/Advanced): "turn off / hide background movement" → "turn off / hide all non-interactive elements." Our ✧ = the strongest form (single toggle, zero non-essential motion).
- Numeric gates: the pros ship thresholds, not vibes. Our set (4.5:1, ≤3/sec, no >5s, no >25%) = a faithful consolidation of W3C + GAG + XAG.
- Graduated intensity (Celeste Assist Mode; Forza game-speed; TLOU2 motion-sickness sliders): motion/effects as a slider or steps, not just on/off. Celeste: game speed to 50%, invincibility, infinite stamina — "judgment-free," non-shaming. = our shakeIntensity (already implemented).
- Canvas labeling (MDN): role=img + aria-label = the correct baseline for presentational game canvases (1.1.1/4.1.2). Interactive canvases go further (offscreen DOM mirrors), but ours are presentational.

## D. What to avoid
- "Epilepsy safe" claims (GAG): "the term 'epilepsy safe' must NEVER be used; there is always residual seizure risk." Even a setting named "epilepsy safe mode" = violation. Settings describe what they do ("screen flash effects"). Our copy is descriptive — keep it that way.
- Partial reduce-motion (Smashing; web.dev): the common failure = honoring the flag in CSS while canvas/JS animation keeps running. The OS flag must gate the actual animation loop. Our approach (✧ at boot gating the render loop) = correct full-coverage.
- Unlabeled canvas (MDN): = bitmap invisible to AT. Fails 1.1.1 + 4.1.2. The automated check exists because this is the most common canvas failure.
- Color-only (GAG; WCAG 1.4.1): "no essential information by a fixed colour alone." Our circle-vs-triangle = the prescribed remedy.

## E. Shipped
- TLOU Part II (Naughty Dog): 60+ settings over 3 years with disabled consultants — TTS, navigation/traversal assistance, combat options, per-setting presets, motion-sickness suite, high-contrast, customizable subtitles. Built with consultants from early development, not bolted on. Set the AAA bar.
- Forza Horizon 5 (Playground): picture-in-picture ASL/BSL interpreters in cutscenes (first for AAA) + game-speed modification + screen-reader + high-contrast. Accessibility as feature development.
- Celeste (Maddy Makes Games): Assist Mode — judgment-free panel: 50% speed, invincibility, infinite stamina, unlimited dashes, chapter skip. "Modifying the game's rules to fit the player." The indie template for kill-switch-plus-sliders.

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** two checks.
  1. OS flag gates the CANVAS LOOP, not just CSS (Smashing's anti-pattern avoided). game.js:181-182 — `prefers-reduced-motion` read at boot → `reducedEffects = true`. Gates: trauma (831), hit-stop + squash (1149), render scale → 1× (445), shakeIntensity → 0 (179). The animation loop itself is gated.
  2. Graduated intensity ALREADY IMPLEMENTED (research rec 5). `shakeIntensity`: 0=off, 1=reduced (30%), 2=full (game.js:179, persisted, cycles 2→1→0→2). Applied as amplitude multiplier: 0 / 0.3 / 1 (game.js:1453). ✧-off = intensity 0. The Celeste pattern (steps between full and off) ships in the jam build.
- **A11Y-SPEC.md:** verification round 3 (below). Spec only, +0 lines. **4,498 lines** (+0).

## F. Sources
wcag · gag · xag · peat · celeste · tlou2 · forza · ablegamers
