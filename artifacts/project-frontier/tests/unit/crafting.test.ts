import { describe, expect, it } from "vitest";
import { getCraftingDefinitions } from "../../src/content/crafting";
import { activityDurationPresets, inputsForDuration, rewardForDuration } from "../../src/content/gathering";

describe("crafting definitions", () => {
  it("provides starter recipes for all six production skills", () => {
    const recipes = getCraftingDefinitions();
    expect(recipes).toHaveLength(6);
    expect(new Set(recipes.map((recipe) => recipe.reward.skillId))).toEqual(
      new Set(["blacksmithing", "cooking", "alchemy", "carpentry", "leatherworking", "tailoring"]),
    );
    expect(recipes.every((recipe) => recipe.inputs.length > 0)).toBe(true);
  });

  it("scales recipe inputs and outputs with the selected idle duration", () => {
    const recipe = getCraftingDefinitions().find((entry) => entry.id === "craft-lumber");
    expect(recipe).toBeDefined();
    if (!recipe) return;

    expect(inputsForDuration(recipe.inputs, "5m")).toEqual([
      { itemId: "wood", quantity: 15 },
    ]);
    expect(rewardForDuration(recipe.reward, "5m")).toMatchObject({
      itemId: "lumber",
      quantity: 5,
      skillId: "carpentry",
      skillXp: 40,
      xp: 30,
    });
    expect(activityDurationPresets.at(-1)?.id).toBe("8h");
  });
});
