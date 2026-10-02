export type SkillCategory = "combat" | "gathering" | "production";

export type SkillDefinition = {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
};

export const skillDefinitions = [
  { id: "strength", name: "Strength", category: "combat", description: "Raw physical power used by heavy attacks and strength-based equipment." },
  { id: "defense", name: "Defense", category: "combat", description: "Reduces incoming physical damage and improves defensive effectiveness." },
  { id: "dexterity", name: "Dexterity", category: "combat", description: "Precision, ranged control and fine weapon handling." },
  { id: "agility", name: "Agility", category: "combat", description: "Movement, initiative and evasive combat ability." },
  { id: "vitality", name: "Vitality", category: "combat", description: "Health, endurance and resistance to sustained damage." },
  { id: "tactics", name: "Tactics", category: "combat", description: "Combat planning, encounter efficiency and tactical bonuses." },

  { id: "mining", name: "Mining", category: "gathering", description: "Extract ore, stone and other mineral resources." },
  { id: "woodcutting", name: "Woodcutting", category: "gathering", description: "Harvest timber and increasingly valuable wood resources." },
  { id: "fishing", name: "Fishing", category: "gathering", description: "Catch fish and aquatic resources from regional waters." },
  { id: "hunting", name: "Hunting", category: "gathering", description: "Track wildlife for meat, hides and other materials." },
  { id: "herbalism", name: "Herbalism", category: "gathering", description: "Collect medicinal plants and alchemical ingredients." },
  { id: "foraging", name: "Foraging", category: "gathering", description: "Search the frontier for food, fibers and useful natural materials." },

  { id: "blacksmithing", name: "Blacksmithing", category: "production", description: "Forge metal weapons, armor and tools." },
  { id: "cooking", name: "Cooking", category: "production", description: "Prepare food that supports travel, work and combat." },
  { id: "alchemy", name: "Alchemy", category: "production", description: "Create potions, compounds and specialized consumables." },
  { id: "carpentry", name: "Carpentry", category: "production", description: "Turn timber into equipment, structures and property upgrades." },
  { id: "leatherworking", name: "Leatherworking", category: "production", description: "Craft hides and leather into useful equipment." },
  { id: "tailoring", name: "Tailoring", category: "production", description: "Craft cloth garments, utility gear and other textile items." },
] as const satisfies readonly SkillDefinition[];

export type SkillId = (typeof skillDefinitions)[number]["id"];

export function getSkillDefinition(id: string): SkillDefinition | undefined {
  return skillDefinitions.find((skill) => skill.id === id);
}
