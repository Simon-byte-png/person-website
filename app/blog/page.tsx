import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/ui/tag";
import { getPublishedPosts, getTrendingPosts } from "@/lib/blog/repository";
import { formatDate } from "@/lib/utils";

type BlogPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "博客",
  description: "数据库驱动的个人博客。",
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const [posts, trendingPosts] = await Promise.all([getPublishedPosts(query), getTrendingPosts(5)]);

  return (
    <>
      <PageHero eyebrow="Blog" title="博客" description="V1.0 博客文章从 Neon 数据库读取，支持搜索、评论、点赞和热榜。" />
      <section className="section-space pt-4">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="space-y-6">
            <form action="/blog" className="surface-card flex flex-col gap-3 p-4 sm:flex-row">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="搜索标题、摘要、正文、标签"
                className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
              />
              <button type="submit" className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm text-white">
                搜索
              </button>
            </form>

            {posts.length === 0 ? (
              <div className="surface-card p-8 text-sm text-[var(--muted)]">
                {query ? "没有找到匹配的数据库博客。" : "暂无数据库博客。管理员可以在 /admin/posts/new 新建文章。"}
              </div>
            ) : (
              <div className="grid gap-5">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ink)]/25 hover:shadow-[0_20px_50px_rgba(16,16,20,0.08)]"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      <span>·</span>
                      <span>{post.readingTime} 分钟</span>
                    </div>
                    <h2 className="font-display text-3xl leading-snug text-[var(--ink)]">
                      <Link href={post.url} className="transition-colors group-hover:text-[var(--accent)]">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Tag key={tag} label={tag} href={`/blog?q=${encodeURIComponent(tag)}`} />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Trending</p>
            <h2 className="mt-1 font-display text-2xl text-[var(--ink)]">热门文章</h2>
            <div className="mt-5 space-y-4">
              {trendingPosts.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">暂无热榜数据。</p>
              ) : (
                trendingPosts.map(({ post, stats }, index) => (
                  <Link key={post.id} href={post.url} className="block rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-[var(--ink)]">
                    <p className="text-xs text-[var(--muted)]">#{index + 1} · 热度 {stats.score}</p>
                    <h3 className="mt-1 text-sm font-medium text-[var(--ink)]">{post.title}</h3>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {stats.views} 浏览 · {stats.likes} 赞 · {stats.comments} 评论
                    </p>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
