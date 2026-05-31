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
  "以阅读训练判断，以跑步训练耐力，以写作训练清晰。在 AI 时代，真实感是最稀缺的能力。";

export const currentBooks: BookItem[] = [
  {
    title: "九诗心",
    author: "",
    progress: "阅读中",
    note: "这本书给我的提醒是：技术越快，人的真实感越珍贵。",
  },
  {
    title: "穷查理宝典",
    author: "Peter Kaufman (ed.)",
    progress: "重读中",
    note: "多元思维模型只有真正改变决策时，才算被理解。",
  },
  {
    title: "当我谈跑步时，我谈些什么",
    author: "Haruki Murakami",
    progress: "已读",
    note: "长期主义不是口号，是每天重复的朴素动作。",
  },
];

export const heartNotes: HeartNote[] = [
  {
    date: "2026-03-14",
    text: "在 AI 时代，更重要的是保持真实感。",
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
    title: "开始公众号长期写作",
    description: "在个人公众号「小通的书房」持续发布长文。",
  },
  {
    year: "2025-2026",
    title: "创办并主理播客《求是 56Hz》",
    description: "跑通选题、录制、剪辑、发布的完整流程，持续更新节目。",
  },
  {
    year: "2026",
    title: "上线个人网站",
    description: "建立一个可长期沉淀的空间，集中记录读书、笔记、心里话和经历。",
  },
];
