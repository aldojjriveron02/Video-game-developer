# Blender Toon-Pipeline Tutorial Path — Findings (Round 11)
**Date:** Tue 2026-10-13 ~20:36 EDT · **Source:** live web research 2026-10-13 (all sources opened/verified)
**Project:** Mecha Strategy Game · Dev has never done the 3D→2D pipeline · $0

## A. Tutorial path (in learning order)
**a) Blender basics:** 1. Blender Guru "Beginner Blender Tutorial" full course (2024, ~5h, Blender 4.0 — the classic donut series, step one before anything else). 2. Official Blender Manual → Getting Started (docs.blender.org) — hotkey/interface reference.
**b) Hard-surface mech modeling:** 1. Grant Abbitt (youtube.com/@grabbitt) — beginner-friendly hard-surface series. 2. CG Boost "Hard-Surface Modeling in Blender for Beginners" — boolean/box workflow. 3. CBaileyFilm "Make An Armoured Core 6 Mech In Blender" (Aug 2023) — actual mech, closest subject matter (watch for process, not detail level). 4. Ryuu "Hard Surface TUTORIAL in BLENDER."
**c) Rigging:** 1. Noggi "The Character Rigging Tutorial I Wish I Had As A Beginner" (~55 min) — bones, parenting, weight painting, IK. 2. Node Spaghetti "Blender — Rig a MECH with Nodes! Part 1" (Feb 2025, ~42 min) — mech-specific, multi-part. 3. Felipe Greboge "Rigging and Animating Mechs in Blender 3D (With Exporting...)" (Mar 2025, ~29 min) — rigging + exporting bridge. 4. **Rigify** (built-in, free): humanoid meta-rig → fit bones → Generate. Not mech-perfect but skips manual rigging.
**d) Toon/cel shading:** 1. Dillon Goo tutorials (youtube.com/@dillongoo) — most-cited anime-shading educator. 2. Ryan King Art "How to Create ANIME SHADERS in Blender" (2024, ~24 min). 3. W3 Productions "How To Make Anime In Blender — Goo Engine" (Apr 2024, ~30 min).
**e) Sprite sheets:** 1. CoderNunk "How to Make a Sprite Sheet from a 3D Animation in Blender" (~63.5K views) — end-to-end render→sheet→game. 2. Sprite Sheet Generator add-on docs (workflow checklist). 3. Thomas Vasseur "Art Design Deep Dive: Using a 3D pipeline for 2D animation in Dead Cells" (gamedeveloper.com, Jan 2018) — the canonical reference.

## B. Mech modeling reality
- No published per-mech hour quotes found [unverified — don't cite any].
- Community estimates (r/blender): ~20–50h practice for basics + first simple model; 100h+ toward realistic quality. First boxy mech = several evenings; the second goes much faster.
- **Minimum viable mech for sprites** [synthesis]: chunky readable silhouette (Dead Cells renders ~50px tall — silhouette + color blocks > detail); ~15–30 parts; separate floating armor panels (panel lines read as detail); one emissive visor/eye; flat color zones per part for clean cel bands. **Fine greebles vanish at 64–128px and waste modeling time.**

## C. Rigging shortcuts
- **Rigify (free, ships with Blender):** fastest path — meta-rig → fit → Generate. IK legs/arms + FK/IK switching out of the box. Enable: Edit → Preferences → Add-ons.
- Node Spaghetti's Geometry-Nodes mech rig (2025) — evaluate once basics solid.
- BlendSwap free mech rig templates circulate [unverified — check before rigging].
- Auto-Rig Pro = paid, out of scope ($0). Note as future upgrade only.
- **Fastest path** [synthesis]: simple ball/cylinder pivots; rigid-plate parenting over weight painting; one IK chain per leg/arm; skip piston simulation on mech #1.

## D. Sprite sheet workflow (verified across docs + tutorials + Dead Cells article)
1. Camera: orthographic, framed at mech center height. 2. Film → Transparent ON; PNG RGBA. 3. Single front key light (consistent shading across angles). 4. Render at FINAL sprite resolution (Dead Cells: tiny scale, no AA — crisp edges). 5. Sequential frame ranges per action (idle/walk/attack); simple action names. 6. Assembly: **Sprite Sheet Generator add-on (mabaci)** — free, GPL-3.0, Blender 3.6+–5.1; **rotates the armature (not the camera)** so lighting stays consistent; auto-detects actions; dynamic per-animation sizing; frame interpolation (20-frame run → 10); exports PNG + JSON (rows/frames/dimensions); tips: ortho camera, 10% padding, test small frame counts first. Alternatives: Auto Sprite (Imster, Gumroad free); Spritesheet Renderer (chrishayesmu, GitHub, needs ImageMagick). 7. Packing (free): I Love Sprites (browser), Free Sprite Sheet Packer (CodeAndWeb), Free Texture Packer (GitHub OSS). 8. **Into HTML5** [synthesis]: one PNG + one JSON atlas → canvas drawImage with source rects; keep sheets ≤2048×2048; 64–128px frames for tactics units.

## E. Toon shader recipes + free .blend files
- **Core recipe:** material color → Shader to RGB → ColorRamp (hard stepped stops) → Diffuse/Principled. **Inverted-hull outlines:** Solidify modifier (outward offset, flipped normals) + dark material on shell — **must apply to ALL objects or gaps appear.** Banded lighting rigs; separate light rig for art-directable shadows. Emissive visor: plain Emission shader.
- **Free downloads (free tier confirmed):** 1. GM Toon Shader v2 (Gumroad) — free, royalty-free commercial use, complete solution. 2. EritoKaio Toon Shader V4.1 (Gumroad) — free + tutorial project files. 3. Simple Toon & Textured Gradient Shaders — Kevin Ramam (Gumroad, free). 4. NPR Shader (BlendSwap). 5. **Goo Engine** (dillongoostudios.com, GitHub) — free custom Blender build for anime. Caveat: fork pinned to older Blender — fine for study, keep production in stock Blender.

## F. Beginner traps
- Outline z-fighting/flicker on thin/coplanar geometry; outlines bloating/vanishing at small sprite sizes; gaps where material missed an object → apply everywhere, check at final resolution.
- Flipped/inconsistent normals → shading holes, broken outlines. Recalculate before render.
- **Rotating the camera instead of the model** → shading changes per angle. Rotate the armature (why the add-on does it that way).
- Cut-off frames (jumps exceed bounds) → padding + per-animation dynamic sizing.
- AA blur at small sizes → render tiny, no AA (Dead Cells method).
- Animation popping/feet sliding → animate pose-to-pose like 2D, not smooth interpolation.
- **Over-detailing** → block silhouette first; detail only what survives the render.

## G. Time budget
- Data: ~20–50h for basics + first model; 100h+ toward realistic (r/blender). Guru course ~5h video; mech/rig/shader tutorials ~6–8h video (each needs multiples in practice).
- [synthesis] **"Never opened Blender → first animated sprite sheet in-game": ~120–200 focused hours (~2–3 months of steady evenings).** Sketch: basics 30h; first mech (boxy) 40h; rigging + walk/idle/attack 30h; shader 10h; sprite pipeline 15h; iteration/traps 25h+. **Modeling + rigging dominate; the render→sheet→game pipeline is the fastest part to learn.**

## H. Sources
youtube.com/@blenderguru · docs.blender.org · youtube.com/@grabbitt · CG Boost (YouTube) · CBaileyFilm (YouTube, Aug 2023) · Ryuu (YouTube) · Noggi (YouTube) · Node Spaghetti (YouTube, Feb 2025) · Felipe Greboge (YouTube, Mar 2025) · youtube.com/@dillongoo · Ryan King Art (YouTube, 2024) · W3 Productions (YouTube, Apr 2024) · CoderNunk (YouTube) · gamedeveloper.com (Vasseur, Jan 2018) · extensions.blender.org/add-ons/sprite-sheet-generator/ · ilovesprites.com · blendswap.com · dillongoostudios.com/gooengine · reddit.com/r/blender/
