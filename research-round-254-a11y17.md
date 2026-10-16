# A11y Part 17 (Final Verification) — Findings (Round 254)
**Date:** Wed 2026-10-15 ~00:51 EDT · **Source:** live web research (gag, mdn, webaim, xbox, video-audit, game awards)
**Project:** Mecha Protocol — a11y (pre-jam; final verification)

## A. Mechanics
- Ordered sequence (GAG-mapped): (1) automated — axe/WAVE + contrast checker + video-audit.com on gameplay footage (~30–40% of issues, cheapest first); (2) keyboard-only full playthrough; (3) screen reader at game pace; (4) motion (OS reduce-motion ON, all 3 states); (5) color/audio (grayscale + full mute).
- Numeric gates: FLASH (GAG + WCAG 2.3.1) — no flashing sequence >5s; no >3 flashes/sec covering 25%+ of screen; no moving repeated patterns 25%+; no static patterns 40%+. CONTRAST — ≥4.5:1 text/UI (Snook checker, WCAG 2 AA). MOTION — off/hide option + OS reduce-motion honored at boot.
- Fail protocol (GAG): flash fail → eliminate first (drop rate <3/sec, shrink area <25%, add spacing). Can't eliminate without harming game → obvious warning + disable option. NEVER claim "epilepsy safe" — describe by effect ("screen flash effects"), never promise safety (legal exposure). Contrast fail → move to 4.5:1 or add outlines/shadows. Color-only fail → redundant channel. Audio-only fail → visual/text mirror. Trap/focus fail → fix immediately (WCAG Level A blocker).
- video-audit.com: W3C WAI-recognized, free in-browser tier (video never leaves device), WCAG 2.2/2.3.1 + Ofcom + Trace24, frame-level flash-zone overlays, violations log with timecodes. Supersedes retired PEAT/Harding.

## B. Validation
- Automated: axe/WAVE on DOM shell; Snook on all text/UI pairs; video-audit.com on combat/transition clips.
- Keyboard-only (WebAIM): Tab/Shift+Tab everything; focus ALWAYS visible (never outline:0); logical order; Enter AND Space activate; Esc closes dialogs; zero traps; standardized keys, complex keys documented. Tactics: every menu, tile select, confirm/cancel, settings toggle reachable.
- Screen reader (MDN): polite waits until idle; assertive interrupts — "extremely annoying and disruptive" if routine. Test ≥2 readers (NVDA + VoiceOver); announcements match sighted state (turn, damage, objectives); nothing essential only on canvas or in sound.
- Motion (MDN per-OS paths): boot into reduced state (toggle defaults ✧ off); cycle 3 states, each perceptibly different, none auto-plays undismissable motion. Rationale: background animation can make essential info invisible (cognitive); large-object scaling = vestibular trigger.
- Color/audio: grayscale → every state distinguishable (no color-only team/status); full mute → every cue (hit, turn, error) has visual/text equivalent.

## C. Techniques
- Live-region discipline (matches our design): ONE polite + aria-atomic, in initial markup (never injected); clear-then-set via rAF = MDN's established-first + deferred-update pattern. Atomic matters: without it, "HP 12 → HP 11" announces only the changed fragment. Assertive reserved for nothing routine. Game-paced = one announcement per event, queued/coalesced.
- 3-state toggles (Celeste lesson: granular beats binary): ✦/◐/✧; default from OS at boot; PERSIST (GAG: settings must be saved/remembered). Our toggle also gates flash-adjacent effects (verified in code).
- High contrast: ≥4.5:1 (GAG Vision Basic); outlines/shadows where plain backing impossible. Models: TLOU2 High Contrast Display, Ragnarök, For Honor.
- In-game docs: document a11y features in-game + solicit feedback (GAG Basic — minutes of work, signals deliberate design to judges).

## D. What to avoid
- Live-region spam: multiple regions, per-frame announcements, routine assertive, no clear-then-set, dynamic injection. Smell: screen reader talks over itself in combat.
- Undisablable motion: shake/flash/pan with no off; reduce-motion buried in submenu; settings resetting to full on reload.
- Color-only info (dies in grayscale; pair with icon/shape/text/position).
- Keyboard traps (WCAG 2.1.2 Level A); outline:none; undocumented keys.
- SAFETY THEATER: never "epilepsy safe" — describe by effect, run video-audit.com.

## E. Shipped
- TLOU2 (Naughty Dog, 2020): first Innovation in Accessibility winner — 60+ settings, TTS menus, High Contrast Display, magnifier, audio cues, remapping. "Unprecedented" — barriers removed without changing balance.
- God of War Ragnarök (2022): 70+ features, four pillars (Vision/Hearing/Motor/Cognitive) — pillar structure forces cognitive coverage (often forgotten in jams).
- Celeste (2018): indie gold standard — granular independent options, respectful non-shaming intro. Few well-chosen toggles > giant list; presentation without shame increases uptake.

## Implemented this round
- **Verified (code read, no changes — frozen):** ✧ off (reducedEffects) gates trauma/shake, hitstop, knockback, limb flashes, hit flashes, limb-break red flash, AND render scale (battery) — the toggle is a full juice+flash kill switch. Persists via 'mecha-protocol-fx'; boot with OS reduce-motion defaults to ✧. Flashes designed "single soft flash per hit — never a strobe" (Round 41).
- **A11Y-SPEC.md:** numeric gates as pass/fail (4.5:1, ≤3 flashes/sec, no >5s sequences, no >25% coverage); GAG fail protocol (eliminate → warn+disable; never "epilepsy safe"); video-audit.com as the tool; 45-min timed drill; in-game a11y docs + feedback line as cheap Basic-level wins.
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
gag · mdn · webaim · xbox · video-audit · game awards · tlou2 · ragnarök · celeste
