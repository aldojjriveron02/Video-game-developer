---
name: Next build isolation
description: Keep production builds from breaking the running Next development Preview
---

Keep development output separate from the production build directory. Preserve this separation when changing the Next configuration or build scripts.

**Why:** Running a production build while Preview was active corrupted generated development route/type files. After restart, valid authenticated pages and API routes returned 404, and TypeScript reported malformed generated declarations. Separate output restored routing; a subsequent production build left the running Preview healthy.

**How to apply:** Use the established development/production output split. Never repair generated declarations by hand. When diagnosing post-build routing failures, inspect generated route enumeration and cache health before changing Clerk or game code. Next may automatically add both development and production type include paths.