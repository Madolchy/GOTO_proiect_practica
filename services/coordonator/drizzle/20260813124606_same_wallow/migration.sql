CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"ride_id" uuid,
	"status" varchar(20) DEFAULT 'idle' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "users_ride_idx" ON "users" ("ride_id");