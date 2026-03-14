import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { projects } from "@/data/projects";
import { isExternalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Things",
  description: "Meaningful things I have done.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Things"
        title="Things I have done"
        description="Not a resume list. A few traces of action that mattered."
      />
      <section className="section-space pt-4">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="surface-card p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{project.status}</p>
                  {isExternalUrl(project.href) ? (
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                    >
                      Open
                    </Link>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">Link [TO_FILL]</span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">{project.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span key={tech} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
