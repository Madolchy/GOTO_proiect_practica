CREATE EXTENSION IF NOT EXISTS pgcrypto;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "drivers" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
