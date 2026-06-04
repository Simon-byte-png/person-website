import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { type ContentMeta } from "@/lib/posts";

type NoteCardProps = {
  note: ContentMeta;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ink)]/25 hover:shadow-[0_20px_50px_rgba(16,16,20,0.08)]">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span>{formatDate(note.date)}</span>
        <span>·</span>
        <span>{note.readingTime} 分钟</span>
      </div>
      <h3 className="font-display text-2xl leading-snug text-[var(--ink)]">
        <Link href={note.url} className="transition-colors group-hover:text-[var(--accent)]">
          {note.title}
        </Link>
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{note.excerpt}</p>
    </article>
  );
}
