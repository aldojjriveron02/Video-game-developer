# Accessibility Part 6 (Motor & Validation) — Findings (Round 146)
**Date:** Thu 2026-10-15 ~09:50 EDT · **Source:** live web research (gameaccessibilityguidelines, caniplaythat, w3c, ablegamers ×2, xbox ×2, microsoft ×2, celeste.ink, naughtydog, github)
**Project:** Mecha Protocol — a11y (Phase 3)

## A. Motor
- GAG (BASIC/INTERMEDIATE/ADVANCED; 0.5s delay = Advanced).
- CIPT (toggles; no QTEs; remap). WCAG 2.2 (24×24 AA; 44×44 AAA).

## B. Validation
- GAG (impaired in testing; representative). APX (Control/Presentation/Challenge).
- Player Panels (recruiting). Xbox XAG (testing program). COGA (8 objectives; stories).

## C. Telemetry
- Microsoft (5 metrics: Usage, Usability, Success Rate, Compliance, Tickets).
- Xbox Feature Tags (taxonomy as checklist).

## D. What to avoid
- Color-only. Timed inputs. Holds/double-tap/multi-touch.
- 0.5s frustration loop (log taps-inside-delay).

## E. Shipped
- Celeste (granular; no lock). ItB (zero pressure; undo; reset).
- TLOU2 (60+ settings). Forza (Blind Driving; supplemental cues).

## Implemented this round (code)
- **js/game.js:** 0.5s post-acceptance delay (_acceptGate on End Turn/Undo) + taps-inside-delay telemetry.
- **A11Y-SPEC.md:** production a11y validation plan appended.
- 3,602 lines (+14).

## F. Sources
gag · cipt · w3c · ablegamers ×2 · xbox ×2 · microsoft ×2 · celeste.ink · naughtydog · github
