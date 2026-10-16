# Hangar Part 16 (Final Verification) — Findings (Round 252)
**Date:** Wed 2026-10-15 ~00:36 EDT · **Source:** live web research (harrison, igda, nielsen, firaxis, subset, mega crit, creative assembly)
**Project:** Mecha Protocol — hangar (jam hangar = preset squad-select; frozen)

## A. Mechanics
- Preview (Harrison, Into the Breach UX, Prototypr 2018): "When in doubt, display the information." ITB shows every intent and tile effect before commit — same principle makes preset cards trustworthy: every delta + signature ON THE CARD, never in tooltips. Directly validates our on-card delta design.
- Delta (IGDA Game Accessibility SIG Top Ten): never color alone — add icons/patterns/shapes. Our ▲▼ + numbers + weapon label = redundant encoding; audit = confirm glyphs carry meaning with hue removed.
- Signature (IGDA + Creative Assembly GDC: ~8% of men colorblind): shape/pattern identity, not color coding — critical on canvas where color is cheap but fragile.
- Reversibility (Harrison): ITB's squad-select = the game's first difficulty setting — honest about consequence; commitment cheap until confirm. Our selection≠commit (Enter deploys, browsing free) mirrors it.
- Speed (IGDA "Easy menus"): "quick start modes... gameplay in a small number of menu selections?" = the 30-second deploy test operationalized.

## B. Validation
- 5-user gate (Nielsen 2000, L=31%): 5 users uncover ~85% of problems; after the 5th, observation diminishes. Budget corollary: many small tests > one big test — 5 users = the COMPLETE protocol, not a compromise.
- 30-second test: five-second test (Optimal Workshop/NN/g — show 5s, hide, ask recall) + IGDA's small-selections rule. Cold browsing → Enter → deploy in 30s = speed + signature + commit clarity in one timed pass.
- Delta read-aloud (Nielsen 2012, "Thinking Aloud: The #1 Usability Tool"): "the single most valuable usability engineering method." Users reading deltas aloud ("Brawler: +2 HP, −1 Move, shotgun") forces every number through the mouth — misreads surface immediately. Robust even with flawed facilitation (jam-night reassurance).
- Signature check as five-second test: flash card, ask from memory "what's the weapon signature?" Not recalled → shape/pattern fix, never a brighter color (IGDA rule).

## C. Techniques
- Labeling honesty (Harrison): ITB's select screen = honest difficulty/identity choice. "Brawler" must play like a brawler — read-aloud catches "I expected X, card promised X, playthrough delivered X."
- Freeze after gate (Nielsen iterative rule + jam canon): gate = pass/fail verdict; after gate, bug fixes ONLY. Feature freeze 12–18h before submission. Post-gate redesign = new untested behavior in the validated screen.
- Failing preset: CUT IT (jam canon: "keep your scope minimal"). Two honest presets > three with a broken one — cut raises average quality, eliminates a broken choice.

## D. What to avoid
- Unfreezing after the gate (invalidates gate results; post-gate = untested behavior).
- Mislabeled presets (fix = relabel to reality or cut — never leave a lying label).
- Hidden stats (violates "display the information").
- Last-minute relabels (redesign, not bugfix — needs a new 5-user round the schedule doesn't have).

## E. Shipped
- Into the Breach (Subset): perfect-information UI — every outcome previewed; squad-select = honest difficulty/identity choice. Direct template for our on-card deltas + Enter=deploy.
- FTL (Subset): ship-select = full information card per ship (schematic, systems, weapons, drones, crew), 10 classes × 3 layouts, every one viable, no trap options.
- Slay the Spire (Mega Crit): character cards show max HP, relic, starter deck, honest playstyle descriptors — predict your first 10 minutes from the card. Gold standard for Brawler/Skirmisher/Bulwark: identity + full disclosure + one commit.

## Implemented this round
- **Verified (code read, no changes — frozen):** preset cards = name + RECOMMENDED/FOR-M1 tags + delta line + playstyle desc, all on-card, zero tooltips (Harrison rule satisfied). Selection≠commit structurally.
- **HANGAR-SPEC.md:** final verification — viability playthrough FIRST (before users arrive; cut failing presets, never relabel to mask); five-second signature test (shape/pattern fix, not color); grayscale as hard gate; freeze after Sun 6PM gate (bug fixes only; post-gate relabel = redesign = new 5-user round).
- Spec only, +0 lines. 4,417 lines (+0).

## F. Sources
harrison · igda · nielsen · creative assembly · firaxis · subset · mega crit
