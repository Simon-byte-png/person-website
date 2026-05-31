CREATE TYPE "like_target_type" AS ENUM ('post', 'comment');

CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "clerk_user_id" text NOT NULL UNIQUE,
  "email" text NOT NULL,
  "username" text NOT NULL,
  "image_url" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "posts" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "excerpt" text NOT NULL,
  "content" text NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "author_id" text NOT NULL REFERENCES "users"("id") ON DELETE restrict,
  "published" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "post_id" text NOT NULL REFERENCES "posts"("id") ON DELETE cascade,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "parent_id" text,
  "content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "likes" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "target_type" "like_target_type" NOT NULL,
  "target_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "views" (
  "id" text PRIMARY KEY NOT NULL,
  "post_id" text NOT NULL REFERENCES "posts"("id") ON DELETE cascade,
  "viewer_key" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" ("slug");
CREATE INDEX "posts_published_idx" ON "posts" ("published");
CREATE INDEX "comments_post_id_idx" ON "comments" ("post_id");
CREATE INDEX "comments_parent_id_idx" ON "comments" ("parent_id");
CREATE UNIQUE INDEX "likes_user_target_unique" ON "likes" ("user_id", "target_type", "target_id");
CREATE INDEX "likes_target_idx" ON "likes" ("target_type", "target_id");
CREATE INDEX "views_post_id_idx" ON "views" ("post_id");
