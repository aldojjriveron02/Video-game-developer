import { describe, expect, it } from "vitest";
import { MAX_CHARACTER_LEVEL, progressionForXp } from "../../src/game/progression";

describe("player progression", () => {
  it.each([
    [0, 1, 0, 24],
    [8, 1, 8, 16],
    [23, 1, 23, 1],
    [24, 2, 0, 48],
    [71, 2, 47, 1],
    [72, 3, 0, 72],
    [144, 4, 0, 96],
  ])("derives progression for %i lifetime XP", (xp, level, into, remaining) => {
    expect(progressionForXp(xp)).toEqual({
      level, totalXp: xp, xpIntoLevel: into, xpRemaining: remaining,
      xpForNextLevel: 24 * level,
    });
  });

  it("caps character level at 100 while preserving lifetime XP", () => {
    const level100Start = 12 * MAX_CHARACTER_LEVEL * (MAX_CHARACTER_LEVEL - 1);
    expect(progressionForXp(level100Start)).toEqual({
      level: 100,
      totalXp: level100Start,
      xpIntoLevel: 0,
      xpForNextLevel: 0,
      xpRemaining: 0,
    });

    const veryHigh = progressionForXp(2_147_483_647);
    expect(veryHigh.level).toBe(100);
    expect(veryHigh.totalXp).toBe(2_147_483_647);
    expect(veryHigh.xpForNextLevel).toBe(0);
    expect(veryHigh.xpRemaining).toBe(0);
  });

  it.each([-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid lifetime XP %s", (xp) => {
      expect(() => progressionForXp(xp)).toThrow("nonnegative safe integer");
    },
  );
});
