import { describe, expect, it } from "vitest";
import {
  activityDurationPresets,
  getGatheringDefinitions,
  rewardForDuration,
} from "../../src/content/gathering";
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

  it("uses a one-minute base rate and valid resource rewards", () => {
    for (const activity of getGatheringDefinitions()) {
      expect(activity.durationSeconds).toBe(60);
      expect(activity.reward.skillXp).toBe(8);
      expect(activity.reward.xp).toBe(8);
      expect(activity.reward.gold).toBe(12);
      expect(activity.reward.quantity).toBeGreaterThan(0);
      expect(getItemDefinition(activity.reward.itemId)?.kind).toBe("resource");
    }
  });

  it("supports server-owned work periods from one minute through eight hours", () => {
    expect(activityDurationPresets.map((preset) => preset.id)).toEqual([
      "1m", "5m", "15m", "1h", "4h", "8h",
    ]);
    expect(activityDurationPresets.at(-1)?.durationSeconds).toBe(28_800);

    const wood = getGatheringDefinitions().find((activity) => activity.id === "gather-wood");
    expect(wood).toBeDefined();
    if (!wood) return;
    expect(rewardForDuration(wood.reward, "5m")).toMatchObject({
      gold: 60,
      xp: 40,
      quantity: 15,
      skillId: "woodcutting",
      skillXp: 40,
    });
    expect(() => rewardForDuration(wood.reward, "24h")).toThrow("Unknown activity duration");
  });
});
