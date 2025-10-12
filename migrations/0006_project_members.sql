CREATE TABLE IF NOT EXISTS "project_member" (
  "id" text PRIMARY KEY,
  "project_id" text NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "member_id" text NOT NULL REFERENCES "member"("id") ON DELETE CASCADE,
  "role" "role" NOT NULL DEFAULT 'member',
  "created_at" timestamp NOT NULL DEFAULT now()
);

