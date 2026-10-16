# HANGAR FREEZE — LD60 Social Contract
**Written:** Wed 2026-10-14 (before Fri Oct 16 6PM theme reveal)
**Pattern:** Kody Wildfeuer — "Feature Freeze as a Forcing Function"
**Rule:** Verbal freezes get violated. This is written. It holds.

## Freeze timeline (LD60 clock)
- **Fri Oct 16 6PM EDT:** Theme reveal. THEME_HOOK one-edit fill. Hangar code frozen.
- **Sun Oct 18 6PM (48h):** Hangar feature-freeze. 5-user gate runs on locked build.
- **Sun 6PM → Tue 6PM:** Bugfix + integration only. No new features.
- **Mon Oct 19:** Butler safe-candidate → `--hidden` staging channel.
- **Tue Oct 20, ≥60min before 6PM:** Final push to live. (butler processing ~30min)
- **Post-deadline:** LD-legal bug fixes only + changelog.

## ALLOWED during freeze
- Bug fixes (with repro + before/after evidence)
- MH-08 actionable-error DX (error messages, not new systems)
- Behavior-preserving refactors (no visible change)
- Number tuning via adapters/constants ONLY (no system changes)

## BANNED during freeze
- New hangar features
- Schema changes (SCHEMA v1 stays FROZEN)
- New theme adapters (16 is the count; no 17th)
- THEME_HOOK changes after theme+24h lock
- Audio-mix changes (mix FROZEN Fri 6PM)
- Mobile/touch changes (MOBILE-FREEZE at theme reveal)

## Deferred list
Every "one more hangar feature" idea goes here with a date.
Most are impulses that won't be missed. The freeze filters them.

| Date | Idea | Disposition |
|------|------|-------------|
| (empty — freeze hasn't started) | | |

## 5-user gate (deploy-ready acceptance)
5 fresh players, iPhone + desktop, build → deploy → finish M3 VEX duel, zero help.
Watch for shipped traps: dead ends, upgrade-apply bugs, soft-locks, hangar→combat desync.
Gate runs on the frozen build. Fails = bugfix, not feature.

## Rollback
Every freeze push tagged. Broken late build → revert to last known-good candidate instantly.
