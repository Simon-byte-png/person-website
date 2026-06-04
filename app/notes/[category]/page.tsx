import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { Tag } from "@/components/ui/tag";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";
import { isNoteCategory, noteCategoryConfig, noteCategoryOrder, type NoteCategory } from "@/data/notes";

type CategoryNotesPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return noteCategoryOrder.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryNotesPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isNoteCategory(category)) {
    return { title: "分类不存在" };
  }

  const categoryLabel = noteCategoryConfig[category].label;
  return {
    title: `${categoryLabel} · 笔记`,
    description: `${categoryLabel}分类下的笔记集合。`,
  };
}

export default async function CategoryNotesPage({ params }: CategoryNotesPageProps) {
  const { category: rawCategory } = await params;
  if (!isNoteCategory(rawCategory)) {
    notFound();
  }

  const category = rawCategory as NoteCategory;
  const [notes, tags] = await Promise.all([getAllNotes({ category }), getAllNoteTags(category)]);

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title={`${noteCategoryConfig[category].label} · 笔记`}
        description="按照分类整理的长期记录。"
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
              <Tag label="全部标签" href={`/notes/${category}`} active />
              {tags.map((tag) => (
                <Tag key={tag} label={tag} href={`/notes/${category}/tag/${encodeURIComponent(tag)}`} />
              ))}
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="surface-card p-8 text-sm text-[var(--muted)]">
              这个分类下暂时没有内容。
            </div>
          ) : (
            <div className="grid gap-5">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          <div className="text-sm text-[var(--muted)]">
            仍可访问旧博客详情链接。旧列表入口已迁移到
            <Link href="/notes" className="ml-1 underline decoration-[1px] underline-offset-4">
              /notes
            </Link>
            。
          </div>
        </Container>
      </section>
    </>
  );
}
