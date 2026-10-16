# Mobile Part 7 (Jam & Validation) — Findings (Round 188)
**Date:** Wed 2026-10-14 ~18:32 EDT · **Source:** live web research (ld embed guide, ldj.am, itch.io #881, abratabia ×2, qa-checklist, wiki, splitter critters, kingdom)
**Project:** Mecha Protocol — mobile (Phase 3, pre-jam)

## A. Jam deploy
- LD sandbox: NO storage/network/cookies; 948×533; mobile known-issue #2169.
- itch.io: fullscreen bug #881 (2018); use Embed+manual size.
- LD60: 72h; 1h Submission Hour; bug-fixes only post-submit; Coolness bonus.

## B. Validation
- Real devices (iPhone 17 + low Android + small/large). Smoke test (audio, 48px,
  rotation, notch, lock/unlock, bfcache, slow-3G). Interruptions. Web Inspector.
- LD-specific: play through BOTH LD sandbox and itch.io.

## C. Techniques
- Viewport (user-scalable=no). DPR cap 2. Pointer Events. touch-action.
- Audio unlock in tap. dvh (not 100vh). rAF only. 12ms budget. Safe areas.

## D. What to avoid
- LD storage block (HIGHEST SEVERITY). itch fullscreen bug. iOS audio.
- 100vh jump. Notch covering buttons. Emulator-only. Submission Hour misuse.
- windowkill lesson (no desktop-chrome mechanics).

## E. Shipped
- Splitter Critters (LD35 → mobile, touch core). Kingdom (LD23 → mobile).
- windowkill (negative example).

## Implemented this round (audit)
- **Verified compliant:** storage try/catch + probe + banner; audio; targets.
- **MOBILE-SPEC.md:** conditionally deploy-ready + 3-item gate + dry run plan.
- Spec only, +0 lines. 4,106 lines (+0).

## F. Sources
ld embed · ldj.am · itch.io #881 · abratabia ×2 · qa-checklist · wiki · splitter critters · kingdom
