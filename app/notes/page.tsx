import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { NoteCard } from "@/components/notes/note-card";
import { getAllNotes } from "@/lib/posts";

export const metadata: Metadata = {
  title: "笔记",
  description: "技术、商业、文艺与成长记录的统一笔记入口。",
};

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title="笔记总览"
        description="把技术、商业、文艺和一路走来的内容放在同一个知识空间里。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          {notes.length === 0 ? (
            <div className="surface-card p-8 text-sm text-[var(--muted)]">
              暂无笔记。你可以在 <code>content/notes</code> 下新增 markdown 文件。
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
