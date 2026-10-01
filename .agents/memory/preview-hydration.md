---
name: Preview hydration
description: Why a healthy-looking Next.js Preview can still render a blank Clerk page
---

Verify browser hydration and the Next.js development WebSocket, not just the landing page or HTTP status, when troubleshooting blank auth in Preview.

**Why:** In this workspace, server-rendered pages returned HTTP 200 and Sign in navigated correctly, but Clerk remained loading until Next.js accepted the Preview origin for its HMR connection. The Clerk scripts and upstream auth service were healthy.

**How to apply:** Check browser errors and Next.js cross-origin rejection logs first. Replit's development hostname can include multiple subdomain levels; Next's single-star hostname wildcard matches only one level. Prefer the exact runtime-provided development hostname, plus the local Preview hostname used by capture tools. Keep this change limited to the development-resource allowlist; do not alter Clerk secrets or the production auth proxy.