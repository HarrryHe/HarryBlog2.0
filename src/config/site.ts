export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  canonicalUrl: string;
  name: string;
  displayName: string;
  handle: string;
  description: string;
  githubUsername: string;
  navigation: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  socialLinks: SocialLink[];
  giscus: {
    repo: "HarrryHe/HarryBlog2.0";
    repoId: string;
    category: string;
    categoryId: string;
  };
}

export const siteConfig: SiteConfig = {
  canonicalUrl: "https://harry-blog2-0.vercel.app",
  name: "Harry",
  displayName: "Jiacheng (Harry) He",
  handle: "HarrryHe",
  description:
    "Jiacheng (Harry) He writes about software, systems, and the process of learning in public.",
  githubUsername: "HarrryHe",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Archive", href: "/archive" },
    {
      label: "GitHub",
      href: "https://github.com/HarrryHe",
      external: true
    }
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/HarrryHe" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jiacheng-he-harry"
    },
    { label: "LeetCode", href: "https://leetcode.com/u/qHJyxyWVgR/" },
    { label: "Bilibili", href: "https://space.bilibili.com/678613973" },
    { label: "Email", href: "mailto:harryhe@bu.edu" }
  ],
  giscus: {
    repo: "HarrryHe/HarryBlog2.0",
    repoId: "R_kgDOTi0NbA",
    category: "Chat Section",
    categoryId: "DIC_kwDOTi0NbM4DB6pG"
  }
};
