import { SignUp } from "@clerk/nextjs";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <section className="section-space">
        <Container>
          <div className="surface-card max-w-xl p-8 text-sm text-[var(--muted)]">
            请先在 Vercel 配置 Clerk 环境变量，再启用 GitHub 登录。
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-space">
      <Container className="flex justify-center">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </Container>
    </section>
  );
}
