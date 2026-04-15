import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { isNoteCategory, type NoteCategory, noteCategoryOrder } from "@/data/notes";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const NOTES_DIR = path.join(process.cwd(), "content", "notes");

type ContentType = "blog" | "note";

type PostFrontmatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  type?: ContentType;
  category?: string;
  slug?: string;
};

const ENGLISH_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeSlug(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return ENGLISH_SLUG_PATTERN.test(trimmed) ? trimmed : null;
}

function resolveNoteSlug(frontmatter: PostFrontmatter, fileSlug: string) {
  return normalizeSlug(frontmatter.slug) ?? fileSlug;
}

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ContentMeta = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  type: ContentType;
  category?: NoteCategory;
  url: string;
};

export type ContentPost = ContentMeta & {
  content: string;
  html: string;
  toc: TableOfContentsItem[];
};

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

function extractToc(content: string) {
  const slugger = new GithubSlugger();
  const items: TableOfContentsItem[] = [];
  const headingRegex = /^(##|###)\s+(.+)$/gm;

  let match = headingRegex.exec(content);
  while (match) {
    const level = match[1] === "##" ? 2 : 3;
    const text = match[2].replace(/[*_`~]/g, "").trim();
    items.push({
      id: slugger.slug(text),
      text,
      level,
    });
    match = headingRegex.exec(content);
  }

  return items;
}

async function markdownToHtml(markdown: string) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "append" })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return String(processed);
}

async function readMarkdownFiles(directory: string) {
  try {
    const files = await fs.readdir(directory);
    return files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function parseMeta(raw: string) {
  const { data, content } = matter(raw);
  return {
    frontmatter: data as PostFrontmatter,
    content,
  };
}

function buildMeta({
  sourceSlug,
  frontmatter,
  content,
  type,
  category,
}: {
  sourceSlug: string;
  frontmatter: PostFrontmatter;
  content: string;
  type: ContentType;
  category?: NoteCategory;
}): ContentMeta {
  const slug = type === "note" ? resolveNoteSlug(frontmatter, sourceSlug) : sourceSlug;
  const title = frontmatter.title?.trim() || "Untitled";
  const date = frontmatter.date?.trim() || "1970-01-01";
  const excerpt = frontmatter.excerpt?.trim() || "";
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const frontmatterCategory = frontmatter.category;

  const normalizedCategory =
    type === "note"
      ? category ?? (frontmatterCategory && isNoteCategory(frontmatterCategory) ? frontmatterCategory : undefined)
      : undefined;

  const url = type === "note" && normalizedCategory ? `/notes/${normalizedCategory}/${slug}` : `/blog/${slug}`;

  return {
    id: `${type}:${normalizedCategory ?? "legacy"}:${slug}`,
    slug,
    title,
    date,
    excerpt,
    tags,
    readingTime: getReadingTime(content),
    type,
    category: normalizedCategory,
    url,
  };
}

function sortByDateDesc(items: ContentMeta[]) {
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllPosts() {
  const files = await readMarkdownFiles(BLOG_DIR);

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = await fs.readFile(path.join(BLOG_DIR, filename), "utf8");
      const { frontmatter, content } = parseMeta(raw);
      return buildMeta({
        sourceSlug: slug,
        frontmatter,
        content,
        type: "blog",
      });
    }),
  );

  return sortByDateDesc(posts);
}

export async function getPostBySlug(slug: string): Promise<ContentPost | null> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const fallbackPath = path.join(BLOG_DIR, `${slug}.mdx`);

  let raw = "";
  try {
    raw = await fs.readFile(fullPath, "utf8");
  } catch {
    try {
      raw = await fs.readFile(fallbackPath, "utf8");
    } catch {
      return null;
    }
  }

  const { frontmatter, content } = parseMeta(raw);
  const meta = buildMeta({
    sourceSlug: slug,
    frontmatter,
    content,
    type: "blog",
  });

  return {
    ...meta,
    content,
    html: await markdownToHtml(content),
    toc: extractToc(content),
  };
}

export async function getAllNotes(options?: { category?: NoteCategory; tag?: string }) {
  const allNotes: ContentMeta[] = [];

  for (const category of noteCategoryOrder) {
    const categoryDir = path.join(NOTES_DIR, category);
    const files = await readMarkdownFiles(categoryDir);

    for (const filename of files) {
      const slug = filename.replace(/\.mdx?$/, "");
      const raw = await fs.readFile(path.join(categoryDir, filename), "utf8");
      const { frontmatter, content } = parseMeta(raw);
      const meta = buildMeta({
        sourceSlug: slug,
        frontmatter,
        content,
        type: "note",
        category,
      });
      allNotes.push(meta);
    }
  }

  let filtered = allNotes;
  if (options?.category) {
    filtered = filtered.filter((item) => item.category === options.category);
  }
  if (options?.tag) {
    filtered = filtered.filter((item) => item.tags.includes(options.tag as string));
  }

  return sortByDateDesc(filtered);
}

export async function getNoteByCategoryAndSlug(category: NoteCategory, slug: string): Promise<ContentPost | null> {
  const categoryDir = path.join(NOTES_DIR, category);
  const files = await readMarkdownFiles(categoryDir);
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  for (const filename of files) {
    const fileSlug = filename.replace(/\.mdx?$/, "");
    const raw = await fs.readFile(path.join(categoryDir, filename), "utf8");
    const { frontmatter, content } = parseMeta(raw);
    const resolvedSlug = resolveNoteSlug(frontmatter, fileSlug);

    if (resolvedSlug !== decodedSlug) {
      continue;
    }

    const meta = buildMeta({
      sourceSlug: fileSlug,
      frontmatter,
      content,
      type: "note",
      category,
    });

    return {
      ...meta,
      content,
      html: await markdownToHtml(content),
      toc: extractToc(content),
    };
  }

  return null;
}

export async function getAllNotesParams() {
  const notes = await getAllNotes();
  return notes
    .filter((note) => note.category)
    .map((note) => ({
      category: note.category as NoteCategory,
      slug: note.slug,
    }));
}

export async function getAllNoteTags(category?: NoteCategory) {
  const notes = await getAllNotes(category ? { category } : undefined);
  const tagSet = new Set(notes.flatMap((note) => note.tags));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

export async function getAllContents() {
  const [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);
  return sortByDateDesc([...posts, ...notes]);
}
