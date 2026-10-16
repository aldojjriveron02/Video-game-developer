# Mobile Part 8 (Final Validation) — Findings (Round 197)
**Date:** Wed 2026-10-14 ~19:18 EDT · **Source:** live web research (itch.io ×4, ldjam, abratabia ×4, frontendchecklist, adpf, uhiyama, salivity, defold, slapjam, tappy, pandora)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam mobile
- itch (tap-to-run; fullscreen-only; "Mobile friendly" only if tested).
- LD embed (948×533; no storage/fetch; #2169 mobile; #2170 storage).
- abratabia (zip + embed + viewport).

## B. Validation
- Remote debugging (Android USB; iOS Web Inspector; BrowserStack).
- Thermal soak (15-30min; throttle ~10min; "true perf after heat").
- Touch (touchstart; first-tap; touch-action:none; iOS+Android).
- Viewport (dvh/svh; orientationchange; Safari no lock; safe-area).
- Interruption (tab kills; bfcache). Audio (resume on gesture).
- Emulator caveat (can't replace real device).

## C. Techniques
- Canvas sizing (DPR cap 2; 16MB texture budget). Pinch-zoom block.
- Pointer Events. rAF + delta. touchstart. JS rotation prompt.

## D. What to avoid
- LD ≠ normal web. "Mobile friendly" untested. 100vh. Audio assumptions.
- iOS orientation lock. Peak-only perf. Tab kills. Zoom hijack. Emulator-only.

## E. Shipped
- TappyTower (LD touch-first). Pandora's Box (LD51 mobile build).
- itch LD collections. Browser standard (zip + index.html).

## Implemented this round (audit)
- **Verified:** LD-sandbox path (probe + try/catch + banner + in-memory).
- **MOBILE-SPEC.md:** 4-item gate + jam-day checklist. NOT deploy-ready yet.
- Spec only, +0 lines. 4,158 lines (+0).

## F. Sources
itch.io ×4 · ldjam · abratabia ×4 · frontendchecklist · adpf · uhiyama · salivity · defold · slapjam · tappy · pandora
