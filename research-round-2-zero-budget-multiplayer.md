# Async Multiplayer MMO-lite at $0 — Findings (Round 2)
**Date:** Tue 2026-10-13 ~19:40 EDT · **Source:** live web research, pricing read from official pages 2026-10-13
**Project:** Mecha Strategy Game · **Constraint:** $0 — no paid services, ideally no credit card

## A. Architecture: async needs no live server
Async turn-based multiplayer (Words-With-Friends style) does NOT need persistent connections or a 24/7 game server. Standard pattern: the game is a state machine persisted as data. Player submits turn → HTTPS request → serverless logic loads authoritative state, validates the move, applies it, stores new state + appends move to event/replay log, notifies opponent (push or poll on next open).
- Server-authoritative is the only sane choice for async (clients untrusted, offline-capable). The "server" can be serverless functions, not a process.
- Two storage models: full state snapshots per turn (simple, storage-hungry) vs event sourcing / replay log (initial state + ordered validated moves; re-derivable; doubles as anti-cheat audit trail and spectator replays).
- Frameworks: Firebase, Supabase, Cloudflare Workers + Durable Objects/D1, Colyseus (realtime-oriented), Nakama (self-host OSS), PocketBase (single-binary OSS backend with server hooks).

## B. Free backend options (exact free-tier numbers, official pricing pages)
1. **Cloudflare Workers — best $0 fit:** 100K requests/day, 10ms CPU/invocation; KV 100K reads/day, 1K writes/day, 1GB; D1 (SQLite) 5M rows read/day, 100K written/day, 5GB, zero egress; Durable Objects 100K req/day; R2 10GB-months, 1M+10M ops, zero egress; Queues 10K ops/day. Free tier = hard caps, not surprise bills. Card requirement unverified (historically usable without).
2. **Supabase free:** unlimited API requests, 50K MAU, 500MB Postgres, 5GB egress, 1GB file storage, 200 concurrent realtime connections, 500K Edge Function invocations. CAVEAT: free projects pause after 1 week of inactivity (manual reactivation — real ops annoyance).
3. **Firebase Spark (no-cost, "no payment method needed"):** Auth 50K MAU; Firestore 1GiB, 20K writes/day, 50K reads/day; RTDB 100 simultaneous connections; FCM push no-cost; Hosting 10GB + 360MB/day. **CRITICAL: Cloud Functions NOT available on Spark — no server-side code on free tier. Pure-$0 Firebase cannot do server-authoritative move validation. Disqualified for cheat-resistant async.**
4. **Nakama:** no free managed tier (Heroic Cloud from $600/mo). OSS self-host free, but needs a host.
5. **Colyseus:** core OSS free/self-hostable; Cloud from $15/mo. Realtime-oriented — overkill for async.
6. **PocketBase:** fully free OSS single binary (realtime SQLite, auth, file storage, admin UI) with Go/JS server hooks — server-side validation CAN run at $0. Catch: needs an always-on host.
7. **Upstash Redis (leaderboards/rate limits):** free $0 — 250MB, 10GB bandwidth/mo, 500K commands/mo. Exceeding = rate-limited, not billed.
8. **Always-on hosting at $0:** Fly.io — NO free tier, card required (~$2.19/mo cheapest). NOT $0. Render Hobby $0 — free compute (sleeps on idle; survivable for async, adds latency), free Postgres + KV, 5GB bandwidth/mo. Oracle Always Free exists but requires card verification.

## C. Free persistence (all fit indie scale — a hangar record is KBs/player)
Supabase 500MB Postgres · Firestore 1GiB (20K writes/day binding) · Turso SQLite free, no card: 100 DBs, 5GB, 500M reads/mo · Neon Postgres free, no card: 1GB/project · Cloudflare D1 5GB + R2 10GB zero-egress · Upstash 250MB (leaderboards as sorted sets) · PocketBase/SQLite unlimited by disk.

## D. Real indie examples
- **Lichess** (open-source, async correspondence chess): Scala + MongoDB + Redis; ~$0.00027/game at scale — per-game marginal cost microscopic; a small game runs on one cheap VPS. (Exact figures unverified — source page login-walled.)
- **webDiplomacy** (open-source browser async strategy — closest genre analog): PHP/MySQL, volunteer-run; server fees "hundreds of USD/year" via donations. Async is the cheapest genre to host: compute per-move, not per-connected-second.
- Pattern: free/cheap infra at start; costs appear only with scale.

## E. Anti-cheat at $0 — fully achievable (NOT the thing that breaks $0)
1. Server-side move validation (all of it): every move checked by trusted code (Worker/Edge Function/PocketBase hook — all $0). Kills 95%+ of cheating.
2. Information hiding: server only sends each client what that player may see (fog of war). Free — a query filter.
3. Replay/audit logs: immutable validated-move log → post-hoc detection, disputes, spectator replays. Tiny storage.
4. Commit-reveal for simultaneous moves: pure code.
5. Rate limiting + auth: free on all tiers.
What $0 does NOT buy: kernel anti-cheat, bot detection, human moderation. For turn-based tactics these matter far less; residual risks (account sharing, multi-accounting, solver-AI assistance) aren't fully solved by money either.

## F. HONEST VERDICT
**Mostly yes — $0 MMO-lite is achievable with one architectural non-negotiable: truly asynchronous + serverless.**
$0 stack: Cloudflare Workers (100K req/day) + D1 (5GB) for game state/hangars/guilds, Upstash Redis free for leaderboards, FCM/Web Push free for "your turn" notifications, static frontend on Cloudflare Pages/Render free. Validation, replay logs, fog-of-war all run in Workers at $0. Supabase free is the alternative (Edge Functions + Postgres), minus the 1-week idle pause caveat.
What breaks $0: (1) Firebase-alone — no server code on Spark, needs Blaze + card. Trap. (2) Persistent-socket servers (Colyseus/Nakama/self-hosted) — no $0-no-card host; realtime needs ~$2–15/mo or sleep/wake latency. (3) Scale ceilings are generous (100K req/day ≈ thousands of daily async players; 50K MAU Supabase) — beyond that, ~$5–25/mo, cheap but not zero. (4) Abuse risk: a griefer could burn the 100K req/day quota — rate limiting mandatory (free to implement).
**The honest sentence: Phase 2 is achievable at $0 if it stays truly asynchronous and serverless; the moment it needs an always-on process, the no-card constraint dies first, then $0 at roughly $2–25/month.**

## G. Sources (pricing visited 2026-10-13)
gabrielgambetta.com/client-server-game-architecture.html · quago.io (cheating mitigation) · supabase.com/pricing · firebase.google.com/pricing · developers.cloudflare.com/workers/platform/pricing/ · heroiclabs.com/pricing/ · colyseus.io/pricing/ · pocketbase.io · turso.tech/pricing · neon.com/pricing · upstash.com/pricing/redis · fly.io/docs/about/pricing · render.com/pricing · webdiplomacy.net (donations)
[synthesis] = reasoning; [unverified] = seen in snippets/AI overviews, not confirmed on primary page.
