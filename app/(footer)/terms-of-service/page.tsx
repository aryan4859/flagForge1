import Link from "next/link";
import { Metadata } from "next";
import {
  Shield,
  FileText,
  Terminal,
  UserCheck,
  Layout,
  Scale,
  AlertCircle,
  Edit,
  Mail,
  Home,
  CheckCircle2,
  Lock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - FlagForge CTF Platform",
  description:
    "Read FlagForge's Terms of Service for CTF platform rules, responsibilities, and user guidelines.",
  keywords: [
    "terms of service",
    "user agreement",
    "terms and conditions",
    "FlagForge terms",
    "CTF rules",
    "Nepal cybersecurity policy",
  ],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "FlagForge Terms of Service",
    description:
      "Review the terms and conditions for using FlagForge CTF platform. Clear guidelines for fair and secure participation.",
    url: "https://flagforgectf.com/terms-of-service",
    type: "website",
    siteName: "FlagForge",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "FlagForge Terms of Service",
    description: "Terms and conditions for using the FlagForge CTF platform.",
  },
  alternates: {
    canonical: "/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
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
          <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 dark:text-white">
              Terms of <span className="text-red-400 dark:text-red-500">Service</span>
            </h1>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
              Last updated: October 28, 2025
            </p>
            <h3 className="sr-only">FlagForge Terms Overview</h3>
            <h4 className="sr-only">Usage rules and platform guidelines</h4>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-red-600/5 to-orange-500/5 blur-3xl opacity-50 pointer-events-none" />

          <div className="relative bg-white/60 dark:bg-white/[0.02] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] space-y-16">

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <FileText className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                By accessing and using FlagForge, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <UserCheck className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">2. User Accounts</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. You must:
                </p>
                <ul className="grid gap-4">
                  {[
                    "Provide accurate and complete information when creating an account",
                    "Keep your login credentials secure and confidential",
                    "Notify us immediately of any unauthorized account access",
                    "Be at least 13 years old to create an account"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item text-gray-600 dark:text-gray-300">
                      <div className="mt-1 w-5 h-5 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Terminal className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">3. Acceptable Use</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  You agree to use FlagForge only for lawful purposes and in accordance with these Terms.
                  You shall not:
                </p>
                <ul className="grid gap-4">
                  {[
                    "Attack, compromise, or attempt to gain unauthorized access to the platform infrastructure",
                    "Share challenge solutions or flags publicly during active competitions",
                    "Use automated tools or bots to gain unfair advantages",
                    "Engage in cheating, collusion, or any form of dishonest behavior",
                    "Harass, abuse, or harm other users",
                    "Distribute malware or malicious code"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item text-gray-600 dark:text-gray-400">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                        <AlertCircle className="w-3 h-3" />
                      </div>
                      <span className="font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Shield className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">4. CTF Challenge Guidelines</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  When participating in challenges:
                </p>
                <ul className="grid gap-4">
                  {[
                    "Challenge infrastructure and other users' systems are off-limits",
                    "Only the designated challenge targets may be tested",
                    "Collaboration is encouraged unless explicitly prohibited for specific challenges",
                    "Report any platform vulnerabilities responsibly to our team"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item text-gray-600 dark:text-gray-300">
                      <div className="mt-1 w-5 h-5 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                        <Terminal className="w-3 h-3" />
                      </div>
                      <span className="font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">5. Intellectual Property</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                All content, challenges, and materials on FlagForge are protected by intellectual property rights.
                FlagForge is licensed under GPL-3.0, allowing you to use, modify, and distribute the platform
                according to the license terms. Challenge content remains the property of their respective creators.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">6. Termination</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We reserve the right to suspend or terminate your account at any time for violations of these
                Terms of Service, suspicious activity, or any behavior that compromises the platform's integrity
                or security. You may also delete your account at any time.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">7. Disclaimer of Warranties</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                FlagForge is provided "as is" without warranties of any kind, either express or implied.
                We do not guarantee uninterrupted or error-free service. Use of the platform is at your own risk.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Scale className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">8. Limitation of Liability</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                FlagForge and its operators shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use or inability to use the platform.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Edit className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">9. Changes to Terms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                We may update these Terms of Service periodically. Continued use of the platform after changes
                constitutes acceptance of the revised terms. We will notify users of significant changes via
                email or platform announcements.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Mail className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">10. Contact Information</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                For questions about these Terms of Service, please contact us at{" "}
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

        {/* Action Links */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/privacy-policy"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all text-center"
          >
            Privacy Policy
          </Link>
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
