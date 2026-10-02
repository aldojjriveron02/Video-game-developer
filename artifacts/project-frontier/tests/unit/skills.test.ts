import { describe, expect, it } from "vitest";
import { getSkillDefinition, skillDefinitions } from "../../src/content/skills";
import { progressionForXp } from "../../src/game/progression";

describe("skill definitions", () => {
  it("defines the complete core skill set exactly once", () => {
    expect(skillDefinitions).toHaveLength(18);
    expect(new Set(skillDefinitions.map((skill) => skill.id)).size).toBe(18);
    expect(skillDefinitions.filter((skill) => skill.category === "combat")).toHaveLength(6);
    expect(skillDefinitions.filter((skill) => skill.category === "gathering")).toHaveLength(6);
    expect(skillDefinitions.filter((skill) => skill.category === "production")).toHaveLength(6);
  });

  it("includes woodcutting and starts untrained skills at level one", () => {
    expect(getSkillDefinition("woodcutting")).toMatchObject({
      name: "Woodcutting",
      category: "gathering",
    });
    expect(progressionForXp(0).level).toBe(1);
  });
});
