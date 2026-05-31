"use server";

import { revalidatePath } from "next/cache";
import { createPostComment, toggleTargetLike } from "@/lib/interactions/queries";

export async function toggleLike(input: { targetType: "post" | "comment"; targetId: string; postId: string }) {
  const result = await toggleTargetLike(input.targetType, input.targetId, input.postId);
  revalidatePath("/blog", "layout");
  return result;
}

export async function createComment(input: { postId: string; content: string; parentId?: string | null }) {
  const result = await createPostComment(input);
  revalidatePath("/blog", "layout");
  return result;
}
