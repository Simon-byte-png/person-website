import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { lifeTimeline } from "@/data/life";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于",
  description: "三句话介绍我是谁，以及这个网站为什么存在。",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="三句话，不表演" description={profile.shortBio} />
      <section className="section-space pt-4">
        <Container className="grid gap-7 md:grid-cols-[1.05fr_0.95fr]">
          <article className="surface-card feature-card p-7 md:p-8">
            <p className="card-index">01 / Identity</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">我是谁</h2>
            <ul className="mt-5 space-y-4">
              {profile.aboutThreeLines.map((line) => (
                <li key={line} className="border-l border-[var(--border)] pl-4 text-[var(--ink)]">
                  {line}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card feature-card p-7 md:p-8">
            <p className="card-index">02 / Timeline</p>
            <h2 className="font-display text-3xl text-[var(--ink)]">时间线</h2>
            <ol className="mt-6 space-y-6">
              {lifeTimeline.map((item) => (
                <li key={`${item.year}-${item.title}`} className="relative space-y-1 border-l border-[var(--border)] pl-5 before:absolute before:-left-[4px] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-[var(--accent)]">
                  <p className="font-mono text-xs text-[var(--accent-deep)]">{item.year}</p>
                  <p className="text-base text-[var(--ink)]">{item.title}</p>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                </li>
              ))}
            </ol>
          </article>
        </Container>
      </section>
    </>
  );
}
