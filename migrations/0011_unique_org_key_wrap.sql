-- Prevent duplicate org key wraps per member
-- Each member should have only ONE wrapped org key per org
CREATE UNIQUE INDEX IF NOT EXISTS "org_key_wrap_member_org_unique" 
ON "org_key_wrap" ("member_id", "org_id");

