export type LikeTargetType = "post" | "comment";

export type FlatComment = {
  id: string;
  parentId: string | null;
  createdAt: string;
};

export type CommentTreeItem<T extends FlatComment = FlatComment> = T & {
  parentId: string | null;
  replies: Array<CommentTreeItem<T>>;
};

export type LikeState = {
  likedByViewer: boolean;
  likeCount: number;
};

export function validateCommentBody(value: string) {
  const body = value.trim();

  if (!body) {
    return { ok: false as const, error: "评论不能为空" };
  }

  if (body.length > 1000) {
    return { ok: false as const, error: "评论不能超过 1000 字" };
  }

  return { ok: true as const, body };
}

export function normalizeLikeTarget(targetType: string, targetId: string) {
  const normalizedTargetId = targetId.trim();
  if (!normalizedTargetId) {
    return { ok: false as const, error: "点赞对象不存在" };
  }

  if (targetType !== "post" && targetType !== "comment") {
    return { ok: false as const, error: "不支持的点赞对象" };
  }

  return { ok: true as const, targetType: targetType as LikeTargetType, targetId: normalizedTargetId };
}

export function getNextLikeState(state: LikeState): LikeState {
  if (state.likedByViewer) {
    return {
      likedByViewer: false,
      likeCount: Math.max(0, state.likeCount - 1),
    };
  }

  return {
    likedByViewer: true,
    likeCount: state.likeCount + 1,
  };
}

export function buildCommentTree<T extends FlatComment>(comments: T[]): Array<CommentTreeItem<T>> {
  const sorted = [...comments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const byId = new Map<string, CommentTreeItem<T>>();
  const roots: Array<CommentTreeItem<T>> = [];

  for (const comment of sorted) {
    byId.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of sorted) {
    const item = byId.get(comment.id);
    if (!item) {
      continue;
    }

    const parent = comment.parentId ? byId.get(comment.parentId) : null;
    if (!parent) {
      roots.push(item);
      continue;
    }

    const rootParent = parent.parentId ? byId.get(parent.parentId) ?? parent : parent;
    item.parentId = rootParent.id;
    rootParent.replies.push(item);
  }

  return roots;
}
