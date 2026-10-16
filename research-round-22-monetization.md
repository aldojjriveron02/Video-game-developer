# Monetization for Free Browser Games at $0 — Findings (Round 22)
**Date:** Tue 2026-10-13 ~21:59 EDT · **Source:** live web research 2026-10-13 (itch docs, Ko-fi/Patreon/GitHub pricing, IRS, postmortems)
**Project:** Mecha Protocol — how a free game eats without violating the $0 constraint

## A. itch.io tips (the day-one move)
- **Mechanics:** pay-what-you-want with $0 minimum + optional payments = built-in tip jar. Open Revenue Sharing 0–100% (default 10% to itch). **~30% of all money on itch.io is voluntary "extra" above the minimum** — tipping is platform-normal.
- **Fees:** $0.30 + 2.9% per transaction (a $1 tip gets eaten — nudge toward $2+).
- **Payouts:** $5 minimum; 7-day wait per transaction; first payout manually reviewed (7+ days); max 3 outstanding; tax interview (SSN/EIN) required; PayPal/Payoneer; 30% US withholding for non-US without treaty info.
- **Roottrees case (verified):** free itch browser version tip jar = **$3,000 in month one** (breakout surge, not baseline); the free version FED the $1M+ Steam release, didn't cannibalize it. Author: itch's real power is validating players "get it."
- **Expectation:** typical free itch game (hundreds of plays) = tens of dollars in tips, not hundreds.

## B. Ko-fi / Patreon / GitHub Sponsors
- **Ko-fi:** free plan = **0% on tips** (keep every tip); memberships/shop/commissions 5%; Standard (new default) 5% on all. Direct PayPal/Stripe payouts (no wait); Apple/Google Pay, Venmo, Cash App.
- **Patreon:** flat **10%** of income + processing/conversion/payout fees (old 5/8/12 tiers gone — materially pricier than Ko-fi for tip-style support).
- **GitHub Sponsors:** 0% for personal accounts (100% to dev); no PayPal; only fits if the code is open-sourced.
- **Reality:** devs favor Ko-fi for one-off tips, Patreon for recurring memberships. Small-scale benchmark: $143/mo from 29 members; typical small gamedev Patreons = tens to low-hundreds/mo. Working rewards: early builds, devlog access, feature votes, name in credits, Discord role.

## C. Selling alongside a free game
- itch.io sub-products/DLC: purchase URLs + JWT redeem — free base game + paid "Supporter Edition" (soundtrack/wallpapers/credits) as a sub-product. Self-hosted PWA just links to the itch purchase page.

## D. Ads — the honest math: DON'T
- Real numbers: 130k MAU web game → first AdSense payout **$145.66** (under restriction); premium network **$1,279.55/mo at 130k MAU ≈ $0.01/MAU**. Ban risk, CTR volatility, UX friction.
- At our scale (hundreds–thousands of plays): **cents to single dollars/month** — below tip-jar returns.
- **COPPA risk:** no personalized ads on child-directed content; anime-styled games plausibly qualify → lower-paying ads + compliance burden.

## E. Sponsorships / grants (free lottery tickets, not a plan)
- Indie Fund: investment not grant (55 games; repay first, then 25% revenue share; 2-yr release clause; rolling free applications).
- GameDev.tv: five $500 sponsorships/round. Google Play Indie Games Fund: $2M (Android-focused).
- Reality: "most solo indie developers do not get funded."

## F. The funnel + when to start
- **Roottrees path:** free itch prototype + tip jar day one → traction → paid version/supporter edition → recurring support.
- Conversions: page view → browser play 37–45%; ~30% of itch money is voluntary extra; player→tipper = hit-driven, no solid number.
- **Start DAY ONE.** Tip jar + PWYW cost $0 and gate nothing. Sequence: (1) launch with PWYW + tip jar; (2) supporter-edition sub-product when players ask for ways to support; (3) Ko-fi/Patreon only with a repeat audience.

## G. Tax/legal reality check (US, practical — not legal advice)
- All income taxable, forms or not. 1099-K: $20,000 AND 200 transactions (threshold restored Jul 2025).
- **Real practical threshold: $400+ net → self-employment tax (~15.3%) + filing requirement.** Keep records from dollar one (a spreadsheet suffices). LLC optional at this scale.

## Bottom line
**itch.io PWYW tip jar (day one) → supporter-edition sub-product → Ko-fi (0% tips); Patreon only if a recurring audience materializes. Ads = no. Grants = free lottery tickets.** Nothing formal needed until ~$400+ net.

## Applied to Mecha Protocol (this round's implementation)
- Added monetization plan to LAUNCH-PLAYBOOK.md Phase 0/2. Needs Aldo: revenue-share % choice (default 10%), payout setup (PayPal/tax interview) when tips arrive.

## H. Sources
itch.io/docs/creators/pricing · itch.io/docs/creators/payments · itch.io/docs/api/sub-products · itch.io/docs/general/about · howtomarketagame.com (Roottrees case; itch benchmark) · ko-fi.com/pricing · patreon.com/pricing · support.patreon.com (fees) · docs.github.com (Sponsors) · r/gamedev (Patreon experiences) · graphtreon.com · adsense.google.com/start/h5-games-ads · dev.to/yitao (ad postmortem) · forestry.games (eCPM skepticism) · support.google.com/adspolicy (children/teens) · blog.google (made-for-kids) · ftc.gov (COPPA) · indie-fund.com/about · irs.gov (1099-K)
