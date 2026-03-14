import { Container } from "@/components/layout/container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <Container className="pb-8 pt-16 md:pt-20">
      <div className="max-w-4xl space-y-4">
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">{title}</h1>
        <p className="text-base leading-relaxed text-[var(--muted)] md:text-xl">{description}</p>
      </div>
    </Container>
  );
}

