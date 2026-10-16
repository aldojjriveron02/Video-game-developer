# Narrative & Worldbuilding at $0 — Findings (Round 10)
**Date:** Tue 2026-10-13 ~20:31 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Strategy Game · No writers for hire, no VO, no cutscenes · Text-only techniques

## A. Cheap storytelling forms
- **Mission briefing/debriefing = the #1 cheapest form.** Wargame standard pattern: header facts (map/date/weather/forces) + Situation (bigger picture) + Concept of Operation (orders) + Intelligence + designer Meta Notes. The briefing is where context/options/deadline live, in pure text. (Homefront Wargame Center, 2010)
- **Visual-novel dialogue (static portraits + text)** = industry-standard $0 cutscene replacement. Into the Breach player consensus: even minimal flavor works — "just a little flavor to dress up a strategy game," like chess; simply NAMING pieces adds attachment almost free. (r/IntoTheBreach, Dec 2021)
- **Procedural modular events:** Battle Brothers ships narrative via hundreds of short random camp events with choices/consequences — emergent text-only storytelling. Maps to us: hangar events, inter-mission incidents, pilot dilemmas — short, reusable, no branching campaign needed. (Steam dev blog — found via search, not opened [unverified])
- **Quarantine lore** (Jeff Vogel, Spiderweb): lore in one skippable lump (Skyrim books / WoW quest text model); mission-critical orders kept short.
- **Environmental storytelling** [synthesis]: the hangar UI itself tells story — loadout names, kill tallies, damage decals, memorial wall. Zero dialogue required. **Our reference image's labeled weapon systems are already this technique.**

## B. Pilot characters on a budget
- **Barks** (Natalie, narrative designer): cheapest characterization. Vary by what the character is DOING (verbs); give opinions on work/family/aspirations; quirks and speech habits; MOST IMPORTANT — barks REACT to the player (notice kills, reinforce success, comment on losses). "The more the dialogue relates to the player's actions... the more interested players are."
- **Archetypes over arcs** [synthesis]: 3-trait archetype per pilot ("cocky rookie," "weary veteran," "true believer"), 10–20 bark lines each. ItB's formulaic one-dimensional barks were tolerated as flavor but criticized — **a small bank of varied specific lines beats a large bank of generic ones.**
- **Paired barks** [synthesis]: pilot A scores kill → pilot B (deployed, relationship flag: friend/rival/mentor) fires one-line reaction. Lookup table keyed on (event, relationship, archetype) — apparent conversation, no dialogue trees.
- **Memorialization:** XCOM's memorial wall proves a name on a list creates grief. $0 version: persistent "Fallen Pilots" roster (name, mech, missions survived, cause of death) + one bark acknowledging the dead ("That's for Vance!"). The list IS the memorial; players supply the emotion.
- **Names = attachment:** ItB "chess pieces with names" + XCOM soldier-naming both confirm naming alone drives care. Let players name/rename pilots.

## C. The nemesis as story engine
- **XCOM 2: War of the Chosen — the gold standard** (PC Gamer, Sep 2017): (1) Give the villain a VOICE through cheap text — the Chosen are "chatty sallys — yammering on during missions, and even spilling over into the menus." Taunt lines triggered by game events. Text-only; huge effect. (2) **Attack what the player already loves** — the Chosen kidnap veteran soldiers. The nemesis parasitizes existing attachment; design its actions against the ROSTER, not the plot. (3) Feel like "someone else playing against you" — strategic-layer agenda (sabotage, counters), generating story beats between missions free. (4) **Let it lose sometimes** — retreats when beaten, returns later; defined strengths/weaknesses; loot on final kill. Players "actually looked forward to the encounters."
- **Shadow of Mordor procedural memory:** enemies remember encounters, bear scars/hatreds, climb hierarchy — story writes itself from gameplay history.
- **MVP for a solo dev** [synthesis]: one named ace with (1) persistent kill/death ledger vs the player, (2) taunt lines keyed to that ledger ("Third time, pilot. I'm counting."), (3) escalation (new ability each rematch), (4) loot reward on final kill.

## D. Minimum viable worldbuilding
- **Load-bearing elements** [synthesis]: (1) WHO fights whom — 2–4 factions, mutually exclusive goals; (2) WHY — one resource/ideological conflict making every mission legible; (3) WHAT'S AT STAKE — a strategic-layer clock (territory, war progress) so missions move a war, not a plot. BattleTech works on Successor Houses + forever war; Front Mission on legible geopolitics. Everything else is garnish.
- **Sensory Bible over lore volume** (Johnn Four, Feb 2026): per faction/location write what it looks/feels/sounds/smells like, its vibe/themes, daily dangers, and what it is NOT (anti-canon). Players experience setting through texture, not timelines.
- **One-line "Razor"** (e.g., "Rome 3rd Century meets Mad Max") to accept/reject setting additions — stops infinite worldbuilding.
- [synthesis] **Our entire setting bible: 3 factions × ~200-word sensory bible + one conflict sentence each + the war clock.** Briefings deliver the rest incrementally.

## E. Mission briefing craft
- **HFC structure** = context/options/deadline skeleton: header facts → Situation (context) → Concept of Operation (options — what the player may do) → Intelligence → Meta Notes. Plus explicit deadline/stakes line (turn limit, war-clock cost, civilian lives).
- **Fiction craft** (Alec Worley): never pure info-dump — reveal character through the briefing (officer's personality, friction with command); exposition via conflict and competing agendas; the scene should CHANGE understanding, not list facts.
- **3-paragraph formula** [synthesis]: ¶1 CONTEXT — one vivid sensory situation line + why this mission matters to the war; ¶2 OPTIONS — the plan, the player's real tactical choices, intel with a GAP ("we don't know what's in the hangar"); ¶3 DEADLINE — explicit stakes and time pressure. **Intel gaps are a feature** — the briefing becomes a promise the mission fulfills.

## F. Dialogue volume reality
- **Jeff Vogel numbers** (closest thing to a solo-dev text studio): novel ≈ 100k words; his wordiest Avernum 3 ≈ 200k ("by current standards, very terse"); Witcher 3 ≈ 450k; Divinity: Original Sin ≈ 350k; Tyranny ≈ 600k; Torment: Tides of Numenera ≈ 1.2M ("WHAT ARE YOU DOING!?!?!?"). Rule: 100k could've been 50k; 500k could've been 150k.
- **Where solo devs overwrite:** "It's really easy to make words. Really, really, really easy... The secret of great writing is not adding words. It's cutting them... writing something good and short is way more work than writing something dull and long." Keep lore separate from mission-critical text. "Your writing should be the REWARD" — good enough that reaching it is the goal.
- **Budget for us** [synthesis]: tactics needs NO RPG word counts. **~15,000–30,000 words total:** 20–30 missions × ~150-word briefings (~5k) + ~100 barks × ~12 words (~1.5k) + nemesis taunt bank ~60 lines (~1k) + ~12 pilot bios (~2k) + hangar events (~5k) + codex (~5k). **Vogel test every line: would the player read this INSTEAD of skipping to the action?**

## G. Free writing tools for plain HTML5
- **ink + inkjs — VERIFIED for plain HTML5, recommended pick.** ink: inkle's open-source (MIT) narrative scripting, markup-first; free Inky editor writes/tests/exports JSON. inkjs (y-lohse): complete JS port, zero dependencies, single `<script>` tag, serverless boilerplate. Active (658 stars, Sep 2026 commits).
- **Twine:** free/OSS, outputs HTML natively — great for prototyping and codex entries; passage/variable model gets messy at game scale, engine integration painful. Drafts only.
- **Yarn Spinner:** OSS and beginner-friendly, but integrations are Unity/Godot/Unreal — wrong fit for custom HTML5. (Jan 2026 web update [unverified] — don't plan around it.)
- **Workflow** [synthesis]: write barks/briefings/events in ink (Inky) → export JSON → inkjs in-game. Memorial roster + codex as plain JSON tables. Total: $0.

## H. Sources
pcgamer.com (XCOM 2 Chosen, Sep 2017) · gamedeveloper.com (Vogel, May 2017) · natthink.medium.com (barks, May 2020) · wargamecenter.wordpress.com (briefings, 2010) · reddit.com/r/IntoTheBreach/comments/ricy3r/ · roleplayingtips.com (sensory bible, Feb 2026) · alecworley.substack.com (briefing scenes [exact URL unverified]) · inklestudios.com/ink/ · github.com/y-lohse/inkjs · narrativeflow.dev (Twine/Yarn/ink comparison, Nov 2025) · yarnspinner.dev · store.steampowered.com (BB procedural storytelling [unverified, not opened])
