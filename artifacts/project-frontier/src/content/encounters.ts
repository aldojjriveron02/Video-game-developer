import type { ActivityDefinition } from "./gathering";

export type EnemyDefinition = {
  id: string;
  encounterId: string;
  name: string;
  description: string;
  maxHp: number;
  attack: number;
  defense: number;
  reward: ActivityDefinition["reward"];
};

const enemies: readonly EnemyDefinition[] = [
  {
    id: "ridge-wolf",
    encounterId: "fight-ridge-wolf",
    name: "Ridge Wolf",
    description: "A fast predator stalking the trails outside the station.",
    maxHp: 34,
    attack: 6,
    defense: 2,
    reward: { gold: 18, xp: 14, itemId: "hide", quantity: 2 },
  },
  {
    id: "ashback-boar",
    encounterId: "fight-ashback-boar",
    name: "Ashback Boar",
    description: "A territorial beast with heavy charges and thick hide.",
    maxHp: 52,
    attack: 9,
    defense: 5,
    reward: { gold: 28, xp: 22, itemId: "hide", quantity: 3 },
  },
  {
    id: "bandit-scout",
    encounterId: "fight-bandit-scout",
    name: "Bandit Scout",
    description: "An armed raider testing the frontier station's defenses.",
    maxHp: 68,
    attack: 12,
    defense: 7,
    reward: { gold: 42, xp: 32, itemId: "iron-ore", quantity: 3 },
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
