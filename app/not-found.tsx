import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <section className="section-space">
      <Container>
        <div className="surface-card max-w-2xl space-y-5 p-8">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">404</p>
          <h1 className="font-display text-4xl text-[var(--ink)]">Page not found</h1>
          <p className="text-[var(--muted)]">The page you are looking for does not exist in this site map.</p>
          <Link href="/" className="inline-flex rounded-full border border-[var(--border)] px-5 py-2 text-sm hover:border-[var(--ink)]">
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}

