const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  published: boolean;
};

export function normalizeTags(value: string | string[]) {
  const items = Array.isArray(value) ? value : value.split(",");
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function validateSlug(value: string) {
  const slug = value.trim();
  if (!slug) {
    return { ok: false as const, error: "slug 不能为空" };
  }
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false as const, error: "slug 只能包含小写字母、数字和短横线" };
  }
  return { ok: true as const, slug };
}

export function validatePostInput(input: PostInput) {
  const title = input.title.trim();
  if (!title) {
    return { ok: false as const, error: "标题不能为空" };
  }

  const slugResult = validateSlug(input.slug);
  if (!slugResult.ok) {
    return slugResult;
  }

  const excerpt = input.excerpt.trim();
  if (!excerpt) {
    return { ok: false as const, error: "摘要不能为空" };
  }

  const content = input.content.trim();
  if (!content) {
    return { ok: false as const, error: "正文不能为空" };
  }

  return {
    ok: true as const,
    value: {
      title,
      slug: slugResult.slug,
      excerpt,
      content,
      tags: normalizeTags(input.tags),
      published: input.published,
    },
  };
}

export function calculateTrendingScore({
  views,
  likes,
  comments,
}: {
  views: number;
  likes: number;
  comments: number;
}) {
  return views + likes * 3 + comments * 5;
}
