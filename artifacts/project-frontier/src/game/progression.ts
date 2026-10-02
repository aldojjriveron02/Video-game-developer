export const MAX_CHARACTER_LEVEL = 100;

export type Progression = {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  xpRemaining: number;
};

// Level 1 starts at zero. Advancing from level L costs 24 * L XP.
// Lifetime thresholds: level 2 = 24, level 3 = 72, level 4 = 144.
// Character level is capped at MAX_CHARACTER_LEVEL; lifetime XP may continue to accumulate.
export function progressionForXp(totalXp: number): Progression {
  if (!Number.isSafeInteger(totalXp) || totalXp < 0) {
    throw new Error("Player XP must be a nonnegative safe integer.");
  }

  const derivedLevel = Math.floor((1 + Math.sqrt(1 + totalXp / 3)) / 2);
  const level = Math.min(MAX_CHARACTER_LEVEL, derivedLevel);

  if (level === MAX_CHARACTER_LEVEL) {
    return {
      level,
      totalXp,
      xpIntoLevel: 0,
      xpForNextLevel: 0,
      xpRemaining: 0,
    };
  }

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
