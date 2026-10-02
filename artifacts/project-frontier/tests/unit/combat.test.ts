import { describe, expect, it } from "vitest";
import { getEnemyDefinition } from "../../src/content/encounters";
import { combatBonusesForEquipment } from "../../src/content/items";
import {
  combatRatingForSkills,
  resolveCombat,
  rollCombatEquipmentDrop,
} from "../../src/game/combat";

describe("combat resolution", () => {
  const baseSkills = [
    { skillId: "strength", xp: 0 },
    { skillId: "defense", xp: 0 },
    { skillId: "dexterity", xp: 0 },
    { skillId: "agility", xp: 0 },
    { skillId: "vitality", xp: 0 },
    { skillId: "tactics", xp: 0 },
  ];

  it("is deterministic for the same server seed", () => {
    const enemy = getEnemyDefinition("ridge-wolf");
    expect(enemy).toBeDefined();
    if (!enemy) return;

    const first = resolveCombat(enemy, baseSkills, "player:request:wolf");
    const second = resolveCombat(enemy, baseSkills, "player:request:wolf");
    expect(second).toEqual(first);
  });

  it("applies equipped item bonuses to combat rating and health", () => {
    const enemy = getEnemyDefinition("ridge-wolf");
    expect(enemy).toBeDefined();
    if (!enemy) return;

    const none = resolveCombat(enemy, baseSkills, "gear-check");
    const gear = combatBonusesForEquipment(["field-axe", "work-vest", "scout-hood"]);
    const equipped = resolveCombat(enemy, baseSkills, "gear-check", gear);

    expect(combatRatingForSkills(baseSkills, gear)).toBeGreaterThan(combatRatingForSkills(baseSkills));
    expect(equipped.playerMaxHp).toBeGreaterThan(none.playerMaxHp);
    expect(equipped.gearBonuses).toEqual(gear);
  });

  it("keeps equipment drops deterministic and within configured loot", () => {
    const enemy = getEnemyDefinition("bandit-scout");
    expect(enemy?.equipmentDrop).toBeDefined();
    if (!enemy?.equipmentDrop) return;

    const first = rollCombatEquipmentDrop(enemy, "fixed-drop-seed");
    const second = rollCombatEquipmentDrop(enemy, "fixed-drop-seed");
    expect(second).toBe(first);
    expect([undefined, enemy.equipmentDrop.itemId]).toContain(first);
  });
});
