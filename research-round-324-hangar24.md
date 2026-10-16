# Hangar Part 24 (Verification Round 7) — Findings (Round 324)
**Date:** Wed 2026-10-15 ~07:13 EDT · **Source:** live web research (bromley, nng, tilford, itb)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 7)

## A. Mechanics
- First-run audit (Bromley; PUNCHev; JeremyTDM): "treat the hangar as the first high-stakes decision screen." "Asking the player 'to make a decision before they understand the choice' is a top mistake." JeremyTDM: "players defaulted to the first option without exploring, driven by poor visual hierarchy, unclear feedback, overwhelming layout."
- Decision-time audit (NN/g Kendrick): "visibility of system status (selected, ◆, ★ distinct at a glance?), match between system and real world (do 'Brawler/Skirmisher/Bulwark' mean anything to a new player?), recognition rather than recall (recWhy on the card, not from memory), aesthetic minimalism (show only what matters to THIS mission)."
- Error-recovery audit (NN/g 3,5,9): "selection reversible until launch; misclick undoable with clearly marked emergency exit; launch is deliberate, confirmable commit, not accidental single tap." "Give feedback on everything."

## B. Validation
- First-time user testing (Bromley): "observe silently, never coach — gaps between what the player thinks and what the game does are the findings." "Ask probing questions that don't reveal information." "Use only first-time players — veterans are biased."
- Decision analytics (Bromley; GameAnalytics; JeremyTDM): "instrument behavior and compare to designer intent." Metrics: "time-to-select, option diversity rate, drop-off before game start, selection confidence (1–5), downstream completion."
- Misclick analysis (NN/g): "selection flip-flops, rapid re-selection, accidental launches as usability signals, not noise." "Log taps on non-card areas and near-miss taps."

## C. Techniques
- Progressive disclosure (NN/g): "defer advanced features to secondary screen; curate so users aren't overwhelmed." Card face: name, role one-liner, ◆/★, recWhy. Full stats one tap deeper.
- Smart defaults (PUNCHev): "Make the default the good path. Most players never change a default." ★ pre-selected; ◆ = "this mission wants this."
- Undo-friendly (NN/g): "support undo, clearly marked emergency exits; confirmation before irreversible actions."
- Clear mental models (Bromley; NN/g): "shrinking the gap between the player's mental model and the intended experience." "Preset names + plain-language role descriptions, consistent badge meanings."

## D. What to avoid
- Overwhelming choices (Tilford; Laws of UX): "choice overload sets in around 7+ options." "A 3-preset hangar is inherently safe — keep it that way; do not add variants pre-freeze."
- Hidden defaults (PUNCHev; JeremyTDM): "players silently accept the first option without understanding." "A default not labeled as recommendation converts the hangar into a fake choice."
- Irreversible actions (NN/g): "launching without clear, confirmable commit is the canonical hangar failure." "Gate only the true commit."
- Confusing labels (NN/g): "invented terminology raises cognitive load." "If 'Skirmisher' vs 'Bulwark' doesn't survive a 5-second test, add the plain-language role line."

## E. Shipped
- Into the Breach (Subset): "choices are sequenced, each choice's meaning is visible, and the UI communicates rather than decorates." Ma: "we would sacrifice cool ideas for the sake of clarity every time." "Direct model for the ◆/★ hangar."
- FTL (Subset): "the full trade-off set is visible on the decision screen." "No hidden information at decision time."
- JeremyTDM case study: redesign measured "time-to-select, diversity rate, drop-off, confidence (1–5)." "Treated the selection screen as a decision instrument and measured decisions, not opinions."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** deploy flow. Two clear paths: (1) tap any preset card → `applyPreset(i)` immediately deploys that preset (hangar.js:90); (2) big "▶ DEPLOY — [Name] ★" button → deploys the recommended (hangar.js:95). Each path shows exactly what it deploys (preset name on card, preset name on button). One-tap deploy (Round 174, One Minute Rule) — fast and clear for 3 choices. Selection is the commit; no hidden state. ★ pre-selected (safe default); ◆ + recWhy on mission-optimal (informed choice).
- **HANGAR-SPEC.md:** verification round 7 (below). Spec only, +0 lines. **4,565 lines** (+0).

## F. Sources
bromley · nng · tilford · itb · ftl · puncHev
