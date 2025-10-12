-- Add unique constraint to prevent duplicate secret names within the same project + environment
CREATE UNIQUE INDEX IF NOT EXISTS "secret_project_env_name_unique" ON "secret" ("project_id", "environment_id", "name");

