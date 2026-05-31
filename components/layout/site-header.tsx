import Link from "next/link";
import { profile } from "@/data/profile";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { UserMenu } from "@/components/auth/user-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/70 bg-[var(--bg)]/86 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-baseline gap-2">
          <span className="font-display text-[1.2rem] font-semibold text-[var(--ink)]">{profile.name}</span>
          <span className="text-xs text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]">
            {profile.role}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.navigation.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <UserMenu />
        </div>
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
