import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { PostCard } from "@/components/blog/post-card";
import { Tag } from "@/components/ui/tag";
import { getAllPosts, getAllTags } from "@/lib/posts";

type BlogPageProps = {
  searchParams?: {
    tag?: string;
  };
};

export const metadata: Metadata = {
  title: "Blog",
  description: "Essays, technical notes, and learning logs.",
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();
  const activeTag = typeof searchParams?.tag === "string" ? searchParams.tag : "";
  const posts = activeTag ? allPosts.filter((post) => post.tags.includes(activeTag)) : allPosts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Writing archive"
        description="A long-form log of technical exploration, learning, and product thinking."
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          <div className="flex flex-wrap gap-2">
            <Tag label="All" href="/blog" active={!activeTag} />
            {allTags.map((tag) => (
              <Tag key={tag} label={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} active={activeTag === tag} />
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="surface-card p-8 text-sm text-[var(--muted)]">
              No posts found for this tag yet. Add new markdown files in <code>content/blog</code>.
            </div>
          ) : (
            <div className="grid gap-5">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

