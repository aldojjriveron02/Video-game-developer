# Ludum Dare 60 — Submission Checklist
**Event:** LD60 Jam track (72h) · **Game:** Mecha Protocol · **Theme reveal:** Fri Oct 16, 6:00 PM EDT
**Deadline:** Mon Oct 19, ~6:00 PM EDT · **Prepared:** Oct 14, 2026

## Rules verified (ldjam.com)
- Jam: 72 hours, teams allowed, AI assistance allowed, pre-made assets OK (any you have rights to).
- Submission needs: playable build via URL + source code link + writeup + ≥1 screenshot.
- Grades: Overall (mandatory), Fun, Innovation, Theme, Graphics, Audio, Humor, Mood (1–5 scale).

## Pre-reveal (NOW → Fri 6PM)
- [x] **itch.io account — CONFIRMED.** Aldo has one: **aldojjriveron02** (screenshot verified Oct 14, 13:23 EDT). No setup needed.
- [ ] Decide: itch.io vs direct static hosting (game is vanilla JS — can ship as static files anywhere).
- [ ] Screenshot/GIF capture plan: which moments (hangar, mid-combat, VEX duel, KO).
- [ ] Jam page draft: title, description template, controls list (theme-specific bits left blank).
- [ ] Web build packaging: single-folder static build (index.html + js/ + css/ + assets). Test in incognito.
- [ ] Source code: public repo link ready (GitHub).

## Theme reveal → Fri night
- [ ] Theme-fit decision (2h max): which skin, what changes. See THEME-FIT-STRATEGY.md.
- [ ] Scope freeze signed. See SCOPE-FREEZE-PLAN.md.

## Sat–Sun (build)
- [ ] Theme skin implementation (text, names, briefings, barks, palette).
- [ ] Daily playable build verification (incognito, iPhone + desktop).
- [ ] Screenshots/GIFs captured from real gameplay.

## Monday (submit)
- [ ] Final build packaged + uploaded.
- [ ] Jam page published: writeup, screenshots, source link, controls.
- [ ] Submission confirmed before 6PM EDT deadline.
- [ ] Post-mortem notes captured (for the devlog).

## Deploy path (butler)
- itch.io account: aldojjriveron02 (confirmed).
- Web build is static (index.html + js/ + css/) — push via `butler` CLI for fast iteration.
- Monday order: final playtest → butler push → jam page → submit by 3PM EDT (buffer).

## Aldo's action items (flagged, not mine to do)
1. ~~itch.io account setup~~ — CONFIRMED: aldojjriveron02 exists (Oct 14, 13:23 EDT). Struck.
2. Theme call Friday 6PM — the one creative decision that's his.
3. Faction names + tone — still TBD from the narrative spec; jam theme may answer it.
