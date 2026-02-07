import Link from "next/link";
import { Metadata } from "next";
import {
  Scale,
  Github,
  Handshake,
  BookOpen,
  Code,
  Home,
  CheckCircle2,
  GitFork,
  Terminal,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Licensing Information - FlagForge CTF Platform",
  description:
    "FlagForge is open source under GPL-3.0. Learn your rights to use, modify, and distribute the CTF platform.",
  keywords: [
    "GPL-3.0",
    "open source",
    "software license",
    "FlagForge license",
    "CTF open source",
    "free software",
    "Nepal cybersecurity open source",
  ],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "FlagForge Licensing - GPL-3.0 Open Source",
    description:
      "FlagForge is open source under GPL-3.0. Free to use, modify, and distribute with full source code access on GitHub.",
    url: "https://flagforgectf.com/licensing",
    type: "website",
    siteName: "FlagForge",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "FlagForge Licensing - GPL-3.0 Open Source",
    description: "Open source CTF platform under GPL-3.0. Free to use, modify, and contribute.",
  },
  alternates: {
    canonical: "/licensing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Licensing() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Open Source</span>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 dark:text-white">
              Licensing <span className="text-red-400 dark:text-red-500">Information</span>
            </h1>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
              FlagForge is open source software released under the GNU General Public License
            </p>
            <h3 className="sr-only">FlagForge Licensing Summary</h3>
            <h4 className="sr-only">GPL-3.0 rights and open source terms</h4>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-red-600/5 to-orange-500/5 blur-3xl opacity-50 pointer-events-none" />

          <div className="relative bg-white/60 dark:bg-white/[0.02] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] space-y-16">

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <ShieldCheck className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">GPL-3.0 License</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed font-medium">
                  FlagForge is licensed under the GNU General Public License v3.0.
                  This means you are free to use, modify, and distribute the software,
                  but you must:
                </p>
                <ul className="grid gap-4">
                  {[
                    "Disclose your source code when distributing modified versions",
                    "License your modifications under the same GPL-3.0 license",
                    "Include copyright notices and license text",
                    "State significant changes made to the original code"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-5 h-5 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500 group-hover/item:text-white transition-all text-red-500">
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
                <Handshake className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Your Rights</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed font-medium">
                  Under the GPL-3.0 license, you have the freedom to:
                </p>
                <ul className="grid gap-4">
                  {[
                    "Use the software for any purpose, including commercially",
                    "Study how the program works and modify it",
                    "Distribute original or modified versions",
                    "Contribute back to the original project"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <div className="mt-1 w-5 h-5 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-red-500 group-hover/item:text-white transition-all text-red-500">
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
                <BookOpen className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Third-Party Components</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                FlagForge may include third-party open source components that are
                subject to their own licenses. All compatible licenses are respected
                and attribution is provided where required.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                <Code className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tighter uppercase dark:text-white">Getting the Source Code</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                The complete source code for FlagForge is available on GitHub. You
                can access, fork, and contribute to the project through our
                repository. We welcome contributions from the community!
              </p>
            </section>

          </div>
        </div>

        {/* Action Links */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="https://github.com/FlagForgeCTF/flagForge"
            target="_blank"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-[0.2em] text-gray-700 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all text-center flex items-center justify-center gap-2 group"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>GitHub Repo</span>
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
