import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PostCard } from "@/components/blog/post-card";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { currentBooks, heartNotes } from "@/data/life";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Home",
  description: "Books, blog posts, inner notes, and lived work.",
};

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);
  const featuredThings = projects.filter((project) => project.featured).slice(0, 3);
  const topBooks = currentBooks.slice(0, 3);
  const latestNotes = heartNotes.slice(0, 3);

  return (
    <>
      <section className="section-space pb-8 md:pb-12">
        <Container>
          <div className="surface-card dashed-grid relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_34%)]" />
            <div className="relative max-w-4xl space-y-7 fade-up">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Inner Studio</p>
              <div className="space-y-4">
                <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{profile.name}</h1>
                <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-xl">{profile.headline}</p>
              </div>
              <div className="space-y-2">
                {profile.introLines.map((line) => (
                  <p key={line} className="text-sm text-[var(--ink)] md:text-base">
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonLink href="/books" label="What I Read" />
                <ButtonLink href="/blog" label="Read Blog" variant="secondary" />
                <ButtonLink href="/write" label="Import Text" variant="ghost" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container className="grid gap-6 md:grid-cols-2">
          <article className="surface-card p-7">
            <SectionHeading eyebrow="Now Reading" title="Books on my desk" />
            <ul className="mt-5 space-y-4">
              {topBooks.map((book) => (
                <li key={`${book.title}-${book.author}`} className="border-l border-[var(--border)] pl-4">
                  <p className="text-base text-[var(--ink)]">{book.title}</p>
                  <p className="text-sm text-[var(--muted)]">{book.author}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{book.progress}</p>
                </li>
              ))}
            </ul>
            <Link href="/books" className="mt-5 inline-block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              Open full reading list
            </Link>
          </article>

          <article className="surface-card p-7">
            <SectionHeading eyebrow="Inner Notes" title="Short lines I keep" />
            <ul className="mt-5 space-y-4">
              {latestNotes.map((note) => (
                <li key={`${note.date}-${note.text}`} className="space-y-1">
                  <p className="text-xs text-[var(--muted)]">{note.date}</p>
                  <p className="text-sm leading-relaxed text-[var(--ink)]">{note.text}</p>
                </li>
              ))}
            </ul>
          </article>
        </Container>
      </section>

      <section className="section-space">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Blog" title="Recent writing" description="Thinking notes, technical notes, and personal reflections." />
            <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              View all posts
            </Link>
          </div>
          <div className="grid gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Things Done" title="Things I have done" description="Not a resume. Just meaningful traces of action." />
            <Link href="/projects" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              See all things
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredThings.map((item) => (
              <article key={item.id} className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</p>
                <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

