-- Enable pgcrypto extension if not exists (required for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add defaults to tables with TEXT id
ALTER TABLE choices_responses ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE contact_messages ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "Owner" ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "Property" ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "PropertyDocument" ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE lead_events ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
ALTER TABLE "User" ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
