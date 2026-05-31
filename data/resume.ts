export type ResumeEntry = {
  period: string;
  title: string;
  organization: string;
  details: string[];
};

export const resumeData = {
  summary:
    "我关注阅读、写作、产品实践与长期成长，把阶段性成果整理到个人网站中。",
  education: [] as ResumeEntry[],
  experience: [] as ResumeEntry[],
  selectedProjects: [] as ResumeEntry[],
  awards: [] as string[],
  skillGroups: [
    {
      label: "Core Stack",
      items: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL"],
    },
    {
      label: "Engineering",
      items: ["API Design", "System Design", "Testing", "Performance", "SEO"],
    },
    {
      label: "Communication",
      items: ["Technical Writing", "Product Thinking", "Documentation"],
    },
  ],
};
