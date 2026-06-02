import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import { Container } from "@/components/layout/container";
import { isClerkConfigured, getCurrentUserContext } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新建博客",
  description: "管理员创建数据库博客文章。",
};

export default async function NewPostPage() {
  if (!isClerkConfigured()) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-2xl p-8 text-sm text-[var(--muted)]">
            请先配置 Clerk 环境变量，再使用管理员发文功能。
          </div>
        </Container>
      </section>
    );
  }

  if (!hasDatabase()) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-2xl p-8 text-sm text-[var(--muted)]">
            请先配置 DATABASE_URL 并执行数据库 migration。
          </div>
        </Container>
      </section>
    );
  }

  const { user, isAdmin } = await getCurrentUserContext();
  if (!user) {
    redirect("/sign-in?redirect_url=/admin/posts/new");
  }

  if (!isAdmin) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-2xl space-y-4 p-8">
            <h1 className="font-display text-4xl text-[var(--ink)]">无权访问</h1>
            <p className="text-sm text-[var(--muted)]">当前账号不在 ADMIN_EMAILS 中。</p>
            <Link href="/blog" className="inline-flex rounded-full border border-[var(--border)] px-5 py-2 text-sm">
              返回博客
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-space">
      <Container className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Admin</p>
          <h1 className="font-display text-4xl text-[var(--ink)] md:text-6xl">新建博客</h1>
          <p className="text-sm text-[var(--muted)]">文章将保存到 PostgreSQL posts 表，保存成功后跳转到博客详情页。</p>
        </div>
        <PostEditorForm />
      </Container>
    </section>
  );
}
