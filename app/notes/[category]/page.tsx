import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { getAllNotes } from "@/lib/posts";
import { isNoteCategory, noteCategoryOrder, type NoteCategory } from "@/data/notes";

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
    return { title: "笔记不存在" };
  }

  return {
    title: "笔记",
    description: "个人笔记集合。",
  };
}

export default async function CategoryNotesPage({ params }: CategoryNotesPageProps) {
  const { category: rawCategory } = await params;
  if (!isNoteCategory(rawCategory)) {
    notFound();
  }

  const category = rawCategory as NoteCategory;
  const notes = await getAllNotes({ category });

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title="笔记"
        description="这里保留旧链接兼容，内容仍回到统一的笔记阅读体验。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          {notes.length === 0 ? (
            <div className="surface-card p-8 text-sm text-[var(--muted)]">
              暂无笔记。
            </div>
          ) : (
            <div className="grid gap-5">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

        </Container>
      </section>
    </>
  );
}
