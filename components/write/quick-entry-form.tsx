"use client";

import { useMemo, useState } from "react";

type EntryType = "blog" | "book-note" | "heart-note" | "thing";

const entryTypeOptions: Array<{ value: EntryType; label: string; hint: string }> = [
  { value: "blog", label: "Blog Post", hint: "article draft" },
  { value: "book-note", label: "Book Note", hint: "reading note" },
  { value: "heart-note", label: "Heart Note", hint: "inner note" },
  { value: "thing", label: "Thing Done", hint: "life event" },
];

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug || "entry";
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildMarkdown({
  type,
  title,
  date,
  tags,
  body,
}: {
  type: EntryType;
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

  const frontmatter = [
    "---",
    `title: "${title || "Untitled"}"`,
    `date: "${date}"`,
    `type: "${type}"`,
    `excerpt: "${excerpt.replace(/"/g, "'")}"`,
    `tags: [${parsedTags.map((tag) => `"${tag}"`).join(", ")}]`,
    "---",
    "",
  ].join("\n");

  return `${frontmatter}${body || "Write your content here."}\n`;
}

export function QuickEntryForm() {
  const [type, setType] = useState<EntryType>("blog");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayDate());
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  const suggestedPath = useMemo(() => {
    const slug = slugify(title);
    if (type === "blog") {
      return `content/blog/${slug}.md`;
    }
    return `content/notes/${date}-${slug}.md`;
  }, [type, title, date]);

  const markdown = useMemo(() => {
    return buildMarkdown({ type, title, date, tags, body });
  }, [type, title, date, tags, body]);

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
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as EntryType)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
          >
            {entryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.hint}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
          />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Title</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Give this text a title"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Tags</span>
        <input
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="reading, thinking, life"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)]"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Your Text</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={12}
          placeholder="Paste your text here..."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm leading-relaxed text-[var(--ink)]"
        />
      </label>

      <div className="surface-card space-y-3 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Suggested File Path</p>
        <p className="font-mono text-sm text-[var(--ink)]">{suggestedPath}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyMarkdown}
          className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm text-white transition-colors hover:bg-black"
        >
          {copied ? "Copied" : "Copy Markdown"}
        </button>
        <button
          type="button"
          onClick={downloadMarkdown}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm text-[var(--ink)] hover:border-[var(--ink)]"
        >
          Download .md
        </button>
      </div>

      <div className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Generated Markdown</p>
        <pre className="mt-3 max-h-[340px] overflow-auto rounded-xl border border-[var(--border)] bg-[#111827] p-4 text-xs text-[#e5e7eb]">
          <code>{markdown}</code>
        </pre>
      </div>
    </div>
  );
}

