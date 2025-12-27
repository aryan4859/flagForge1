import { Metadata } from "next";
import BlogsClient from "@/components/BlogsClient";

export const metadata: Metadata = {
  title: "FlagForge Blog - Stay Updated on Cybersecurity & CTF Trends",
  description: "Explore the latest cybersecurity insights, CTF challenge write-ups, and tutorials from the FlagForge team. Join our community of security researchers.",
  keywords: ["CTF Blog", "Cybersecurity Tutorials", "Hacking Write-ups", "FlagForge", "Capture The Flag"],
  openGraph: {
    title: "FlagForge Blog - Cybersecurity & CTF Insights",
    description: "Latest insights, tutorials, and stories from the FlagForge team.",
    url: "https://flagforge.xyz/blogs",
    siteName: "FlagForge",
    images: [
      {
        url: "https://flagforge.xyz/flagforge-logo.png",
        width: 1200,
        height: 630,
        alt: "FlagForge Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlagForge Blog - Stay Updated",
    description: "Cybersecurity and CTF insights from FlagForge.",
    images: ["https://flagforge.xyz/flagforge-logo.png"],
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
