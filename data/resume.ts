export type ResumeEntry = {
  period: string;
  title: string;
  organization: string;
  details: string[];
};

export const resumeData = {
  summary:
    "[TO_FILL] I work at the intersection of engineering, writing, and systems thinking. My focus is building practical products with clear structure and long-term maintainability.",
  education: [
    {
      period: "[TO_FILL] 20XX - 20XX",
      title: "[TO_FILL] B.S. in Computer Science",
      organization: "[TO_FILL] University Name",
      details: [
        "[TO_FILL] Relevant coursework: algorithms, distributed systems, HCI.",
        "[TO_FILL] Research direction: applied AI systems / software engineering.",
      ],
    },
  ] as ResumeEntry[],
  experience: [
    {
      period: "[TO_FILL] 20XX - Present",
      title: "[TO_FILL] Developer / Builder",
      organization: "[TO_FILL] Organization / Self-directed",
      details: [
        "[TO_FILL] Built and shipped user-facing features with measurable outcomes.",
        "[TO_FILL] Improved maintainability by introducing typed data contracts and reusable components.",
        "[TO_FILL] Published technical notes to document architecture decisions.",
      ],
    },
    {
      period: "[TO_FILL] 20XX - 20XX",
      title: "[TO_FILL] Intern",
      organization: "[TO_FILL] Team / Company",
      details: [
        "[TO_FILL] Contributed to production code and internal tools.",
        "[TO_FILL] Collaborated with cross-functional stakeholders on delivery milestones.",
      ],
    },
  ] as ResumeEntry[],
  selectedProjects: [
    {
      period: "[TO_FILL] 20XX",
      title: "[TO_FILL] Project Name",
      organization: "[TO_FILL] Personal / Team",
      details: [
        "[TO_FILL] Problem solved and target users.",
        "[TO_FILL] Key architecture and stack choices.",
        "[TO_FILL] Outcome, metrics, or lessons learned.",
      ],
    },
  ] as ResumeEntry[],
  awards: [
    "[TO_FILL] Award / Scholarship / Competition result",
    "[TO_FILL] Publication / Recognition / Fellowship",
  ],
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

