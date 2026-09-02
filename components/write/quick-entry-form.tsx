"use client";

import { useMemo, useState } from "react";
import { noteCategoryConfig, noteCategoryOrder, type NoteCategory } from "@/data/notes";

type EntryType = "note" | "blog";

const entryTypeOptions: Array<{ value: EntryType; label: string; hint: string }> = [
  { value: "note", label: "笔记", hint: "推荐，进入 Notes 分类体系" },
  { value: "blog", label: "旧版博客", hint: "兼容历史结构" },
];

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug || "entry";
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildMarkdown({
  type,
  category,
  title,
  date,
  tags,
  body,
}: {
  type: EntryType;
  category: NoteCategory;
  title: string;
  date: string;
  tags: string;
  body: string;
}) {
  const parsedTags = tags
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const excerpt = body.split(/\n+/).find((line) => line.trim())?.slice(0, 120) || "";

  const lines = ["---", `title: "${title || "未命名"}"`, `date: "${date}"`, `type: "${type}"`];

  if (type === "note") {
    lines.push(`category: "${category}"`);
  }

  lines.push(`excerpt: "${excerpt.replace(/"/g, "'")}"`);
  lines.push(`tags: [${parsedTags.map((tag) => `"${tag}"`).join(", ")}]`);
  lines.push("---", "");

  return `${lines.join("\n")}${body || "在这里写正文。"}\n`;
}

export function QuickEntryForm() {
  const [type, setType] = useState<EntryType>("note");
  const [category, setCategory] = useState<NoteCategory>("journey");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayDate());
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const suggestedPath = useMemo(() => {
    const slug = slugify(title);
    if (type === "note") {
      return `content/notes/${category}/${slug}.md`;
    }
    return `content/blog/${slug}.md`;
  }, [type, category, title]);

  const markdown = useMemo(() => {
    return buildMarkdown({ type, category, title, date, tags, body });
  }, [type, category, title, date, tags, body]);

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${date}-${slugify(title)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">内容类型</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as EntryType)}
            className="form-field w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
          >
            {entryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.hint}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">日期</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="form-field w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
          />
        </label>
      </div>

      {type === "note" ? (
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">笔记分类</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as NoteCategory)}
            className="form-field w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
          >
            {noteCategoryOrder.map((item) => (
              <option key={item} value={item}>
                {noteCategoryConfig[item].label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">标题</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="给这段内容起一个标题"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">标签（逗号分隔）</span>
        <input
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="读书, 思考, 生活"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">正文</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={12}
          placeholder="把你的文字粘贴在这里..."
          className="form-field w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm leading-relaxed text-[var(--ink)]"
        />
      </label>

      <div className="surface-card space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">建议保存路径</p>
        <p className="font-mono text-sm text-[var(--ink)]">{suggestedPath}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyMarkdown}
          className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-deep)]"
        >
          {copied ? "已复制" : "复制 Markdown"}
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-deep)]"
        >
          下载 .md 文件
        </button>
      </div>

      <div className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">生成结果预览</p>
        <pre className="mt-3 max-h-[340px] overflow-auto rounded-xl border border-[var(--border)] bg-[#111827] p-4 text-xs text-[#e5e7eb]">
          <code>{markdown}</code>
        </pre>
      </div>
    </div>
  );
}
