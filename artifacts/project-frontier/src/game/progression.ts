export type Progression = {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  xpRemaining: number;
};

// Level 1 starts at zero. Advancing from level L costs 24 * L XP.
// Lifetime thresholds: level 2 = 24, level 3 = 72, level 4 = 144.
export function progressionForXp(totalXp: number): Progression {
  if (!Number.isSafeInteger(totalXp) || totalXp < 0) {
    throw new Error("Player XP must be a nonnegative safe integer.");
  }
  const level = Math.floor((1 + Math.sqrt(1 + totalXp / 3)) / 2);
  const levelStart = 12 * level * (level - 1);
  const xpForNextLevel = 24 * level;
  const xpIntoLevel = totalXp - levelStart;
  return {
    level,
    totalXp,
    xpIntoLevel,
    xpForNextLevel,
    xpRemaining: xpForNextLevel - xpIntoLevel,
  };
}