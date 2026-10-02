ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_status_valid";--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_status_valid" CHECK ("activities"."status" IN ('active', 'claimed', 'cancelled'));--> statement-breakpoint
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_terminal_timestamp_consistent";--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_terminal_timestamp_consistent" CHECK (
  ("activities"."status" = 'active' AND "activities"."claimed_at" IS NULL AND "activities"."cancelled_at" IS NULL)
  OR ("activities"."status" = 'claimed' AND "activities"."claimed_at" IS NOT NULL AND "activities"."cancelled_at" IS NULL)
  OR ("activities"."status" = 'cancelled' AND "activities"."claimed_at" IS NULL AND "activities"."cancelled_at" IS NOT NULL)
);
