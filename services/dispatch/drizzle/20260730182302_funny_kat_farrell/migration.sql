CREATE TABLE "rides" (
	"id" uuid PRIMARY KEY,
	"userId" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"origin_lat" double precision NOT NULL,
	"origin_lng" double precision NOT NULL,
	"destination_lat" double precision NOT NULL,
	"destination_lng" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "drivers";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "email";