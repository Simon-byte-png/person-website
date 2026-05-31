import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "联系",
  description: "联系方式与社交主页。",
};

const contactLinks = [
  { label: "邮箱", href: `mailto:${profile.email}` },
  { label: "GitHub", href: profile.social.github },
  { label: "X / Twitter", href: profile.social.twitter },
  { label: "LinkedIn", href: profile.social.linkedin },
].filter((item) => item.href);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="联系我"
        description="欢迎交流读书、写作、网站搭建与长期主义实践。"
      />
      <section className="section-space pt-4">
        <Container>
          <div className="surface-card max-w-3xl p-7">
            <ul className="space-y-5">
              {contactLinks.map((item) => (
                <li key={item.label} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-5 last:border-b-0 last:pb-0">
                  <span className="text-sm uppercase tracking-[0.1em] text-[var(--muted)]">{item.label}</span>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="text-sm text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                  >
                    {item.href}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
