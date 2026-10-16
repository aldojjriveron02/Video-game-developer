# A11y Part 16 (Accessibility Verification) — Findings (Round 245)
**Date:** Wed 2026-10-14 ~23:58 EDT · **Source:** live web research (abratabia, mdn, w3c, salivity, ign, forallwe, celeste)
**Project:** Mecha Protocol — a11y (pre-jam; verification only)

## A. Mechanics
- 10-point pass = ordered sequence (abratabia Jul 2026): (1) automated (Lighthouse/axe/WAVE every screen) + fix before manual; (2) keyboard-only (unplug mouse — focus visibility, order, no traps); (3) screen reader NVDA/VoiceOver eyes closed; (4) colorblind simulation (DevTools Rendering → vision deficiencies); (5) 200% zoom + muted run; (6) disabled playtesters (AbleGamers/SpecialEffect/Can I Play That).
- Numeric gates: WCAG 1.4.3 — 4.5:1 normal text, 3:1 large (≥18.66px bold / ≥24px); 1.4.11 — 3:1 UI components/graphical objects. Photosensitivity WCAG 2.3.1: nothing flashes >3×/sec or above flash/red-flash thresholds. Reference: Harding Flash and Pattern Analyzer; PEAT RETIRED — use video-audit.com free WCAG 2.3.1 checker. Manual layer: VFX audit (every effect), camera-motion analysis (high-freq shake can mimic flash), UI blink checks.
- aria-live for canvas games: canvas invisible to screen readers — all UI text in HTML over canvas. Pattern: canvas aria-label + tabindex=0; single polite live region (role="status") announcing game-state at game pace — turn results, phase changes, unit deaths — NEVER per-frame; assertive only below critical threshold (one event).

## B. Validation
- Screen reader: works = semantic HTML layer (menus, settings, dialogue, live region). Doesn't = canvas world itself (announces label only). Substitute: supplemental audio cues + spatial text summary ("3 enemies north") every few seconds. Protocol: monitor off, Tab every menu, listen for names/states/dynamic announcements/focus moves.
- Reduced motion: toggle OS Reduce Motion, reload — confirm shake → 0, particles → none, tweens → instant cuts, no info lost. JS: matchMedia('(prefers-reduced-motion: reduce)') at boot + in-game 3-state toggle.
- Grayscale + keyboard-only: lost focus = global outline:none bug; focus order = visual order; no traps; every mouse action keyboard-reachable. Color-vision emulation + WebAIM contrast — danger/team/health must survive with redundant shape/text/icon cues (WCAG 1.4.1 Use of Color).

## C. Techniques
- Polite vs assertive: polite queues (default for everything); assertive interrupts (reserved: time-sensitive/critical only). One assertive per critical threshold, everything else polite.
- 3-state motion toggles: full/reduced/off, default from OS at boot (W3C C39); photosensitivity-safe mode dims flashes, removes strobes.
- High contrast: honor forced-colors (HTML UI survives palette override) + prefers-contrast: more stylesheet.
- One region, game-paced: aria-live="polite" + aria-atomic="true", updated on game events; debounce rapid updates; clear-then-set so repeats re-announce.

## D. What to avoid
- Live-region spam (per-frame health/cursor floods speech queue — aria-live="off" on rapid values).
- Motion that can't be disabled (forced shake/parallax; reduced-motion buried in submenu).
- Color-only info (fails WCAG 1.4.1; pair with shape/text/icon).
- Keyboard traps (canvas swallows Tab/Escape — WCAG 2.1.2 critical). Escape = global exit; focus returns to canvas on menu close; no interactive text on canvas.
- Silent buttons (missing labels), menus not moving focus, auto-advancing dialogue with no disable, decorative noise left readable.

## E. Shipped
- Celeste: Assist Mode — game speed 50–100%, infinite stamina, invincibility, dash-assist, chapter skip; unpatronizing intro; nothing locked out. (gameaccessibilityguidelines.com best practice: "expose as many variables as possible.")
- TLOU2 (Naughty Dog): disability presets before start, menu audio description, auditory glossary, haptics, full remapping, high-contrast, zoom. "We want everyone to be able to play our games." Game Awards 2020 Innovation in Accessibility.
- Prince of Persia: The Lost Crown (Ubisoft): IGN 2024 Best Accessible Game — customizable controls, audio indicators, Memory Shards, Guided Mode. Runner-up lesson (Botany Manor): low-budget indie praised through inclusive design alone — directly relevant to jam scale.

## Implemented this round
- **Verified (code read, no changes — frozen):** single polite live region (#sr-announce, aria-live="polite" aria-atomic="true", visually hidden); clear-then-set via rAF (repeats re-announce); game-paced announcements (turn events, never per-frame); 3-state shake toggle ✦/◐/✧ (Round 214); prefers-reduced-motion honored at boot (game.js:177). DELIBERATE: single-region design (polite only) — critical events announced at game pace; no assertive region (simplicity, jam scope).
- **A11Y-SPEC.md:** jam-day verification sequence (automated → keyboard-only → screen reader → motion → color/audio; ~45 min); PEAT-retired note (use video-audit.com); numeric gates as the pass criteria.
- Spec only, +0 lines. 4,405 lines (+0).

## F. Sources
abratabia · mdn · w3c · salivity · ign · forallwe · celeste · tlou2
