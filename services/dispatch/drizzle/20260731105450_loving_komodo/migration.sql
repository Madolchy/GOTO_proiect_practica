ALTER TABLE "rides" ADD COLUMN "assigned_driverId" uuid;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "offer_expire_at" timestamp with time zone;