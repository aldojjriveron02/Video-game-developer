# Tutorial Part 23 (Verification Round 4) — Findings (Round 298)
**Date:** Wed 2026-10-15 ~05:37 EDT · **Source:** live web research (bycer, hedges, fan, gee, bromley)
**Project:** Mecha Protocol — tutorial (pre-jam; verification round 4)

## A. Mechanics
- Failure-pattern watch (Bycer): three classic patterns per review round — (1) tutorial covers essentials without context then "throws the player to the wolves"; (2) opening frontloaded with exposition/choices a new player can't understand; (3) onboarding dragged out so the player disengages before the core loop lands.
- Research-grounded watch list (Hedges, 10-player study): hand-holding, not skippable, patronizing tone, forced videos/cutscenes, information overload, disrupting game flow, irrelevant information, failing to provide necessary information, constant pauses/stops, too long, undismissable popups.
- Signal rule (Bycer): behavioral + repeatable — players hesitate/fumble/ask at the same beat across sessions. "If the failure repeats across players, it's a design signal, not a player error." Axiom: "Hard games should not have hard tutorials" — failing at the tutorial itself = strongest signal.
- Fix-order (Bycer; Bromley): (1) anything blocking the core loop (ship-blocker); (2) UI confusion — "the UI must never be the confusing part — fix the UI, don't add more tutorial text"; (3) pacing/order; (4) polish. Define research objectives BEFORE testing; prioritize by impact/actionability.

## B. Validation
- Fresh players (Bycer; Bromley): "fresh eyes are the most valuable asset" — they reveal exactly where learning breaks. Screening determines result reliability.
- Silent observation (Bromley): "observing players, and asking probing questions to assess their current understanding and opinions is the most powerful tool available for playtesting." Moderator silent during play; never coaching/leading mid-session (bias).
- Paraphrase probes (Hedges): after play, elicit the player's own account — explain back what a mechanic does, when they'd use it. "If they can't paraphrase it, the tutorial beat didn't land, regardless of what they claimed during play."
- Behavior over claims (Bromley): "what they did outweighs what they say they understood." Objectives tied to dev priorities before the round.

## C. Techniques
- One sentence per beat (Fan, PvZ GDC 2012): "Use Fewer Words" — ≤8 words per instruction sentence. "Just get the player to do it once" — perform the action once, then direct. Hedges interviews confirmed "short message preference."
- Information on demand, just in time (Gee): no manual before starting; help text available on demand + just in time, usable as reference after play begins — the glossary justification.
- Safe rooms (Hedges): "low chance of failing" + "freedom to experiment." Dark Souls bonfire model — low consequences, fast retry, safe experimentation → growth mindset.
- Offered, not forced: Total War — adjustable guidance levels, changeable mid-game, "not forced upon the player, always available." Nintendo Super Guide — appears only after 8 deaths, only as optional video. "Direct professional precedent for the 3-turn assist: trigger on repeated failure, offer it, let the player decline." Celeste Assist Mode — opt-in, assistance as accessibility, never imposed.
- Impasse design: productive, low-cost failure — allowed to get stuck, but stuck costs almost nothing and teaches something. World 1-1: "gradually and naturally understand" through the level itself. Portal: "believe it was their own choice." Bycer: "the very best tutorials occur organically with the level design itself."

## D. What to avoid
- Unskippable intros (Hedges; Bycer): not skippable, forced videos, undismissable popups, forced pace. Returning players who can't skip/re-view = churn risk.
- Undismissable assist: pop-up advice that can't be dismissed = the mirror image. Pro fix: adjustable guidance / opt-in trigger.
- Text walls (Hedges; Bycer; Fan): overload, too long, constant pauses; frontloaded exposition. "Anything that reads as a paragraph where a sentence would do is a text wall at jam scale."
- Tutorial-as-fix (Bycer): "onboarding is not just the tutorial." If the UI is confusing, fix the UI — "tutorial text layered over bad UI is a band-aid, not a tutorial." "No matter what the quality of a game is, it doesn't matter if people stop playing or never start."

## E. Shipped
- Into the Breach (Subset): no overbearing tutorial — perfect information (enemy intent) every turn, so each turn = a small logic puzzle. "Players report feeling smart because they worked it out themselves." Tutorialization embedded in information design, not text. The model for small-scope tactics.
- Baba Is You (Hempuli): Nordic Game Jam 2017 origin. Teaches entirely through level design — "the rules are literal word tiles inside the playfield — the glossary is always visible, re-openable, never a text wall." Zero frontloaded exposition, one rule per level, safe experimentation (undo/restart instant + free). IGF "Excellence in Design."
- Plants vs. Zombies (PopCap): Fan's GDC talk — "Just get the player to do it once," ≤8 words per sentence, one mechanic per level, tutorial IS the first levels. Onboarded total non-gamers (Fan's mom) into strategy. >1M copies first year.

## Implemented this round
- **FAN'S 8-WORD GUIDELINE (js/i18n.js):** three hints exceeded the ≤8-word rule. Tightened without losing meaning:
  - Heat: "See the 🔥 gauge? Hot mechs hit +1, take +1. Push too far: shutdown." (14) → "Hot: +1 hit, +1 taken. Overheat = shutdown." (8)
  - Heat JIT: "Too hot — shutdown. Cool down or vent before pushing again." (11) → "Shutdown! Cool down or vent first." (6)
  - Undo: "Mistakes are free: ↩ rewinds the turn. Once per mission." (10) → "Mistakes are free: ↩ rewinds once per mission." (8)
  All 5 hints now ≤8 words. +0 → **4,511 lines**, all clean.
- **TUTORIAL-SPEC.md:** verification round 4 (below).

## F. Sources
bycer · hedges · fan · gee · bromley · into the breach · baba is you · pvz
