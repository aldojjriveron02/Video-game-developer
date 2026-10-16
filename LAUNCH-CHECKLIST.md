# Mecha Protocol — $0 Launch Checklist
**Version:** 2026-10-14 · **Channel:** itch.io (HTML5, donations-only PWYW) · **Budget:** $0

## Page (index-ready)
- [ ] Published (not access-limited), cover image, playable in browser
- [ ] Tags researched for live-vs-dead traffic (Luden.io method: position, saturation, churn) — tags are distribution, not decoration
- [ ] Accurate metadata + description; quality-guidelines compliant
- [ ] Donations enabled at $0 minimum (PWYW is automatic)
- [ ] Suggested PWYW price set: $3–$5 (never blank — suggested price is the lever; avg payments exceed it)
- [ ] Monetization stance (Round 64, repriced Round 79, refined Round 96, sales spec Round 113): NO ads, NO IAP, NO pay-to-win — prototype is a free audience play. Supporter Pack ($4.99, cosmetics-only: 4 liveries, hangar banner, 2 portrait frames, PDF artbook) PLANNED for post-slice, not shipped. **Commander Edition ($24.99):** base + Supporter Pack bundle (deluxe anchor — makes $19.99 the "sensible middle"). itch.io: $19.99 PWYW floor ("$19.99 or more", Buckshot pattern), 10% cut (~$17.11 net/copy). Steam = NOT NOW — only when finished + demand evidence + 7,000 wishlists (Popular Upcoming floor). Then $19.99 launch (Wargroove comp; $14.99 floor if playtest says thin; NEVER sub-$5 — 75% max discount depth), 10% launch discount ($17.99), discount ladder 10%→20%→30% max year one, browser stays free forever. **Structural:** browser build needs an Electron/Tauri wrapper to sell on Steam — budget that engineering before the Steam gate. **NEVER:** race-to-bottom, cheap bundles (Steam-native only), raise price post-launch (Iron Lung), promise Steam keys for itch buyers.

## Timing
- [ ] TUE–THU launch, late morning ET — never Friday (no weekend hotfix hours)
- [ ] Do NOT launch during a major game-jam weekend (New & Popular window is short)
- [ ] Publish date is permanent — sequence the launch deliberately
- [ ] "Most Recent" browse boost fires ONCE — page must be 100% complete before flipping Public (ship quietly public-restricted NOW to bank followers + clear the new-seller review queue)

## Portal sequence (Round 60)
1. itch.io FIRST (home base: no SDK, butler hotfixes, devlogs, follower feed) — FREE/PWYW, donations on (HTML5 plays = donations only)
2. CrazyGames (largest browser audience; 7–21 day QA — submit in parallel with itch launch; ≤50MB initial load)
3. GameDistribution / GameMonetize / Y8 (all non-exclusive, SDK required)
4. Newgrounds + GameJolt (community/long-tail exposure)
- [ ] SKIP Poki's default 5-year web-exclusivity term (or negotiate) — breaks multi-portal
- [ ] ZIP hygiene: relative paths, case-correct filenames, HTTPS-only externals, ≤1,000 files / ≤500MB / ≤200MB per file
- [ ] 960×540 embed, Click-to-Play, fullscreen button, Mobile Friendly ON; iPhone 17 real-device test MANDATORY

## Launch day hour-by-hour (Round 60)
- [ ] T-1h: final build verified live; incognito page preview; payments confirmed
- [ ] T+0: flip to Public; verify pricing/screenshots/tags/mobile embed
- [ ] T+0–1h: pre-written announcements (X/Bluesky/Reddit/Discord); press list emailed with live link
- [ ] T+1–4h: monitor itch analytics + comments; respond within hours
- [ ] Breakage protocol: acknowledge publicly fast; patch only when severe
- [ ] Day 2–7: critical hotfixes 24–48h; thank-you devlog; check traffic sources

## Post-launch 30 days (Round 60)
- [ ] Week 1: hotfix window; engage every covering creator
- [ ] Weeks 2–4: QoL patch from top-3 complaints; don't spam updates
- [ ] Month 1: first content update; ONE game-jam entry within 60 days (itch's strongest free visibility); Creator Day PWYW push
- [ ] Funnel diagnostic: low views = marketing problem; low plays = page problem; low ratings = game problem

## Launch day actions
- [ ] Post devlog on launch (feeds itch.io freshness + audience)
- [ ] Post in itch.io Release Announcements forum (staff monitor it)
- [ ] One gameplay clip readable in 3–5 seconds, posted to ONE platform consistently (start: relevant mecha subreddits + itch.io devlogs)
- [ ] **Mute test (Round 80, Buckshot rule):** every clip must narrate its stakes with sound OFF in ≤12s (chevrons filling → overheat → limb lost). If not, re-cut.
- [ ] **Creator outreach (Round 80):** 100–200 personal emails to 5k–250k-sub tactics/strategy creators ~30 days before slice demo; Steam key in first email; no wishlist-begging; 2 follow-ups max; include non-English creators.
- [ ] **Wishlist CTA (Round 80, Kitfox funnel):** every devlog ends with a Steam wishlist link once the page is live — "a community not converted into wishlists triggers nothing."
- [ ] howtomarketagame.com playbook skimmed

## Retention instrumentation (already in)
- [x] session:start, mission funnel, per-lesson tutorial events, time-to-first-action
- [x] retention:day_N + retention:streak_N (local, works without GA keys)
- [ ] GameAnalytics keys pasted (Aldo's hand) for real D1/D7/D30

## Pre-launch retention feature
- [ ] Daily Sortie (seeded daily challenge): same seed + constraints + rotating modifier for all players; local streak counter; shareable result via build-code system. Zero marginal content cost.

## Honest expectations
- D1 15–25% (browser session basis) = healthy; 30%+ = exceptional; D7 low single digits
- Tip-jar economics: ~1–3% pay, ~$1.50–3 average → 10k players ≈ $150–900. Plan on $0.
- Success metrics that matter at $0: share-code circulation + devlog follower growth
- Skip Discord until regulars ask for it. Patch notes with personality = cheapest retention content.

## Round 92: Production launch targets
- [ ] Launch day: Tue–Thu ~10am PT; date set 2 weeks ahead; embargo lifted day before
- [ ] itch.io: DON'T flip Draft→Public until page is final (one-time follower blast)
- [ ] Steam: ≥7,000 wishlists before scheduling; capsule legible at 120×45px
- [ ] Discount: 10–20% launch only; ZERO discount in first 30 days; staircase after
- [ ] Hotfix ≤7 days; weekly devlog + 2 social posts/week; 15–20 creators month 2
- [ ] Free content update + 20–30% discount at day 60–90
- [ ] Hoard Steam's 5 Update Visibility Rounds for content updates only
- [ ] Review engine: in-game dismissible prompt after M1 + campaign completion (honest wording, never ask for positives)
- [ ] Bomb defense plan written: monitor velocity, report to Steamworks, fix fast, pinned statement, never argue
- [ ] Stage platforms: itch.io browser FIRST; Steam 60–90 days later (not simul-ship)
