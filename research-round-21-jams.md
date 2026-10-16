# itch.io Game Jams as Distribution — Findings (Round 21)
**Date:** Tue 2026-10-13 ~21:53 EDT · **Source:** live web research 2026-10-13 (official jam pages, itch docs, community threads)
**Project:** Mecha Protocol — jams as the spike engine (itch does NOT sustain traffic; spikes come from us)

## A. Jam landscape
- **GMTK (annual, early Aug):** 2026: 37.4k joined, 10,382 entries rated. 2027: submissions Aug 11–15, 2027. Rules: made DURING the jam (pre-existing code OK with rights; nothing made ahead specifically for it); free; Windows + keyboard/mouse (browser or download); itch uploads (locked during voting); SFW PEGI 16; **NO AI-generated art or audio incl. thumbnail** — conflicts with our AI-assisted pipeline. Voting: 5 criteria, no overall ranking. Mark Brown plays favorites post-jam. Fit: NOT as-is — from-scratch jam build; mobile-first must add Windows mouse/keyboard.
- **Ludum Dare (2×/yr):** LD60 starts **Oct 16, 2026 6PM EDT** (3 days!). 48h Compo (from scratch, share source) + 72h Jam (teams OK, base code + pre-made assets allowed). No prizes. LD61 Apr 2027, LD62 Oct 2027.
- **js13kGames (annual):** 2026: ~299 entries, $30,000+ prizes, ≤13 KiB zipped, Mobile = base category (great for iPhone-first). Must be NEW content. AI art assets not allowed. Perfect tech match, not the prototype itself.
- **7DRL (annual, early Mar):** 2026: 190 entries / 721 ratings. Requires procedural generation; pre-existing code/engines allowed — "can even start from an existing game if turned into something unique." No winner. Outside-timeframe games "immediately deleted."
- **Gamedev.js Jam (annual, 13 days):** 2027: Apr 13–26. HTML5/web only; **AI "totally allowed, and even encouraged"**; 13-day voting; prizes + expert panel feedback. Best AI-friendly web fit.
- **7-Day Strategy Game Jam:** **Nov 1–7, 2026** (18 days!). Open theme "Open Strategy"; new projects only; AI-assisted WITH disclosure; browser OK; free during voting. Judged on Strategic Depth, Gameplay & Balance, Creativity, Theme & Scope, Overall. Small audience (5 joined so far).
- **Astrocade:** Strategy 2026 had $1,500 pool (98 joined / 49 submissions); next strategy edition TBA.

## B. Jams for existing games
- Default rule everywhere: built during the jam; pre-existing games entered for exposure get removed.
- **Finally Finish Something (Jan, recurring):** submit ANY in-progress project — "doesn't matter how much work you've already put in"; only violation = entering a fully completed game. **Best vehicle for finishing Mecha Protocol itself.**
- Second Chance Jam: resubmit previous jam games for more exposure/ratings. AGDG Demo Day: recurring demo/prototype showcases.
- How devs actually use jams for distribution: build a small NEW jam game sharing DNA with the main project for the spike → convert that audience via the jam page (devlogs, post-jam version, link to standalone page).

## C. Traffic reality
- GMTK 2026: 223,337 ratings / 10,382 entries = **avg 21.2 ratings/game**; even the #1 Enjoyment entry had only 97 ratings. AI Browser Jam 4: 8.2/entry. 7DRL: 3.8/entry. 50 ratings = top 6.1%.
- **Expect ~5–25 ratings for a typical big-jam entry.** It IS a short spike — sustained traffic requires conversion (see F).

## D. Jam page optimization
- itch docs: banner = most important graphic; trailer highly recommended ("Watch trailer" button); description covers controls, story, features, credits, status.
- Community: popularity ≈ clicks; cover art = YouTube thumbnail; animated GIF hover lures clicks; **browser-playable beats downloads**.
- GMTK 2026 top-20 dev: decided at the START to be browser-playable; strict scope; front-load work; "make a game you'd play"; playing others' games during the jam helped.

## E. Voting systems
- Ranked jams: rating period after deadline; average per criteria; overall = average of criteria. Rating Queue: random entry sets + minimum rating count → distributes votes evenly, blocks cheating. Browser games playable for everyone. Votes never published; free updates after jam ends.
- LD: 1–5 stars + Coolness (more games you rate = more visibility).
- **Legit tactics:** rate MANY others' games (Coolness/karma boost, avoid score reduction); review channels; only rate what you actually played.

## F. Post-jam momentum
- Precedent is mainstream: jam entries → full Steam/console releases (GMTK's own page lists them).
- **Node Farm: jam entry → ~$150k net revenue** ($102k/16.5k units + $60k/12.7k units). Takeaways: "marketable" = explainable in a short GIF; Discord; playtest; festivals; Reddit; prototype before full dev.
- **Pattern: KEEP the jam page live** (holds ratings/comments/history), ship "post-jam version" updates, devlog on the same page, link outward only when the standalone exists. A fresh page discards the spike's social proof.

## G. 2026–2027 calendar + recommended sequence
- Oct 16, 2026 — Ludum Dare 60 (3 days!) · Nov 1–7, 2026 — 7-Day Strategy Game Jam (18 days!) · Jan 2027 — Finally Finish Something · early Mar 2027 — 7DRL · Apr 13–26, 2027 — Gamedev.js Jam · Apr/Oct 2027 — LD61/LD62 · Aug 11–15, 2027 — GMTK · ~Aug–Sep 2027 — js13k.
- **Recommended sequence:** 7-Day Strategy Game Jam (Nov 2026 — near-term tactics build reusing engine code) → Finally Finish Something (Jan 2027 — finish Mecha Protocol itself) → Gamedev.js (Apr 2027 — best AI-friendly fit) → GMTK (Aug 2027 — biggest traffic; needs from-scratch Windows/mouse build, zero AI art/audio).

## Applied to Mecha Protocol (this round's implementation)
- Added jam plan to LAUNCH-PLAYBOOK.md (Phase 1). No code changes (strategy round).

## H. Sources
Official: itch.io/jam/gmtk-2027 · itch.io/jam/gmtk-jam-2026/results/enjoyment · ldjam.com · js13kgames.com · itch.io/jam/7drl-challenge-2026 · itch.io/jam/gamedevjs-2027 · itch.io/jam/the-strategy-game-jam-2026 · itch.io/jam/finally-finish-something-2026 · itch.io/jam/second-chance-jam · itch.io/jam/astrocade-strategy-game-jam-2026
itch docs/blog: itch.io/docs/creators/game-jams · itch.io/docs/creators/design · itch.io/jams
Community: r/gamejams (GMTK data) · r/IndieDev (top-20 tips) · r/gamedev (Node Farm $150k postmortem) · r/gamedev (AI Browser Jam results)
