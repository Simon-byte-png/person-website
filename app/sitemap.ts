import type { MetadataRoute } from "next";
import { getAllNotes, getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/data/site";
import { getPublishedPosts } from "@/lib/blog/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/blog", "/books", "/notes", "/projects", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  const [notes, posts, databasePosts] = await Promise.all([getAllNotes(), getAllPosts(), getPublishedPosts()]);

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
    ...noteRoutes,
    ...legacyBlogRoutes,
    ...databaseBlogRoutes,
  ];
}
