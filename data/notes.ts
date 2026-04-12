export const noteCategoryConfig = {
  tech: {
    label: "技术笔记",
    description: "工程实践、工具方法、技术拆解。",
  },
  business: {
    label: "商业笔记",
    description: "商业观察、产品判断、策略思考。",
  },
  art: {
    label: "文艺笔记",
    description: "文学、影像、审美与表达。",
  },
  journey: {
    label: "一路走来",
    description: "个人生活、成长体会与阶段复盘。",
  },
} as const;

export type NoteCategory = keyof typeof noteCategoryConfig;

export const noteCategoryOrder: NoteCategory[] = ["tech", "business", "art", "journey"];

export function isNoteCategory(value: string): value is NoteCategory {
  return value in noteCategoryConfig;
}

