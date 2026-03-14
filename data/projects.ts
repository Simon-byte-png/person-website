export type ProjectStatus = "In Progress" | "Completed";

export type ProjectItem = {
  id: string;
  name: string;
  summary: string;
  stack: string[];
  status: ProjectStatus;
  href: string;
  featured?: boolean;
};

export const projects: ProjectItem[] = [
  {
    id: "thing-1",
    name: "Podcast: Qiu Shi 56Hz",
    summary:
      "Founder and host. Reached episode 5 and ran the full process from topic planning to recording and publishing.",
    stack: ["Podcast", "Interview", "Content Production"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/podcast",
    featured: true,
  },
  {
    id: "thing-2",
    name: "WeChat Official Account: Xiaotong's Study Room",
    summary:
      "Built a personal writing channel and produced deep content, including an article with 100k+ reads.",
    stack: ["Writing", "Newsletter", "Community"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/wechat",
    featured: true,
  },
  {
    id: "thing-3",
    name: "Debate and Community Organizing",
    summary:
      "Organized and participated in debate events, won campus-level champion and best debater recognition.",
    stack: ["Leadership", "Public Speaking", "Execution"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/debate",
    featured: true,
  },
  {
    id: "thing-4",
    name: "AI x Philosophy Exploration",
    summary:
      "Ongoing practice to connect philosophy thinking with AI application, product judgment, and real-life decisions.",
    stack: ["AI", "Philosophy", "Thinking"],
    status: "In Progress",
    href: "[TO_FILL] https://example.com/ai-philosophy",
  },
];
