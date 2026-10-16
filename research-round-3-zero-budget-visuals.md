# Visual Production Pipeline at $0 — Findings (Round 3)
**Date:** Tue 2026-10-13 ~19:43 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Strategy Game · **Constraint:** $0 — no commissions, no paid packs, no paid software
**Reference:** anime mecha (white/navy armor, glowing visor) in neon hangar with labeled weapon systems

## A. Free art tool workflows
**Blender** (blender.org, free/open-source) — the core. Proven solo-dev workflow = the **Dead Cells pipeline**: model each mech ONCE in 3D, rig and animate it, then RENDER animation frames to 2D sprite sheets from any camera angle. Motion Twin documented it ("Art Design Deep Dive: Using a 3D pipeline for 2D animation," gamedeveloper.com). Animate once, render infinitely — every unit, angle, and frame is generated, not hand-drawn. For anime (not pixel) look: render with toon shaders instead of downscaling.
**Krita** (krita.org, free) — 2D touch-up: sprite cleanup, panel-line detailing, backgrounds, UI art, hangar screens. **GIMP** — alternative 2D editor. **DragonBones** (free) — 2D skeletal animation for hand-drawn cut-ins. (Aseprite's binary is paid; source-compilable free; LibreSprite is a free fork — Krita is the cleaner $0 pick.)

## B. Anime / toon-shading techniques (all Blender, $0)
From "How to Get an Anime / Toon Look in Blender" (strayspark.studio, 2026) + Blender Stack Exchange:
1. View Transform → **Standard** (NOT AgX) — step zero; AgX desaturates anime colors.
2. Cel bands: Shader-to-RGB → Color Ramp (Constant interpolation) → hard 2–3 tone shadows (Eevee).
3. Outlines via **inverted hull**: duplicate mesh, Solidify modifier with flipped normals, flat black material + backface culling — clean uniform outlines, cheap. Alt: Freestyle line renderer (stylized strokes; unverified which reads better for mecha).
4. Lighting: ONE strong key light (Sun lamp) for a clean terminator line — multi-light muddies cel shading.
5. Shadow color: shift hue +0.05–0.12 (toward blue/purple) — anime shadows are colored, not gray.
6. Glowing visor/eyes: simple emissive material — zero lighting cost, instant "anime mecha" read.

## C. Free asset sources + exact licenses
- **Quaternius Animated Mech Pack** (quaternius.com/packs/animatedmech.html) — **CC0 public domain, VERIFIED on page.** 4 animated mechs (march/walk/idle), FBX/OBJ/Blend/glTF. Commercial use, modify, no attribution. Caveat: stylized low-poly, not anime-detailed — best as BASE MESHES to re-shade with toon materials.
- **Kenney.nl** — all assets CC0 (Robot Pack, 50 robot parts). License page 404'd during research but CC0 status widely documented; verify before shipping.
- **Poly Pizza** (poly.pizza) — MIXED licenses; filter CC0-only (paid models $29–149 observed). ⚠️ IP WARNING: a free "MS Gundam RX-78-2" model appears — Gundam is Bandai IP; a free file grants no commercial rights to the trademark.
- **OpenGameArt.org** — per-asset licenses. "Free to download" ≠ "free for commercial use": CC-BY needs credit, CC-BY-SA needs credit + share-alike on derivatives, GPL art can taint a commercial binary. Read every license tab.
- **LPC bases** (opengameart.org) — CC-BY-SA 3.0 / GPL 3.0: commercial OK with attribution + share-alike. Best $0 base for paper-doll layering.

## D. Procedural / code-driven mech art
**Paper-doll layering** (the standard term): body parts as separate stacked sprites — exactly matches our body/arms/legs model. Multiplicative variety: 8 torsos × 8 arms × 8 legs = **512 visual variants from 24 drawings**. Systems: Paper Doll System for Unity (willyxz.itch.io), RapidLPC (etamity.itch.io, GitHub etamity/rapidlpc — live part-swap preview), Intersect Paperdoll Maker (free). Reference: Stardew Valley layers skin/hair/outfit/equipment as separate sprites.
**Palette swapping:** paint grayscale/mask channels, recolor at runtime (canvas tinting, SVG recolor via CSS variables, shader hue-shift). Faction colors + rarity tiers with zero new art.
Proven by: Dead Cells (3D→2D, one rig = infinite frames), Stardew Valley (layered equipment).
SVG/CSS mechs: unverified as a dedicated pipeline, but paper-doll math is format-agnid — SVG parts allow infinite-resolution hangar zoom. Experiment, not proven path.

## E. Hangar UI design lessons
**Armored Core VI's garage is the gold standard** (FromSoftware; devs told Destructoid assembly/customization "is at the core"). r/armoredcore: garage got streamlined across games — less dead-end menu time, faster part comparison. What works (from Game UI Database's AC6 set + fan tools ac-garage/ac6-advanced-garage):
- Rotating 3D mech preview under dramatic hangar lighting — the mech IS the UI centerpiece
- Real-time stat readouts updating as parts change
- **Schematic/blueprint framing: part callouts with leader lines — exactly like our reference image's weapon labels.** Technical-drawing aesthetic = engineering, not shopping.
- Category tabs matching the part model, side-by-side comparison with +/- stat deltas
- Dark industrial backdrop + rim lighting + orange/cyan accents; saveable preset loadouts
[Synthesis] The hangar is ~80% UI/layout work — CODE, not art. One gradient + grid floor + spotlight cone carries it. Good layout beats more art.

## F. $0 visual scope reality
- Timelines (strayspark 2026): small polished 2D = 6–18 months solo part-time; mid-scope 3D = 2–4+ years solo full-time. "One person = one bottleneck."
- The **3D→2D render pipeline is the scope cheat code**: heavy upfront (learn modeling/rigging once), near-zero marginal cost per unit/animation. Hand-drawn frames = linear cost forever.
- Where solo devs waste art effort: hand-animating every unit instead of rigging once; unique textures per unit instead of shared materials + palette swaps; chasing PBR realism instead of stylized toon (cheaper AND reads anime); art for cut systems; detail invisible at gameplay zoom.
- **Minimum art that reads "anime mecha":** (1) strong readable silhouette, (2) dark outlines (inverted hull), (3) 2–3 tone cel shading, (4) ONE accent color + glowing visor (emissive), (5) panel lines. **Visor glow + outlines carry ~70% of the anime read** — everything else is garnish.
- **Recommended $0 stack:** Blender (model+rig+animate+toon-render to sprites) + Krita (touch-up/UI) + paper-doll part layering + palette swaps + Quaternius CC0 mechs as starter base meshes. **Total: $0.**

## G. Sources
strayspark.studio/blog/how-to-get-anime-toon-look-blender · gamedeveloper.com (Motion Twin Dead Cells pipeline) · quaternius.com/packs/animatedmech.html (CC0 verified) · poly.pizza · kenney.nl · opengameart.org · willyxz.itch.io/paper-doll-for-farmer-base · etamity.itch.io/rapidlpc · github.com/etamity/rapidlpc · gameuidatabase.com · destructoid.com (AC6 interview 2023) · blender.stackexchange.com · blender.org · krita.org · gimp.org
