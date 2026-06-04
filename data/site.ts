export type NavigationItem = {
  href: string;
  label: string;
};

export const siteConfig = {
  title: "Samuel 个人网站",
  description: "一个用于读书、写作、思考与长期成长记录的个人空间。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-CN",
  navigation: [
    { href: "/", label: "首页" },
    { href: "/about", label: "关于" },
    { href: "/blog", label: "博客" },
    { href: "/books", label: "读书" },
    { href: "/notes", label: "笔记" },
    { href: "/projects", label: "做过的事" },
    { href: "/contact", label: "联系" },
  ] as NavigationItem[],
  footerNote: "记录阅读、写作、实践与成长。",
};
