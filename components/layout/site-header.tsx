import Link from "next/link";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-[var(--border)]/70 backdrop-blur-xl">
      <Container className="flex h-[4.75rem] items-center justify-between gap-6">
        <Link href="/" className="group inline-flex min-w-0 items-center gap-3">
          <span className="brand-mark shrink-0" aria-hidden="true" />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="brand-name text-[var(--ink)]">{profile.name}</span>
            <span className="brand-role mt-1 truncate transition-colors group-hover:text-[var(--ink)]">{profile.role}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.navigation.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </Container>
      <Container className="pb-3 md:hidden">
        <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {siteConfig.navigation.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
      </Container>
    </header>
  );
}
