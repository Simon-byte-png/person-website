type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p className="section-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl leading-tight text-[var(--ink)] md:text-4xl">{title}</h2>
      {description ? <p className="text-[var(--muted)] md:text-lg">{description}</p> : null}
    </div>
  );
}
