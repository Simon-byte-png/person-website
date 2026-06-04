import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { InteractionSection } from "@/components/interactions/interaction-section";
import { ensureStaticInteractionPost } from "@/lib/blog/repository";
import { getAllNotesParams, getNoteByCategoryAndSlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { isNoteCategory, type NoteCategory } from "@/data/notes";

export const dynamic = "force-dynamic";

type NoteDetailPageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateStaticParams() {
  const items = await getAllNotesParams();
  return items.map((item) => ({
    category: item.category,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: NoteDetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isNoteCategory(category)) {
    return { title: "笔记不存在" };
  }
  const note = await getNoteByCategoryAndSlug(category, decodeSlug(slug));
  if (!note) {
    return { title: "笔记不存在" };
  }

  return {
    title: note.title,
    description: note.excerpt,
  };
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { category: rawCategory, slug } = await params;
  if (!isNoteCategory(rawCategory)) {
    notFound();
  }
  const category = rawCategory as NoteCategory;
  const note = await getNoteByCategoryAndSlug(category, decodeSlug(slug));
  if (!note) {
    notFound();
  }

  const interactionPostId = await ensureStaticInteractionPost({
    id: `note:${category}:${note.slug}`,
    slug: `note-${category}-${note.slug}`,
    title: note.title,
    excerpt: note.excerpt,
    content: note.content,
    tags: note.tags,
  });

  return (
    <section className="section-space">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        <article className="surface-card p-7 md:p-10">
          <header className="mb-10 border-b border-[var(--border)] pb-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              <time dateTime={note.date}>{formatDate(note.date)}</time>
              <span>·</span>
              <span>{note.readingTime} 分钟</span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{note.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{note.excerpt}</p>
            <Link href="/notes" className="mt-6 inline-block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              返回笔记
            </Link>
          </header>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: note.html }} />
        </article>
        <aside className="space-y-6">
          <TableOfContents items={note.toc} />
        </aside>
        {interactionPostId ? (
          <div className="lg:col-span-2">
            <InteractionSection postId={interactionPostId} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
