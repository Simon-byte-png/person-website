import Link from "next/link";
import { Container } from "@/components/layout/container";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site";
import { isExternalUrl } from "@/lib/utils";

const socialLinks = [
  { label: "GitHub", href: profile.social.github },
  { label: "X", href: profile.social.twitter },
  { label: "LinkedIn", href: profile.social.linkedin },
].filter((link) => isExternalUrl(link.href));

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/75 py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-xl text-[var(--ink)]">{profile.name}</p>
          <p className="max-w-2xl text-sm text-[var(--muted)]">{siteConfig.footerNote}</p>
        </div>
        <div className="space-y-2 text-sm">
          {profile.email ? (
            <a className="block text-[var(--ink)] hover:text-[var(--accent)]" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : null}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
