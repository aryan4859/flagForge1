import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Authprovider from "@/providers/auth-provider";
import { Analytics } from "@vercel/analytics/react";
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flag Forge",
  description:
    "Join FlagForge, the premier Capture The Flag (CTF) platform designed to hone your cybersecurity skills with engaging challenges. Compete, learn, and grow your hacking expertise.",
  metadataBase: new URL("https://flagforge.aryan4.com.np"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      hi: "/hi",
      bn: "/bn",
    },
  },

  applicationName: "FlagForge CTF",
  referrer: "origin-when-cross-origin",
  keywords: [
    "CTF",
    "Capture The Flag",
    "Cybersecurity",
    "Ethical Hacking",
    "FlagForge",
    "CTF Challenges",
    "Hacking Skills",
    "Cybersecurity Platform",
    "Online CTF Competitions",
  ],
  authors: [{ name: "@Aryanstha", url: "https://github.com/aryan4859" }],
  openGraph: {
    title: "FlagForge - The Ultimate CTF Platform",
    description:
      "FlagForge is the go-to platform for Capture The Flag (CTF) competitions. Test your hacking skills with thrilling challenges in cybersecurity.",
    url: "https://flagforge.aryan4.com.np",
    siteName: "FlagForge",
    images: [
      {
        url: "https://flagforge.aryan4.com.np/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FlagForge - Capture The Flag Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Aryanstha",
    title: "FlagForge - The Ultimate CTF Platform",
    description:
      "Join FlagForge, the leading Capture The Flag platform to enhance your cybersecurity skills. Compete and learn with exciting CTF challenges.",
    images: ["https://flagforge.aryan4.com.np/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={dmSans.className}>
        <Authprovider>
          <div className="mx-auto grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
            <Navbar />
            {children}
            <Analytics />
            <Footer />
          </div>
        </Authprovider>
      </body>
    </html>
  );
}
