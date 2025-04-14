CREATE TABLE "trackertypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trackers" ADD COLUMN "trackertype_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "trackers" ADD CONSTRAINT "trackers_trackertype_id_trackertypes_id_fk" FOREIGN KEY ("trackertype_id") REFERENCES "public"."trackertypes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trackers" DROP COLUMN "type";