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
    name: "播客《求是 56Hz》",
    summary:
      "创办并主理播客，已更新至第 5 期，完整跑通从选题到上线的全流程。",
    stack: ["播客", "访谈", "内容生产"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/podcast",
    featured: true,
  },
  {
    id: "thing-2",
    name: "公众号「小通的书房」",
    summary:
      "搭建个人写作栏目并持续输出深度内容，曾产出 10w+ 阅读文章。",
    stack: ["写作", "公众号", "社群"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/wechat",
    featured: true,
  },
  {
    id: "thing-3",
    name: "辩论与社群活动组织",
    summary:
      "组织并参与辩论赛与分享活动，获得校级冠军与“最佳辩手”称号。",
    stack: ["组织力", "表达", "执行力"],
    status: "Completed",
    href: "[TO_FILL] https://example.com/debate",
    featured: true,
  },
  {
    id: "thing-4",
    name: "AI × 哲学实践探索",
    summary:
      "持续将哲学思考方式应用到 AI 工具实践、产品判断与日常决策中。",
    stack: ["AI", "哲学", "思考方法"],
    status: "In Progress",
    href: "[TO_FILL] https://example.com/ai-philosophy",
  },
];
