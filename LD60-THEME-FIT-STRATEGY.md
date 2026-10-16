# Ludum Dare 60 — Theme-Fit Strategy
**Game:** Mecha Protocol (3,615 lines, vanilla JS) · **Prepared:** Oct 14, 2026
**Principle:** the theme is a SKIN, not a redesign. 72h is for adaptation, not invention.

## Theme-swappable (can change in 72h)
- **Narrative skin:** faction names, VEX identity/call sign, mission briefings, pilot barks, mission titles. All text lives in i18n.js — a theme reskin is a text pass.
- **Visual skin:** canvas color palette, mech silhouettes, background art. Palette swap = CSS + canvas constants.
- **Audio mood:** music selection (Pixabay tracks), bark tone. Mood follows theme.
- **Mission framing:** the 3-mission structure stays; the *fiction* of each mission (what you're fighting for) changes.
- **Title & jam page:** game title, description, screenshots.

## Frozen (do NOT touch during jam)
- **Core loop:** grid tactics, turn structure, action economy. Proven; don't redesign under time pressure.
- **Per-limb damage:** the game's identity. Theme-independent.
- **Heat system:** chevrons, 70% alarm, heat-as-bet. Mechanical, not thematic.
- **Intent telegraphs:** threat magnitude, persistent display. Readability pillar.
- **Hangar build system:** valid-only filter, heat budget, recipes. Modular mechs pillar.
- **Difficulty/assist systems:** failure ratchet, miss pity, 4 assists, 0.5s delay. Accessibility is non-negotiable.
- **3-mission structure:** M1 teach → M2 escalate → M3 duel. The arc survives any theme.

## The 72h theme-fit process (Fri 6PM)
1. **Hour 0–1:** Read theme. Brainstorm 3 skin directions. Pick ONE. (Aldo's call if he's around; otherwise El Loko decides — the jam doesn't wait.)
2. **Hour 1–2:** Map the pick onto the swappable list. Write the concrete change list (which text files, which palette constants, which briefings).
3. **Freeze.** Everything not on the change list is out of scope.

## Theme archetypes (pre-planned responses)
- **Conflict/war theme** (e.g., "Sacrifice," "Enemies"): minimal reskin — the game already IS this. Lean into VEX duel.
- **Abstract theme** (e.g., "Signal," "Cycles"): reframe mechanics as metaphor (heat = signal overload, limbs = channels). Briefings do the heavy lifting.
- **Wholesome theme** (e.g., "Growth," "Repair"): reframe combat as sparring/training/testing. VEX becomes a rival, not an enemy. Barks rewritten warm.
- **Horror/dark theme:** palette to cold/dark, barks to grim, VEX to menace. Easiest visual skin.

## What wins jam votes
- **Theme (graded):** the skin must make the theme OBVIOUS in the first 60 seconds. Briefing M1 + title screen carry this.
- **Fun (graded):** the core loop is already fun — don't break it chasing theme.
- **Innovation (graded):** per-limb tactics + heat-as-bet is the differentiator. Keep it front and center.
