import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - FlagForge CTF Platform",
  description:
    "Read FlagForge's Terms of Service. Understand the rules, responsibilities, and guidelines for using our CTF platform. Last updated: October 28, 2025.",
  keywords: ["terms of service", "user agreement", "terms and conditions", "FlagForge terms", "CTF rules"],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "FlagForge Terms of Service",
    description:
      "Review the terms and conditions for using FlagForge CTF platform. Clear guidelines for fair and secure participation.",
    url: "https://flagforge.xyz/terms-of-service",
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
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100">
          Terms of{" "}
          <span className="text-red-400 dark:text-red-500">Service</span>
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl">
          Last updated: October 28, 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] space-y-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            By accessing and using FlagForge, you accept and agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            2. User Accounts
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all 
            activities that occur under your account. You must:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Provide accurate and complete information when creating an account</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Keep your login credentials secure and confidential</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Notify us immediately of any unauthorized account access</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Be at least 13 years old to create an account</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            3. Acceptable Use
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You agree to use FlagForge only for lawful purposes and in accordance with these Terms. 
            You shall not:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Attack, compromise, or attempt to gain unauthorized access to the platform infrastructure</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Share challenge solutions or flags publicly during active competitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Use automated tools or bots to gain unfair advantages</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Engage in cheating, collusion, or any form of dishonest behavior</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Harass, abuse, or harm other users</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Distribute malware or malicious code</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            4. CTF Challenge Guidelines
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            When participating in challenges:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Challenge infrastructure and other users' systems are off-limits</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Only the designated challenge targets may be tested</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Collaboration is encouraged unless explicitly prohibited for specific challenges</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span>Report any platform vulnerabilities responsibly to our team</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            All content, challenges, and materials on FlagForge are protected by intellectual property rights. 
            FlagForge is licensed under GPL-3.0, allowing you to use, modify, and distribute the platform 
            according to the license terms. Challenge content remains the property of their respective creators.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            6. Termination
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to suspend or terminate your account at any time for violations of these 
            Terms of Service, suspicious activity, or any behavior that compromises the platform's integrity 
            or security. You may also delete your account at any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            7. Disclaimer of Warranties
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            FlagForge is provided "as is" without warranties of any kind, either express or implied. 
            We do not guarantee uninterrupted or error-free service. Use of the platform is at your own risk.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            FlagForge and its operators shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages resulting from your use or inability to use the platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            9. Changes to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may update these Terms of Service periodically. Continued use of the platform after changes 
            constitutes acceptance of the revised terms. We will notify users of significant changes via 
            email or platform announcements.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            10. Contact Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            For questions about these Terms of Service, please contact us at{" "}
            <a 
              href="mailto:info@flagforge.xyz"
              className="text-red-400 dark:text-red-500 font-medium hover:underline"
            >
              info@flagforge.xyz
            </a>
          </p>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-8">
        <Link
          href="/privacy-policy"
          className="inline-block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg px-6 py-3 text-gray-700 dark:text-gray-100 text-center font-bold border border-gray-300 dark:border-gray-700 transition-colors duration-300"
        >
          Privacy Policy
        </Link>
        <Link
          href="/"
          className="inline-block bg-red-500 hover:bg-rose-700 dark:bg-red-500 dark:hover:bg-rose-700 rounded-lg px-6 py-3 text-white text-center font-bold transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}