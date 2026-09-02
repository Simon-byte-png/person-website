"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-full px-3 py-1.5 text-sm tracking-tight transition-all duration-300",
        isActive
          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent-deep)] shadow-[inset_0_0_0_1px_rgba(215,96,59,0.12)]"
          : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]",
      )}
    >
      {label}
    </Link>
  );
}
