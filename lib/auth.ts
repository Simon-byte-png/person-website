import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { isAdminEmail } from "@/lib/admin";
import { getDb, hasDatabase } from "@/lib/db";
import { users } from "@/lib/db/schema";

export function isClerkConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export async function getCurrentClerkUserId() {
  if (!isClerkConfigured()) {
    return null;
  }

  try {
    const session = await auth();
    return session.userId ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentAppUser() {
  if (!isClerkConfigured() || !hasDatabase()) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const githubAccount = clerkUser.externalAccounts.find((account) => account.provider === "github");
  const email = clerkUser.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  if (!email) {
    return null;
  }

  const username =
    clerkUser.username ||
    githubAccount?.username ||
    clerkUser.fullName ||
    email.split("@")[0] ||
    "GitHub 用户";

  const userValues = {
    id: clerkUser.id,
    clerkUserId: clerkUser.id,
    email,
    username,
    imageUrl: clerkUser.imageUrl || null,
    updatedAt: new Date(),
  };

  const db = getDb();
  const [user] = await db
    .insert(users)
    .values({
      ...userValues,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: userValues,
    })
    .returning();

  return user;
}

export async function getAppUserByClerkId(clerkUserId: string) {
  if (!hasDatabase()) {
    return null;
  }

  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  return user ?? null;
}

export async function getCurrentUserContext() {
  const user = await getCurrentAppUser();
  return {
    user,
    isAdmin: isAdminEmail(user?.email),
  };
}

export async function requireUser() {
  const user = await getCurrentAppUser();
  if (!user) {
    return { ok: false as const, error: "请先登录" };
  }
  return { ok: true as const, user };
}

export async function requireAdmin() {
  const userResult = await requireUser();
  if (!userResult.ok) {
    return userResult;
  }
  if (!isAdminEmail(userResult.user.email)) {
    return { ok: false as const, error: "只有管理员可以执行此操作" };
  }
  return { ok: true as const, user: userResult.user };
}
