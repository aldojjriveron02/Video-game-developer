# Hangar Part 25 (Verification Round 8) — Findings (Round 333)
**Date:** Wed 2026-10-15 ~07:47 EDT · **Source:** live web research (qatestlab, bycer, xcom2, itb)
**Project:** Mecha Protocol — hangar (pre-jam; verification round 8)

## A. Mechanics
- Briefing audit (QATestLab): "briefing is complete only if a player can restate the objective, difficulty, and reward without re-reading." Required fields: "mission type, name, location, objective, difficulty, reward, hints." "Separate mandatory vs optional objectives."
- Loadout audit (Bycer): "keep all actionable information in one unified pane — never split attention across two zones." "Visual cues readable at glance; educational UIs that teach in context."
- Commitment audit (XCOM 2): "explicit 'Launch Mission' confirmation after selection — commitment is a distinct, deliberate tap, not accidental click-through." "Player must see exactly what is locked in (squad, mission, difficulty) at commit moment."

## B. Validation
- Usability labs (Bromley): "lab-based and remote playtests with intended audience, led personally by experienced researcher." "Test with actual target audience, not convenient proxies."
- Telemetry funnels (GameAnalytics; Meta): "track how players move through flows to find where they stall." "Instrument every hangar step (view → select → recWhy → deploy → back-out) and funnel it."
- A/B testing (GDC Vault 2017; Twitch): "variant-test deploy flow (◆ vs ★ presentation, recWhy wording) with Bayesian analysis on staged rollouts, not gut calls."

## C. Techniques
- Mission briefings (XCOM 2): "skimmable summary layer (type/name/objective/difficulty/reward) with drill-down details on demand." "Headline-first, details on tap."
- Squad previews (Bycer; ITB): "select preset → one pane shows everything." ITB: "spent half of four years on UI so 'you always know exactly what bugs attack next.'" "Moved descriptions into contextual spots."
- Last-minute changes (XCOM 2): "re-equipping and editing squad right up to launch; pre-launch screen editable, not locked rail."
- Confidence builders (Laurie): "clear goals, consistent, visible variation in value." "★ safe default removes fear of picking wrong."

## D. What to avoid
- Briefing skips (calebjross): "unskippable frustrate; freely skippable get skipped by players who then fail." Fix: "skimmable, always skippable, always re-accessible."
- Unclear objectives (Laurie; QATestLab): "provide clear goals." "Players who can't distinguish required from bonus play badly."
- No-takebacks (Old World): "Ctrl-Z undo — 'revolutionary.'" "Punish nothing before commitment." "Locking choice on selection rather than explicit deploy tap punishes exploration."
- Analysis paralysis (Laurie): "optimize decision count/complexity, optimize information amount, ensure variation in value, be consistent, provide clear goals." Risk: "dumping full stats for all three at once instead of headline-first."

## E. Shipped
- XCOM 2: "briefing windows with full field set + mandatory/optional split." "Squad-select iterated from playtesting." "Commitment explicit and separate from selection."
- Into the Breach: "perfect information at squad-selection turns choice into solvable puzzle." "◆ recWhy is same idea in miniature."
- Darkest Dungeon: "prep phase is ritual forcing loadout audit — players own failures because prep was theirs."

## Implemented this round
- **VERIFIED (code read, no changes — frozen):** mission briefings. All 3 missions have briefingKey (data.js:85,101,117). M3 has full AI-generated briefing (ai-dialogue.js:35). Briefing audit fields present (objective, difficulty context, enemy intel).
- **HANGAR-SPEC.md:** verification round 8 (below). Spec only, +0 lines. **4,573 lines** (+0).

## F. Sources
qatestlab · bycer · xcom2 · itb · darkest dungeon · old world
