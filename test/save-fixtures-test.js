#!/usr/bin/env node
/* Mecha Protocol — save golden-fixture test (Round 241)
 * Asserts the CURRENT loader against checked-in fixtures per schema version:
 *  - save-v1-good.json: loads clean, markers intact, checksum valid
 *  - save-v1-truncated.json: rejected (falls to .bak or defaults, never half-applied)
 *  - save-v1-badchecksum.json: rejected, backup chain engaged
 * Run: node test/save-fixtures-test.js — exit 0 = all pass.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); return true; },
  removeItem: k => { delete store[k]; },
};
global.window = {};
global.Telemetry = { design: () => {} };

let src = fs.readFileSync(path.join(__dirname, '..', 'build', 'js', 'save.js'), 'utf8');
src = src.replace(/'use strict';/, '') + '\nmodule.exports = SaveStore;';
fs.writeFileSync('/tmp/save-fixture-test.js', src);
const S = require('/tmp/save-fixture-test.js');

const dir = path.join(__dirname, 'fixtures');
let pass = 0, fail = 0;
const check = (name, ok) => { if (ok) { pass++; console.log('  PASS ' + name); } else { fail++; console.log('  FAIL ' + name); } };

// 1. good fixture: loads clean, markers intact
store[S.LIVE] = fs.readFileSync(path.join(dir, 'save-v1-good.json'), 'utf8');
const good = S.read();
check('good: loads', !!good);
check('good: markers intact', good.stats.missionsWon === 3 && good.stats.turnsPlayed === 47);
check('good: schema v1', JSON.parse(store[S.LIVE]).schema === S.SCHEMA);
check('good: checksum valid', S._checksumOk(JSON.parse(store[S.LIVE])));
check('good: under 50KB budget', store[S.LIVE].length < 51200);

// 2. truncated fixture: never half-applied — falls to defaults (no .bak seeded here)
delete store[S.LIVE]; delete store[S.BAK];
store[S.LIVE] = fs.readFileSync(path.join(dir, 'save-v1-truncated.json'), 'utf8');
const trunc = S.read();
check('truncated: rejected, returns defaults', trunc.stats.missionsWon === 0);

// 3. bad-checksum fixture: rejected; with a good .bak seeded, backup restores
delete store[S.LIVE]; delete store[S.BAK];
store[S.LIVE] = fs.readFileSync(path.join(dir, 'save-v1-badchecksum.json'), 'utf8');
store[S.BAK] = fs.readFileSync(path.join(dir, 'save-v1-good.json'), 'utf8');
const bad = S.read();
check('bad-checksum: rejected, .bak restores playable', bad.stats.missionsWon === 3);

// 4. future schema: never read as current — rejected to defaults (no migration for v999)
delete store[S.LIVE]; delete store[S.BAK];
const future = JSON.parse(fs.readFileSync(path.join(dir, 'save-v1-good.json'), 'utf8'));
future.schema = 999;
future.checksum = null;
const fbody = JSON.stringify(Object.assign({}, future, { checksum: null }));
future.checksum = S.fnv1a(fbody);
store[S.LIVE] = JSON.stringify(future);
const fr = S.read();
check('future-schema: not loaded as current', fr.stats.missionsWon === 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
