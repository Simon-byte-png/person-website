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

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
};

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
};

export type Post = PostMeta & {
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
    const depth = match[1] === "##" ? 2 : 3;
    const text = match[2].replace(/[*_`~]/g, "").trim();
    items.push({
      id: slugger.slug(text),
      text,
      level: depth,
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

function parsePostMeta(slug: string, raw: string): { meta: PostMeta; content: string } {
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  const title = frontmatter.title ?? "Untitled Post";
  const date = frontmatter.date ?? "1970-01-01";
  const excerpt = frontmatter.excerpt ?? "";
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

  return {
    meta: {
      slug,
      title,
      date,
      excerpt,
      tags,
      readingTime: getReadingTime(content),
    },
    content,
  };
}

export async function getAllPosts() {
  const files = await fs.readdir(BLOG_DIR);
  const markdownFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

  const posts = await Promise.all(
    markdownFiles.map(async (filename) => {
      const slug = filename.replace(/\.mdx?$/, "");
      const fullPath = path.join(BLOG_DIR, filename);
      const raw = await fs.readFile(fullPath, "utf8");
      const { meta } = parsePostMeta(slug, raw);
      return meta;
    }),
  );

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getAllTags() {
  const posts = await getAllPosts();
  const uniqueTags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(uniqueTags).sort((a, b) => a.localeCompare(b));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
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

  const { meta, content } = parsePostMeta(slug, raw);
  const html = await markdownToHtml(content);
  const toc = extractToc(content);

  return {
    ...meta,
    content,
    html,
    toc,
  };
}
