# Hangar Part 14 (Hangar/Loadout UX) — Findings (Round 234)
**Date:** Wed 2026-10-14 ~22:52 EDT · **Source:** live web research (nngroup, hodent, krug, armored core, battletech, xcom, destiny)
**Project:** Mecha Protocol — hangar (Phase 1, pre-jam freeze)

## A. Mechanics
- Loadout-screen canon (5 things): THE THING (paper-doll, biggest); WHAT CHANGED (deltas); IS IT LEGAL (constraint meters); WHAT IT MEANS (role label, not just numbers); THE EXIT (always-visible Deploy). Missing any one = fail.
- Presets vs full customization: progressive disclosure (NNGroup) — presets first, full customization one tap behind. Into the Breach = purest proof (fixed 3-mech squads, seconds to pick). Maps 1:1 to Brawler/Skirmisher/Bulwark. Hodent: early decisions must be low-friction or players bounce.
- Paper-doll: hover = preview, click = commit (two-stage). Armored Core VI garage = reference (turntable, visible mounts, stat bars move simultaneously). The redraw IS the feedback channel.
- Stat comparison: Diablo III deltas — green/red + arrows, never color alone (colorblind safety). AC VI same with stat bars. Rule: never a raw number without its delta; never a delta without gameplay meaning ("shots-to-kill 3→2" beats "DPS 142→168").
- Under-30s: sane default pre-selected ("Recommended"); Deploy visible without scrolling + Enter = deploy; never trap (XCOM 2: veterans click through, tinkerers linger). Krug trunk test.

## B. Validation
- 5-user gate (NNGroup): ~85% of problems with 5 users. Catches: dead ends, jargon, hidden Deploy, dead presets, constraint violations, unnoticed redraws. Five cold players, one task, timed.
- Dead-end detection: any screen with no forward action; log stalls >5s. Every screen ≥1 visible forward action; disabled options explain why + fix; back path always exists.
- Kleenex test (Krug tradition): cold player, zero help, hangar→mission in <30s, timed, binary pass/fail.
- Telemetry: time-on-hangar distribution; funnel (entry → preset → deploy); feature neglect (~0% equip = cut); preset pick distribution (unpicked preset = design failure); invalid-loadout rate (should be zero if UI enforces).

## C. Techniques
- Progressive disclosure: jam slice = disclosed layer; Phase 2 = advanced layer. Design the seam now.
- Constraint-based building: BattleTech 3-constraint model (tonnage + hardpoints + heat); AC VI weight/EN meters. NNGroup error prevention: illegal = unselectable with reason shown, never error dialog.
- "Recommended" button: LoL in-shop panel = canonical; jam version = pre-selected preset + one-line reason.
- Named/shareable loadouts: Destiny 2 (10 named slots, hot-swap, DIM share URLs); DRG Season 4 named per-class. Brawler/Skirmisher/Bulwark name well already — Phase 2: player-named slots + shareable codes.
- Visual hierarchy: fantasy biggest (paper-doll), choice second (cards), exit highest contrast (Deploy). Spreadsheet bigger than mech = wrong.
- Hangar fantasy: persistent named mech, wear/trim, idle animation, theatrical presentation. Reward space, not spreadsheet.

## D. What to avoid
- Analysis paralysis (cure: recommended default + presets-first).
- Stats without meaning (pair with deltas + plain-language consequences).
- Empty hangar (every choice changes paper-doll/stats/battlefield — or label/cut it).
- Hidden Deploy (single most common hangar failure).
- Jargon without explanation (first-encounter tooltips).
- Invalid loadouts (disable with fix stated; post-hoc dialogs = failure mode).

## E. Shipped
- Armored Core VI (FromSoft 2023): live 3D paper-doll turntable, color-coded deltas, constraint meters — the reference implementation.
- BattleTech (HBS 2018): tonnage + hardpoints + heat — three legible constraints, one-screen grasp.
- XCOM 2 (Firaxis 2016): per-soldier cards, sane defaults, big Begin Mission — the under-30s model.
- Destiny 2 (Bungie 2023): 10 named slots, hot-swap, DIM URLs — Phase 2 target.
- Into the Breach: fixed squads, pick in seconds — closest analog to jam slice.

## Implemented this round
- **Preset stat deltas (Diablo III pattern):** every preset card shows HP/Move deltas vs currently equipped squad (▲▼ + green/red, colorblind-safe) + weapon-signature change ("Arms → blade"). Paired with existing plain-language descs (Round 165). Verified: brawler→"Arms → blade", skirmisher→"HP ▼46 · Move ▲4 · Arms → rifle", bulwark→"" (correct).
- **Enter = deploy (XCOM pattern):** keyboard path to the exit; listener bound on render, unbound on close (no leaks).
- +49 → **4,402 lines** (+49). All node --check clean.

## F. Sources
nngroup · hodent · krug · armored core · battletech · xcom · destiny · diablo · lol · drg
