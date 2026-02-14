import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldCheck,
  Eye,
  Database,
  Lock,
  Users,
  Globe,
  LineChart,
  Baby,
  RefreshCcw,
  Mail,
  Home,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - FlagForge CTF Platform",
  description:
    "FlagForge privacy policy explains how we collect, use, and protect personal data with strong security practices.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR",
    "user privacy",
    "FlagForge privacy",
    "data security",
    "Nepal cybersecurity privacy",
  ],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "FlagForge Privacy Policy",
    description:
      "Understand how FlagForge handles your data with transparency and security. Your privacy is our priority.",
    url: "https://flagforgectf.com/privacy-policy",
    type: "website",
    siteName: "FlagForge",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "FlagForge Privacy Policy",
    description: "Learn how we protect your data and respect your privacy on FlagForge.",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-950 dark:text-white pb-20 relative overflow-hidden transition-colors duration-500">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-red-600/5 dark:bg-red-600/[0.03] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-2%] w-[30%] h-[30%] bg-red-600/5 dark:bg-red-600/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      </div>

      <div className="relative z-10 w-[92%] lg:w-[75%] max-w-5xl mx-auto pt-28 lg:pt-36">

        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 dark:text-white">
              Privacy <span className="text-red-400 dark:text-red-500">Policy</span>
            </h1>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Last updated: August 28, 2025
            </p>
            <h3 className="sr-only">FlagForge Privacy Practices</h3>
            <h4 className="sr-only">Data collection, usage, and security</h4>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-red-600/5 to-orange-500/5 blur-3xl opacity-50 pointer-events-none" />

          <div className="relative bg-white/60 dark:bg-white/[0.02] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] space-y-16">

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Database className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Information We Collect</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We collect information you provide directly to us, including account
                information (name, email, profile details), vulnerability reports,
                communication with our support team, and usage data.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Eye className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">How We Use Information</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We use your information to provide and maintain our services,
                process vulnerability reports, communicate with you, improve our
                platform, and ensure security. We never sell your personal
                information to third parties.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Data Security</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We implement appropriate security measures including encryption,
                access controls, and regular security audits to protect your
                personal information against unauthorized access or destruction.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Users className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Your Rights</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                You have the right to access, update, or delete your personal
                information, opt out of communications, and export your data. We use
                cookies to enhance your experience, which can be controlled through
                your browser settings.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Globe className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Advertising and Third-Party Services</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p className="leading-relaxed font-medium text-gray-600 dark:text-gray-300">
                  We may use third-party advertising services, including Google AdSense, to display advertisements on our platform. These services may use cookies and similar technologies to serve ads based on your prior visits to our website or other websites.
                </p>

                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-gray-900 dark:text-white font-black uppercase text-sm tracking-tighter">
                    <LineChart className="w-4 h-4 text-red-500" />
                    <span>Google AdSense</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    Google uses cookies to serve ads based on a user's prior visits to our website or other websites. You may opt out of personalized advertising by visiting{" "}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-600 transition-colors inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      Google's Ads Settings <ExternalLink className="w-3 h-3" />
                    </a>.
                  </p>
                </div>

                <p className="leading-relaxed font-medium">
                  Third-party vendors, including Google, use cookies to serve ads based on your past visits to our website. These vendors may collect information about your online activities over time and across different websites.
                </p>

                <p className="leading-relaxed font-medium">
                  You can control cookies through your browser settings and opt-out of interest-based advertising through the{" "}
                  <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 transition-all underline underline-offset-4">Digital Advertising Alliance</a>
                  {" "}or{" "}
                  <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600 transition-all underline underline-offset-4">Network Advertising Initiative</a>.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Baby className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Children's Privacy</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Our services are not intended for children under 13. We do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <RefreshCcw className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Changes & Contact</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We may update this policy periodically. For questions, contact us at{" "}
                <a
                  href="mailto:info@flagforgectf.com"
                  className="text-red-500 hover:text-red-600 transition-colors underline underline-offset-4"
                >
                  info@flagforgectf.com
                </a>
              </p>
            </section>

          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-3 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
