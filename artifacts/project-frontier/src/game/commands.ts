import { z } from "zod";

export const startActivityCommandSchema = z
  .object({
    definitionId: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
    durationId: z.enum(["1m", "5m", "15m", "1h", "4h", "8h"]).default("1m"),
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