# LD60 MASTER PRE-JAM CHECKLIST
**Created:** Wed 2026-10-14 (Round 229) · **Consolidates all 9 frozen pillars**
**Deadline:** Tue Oct 20 6PM EDT · **Internal freeze:** Mon Oct 19 ~4PM EDT

## EMBED DECISION
- [ ] **LD embed vs self-hosted link:** LD embed sandbox blocks localStorage/IndexedDB/fetch.
  Our save layer detects `embedCtx==='ld'` → forces Export-primary UX (verified, Round 209).
  Decision: EMBED on ldjam.com (zero barrier) — saves degrade gracefully with warning.
  Self-hosted itch.io link as backup for full persistence.

## SUBMISSION MECHANICS
- [ ] Jam category (NOT Compo — 39h pre-existing code)
- [ ] Keep ALL voting categories (all graphics/audio original — no opt-out needed)
- [ ] Screenshots uploaded to ldjam.com
- [ ] Game hosted on itch.io (aldojjriveron02) via butler
- [ ] ZIP: index.html at root, ≤256MB, relative paths, no external requests
- [ ] 16:9 frame check (948×533) — portrait layout letterboxes cleanly

## MARKETING KIT (pre-make during jam)
- [ ] Cover image (ldjam 640×512; itch.io 630×500)
- [ ] Screenshots (gameplay, NOT menu first)
- [ ] Animated GIF of gameplay
- [ ] Page copy: about, how to play, tools used, feedback wanted
- [ ] itch.io: "No payments" pricing, ludum-dare tag

## 9-PILLAR FREEZE VERIFICATION
- [ ] **Hangar:** HANGAR_FREEZE.md holds; 5-user gate on locked build; no dead ends
- [ ] **Tutorial:** FROZEN code path; M3 one-liner; atomic skip; 5s hint; Kleenex strings
- [ ] **A11y:** GO CONFIRMED; aria-live; 10-point pass; 4.5:1; no flash >3×/s
- [ ] **Narrative:** Vois baseline (Sat 6PM); voice matrix; 70 lines audited
- [ ] **Feel:** FROZEN; number sheet locked; 100ms rule; 3-state shake
- [ ] **Audio:** Mix FROZEN Fri 6PM; −18 LUFS; −12dB BGM; −1dBTP; volume slider
- [ ] **Perf:** PERF-FREEZE Sat 6PM; dt 0.05s; HUD dormant; thermal soak on iPhone
- [ ] **Save:** SCHEMA v1; checksum; .bak; Export-primary; embed degradation verified
- [ ] **Mobile:** NOT-ready kept; MOBILE-FREEZE Fri 6PM; desktop-first

## SUBMISSION-DAY BATTLE PLAN
- [ ] Mon 4PM: internal freeze (no more changes)
- [ ] Mon ~6PM: submit (dodge crash-prone last-minute window)
- [ ] Tue: Submission Hour buffer; bug fixes only + changelog
- [ ] Post-submit: rate ≥10 games/day + comments (Coolness → visibility)
- [ ] Dev-blog postmortem draft ready

## THEME
- [ ] Fri 6PM: THEME_HOOK one-edit fill from 16 adapters
- [ ] No core redesign; adapters are data only
- [ ] Theme legible to cold player in 30s
