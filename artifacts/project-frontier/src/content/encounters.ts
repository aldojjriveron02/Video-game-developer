import type { ActivityDefinition } from "./gathering";

export type EnemyDefinition = {
  id: string;
  encounterId: string;
  name: string;
  description: string;
  regionId: string;
  regionName: string;
  requiredCombatRating: number;
  maxHp: number;
  attack: number;
  defense: number;
  reward: ActivityDefinition["reward"];
  equipmentDrop?: { itemId: string; chance: number };
};

const enemies: readonly EnemyDefinition[] = [
  {
    id: "ridge-wolf",
    encounterId: "fight-ridge-wolf",
    name: "Ridge Wolf",
    description: "A fast predator stalking the trails outside the station.",
    regionId: "pine-verge",
    regionName: "Pine Verge",
    requiredCombatRating: 0,
    maxHp: 34,
    attack: 6,
    defense: 2,
    reward: { gold: 18, xp: 14, itemId: "hide", quantity: 2 },
    equipmentDrop: { itemId: "wolf-fang-knife", chance: 0.28 },
  },
  {
    id: "ashback-boar",
    encounterId: "fight-ashback-boar",
    name: "Ashback Boar",
    description: "A territorial beast with heavy charges and thick hide.",
    regionId: "pine-verge",
    regionName: "Pine Verge",
    requiredCombatRating: 20,
    maxHp: 52,
    attack: 9,
    defense: 5,
    reward: { gold: 28, xp: 22, itemId: "hide", quantity: 3 },
    equipmentDrop: { itemId: "boar-hide-coat", chance: 0.24 },
  },
  {
    id: "bandit-scout",
    encounterId: "fight-bandit-scout",
    name: "Bandit Scout",
    description: "An armed raider testing the frontier station's defenses.",
    regionId: "rust-trail",
    regionName: "Rust Trail",
    requiredCombatRating: 30,
    maxHp: 68,
    attack: 12,
    defense: 7,
    reward: { gold: 42, xp: 32, itemId: "iron-ore", quantity: 3 },
    equipmentDrop: { itemId: "scout-hood", chance: 0.18 },
  },
  {
    id: "bandit-enforcer",
    encounterId: "fight-bandit-enforcer",
    name: "Bandit Enforcer",
    description: "A veteran raider carrying heavier weapons along the Rust Trail.",
    regionId: "rust-trail",
    regionName: "Rust Trail",
    requiredCombatRating: 42,
    maxHp: 88,
    attack: 16,
    defense: 9,
    reward: { gold: 58, xp: 44, itemId: "iron-ingot", quantity: 2 },
    equipmentDrop: { itemId: "bandit-saber", chance: 0.14 },
  },
  {
    id: "quarry-brute",
    encounterId: "fight-quarry-brute",
    name: "Quarry Brute",
    description: "A massive scavenger occupying the abandoned excavation works.",
    regionId: "old-quarry",
    regionName: "Old Quarry",
    requiredCombatRating: 58,
    maxHp: 116,
    attack: 20,
    defense: 12,
    reward: { gold: 76, xp: 58, itemId: "stone", quantity: 8 },
    equipmentDrop: { itemId: "quarry-helm", chance: 0.16 },
  },
  {
    id: "frontier-warden",
    encounterId: "fight-frontier-warden",
    name: "Fallen Warden",
    description: "A heavily armed survivor guarding the ruins of an abandoned outpost.",
    regionId: "ruined-outpost",
    regionName: "Ruined Outpost",
    requiredCombatRating: 78,
    maxHp: 148,
    attack: 25,
    defense: 15,
    reward: { gold: 110, xp: 82, itemId: "iron-ingot", quantity: 5 },
    equipmentDrop: { itemId: "warden-coat", chance: 0.10 },
  },
] as const;

const encounterDefinitions = new Map(
  enemies.map((enemy) => [
    enemy.encounterId,
    {
      id: enemy.encounterId,
      name: `Fight ${enemy.name}`,
      description: enemy.description,
      durationSeconds: 60,
      inputs: [],
      reward: enemy.reward,
      version: 1,
    } satisfies ActivityDefinition,
  ] as const),
);

export function getEnemyDefinition(id: string): EnemyDefinition | undefined {
  return enemies.find((enemy) => enemy.id === id);
}

export function getEnemyForEncounter(encounterId: string): EnemyDefinition | undefined {
  return enemies.find((enemy) => enemy.encounterId === encounterId);
}

export function getEncounterActivityDefinition(id: string): ActivityDefinition | undefined {
  return encounterDefinitions.get(id);
}

export function getEnemyDefinitions(): readonly EnemyDefinition[] {
  return enemies;
}
