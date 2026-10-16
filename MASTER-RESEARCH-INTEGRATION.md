# Master Research Integration — Computing for Game Dev
**Source:** Brainstorm side chat, master research 2026-10-13 (40+ sources: GDC, academic, studio blogs)
**Integrated:** Wed 2026-10-14 ~13:50 EDT · **Project:** Mecha Protocol / Mecha Hangar / LD60

## What changes my recommendations

### 1. HEADLESS SIM — architectural gap found (Mecha Protocol)
**Finding:** `resolveAttack()` in game.js is tangled with rendering, SFX, tutorial,
barks, telemetry, and DOM. Combat CANNOT run without the browser. The 1v1
(mecha-hangar/sim.js) IS headless; the 3v3 grid is NOT.
**Action:** logged as post-jam architectural ticket. Extract pure combat resolution
(damage, heat, limb destruction) from presentation (floaters, SFX, barks). One
investment unlocks: Monte Carlo balance sims, playtest bots, CI-gated testing.
**Not now:** LD60 is 2 days out; the slice pillars don't include it. Post-jam.

### 2. AI LADDER — validates current approach
We run utility AI (enumerate-score-pick) = ladder step 1. Correct per the research.
Step 2 (behavior trees for faction personalities) applies when factions get distinct
personalities — after Aldo names them. Steps 3-4 (minimax, MCTS) are future boss work.
**No ML/RL for shipped enemy AI** — we are clean; never recommend it.

### 3. LD60 — butler for itch.io deploys
Indie pattern: git tag → CI builds → auto-deploy via butler/steamcmd. Added to
LD60-SUBMISSION-CHECKLIST.md. Web build is static — butler push is the fast path.

### 4. AUTOMATED QA — we have the indie stack
Have: headless sim (1v1) + bot tests + nightly QA + regression gate.
Missing: fuzz the state machine with random action sequences; screenshot/visual
regression; automated perf profiling. Fuzzing is the highest-ROI add (post-jam).

### 5. ANALYTICS — write queries before instrumenting
We have telemetry + consent. Missing: death/move heatmaps for grid tactics
("trivial to build, enormously informative"). Post-jam: add heatmap events.

### 6. CI FROM WEEK ONE — applies to LD60
GitHub Actions is free. For the jam: one-command static build + butler push.
Post-jam: CI gates merges on node --check + bot tests.

### 7. GENAI — concepting only
We use canvas/procedural art (human-made). Holds. Never ship genAI art as final.

## What does NOT change
- Utility AI choice (validated). No-ML stance (validated).
- Vertical slice pillars (readable puzzles / modular mechs / iPhone sessions).
- LD60 scope freeze (theme = skin, not redesign).
