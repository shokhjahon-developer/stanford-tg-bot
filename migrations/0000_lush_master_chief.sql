CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar,
	"chat_id" varchar,
	"phone_number" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"group_number" integer,
	"score" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "students_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
CREATE INDEX "students_chat_id_index" ON "students" USING btree ("chat_id");