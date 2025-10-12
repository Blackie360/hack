CREATE TYPE rotation_status AS ENUM ('pending','active','paused','completed','rolled_back','failed');

CREATE TABLE IF NOT EXISTS "rotation_job" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "initiator_id" text NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
  "status" rotation_status NOT NULL DEFAULT 'pending',
  "required_approvals" text NOT NULL,
  "approvals_count" text NOT NULL DEFAULT '0',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "rotation_approval" (
  "id" text PRIMARY KEY,
  "job_id" text NOT NULL REFERENCES "rotation_job"("id") ON DELETE CASCADE,
  "member_id" text NOT NULL REFERENCES "member"("id") ON DELETE CASCADE,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "rotation_progress" (
  "id" text PRIMARY KEY,
  "job_id" text NOT NULL REFERENCES "rotation_job"("id") ON DELETE CASCADE,
  "processed_count" text NOT NULL DEFAULT '0',
  "total_count" text NOT NULL DEFAULT '0',
  "last_cursor" text,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "rotation_key_wrap" (
  "id" text PRIMARY KEY,
  "job_id" text NOT NULL REFERENCES "rotation_job"("id") ON DELETE CASCADE,
  "member_id" text NOT NULL REFERENCES "member"("id") ON DELETE CASCADE,
  "wrapped_key" text NOT NULL
);

