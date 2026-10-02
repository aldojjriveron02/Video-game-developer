# Project Frontier

Project Frontier is a Next.js 16 App Router modular monolith. The Next server owns the authenticated game API, domain services, and PostgreSQL persistence. Clerk identities are translated to private player UUIDs on the server; the browser never supplies a player ID.

## Local and workspace setup

1. Provide a PostgreSQL database and set `DATABASE_URL`.
2. Configure the Clerk application keys as `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. Copy `.env.example` to `.env.local` for local Next.js development. For database CLI commands in a local shell, export the values first (for example, `set -a; . ./.env.local; set +a`).
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

`db:migrate` and Drizzle Kit configuration refuse to run when `NODE_ENV=production` or `FRONTIER_MIGRATION_ENV=production`. Production schema changes are applied explicitly through the database deployment workflow; migrations never run at application startup or during a build. Never point development migrations or integration tests at a production database.

## API surface

- `GET /frontier-api/dashboard` — authenticated `Dashboard` data.
- `GET /frontier-api/inventory` — authenticated resource stacks, unique gear, item details, player progression and equipped slots.
- `GET /frontier-api/skills` — authenticated core combat, gathering and production skill progression.
- `PUT /frontier-api/equipment/{slot}` — authenticated strict JSON `{ "instanceId": "<UUID>" }`; equips owned, compatible gear and returns the updated inventory. Slots are `hand`, `body` and `head`.
- `DELETE /frontier-api/equipment/{slot}` — authenticated unequip; returns the updated inventory. Retrying an empty slot is harmless.
- `POST /frontier-api/activities` — authenticated strict JSON command `{ "definitionId": "gather-wood", "requestId": "<UUID>" }`. Returns `{ "activity": ... }`.
- `POST /frontier-api/activities/{id}/cancel` — authenticated owner-only cancellation. Cancelling is idempotent, grants no reward, records server cancellation time and immediately frees the player to start another activity.
- `POST /frontier-api/activities/{id}/claim` — authenticated owner-only claim. The request body is ignored; reward and finish time are derived exclusively from persisted state and database time. Returns activity, ledger, reward-granted flag, levels gained and progression.
- `GET /frontier-api/health` — public sanitized app/database status; database configuration or connection failures report HTTP 503.

## Architecture and integrity

- `src/content` holds validated, versioned activity and skill definitions. `gather-wood` takes 30 seconds and snapshots its gold, character XP, Woodcutting XP and wood reward into the activity record at start.
- `src/game` contains the game contract, command validation, errors, and service boundary. `src/database` owns Drizzle schema/migrations and the PostgreSQL repository.
- `src/server/identity.ts` is the only boundary from Clerk subject identity to an internal player UUID. Player rows are lazily provisioned from real authenticated Clerk identities; no seeded/test identity is used by application paths.
- Each start, cancel and claim takes a transaction-scoped `FOR UPDATE` lock on that player's row. A partial unique index independently enforces one active activity per player. `(player_id, request_id)` makes retries return the original start. Cancellation is server-timestamped, rewardless and idempotent, so switching jobs cannot duplicate rewards.
- Claim checks readiness against PostgreSQL server time after taking the lock, then marks the activity claimed, updates balances and inventory, and inserts the uniquely keyed reward ledger record in one transaction. Repeated claims return that saved result without granting again.
- The server does not simulate progress in a background job. Activity time is represented by persisted start/finish timestamps and evaluated at claim.
- `src/proxy.ts` runs Clerk middleware with the configured publishable key. Clerk frontend traffic goes directly to the configured Clerk instance; the app does not expose a secret-bearing authentication proxy. API handlers still perform their own signed-in and player-ownership checks; only the public health endpoint bypasses Clerk middleware.

## Player resources and progression

Claimed gathering rewards persist in the player's PostgreSQL inventory, gold balance, lifetime character XP, and relevant skill XP. Wood gathering currently trains Woodcutting.
The dashboard shows stored resources, level, lifetime XP, and progress toward the next level.
Level is derived from lifetime XP rather than stored separately, so it cannot drift from the saved XP.
Everyone starts at level 1; advancing from level L costs 24 × L XP (level 2 at 24 total XP,
level 3 at 72, level 4 at 144). Character level is capped at 100 while lifetime XP may continue to accumulate. Existing players retain all earned resources and receive the
appropriate level immediately. A first successful claim reports whether it granted rewards and
how many levels were gained; retrying a claim grants nothing and never repeats level-up feedback.
Signing out does not delete the character; signing back in with the same Clerk identity restores it.

## Core skills

`/skills` exposes 18 persistent core skills: six combat (Strength, Defense, Dexterity, Agility, Vitality, Tactics), six gathering (Mining, Woodcutting, Fishing, Hunting, Herbalism, Foraging), and six production (Blacksmithing, Cooking, Alchemy, Carpentry, Leatherworking, Tailoring). Skills start at level 1, use the version-one progression curve, and cap at level 100 while lifetime skill XP can continue accumulating. Activity rewards snapshot both character XP and any skill XP at start; claiming `gather-wood` grants Woodcutting XP exactly once. Existing claimed wood-gathering rewards are backfilled into Woodcutting XP when the skills migration is applied.

## Inventory and equipment foundation

`/inventory` separates persistent resource stacks from unique equipment instances, with inspectable item details and Hand, Body and Head slots. New and returning players receive one Field Axe (Hand) and one Work Vest (Body); stable per-player grant keys prevent repeated grants. Equipment has no combat or gathering effects in this milestone.

Ownership comes exclusively from the authenticated player. Equip and unequip use the same player-row lock as gathering, validate item/slot compatibility before changing anything, and never delete displaced equipment. Database constraints enforce one instance per slot and one copy of each starter grant. Missing and foreign-owned gear return the same 404; invalid requests and incompatible slots return 400.

Development runs use `.next-dev`, while production builds retain `.next`, so building does not overwrite the live Preview's generated route cache. Generated migration foreign keys use the active `search_path` rather than hard-coding `public`, keeping integration tests fully isolated.

## Tests and limitations

```sh
pnpm --filter @workspace/project-frontier test:unit
DATABASE_URL='postgresql://...' pnpm --filter @workspace/project-frontier test:integration
DATABASE_URL='postgresql://...' pnpm --filter @workspace/project-frontier test
```

PostgreSQL integration tests require a real PostgreSQL `DATABASE_URL` and fail explicitly if it is missing. They refuse to run with `NODE_ENV=production` or `FRONTIER_MIGRATION_ENV=production`. Each run creates a random isolated schema, sets it as the connection `search_path`, stores Drizzle migration history in that schema, and drops only that test schema. They cover concurrent identity provisioning, gathering timing and persistence, cancellation and immediate switching, early/foreign claims, exactly-once concurrent rewards, level advancement, inventory display data, one-time starter grants for new and returning players, equip/unequip restoration, incompatible/missing/foreign items, forged identity fields and concurrent replacement without equipment loss. Unit tests cover command validation, item definitions, time calculation and level thresholds.

The checked-in Playwright smoke specs (`test:e2e`) cover public landing/health behavior only; they do not yet authenticate or exercise the complete signed-in gameplay loop. Production smoke checks verify health, landing, Clerk sign-in, and signed-out authorization behavior against the exact deployed revision. The signed-in gathering, cancellation, inventory and skills flows still need a dedicated automated Clerk test account before they can run unattended. Beyond gathering, skills, resources, progression and basic equipment management, other game systems remain deferred: no combat, pets, marketplace, crafting, quests, guilds, housing or final art.