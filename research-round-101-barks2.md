# Pilot Barks Part 2 (Voice & Character) — Findings (Round 101)
**Date:** Wed 2026-10-14 ~19:20 EDT · **Source:** live web research 2026-10-14 (vois.so, pulsegeek.com, shapes.inc, fireemblem.blog, matthewpearceauthor.com, allthetropes.org, topherkeene.com, reddit.com)
**Project:** Mecha Protocol — barks

## A. Bark problem
- Vois (don't grate; repetition; verbosity; playback > writing; duration budgets).

## B. 8 triggers
- ItB (hyper-specific); BATTLETECH (threshold precision); Mitchell (1-2s/4-8s/12-20s); variants (3/6).

## C. Character voice
- Ace Pilot archetypes; Pearce (remove-names); Keene (three P's).

## D. What to avoid
- Spam (fix triggering); generic (FE folly); tone-deaf; gimmick traps.

## E. Shipped
- ItB pilots (8 voices); BATTLETECH (heat); FE (cautionary).

## Implemented this round (code + spec)
- **js/barks.js:** per-trigger cooldowns (critical 1.5s, combat 6s, ambient 15s); never-repeat-last-variant.
- 3,394 lines (+83).

## F. Sources
vois · pulsegeek · shapes · feblog · pearce · alltropes · keene · reddit
