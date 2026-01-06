import type { Metadata } from "next";
import type { ReactNode } from "react";

export const generateMetadata = ({
  params,
}: {
  params: { username: string };
}): Metadata => ({
  title: "FlagForge User Profile",
  description:
    "View FlagForge user profiles with CTF rank, badges, and cybersecurity achievements.",
  alternates: {
    canonical: `/user/${params.username}`,
  },
  openGraph: {
    title: "FlagForge User Profile",
    description:
      "View FlagForge user profiles with CTF rank, badges, and cybersecurity achievements.",
    url: `https://flagforge.xyz/user/${params.username}`,
    type: "profile",
    siteName: "FlagForge",
  },
  twitter: {
    card: "summary",
    title: "FlagForge User Profile",
    description:
      "View FlagForge user profiles with CTF rank, badges, and cybersecurity achievements.",
  },
});

export default function PublicUserLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
