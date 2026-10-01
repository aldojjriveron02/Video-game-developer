CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"definition_id" text NOT NULL,
	"status" varchar(16) NOT NULL,
	"request_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"finishes_at" timestamp with time zone NOT NULL,
	"claimed_at" timestamp with time zone,
	"reward" jsonb NOT NULL,
	CONSTRAINT "activities_status_valid" CHECK ("activities"."status" IN ('active', 'claimed')),
	CONSTRAINT "activities_finishes_after_start" CHECK ("activities"."finishes_at" > "activities"."started_at")
);
--> statement-breakpoint
CREATE TABLE "clerk_identities" (
	"clerk_user_id" text PRIMARY KEY NOT NULL,
	"player_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"player_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "inventory_player_id_item_id_pk" PRIMARY KEY("player_id","item_id"),
	CONSTRAINT "inventory_quantity_positive" CHECK ("inventory"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"gold" integer DEFAULT 0 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_gold_nonnegative" CHECK ("players"."gold" >= 0),
	CONSTRAINT "players_xp_nonnegative" CHECK ("players"."xp" >= 0)
);
--> statement-breakpoint
CREATE TABLE "reward_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"kind" varchar(32) NOT NULL,
	"reward" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clerk_identities" ADD CONSTRAINT "clerk_identities_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_ledger" ADD CONSTRAINT "reward_ledger_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_ledger" ADD CONSTRAINT "reward_ledger_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "activities_player_request_unique" ON "activities" USING btree ("player_id","request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "activities_player_id_id_unique" ON "activities" USING btree ("player_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "activities_one_active_per_player" ON "activities" USING btree ("player_id") WHERE "activities"."status" = 'active';--> statement-breakpoint
CREATE INDEX "activities_player_started_idx" ON "activities" USING btree ("player_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "clerk_identities_player_id_unique" ON "clerk_identities" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reward_ledger_activity_kind_unique" ON "reward_ledger" USING btree ("activity_id","kind");--> statement-breakpoint
CREATE INDEX "reward_ledger_player_created_idx" ON "reward_ledger" USING btree ("player_id","created_at");