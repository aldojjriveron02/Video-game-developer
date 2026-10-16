# Tutorial Part 15 (LD60 Submission Checklist) — Findings (Round 229)
**Date:** Wed 2026-10-14 ~22:22 EDT · **Source:** live web research (ldjam, thompson, leafo, rumor, sentient)
**Project:** Mecha Protocol — submission (Phase 1, pre-jam)

## A. Submission mechanics
- Jam vs Compo (any base code vs scratch). Submission Hour (+1h).
- ZIP upload + HTML5 embed (since LD51). Judging (1-5 + Coolness).
- Theme = social rule. Bug fixes + changelog post-deadline.

## A2. EMBED SANDBOX (critical)
- index.html at root. 256MB max. STRICT: no fetch/XHR/storage/cookies/external.
- 16:9 frame (948×533). Mobile "sub-par". No persistent storage.
- Our embedCtx='ld' detection → Export-primary UX (Round 209, verified).

## B. Validation
- Warmup submit. Web day one. Fresh-eyes test. Marketing before submit.
- Tutorial self-teaches. Re-verify after every update.

## C. Techniques
- Internal deadline 2h early. Submit ~1h early (site crashes).
- Marketing kit (covers; GIFs). Page structure. Post-submit ratings (≥10/day).

## D. What to avoid
- No cover image (1/3 <20 ratings). Broken packaging. Download-only.
- Last-minute submit. Update without re-checklist. No instructions.
- Sound afterthought. Overscoping. Compo landmines. Embed landmines.

## E. Shipped
- Gods Will Be Watching (LD26). Boba (LD52). A Day in the Life (LD52).
- Fallowtide (LD52). LD46 top 5.

## Implemented this round
- **LD60-MASTER-CHECKLIST.md:** 9-pillar consolidation + battle plan.
- **Verified:** embed sandbox degradation (storageOK=false → Export UX, no crash).
- Spec only, +0 lines. 4,314 lines (+0).

## F. Sources
ldjam · thompson · leafo · rumor · sentient
