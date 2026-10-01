# Project Frontier — PF-001

A reviewable, server-authoritative idle MMO foundation. The game is a single Next.js 16 App Router application with React, Tailwind CSS, Clerk authentication, and Replit-managed PostgreSQL through Drizzle.

## Run

```sh
pnpm install
pnpm --filter @workspace/project-frontier db:migrate
pnpm --filter @workspace/project-frontier db:seed
pnpm --filter @workspace/project-frontier dev
```

Replit supplies `DATABASE_URL`; Clerk setup supplies `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Locally, configure those variables using `artifacts/project-frontier/.env.example`. The development server uses `PORT` or port 3000. Use the existing Project Frontier workflow for Replit Preview.

## Verify

```sh
pnpm --filter @workspace/project-frontier test
pnpm --filter @workspace/project-frontier typecheck
pnpm --filter @workspace/project-frontier build
```

Tests require a development PostgreSQL connection and isolate their records in disposable schemas. Playwright configuration is included; public smoke tests can be run separately with `PLAYWRIGHT_BASE_URL` set to a running app.

The slice includes a signed-in dashboard, one 30-second wood-gathering activity, server-owned rewards/timestamps, retry-safe starts/claims, inventory, and a reward ledger. No background simulation or other game systems are included.

See [the application README](artifacts/project-frontier/README.md) for environment variables, endpoint contracts, architecture, migrations, and test limitations. The pre-existing API Server and Canvas templates are not used by the game: its UI and game APIs run together in Next.js.