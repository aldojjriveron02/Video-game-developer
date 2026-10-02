import { describe, expect, it } from "vitest";
import { calculateFinishTime, startActivityCommandSchema } from "../../src/game/commands";

describe("activity commands", () => {
  it("accepts a valid activity identifier and request UUID without trusting client timing", () => {
    for (const definitionId of ["gather-wood", "mine-stone", "fish-river"]) {
      const parsed = startActivityCommandSchema.safeParse({
        definitionId,
        requestId: "d1d49f18-7e74-42e0-a5ce-c6025a1eb0c8",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) expect(parsed.data.durationId).toBe("1m");
    }
    expect(
      startActivityCommandSchema.safeParse({
        definitionId: "gather-wood",
        requestId: "d1d49f18-7e74-42e0-a5ce-c6025a1eb0c8",
        durationSeconds: 1,
      }).success,
    ).toBe(false);
    expect(
      startActivityCommandSchema.safeParse({
        definitionId: "gather-wood",
        requestId: "not-a-uuid",
      }).success,
    ).toBe(false);
    expect(
      startActivityCommandSchema.safeParse({
        definitionId: "gather-wood",
        durationId: "8h",
        requestId: "d1d49f18-7e74-42e0-a5ce-c6025a1eb0c8",
      }).success,
    ).toBe(true);
    expect(
      startActivityCommandSchema.safeParse({
        definitionId: "gather-wood",
        durationId: "24h",
        requestId: "d1d49f18-7e74-42e0-a5ce-c6025a1eb0c8",
      }).success,
    ).toBe(false);
    expect(
      startActivityCommandSchema.safeParse({
        definitionId: "../../something",
        requestId: "d1d49f18-7e74-42e0-a5ce-c6025a1eb0c8",
      }).success,
    ).toBe(false);
  });

  it("calculates a finish instant without mutating the start instant", () => {
    const startedAt = new Date("2025-01-01T00:00:00.000Z");
    const finishesAt = calculateFinishTime(startedAt, 30);
    expect(finishesAt.toISOString()).toBe("2025-01-01T00:00:30.000Z");
    expect(startedAt.toISOString()).toBe("2025-01-01T00:00:00.000Z");
  });
});