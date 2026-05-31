import type { MetadataRoute } from "next";
import { getAllNotes, getAllPosts } from "@/lib/posts";
import { noteCategoryOrder } from "@/data/notes";
import { siteConfig } from "@/data/site";
import { getPublishedPosts } from "@/lib/blog/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/blog", "/books", "/notes", "/projects", "/write", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  const [notes, posts, databasePosts] = await Promise.all([getAllNotes(), getAllPosts(), getPublishedPosts()]);

  const categoryRoutes = noteCategoryOrder.map((category) => ({
    url: `${siteConfig.url}/notes/${category}`,
    lastModified: new Date(),
  }));

  const tagRoutes = Array.from(new Set(notes.flatMap((note) => note.tags))).map((tag) => ({
    url: `${siteConfig.url}/notes/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
  }));

  const categoryTagRoutes = Array.from(
    new Set(notes.filter((note) => note.category).flatMap((note) => note.tags.map((tag) => `${note.category}\u0000${tag}`))),
  ).map((item) => {
    const [category, tag] = item.split("\u0000");
    return {
      url: `${siteConfig.url}/notes/${category}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
    };
  });

  const noteRoutes = notes.map((note) => ({
    url: `${siteConfig.url}${note.url}`,
    lastModified: new Date(note.date),
  }));

  const legacyBlogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}${post.url}`,
    lastModified: new Date(post.date),
  }));

  const databaseBlogRoutes = databasePosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...tagRoutes,
    ...categoryTagRoutes,
    ...noteRoutes,
    ...legacyBlogRoutes,
    ...databaseBlogRoutes,
  ];
}
