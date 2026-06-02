"use client";

import { useState, useTransition } from "react";
import { SignInButton } from "@clerk/nextjs";
import { createComment, toggleLike } from "@/app/actions/interactions";
import type { InteractionComment, PostInteractionState } from "@/lib/interactions/queries";
import type { CommentTreeItem } from "@/lib/interactions/model";

type InteractionPanelProps = {
  postId: string;
  initialState: PostInteractionState;
};

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function SignInPrompt({ label }: { label: string }) {
  if (!clerkEnabled) {
    return (
      <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--muted)]">
        配置 Clerk 和数据库后即可{label}。
      </p>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
      >
        GitHub 登录后{label}
      </button>
    </SignInButton>
  );
}

function CommentComposer({
  postId,
  parentId,
  onSubmitted,
  onCancel,
}: {
  postId: string;
  parentId?: string | null;
  onSubmitted: (state: PostInteractionState) => void;
  onCancel?: () => void;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitComment() {
    setError("");
    startTransition(async () => {
      const result = await createComment({ postId, content, parentId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setContent("");
      onSubmitted(result.state);
      onCancel?.();
    });
  }

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={parentId ? 3 : 4}
        placeholder={parentId ? "写下你的回复..." : "写下你的评论..."}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submitComment}
          disabled={isPending}
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "提交中" : parentId ? "回复" : "发表评论"}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            取消
          </button>
        ) : null}
        <span className="text-xs text-[var(--muted)]">{content.trim().length}/1000</span>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function CommentItem({
  comment,
  viewerUserId,
  postId,
  onStateChange,
}: {
  comment: CommentTreeItem<InteractionComment>;
  viewerUserId: string | null;
  postId: string;
  onStateChange: (state: PostInteractionState) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onToggleCommentLike() {
    setError("");
    startTransition(async () => {
      const result = await toggleLike({ targetType: "comment", targetId: comment.id, postId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStateFromResult(result.state);
    });
  }

  function setStateFromResult(state: PostInteractionState) {
    onStateChange(state);
  }

  return (
    <article className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          {comment.author.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comment.author.imageUrl} alt="" className="h-9 w-9 rounded-full" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-[var(--accent-soft)]" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--ink)]">{comment.author.username}</p>
            <p className="text-xs text-[var(--muted)]">{new Date(comment.createdAt).toLocaleString("zh-CN")}</p>
          </div>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">{comment.content}</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex flex-wrap gap-4 text-sm">
        {viewerUserId ? (
          <button
            type="button"
            onClick={onToggleCommentLike}
            disabled={isPending}
            className="text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-50"
            aria-pressed={comment.likedByViewer}
          >
            {comment.likedByViewer ? "已点赞" : "点赞"} · {comment.likeCount}
          </button>
        ) : (
          <span className="text-[var(--muted)]">{comment.likeCount} 个赞</span>
        )}
        {viewerUserId ? (
          <button type="button" onClick={() => setReplying((value) => !value)} className="text-[var(--muted)] hover:text-[var(--ink)]">
            回复
          </button>
        ) : null}
      </div>
      {replying ? (
        <CommentComposer postId={postId} parentId={comment.id} onSubmitted={onStateChange} onCancel={() => setReplying(false)} />
      ) : null}
      {comment.replies.length > 0 ? (
        <div className="space-y-3 border-l border-[var(--border)] pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              viewerUserId={viewerUserId}
              postId={postId}
              onStateChange={onStateChange}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function InteractionPanel({ postId, initialState }: InteractionPanelProps) {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onTogglePostLike() {
    setError("");
    startTransition(async () => {
      const result = await toggleLike({ targetType: "post", targetId: postId, postId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setState(result.state);
    });
  }

  return (
    <section className="surface-card space-y-7 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Interactions</p>
          <h2 className="mt-1 font-display text-3xl text-[var(--ink)]">评论与点赞</h2>
        </div>
        {state.viewerUserId ? (
          <button
            type="button"
            onClick={onTogglePostLike}
            disabled={isPending}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)] disabled:opacity-50"
            aria-pressed={state.postLikedByViewer}
          >
            {state.postLikedByViewer ? "已点赞" : "点赞"} · {state.postLikeCount}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--muted)]">{state.postLikeCount} 个赞</span>
            <SignInPrompt label="点赞" />
          </div>
        )}
      </div>

      {!state.backendConfigured ? (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--muted)]">
          后端未配置。设置 Clerk 与 PostgreSQL 环境变量后，评论和点赞会自动启用。
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="space-y-4">
        <h3 className="text-base font-medium text-[var(--ink)]">评论 {state.comments.length}</h3>
        {state.viewerUserId ? <CommentComposer postId={postId} onSubmitted={setState} /> : <SignInPrompt label="评论" />}
      </div>

      <div className="space-y-4">
        {state.comments.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">还没有评论。</p>
        ) : (
          state.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              viewerUserId={state.viewerUserId}
              postId={postId}
              onStateChange={setState}
            />
          ))
        )}
      </div>
    </section>
  );
}
