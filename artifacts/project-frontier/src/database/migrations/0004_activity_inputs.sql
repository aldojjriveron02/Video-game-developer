ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "inputs" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "activities_inputs_array";--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_inputs_array" CHECK (jsonb_typeof("activities"."inputs") = 'array');
