# Perf Part 10 (Thermal + 3-Signal) — Findings (Round 216)
**Date:** Wed 2026-10-14 ~21:05 EDT · **Source:** live web research (abratabia, mdn, gaffer, lopis, itch.io, ldj.am)
**Project:** Mecha Protocol — perf (Phase 3, pre-jam)

## A. Jam perf
- LD60 (Oct 16-19; 6PM EDT Fri; Compo 48h/Jam 72h).
- itch.io (index.html at root; ≤1000 files; case-sensitive; Click-to-Play).
- js13k (stats.js; Tiny-Canvas; Q1K3).

## B. Validation
- Device matrix (flagship/mid/budget Android; iPhone 14+/11-12; real devices).
- Extended: 15-20 min MINIMUM; log rAF deltas; plot; iOS reload=OOM.
- Thermal: 55-70% sustained; 60-70% budget; 70% render scale.
- longtask: Baseline Limited (no Safari) → rAF >50ms surrogate.

## C. Techniques
- MDN canvas (offscreen; sub-pixel; cache; layers; alpha:false).
- Gaffer (fixed-dt; clamp; spiral; headroom).
- Meow Mountain (AudioWorklet; base-32; wave SFX).

## D. What to avoid
- 120Hz breakage; Safari monoculture; speechSynthesis guard; canvas emoji.
- Title-only testing; <2min sessions; absolute paths; shadowBlur.

## E. Shipped
- Meow Mountain (13KB). Q1K3 (Quake 13KB). Tiny-Canvas. stats.js.

## Implemented this round (audit)
- **Verified:** 120Hz-safe (variable dt, no 60Hz assumptions, clamped).
- **PERF-SPEC.md:** 3-signal protocol + thermal soak + sign-off definition.
- Spec only, +0 lines. 4,258 lines (+0).

## F. Sources
abratabia · mdn · gaffer · lopis · itch.io · ldj.am
