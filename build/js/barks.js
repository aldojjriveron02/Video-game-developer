/* Mecha Protocol — bark engine (Round 45)
 * Into the Breach formula: "pilots say X in response to Y state." One transient
 * line per trigger, shown at the pilot's position, never blocks input, never
 * required reading. Differentiation: each pilot reacts differently to the same
 * trigger. Pilots are keyed by lance index (0/1/2) so mech renames don't break
 * lookup; VEX is keyed 'vex'. Counts in BARK_COUNTS; lines in i18n as
 * bark.<trigger>.<pilot>.<n>. (JA drafts are functional — native speaker pass needed.)
 *
 * Round 121 — pilot archetypes (Avellone method: trait / intention / direction):
 *   p0 = ACE (Ace Pilot): trait=confident, intention=win clean, direction=veteran ace
 *   p1 = ROOKIE (Green): trait=eager, intention=prove self, direction=young rookie
 *   p2 = VETERAN (Cynical): trait=world-weary, intention=survive, direction=old soldier
 * Each archetype gets one signature lexicon quirk + one forbidden phrase.
 * Pilots may share a voice pack within archetype (BATTLETECH Glitch/Skull).
 * Density rule: every bark carries ≥2 of {event info, state info, character} in ≤12 words.
 *
 * Round 149 — VOICE BIBLE (Avellone method + ITB diction; production voice pass).
 * Every bark is written against this. No voice bible = the void trap (Narrative Dept).
 * Cadence/slang/interests per pilot; terminology discipline per ITB ("no one calls
 * a Vek an alien" — word choice reflects the speaker's worldview, never outsider
 * language). VEX has two registers: legend (M1/M2, heard-about) and observant
 * (M3 duel, references YOUR missions — the Chosen cadence). */
const VOICE_BIBLE = {
  p0: { name: 'ACE', cadence: 'short, clipped, radio-procedure',
        slang: 'brevity codes ("tally", "copy", "wilco")', interests: 'the perfect run, the record',
        diction: 'never hedges; states outcomes as facts',
        forbidden: 'never says "maybe" or "I think"',
        terms: 'calls enemies "targets", never "enemies"' },
  p1: { name: 'ROOKIE', cadence: 'fast, run-on, self-correcting',
        slang: 'sim slang ("clutch", "diff")', interests: 'proving self, the veterans\' approval',
        diction: 'asks questions mid-bark; narrates own actions',
        forbidden: 'never sounds bored',
        terms: 'calls the mech by name (#mech), like a teammate' },
  p2: { name: 'VETERAN', cadence: 'slow, dry, trailing off',
        slang: 'old-war idioms ("back in the Belt", "seen worse")', interests: 'getting home, the rookies\' survival',
        diction: 'understates danger; gallows humor',
        forbidden: 'never panics, never raises voice on the page',
        terms: 'calls enemies "kids" or "amateurs", never with respect' },
  vex: { name: 'VEX',
        legend: 'never speaks directly; only described by others (M1/M2)',
        observant: 'precise, curious, almost warm — the menace is in the attention, not volume',
        diction: 'references YOUR specific actions (turns, losses, weapons); asks questions it knows the answer to',
        forbidden: 'never shouts, never threatens directly, never says "die"',
        terms: 'calls your mechs "lance" (collective) or by pilot callsign — never "machine" or "scrap"' },
};
'use strict';

const BARK_COUNTS = {
  start:    { p0: 2 },
  firstkill:{ p0: 3, p1: 3, p2: 3 },  // Round 195 — O'Connor: 2 variants
  allydown: { p0: 1, p1: 1, p2: 1 },
  vexenter: { vex: 1, p0: 1 },
  // Round 168 — VEX signature line (GLaDOS pattern): ONE line, repeated verbatim.
  // Memorability through recurrence, not variety. Fired at duel entrance + duel end.
  vexsign:  { vex: 1 },
  clear:    { p0: 1, p1: 1, p2: 1 },
  // Round 148 — VEX legend through chatter (Shattered Skies as Literature):
  // pilots mention VEX in M1/M2, building the rival before the M3 duel.
  vexrumor: { p0: 1, p1: 1 },
  limblost: { p0: 3, p1: 3, p2: 3 },  // Round 195 — O'Connor: 2 variants (survive repetition)
  overheat: { p0: 3, p1: 3, p2: 3 },  // Round 195 — O'Connor: 2 variants
  heat50:   { p0: 3, p1: 3, p2: 3 },  // Round 195 — O'Connor: 2 variants
};

const Barks = {
  _shown: {},
  _lastTime: {},  // Round 101 — per-trigger cooldowns (Mitchell: critical 1-2s, combat 4-8s, ambient 12-20s)
  _fireCounts: {},  // Round 264 — per-trigger per-session fire tally (Beaulieu: unmeasured triggers are untested)
  _lastVariant: {},  // Round 101 — never repeat the last-played variant

  // Cooldown tiers (ms): critical = limblost/overheat/vexenter/allydown; combat = firstkill/heat50; ambient = clear/start/vexrumor
  _cooldown(trigger) {
    if (['limblost', 'overheat', 'vexenter', 'allydown'].includes(trigger)) return 1500;
    if (['firstkill', 'heat50'].includes(trigger)) return 6000;
    return 15000;  // clear, start, vexrumor
  },

  reset() { this._shown = {}; this._lastTime = {}; this._lastVariant = {}; this._fireCounts = {}; },  // Round 264: tally resets per session
  // Round 264 — trigger audit (Beaulieu's Skyrim lesson): per-trigger firing
  // rates for the current session. Call Barks.audit() in the console after a
  // playthrough; any trigger repeating identical lines like the Skyrim case
  // gets more variations or a longer cooldown.
  audit() {
    const rows = Object.entries(this._fireCounts).sort((a, b) => b[1] - a[1]);
    return rows.length ? rows.map(([t, n]) => t + ': ' + n).join('\n') : '(no barks fired this session)';
  },

  // Round 282 — static coverage (pulsegeek): every trigger in BARK_COUNTS must
  // resolve ≥1 line in i18n; every line must map to a defined trigger. The
  // static half of the audit (audit() = the dynamic half). Run before lock.
  coverage() {
    const gaps = [], ok = [];
    for (const [trigger, pilots] of Object.entries(BARK_COUNTS)) {
      let found = 0;
      for (const [pilot, n] of Object.entries(pilots)) {
        for (let i = 0; i < n; i++) {
          try { if (t('bark.' + trigger + '.' + pilot + '.' + i)) found++; } catch (e) {}
        }
      }
      (found > 0 ? ok : gaps).push(trigger + ': ' + found + ' lines');
    }
    return (gaps.length ? 'GAPS:\n' + gaps.join('\n') + '\n' : '') +
           'OK (' + ok.length + ' triggers):\n' + ok.join('\n');
  },

  // Round 90: bark verbosity (Off/Reduced/Full) — cognitive load control
  // Reduced = critical only (limblost, overheat, vexenter, clear); Full = all 8 triggers
  _verbosity() {
    try { return (Game.saveData.settings || {}).barkVerbosity || 'full'; } catch (e) { return 'full'; }
  },

  // pilot: 0/1/2 (lance index) or 'vex'
  say(trigger, pilot) {
    try {
      const v = this._verbosity();
      if (v === 'off') return;
      if (v === 'reduced' && !['limblost', 'overheat', 'vexenter', 'clear'].includes(trigger)) return;
      // Round 160 — stop_on_nonidle (Valve): barks yield to high-intensity moments.
      // If juice events/sec is hot (>3), suppress non-critical barks — never stack
      // voice over threat audio or the intent-telegraph stinger. Critical barks
      // (limblost, overheat, vexenter, allydown) always fire.
      const critical = ['limblost', 'overheat', 'vexenter', 'allydown'].includes(trigger);
      if (!critical && typeof Game !== 'undefined' && Game._juiceEvts) {
        const now2 = Date.now();
        const hot = Game._juiceEvts.filter(t => now2 - t < 1000).length;
        if (hot > 3) return;
      }
      // Round 101 — cooldown gate (playback rules > more lines)
      const now = Date.now();
      const lastT = this._lastTime[trigger] || 0;
      if (now - lastT < this._cooldown(trigger)) return;
      const key = pilot === 'vex' ? 'vex' : 'p' + pilot;
      const n = (BARK_COUNTS[trigger] || {})[key] || 0;
      if (!n || typeof Game === 'undefined' || !Game.view) return;
      const shownKey = trigger + ':' + key;
      let shown = this._shown[shownKey] || [];
      if (shown.length >= n) shown = [];
      // Round 101 — never repeat the last-played variant
      const lastV = this._lastVariant[shownKey];
      let i = Math.floor(Math.random() * n), guard = 0;
      while ((shown.includes(i) || (n > 1 && i === lastV)) && guard++ < 12) i = (i + 1) % n;
      shown.push(i); this._shown[shownKey] = shown;
      this._lastVariant[shownKey] = i;
      this._lastTime[trigger] = now;
      let text = t('bark.' + trigger + '.' + key + '.' + i);
      if (!text || text.indexOf('bark.') === 0) return;  // missing line — stay silent
      // Round 136 — token layer (Avellone/ITB): #self (callsign), #mech (mech name), #mission.
      // Signature diction at zero writing cost — 3 lines feel like 30.
      try {
        const callsigns = { p0: 'Ace', p1: 'Rookie', p2: 'Vet', vex: 'VEX' };
        const pm = pilot === 'vex' ? (Game.enemyMechs || []).find(x => x.isAce) : (Game.playerMechs || [])[pilot];
        text = text.split('#self').join(callsigns[key] || '')
                   .split('#mech').join(pm ? pm.name : '')
                   .split('#mission').join('M' + (Game.missionIndex + 1));
      } catch (e) {}
      this.show(pilot, text);
      // Round 207 — BGM ducks under barks (A Sound Effect readability: voice > music).
      try { if (window.Music && Music.duck) Music.duck(0.4, 0.5); } catch (e2) {}
      try { Telemetry.design('bark:' + trigger + ':' + key, 1); } catch (e) {}
      this._fireCounts[trigger] = (this._fireCounts[trigger] || 0) + 1;  // Round 264: local audit tally
    } catch (e) {}
  },

  show(pilot, text) {
    const v = Game.view;
    let m = null, color = PLAYER_COLOR, name = '';
    if (pilot === 'vex') {
      m = Game.enemyMechs.find(x => x.isAce);
      color = '#c9a0ff'; name = 'VEX';
    } else {
      m = Game.playerMechs[pilot];
      if (m && !mechAlive(m)) m = Game.playerMechs.find(x => mechAlive(x));
      if (!m) return;
      name = m.name;
    }
    if (!m) return;
    Game.floater((m.x + .5) * v.tile + v.ox, (m.y - .6) * v.tile + v.oy,
      name + ': "' + text + '"', color, 14, 3.2);
    // Round 221 — announce barks to screen readers
    try { if (Game.announce) Game.announce(name + ': ' + text); } catch (e) {}
  },

  // random living pilot index (for mission-clear etc.)
  randomPilot() {
    const alive = Game.playerMechs.map((m, i) => mechAlive(m) ? i : -1).filter(i => i >= 0);
    return alive.length ? alive[Math.floor(Math.random() * alive.length)] : 0;
  },
};
