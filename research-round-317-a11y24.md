# A11y Part 24 (Verification Round 6) — Findings (Round 317)
**Date:** Wed 2026-10-15 ~06:45 EDT · **Source:** live web research (webaim, xag, mdn, ableGamers)
**Project:** Mecha Protocol — a11y (pre-jam; verification round 6)

## A. Mechanics
- Keyboard-parity audit (WebAIM; XAG-112/113; GAG): "unplug the mouse and play the entire game end-to-end with keyboard only." Check: logical focus order, always-visible focus indicator, "no keyboard traps (WCAG 2.1.2 — focus that can move in must be able to move out)," Escape closes dialogs and returns focus, no hover-only reliance. "Keyboard-only testing is essential."
- Screen-reader audit (XAG-106; W3C; MDN): NVDA/JAWS/VoiceOver — every control announces name, role, value/state; dynamic events narrated in sensible order. "Canvas is 'just a bitmap and does not provide information about any drawn objects'" — the offscreen/fallback layer must carry the accessibility tree.
- Cognitive-load audit (GAG; XAG-108/115/116/123): no mandatory time pressure (or timer-free mode), undo/error forgiveness, clear mistake recovery, adjustable speed/difficulty, tutorials that don't overload working memory.

## B. Validation
- Disabled playtesters (AbleGamers; GAG): "playtesting staffed by gamers with disabilities — direct feedback on what's working and where barriers remain." GAG mandates testing prototypes with disabled gamers as a core step.
- Certification (APX; XAGs; Microsoft Store tags): "Microsoft Store's accessibility feature tags (Gears 5 first) create a public, verifiable claims system — each tag must be true of the shipped game."
- Community review (XAIL; Can I Play That?; GAConf): "publish what was tested and let the community verify it."

## C. Techniques
- Focus management (XAG-113; WebAIM): every interactive element focusable in logical order; visible focus never removed; dialog open → move focus inside and trap until closed; close → return focus to invoker; never let focus fall onto canvas bitmap without semantic target.
- ARIA live regions (W3C): announce dynamic events (turns, selection, attacks, errors, victory) through polite live regions (assertive only for urgent); throttle to avoid flooding; pair with text alternatives for audio cues.
- Simplified modes (XAG-108/117): difficulty/speed options preserving full game; granular motion toggles, not one master switch.
- Input alternatives (GAG; XAG-107): fully remappable; one-handed/single-switch compatible; no multi-key chords for essentials; full pointer alternatives.

## D. What to avoid
- Keyboard traps (WCAG 2.1.2; WebAIM): "any component that swallows Tab/arrow-key focus with no keyboard escape is a hard failure."
- Unlabeled controls (WCAG 4.1.2): "buttons with no accessible name/state are invisible to screen readers." Canvas equivalent: "clickable canvas regions with no offscreen accessible counterpart."
- Motion without alternatives (WCAG 2.3.3; XAG-117): "any motion triggered by interaction must be disable-able unless essential." "OS-level prefers-reduced-motion must be respected on first load."
- Inaccessible canvas (MDN): "shipping a canvas game whose only representation is drawn pixels — no fallback, no focusable layer, no text alternatives — is the web-game equivalent of an unlabeled control."

## E. Shipped
- TLOU2 (Naughty Dog): "60+ accessibility features — full screen-reader support and text-to-speech, high-contrast mode, traversal/combat audio cues, extensive remapping." "Designed in from pre-production with disabled consultants."
- Gears 5 (Coalition): "first title to carry Microsoft Store accessibility feature tags; menu narration, color-blind mode, camera-shake toggle, target lock." "Granular, individually switchable features plus public, verifiable tags."
- Forza Horizon 5 (Playground): "picture-in-picture ASL/BSL interpreters for cinematics" + game-speed control, high-contrast, color-blindness filters, screen narration. "Treated deaf access as a shippable feature with a real budget."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** keyboard handler hygiene. hangar.js:107 — deploy keydown listener properly unbound via _unbindDeployKey() (called before re-adding, prevents duplicates). No keyboard traps in the modal flow.
- **HONEST GAP DOCUMENTED (not a jam-blocker):** the tactics grid is NOT keyboard-navigable (no arrow-key cursor, no Enter-to-select). The game is touch-first by design (iPhone 17 target). HTML menus/buttons are Tab-accessible; the canvas grid is pointer-only. Per the claims rule, this is documented as a known limitation, not claimed as supported. Post-jam: keyboard grid navigation is a Phase 2 candidate.
- **A11Y-SPEC.md:** verification round 6 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
webaim · xag · mdn · ableGamers · tlou2 · gears 5 · forza horizon 5
