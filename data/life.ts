export type BookItem = {
  title: string;
  author: string;
  progress: string;
  note: string;
};

export type HeartNote = {
  date: string;
  text: string;
};

export type LifeThing = {
  year: string;
  title: string;
  description: string;
};

export const readingPhilosophy =
  "Read for judgment, run for endurance, write for clarity. In the AI era, authenticity matters more.";

export const currentBooks: BookItem[] = [
  {
    title: "九诗心",
    author: "[TO_FILL] Author",
    progress: "Reading",
    note: "What I keep from this book: in the AI era, the rare thing is real feeling.",
  },
  {
    title: "穷查理宝典",
    author: "Peter Kaufman (ed.)",
    progress: "Re-reading",
    note: "Mental models are useful only when they change decisions in real life.",
  },
  {
    title: "当我谈跑步时，我谈些什么",
    author: "Haruki Murakami",
    progress: "Finished",
    note: "Daily discipline is a long conversation with yourself.",
  },
];

export const heartNotes: HeartNote[] = [
  {
    date: "2026-03-14",
    text: "在AI时代，更重要的是保持真实感。",
  },
  {
    date: "2026-03-09",
    text: "I do not want to be fast at everything. I want to be accurate in what matters.",
  },
  {
    date: "2026-03-03",
    text: "Silence is not empty. It is where long-term ideas are formed.",
  },
];

export const lifeTimeline: LifeThing[] = [
  {
    year: "2025",
    title: "Started publishing in WeChat Official Account",
    description: "Published long-form writing in the personal account 'Xiaotong's Study Room'.",
  },
  {
    year: "2025-2026",
    title: "Hosted the podcast 'Qiu Shi 56Hz'",
    description: "Built a complete podcast workflow and continued episode production.",
  },
  {
    year: "2026",
    title: "Launched this personal inner studio",
    description: "A long-term space for books, blog posts, inner notes, and things done.",
  },
];
