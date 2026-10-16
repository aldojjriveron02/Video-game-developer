# Narrative Part 22 (Verification Round 5) — Findings (Round 309)
**Date:** Wed 2026-10-15 ~06:20 EDT · **Source:** live web research (kasavin, ruskin, inkwarden, playableplan, sfwa)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 5)

## A. Mechanics
- Variation audit (r/gamedev; Ruskin): "Conduct tonal balancing and line audits frequently." L4D2: concepts map 1-to-many via criteria rules — "variety is engineered, not hoped for." Kasavin: "No repeats" — "nothing sucks the momentum out of the game's narrative like a repeated line."
- Bible audit (Inkwarden; Megill): updates "at the point of change — not later, not in a batch." "This is how lore goes wrong in indie games. Not from lack of care." Bible is canon; audit against the actual game before each milestone. "Don't paint yourself into a corner."
- Freeze audit (PlayablePlan): freeze a source revision (not the whole project); two boundaries — translation baseline + release lock. Classify late changes new/modified/unchanged/deleted with stable IDs. Triage DEFER/TYPOFIX/RETRANSLATE/HOLD. One change record per late edit. Close gate only after testing the exact candidate build.

## B. Validation
- Table reads (Tyler; Hermansen): table read with main cast before recording — "everyone's on the same page performance-wise." Indie: dev half-acts the other side; or Discord read-aloud. "Hearing my stuff read aloud taught me so much about dialogue."
- QA briefing (SFWA/Ryan): "the narrative team is responsible for briefing QA on what it should be looking for." Engage from start; warn about known issues. QA hunts: plot inconsistencies, voice discrepancies, logic leaps, missing dialogue, spelling — plus proper nouns vs bible (Guild Wars 2: "no detail was too small").
- Line-ID discipline (r/gamedev): "Every line should have a unique string ID with what is effectively an array behind it." GUID per line for spreadsheet round-trips. "Stability is what matters." Never reassign an ID to new text.

## C. Techniques
- Voice bibles (Inkwarden): "single source of truth" — setting, characters, factions, history, voice. Character entries: appearance, voice, backstory, current state. Tone guide: "how the world feels, what language, grim vs hopeful."
- Contextual barks (O'Connor; Kasavin): barks = "stimulus and response" — "the game's way of talking back." Start from the trigger. Kasavin (Bastion): "dialogue is for subtext" — "the player's action is the text, so the line must say something the player couldn't have known." Keep short; reward experimentation.
- Variation pools (Hades; Ruskin): Hades — 300,000 words, 21,000 lines, one writer; variety survives roguelike repetition. Ruskin: "response rules are data driven" — writers edit in tools mode, no programmer needed.
- Honest scope (Bastion): narration exists because constraints demanded it — "never interrupt play," small-team bandwidth. "Rapid iteration access beats star power."

## D. What to avoid
- Bible drift (Inkwarden): deferred batch updates = "how lore goes wrong." Fix: canon + audit at every milestone.
- ID churn (PlayablePlan; r/gamedev): reassigning IDs "breaks the change-classification pipeline and silently orphans recorded audio and translations."
- Post-freeze rewrites: "a single 10-word line across five voiced languages scales from ~$10 to a $2,500+ emergency VO pickup." Mitigations: VO freeze before text freeze, single gatekeeper, batched pickups.
- Scope bloat (Kasavin): "lines written for a game you don't have the bandwidth to trigger, record, or test — which is exactly what a coverage gate and variation budget exist to catch."

## E. Shipped
- Bastion (Supergiant): five rules — dialogue-is-subtext, keep short, no fourth-wall breaks, reward experimentation, no repeats. One narrator (Cunningham), "fantasy-frontier" tone. "Every constraint served the play experience."
- Left 4 Dead 2 (Valve): AI-driven dynamic dialog — concept-based 1-to-many via criteria rules; data-driven, writer-editable; authored in Excel. "Variation engineered into the system rather than hand-managed."
- Hades (Supergiant): 300k words, 21k lines, one designer (Kasavin). "Voice discipline plus volume — every god sounds like themselves across thousands of contextual lines."

## Implemented this round
- **VERIFIED (analysis, no changes — frozen):** Kasavin's "dialogue is for subtext" governs NARRATORS (Bastion's narrator must say what the player couldn't know). Our lines are COMBAT BARKS, governed by Beaulieu's four jobs (inform, characterize, lore, brevity). "Running hot. Venting now." informs (state) + characterizes (ACE calm under pressure) — correct for a bark. The frameworks are not in conflict; they govern different line types. We have no narrator; our barks correctly follow the bark framework.
- **NARRATIVE-SPEC.md:** verification round 5 (below). Spec only, +0 lines. **4,559 lines** (+0).

## F. Sources
kasavin · ruskin · inkwarden · playableplan · sfwa · bastion · l4d2 · hades
