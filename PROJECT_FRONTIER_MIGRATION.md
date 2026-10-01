# Project Frontier migration status

## Current working branch
- `project-frontier`

## Verified on GitHub
- Full Replit source history copied into GitHub.
- Inventory and equipment foundation present in source.
- GitHub Actions CI installed.
- Dependency installation passes in CI.
- Project Frontier unit tests pass in CI.
- Project Frontier TypeScript typecheck passes in CI.
- Codespaces dev-container configuration is committed.

## Runtime dependencies
The application expects:
- `DATABASE_URL`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

These values are intentionally not stored in GitHub.

## Current limitation
The repository is fully usable for source control, code review, unit testing, and type checking without Replit Agent credits.

Running the full signed-in app outside Replit still requires PostgreSQL and Clerk credentials. No migration or deletion of the existing Replit database has been performed.

## Safety
- Existing Replit app and database remain untouched.
- Existing GitHub `main` remains untouched.
- Development work should continue on `project-frontier`.
