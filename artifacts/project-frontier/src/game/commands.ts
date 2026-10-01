import { z } from "zod";

export const startActivityCommandSchema = z
  .object({
    definitionId: z.literal("gather-wood"),
    requestId: z.string().uuid(),
  })
  .strict();

export type StartActivityCommand = z.infer<typeof startActivityCommandSchema>;

export function calculateFinishTime(startedAt: Date, durationSeconds: number): Date {
  if (!Number.isFinite(startedAt.getTime())) {
    throw new Error("Activity start time must be a valid date.");
  }
  if (!Number.isInteger(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Activity duration must be a positive integer.");
  }
  return new Date(startedAt.getTime() + durationSeconds * 1000);
}