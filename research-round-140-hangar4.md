# Hangar Part 4 (Build & Validation) — Findings (Round 140)
**Date:** Thu 2026-10-15 ~08:10 EDT · **Source:** live web research (wikipedia, measuringu, uxmatters, teemo.dev, a327ex, tutsplus, gamedeveloper, reddit, steam, ign, paradox forums, frontmission wiki, gamefaqs, megavisions, jamesfel.github, thestrategyinformer, linkedin, truetips, namu.wiki)
**Project:** Mecha Protocol — hangar (Phase 3 week-1, pillar 2)

## A. Build
- MW5 (size-restricted hardpoints; valid-only by construction).
- AC6 (two-axis pass/fail; threshold warnings).
- Front Mission (weight vs engine output). MWO (one-click valid defaults).
- Orblike (valid/invalid drag states).

## B. Validation
- RITE (fix after 1; solo-dev ideal). Paper-doll recognition (Morrowind good; Orblike pivot).
- Build diversity (teemo: funnel; A/B; clamping; opt-in hard; tripwires 45%/8%).

## C. Modularity
- AC6 (live 3D; weapon-first/frame-first; Test Mech). MW5 Clans OmniPods.
- Front Mission (4-part; arm accuracy). Phantom Brigade (small team).

## D. What to avoid
- Stat bloat (hierarchical). Hidden interdependence (delta at change).
- Analysis paralysis (valid-only + defaults + guided paths).

## E. Shipped
- AC6. Front Mission. MW5. BATTLETECH. Phantom Brigade. Orblike.

## Implemented this round (code)
- **js/hangar.js:** heat budget meter (AC6 two-axis; red at threshold).
- **js/i18n.js:** EN + JA labels.
- **HANGAR-SPEC.md:** production hangar spec appended.
- 3,552 lines (+12).

## F. Sources
wikipedia · measuringu · uxmatters · teemo.dev · a327ex · tutsplus · gamedeveloper · reddit · steam · ign · paradox · frontmission · gamefaqs · megavisions · jamesfel · strategyinformer · linkedin · truetips · namu
