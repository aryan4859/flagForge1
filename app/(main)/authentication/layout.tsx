import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In & Sign Up",
  description:
    "Sign in to FlagForge to access CTF challenges, track progress, and compete on the leaderboard.",
};

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
