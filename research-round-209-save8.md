# Save Part 8 (Final Confirmation) — Findings (Round 209)
**Date:** Wed 2026-10-14 ~20:18 EDT · **Source:** live web research (ldjam, ldj.am, bugnet, abratabia, mdn, itch.io, toddpocalypse, kyle.n)
**Project:** Mecha Protocol — save (Phase 3, pre-jam)

## A. Jam save
- LD embed: STRICT sandbox, ZERO storage (official). Zip 256MB, index.html root.
- ldj.am countdown confirms Fri 6PM. ludumdare.com homepage STALE.
- Survival guide (4h publish; test exporter). itch.io (test embed; common failures).

## B. Validation
- Bugnet matrix (checkpoints; exact-state; interrupted-write; version matrix; edge cases; backup-first; telemetry).
- Save Breaker ($2.99; 12 variants).

## C. Techniques
- Dual-key rotation (web atomic). try/catch; QuotaExceededError → message.
- saveVersion day 1; chained migrations. Field-by-field defensive load.
- Emergency saves (beforeunload + visibilitychange). persist() opt-in.
- Export fallback ✓ (already Export-primary).

## D. What to avoid
- LD zero storage. itch.io iOS silent non-persistence (#1 trap).
- Partitioning/CDN loss. Best-effort eviction. Future-version crashes.
- "Works locally" ≠ "works on itch".

## E. Shipped
- Save Breaker. Toddpocalypse (itch detection). kyle.n (field validation).
- r/godot (user:// = localStorage). Our design matches consensus.

## Implemented this round (code)
- **js/save.js:** embed detection + cross-session canary + LD force-fail + telemetry.
- **SAVE-SPEC.md:** conditional-probe decision + LD strategy.
- 4,218 lines (+25).

## F. Sources
ldjam · ldj.am · bugnet · abratabia · mdn · itch.io · toddpocalypse · kyle.n
