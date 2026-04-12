import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Tag } from "@/components/ui/tag";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <section className="section-space">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        <article className="surface-card p-7 md:p-10">
          <header className="mb-10 border-b border-[var(--border)] pb-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTime} 分钟</span>
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] text-[var(--accent)]">
                旧版博客
              </span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} href={`/notes/tag/${encodeURIComponent(tag)}`} />
              ))}
            </div>
          </header>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <TableOfContents items={post.toc} />
      </Container>
    </section>
  );
}
