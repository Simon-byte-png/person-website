import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { currentBooks, readingPhilosophy } from "@/data/life";

export const metadata: Metadata = {
  title: "Books",
  description: "What I am currently reading and why it matters.",
};

export default function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Books"
        title="Reading desk"
        description="A small list of books I am currently reading, with short notes."
      />
      <section className="section-space pt-4">
        <Container className="space-y-7">
          <article className="surface-card border-l-4 border-l-[var(--accent)] p-7">
            <p className="text-sm leading-relaxed text-[var(--ink)]">{readingPhilosophy}</p>
          </article>
          <div className="grid gap-5 md:grid-cols-2">
            {currentBooks.map((book) => (
              <article key={`${book.title}-${book.author}`} className="surface-card p-7">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{book.progress}</p>
                <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">{book.title}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{book.author}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--ink)]">{book.note}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

