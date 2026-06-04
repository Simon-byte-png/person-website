"use client";

import { useMemo, useState, useTransition } from "react";
import { createPostAction } from "@/app/actions/posts";

type SubmitState = {
  error: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function markdownPreview(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("### ")) {
        return `<h3>${escapeHtml(block.slice(4))}</h3>`;
      }
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      }
      if (block.startsWith("# ")) {
        return `<h1>${escapeHtml(block.slice(2))}</h1>`;
      }
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

export function PostEditorForm() {
  const [state, setState] = useState<SubmitState>({ error: "" });
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const preview = useMemo(() => markdownPreview(content), [content]);

  function submit(formData: FormData) {
    setState({ error: "" });
    startTransition(async () => {
      const result = await createPostAction(formData);
      if (result && !result.ok) {
        setState({ error: result.error });
      }
    });
  }

  return (
    <form action={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="surface-card space-y-5 p-6">
        <label className="space-y-2 block">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">标题</span>
          <input name="title" required className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
        </label>
        <label className="space-y-2 block">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Slug</span>
          <input
            name="slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="my-first-post"
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
          />
        </label>
        <label className="space-y-2 block">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">摘要</span>
          <textarea name="excerpt" required rows={3} className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
        </label>
        <label className="space-y-2 block">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">正文 Markdown</span>
          <textarea
            name="content"
            required
            rows={18}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] px-4 py-2 font-mono text-sm leading-relaxed"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input name="published" type="checkbox" defaultChecked />
          发布
        </label>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <button type="submit" disabled={isPending} className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-white disabled:opacity-50">
          {isPending ? "保存中" : "保存并打开文章"}
        </button>
      </div>

      <div className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">预览</p>
        <div className="markdown mt-5" dangerouslySetInnerHTML={{ __html: preview || "<p>正文预览会显示在这里。</p>" }} />
      </div>
    </form>
  );
}
