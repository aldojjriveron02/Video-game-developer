# Launch Strategy for a $0 Indie Web Game — Findings (Round 33)
**Date:** Tue 2026-10-13 ~23:55 EDT · **Source:** live web research 2026-10-13 (itch.io docs, ldjam.com, js13kgames.com, r/gamedev postmortems, chequered.ink, gameanalytics.com, web.dev, gamesuserresearch.com)
**Project:** Mecha Protocol — getting played

## A. itch.io publishing
- Free account → "Upload new project"; page private by default; flip Visibility to Public when ready. Publish date stamped, can't change.
- HTML type: ZIP with index.html entry (required). Embed: "Embed in page" (auto-play) vs "Click to launch in fullscreen" (recommended for complex games). Limits: 500MB extracted, 200MB single file, ≤1,000 files. New accounts may hit upload caps — request increase via support link.
- Mobile: tick "runs on mobile"; <900px viewport forces click-to-launch fullscreen. Touch-required games allowed.
- **Payments: HTML5 games can ONLY take donations.** Set "$0 or Donate" with suggested amount (e.g. $3). ~30% of itch.io money is paid ABOVE the minimum.
- Revenue share is OPEN — creator chooses the cut (default 10%, can go to 0%).
- Indexing needs: published + not access-limited + cover image + playable files. New sellers may hit manual review.
- Conversion: cover 315:250 (no text on it), trailer URL, animated GIFs, description = credits, contact, specs, controls, story, features, dev status, links. Max 10 tags — use all (genre + tech + aesthetic).
- itch.io's own warning: **"Recently released is a very bad place to launch!"** — launch traffic comes from outside links + tags + collections, not the new feed.
- Discovery drivers: devlogs, follows, collection adds.

## B. Game jams (calendar Oct 13, 2026)
- **Ludum Dare 60: Oct 16, 2026** (3 days out); LD61 Apr 2027. Jam (72h, base-code allowed) vs Compo (48h solo from scratch).
- **Game Off 2026 (GitHub): Nov 1 – Dec 1** — theme announced Nov 1, public repo required.
- GMTK 2026 just ran (10,531 entries, 223,337 ratings); next Aug 2027. Brackeys Feb 2027.
- **js13kGames EXCLUDES this game** (13KB zipped total; ~2,500 lines JS ≈ 60–100KB minified).
- Creation jams require building DURING the jam — can't enter as-is. Play: jam-sized spin-off on existing codebase (LD Jam allows base-code), or jams as visibility beats.

## C. $0 marketing — what moves the needle (real numbers)
- **Direct emails to YouTubers/streamers with playable demo:** 0–5 → 400 wishlists/day, peaked 1,400/day (Woum/DreadHaven). "Not my Shorts, not my social media — just the emails."
- **Free creator outreach > paid:** Keymailer Platinum $1,600 "not worth it" vs free outreach "100%" better (Guunnz/Lucky Shot).
- **Targeted Reddit:** one r/incremental_games post → 289 itch plays + ~80 wishlists same day; four subs → ~$150 week-one revenue, $0 budget.
- **r/playmygame** (35K): browser games get more players — no download wins. r/gamedev BANS self-promo — use r/playmygame, r/IndieGaming, genre subs.
- Wishlist sources: creators ~25%, showcases ~25%, events ~20%, Next Fest ~15%, own social ~10%, press ~4%.
- NOISE at $0: Shorts/TikToks pre-traction, tiny TikTok ad spend, press.
- Bluesky: no discovery algo — keyword/hashtag feeds, alt-text keywords, repost own posts, #ScreenshotSaturday, #PitchYaGame 2×/year. Posting = community-building, not reach.

## D. Launch analytics
- **GameAnalytics: FREE, no MAU cap, no credit card** — custom dashboards, funnels, retention, cohorts, A/B, remote configs. Already wired — paste keys, done. Best $0 pick.
- Plausible: paid-only ($9/mo). Tinybird free: overkill, 1k req/day cap.
- Metrics that matter: session starts; mission funnel (start→complete per mission, drop-off %); campaign completion rate; D1–D7 retention; PWA installs; median session length; donation conversion.
- Events to wire: session_start, mission_start/complete/abandon × mission × difficulty, turn_count, heat_death (balance), save_load (reinstall data-loss), install_prompt/standalone.

## E. Soft launch staging
- Private link (device/browser smoke + GA + saves) → friends & family 5–10 (onboarding: can they finish M1 unaided?) → closed playtest r/playtesters (mission drop-off, balance) → jam (Game Off/LD spin-off) → itch public → social blast (Reddit + YouTuber emails).
- Playtester numbers: 5 fresh per iteration (Nielsen), 6 to discover problems / 12 to understand players (GUR 2022); strategy games need 3–5 REPEAT testers for depth/balance.
- Measure/fix per stage: installs/analytics → onboarding → drop-off/balance → first-impression hook → retention → conversion.

## F. PWA distribution
- **iOS (target device): NO install prompt.** Manual: Safari Share → Add to Home Screen. Needs apple-touch-icon or the icon is a page screenshot. **Each iOS install gets isolated storage — reinstalls wipe localStorage saves** → warn players + offer export.
- Android: beforeinstallprompt → WebAPK (silent install, launcher icon). Desktop: URL-bar install badge.
- $0 tactics: in-game iOS install explainer, QR codes, share links with UTMs.

## G. Post-launch loops
- itch devlogs → game page + followers' feeds; every update is a marketing beat. Monthly-ish cadence; EN+JA devlogs double reach; pin a roadmap; reply to every comment in week 1.

## Applied to Mecha Protocol (implement-immediately, this round)
- **Telemetry gaps closed:** `session:start` design event on init; `save:resume/export/import/abandon` events; `install:standalone` (display-mode/navigator.standalone) + `install:prompt_shown` (beforeinstallprompt). Heat balance already covered by `combat:heat:overload`.
- **Help screen:** save section (Export downloads JSON backup; Import validates checksum and applies on reload) + iOS install explainer (3 steps + reinstall-wipes-saves warning).
- Already in place: apple-touch-icon linked; GameAnalytics guard-wrapped (keys = Aldo's hand).
- Aldo's hands: paste GameAnalytics keys; create itch.io account + DRAFT page (Restricted) — new sellers can hit manual review, so draft early.
- 2,498 lines, all syntax-clean.

## H. Sources
itch.io/docs/creators (getting-started, html5, pricing, faq, design, getting-indexed, interact) · itch.io/blog/how-we-curate · itch.io/jams/upcoming · ldjam.com · js13kgames.com · itch.io/jam/game-off-2026 · r/gamedev (Woum 1x37ecp, Guunnz 1wbvq1b, wishlists 1x3w0yc, Deforest 1x1n0vv) · r/playmygame/wiki/rules · chequered.ink (Bluesky guide) · gameanalytics.com/pricing · plausible.io/#pricing · tinybird.co/pricing · web.dev/learn/pwa/installation · gamesuserresearch.com
