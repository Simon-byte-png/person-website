import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { lifeTimeline } from "@/data/life";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Three lines about who I am and why this space exists.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Three lines, no performance." description={profile.shortBio} />
      <section className="section-space pt-4">
        <Container className="grid gap-7 md:grid-cols-[1.1fr_0.9fr]">
          <article className="surface-card p-7">
            <h2 className="font-display text-3xl text-[var(--ink)]">Who I am</h2>
            <ul className="mt-5 space-y-4">
              {profile.aboutThreeLines.map((line) => (
                <li key={line} className="border-l border-[var(--border)] pl-4 text-[var(--ink)]">
                  {line}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-7">
            <h2 className="font-display text-3xl text-[var(--ink)]">Timeline</h2>
            <ol className="mt-6 space-y-6">
              {lifeTimeline.map((item) => (
                <li key={`${item.year}-${item.title}`} className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{item.year}</p>
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

