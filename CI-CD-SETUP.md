# CI/CD shell — setup guide
[EL-LOKO · 2026-10-15] Staged by the whole-system improvement loop (Round 6 Topic 3).
The deploy pipeline itself is `.github/workflows/jam-deploy.yml` (verified 2026
butler + GitHub Actions pattern). This doc covers the three steps that need Aldo.

## What's already done (no action needed)
- Workflow file staged: tag `v*` → package `build/` → syntax-check JS → butler push
  to itch.io. Pinned Node 22, separate deploy job, `BUTLER_API_KEY` secret only in
  the deploy step, concurrency cancel-in-progress — the 2026 canonical pattern.
- It does NOT touch game code: it packages `build/` exactly as the build room
  leaves it. Jam locks (JAM_BUILD flag, EN-only, EASY default, hangar squad-select)
  stay the build room's job before any tag.

## Needs Aldo's call (3 steps, ~15 min, one time)
1. **GitHub repo.** `git init` in `mecha-strategy-game/`, create the repo under his
   GitHub account, push. (Repo is not git-initialized yet — deliberate: publishing
   decisions stay his.)
2. **Secret.** On itch.io → Account settings → API keys → new key → add as repo
   secret `BUTLER_API_KEY`. (Key values never pass through chat — he pastes it
   straight into the secret, same rule as always.)
3. **Game slug.** Repo → Settings → Variables → new repository variable
   `ITCH_GAME_SLUG` = the itch.io game slug (the part after `aldojjriveron02/` in
   the game URL). The workflow fails loudly until this is set.

## Jam usage (Fri Oct 16 6PM EDT onward)
- Build room freezes scope → tag, e.g. `git tag v0.1.0-jam && git push --tags`.
- Actions packages + pushes to the `html` channel on itch.io automatically.
- Fallback stays live: manual `butler push` per LD60-SUBMISSION-CHECKLIST.md —
  the checklist's Monday order (playtest → push → submit by 3PM EDT) doesn't change.
- Jam discipline (verified 2026): no automation work in hour 1; one-button package
  6h before deadline; the last hour is tuning feel, not watching a stalled upload.

## Why release-please is parked
The 2026 pattern pairs this with release-please + conventional commits for
auto-changelogs. Parked until the repo exists (step 1) — it needs git history to
work from. Revisit after the jam.
