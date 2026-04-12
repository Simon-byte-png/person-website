export type NavigationItem = {
  href: string;
  label: string;
};

export const siteConfig = {
  title: "Samuel 个人网站",
  description: "一个用于读书、写作、思考与长期成长记录的个人空间。",
  url: "https://simon-byte-png.github.io/person-website",
  locale: "zh-CN",
  navigation: [
    { href: "/", label: "首页" },
    { href: "/about", label: "关于" },
    { href: "/books", label: "读书" },
    { href: "/notes", label: "笔记" },
    { href: "/projects", label: "做过的事" },
    { href: "/write", label: "写作入口" },
    { href: "/contact", label: "联系" },
  ] as NavigationItem[],
  footerNote: "这个站点会长期更新。每次提交到 GitHub 后会自动发布到线上。",
};
