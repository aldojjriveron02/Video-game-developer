/* Mecha Protocol — game data: weapons, armor, limbs, missions */
'use strict';

// Playtest survey (Round 49): paste the Google Form URL when wave 0 launches —
// a survey button appears on the victory screen. Empty = hidden.
const SURVEY_URL = '';

// Round 150 — THEME HOOK (LD60 theme-scout: the "mechanical metaphor").
// Friday-night fill-in: set name/desc + optionally tweak the multipliers.
// This is PREP INFRASTRUCTURE, not theme content — defaults are identity (no effect).
// The theme-scout proved: one theme-named hook buys "theme-fit" perception without redesign
// (Signal Garden model); winners chase Fun/Graphics/Mood, never the Theme category.
// FILL-IN PROCEDURE (Friday ~6PM): 1) set name to the theme word as a status effect,
// 2) write desc as one briefing line, 3) optionally set dmgMult/heatMult (±20% max —
// tuning, not redesign), 4) node --check, 5) done. One edit, not a redesign.
// Round 153 — JAM BUILD flag (LD60). TRUE for the jam submission:
// hides the JA draft from the language toggle (EN-only per itch.io guidance),
// locks the hangar to 3 squad presets, defaults difficulty to easy.
const JAM_BUILD = true;

const THEME_HOOK = {
  name: null,   // e.g. "Signal Static" — shown in briefing + battle banner
  desc: null,   // e.g. "Stray signals scramble targeting: ..."
  dmgMult: 1,   // battle-wide damage multiplier (keep 0.8–1.2)
  heatMult: 1,  // battle-wide heat generation multiplier (keep 0.8–1.2)
  // Round 177 — theme twist (Arcweave "three moments": hook → choice → payoff).
  // Friday 6PM: fill this + name/desc, done.
  twist: null,  // e.g. "VEX wasn't hunting you. It was herding you."
};

const WEAPONS = {
  rifle:    { id:'rifle',    nameKey:'weapon.rifle.name',    dmg:3, range:4, heat:2, targets:'any',  hitstop:1.0, descKey:'weapon.rifle.desc' },
  cannon:   { id:'cannon',   nameKey:'weapon.cannon.name',   dmg:5, range:3, heat:4, targets:'any',  hitstop:1.25, descKey:'weapon.cannon.desc' },
  blade:    { id:'blade',    nameKey:'weapon.blade.name',    dmg:6, range:1, heat:1, targets:'any',  hitstop:1.5, descKey:'weapon.blade.desc' },
  missiles: { id:'missiles', nameKey:'weapon.missiles.name', dmg:2, range:5, heat:3, targets:'any', hits:2, hitstop:0.7, descKey:'weapon.missiles.desc' },
};

// Round 155 — SQUAD PRESETS (LD60 jam: lock the hangar, ship squad-select).
// ItB model: curated preset rosters, pick in <30s, distinct playstyles (AC6: playstyle over stats).
// JAM_BUILD = true → Hangar.open() shows these instead of the full hangar.
// Each preset = 3 mech loadouts {armor, armL, armR}. Full hangar stays for the slice.
const SQUAD_PRESETS = [
  // Round 165 — consequence language (Doucet): plain-language outcomes, not stats.
  // recommended = the pre-selected default (Vriend 'recommended' label; ItB Rift Walkers).
  { id:'brawler', name:'Brawler Lance', recommended:false, recFor:0,
    recWhy:'M1 is close-quarters — wins at range 1-2',
    desc:'Wins fights at range 1-2. • Overheats fast — vent or die. • Kiting kills you.',
    mechs:[ {armor:'heavy', armL:'blade', armR:'cannon'}, {armor:'medium', armL:'blade', armR:'blade'}, {armor:'heavy', armL:'cannon', armR:'cannon'} ] },
  { id:'skirmisher', name:'Skirmisher Lance', recommended:false, recFor:1,
    recWhy:'M2 is open ground — speed decides it',
    desc:'Fastest mechs on the field. • Dies to one focused burst. • Wins by never standing still.',
    mechs:[ {armor:'light', armL:'rifle', armR:'missiles'}, {armor:'light', armL:'rifle', armR:'rifle'}, {armor:'medium', armL:'missiles', armR:'rifle'} ] },
  { id:'bulwark', name:'Bulwark Lance', recommended:true, recFor:2,
    recWhy:'M3 is the VEX duel — survive ~2 extra hits',
    desc:'Survives ~2 extra hits per mech. • Slow — VEX picks the range. • Safest first pick vs the duel.',
    mechs:[ {armor:'heavy', armL:'cannon', armR:'rifle'}, {armor:'heavy', armL:'rifle', armR:'rifle'}, {armor:'medium', armL:'cannon', armR:'cannon'} ] },
];

const ARMOR = {
  light:  { id:'light',  nameKey:'armor.light.name',   hpMul:0.8, moveBonus:1, color:'#3fa7ff' },
  medium: { id:'medium', nameKey:'armor.medium.name',  hpMul:1.0, moveBonus:0, color:'#8a93a8' },
  heavy:  { id:'heavy',  nameKey:'armor.heavy.name',   hpMul:1.4, moveBonus:-1, color:'#c96a2e' },
};

const LIMB_DEFS = {
  head:  { nameKey:'limb.head.name',  baseHp:4,  color:'#2b3a55' },
  torso: { nameKey:'limb.torso.name', baseHp:10, color:'#8a93a8' },
  armL:  { nameKey:'limb.armL.name',  baseHp:6, color:'#8a93a8' },
  armR:  { nameKey:'limb.armR.name',  baseHp:6, color:'#8a93a8' },
  legL:  { nameKey:'limb.legL.name',  baseHp:7, color:'#5a6378' },
  legR:  { nameKey:'limb.legR.name',  baseHp:7, color:'#5a6378' },
};

const TERRAIN = {
  plain: { name:'Plain', moveCost:1, cover:0,   color:'#182238' },
  cover: { name:'Cover', moveCost:1, cover:25,  color:'#1d3a2f' },  // +25% evade
  rough: { name:'Rough', moveCost:2, cover:0,   color:'#2c2340' },
  // Round 159 — scorched (environmental storytelling): wreckage of previous VEX duels.
  // Pure flavor — moveCost 1, cover 0, zero mechanical effect. M3 only.
  scorched: { name:'Scorched', moveCost:1, cover:0, color:'#14101c' },
};

const MISSIONS = [
  {
    id:1, nameKey:'mission.1.name', briefingKey:'mission.1.briefing', assistKey:'mission.1.assist',
    map:[ /* 10x8 terrain codes: . plain, c cover, r rough */
      '..........',
      '..........',
      '..cc......',
      '..........',
      '......cc..',
      '..........',
      '..rr......',
      '..........'],
    playerSpawns:[[1,6],[1,4],[2,5]],
    enemySpawns:[[8,1],[8,3],[7,2]],
    enemies:['raider','stinger','raider'],
    par:14,
  },
  {
    id:2, nameKey:'mission.2.name', briefingKey:'mission.2.briefing',
    map:[
      '..........',
      '...cc.....',
      '..........',
      '.....cc...',
      '..........',
      '..cc......',
      '..........',
      '..........'],
    playerSpawns:[[1,6],[1,4],[2,5]],
    enemySpawns:[[7,1],[8,2],[6,3]],
    enemies:['longshot','warden','stinger'],
    par:16,
  },
  {
    id:3, nameKey:'mission.3.name', briefingKey:'mission.3.briefing',
    map:[  // Round 159 — w = scorched (VEX duel wreckage; environmental storytelling)
      '..........',
      '..c....c..',
      '.......w..',
      '....cc....',
      '..w.......',
      '..c....c..',
      '......w...',
      '..........'],
    playerSpawns:[[1,6],[1,4],[2,5]],
    enemySpawns:[[8,2]],
    ace:true,
    par:18,
  },
];

const PLAYER_COLOR = '#56B4E9';  // Okabe-Ito sky blue (colorblind-safe)
const ENEMY_COLOR = '#D55E00';    // Okabe-Ito vermillion (colorblind-safe)

const DIFFICULTY = {
  easy:   { id:'easy',   labelKey:'diff.story.label',  ai:'easy',   accBonus:10, descKey:'diff.story.desc' },
  normal: { id:'normal', labelKey:'diff.normal.label', ai:'normal', accBonus:0,  descKey:'diff.normal.desc' },
  hard:   { id:'hard',   labelKey:'diff.hard.label',   ai:'hard',   accBonus:-5, descKey:'diff.hard.desc' },
};

// Enemy archetypes (Round 51 — one readable trick each; ITB/XCOM rules)
// Variety comes from loadout + personality + tint, not new systems.
// Teaching order: M1 = raider/stinger (move, attack, limb targeting);
// M2 = longshot/warden (spread out, target priority); M3 = VEX ace (the duel).
const ENEMY_ARCHETYPES = {
  raider:   { name:'RAIDER',   loadout:{ armor:'medium', armL:'rifle', armR:'blade' },    personality:'charger',    tint:'#D55E00', moveBonus:0,
              trick:'melee bruiser — its blade arm is the threat; disable the arm' },
  stinger:  { name:'STINGER',  loadout:{ armor:'light',  armL:'rifle', armR:'rifle' },    personality:'skirmisher', tint:'#E69F00', moveBonus:1,
              trick:'fast skirmisher — kites; control its movement, watch your heat chasing it' },
  longshot: { name:'LONGSHOT', loadout:{ armor:'light',  armL:'cannon', armR:'cannon' },  personality:'holder',     tint:'#CC79A7', moveBonus:0,
              trick:'artillery — long range, holds position; spread out, close distance' },
  warden:   { name:'WARDEN',   loadout:{ armor:'heavy',  armL:'rifle', armR:'blade' },    personality:'holder',     tint:'#009E73', moveBonus:0,
              trick:'tanky bodyguard — kill it first or go around; don\'t trade evenly' },
  pyre:     { name:'PYRE',     loadout:{ armor:'medium', armL:'missiles', armR:'missiles' }, personality:'charger', tint:'#F0E442', moveBonus:0,
              trick:'heat-themed — runs hot attacking; let it overheat, then punish' },
};

// Pilot assists (Round 52 — Celeste model): granular, toggleable anytime,
// zero punishment, zero content locks. Framed as pilot aids, never shame.
const ASSISTS = {
  steady:   { id:'steady',   nameKey:'assist.steady.name',   descKey:'assist.steady.desc' },   // enemy accuracy -15%
  coolant:  { id:'coolant',  nameKey:'assist.coolant.name',  descKey:'assist.coolant.desc' },  // heat vents +1/turn
  second:   { id:'second',   nameKey:'assist.second.name',   descKey:'assist.second.desc' },   // +1 undo per mission
  repairs:  { id:'repairs',  nameKey:'assist.repairs.name',   descKey:'assist.repairs.desc' },  // double limb recovery between missions
};

// Hangar preset recipes (Round 39 — anti-analysis-paralysis: one-tap starter builds)
const RECIPES = [
  { id:'scout',   nameKey:'recipe.scout.name',   descKey:'recipe.scout.desc',   loadout:{ armor:'light',  armL:'rifle',   armR:'missiles' } },
  { id:'brawler', nameKey:'recipe.brawler.name', descKey:'recipe.brawler.desc', loadout:{ armor:'heavy',  armL:'cannon',  armR:'blade' } },
  { id:'striker', nameKey:'recipe.striker.name', descKey:'recipe.striker.desc', loadout:{ armor:'medium', armL:'cannon',  armR:'missiles' } },
];
// Round 36: rarity tiers + manufacturer identities + duplicate upgrades (Pom-style)
const REWARDS = [
  { id:'servos',    nameKey:'reward.servos.name',    descKey:'reward.servos.desc',    effect:{ move:1 },    upgrade:{ move:2 } },
  { id:'coolant',   nameKey:'reward.coolant.name',   descKey:'reward.coolant.desc',   effect:{ maxHeat:4 }, upgrade:{ maxHeat:6 } },
  { id:'targeting', nameKey:'reward.targeting.name', descKey:'reward.targeting.desc', effect:{ acc:10 },   upgrade:{ acc:15 } },
  { id:'repairs',   nameKey:'reward.repairs.name',   descKey:'reward.repairs.desc',   effect:{ repair:4 },  upgrade:{ repair:6 } },
  { id:'battery',   nameKey:'reward.battery.name',   descKey:'reward.battery.desc',   effect:{ undos:1 },   upgrade:{ undos:2 } },
  { id:'aegis',     nameKey:'reward.aegis.name',     descKey:'reward.aegis.desc',     effect:{ maxHeat:6 }, upgrade:{ maxHeat:9 },  tier:'epic' },
  { id:'oracle',    nameKey:'reward.oracle.name',    descKey:'reward.oracle.desc',    effect:{ acc:20 },    upgrade:{ acc:30 },    tier:'epic' },
];
