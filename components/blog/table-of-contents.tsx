import Link from "next/link";
import { type TableOfContentsItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  items: TableOfContentsItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-24 hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:block">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">On This Page</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={cn(
                "block text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]",
                item.level === 3 && "pl-3",
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

