CREATE TABLE IF NOT EXISTS "player_skills" (
  "player_id" uuid NOT NULL,
  "skill_id" varchar(32) NOT NULL,
  "xp" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "player_skills_player_id_skill_id_pk" PRIMARY KEY("player_id","skill_id"),
  CONSTRAINT "player_skills_xp_nonnegative" CHECK ("player_skills"."xp" >= 0)
);
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'player_skills_player_id_players_id_fk'
  ) THEN
    ALTER TABLE "player_skills"
      ADD CONSTRAINT "player_skills_player_id_players_id_fk"
      FOREIGN KEY ("player_id") REFERENCES "players"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
INSERT INTO "player_skills" ("player_id", "skill_id", "xp", "updated_at")
SELECT
  a."player_id",
  'woodcutting',
  COALESCE(SUM((l."reward"->>'xp')::integer), 0)::integer,
  clock_timestamp()
FROM "reward_ledger" l
JOIN "activities" a ON a."id" = l."activity_id"
WHERE l."kind" = 'activity_reward'
  AND a."definition_id" = 'gather-wood'
GROUP BY a."player_id"
ON CONFLICT ("player_id", "skill_id")
DO UPDATE SET
  "xp" = GREATEST("player_skills"."xp", EXCLUDED."xp"),
  "updated_at" = EXCLUDED."updated_at";
