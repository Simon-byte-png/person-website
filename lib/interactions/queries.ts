import { and, count, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { getDb, hasDatabase } from "@/lib/db";
import { comments, likes, posts, users } from "@/lib/db/schema";
import {
  buildCommentTree,
  normalizeLikeTarget,
  validateCommentBody,
  type CommentTreeItem,
  type LikeTargetType,
} from "@/lib/interactions/model";

export type InteractionAuthor = {
  id: string;
  username: string;
  imageUrl: string | null;
};

export type InteractionComment = {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: InteractionAuthor;
  likeCount: number;
  likedByViewer: boolean;
};

export type PostInteractionState = {
  backendConfigured: boolean;
  viewerUserId: string | null;
  postLikeCount: number;
  postLikedByViewer: boolean;
  comments: Array<CommentTreeItem<InteractionComment>>;
};

export const emptyPostInteractionState: PostInteractionState = {
  backendConfigured: false,
  viewerUserId: null,
  postLikeCount: 0,
  postLikedByViewer: false,
  comments: [],
};

async function getViewerUserId() {
  const userResult = await requireUser();
  return userResult.ok ? userResult.user.id : null;
}

export async function getTargetLikeState(targetType: LikeTargetType, targetId: string, viewerUserId: string | null) {
  if (!hasDatabase()) {
    return { likeCount: 0, likedByViewer: false };
  }

  const db = getDb();
  const [likeTotal] = await db
    .select({ value: count() })
    .from(likes)
    .where(and(eq(likes.targetType, targetType), eq(likes.targetId, targetId)));

  const likedByViewer = viewerUserId
    ? (
        await db
          .select({ id: likes.id })
          .from(likes)
          .where(and(eq(likes.targetType, targetType), eq(likes.targetId, targetId), eq(likes.userId, viewerUserId)))
          .limit(1)
      ).length > 0
    : false;

  return {
    likeCount: Number(likeTotal?.value ?? 0),
    likedByViewer,
  };
}

export async function getPostInteractionState(postId: string): Promise<PostInteractionState> {
  if (!hasDatabase()) {
    return emptyPostInteractionState;
  }

  const viewerUserId = await getViewerUserId();
  const postLikeState = await getTargetLikeState("post", postId, viewerUserId);

  const rows = await getDb()
    .select({
      id: comments.id,
      postId: comments.postId,
      parentId: comments.parentId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      authorId: users.id,
      authorUsername: users.username,
      authorImageUrl: users.imageUrl,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt);

  const flatComments = await Promise.all(
    rows.map(async (row) => {
      const likeState = await getTargetLikeState("comment", row.id, viewerUserId);
      return {
        id: row.id,
        postId: row.postId,
        parentId: row.parentId,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        author: {
          id: row.authorId,
          username: row.authorUsername,
          imageUrl: row.authorImageUrl,
        },
        likeCount: likeState.likeCount,
        likedByViewer: likeState.likedByViewer,
      };
    }),
  );

  return {
    backendConfigured: true,
    viewerUserId,
    postLikeCount: postLikeState.likeCount,
    postLikedByViewer: postLikeState.likedByViewer,
    comments: buildCommentTree(flatComments),
  };
}

export async function toggleTargetLike(targetType: string, targetId: string, postIdForRefresh: string) {
  const target = normalizeLikeTarget(targetType, targetId);
  if (!target.ok) {
    return target;
  }

  const userResult = await requireUser();
  if (!userResult.ok) {
    return { ok: false as const, error: "请先登录后再点赞" };
  }

  const db = getDb();
  const [existing] = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(
        eq(likes.targetType, target.targetType),
        eq(likes.targetId, target.targetId),
        eq(likes.userId, userResult.user.id),
      ),
    )
    .limit(1);

  if (existing) {
    await db.delete(likes).where(eq(likes.id, existing.id));
  } else {
    await db.insert(likes).values({
      id: crypto.randomUUID(),
      userId: userResult.user.id,
      targetType: target.targetType,
      targetId: target.targetId,
      createdAt: new Date(),
    });
  }

  return { ok: true as const, state: await getPostInteractionState(postIdForRefresh) };
}

export async function createPostComment(input: { postId: string; content: string; parentId?: string | null }) {
  const validation = validateCommentBody(input.content);
  if (!validation.ok) {
    return { ok: false as const, error: validation.error };
  }

  const userResult = await requireUser();
  if (!userResult.ok) {
    return { ok: false as const, error: "请先登录后再评论" };
  }

  const db = getDb();
  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, input.postId)).limit(1);
  if (!post) {
    return { ok: false as const, error: "文章不存在" };
  }

  let parentId = input.parentId ?? null;
  if (parentId) {
    const [parent] = await db.select().from(comments).where(eq(comments.id, parentId)).limit(1);
    if (!parent || parent.postId !== input.postId) {
      return { ok: false as const, error: "回复的评论不存在" };
    }
    parentId = parent.parentId ?? parent.id;
  }

  await db.insert(comments).values({
    id: crypto.randomUUID(),
    postId: input.postId,
    userId: userResult.user.id,
    parentId,
    content: validation.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { ok: true as const, state: await getPostInteractionState(input.postId) };
}

export async function getViewerActivity() {
  const userResult = await requireUser();
  if (!userResult.ok) {
    return null;
  }

  const db = getDb();
  const [viewerComments, viewerLikes, [commentTotal], [likeTotal]] = await Promise.all([
    db
      .select({
        id: comments.id,
        postId: comments.postId,
        content: comments.content,
        createdAt: comments.createdAt,
        postSlug: posts.slug,
        postTitle: posts.title,
      })
      .from(comments)
      .innerJoin(posts, eq(comments.postId, posts.id))
      .where(eq(comments.userId, userResult.user.id))
      .orderBy(desc(comments.createdAt))
      .limit(5),
    db
      .select({
        id: likes.id,
        targetId: likes.targetId,
        createdAt: likes.createdAt,
        postSlug: posts.slug,
        postTitle: posts.title,
      })
      .from(likes)
      .innerJoin(posts, eq(likes.targetId, posts.id))
      .where(and(eq(likes.userId, userResult.user.id), eq(likes.targetType, "post")))
      .orderBy(desc(likes.createdAt))
      .limit(5),
    db.select({ value: count() }).from(comments).where(eq(comments.userId, userResult.user.id)),
    db.select({ value: count() }).from(likes).where(eq(likes.userId, userResult.user.id)),
  ]);

  return {
    user: userResult.user,
    commentCount: Number(commentTotal?.value ?? 0),
    likeCount: Number(likeTotal?.value ?? 0),
    comments: viewerComments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
    likes: viewerLikes.map((like) => ({
      ...like,
      createdAt: like.createdAt.toISOString(),
    })),
  };
}
