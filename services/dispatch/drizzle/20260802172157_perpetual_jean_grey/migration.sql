CREATE TABLE "offered" (
	"ride_id" uuid,
	"driver_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offered_pkey" PRIMARY KEY("ride_id","driver_id")
);
--> statement-breakpoint
ALTER TABLE "offered" ADD CONSTRAINT "offered_ride_id_rides_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "offered" ADD CONSTRAINT "offered_driver_id_drivers_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE;