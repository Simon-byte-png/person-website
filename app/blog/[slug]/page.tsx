import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { InteractionSection } from "@/components/interactions/interaction-section";
import { Tag } from "@/components/ui/tag";
import { getBlogPostBySlug, recordPostView } from "@/lib/blog/repository";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "文章不存在" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  if (post.source === "database") {
    const requestHeaders = await headers();
    const viewerKey =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      requestHeaders.get("user-agent") ||
      "anonymous";
    await recordPostView(post.id, viewerKey);
  }

  return (
    <section className="section-space">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        <article className="surface-card p-7 md:p-10">
          <header className="mb-10 border-b border-[var(--border)] pb-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              <time dateTime={post.source === "database" ? post.createdAt : post.date}>
                {formatDate(post.source === "database" ? post.createdAt : post.date)}
              </time>
              <span>·</span>
              <span>{post.readingTime} 分钟</span>
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] text-[var(--accent)]">
                {post.source === "database" ? "博客" : "旧版博客"}
              </span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} href={`/blog?q=${encodeURIComponent(tag)}`} />
              ))}
            </div>
          </header>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <aside className="space-y-6">
          <TableOfContents items={post.toc} />
        </aside>
        {post.source === "database" ? (
          <div className="lg:col-span-2">
            <InteractionSection postId={post.id} />
          </div>
        ) : (
          <div className="surface-card p-6 text-sm text-[var(--muted)] lg:col-span-2">
            这是旧版静态 Markdown 文章，V1.0 的评论、点赞、浏览量和热榜只对数据库博客开放。
          </div>
        )}
      </Container>
    </section>
  );
}
