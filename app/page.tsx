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
  const allNotes = await getAllNotes();
  const latestNotes = allNotes.slice(0, 3);
  const featuredThings = projects.filter((project) => project.featured).slice(0, 3);
  const topBooks = currentBooks.slice(0, 3);
  const shortNotes = heartNotes.slice(0, 3);

  return (
    <>
      <section className="section-space pb-8 md:pb-12">
        <Container>
          <div className="hero-card magazine-grid relative overflow-hidden">
            <div className="hero-orb" aria-hidden="true" />
            <div className="relative grid gap-12 p-7 sm:p-10 md:p-14 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="max-w-4xl space-y-8 fade-up">
                <p className="hero-kicker">
                  Samuel&apos;s Inner Studio <span className="hero-year">NO. 01 / 2026</span>
                </p>
                <div className="space-y-4">
                  <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.06em] text-[var(--ink)] sm:text-6xl md:text-8xl">
                    {profile.name}<span className="hero-period">.</span>
                  </h1>
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
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(noteCategoryConfig).map(([key, value]) => (
                    <span key={key} className="topic-pill">
                      {value.label}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="hero-aside">
                <div className="hero-aside-label">
                  <span>Field notes</span>
                  <span>01—04</span>
                </div>
                <p className="hero-quote">“{profile.introLines[1]}”</p>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <strong>{allNotes.length}</strong>
                    <span>篇笔记</span>
                  </div>
                  <div className="hero-stat">
                    <strong>{topBooks.length}</strong>
                    <span>本在读</span>
                  </div>
                  <div className="hero-stat">
                    <strong>{projects.length}</strong>
                    <span>件实践</span>
                  </div>
                </div>
                <p className="hero-status">{profile.location} · 持续更新中</p>
              </aside>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space">
        <Container className="grid gap-6 md:grid-cols-2">
          <article className="surface-card feature-card p-7 md:p-8">
            <p className="card-index">01 / Reading</p>
            <SectionHeading eyebrow="读书" title="书桌上的三本书" />
            <ul className="mt-6 space-y-4">
              {topBooks.map((book, index) => (
                <li key={`${book.title}-${book.author}`} className="book-row">
                  <span className="book-number">0{index + 1}</span>
                  <div>
                    <p className="text-base text-[var(--ink)]">{book.title}</p>
                    <p className="text-sm text-[var(--muted)]">{book.author}</p>
                    <p className="mt-1 text-xs text-[var(--accent-deep)]">{book.progress}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/books" className="section-link mt-6">
              查看完整书单
            </Link>
          </article>

          <article className="surface-card feature-card p-7 md:p-8">
            <p className="card-index">02 / Inner notes</p>
            <SectionHeading eyebrow="心里话" title="最近留下的几行字" />
            <ul className="mt-6 space-y-4">
              {shortNotes.map((item) => (
                <li key={`${item.date}-${item.text}`} className="border-t border-[var(--border)] pt-3 first:border-t-0 first:pt-0">
                  <p className="font-mono text-[11px] text-[var(--accent-deep)]">{item.date}</p>
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
            <Link href="/notes" className="section-link">
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
            <Link href="/projects" className="section-link">
              查看全部
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredThings.map((item, index) => (
              <article key={item.id} className="project-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="card-index">0{index + 1}</p>
                  <span className="status-badge" data-status={item.status.toLowerCase()}>
                    {item.status === "Completed" ? "已完成" : "进行中"}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl text-[var(--ink)]">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.summary}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
