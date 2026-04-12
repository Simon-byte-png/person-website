import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/ui/tag";
import { NoteCard } from "@/components/notes/note-card";
import { getAllNotes, getAllNoteTags } from "@/lib/posts";
import { noteCategoryConfig, noteCategoryOrder } from "@/data/notes";

export const metadata: Metadata = {
  title: "笔记",
  description: "技术、商业、文艺与成长记录的统一笔记入口。",
};

export default async function NotesPage() {
  const [notes, allTags] = await Promise.all([getAllNotes(), getAllNoteTags()]);

  return (
    <>
      <PageHero
        eyebrow="Notes"
        title="笔记总览"
        description="把技术、商业、文艺和一路走来的内容放在同一个知识空间里。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-8">
          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">分类</p>
            <div className="flex flex-wrap gap-2">
              <Tag label="全部" href="/notes" active />
              {noteCategoryOrder.map((category) => (
                <Tag
                  key={category}
                  label={noteCategoryConfig[category].label}
                  href={`/notes/${category}`}
                />
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">标签</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Tag key={tag} label={tag} href={`/notes/tag/${encodeURIComponent(tag)}`} />
              ))}
            </div>
          </div>

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
