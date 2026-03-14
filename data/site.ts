export type NavigationItem = {
  href: string;
  label: string;
};

export const siteConfig = {
  title: "Samuel Personal Website",
  description:
    "A calm personal space for books, thoughts, writing, and lived work.",
  url: "https://example.com",
  locale: "en-US",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/books", label: "Books" },
    { href: "/blog", label: "Blog" },
    { href: "/projects", label: "Things" },
    { href: "/write", label: "Write" },
    { href: "/contact", label: "Contact" },
  ] as NavigationItem[],
  footerNote:
    "Built as a long-term personal notebook. Replace [TO_FILL] fields in /data and keep writing.",
};
