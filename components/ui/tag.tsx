import Link from "next/link";
import { cn } from "@/lib/utils";

type TagProps = {
  label: string;
  href?: string;
  active?: boolean;
};

export function Tag({ label, href, active = false }: TagProps) {
  const className = cn(
    "inline-flex rounded-full border px-3 py-1 text-xs transition-colors",
    active
      ? "border-transparent bg-[var(--accent)] text-white"
      : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]",
  );

  if (!href) {
    return <span className={className}>{label}</span>;
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

