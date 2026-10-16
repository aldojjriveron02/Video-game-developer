# Narrative Part 21 (Verification Round 4) — Findings (Round 300)
**Date:** Wed 2026-10-15 ~05:45 EDT · **Source:** live web research (force media, salivity, beaulieu, vois, sfwa)
**Project:** Mecha Protocol — narrative (pre-jam; verification round 4)

## A. Mechanics
- Coverage audit (Force Media): unique line ID for every line; per-line context (character, scene, tone/intent, trigger); never reuse/duplicate IDs. The audit verifies every trigger maps to lines, none orphaned. For this game: the ≥95% gate IS the audit.
- Tone audit (Salivity): character bible (mannerisms, vocabulary, cadence, sentence structure, emotional baselines, taboo words) + centralized editorial passes. One writer "owns" each character's final pass. Tone audit = read every VEX line against the bible, not just grammar.
- Repetition watch (Beaulieu): variation counts per trigger — "write 2, 3, even 10 variations of a single trigger line." L4D2's "performed variations" set the standard. The Skyrim guard ("Never should have come here") = what happens without a watch. Flag any high-frequency trigger with a thin pool.

## B. Validation
- Read-aloud (Salivity; Vois): table reads with writers, designers, voice directors — "hearing dialogue spoken aloud surfaces tone, pacing, and character-logic problems invisible in silent reading." Bark lines carry duration budgets; test against real gameplay, not just on the page.
- Fresh ears (SFWA/Ryan): brief QA with narrative targets before play passes — QA as fresh eyes hunting inconsistencies, voice discrepancies, missing dialogue. "Warn them about already-known issues, so fresh ears aren't wasted on known noise."
- Line-ID stability (Force Media): IDs stable + unique from script through recording and translation; renumbering/reusing breaks the chain. "IDs are the contract between script, triggers, and voice assets."

## C. Techniques
- Barks (Beaulieu): four jobs — (1) inform the player, (2) characterize, (3) spread lore through universe-specific language, (4) say more with fewer words. Keep them short and clear.
- Taunts (Narrative Dept): stimulus–response — the player "speaks" through actions, the bark answers "I hear you / I see you." Write from the player's shoes.
- Contextual lines (VoiceDesignResource): the bar is L4D2-style — lines keyed to specific situations, with performed variations. "Know the trigger behind each bark and write to it; test in real play."
- Voice-friendly text (Vois; Force Media; Salivity): short lines, duration budgets, one clear intent per line, per-line context notes for performers. Align early with the voice director.

## D. What to avoid
- Repetitive barks: one line on a frequent trigger heard hundreds of times = the Skyrim-guard pattern. Mandatory variation pools for high-frequency triggers.
- Tone drift (Salivity; SFWA): multiple writers without a bible + no single owner = fractured voices. QA flags character-voice discrepancies first.
- Unvoiced text walls (Vois; Game Developer): everything in gameplay short and audible. "Long unvoiced blocks are a red flag that the line belongs in a different channel."
- Post-freeze rewrites (Localazy; Force Media): string freeze — "rewording text invalidates in-progress translations." After freeze, changes are exceptions with full pipeline cost, never silent edits.

## E. Shipped
- Left 4 Dead 2 (Valve): contextual AI-driven barks, performed variations — "set the industry standard." Lines responded to actual situations; survivors felt like reacting people, not looping NPCs.
- God of War (2018): "Gonna drag your carcass to Asgard" — characterization inside combat, short enough to fit the action, "each bark a tiny dramatic moment rather than filler."
- Far Cry 2 (Ubisoft): Redding's GDC 2009 — "every bark was designed around its gameplay purpose first — informing, warning, taunting."

## Implemented this round
- **BEAULIEU'S 3+ RULE (js/i18n.js + js/barks.js):** high-frequency triggers (firstkill, limblost, overheat, heat50) had only 2 variants each — the Skyrim-guard risk. Added a 3rd variant per pilot (12 new lines), matching each voice bible:
  - p0 (ACE): "Clean. Moving on." / "Limb lost. Adapting." / "Heat's spiking. Venting." / "Heat's rising. Staying sharp."
  - p1 (ROOKIE): "Yes! That's how it's done!" / "Hey—! That was my favorite one!" / "Whoa, hot! Cooling! Cooling!" / "It's getting hot in here!"
  - p2 (VETERAN): "One less. Continuing." / "Limb destroyed. Rerouting." / "Overheat imminent. Venting now." / "Heat at sixty. Still nominal."
  All ≤12 words (density rule). BARK_COUNTS updated 2→3. Verified: all new keys resolve. +12 → **4,530 lines**, all clean.
- **NARRATIVE-SPEC.md:** verification round 4 (below).

## F. Sources
force media · salivity · beaulieu · vois · sfwa · l4d2 · god of war · far cry 2
