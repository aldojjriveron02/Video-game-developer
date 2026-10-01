CREATE TABLE "equipment_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"grant_key" text,
	"equipped_slot" varchar(16),
	"acquired_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_slot_valid" CHECK ("equipment_instances"."equipped_slot" IS NULL OR "equipment_instances"."equipped_slot" IN ('hand', 'body', 'head'))
);
--> statement-breakpoint
ALTER TABLE "equipment_instances" ADD CONSTRAINT "equipment_instances_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_starter_grant_unique" ON "equipment_instances" USING btree ("player_id","grant_key");--> statement-breakpoint
CREATE UNIQUE INDEX "equipment_one_item_per_slot" ON "equipment_instances" USING btree ("player_id","equipped_slot") WHERE "equipment_instances"."equipped_slot" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "equipment_player_acquired_idx" ON "equipment_instances" USING btree ("player_id","acquired_at");