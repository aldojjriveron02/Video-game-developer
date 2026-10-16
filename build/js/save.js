/* Mecha Protocol — save system (Round 32)
 * Versioned schema + atomic two-key rotation + FNV-1a checksum.
 * Design rules from research: version field from day one; sequential
 * migrations; never mutate raw in place; load always returns something
 * usable and NEVER blocks boot (live -> backup -> defaults). */
'use strict';

const SaveStore = {
  SCHEMA: 1,
  LIVE: 'mecha-protocol-save',
  TMP: 'mecha-protocol-save-tmp',
  BAK: 'mecha-protocol-save-bak',
  DIRTY: 'mecha-protocol-save-dirty',  // Round 277: save-in-progress flag (M86Berg)
  _recoveredMidWrite: false,  // set on read() if a previous save died mid-write

  defaults() {
    return {
      schema: 1, savedAt: null, checksum: null,
      settings: { lang: 'en', difficulty: 'normal', reducedEffects: false, perfHud: false, veteran: null, assists: { steady: true, coolant: true, second: true, repairs: true }, sfxMuted: false, musicMuted: false },  // Round 202 — assists ON by default (Bergdahl); veterans can toggle off
      campaign: { unlocked: ['m1'], completed: [] },
      hangar: { lances: [] },   // [{armor, armL, armR}] per mech slot
      run: null,                // mid-mission suspend snapshot (see Game.snapshotRun)
      stats: { missionsWon: 0, missionsLost: 0, turnsPlayed: 0, deploys: 0 },
      meta: { gameVersion: '0.3.0', lastPlayed: null },
    };
  },

  /* ---------- primitives ---------- */
  fnv1a(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return ('0000000' + (h >>> 0).toString(16)).slice(-8);
  },
  _get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  _set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },  // false = QuotaExceededError etc.
  _del(k) { try { localStorage.removeItem(k); } catch (e) {} },

  _checksumOk(d) {
    if (!d || typeof d !== 'object' || !d.checksum) return false;
    const chk = d.checksum;
    const body = JSON.stringify(Object.assign({}, d, { checksum: null }));
    // NOTE: checksum is computed over the payload with checksum:null in place;
    // key order is preserved through parse, so recompute matches.
    return this.fnv1a(body) === chk;
  },

  /* ---------- write: atomic tmp -> verify -> bak=old live -> live ---------- */
  write(data) {
    try {
      const payload = Object.assign({}, data, {
        schema: this.SCHEMA,
        savedAt: new Date().toISOString(),
        checksum: null,
      });
      const body = JSON.stringify(payload);
      payload.checksum = this.fnv1a(body);
      const final = JSON.stringify(payload);
      // Round 259 — hard budget guard (Cyberpunk 8MB lesson): refuse oversize
      // saves BEFORE they touch storage. Old LIVE stays intact; the corrupt
      // path is never entered. Budget asserted in selfTest check 6.
      if (final.length > 51200) {
        try { Telemetry.design('save:oversize-refused', final.length); } catch (e2) {}
        this._saveRefused = 'oversize';  // Round 304: player-visible notice, not silent
        return false;
      }
      this._set(this.DIRTY, '1');  // Round 277: save in progress (cleared only after commit)
      if (!this._set(this.TMP, final)) { this._del(this.DIRTY); this._saveRefused = 'quota'; return false; }  // Round 304
      const verify = this._get(this.TMP);
      if (!verify) { this._del(this.DIRTY); return false; }
      JSON.parse(verify);  // must parse cleanly
      const old = this._get(this.LIVE);
      if (old) this._set(this.BAK, old);   // previous known-good
      this._del(this.TMP);
      const ok = this._set(this.LIVE, verify);
      if (ok) this._del(this.DIRTY);  // commit complete — clear the flag
      else this._saveRefused = 'quota';  // Round 304: write failed, tell the player
      return ok;
    } catch (e) { return false; }
  },

  /* ---------- read: live -> backup -> defaults; never throws ---------- */
  read() {
    // Round 277: a set DIRTY flag means the previous session died mid-write.
    // Clear it, verify checksums as usual, and record the recovery so the game
    // can surface a user-visible notice (never a silent reset).
    if (this._get(this.DIRTY)) { this._del(this.DIRTY); this._recoveredMidWrite = true; }
    let liveCorrupt = false;
    for (const k of [this.LIVE, this.BAK]) {
      const raw = this._get(k);
      if (!raw) continue;
      let d = null;
      try { d = JSON.parse(raw); } catch (e) { if (k === this.LIVE) liveCorrupt = true; continue; }  // truncated write
      if (!d || typeof d !== 'object') { if (k === this.LIVE) liveCorrupt = true; continue; }
      // Round 241 — future-schema guard: checksum-valid but unmigratable (e.g. a
      // newer build's save) must NOT return null. Treat as unloadable: try the
      // backup, then defaults. Never hand the game a null save.
      if (this._checksumOk(d)) { const m = this.migrate(d); if (m) { if (liveCorrupt && k === this.BAK) this._recoveredCorrupt = true; return m; } continue; }
      const legacy = this.migrateLegacy(d);  // unchecksummed v0 blob
      if (legacy) { if (liveCorrupt && k === this.BAK) this._recoveredCorrupt = true; return legacy; }
    }
    const d = this.defaults();
    this._importLegacySettings(d);
    return d;
  },

  migrate(d) {
    if (d.schema === this.SCHEMA) {
      const base = this.defaults();
      // shallow-merge each section so missing keys fall back to defaults
      for (const k of ['settings', 'campaign', 'hangar', 'stats', 'meta'])
        if (d[k] && typeof d[k] === 'object') base[k] = Object.assign(base[k], d[k]);
      base.run = d.run || null;
      base.savedAt = d.savedAt || null;
      return base;
    }
    return this.migrateLegacy(d);
  },

  // v0: the original flat blob {loadouts, missionIndex} — no schema, no checksum
  migrateLegacy(d) {
    if (!d || typeof d !== 'object') return null;
    if (!Array.isArray(d.loadouts) && typeof d.missionIndex !== 'number') return null;
    const out = this.defaults();
    if (Array.isArray(d.loadouts)) out.hangar.lances = d.loadouts;
    if (typeof d.missionIndex === 'number') {
      const n = Math.max(0, Math.min(3, d.missionIndex));
      for (let i = 1; i <= n; i++) out.campaign.unlocked.push('m' + i);
      out.campaign.unlocked = [...new Set(out.campaign.unlocked)];
      for (let i = 1; i < n; i++) out.campaign.completed.push('m' + i);
    }
    this._importLegacySettings(out);
    try { Telemetry.design('save:migrated:v0', 1); } catch (e) {}
    return out;
  },

  // the scattered pre-schema keys -> settings section
  _importLegacySettings(d) {
    const g = (k) => this._get(k);
    const lang = g('mecha-protocol-lang'); if (lang) d.settings.lang = lang;
    const diff = g('mecha-protocol-diff'); if (diff) d.settings.difficulty = diff;
    const fx = g('mecha-protocol-fx'); if (fx !== null) d.settings.reducedEffects = fx === '1';
    const perf = g('mecha-protocol-perf'); if (perf !== null) d.settings.perfHud = perf === '1';
    const vet = g('mecha-protocol-veteran'); if (vet !== null) d.settings.veteran = vet === '1';
  },

  /* ---------- export / import ($0 cross-device + corruption escape hatch) ---------- */
  export() {
    const raw = this._get(this.LIVE);
    if (!raw) return false;
    try {
      const blob = new Blob([raw], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mecha-protocol-save.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { URL.revokeObjectURL(a.href); a.remove(); } catch (e) {} }, 800);
      return true;
    } catch (e) { return false; }
  },

  importJson(text) {
    let d;
    try { d = JSON.parse(text); } catch (e) { return 'bad-json'; }
    if (!d || typeof d !== 'object' || typeof d.schema !== 'number') return 'bad-shape';
    if (!this._checksumOk(d)) return 'bad-checksum';
    return this.write(this.migrate(d)) ? 'ok' : 'write-failed';
  },

  /* ---------- storage persistence (skip LRU eviction) ---------- */
  persist() {
    try {
      if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
    } catch (e) {}
  },

  /* ---------- boot-time persistence probe (Round 182) ---------- */
  // Safari iOS in cross-domain iframes (itch.io) silently discards localStorage
  // writes — try/catch CANNOT detect it. Probe: write marker → read back.
  embedCtx: 'top',  // Round 209 — 'top' | 'itch' | 'ld' | 'frame' | 'unknown'
  // Sets SaveStore.storageOK; UI shows Export banner when false.
  storageOK: true,
  // Round 200 — request persistent storage (MDN): one line, may reduce eviction.
  // Returns promise true/false; honoring is browser's discretion. Not in workers.
  requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then(ok => {
          try { Telemetry.design('save:persist_granted', ok ? 1 : 0); } catch (e) {}
        }).catch(() => {});
      }
    } catch (e) {}
  },
  probeStorage() {
    // Round 209 — embed detection (Toddpocalypse pattern): LD sandbox = zero storage,
    // itch.io iframe on iOS = silent non-persistence (try/catch can't catch it).
    try {
      const inFrame = window.self !== window.top;
      const host = (window.location.hostname || '').toLowerCase();
      this.embedCtx = inFrame ? (host.includes('itch.io') || host.includes('hwcdn') ? 'itch' : (host.includes('ludumdare') || host.includes('ldjam') ? 'ld' : 'frame')) : 'top';
    } catch (e) { this.embedCtx = 'unknown'; }  // cross-origin frame blocks hostname read
    // Cross-session canary: catches iOS silent non-persistence (same-session probe passes,
    // but data vanishes on reload). If we saved before and the canary is gone → unreliable.
    const CANARY = 'mecha-protocol-canary';
    let canaryGone = false;
    try {
      const had = localStorage.getItem(CANARY);
      // If a LIVE save exists from a prior session but the canary is gone,
      // storage is inconsistent (partial wipe) — don't trust it.
      // Full wipe is undetectable from wiped storage; embedCtx warning covers it.
      const hadSave = !!this._get(this.LIVE);
      if (had === '1') { /* canary survived — storage persists */ }
      else if (hadSave) canaryGone = true;
      localStorage.setItem(CANARY, '1');
    } catch (e) { canaryGone = true; }
    const KEY = 'mecha-protocol-probe', VAL = 'ok-' + Date.now();
    try {
      localStorage.setItem(KEY, VAL);
      const back = localStorage.getItem(KEY);
      localStorage.removeItem(KEY);
      this.storageOK = (back === VAL) && !canaryGone && this.embedCtx !== 'ld';
    } catch (e) { this.storageOK = false; }
    // LD embed: storage is definitionally unavailable — force Export-primary UX
    if (this.embedCtx === 'ld') this.storageOK = false;
    try { Telemetry.design('save:probe:' + this.embedCtx + ':' + (this.storageOK ? 'ok' : 'fail'), 1); } catch (e2) {}
    return this.storageOK;
  },

  /* ---------- self-test: backup-chain verification on scratch keys (Round 232) ----------
     Kozak: verify RECOVERY FROM the backup, not just its existence.
     Exercises the real write/read/rotate path on scratch keys, corrupts LIVE,
     and confirms the .bak path restores playable state. One-click jam-day check.
     Run from console: SaveStore.selfTest() */
  selfTest() {
    const T = 'mecha-protocol-selftest-tmp', L = 'mecha-protocol-selftest-live', B = 'mecha-protocol-selftest-bak';
    const results = [];
    const check = (name, ok) => { results.push({ name, ok: !!ok }); return !!ok; };
    const kTmp = this.TMP, kLive = this.LIVE, kBak = this.BAK;
    try {
      this.TMP = T; this.LIVE = L; this.BAK = B;
      // 1. write -> verify -> promote
      const d1 = this.defaults(); d1.stats.missionsWon = 7;  // marker
      check('write-tmp-verify-promote', this.write(d1) && !!this._get(L));
      // 2. second write rotates old live into bak
      const d2 = this.defaults(); d2.stats.missionsWon = 13;
      check('rotate-old-live-to-bak', this.write(d2) && !!this._get(B));
      // 3. corrupt LIVE (truncated JSON) -> read falls back to BAK, playable
      this._set(L, '{"corrupt":tru');
      const r1 = this.read();
      check('corrupt-live-falls-back-to-bak', r1 && r1.stats && r1.stats.missionsWon === 7);
      // 4. wrong checksum -> rejected, BAK still restores
      this._set(L, JSON.stringify({ schema: this.SCHEMA, checksum: 'deadbeef', stats: { missionsWon: 99 } }));
      const r2 = this.read();
      check('bad-checksum-rejected', r2 && r2.stats && r2.stats.missionsWon === 7);
      // 5. total loss -> defaults, never throws, never blocks boot
      this._del(L); this._del(B);
      const r3 = this.read();
      check('total-loss-returns-defaults', r3 && r3.stats && r3.stats.missionsWon === 0);
      // 6. Round 250 — budget assertion (Skyrim PS3 lesson): worst-case payload
      // must stay under 50KB. Budgets that aren't asserted are wishes.
      // Uses the REAL write-path serialization (schema + savedAt + checksum).
      const dw = this.defaults();
      dw.stats.missionsWon = 999; dw.stats.turnsPlayed = 9999; dw.stats.vexKills = 999;
      for (let i = 0; i < 20; i++) dw.hangar.lances.push({ name: 'Lance ' + i, mechs: [0, 1, 2] });
      dw.campaign.missionIndex = 99; dw.meta.gameVersion = '9.9.9-long-version-string';
      const wPayload = Object.assign({}, dw, { schema: this.SCHEMA, savedAt: 'x', checksum: null });
      const wBody = JSON.stringify(wPayload);
      wPayload.checksum = this.fnv1a(wBody);
      const worst = JSON.stringify(wPayload);
      check('worst-case-under-50KB (' + worst.length + ' bytes)', worst.length < 51200);
    } catch (e) { check('no-throw', false); }
    // restore live keys, clean scratch — never leave test keys behind
    this.TMP = kTmp; this.LIVE = kLive; this.BAK = kBak;
    this._del(T); this._del(L); this._del(B);
    results.pass = results.every(r => r.ok);
    try { Telemetry.design('save:selftest:' + (results.pass ? 'pass' : 'fail'), 1); } catch (e2) {}
    return results;
  },
};
