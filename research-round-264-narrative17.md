# Narrative Part 17 (Final Lock) — Findings (Round 264)
**Date:** Wed 2026-10-15 ~01:55 EDT · **Source:** live web research (beaulieu, oconnor, mikkelson, slabinski, my.games, perita)
**Project:** Mecha Protocol — narrative (pre-jam; final lock)

## A. Mechanics
- Voice-bible check (Beaulieu 2020): most bark examples "require specific intentions from the voice actors" — the bible records intended mood/relationship, not just words. Mikkelson (Kenshi): faction-by-faction voice identities so lines stay in voice under jam pressure.
- No-name-tag test (Slabinski): "95% of people won't remember what you wrote" — clarity over cleverness; every character "readable at a glance." Strip the label; if the line could come from anyone, rewrite. Beaulieu's method (shy vs annoyed vs overjoyed greetings) = the how-to.
- Read-aloud pass (standard discipline): "read it aloud after you write it; if it doesn't sound like something an actual human being would say, rewrite it." For 106 lines the pass is fast — catches tongue-twisters, mismatched register, lines that read fine but won't sound right.

## B. Validation
- Fresh-player one-shot (O'Connor): barks are a "stimulus and response" system — the player "speaks" by acting, barks "talk back." Validation needs a player who never heard the lines: 3 fresh players, one session each, no coaching.
- Quote check (Slabinski's 95% rule): ask each player after the session to repeat any line they remember. If nobody quotes the escalation beats, the ladder isn't landing.
- Skip test (MY.GAMES "The Big Skip" 2025): players skip regardless of authorial intent — the game must survive it. Keep it short, highlight the important beat, offer summaries, "don't punish — reward."
- Trigger audit (Beaulieu's canonical warning): Skyrim's "Never should have come here" — the line wasn't bad, the trigger REPETITION was. Audit every trigger's firing conditions + variation pool against actual playthrough telemetry before lock.

## C. Techniques
- Briefing discipline (O'Connor): don't write lines as standalone assets — write from the TRIGGER. Ask what the player would want to know at that moment, answer in voice. Mikkelson's list: overheard conversations, "look to the verbs," life topics, painting personalities, faction conflicts, everyone has an opinion, acknowledge the player, gameplay-aid barks.
- Escalation verification (Slabinski LOST-school + Beaulieu "narrative potential"): evoke rather than explain; manage the gaps. One-way arrogant→rattled→beaten: each rung triggered by observable game state (never reversible); later rungs can't fire before earlier ones.
- Content lock (Beaulieu): voice recordings carry intentions — late rewrites invalidate performance. After lock: deletions and timing fixes only, never new lines. Perita's jam postmortem: "Be prepared, and work more efficiently on the correct thing to build" — pre-built frameworks, nothing new after lock.

## D. What to avoid
- Post-voice-pass rewrites: silently break intention-to-line fit. Fix it or lock it; don't half-edit.
- Lore dumps (Slabinski "treachery of forced lore"): "lore is the garnish, not the meal." Spread lore inside situational barks, never lectures.
- Untested trigger frequencies: any trigger without a measured per-session firing rate is untested.
- New lines after lock: skips voice-bible + read-aloud + trigger audit — by definition unverified.

## E. Shipped
- Inscryption (Mullins): LD43 "sacrifices must be made" → free itch.io → 1M+ copies, IGF Narrative + GDC GOTY. One core device (the dealer who escalates) fused with the mechanic; escalating acts recontextualize everything.
- One Night Stand (Blundell): jam game → commercial release. One situation, dialogue "to tell a story rather than as a gameplay mechanic" — one emotional register fully committed > breadth.
- Sort the Court! (Borland): 3 days, LD34 → Steam. Every line = story beat AND mechanical decision; the escalation ladder IS the game loop — the exact VEX model.

## Implemented this round
- **TRIGGER AUDIT TOOL (js/barks.js):** the research's core demand — "any trigger without a measured per-session firing rate is untested." Telemetry goes to an external service (not locally queryable), so added a local per-session tally: `_fireCounts[trigger]++` on every fire, reset per session, plus `Barks.audit()` — call in console after a playthrough, returns triggers sorted by fire count (`hit: 12\nlimblost: 2\nvexenter: 1`). The Skyrim check, now runnable.
- Verified functionally (sorted output, clean reset). All `node --check` clean. +6 → **4,442 lines**.
- NARRATIVE-SPEC.md: final lock (below).

## F. Sources
beaulieu · oconnor · mikkelson · slabinski · my.games · perita · inscryption
