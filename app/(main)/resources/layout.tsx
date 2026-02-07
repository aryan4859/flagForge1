import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Learning Resources",
  description:
    "Explore FlagForge learning resources and CTF training materials organized by category to build cybersecurity skills.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Learning Resources - FlagForge",
    description:
      "Explore FlagForge learning resources and CTF training materials organized by category to build cybersecurity skills.",
    url: "https://flagforgectf.com/resources",
    type: "website",
    siteName: "FlagForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Resources - FlagForge",
    description:
      "Explore FlagForge learning resources and CTF training materials organized by category to build cybersecurity skills.",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
