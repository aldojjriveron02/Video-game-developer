# Game Feel / Juice at $0 — Findings (Round 14)
**Date:** Tue 2026-10-13 ~21:06 EDT · **Source:** live web research 2026-10-13
**Project:** Mecha Protocol prototype — from functional to juicy, canvas-budget-safe

## A. The juice canon for turn-based
- Canon: "Juice it or lose it" (Jonasson & Purho, GDC 2012) — juice = the feedback layer making simple actions satisfying; "The Art of Screenshake" (Nijman, Vlambeer, 2013) — scale shake/feedback to the violence; GMTK "Secrets of Game Feel and Juice" (primer); Swink's "Game Feel" (book).
- Turn-based weight shift [synthesis]: no continuous action → juice concentrates on (a) discrete impact punctuation (hit-stop on hits/crits/kills), (b) camera motion (punch-in, shake scaled to damage), (c) UI tactility (every click gets sound + visual), (d) sound coherence (every event, precisely timed).
- IEEE study (Lin et al., 2022, arXiv:2208.06155): **hit stop, sound coherence, and camera control** are the three strongest drivers of impact feel — neglecting any one can ruin it.
- r/gamedesign consensus (2023): basic actions engaging-but-restrained; crits/kills/rewards "pop" (hit-stop + flash VFX); never underestimate crunchy SFX.

## B. Hit feel
- **Hit-stop = single highest-leverage technique** — freeze the update loop 80–150ms at contact (longer on crits/kills); nearly free in turn-based.
- **Sound on the contact frame:** whoosh (anticipation) → thump (contact) → debris tail; sound must match visual weight (deep thump = heavy melee, crack = limb break).
- XCOM's action cam: zooms to the shooter on crucial moments — **toggleable**, because unskippable camera moves slow the game.
- Fire Emblem's crit ritual: zoom + flash + sting + full-screen cut-in — **reserve the biggest spectacle for the rarest events.** Normal hit = snap; crit/limb-break = ceremony.
- Damage-number choreography: pop with overshoot easing, stagger multi-hits, linger/grow on kills; **color-code by limb state** so numbers teach the per-limb system.
- Knockback: a few pixels of victim displacement + brief squash sells force cheaper than any particle. (ItB elevates push to a core mechanic — displacement as information.)
- **Limb-destruction drama** [synthesis]: freeze → flash → debris burst from the limb's position → brief slow-mo → low boom. Key trick: **a beat of silence/stillness before the explosion** reads as "devastating" at zero asset cost.

## C. Turn transitions
- **Phase banners** (Fire Emblem's "PLAYER PHASE / ENEMY PHASE" wipe + sting): tweened banner + sound, essentially free in canvas, unambiguous state change + ceremony. (Advance Wars: CO cut-ins on powers.)
- Camera: pan/zoom toward the newly active side; focus on the acting unit during attacks — motion tells the player where to look.
- **Activation pop:** scale-pop + expanding ring on the focused unit; grey out acted units — states readable at a glance.
- **Idle aliveness = cheapest big win:** sine-wave bob per unit, drifting particles, blinking lights. "A little juice spread across a wide array of things matters more than one cool attack animation" — environment aliveness outranks one elaborate attack anim.
- Audio stingers: distinct phase-change sting (higher/punchier = player, lower/menacing = enemy) — hear whose turn it is without looking.

## D. Selection and hover feel
- Most-cited failure (game designer, r/gamedesign): **"action selection requires some juice... When I click a button to select an action, SOMETHING should happen. Not just a cursor change... Give it some weight."**
- **Grid-cursor tick per tile = cheapest selection juice there is** — "the most important juice for a grid-based game."
- Hover: brighten + lift (1.0→1.06) + soft tick; selected unit pops with ring + confirm blip; range tiles shimmer (animated dashed border); attack preview pulses red + rising-pitch "arming" sound — anticipation as UI.
- Health bars drain gradually, pulse when low; damage previews count up. Buttons squash on press; panels slide with overshoot.

## E. Animation economics
- **Darkest Dungeon model:** "maximum value out of minimum animated assets" — combat anims are "just static images being tweened, shifted, or rotated." Rotate/scale/translate existing sprites — no new art.
- Disney's 12 principles (what players notice): **anticipation** (6–10f wind-up — telegraphs + weight), **overshoot/follow-through** (limb overshoots then settles), **easing** (nothing linear). A 2-pose attack with anticipation + overshoot + easing beats a 10-frame linear tween.
- **Idle bob: highest-noticed animation per line of code.**
- Grid movement: slide-with-squash (lean in, settle wobble) beats a walk cycle — full walk cycles are low ROI on a grid.
- Fake smoothness: layered transforms (move + rotate + scale), staggered limb lag, particle trails — all transform math on existing sprites.
- Prioritization: ~70% of design weight stays on the tactics; juice supports, never replaces.

## F. Sound as feel
- "Juice is 50% audio" = widely repeated, **could NOT trace to a named source [unverified].** Verified: sound coherence is top-3 impact-feel driver (Lin et al.); published study "That Sound's Juicy!" (Smets, ICEC 2021).
- **Highest-leverage sounds, in order** [synthesis]: (1) cursor-move tick (heard hundreds of times/mission); (2) select/confirm blip; (3) wind-up whoosh; (4) impact thump with pitch jitter ±10% (never the identical sample twice — free); (5) limb-break crunch + kill boom; (6) phase-change stings; (7) quiet ambient hum (silence never feels broken). All $0 via WebAudio synthesis — no assets needed.
- Timing: impact SFX on the contact frame (not animation start); UI sounds within ~50ms of click; silence/stillness before big explosions.

## G. Juice budget (ranked cheapest-first) + what backfires
1. Hit-stop (~5 lines) 2. Cursor/UI sounds 3. Idle bob + activation pop 4. Flash frames + impact ring 5. Damage-number choreography 6. Shake scaled to damage 7. Squash/stretch anticipation-overshoot 8. Phase banners + stings 9. Camera punch-in 10. Slow-mo on limb destruction 11. Ambient aliveness 12. Full cut-ins (last, crits only).
- **Backfires:** unskippable animations (XCOM cam toggleable for a reason — keep hits snappy, allow click-to-skip); obscuring information (readability is the one hard ceiling); intensity mismatch (full-screen flash on a menu click = overboard — match juice to event importance); late-juice refactor trap (plan animation callbacks / input-lock flags); juice can't save a weak core — **but juice the first 5 minutes hardest** (strategy games reveal depth slowly; zero juice risks bounce before tactics shine).

## Applied to Mecha Protocol (implement-immediately, this round)
Implemented in build/: WebAudio SFX synth (js/sfx.js — tick, select, shoot, hit, explode, phase stings; pitch jitter; iOS gesture-safe init); hit-stop (80ms hits / 180ms kills+limb breaks); phase banners (tweened YOUR TURN / ENEMY TURN + stings); idle bob on all units; impact flash frames; damage-number pop choreography; screen shake already scaled. Polish-later: camera punch-in, slow-mo, ambient particles, full cut-ins.

## H. Sources
youtube.com/watch?v=Fy0aCDmgnxg (GDC 2012) · youtube.com/watch?v=AJdEqssNZ-U (Vlambeer 2013) · youtube.com/watch?v=216_5nu4aVQ (GMTK) · arxiv.org/abs/2208.06155 (Lin et al., IEEE GEM 2022) · reddit.com/r/gamedesign/comments/15fag9q/ (Aug 2023) · ICEC 2021 (Smets) · Swink "Game Feel" (2008) · Johnston & Thomas "The Illusion of Life" (12 principles) · en.wikipedia.org/wiki/Game_feel
