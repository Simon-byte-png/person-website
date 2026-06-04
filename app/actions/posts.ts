"use server";

import { redirect } from "next/navigation";
import { createDatabasePost } from "@/lib/blog/repository";
import { requireAdmin } from "@/lib/auth";

export async function createPostAction(formData: FormData) {
  const adminResult = await requireAdmin();
  if (!adminResult.ok) {
    return { ok: false as const, error: adminResult.error };
  }

  const result = await createDatabasePost(
    {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      content: String(formData.get("content") ?? ""),
      tags: "",
      published: formData.get("published") === "on",
    },
    adminResult.user.id,
  );

  if (!result.ok) {
    return result;
  }

  redirect(`/blog/${result.post.slug}`);
}
