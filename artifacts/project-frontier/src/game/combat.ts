import { createHash } from "node:crypto";
import type { CombatBonuses } from "../content/items";
import type { EnemyDefinition } from "../content/encounters";
import { progressionForXp } from "./progression";

export type CombatSkillXp = { skillId: string; xp: number };
export type ResolvedGearBonuses = Required<CombatBonuses>;

export type CombatRound = {
  round: number;
  playerDamage: number;
  enemyDamage: number;
  playerHpAfter: number;
  enemyHpAfter: number;
};

export type CombatResolution = {
  result: "victory" | "defeat";
  enemyId: string;
  enemyName: string;
  playerMaxHp: number;
  enemyMaxHp: number;
  playerHp: number;
  enemyHp: number;
  rounds: CombatRound[];
  combatRating: number;
  gearBonuses: ResolvedGearBonuses;
};

function levelOf(skills: Map<string, number>, id: string) {
  return progressionForXp(skills.get(id) ?? 0).level;
}

function rng(seed: string) {
  let state = createHash("sha256").update(seed).digest().readUInt32LE(0) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function withDefaults(bonuses?: CombatBonuses): ResolvedGearBonuses {
  return {
    strength: bonuses?.strength ?? 0,
    defense: bonuses?.defense ?? 0,
    dexterity: bonuses?.dexterity ?? 0,
    agility: bonuses?.agility ?? 0,
    vitality: bonuses?.vitality ?? 0,
    tactics: bonuses?.tactics ?? 0,
  };
}

export function combatRatingForSkills(
  skillXp: CombatSkillXp[],
  bonuses?: CombatBonuses,
): number {
  const skills = new Map(skillXp.map((entry) => [entry.skillId, entry.xp]));
  const gear = withDefaults(bonuses);
  const strength = levelOf(skills, "strength") + gear.strength;
  const defense = levelOf(skills, "defense") + gear.defense;
  const dexterity = levelOf(skills, "dexterity") + gear.dexterity;
  const agility = levelOf(skills, "agility") + gear.agility;
  const vitality = levelOf(skills, "vitality") + gear.vitality;
  const tactics = levelOf(skills, "tactics") + gear.tactics;
  return strength * 3 + defense * 3 + dexterity * 2 + agility * 2 + vitality * 3 + tactics * 2;
}

export function rollCombatEquipmentDrop(enemy: EnemyDefinition, seed: string): string | undefined {
  if (!enemy.equipmentDrop) return undefined;
  const random = rng(`${seed}:equipment-drop`);
  return random() < enemy.equipmentDrop.chance ? enemy.equipmentDrop.itemId : undefined;
}

export function resolveCombat(
  enemy: EnemyDefinition,
  skillXp: CombatSkillXp[],
  seed: string,
  bonuses?: CombatBonuses,
): CombatResolution {
  const skills = new Map(skillXp.map((entry) => [entry.skillId, entry.xp]));
  const gear = withDefaults(bonuses);
  const strength = levelOf(skills, "strength") + gear.strength;
  const defense = levelOf(skills, "defense") + gear.defense;
  const dexterity = levelOf(skills, "dexterity") + gear.dexterity;
  const agility = levelOf(skills, "agility") + gear.agility;
  const vitality = levelOf(skills, "vitality") + gear.vitality;
  const tactics = levelOf(skills, "tactics") + gear.tactics;

  const playerMaxHp = 28 + vitality * 6 + defense * 2;
  let playerHp = playerMaxHp;
  let enemyHp = enemy.maxHp;
  const random = rng(seed);
  const rounds: CombatRound[] = [];

  for (let round = 1; round <= 20 && playerHp > 0 && enemyHp > 0; round++) {
    const accuracy = Math.min(0.95, 0.66 + dexterity * 0.025 + tactics * 0.012);
    const hit = random() <= accuracy;
    const critChance = Math.min(0.28, 0.03 + dexterity * 0.01 + agility * 0.006);
    const crit = hit && random() <= critChance;
    const basePlayer = 3 + strength * 1.55 + dexterity * 0.45 + tactics * 0.35;
    const variance = 0.82 + random() * 0.36;
    const playerDamage = hit
      ? Math.max(1, Math.round((basePlayer * variance * (crit ? 1.65 : 1)) - enemy.defense * 0.55))
      : 0;

    enemyHp = Math.max(0, enemyHp - playerDamage);

    let enemyDamage = 0;
    if (enemyHp > 0) {
      const evadeChance = Math.min(0.32, 0.03 + agility * 0.012 + tactics * 0.004);
      const evaded = random() <= evadeChance;
      if (!evaded) {
        const mitigation = defense * 0.72 + tactics * 0.18;
        const enemyVariance = 0.85 + random() * 0.3;
        enemyDamage = Math.max(1, Math.round(enemy.attack * enemyVariance - mitigation));
        playerHp = Math.max(0, playerHp - enemyDamage);
      }
    }

    rounds.push({ round, playerDamage, enemyDamage, playerHpAfter: playerHp, enemyHpAfter: enemyHp });
  }

  return {
    result: enemyHp <= 0 ? "victory" : "defeat",
    enemyId: enemy.id,
    enemyName: enemy.name,
    playerMaxHp,
    enemyMaxHp: enemy.maxHp,
    playerHp,
    enemyHp,
    rounds,
    combatRating: combatRatingForSkills(skillXp, gear),
    gearBonuses: gear,
  };
}
