import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { currentBooks, heartNotes } from "@/data/life";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { getAllNotes } from "@/lib/posts";
import { noteCategoryConfig } from "@/data/notes";
import { NoteCard } from "@/components/notes/note-card";

export const metadata: Metadata = {
  title: "首页",
  description: "读书、笔记、心里话与真实经历的个人空间。",
};

export default async function HomePage() {
  const latestNotes = (await getAllNotes()).slice(0, 3);
  const featuredThings = projects.filter((project) => project.featured).slice(0, 3);
  const topBooks = currentBooks.slice(0, 3);
  const shortNotes = heartNotes.slice(0, 3);

  return (
    <>
      <section className="section-space pb-8 md:pb-12">
        <Container>
          <div className="surface-card magazine-grid relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(68,93,176,0.12),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(20,26,45,0.09),transparent_38%)]" />
            <div className="relative max-w-4xl space-y-8 fade-up">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Samuel’s Inner Studio</p>
              <div className="space-y-4">
                <h1 className="font-display text-4xl leading-[1.02] text-[var(--ink)] md:text-7xl">{profile.name}</h1>
                <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-xl">{profile.headline}</p>
              </div>
              <div className="space-y-2 text-[15px] leading-relaxed text-[var(--ink)] md:text-base">
                {profile.introLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonLink href="/notes" label="进入笔记" />
                <ButtonLink href="/books" label="正在读什么" variant="secondary" />
                <ButtonLink href="/write" label="快速导入文字" variant="ghost" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(noteCategoryConfig).map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1 text-xs text-[var(--muted)]"
                  >
                    {value.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container className="grid gap-6 md:grid-cols-2">
          <article className="surface-card p-7">
            <SectionHeading eyebrow="读书" title="书桌上的三本书" />
            <ul className="mt-5 space-y-4">
              {topBooks.map((book) => (
                <li key={`${book.title}-${book.author}`} className="border-l border-[var(--border)] pl-4">
                  <p className="text-base text-[var(--ink)]">{book.title}</p>
                  {book.author ? <p className="text-sm text-[var(--muted)]">{book.author}</p> : null}
                  <p className="mt-1 text-xs text-[var(--muted)]">{book.progress}</p>
                </li>
              ))}
            </ul>
            <Link href="/books" className="mt-5 inline-block text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              查看完整书单
            </Link>
          </article>

          <article className="surface-card p-7">
            <SectionHeading eyebrow="心里话" title="最近留下的几行字" />
            <ul className="mt-5 space-y-4">
              {shortNotes.map((item) => (
                <li key={`${item.date}-${item.text}`} className="space-y-1">
                  <p className="text-xs text-[var(--muted)]">{item.date}</p>
                  <p className="text-sm leading-relaxed text-[var(--ink)]">{item.text}</p>
                </li>
              ))}
            </ul>
          </article>
        </Container>
      </section>

      <section className="section-space">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="笔记"
              title="最近更新"
              description="技术、商业、文艺与一路走来的最新记录。"
            />
            <Link href="/notes" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              查看全部笔记
            </Link>
          </div>
          <div className="grid gap-5">
            {latestNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="做过的事" title="阶段性成果" description="不是简历，只是一些真实做过的事情。" />
            <Link href="/projects" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
              查看全部
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredThings.map((item) => (
              <article key={item.id} className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{item.status}</p>
                <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
