import { Container } from "@/components/layout/container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Container>
      <div className="relative z-10 max-w-4xl space-y-4">
        {eyebrow ? (
          <p className="page-kicker">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-5xl leading-[1.04] text-[var(--ink)] md:text-7xl">{title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-xl">{description}</p>
      </div>
      </Container>
    </section>
  );
}
