import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { Tag } from "@/components/ui/tag";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";
import { isNoteCategory, noteCategoryConfig, noteCategoryOrder, type NoteCategory } from "@/data/notes";

type CategoryTagNotesPageProps = {
  params: {
    category: string;
    tag: string;
  };
};

function decodeTag(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateStaticParams() {
  const params: Array<{ category: NoteCategory; tag: string }> = [];
  for (const category of noteCategoryOrder) {
    const tags = await getAllNoteTags(category);
    for (const tag of tags) {
      params.push({ category, tag });
    }
  }
  return params;
}

export async function generateMetadata({ params }: CategoryTagNotesPageProps): Promise<Metadata> {
  if (!isNoteCategory(params.category)) {
    return { title: "分类不存在" };
  }

  const tag = decodeTag(params.tag);
  const categoryLabel = noteCategoryConfig[params.category].label;
  return {
    title: `${categoryLabel} · #${tag}`,
    description: `${categoryLabel}分类中标签 #${tag} 的笔记。`,
  };
}

export default async function CategoryTagNotesPage({ params }: CategoryTagNotesPageProps) {
  if (!isNoteCategory(params.category)) {
    notFound();
  }

  const category = params.category as NoteCategory;
  const tag = decodeTag(params.tag);
  const [notes, tags] = await Promise.all([getAllNotes({ category, tag }), getAllNoteTags(category)]);

  if (!notes.length) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title={`${noteCategoryConfig[category].label} · #${tag}`}
        description="分类与标签的交叉筛选结果。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">分类</p>
            <div className="flex flex-wrap gap-2">
              <Tag label="全部" href="/notes" />
              {noteCategoryOrder.map((item) => (
                <Tag
                  key={item}
                  label={noteCategoryConfig[item].label}
                  href={`/notes/${item}`}
                  active={item === category}
                />
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">标签</p>
            <div className="flex flex-wrap gap-2">
              <Tag label="全部标签" href={`/notes/${category}`} />
              {tags.map((item) => (
                <Tag
                  key={item}
                  label={item}
                  href={`/notes/${category}/tag/${encodeURIComponent(item)}`}
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
