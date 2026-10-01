---
name: Browser test authentication
description: How to verify protected game state without relying on the user's personal Preview login
---

A user signing into their own Preview does not establish a session in the browser tester. Reuse the tester's own authenticated context when available, or use an authorized isolated Clerk development test identity through the documented testing mechanism.

**Why:** Repeated checks found no browser page/context available to the tester even after the user signed in. An isolated programmatic Clerk development session allowed the complete gathering and progression checks without touching the user's character.

**How to apply:** Follow the testing skill's Clerk instructions. If the request is limited to an existing session and none is available, report the checks as not run. For sign-out/return persistence, retain the same Clerk identity and verify the internal player ID is unchanged; a new test identity does not prove persistence.