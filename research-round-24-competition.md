# Competitive Analysis: Tactics on itch.io + Browser — Findings (Round 24)
**Date:** Tue 2026-10-13 ~22:15 EDT · **Source:** live web research 2026-10-13 (itch.io tags, BrowserCraft, TurnBasedLovers, dev comments)
**Project:** Mecha Protocol — what we're up against and what to steal

## A. itch.io tactics landscape
- Tactics tag: 224 results. Top-rated dominated by commercial Steam-adjacent releases (Super Auto Pets 37,659 ratings; Songs of Syx 9,405; Dwarf Fortress 7,911). Free standouts far lower (Wesnoth 1,755; Zero-K 968; Slice & Dice 740). Paid outrates free ~5–40×, but free reaches 4 figures with reach.
- Browser tactics (103 results): Pico-8/jam games and fan projects — small-scope. **No large-scope polished browser tactics game dominates the lane — an opening.**
- **Biggest mecha+tactics breakout on itch: Mobile Suit Baba** (Hempuli, Baba Is You creator) — "strongly inspired by Into the Breach"; 6,238 views / 1,016 downloads; 4.9/5 (168 ratings); 172 comments; $4+ (free at launch). What it did right: ItB formula + famous dev + honest "inspired by" framing + post-launch support (mods, patches).

## B. Browser tactics competitors
- BrowserCraft: 196 tactical browser games (124 playable) — wide but shallow. **Athena Crisis = the study target** (Advance Wars-like, Mar 2024, Nakazawa Tech/Null Games, 80/100, browser-playable): 13 localizations, co-op, keyboard+mouse+touch. Advance Wars by Web (2004) proves a decades-long web tactics audience.
- Real-time/.io dominates browser; **dedicated turn-based grid tactics is comparatively thin**. Touch mostly absent (MSB works; Athena lists it; most assume kb+mouse). **Mobile-first touch UX = open lane.**

## C. Mecha games
- TurnBasedLovers "Best Turn-Based Mech Games 2026" (20 titles). Audience: "mechs and turn-based combat were a particularly good match... armor, heat, positioning, pilots, damaged components, and the consequences of pushing a machine too far."
- itch mecha tag (171): action games, VNs, TTRPG homebrew dominate — **turn-based mecha is a minority**. mechs+turn-based (55): Kriegsfront Tactics Prologue (Toge, free, ~1hr), Lancer Tactics ($20+), GearHead Caramel ($10+), plus tiny browser entries (Xfire, Mech Brawl, ZombieMECHA).
- What the audience responds to: (1) **component damage w/ visible consequences** (Front Mission, BattleTech — our per-limb damage ✅); (2) **the workshop fantasy** (MechLab — our hangar ✅); (3) pilots + stakes; (4) mechs-as-puzzle (ItB/MSB lane). Underserved: browser-native mecha tactics, instant-play Front Mission-like, mobile-friendly mecha tactics, free entry point.

## D. Differentiation gaps [synthesis]
1. **FREE + BROWSER + MECHA + TACTICS is nearly empty** — no direct rival; closest free web entries are tiny.
2. Per-limb damage + hangar building on the web: Front Mission-likes exist (Kriegsfront 938MB download; Lancer Tactics $20+) — **nobody offers the wanzer-workshop loop instantly in a browser tab**.
3. Mobile-first touch + installable PWA: open lane.
4. i18n day one (EN+JA): Athena ships 13; most itch tactics English-only.
5. Short-session roguelite mecha lane has **no free browser representative** — 3 missions + 3 difficulties + hangar builds = replayable loop positioning.

## E. Feature benchmarks (table stakes 2026)
- ✅ HAVE: enemy intent lines, combat forecast (damage preview), undo (1/mission), save/load, move-range preview, 3 difficulty modes, i18n (EN+JA), GameAnalytics telemetry.
- ❌ ADDED THIS ROUND: **animation speed toggle** (⏩ 1x/2.5x — "gameplay feels slow" is the #1 tactics complaint; Kriegsfront players explicitly asked for x2), **grid coordinates** (A1–J8 corner labels), **help glossary** (? button — 6 entries: heat, limbs, cover, intent, forecast, undo; Kriegsfront's #1 complaint cluster was "didn't understand" mechanics).
- 🔜 Nice-to-have: gamepad support. Stretch: mod support.

## F. Content expectations — is 3 missions enough?
- ItB: ~6h main / ~22h average / ~2.5h per 4-island winning run (~8–12 missions). Kriegsfront Prologue: ~1 hour, free = **the accepted itch precedent for free short-form tactics**.
- **Verdict: 3 missions = demo/prologue, not "complete."** FINE if framed honestly (Kriegsfront precedent) — label it a prologue with a public roadmap; make the 3 missions dense + replayable (difficulties + hangar builds + per-limb damage = roguelite lane). **Do NOT market as a complete campaign.** Next content milestone: 6–10 missions (~2–3h), matching one ItB run.

## Applied to Mecha Protocol (implement-immediately, this round)
- ⏩ animation-speed toggle (1x/2.5x; scales all combat timeouts + enemy timer via spd()); A1–J8 grid coordinates; ? help glossary (EN+JA). 1,602 lines, all syntax-clean, i18n keys verified.
- Positioning note added to LAUNCH-PLAYBOOK.md: frame as prologue/demo with roadmap.

## G. Sources
itch.io/games/tag-tactics · itch.io/games/top-rated/tag-tactics · itch.io/games/platform-web/tag-tactics · itch.io/games/tag-mecha · itch.io/games/tag-mechs/tag-turn-based · hempuli.itch.io/mobile-suit-baba · togeproductions.itch.io/kft-prologue · browsercraft.com/genre/tactical · browsercraft.com/game/athena-crisis · turnbasedlovers.com/lists/best-turn-based-mech-games/
