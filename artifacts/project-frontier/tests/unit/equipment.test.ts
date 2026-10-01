import { describe, expect, it } from "vitest";
import { equipmentSlotSchema, parseEquipCommand, parseEquipmentSlot } from "../../src/game/equipment";
import { getItemDefinition, STARTER_EQUIPMENT } from "../../src/content/items";

describe("equipment commands and item definitions", () => {
  it("accepts only the supported slots and owned instance command shape", () => {
    for (const slot of ["hand", "body", "head"]) expect(parseEquipmentSlot(slot)).toBe(slot);
    expect(parseEquipCommand({ instanceId: "f4e05335-839d-41ed-aef1-7e366281e0db" })).toEqual({
      instanceId: "f4e05335-839d-41ed-aef1-7e366281e0db",
    });
  });
  it.each(["feet", "", null, "hand'; DROP TABLE players;"])("rejects invalid slot %s", (slot) => {
    expect(() => parseEquipmentSlot(slot)).toThrow("equipment slot is invalid");
  });
  it.each([
    {}, { instanceId: "wood" }, { instanceId: "invalid" },
    { instanceId: "f4e05335-839d-41ed-aef1-7e366281e0db", playerId: "someone-else" },
  ])("rejects malformed or identity-forging equip commands", (input) => {
    expect(() => parseEquipCommand(input)).toThrow("valid equipment instance");
  });
  it("defines separate resources and compatible starter gear", () => {
    expect(getItemDefinition("wood")?.kind).toBe("resource");
    expect(new Set(STARTER_EQUIPMENT).size).toBe(2);
    for (const id of STARTER_EQUIPMENT) {
      const definition = getItemDefinition(id);
      expect(definition?.kind).toBe("equipment");
      if (definition?.kind === "equipment") expect(equipmentSlotSchema.safeParse(definition.slot).success).toBe(true);
    }
    expect(getItemDefinition("invented")).toBeUndefined();
  });
});