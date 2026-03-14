import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { QuickEntryForm } from "@/components/write/quick-entry-form";

export const metadata: Metadata = {
  title: "Write",
  description: "Paste text and convert it into structured markdown drafts.",
};

export default function WritePage() {
  return (
    <>
      <PageHero
        eyebrow="Write"
        title="Import text easily"
        description="Paste your text, choose a type, and generate a markdown draft in one step."
      />
      <section className="section-space pt-4">
        <Container className="space-y-6">
          <article className="surface-card p-6 text-sm leading-relaxed text-[var(--muted)]">
            For non-technical use: just paste your text, click Copy Markdown, and send it to me.
            I can place it into the website for you.
          </article>
          <div className="surface-card p-6 md:p-8">
            <QuickEntryForm />
          </div>
        </Container>
      </section>
    </>
  );
}

