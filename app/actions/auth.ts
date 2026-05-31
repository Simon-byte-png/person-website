"use server";

import { getCurrentAppUser } from "@/lib/auth";

export async function syncCurrentUserAction() {
  const user = await getCurrentAppUser();
  return { ok: Boolean(user) };
}
