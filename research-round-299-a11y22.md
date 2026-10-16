# A11y Part 22 (Verification Round 4) — Findings (Round 299)
**Date:** Wed 2026-10-15 ~05:41 EDT · **Source:** live web research (gag, wcag, celeste, tlou2, ragnarok)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 4)

## A. Mechanics
- Reduced-motion audit (GAG; WCAG 2.3): enumerate every motion source in the canvas loop (shake, camera, parallax, UI transitions, particles). "Motion which can't be turned off in settings can cause problems for some players." Thresholds: ≤3 flashes/sec, <25% screen area, ≤5s sequences; moving repeated patterns 25%+, static 40%+ flagged. Map shakeIntensity 0/1/2 to tiers; verify each tier disables the corresponding motion (0 = no shake/camera at all).
- Contrast audit (WCAG 1.4.3 AA; GAG): ≥4.5:1 normal text, ≥3:1 large text (≥18pt or ≥14pt bold); GAG: in-game contrast/brightness/gamma option; 3:1 for non-text UI. Sample every text/UI color pair on the canvas; measure against rendered output at each text-scale tier. "Do not rely on screenshots alone."
- Keyboard map (WCAG 2.1.1 Level A; GAG): all content operable through keyboard "without requiring specific timings"; "pointer actions have a keyboard equivalent." QA: (1) walk the entire game keyboard-only; (2) publish a visible keyboard map; (3) verify remapping for every action (no multi-modifier defaults); (4) no keyboard traps, focus never script-removed (F54/F55).

## B. Validation
- Real users (GAG): "include some people with impairments amongst play-testing participants" — lab checklists miss lived-experience barriers (a shake tier fine for devs but triggering vestibular issues). SpecialEffect / AbleGamers = the professional channels.
- Matrix testing (MDN): OS-flag surface — Windows 10/11, macOS, iOS, Android 9+, GNOME/KDE, Firefox ui.prefersReducedMotion. Test against the matrix, not one machine.
- Honest claims (GAG): "Provide details of accessibility features on packaging and/or website" — "if you can't play it, you can't take it back." Epilepsy: "never say 'epilepsy safe'" — absolute safety claims never legitimate. Claims verifiable against the audit, not aspirational.

## C. Techniques
- Motion controls: granular, independent toggles — TLOU2 + Ragnarök ship separate camera-shake reduction/off, motion-blur disable, flash-intensity. Matches shakeIntensity 0/1/2: each tier gates a real motion set; canvas loop gated on prefers-reduced-motion with manual override.
- Remappable inputs (GAG): every action remappable, no multi-modifier combos, settings persist between sessions.
- Text scaling (WCAG 1.4.4): resizable to 200% "without loss of content or functionality." Test the top tier for overflow — "canvas text doesn't get browser zoom for free."
- Color-independence (GAG): "up to 8% of men have red/green color blindness" — no state by fixed color alone; pair color with shape, icon, label, or pattern.

## D. What to avoid
- Motion-only feedback: critical events (damage, turn change, alerts) signaled only by shake/animation = invisible to motion-disabled + many low-vision players. Redundancy required: every important visual event needs text/icon/audio.
- Color-only states: team/enemy/status by color alone — caught by the colour-alone audit with red-green simulation.
- Fake claims: "epilepsy safe," generic options (volume sliders) as "a11y features," reduced-motion mode that doesn't gate the canvas loop.
- Post-freeze changes: any code/content change after the a11y freeze invalidates verification for the affected surface. The freeze is a contract; breaking it = re-audit, not assumption.

## E. Shipped
- Celeste (Maddy Makes Games): Assist Mode — fine-tunable variables (game speed 50–100%, infinite stamina, air dashes, invincibility), framed non-judgmentally ("we understand that every player is different"). "Granular, player-controlled difficulty without stigma" — the industry reference.
- TLOU2 (Naughty Dog): 60+ options designed with disabled players — vision/hearing/motor presets, text-to-speech, audio cues, HUD scale, high-contrast, camera shake off, full remapping. "Coverage across all disability categories from day one, with presets so players get a working setup in seconds."
- Ragnarök (Santa Monica): camera-shake reduction, motion-blur disable, flash intensity, text size, UI scale, navigation assist, high-contrast, auto pick-up, boss checklists. "Graded, independent motion controls are the proven pattern" — maps to shakeIntensity tiers.

## Implemented this round
- **COLOR-INDEPENDENCE (js/mech.js, GAG):** team was blue-vs-red + facing (orientation). Added SHAPE markers: ▲ = player, ▼ = enemy, in white (color-independent, high contrast), above the team stripe. Team now has THREE redundant channels: shape (▲/▼) + color (blue/red) + facing (right/left). A red-green colorblind player can distinguish teams by shape alone. +7 → **4,518 lines**, all clean.
- **A11Y-SPEC.md:** verification round 4 (below).

## F. Sources
gag · wcag · celeste · tlou2 · ragnarok
