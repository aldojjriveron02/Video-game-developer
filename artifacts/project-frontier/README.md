# Project Frontier

Project Frontier is a Next.js 16 App Router modular monolith. The Next server owns the authenticated game API, domain services, and PostgreSQL persistence. Clerk identities are translated to private player UUIDs on the server; the browser never supplies a player ID.

## Local and Replit setup

1. Provide a PostgreSQL database and set `DATABASE_URL`.
2. Configure the provisioned Clerk application keys as `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Copy `.env.example` to `.env.local` for Next.js local development; use Replit Secrets in a workspace. For database CLI commands in a local shell, export the values first (for example, `set -a; . ./.env.local; set +a`).
3. From the workspace root, install dependencies and apply development migrations and validate the versioned activity content:

   ```sh
   pnpm install
   pnpm --filter @workspace/project-frontier db:generate
   pnpm --filter @workspace/project-frontier db:migrate
   pnpm --filter @workspace/project-frontier db:seed
   ```

4. Start Next.js with `pnpm --filter @workspace/project-frontier dev`. Other common workspace commands are:

   ```sh
   pnpm --filter @workspace/project-frontier build
   pnpm --filter @workspace/project-frontier typecheck
   ```

   The root landing page remains public; signed-in activity data is served from the API.

`db:migrate` and Drizzle Kit configuration refuse to run when `NODE_ENV=production` or `FRONTIER_MIGRATION_ENV=production`. Replit-managed production schema changes are applied through Publish. Migrations are never run at application startup or during a build. Never point development migrations or integration tests at a production database.

## API surface

- `GET /frontier-api/dashboard` — authenticated `Dashboard` data.
- `POST /frontier-api/activities` — authenticated strict JSON command `{ "definitionId": "gather-wood", "requestId": "<UUID>" }`. Returns `{ "activity": ... }`.
- `POST /frontier-api/activities/{id}/claim` — authenticated owner-only claim. The request body is ignored; reward and finish time are derived exclusively from persisted state and database time. Returns `{ "activity": ..., "ledger": ... }`.
- `GET /frontier-api/health` — public sanitized app/database status; database configuration or connection failures report HTTP 503.

## Architecture and integrity

- `src/content` holds validated, versioned activity definitions. `gather-wood` takes 30 seconds and snapshots its fixed gold, XP, and wood reward into the activity record at start.
- `src/game` contains the game contract, command validation, errors, and service boundary. `src/database` owns Drizzle schema/migrations and the PostgreSQL repository.
- `src/server/identity.ts` is the only boundary from Clerk subject identity to an internal player UUID. Player rows are lazily provisioned from real authenticated Clerk identities; no seeded/test identity is used by application paths.
- Each start and claim takes a transaction-scoped `FOR UPDATE` lock on that player's row. A partial unique index independently enforces one active activity per player. `(player_id, request_id)` makes retries return the original start.
- Claim checks readiness against PostgreSQL server time after taking the lock, then marks the activity claimed, updates balances and inventory, and inserts the uniquely keyed reward ledger record in one transaction. Repeated claims return that saved result without granting again.
- The server does not simulate progress in a background job. Activity time is represented by persisted start/finish timestamps and evaluated at claim.
- `src/proxy.ts` runs Clerk middleware with host-aware publishable-key/proxy configuration. API handlers still perform their own signed-in and player-ownership checks; Clerk middleware is never bypassed for tests.

## Player resources and progression

Claimed gathering rewards persist in the player's PostgreSQL inventory, gold balance, and lifetime XP.
The dashboard shows stored resources, level, lifetime XP, and progress toward the next level.
Level is derived from lifetime XP rather than stored separately, so it cannot drift from the saved XP.
Everyone starts at level 1; advancing from level L costs 24 × L XP (level 2 at 24 total XP,
level 3 at 72, level 4 at 144). Existing players retain all earned resources and receive the
appropriate level immediately. A first successful claim reports whether it granted rewards and
how many levels were gained; retrying a claim grants nothing and never repeats level-up feedback.
Signing out does not delete the character; signing back in with the same Clerk identity restores it.

## Tests and limitations

```sh
pnpm --filter @workspace/project-frontier test:unit
DATABASE_URL='postgresql://...' pnpm --filter @workspace/project-frontier test:integration
DATABASE_URL='postgresql://...' pnpm --filter @workspace/project-frontier test
```

PostgreSQL integration tests require a real PostgreSQL `DATABASE_URL` and fail explicitly if it is missing. They refuse to run with `NODE_ENV=production` or `FRONTIER_MIGRATION_ENV=production`. Each run creates a random isolated schema, sets it as the connection `search_path`, stores Drizzle migration history in that schema, and drops only that test schema. They cover concurrent Clerk identity provisioning, 30-second start timing, persistence across repository instances, idempotent/concurrent start, early claim rejection without side effects, owner authorization, concurrent and sequential duplicate claim, exactly-once rewards, and level advancement with same-identity progression persistence. Unit tests cover pure command validation, time calculation, and level thresholds.

The Playwright configuration and public landing/health smoke specs are provided with `pnpm --filter @workspace/project-frontier test:e2e`. They were not run as part of backend implementation. E2E does not authenticate or bypass Clerk. This slice intentionally defers all game content and mechanics beyond the single gather-wood activity, including simulation, cancellation, trading, combat, and admin tooling.