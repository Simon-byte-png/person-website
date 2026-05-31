"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { syncCurrentUserAction } from "@/app/actions/auth";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function ClerkUserMenu() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    void syncCurrentUserAction();
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <div className="flex items-center gap-3">
      {!isLoaded ? (
        <span className="text-xs text-[var(--muted)]">加载中</span>
      ) : !isSignedIn ? (
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            GitHub 登录
          </button>
        </SignInButton>
      ) : (
        <>
          <Link href="/me" className="hidden text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)] md:inline">
            个人中心
          </Link>
          <UserButton />
        </>
      )}
    </div>
  );
}

export function UserMenu() {
  if (!clerkEnabled) {
    return (
      <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">
        登录需配置
      </span>
    );
  }

  return <ClerkUserMenu />;
}
