# Accessibility Part 5 (Cognitive & One-Hand) — Findings (Round 133)
**Date:** Thu 2026-10-15 ~06:25 EDT · **Source:** live web research (w3c, gameaccessibilityguidelines ×3, accessible.games, smashingmagazine, rockpapershotgun, vice)
**Project:** Mecha Protocol — a11y (Phase 3 week-1, pillar 3)

## A. Cognitive
- W3C COGA: 8 objectives; 1-3 items working memory; ≤5 choices; 6-min chunks; 50-word paragraphs.
- No timeouts. Undo. Feedback. Section 5 testing protocol (adapted consent).

## B. One-hand
- Hoober: 49% one-handed, 36% cradled, 15% two-handed; thumb zone bottom-center.
- Apple 44×44; Android 48×48; WCAG AA 24×24 / AAA 44×44.
- GAG motor: large controls; same input; no held/simultaneous; 0.5s delay (Advanced).

## C. Validation
- GAG: separate impaired pool; early; Uncharted 4 bar.
- APX: 22 patterns (Leave It There, Total Recall, Do More With Less, etc.).
- COGA Section 5.

## D. What to avoid
- Color-only (4.5%). Timed inputs. Double-tap/multi-gesture.

## E. Shipped
- Celeste (Assist Mode; Farewell destigmatization; no save branding).
- ItB (UI = half of 4 years; perfect-information contract; cut-to-clarity).

## Implemented this round (code)
- **js/game.js:** intent display persistent across player + enemy phases (APX "Leave It There").
- **A11Y-SPEC.md:** production a11y spec (ItB contract + COGA numbers) appended.
- 3,489 lines (+1).

## F. Sources
w3c · gag ×3 · accessible.games · smashingmagazine · rps · vice
