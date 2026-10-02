import { describe, expect, it } from "vitest";
import { getGatheringDefinitions } from "../../src/content/gathering";
import { getItemDefinition } from "../../src/content/items";

describe("gathering activity definitions", () => {
  it("provides one starter activity for each gathering skill", () => {
    const definitions = getGatheringDefinitions();
    expect(definitions).toHaveLength(6);
    expect(new Set(definitions.map((activity) => activity.id)).size).toBe(6);
    expect(new Set(definitions.map((activity) => activity.reward.skillId))).toEqual(
      new Set(["mining", "woodcutting", "fishing", "hunting", "herbalism", "foraging"]),
    );
  });

  it("uses server-owned positive timing and valid resource rewards", () => {
    for (const activity of getGatheringDefinitions()) {
      expect(activity.durationSeconds).toBe(30);
      expect(activity.reward.skillXp).toBe(8);
      expect(activity.reward.xp).toBe(8);
      expect(activity.reward.gold).toBe(12);
      expect(activity.reward.quantity).toBeGreaterThan(0);
      expect(getItemDefinition(activity.reward.itemId)?.kind).toBe("resource");
    }
  });
});
