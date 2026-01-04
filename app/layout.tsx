import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Authprovider from "@/providers/auth-provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "FlagForge - The Ultimate CTF Platform",
  description:
    "Join FlagForge, the premier Capture The Flag (CTF) platform designed to hone your cybersecurity skills with engaging challenges. Compete, learn, and grow your hacking expertise.",
  metadataBase: new URL("https://flagforge.xyz"),
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
    "Nepal CTF",
    "CTF Platform",
    "Security Challenges",
    "Learn Hacking",
    "CTF Community",
    "Cybersecurity Learning",
    "CTF Events",
  ],
  authors: [{ name: "@Aryanstha", url: "https://github.com/aryan4859" }],
  publisher: "FlagForge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  other: {
    "google-adsense-account": "ca-pub-2506540900080142",
  },
  openGraph: {
    title: "FlagForge - The Ultimate CTF Platform",
    description:
      "FlagForge is the go-to platform for Capture The Flag (CTF) competitions. Test your hacking skills with thrilling challenges in cybersecurity.",
    url: "https://flagforge.xyz",
    siteName: "FlagForge",
    images: [
      {
        url: "/flagforge.gif",
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
    images: ["/flagforge.gif"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased transition-colors duration-300 bg-white dark:bg-gray-900 overflow-x-hidden sm:overflow-x-visible`}
      >
        <ThemeProvider>
          <Authprovider>
            <div className="mx-auto grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
              <Navbar />
              <main className="flex-1">{children}</main>
              {typeof window !== "undefined" && <Analytics />}
              <CookieConsent />
              <Footer />
            </div>
          </Authprovider>
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2506540900080142"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
