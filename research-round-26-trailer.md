# Trailer & Teaser Craft for Indie Tactics at $0 — Findings (Round 26)
**Date:** Tue 2026-10-13 ~22:30 EDT · **Source:** live web research 2026-10-13 (Derek Lieu, r/gamedev, itch.io docs, OBS guides, platform specs)
**Project:** Mecha Protocol — the launch trailer, researched before it's needed

## A. Structure (the proven anatomy)
- **Hook in the first 3 seconds:** first shot = actual gameplay being played — never logo, "presents" card, or slow pan (Derek Lieu: Firewatch/Subnautica/Spelunky 2 trailer editor).
- Length: 60–90s launch; 30s teaser. "Nothing will make your game look smaller than repetitive content."
- Music needs beginning/middle/end with dynamic beats — never loop game music; cut shots and sound on the beat.
- End card: logo + 1–2 lines (platform/price), logos ONLY at the end.

## B. Tactics-specific (Lieu's strategy-game article)
- Gradual build-up: one idea at a time, fast. **Punch-in closeups** for variety (zoom into a limb being destroyed / heat maxing, back to tactical overview).
- Title cards state the FANTASY not features ("MECHA TACTICS", not "50 levels").
- Highlight the decisive moment with a graphic effect (blueprint overlay / UI callout on limb-damage or heat-gamble).
- A few full-HUD shots for hardcore fans; rest HUD-less. Time-lapse for the hangar build montage.
- Establish GENRE in the first seconds (grid, mechs, turn indicator) — not atmosphere. Design muted-first for social.

## C. Capture at $0 — OBS Studio
- 1920×1080, 60 FPS, MKV; NVENC H.264 CQP 20–22 (or x264); keyframe 2; audio 320kbps; CBR alt 6,000–9,000 kbps. Record at NATIVE resolution (no upscale in OBS). Remux MKV→MP4 before editing. Social cuts: 1080×1920.

## D. Editing at $0
- **DaVinci Resolve free** = consensus pick (no watermark, 4K export, Fusion graphics, full audio) — steeper curve, one skill reusable for the full game. CapCut for rapid 9:16 teasers. Clipchamp only for trivial edits.
- Techniques: jump cuts on the beat, speed ramps (slow-mo on the kill), punch-in zooms, minimal intercut text, curated game audio layered under trailer music.

## E. Music at $0
- **Pixabay Music** — "epic trailer" 26,040+ tracks, "epic trailer music" 70,390+, "game trailer" 20,461+ (dev already uses Pixabay for SFX — licensing familiarity carries). Mixkit (royalty-free). Incompetech CC-BY — attribution legally required, awkward on socials.
- Pick a track with rise→hit→resolve arc; sync cuts to beats; capture WITHOUT game music, then layer curated SFX (impacts, UI clicks) subtly. Deliver ~−14 LUFS / −1 dBTP [unverified industry figures].

## F. Teaser variants (6–15s, Bluesky/X/TikTok)
- One mechanic/moment each (limb-tear 6s, heat-gamble 8s, hangar time-lapse 10s); reuse trailer's strongest shots.
- **Burnt-in captions mandatory** (~85% watch muted [unverified]); CapCut auto-captions = free.
- 9:16 (TikTok/Reels/Shorts), 1:1 (X feed), 16:9 (YouTube/Bluesky). REFRAME on the action for vertical — never letterbox.
- Specs: Bluesky MP4/H.264 ≤1920×1080, ≤3 min (use 3 min, sources conflict); X 2:20 max, 512MB.

## G. itch.io specifics
- Trailer = "Video URL" in Edit game → Metadata; **YouTube/Vimeo/SketchFab only — itch does NOT host files**; URL must be public (test incognito).
- Player sits ABOVE screenshots. **Adding a video enables the "Watch trailer" button on grid listings** — the discoverability payoff. Thumbnail = YouTube thumbnail (design like one: bold, high-contrast mech + title).

## H. Mistakes (Lieu's don't-list)
1. Logo-first. 2. Slow intro / no gameplay in first 10s. 3. Too long / repetitive. 4. No game audio (or music fighting SFX). 5. Bad eye trace (action jumping around the frame). 6. Unstructured looping music. 7. Unfocused capture (plan shots first). 8. Text walls / HUD overload. 9. Generic title cards ("50 AMAZING LEVELS!" — communicate what's UNIQUE). 10. Scattershot story. 11. Unique thing appears too late (not at 0:45).

## Applied: 60-second shot list (in LAUNCH-PLAYBOOK.md Phase 1)
0:00–0:03 HOOK: arm torn off, close-up, beat drop on impact. 0:03–0:08 grid movement + attacks ("MECHA TACTICS"). 0:08–0:16 hangar time-lapse ("BUILD YOUR MECH"). 0:16–0:24 limb-destroy zoom ("PER-LIMB DAMAGE"). 0:24–0:33 heat gauge gamble ("HEAT IS A BET"). 0:33–0:42 M2→M3 escalation + difficulty cards. 0:42–0:52 VEX ace reveal ("FACE THE VEX ACE"). 0:52–0:57 reward draft + PWA/JA glimpse. 0:57–1:00 end card: logo, "FREE PROLOGUE — itch.io".

## I. Sources
derek-lieu.com (trailer mistakes; RTS/strategy trailer guide; start-here) · YouTube: "5 Simple Game Trailer Templates", "The Best Game Trailer Template" (Jul 2026), "How to Edit a Game Trailer That Keeps Viewers Hooked" (Aug 2026) · gameanalytics.com/blog/dos-and-donts-game-trailers · reddit.com/r/gamedev (trailer advice; free editors — top answer: DaVinci Resolve) · obsproject.com forums · vdocipher.com · pixabay.com/music (trailer categories) · mixkit.co/free-stock-music · itch.io/docs/creators/design · techcrunch.com (Bluesky video) · klypse.app (aspect ratios)
