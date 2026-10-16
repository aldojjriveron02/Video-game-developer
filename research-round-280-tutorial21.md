# Tutorial Part 21 (Verification Round 2) — Findings (Round 280)
**Date:** Wed 2026-10-15 ~04:00 EDT · **Source:** live web research (playtestquest, swift, bycer, lovato, baba is you)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 2)

## A. Mechanics
- Cold tissue (PlaytestQuest, Oct 2026): "tutorial work decays every time you change the game around it, so teaching needs retesting on every build." Fresh testers arrive cold — experienced testers no longer see the tutorial as a newcomer does. (Lovato/GameAnalytics: "Just let them play and don't disturb them in any way. Don't help the player by telling him what he should do, because that's the game's role.")
- Skip path (UX Collective; Bycer 2019): skip prompts are for advanced players, not an escape hatch for the frustrated. Skippable ≠ disposable — the core loop must be learnable without the tutorial. Anything skipped must be recoverable: "any tips or information [should be] organized and easy to surf through" (re-openable glossary). (r/gamedev Jul 2026: "Players skip tutorials, then blame the game" — design for skipping, don't fight it.)
- Assist battery matrix (Bugnet; Celeste/GAG): assist works "when it offers optional, escalating hints that guide toward the solution." Celeste's Assist Mode: offered once, never pushed, granular, always re-accessible from pause, unpatronizing framing. The battery: each assist feature × entry conditions (offered, declined, dismissed mid-way, invoked late-game, invoked during a tutorial beat) — never traps, never re-prompts aggressively, never changes game state.

## B. Validation
- 5 fresh players (Nielsen 2000/2012): "Testing with 5 people lets you find almost as many usability problems as you'd find using many more test participants."
- Silent observation (Lovato): never argue or emote while receiving feedback — let the player finish. Remote unmoderated = accepted fallback if presence biases.
- One-word test + paraphrase probe: PlaytestQuest's post-play check — "Describe what this mechanic does in your own words" (paraphrase proves understanding). Players who can't name it "prompt-check" (re-open the tutorial mid-play) = the teaching failed. Microsoft's desirability-word method (Benedek & Miner 2002) = the single-word gut-reaction probe.

## C. Techniques
- Safe rooms (PlaytestQuest's second law): "Players learn by doing, once, safely" — "Introduce the mechanic in a room where failing costs nothing." Validates our safe sandbox: first use of every mechanic scripted for success — the player learns the action's effect, not its risk.
- Swift (GDC China): "teach a skill by itself, with very few distractions. Then you reinforce it... reinforce newly-taught skills at least twice," then combine for the "a-ha moment" so players "feel really smart and accomplished."
- Offered-not-forced (Celeste): the shipped gold standard — offered once at a natural moment, never re-pushed, framed as accessibility not cheating.
- One sentence per beat (PlaytestQuest): for every popup ask "could the level before this moment have shown it?" Fix order: motivation → isolate → constrain → feedback → repeat → "only then add text. Two words. At the moment of use." Text is "a label, not a lesson": name the mechanic only after first use.

## D. What to avoid
- Unskippable intros (Bycer's mistake #2): "A game has 15 minutes to show its core gameplay loop" — don't spend it on a gate.
- Undismissable assist (trains players to ignore ALL guidance).
- Text walls (PlaytestQuest's thesis): "Players skip tutorials, but they still need to learn. How to teach mechanics through level design instead of popups."
- "We'll fix it with a tutorial" (PlaytestQuest's fix-order hierarchy): tutorial text is the LAST resort. Swift: "If players are learning the wrong things — 'It's not the player's fault — it's your fault.'"

## E. Shipped
- Baba Is You (Nordic Game Jam origin): no instructional text — early levels are "impasses" demonstrating rules through forced experimentation. ACM FDG 2024: direct-instruction tutorials vs originals = NO difference in engagement/difficulty/quiz scores. "Baba Is You is already designed to encourage players to encounter impasses that demonstrate the mechanics."
- Into the Breach (Subset): interactive tutorial scenarios + perfect-information UI. GDC 2019 Q&A literally fields "How do you make players feel smart?" — the a-ha principle.
- Portal (Valve): Swift's teach-alone-then-reinforce — sterile safe room, zero distractions, reinforced twice, combined for the a-ha. Playtesting "from week one."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** first-use-of-every-verb audit —
  1. MOVE: inherently safe (no failure mode — highlighted tile, no miss/overheat). ✓
  2. ATTACK: fail-safe (Round 184 — can't overheat, can't miss). ✓
  3. UNDO: "Mistakes are free" — the undo IS the safety net. ✓
  4. HEAT: just-in-time hint (tutorial.heatjit) at the moment of use. ✓
  All first uses are zero-cost. (PlaytestQuest's second law; Swift.)
- **TUTORIAL-SPEC.md:** verification round 2 (below). Spec only, +0 lines. **4,461 lines** (+0).

## F. Sources
playtestquest · swift · bycer · lovato · baba is you · into the breach · portal
