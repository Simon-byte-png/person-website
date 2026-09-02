import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { type ContentMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: ContentMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card group p-6 md:p-7">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="text-[var(--border)]">/</span>
        <span>{post.readingTime} 分钟</span>
      </div>
      <h3 className="font-display text-2xl leading-snug text-[var(--ink)]">
        <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-[var(--accent)]">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Tag key={tag} label={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} />
        ))}
      </div>
    </article>
  );
}
