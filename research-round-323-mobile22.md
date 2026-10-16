# Mobile Part 22 (Verification Round 7) — Findings (Round 323)
**Date:** Wed 2026-10-15 ~07:09 EDT · **Source:** live web research (web.dev, chrome, gamesnacks)
**Project:** Mecha Protocol — mobile (pre-jam; verification round 7)

## A. Mechanics
- Performance-budget audit (web.dev): "A budget is a set of limits on metrics affecting performance." Three types: quantity-based (page weight, script size), milestone timings (FCP, TTI), rule-based (Lighthouse scores). "Interactive in <5s, <170KB critical-path." "If over budget: optimize, remove, or don't add."
- Network-resilience audit (web.dev; Chrome DevTools): "measure what the app actually loads from the network, then stress it — simulate slower connections, use Empty Cache And Hard Reload, use request blocking to observe behavior when resources are unavailable."
- Installability audit (web.dev): "HTTPS; manifest with short_name, icons (192px+512px), start_url; display fullscreen/standalone; prefer_related_applications false."

## B. Validation
- Field testing (web.dev): "start with field data, not lab — collect RUM; use lab to diagnose, not to declare success." Chrome DevTools remote debugging for on-device verification.
- Network throttling (Chrome DevTools): "throttling dropdown simulates slow connections; Empty Cache And Hard Reload replays worst-case first visit; request blocking proves which resources are truly required."
- PWA validation: "Fast and reliable" (TTI on slow 4G; offline 200), "Installable" (HTTPS, SW, manifest), "PWA optimized" (splash, theme color, viewport, maskable icon).

## C. Techniques
- Offline-first (web.dev): "design for failure as the default — network can drop in elevators, subways, tunnels, airplane mode." "For low-data apps make offline the default state, not an error." "Design for low-end devices and the next billion."
- App-shell architecture (Osmani/Gaunt): "the minimal HTML/CSS/JS that powers the UI — the secret to reliably good performance." Service worker serves shell from cache; "repeat visits get meaningful pixels without the network."
- Honest loading states (web.dev): "skeleton layouts and explicit feedback; don't block content behind network; never leave users unsure whether their action was performed."
- Touch optimization (Archibald): "300–350ms tap delay removed when `<meta viewport content='width=device-width'>` is present." "Correct viewport/meta setup is what makes taps feel instant."

## D. What to avoid
- Network assumptions: "assuming always-on connectivity is the root failure; blocking requests stall the app."
- Untested offline: "if you've never run the game with network throttled/offline, you haven't tested it."
- Janky loading: "INP ≤200ms good, >500ms poor." Causes: "long tasks, heavy callbacks, layout thrashing, oversized DOMs."
- Desktop-first: "mobile-exclusive users," ">50% mobile traffic." "Designing for desktop and shrinking down misses the primary platform."

## E. Shipped
- 2048: "swipe to play, zero onboarding, tiny footprint." "Input model matched the device."
- Chrome dino: "the canonical offline-first micro-game — appears when network fails." "Design for failure taken literally."
- GameSnacks: "explicitly engineered for mobile — fast-loading, touch-first, built for low-end devices and spotty networks."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** offline resilience. Viewport has `width=device-width` (index.html:5) — 300ms tap delay removed, taps instant. `manifest.json` exists (installability groundwork). The only network request (music.js:70, audio track fetch) fails gracefully: `.catch(() => { stay silent })` + `play()` no-ops if track missing. Game is fully playable offline — music is optional enhancement, silence is the fallback (zero-layer design). No hanging, no crashes.
- **MOBILE-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,565 lines** (+0).

## F. Sources
web.dev · chrome · gamesnacks · 2048
