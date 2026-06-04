import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";

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
  await params;
  return {
    title: "笔记",
    description: "个人笔记集合。",
  };
}

export default async function TagNotesPage({ params }: TagNotesPageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeTag(rawTag);
  const notes = await getAllNotes({ tag });

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
