import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { isAdminEmail } from "@/lib/admin";
import { isClerkConfigured } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { getViewerActivity } from "@/lib/interactions/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "个人中心",
  description: "查看自己的评论和点赞记录。",
};

export default async function MePage() {
  if (!isClerkConfigured()) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-2xl space-y-3 p-8">
            <h1 className="font-display text-4xl text-[var(--ink)]">个人中心</h1>
            <p className="text-sm text-[var(--muted)]">配置 Clerk 环境变量后，GitHub 登录和个人中心会自动启用。</p>
          </div>
        </Container>
      </section>
    );
  }

  if (!hasDatabase()) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-2xl space-y-3 p-8">
            <h1 className="font-display text-4xl text-[var(--ink)]">个人中心</h1>
            <p className="text-sm text-[var(--muted)]">配置 DATABASE_URL 并执行数据库迁移后，即可查看评论和点赞记录。</p>
          </div>
        </Container>
      </section>
    );
  }

  const activity = await getViewerActivity();
  if (!activity) {
    redirect("/sign-in?redirect_url=/me");
  }

  const admin = isAdminEmail(activity.user.email);

  return (
    <section className="section-space">
      <Container className="space-y-8">
        <div className="surface-card flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Profile</p>
            <h1 className="mt-1 font-display text-4xl text-[var(--ink)]">个人中心</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{activity.user.username}</p>
            <p className="text-sm text-[var(--muted)]">{activity.user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            {admin ? (
              <Link href="/admin/posts/new" className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white">
                新建博客
              </Link>
            ) : null}
            {activity.user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activity.user.imageUrl} alt="" className="h-16 w-16 rounded-full" />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Comments</p>
            <p className="mt-2 font-display text-4xl text-[var(--ink)]">{activity.commentCount}</p>
          </div>
          <div className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Likes</p>
            <p className="mt-2 font-display text-4xl text-[var(--ink)]">{activity.likeCount}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="surface-card p-7">
            <h2 className="font-display text-3xl text-[var(--ink)]">最近评论过的文章</h2>
            <div className="mt-5 space-y-4">
              {activity.comments.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">还没有发表过评论。</p>
              ) : (
                activity.comments.map((comment) => (
                  <article key={comment.id} className="rounded-xl border border-[var(--border)] p-4">
                    <p className="text-sm leading-relaxed text-[var(--ink)]">{comment.content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span>{new Date(comment.createdAt).toLocaleString("zh-CN")}</span>
                      <span>·</span>
                      <Link href={`/blog/${comment.postSlug}`} className="hover:text-[var(--ink)]">
                        {comment.postTitle}
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="surface-card p-7">
            <h2 className="font-display text-3xl text-[var(--ink)]">最近点赞过的文章</h2>
            <div className="mt-5 space-y-3">
              {activity.likes.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">还没有点赞记录。</p>
              ) : (
                activity.likes.map((like) => (
                  <article key={like.id} className="rounded-xl border border-[var(--border)] p-4">
                    {like.postSlug && like.postTitle ? (
                      <Link href={`/blog/${like.postSlug}`} className="text-sm text-[var(--ink)] hover:text-[var(--accent)]">
                        {like.postTitle}
                      </Link>
                    ) : (
                      <p className="text-sm text-[var(--muted)]">评论点赞</p>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted)]">{new Date(like.createdAt).toLocaleString("zh-CN")}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </Container>
    </section>
  );
}
