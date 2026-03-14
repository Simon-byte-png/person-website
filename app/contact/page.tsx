import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";
import { isExternalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ways to get in touch.",
};

const contactLinks = [
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.social.github },
  { label: "X / Twitter", href: profile.social.twitter },
  { label: "LinkedIn", href: profile.social.linkedin },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="If your message is thoughtful, practical, or collaborative, I am happy to connect."
      />
      <section className="section-space pt-4">
        <Container>
          <div className="surface-card max-w-3xl p-7">
            <ul className="space-y-5">
              {contactLinks.map((item) => (
                <li key={item.label} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
                  <span className="text-sm uppercase tracking-[0.1em] text-[var(--muted)]">{item.label}</span>
                  {isExternalUrl(item.href) || item.href.startsWith("mailto:") ? (
                    <Link
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="text-sm text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                    >
                      {item.href}
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--muted)]">[TO_FILL]</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

