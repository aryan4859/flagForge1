import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FlagForge Blog",
  description:
    "Read FlagForge blog posts on CTF challenges, cybersecurity tutorials, and competition guides.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "FlagForge Blog",
    description:
      "Read FlagForge blog posts on CTF challenges, cybersecurity tutorials, and competition guides.",
    url: "https://flagforgectf.com/blogs",
    type: "website",
    siteName: "FlagForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlagForge Blog",
    description:
      "Read FlagForge blog posts on CTF challenges, cybersecurity tutorials, and competition guides.",
  },
};

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return children;
}
