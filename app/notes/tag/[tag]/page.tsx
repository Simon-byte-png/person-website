import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { Tag } from "@/components/ui/tag";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";
import { noteCategoryConfig, noteCategoryOrder } from "@/data/notes";

type TagNotesPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

function decodeTag(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateStaticParams() {
  const tags = await getAllNoteTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagNotesPageProps): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeTag(rawTag);
  return {
    title: `#${tag} · 笔记`,
    description: `标签 #${tag} 下的笔记集合。`,
  };
}

export default async function TagNotesPage({ params }: TagNotesPageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeTag(rawTag);
  const [notes, allTags] = await Promise.all([getAllNotes({ tag }), getAllNoteTags()]);

  if (!notes.length) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title={`#${tag}`}
        description="按标签筛选的全部笔记。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">分类</p>
            <div className="flex flex-wrap gap-2">
              <Tag label="全部" href="/notes" />
              {noteCategoryOrder.map((category) => (
                <Tag key={category} label={noteCategoryConfig[category].label} href={`/notes/${category}`} />
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">标签</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((item) => (
                <Tag
                  key={item}
                  label={item}
                  href={`/notes/tag/${encodeURIComponent(item)}`}
                  active={item === tag}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
