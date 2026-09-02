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
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/75 py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="brand-name text-[var(--ink)]">{profile.name}</p>
          <p className="max-w-2xl text-sm text-[var(--muted)]">{siteConfig.footerNote}</p>
        </div>
        <div className="space-y-3 text-sm md:text-right">
          <a className="block text-[var(--ink)] transition-colors hover:text-[var(--accent-deep)]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="flex gap-4 md:justify-end">
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
