import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({ href, label, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm transition-all duration-300",
        variant === "primary" &&
          "border-transparent bg-[var(--ink)] font-medium text-white shadow-[0_8px_30px_rgba(24,32,30,0.16)] hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]",
        variant === "secondary" &&
          "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-deep)]",
        variant === "ghost" && "border-transparent text-[var(--muted)] hover:text-[var(--accent-deep)]",
      )}
    >
      {label}
    </Link>
  );
}
