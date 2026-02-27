ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "property_type" text NOT NULL DEFAULT 'hotel';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "amenities" text[] NOT NULL DEFAULT '{}';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "room_count" integer NOT NULL DEFAULT 1;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "available_rooms" integer NOT NULL DEFAULT 1;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "check_in_time" text NOT NULL DEFAULT '12:00';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "check_out_time" text NOT NULL DEFAULT '11:00';
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "contact_phone" text;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "contact_email" text;
