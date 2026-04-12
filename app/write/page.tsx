import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { QuickEntryForm } from "@/components/write/quick-entry-form";

export const metadata: Metadata = {
  title: "写作入口",
  description: "粘贴文字，自动生成 markdown 草稿并快速发布。",
};

export default function WritePage() {
  return (
    <>
      <PageHero
        eyebrow="Write"
        title="快速导入文字"
        description="把想法粘贴进来，自动生成可发布格式，降低记录门槛。"
      />
      <section className="section-space pt-4">
        <Container className="space-y-6">
          <article className="surface-card p-6 text-sm leading-relaxed text-[var(--muted)]">
            非技术用法：把文本贴进来，点复制，然后发给我或直接存进仓库，就能上线到网站。
          </article>
          <div className="surface-card p-6 md:p-8">
            <QuickEntryForm />
          </div>
        </Container>
      </section>
    </>
  );
}

