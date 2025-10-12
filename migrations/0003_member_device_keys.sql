CREATE TABLE IF NOT EXISTS "member_device_key" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "member_id" text NOT NULL REFERENCES "member"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "public_key_b64" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

