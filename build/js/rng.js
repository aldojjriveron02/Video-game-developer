/* Mecha Protocol — deterministic RNG infrastructure (Round 50)
 * Daily Sortie prerequisite (vertical slice). Explicit platform-stable PRNG —
 * never the stdlib — so the same seed produces the same run on every device.
 * Today: the module + daily-seed derivation + self-tests. The slice wires all
 * gameplay randomness through RNG.run; cosmetic randomness (particles, barks,
 * sfx) stays on Math.random.
 *
 * DETERMINISM AUDIT (slice work):
 *   MUST seed: combat hit/crit rolls (game.js resolveAttack — currently Date.now()!),
 *              AI decisions (ai.js — turn+mech seeded, not run-seeded),
 *              reward draft (game.js — currently Math.random).
 *   MAY stay random: barks, particles, sfx (cosmetic only).
 */
'use strict';

// App secret mixed into the daily seed so the seed isn't a guessable date string.
// Not crypto-grade — just stops casual pre-computation of tomorrow's sortie.
const SORTIE_SECRET = 'mecha-protocol-sortie-v1';

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// xorshift32 — explicit, platform-stable, 32-bit
function xorshift32(seed) {
  let s = (seed >>> 0) || 0x9e3779b9;
  return function () {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

const RNG = {
  // YYYY-MM-DD in UTC — day boundaries are always UTC (Round 50: no local-time rollover)
  utcDay(d) {
    const t = d || new Date();
    return t.getUTCFullYear() + '-' +
      String(t.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(t.getUTCDate()).padStart(2, '0');
  },

  // The Daily Sortie seed: identical for every player worldwide on a given UTC day
  dailySeed(dayStr) {
    return fnv1a(SORTIE_SECRET + '|' + (dayStr || this.utcDay()));
  },

  // A fresh gameplay stream from any seed
  stream(seed) {
    const next = xorshift32(seed);
    return {
      next,
      int(n) { return Math.floor(next() * n); },
      pick(arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      },
    };
  },

  // Today's sortie stream
  daily() { return this.stream(this.dailySeed()); },

  // Self-test: same seed → identical sequence on every platform
  selfTest() {
    const a = this.stream(12345), b = this.stream(12345);
    for (let i = 0; i < 100; i++) if (a.next() !== b.next()) return false;
    const c = this.stream(12345), d = this.stream(12346);
    if (c.next() === d.next() && c.next() === d.next()) return false;  // different seeds diverge
    if (this.dailySeed('2026-10-14') !== this.dailySeed('2026-10-14')) return false;
    if (this.dailySeed('2026-10-14') === this.dailySeed('2026-10-15')) return false;
    const s = this.stream(7).shuffle([1, 2, 3, 4, 5]);
    if (s.length !== 5 || new Set(s).size !== 5) return false;
    return true;
  },
};
