import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function ResumePage() {
  return (
    <section className="section-space">
      <Container>
        <div className="surface-card max-w-2xl space-y-4 p-8">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Resume</p>
          <h1 className="font-display text-4xl text-[var(--ink)]">该入口已迁移</h1>
          <p className="text-[var(--muted)]">本站当前采用“做过的事”页面展示阶段性成果。</p>
          <Link href="/projects" className="inline-flex rounded-full border border-[var(--border)] px-5 py-2 text-sm hover:border-[var(--ink)]">
            前往做过的事
          </Link>
        </div>
      </Container>
    </section>
  );
}

