import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";
import { isNoteCategory, noteCategoryOrder, type NoteCategory } from "@/data/notes";

type CategoryTagNotesPageProps = {
  params: Promise<{
    category: string;
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
  const { category } = await params;
  if (!isNoteCategory(category)) {
    return { title: "笔记不存在" };
  }

  return {
    title: "笔记",
    description: "个人笔记集合。",
  };
}

export default async function CategoryTagNotesPage({ params }: CategoryTagNotesPageProps) {
  const { category: rawCategory, tag: rawTag } = await params;
  if (!isNoteCategory(rawCategory)) {
    notFound();
  }

  const category = rawCategory as NoteCategory;
  const tag = decodeTag(rawTag);
  const notes = await getAllNotes({ category, tag });

  if (!notes.length) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title="笔记"
        description="这里保留旧链接兼容，内容仍回到统一的笔记阅读体验。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
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
