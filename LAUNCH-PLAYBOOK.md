# Mecha Protocol — Launch Playbook
**Built from:** Round 20 live-web research (2026-10-13) · **Status:** plan — needs Aldo's hand on the flagged items
**Standing rule:** itch does NOT sustain traffic — spikes come from us. Distribution, not conversion, is the bottleneck.

## Phase 0 — NOW (prototype)
- [ ] **Aldo: create the itch.io page** (early = SEO indexing + stable link every later effort points to). HTML5, free, browser-playable (converts ~3x more players than download-only).
- [ ] **MONETIZATION (day one, $0):** launch with **pay-what-you-want + tip jar** (revenue share default 10%; ~30% of itch money is voluntary extra; fees $0.30+2.9% — nudge $2+). Later: supporter-edition sub-product (soundtrack/wallpapers/credits) when players ask; Ko-fi (0% tips) for one-off support; Patreon (10%) only with a repeat audience. **No ads** (cents/month at our scale + COPPA risk). Aldo's call: revenue-share %; payout setup (PayPal + tax interview) when tips arrive.
- [ ] Start devlog cadence: **one honest post every two weeks minimum** (GIF-first, hook-first, one focus, struggle + decision, one soft CTA).
- [ ] Post to **r/playtesters** (seek playtesters, don't pitch; max 2/wk) and **r/DestroyMyGame** (brutal pre-launch feedback).
- [ ] Private testing channel for trusted players. **No public Discord yet.**
- [ ] Repurpose each devlog → 2–4 short clips + 1 screenshot (Bluesky-first; MP4 not GIF).

## Phase 1 — Pre-launch (3+ weeks out)
- [ ] **GAME JAMS (the spike engine):** recommended sequence —
  - **Nov 1–7, 2026: 7-Day Strategy Game Jam** (18 days out; open theme; AI-with-disclosure; browser OK) → near-term tactics build reusing engine code
  - **Jan 2027: Finally Finish Something** → finish Mecha Protocol itself (in-progress projects welcome)
  - **Apr 13–26, 2027: Gamedev.js Jam** → best AI-friendly web fit, 13-day build window
  - **Aug 11–15, 2027: GMTK** → biggest traffic; needs from-scratch Windows/mouse build, zero AI art/audio
  - Jam rules: rate MANY others' games (Coolness/karma); browser-playable beats downloads; keep the jam page live post-jam (ratings/comments = social proof); ship "post-jam version" updates on it.
  - Typical big-jam entry: ~5–25 ratings; 50 ratings = top 6%. It's a spike — convert it (devlogs, link to standalone page).
- [ ] Creator outreach: ~100 contacts in the 50–2,000 viewer band (find via comparable games) → expect ~10 videos. Pitch: "no download, plays in browser, runs on anything." Use Partnier/Woovit free tiers; <150-word personalized emails.
- [ ] Submit to jam/demo channels + free-game listing sites.
- [ ] Participate (don't promote) in r/TacticalRPG, r/Mecha, r/WebGames, mecha/anime/tactics Discords — check each sidebar's promo rules first.

### Trailer (60s) — shot list (Round 26 research; capture with OBS 1920×1080 60fps, edit in DaVinci Resolve free)
Hook in first 3s = gameplay, never logo. Music: Pixabay "epic trailer" track w/ rise→hit→resolve arc; cuts on beats; capture WITHOUT game music, layer curated SFX.
- 0:00–0:03 HOOK: arm torn off close-up, beat drop on impact. 0:03–0:08 grid movement + attacks ("MECHA TACTICS"). 0:08–0:16 hangar time-lapse ("BUILD YOUR MECH"). 0:16–0:24 limb-destroy zoom ("PER-LIMB DAMAGE"). 0:24–0:33 heat-gauge gamble ("HEAT IS A BET"). 0:33–0:42 M2→M3 escalation + difficulty cards. 0:42–0:52 VEX ace reveal ("FACE THE VEX ACE"). 0:52–0:57 draft + PWA/JA glimpse. 0:57–1:00 end card: logo, "FREE PROLOGUE — itch.io".
- Teasers (6–15s, one moment each, burnt-in captions, 9:16 reframed): limb-tear 6s / heat-gamble 8s / hangar time-lapse 10s. itch: YouTube URL → Metadata → enables "Watch trailer" button on grid listings; thumbnail = YouTube thumbnail.

## Phase 2 — Launch day
- [ ] **FRAME AS PROLOGUE/DEMO, not a complete game** (3 missions; Kriegsfront ~1hr precedent) — public roadmap; next content milestone 6–10 missions (~2–3h, one Into the Breach run). "Demo" framing with roadmap > 3-mission "full game."
- [ ] **r/playmygame** (free build qualifies), **r/IndieGaming**, **r/indiegames**; genre subs **staggered one per week**; **r/Games "Indie Sunday."**
- [ ] GIF-first posts, **US mornings 8–11am ET**. 90-9-1: participate before promoting.
- [ ] Cross-post clips to Bluesky + X (#screenshotsaturday, #indiedev).

## Phase 3 — PWA release (second launch beat)
- [ ] Installable iPhone version = its own announcement cycle (differentiator).
- [ ] Updated itch page + prominent "Installable iPhone version →" link; in-game link already in build.
- [ ] Push to mobile-friendly channels.

## Phase 4 — After
- [ ] Public Discord **only once sustained outside interest exists** (fewer channels than feels complete; presence = activity).
- [ ] Short-form cadence 3–5/week (peak visual density first, <15s, cut menus).
- [ ] Monthly: export GameAnalytics red-flag data (design events expire after 1 month).

## Success calibration
- Median free itch game: ~1,500 views / ~110 downloads lifetime. Top-30%: >12K views / ~1K downloads.
- **Our goal: beat median via distribution.** One breakout post (~100–150 wishlist-scale) or one streamer video (~1K-scale interest) can 10x the baseline.

## Needs Aldo (his call, not mine)
1. itch.io page creation + account
2. GameAnalytics keys (paste into js/telemetry.js)
3. Social accounts (Bluesky/X) — or the call to skip them
4. The "is it fun?" playtest verdict — still the prototype gate

## Round 93: Production Discord spec (open at playtest, NOT before)
**Channels (≤6):** #announcements (read-only), #welcome (pinned: what the game is), #rules (short), #general, #mech-lab (hangar builds), #bug-reports. Add #off-topic early.
**Rules:** ≤6 channels; 35 empty channels repel newcomers. Expand past 100 members only.
**Activity:** dev posts screenshot/GIF weekly; responds within 24h. "An empty Discord is worse than none."
**First 50–100:** hardest phase. Recruit from itch page + Reddit. Never spam. Dev = the activity.
**Mods:** at 100 members, recruit 1–2 volunteers from trusted actives. Moderate from day one.
**Burnout:** publish online hours. Never promise 24/7. Delegate, automate.
**Reddit:** 10-second GIFs (limb-pops, chevron cascades); niche subs; genuine participation; slow burn.
**Devlog:** weekly/bi-weekly, specific ("fixed X" not "great progress"). Target 50 for compounding.
