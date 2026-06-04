import { and, count, desc, eq, or } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db";
import { comments, likes, posts, users, views } from "@/lib/db/schema";
import { calculateTrendingScore, validatePostInput, type PostInput } from "@/lib/blog/model";
import { extractToc, getPostBySlug as getStaticPostBySlug, getReadingTime, renderMarkdown } from "@/lib/posts";

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  url: string;
  source: "database";
};

export type BlogPostDetail = BlogListItem & {
  html: string;
  toc: ReturnType<typeof extractToc>;
};

export type LegacyBlogPostDetail = Awaited<ReturnType<typeof getStaticPostBySlug>> & {
  source: "legacy";
};

export type PostStats = {
  views: number;
  likes: number;
  comments: number;
  score: number;
};

function rowToBlogListItem(row: typeof posts.$inferSelect): BlogListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags,
    published: row.published,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    readingTime: getReadingTime(row.content),
    url: `/blog/${row.slug}`,
    source: "database",
  };
}

export async function getPublishedPosts() {
  if (!hasDatabase()) {
    return [] as BlogListItem[];
  }

  const db = getDb();
  const rows = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  return rows.map(rowToBlogListItem);
}

export async function getDatabasePostBySlug(slug: string) {
  if (!hasDatabase()) {
    return null;
  }

  const db = getDb();
  const [row] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1);
  if (!row) {
    return null;
  }

  const item = rowToBlogListItem(row);
  return {
    ...item,
    html: await renderMarkdown(row.content),
    toc: extractToc(row.content),
  } satisfies BlogPostDetail;
}

export async function getBlogPostBySlug(slug: string) {
  const databasePost = await getDatabasePostBySlug(slug);
  if (databasePost) {
    return databasePost;
  }

  const legacyPost = await getStaticPostBySlug(slug);
  return legacyPost ? ({ ...legacyPost, source: "legacy" } as LegacyBlogPostDetail) : null;
}

export async function getPostBySlugForAdmin(slug: string) {
  if (!hasDatabase()) {
    return null;
  }

  const db = getDb();
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return row ?? null;
}

export async function createDatabasePost(input: PostInput, authorId: string) {
  const validation = validatePostInput(input);
  if (!validation.ok) {
    return validation;
  }

  if (!hasDatabase()) {
    return { ok: false as const, error: "DATABASE_URL is not configured" };
  }

  const existing = await getPostBySlugForAdmin(validation.value.slug);
  if (existing) {
    return { ok: false as const, error: "slug 已存在" };
  }

  const now = new Date();
  const db = getDb();
  const [post] = await db
    .insert(posts)
    .values({
      id: crypto.randomUUID(),
      ...validation.value,
      authorId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return { ok: true as const, post: rowToBlogListItem(post) };
}

export async function ensureStaticInteractionPost(input: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}) {
  if (!hasDatabase()) {
    return null;
  }

  const now = new Date();
  const db = getDb();
  const systemUser = {
    id: "system-static-content",
    clerkUserId: "system:static-content",
    email: "system@local.invalid",
    username: "Samuel",
    imageUrl: null,
    updatedAt: now,
  };

  await db
    .insert(users)
    .values({
      ...systemUser,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: systemUser,
    });

  const postValues = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    tags: input.tags,
    authorId: systemUser.id,
    published: false,
    updatedAt: now,
  };

  const findExistingPost = async () => {
    const [existing] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(or(eq(posts.id, input.id), eq(posts.slug, input.slug)))
      .limit(1);
    return existing ?? null;
  };

  const existing = await findExistingPost();
  if (existing) {
    await db.update(posts).set(postValues).where(eq(posts.id, existing.id));
    return existing.id;
  }

  try {
    const [post] = await db
      .insert(posts)
      .values({
        id: input.id,
        ...postValues,
        createdAt: now,
      })
      .returning({ id: posts.id });

    return post?.id ?? input.id;
  } catch (error) {
    const racedPost = await findExistingPost();
    if (racedPost) {
      await db.update(posts).set(postValues).where(eq(posts.id, racedPost.id));
      return racedPost.id;
    }
    throw error;
  }
}

export async function getPostStats(postId: string): Promise<PostStats> {
  if (!hasDatabase()) {
    return { views: 0, likes: 0, comments: 0, score: 0 };
  }

  const db = getDb();
  const [[viewTotal], [likeTotal], [commentTotal]] = await Promise.all([
    db.select({ value: count() }).from(views).where(eq(views.postId, postId)),
    db.select({ value: count() }).from(likes).where(and(eq(likes.targetType, "post"), eq(likes.targetId, postId))),
    db.select({ value: count() }).from(comments).where(eq(comments.postId, postId)),
  ]);

  const stats = {
    views: Number(viewTotal?.value ?? 0),
    likes: Number(likeTotal?.value ?? 0),
    comments: Number(commentTotal?.value ?? 0),
  };

  return {
    ...stats,
    score: calculateTrendingScore(stats),
  };
}

export async function getTrendingPosts(limit = 5) {
  const publishedPosts = await getPublishedPosts();
  const postsWithStats = await Promise.all(
    publishedPosts.map(async (post) => ({
      post,
      stats: await getPostStats(post.id),
    })),
  );

  return postsWithStats.sort((a, b) => b.stats.score - a.stats.score).slice(0, limit);
}

export async function recordPostView(postId: string, viewerKey: string) {
  if (!hasDatabase()) {
    return;
  }

  // V1 intentionally records each visit. DEPLOYMENT.md documents that anti-abuse is weak in this version.
  await getDb().insert(views).values({
    id: crypto.randomUUID(),
    postId,
    viewerKey,
    createdAt: new Date(),
  });
}
