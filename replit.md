# Project Frontier

PF-001 is a minimal server-authoritative idle MMO foundation, not the full game.

## Run & Operate

- Replit workflow: `artifacts/project-frontier: web`.
- Run targets that existing managed workflow directly; Project Frontier owns Preview `/`. Keep unused API Server and Canvas templates stopped unless explicitly needed.
- `pnpm --filter @workspace/project-frontier dev` — Next.js development server.
- `pnpm --filter @workspace/project-frontier build` — production build including TypeScript checking.
- `pnpm --filter @workspace/project-frontier typecheck` — standalone TypeScript check.
- `pnpm --filter @workspace/project-frontier test` — unit and real PostgreSQL integration tests.
- `pnpm --filter @workspace/project-frontier db:migrate` — development-only Drizzle migrations.
- `pnpm --filter @workspace/project-frontier db:seed` — validate versioned content; no fake player seed.
- Production schema changes use Replit Publish; never run migrations on startup or in builds.

## Stack & Structure

The runnable game lives entirely in `artifacts/project-frontier`: Next.js 16 App Router, React, Tailwind CSS, Clerk, PostgreSQL, Drizzle, Vitest, and Playwright configuration.

- `src/app` — pages and Next route handlers.
- `src/components/frontier` — intentionally simple UI.
- `src/content` — version-controlled gathering definitions.
- `src/game` — domain contracts, commands, service boundaries.
- `src/server` — auth adapter, environment validation, service wiring, API errors.
- `src/database` — server-only connection, repository, schema, migrations, content seed.
- `tests` — unit and isolated-schema PostgreSQL integration tests.

The pre-existing shared Express API and Canvas are unused templates, not a separate game backend. Do not add game logic to them or shared generated API packages.

## Product Constraints

- Preserve a modular monolith. Do not replace Next.js with the original Vite scaffold.
- Clerk identity remains separate from internal player UUIDs.
- The server owns timestamps, rewards, completion decisions, and persistent state.
- One outstanding gathering activity per player; completion is evaluated on claim, never continuously simulated.
- Player-row locks serialize mutations; claims atomically update activity, balances, inventory, and the uniquely keyed ledger.
- Repeating a start request ID or claiming again must return the original result without extra rewards.
- Do not add combat, pets, marketplaces, crafting, quests, guilds, housing, businesses, seasons, final art, or balancing without a new request.

## Pointers

See `README.md` and `artifacts/project-frontier/README.md` for setup, endpoints, and verification limitations.