-- VaultSync core tables (projects, environments, secrets, versions, org key wraps, recovery, audit)

CREATE TABLE IF NOT EXISTS "project" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "environment" (
  "id" text PRIMARY KEY,
  "project_id" text NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "secret" (
  "id" text PRIMARY KEY,
  "project_id" text NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "environment_id" text NOT NULL REFERENCES "environment"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "ciphertext" text NOT NULL,
  "nonce" text NOT NULL,
  "aad" text,
  "version" text NOT NULL,
  "expires_at" timestamp,
  "created_by" text NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "secret_version" (
  "id" text PRIMARY KEY,
  "secret_id" text NOT NULL REFERENCES "secret"("id") ON DELETE CASCADE,
  "version" text NOT NULL,
  "ciphertext" text NOT NULL,
  "nonce" text NOT NULL,
  "aad" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "org_key_wrap" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "member_id" text NOT NULL REFERENCES "member"("id") ON DELETE CASCADE,
  "wrapped_key" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "org_recovery" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "wrapped_key_by_kek" text NOT NULL,
  "params" text NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id" text PRIMARY KEY,
  "org_id" text NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
  "actor_id" text NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
  "action" text NOT NULL,
  "target_type" text NOT NULL,
  "target_id" text,
  "meta" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

