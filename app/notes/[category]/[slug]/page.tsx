import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Tag } from "@/components/ui/tag";
import { getAllNotesParams, getNoteByCategoryAndSlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { isNoteCategory, noteCategoryConfig, type NoteCategory } from "@/data/notes";

type NoteDetailPageProps = {
  params: {
    category: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  const items = await getAllNotesParams();
  return items.map((item) => ({
    category: item.category,
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: NoteDetailPageProps): Promise<Metadata> {
  if (!isNoteCategory(params.category)) {
    return { title: "笔记不存在" };
  }
  const note = await getNoteByCategoryAndSlug(params.category, params.slug);
  if (!note) {
    return { title: "笔记不存在" };
  }

  return {
    title: note.title,
    description: note.excerpt,
  };
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  if (!isNoteCategory(params.category)) {
    notFound();
  }
  const category = params.category as NoteCategory;
  const note = await getNoteByCategoryAndSlug(category, params.slug);
  if (!note) {
    notFound();
  }

  const categoryLabel = noteCategoryConfig[category].label;

  return (
    <section className="section-space">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-start">
        <article className="surface-card p-7 md:p-10">
          <header className="mb-10 border-b border-[var(--border)] pb-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] text-[var(--accent)]">
                {categoryLabel}
              </span>
              <time dateTime={note.date}>{formatDate(note.date)}</time>
              <span>·</span>
              <span>{note.readingTime} 分钟</span>
            </div>
            <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{note.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{note.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Tag key={tag} label={tag} href={`/notes/${category}/tag/${encodeURIComponent(tag)}`} />
              ))}
            </div>
            <Link href={`/notes/${category}`} className="mt-6 inline-block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              返回 {categoryLabel}
            </Link>
          </header>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: note.html }} />
        </article>
        <TableOfContents items={note.toc} />
      </Container>
    </section>
  );
}
