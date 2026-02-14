import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - FlagForge CTF Platform",
  description:
    "FlagForge cookie policy explains what cookies we use, why we use them, and how you can control them.",
  keywords: [
    "cookie policy",
    "cookies",
    "tracking",
    "browser cookies",
    "FlagForge cookies",
    "privacy",
    "Nepal cybersecurity platform",
  ],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "FlagForge Cookie Policy",
    description:
      "Understand how FlagForge uses cookies to improve your experience and protect your privacy.",
    url: "https://flagforgectf.com/cookie-consent",
    type: "website",
    siteName: "FlagForge",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "FlagForge Cookie Policy",
    description: "Learn about cookies and how we use them on FlagForge.",
  },
  alternates: {
    canonical: "/cookie-consent",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicy() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100">
          Cookie{" "}
          <span className="text-red-400 dark:text-red-500">Policy</span>
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl">
          Last updated: October 28, 2025
        </p>
        <h4 className="sr-only">Cookie usage, categories, and controls</h4>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] space-y-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences, 
            keeping you logged in, and understanding how you use our platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Types of Cookies We Use
          </h2>
          
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-3">
                1. Essential Cookies
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                These cookies are necessary for the platform to function properly. They enable core 
                functionality such as security, authentication, and accessibility.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Authentication cookies:</strong> Keep you logged in to your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Security cookies:</strong> Protect against fraudulent activity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Session cookies:</strong> Maintain your session state</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                These cookies cannot be disabled as they are essential for the platform to work.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-3">
                2. Functional Cookies
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                These cookies remember your preferences and choices to provide enhanced features.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Theme preferences:</strong> Remember your dark/light mode choice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Language settings:</strong> Store your preferred language</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>User preferences:</strong> Save your display and filter settings</span>
                </li>
              </ul>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-3">
                3. Analytics Cookies
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                These cookies help us understand how visitors interact with our platform by collecting 
                anonymous information.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Usage analytics:</strong> Track which pages are visited most often</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>Performance metrics:</strong> Identify and fix technical issues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 dark:text-red-500 mr-2">•</span>
                  <span><strong>User behavior:</strong> Understand how to improve the platform</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            How to Control Cookies
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have several options to manage cookies:
          </p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 mt-1">🌐</span>
              <div>
                <strong className="block mb-1">Browser Settings</strong>
                Most browsers allow you to control cookies through their settings. You can typically 
                block all cookies, accept only certain cookies, or delete cookies after your browsing session.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 mt-1">⚙️</span>
              <div>
                <strong className="block mb-1">Platform Settings</strong>
                You can manage your cookie preferences through your account settings on FlagForge.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 mt-1">🔍</span>
              <div>
                <strong className="block mb-1">Third-Party Tools</strong>
                Browser extensions and privacy tools can help you manage cookies across multiple websites.
              </div>
            </li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
            Note: Disabling essential cookies may prevent you from using certain features of the platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may use third-party services (such as Google Authentication) that set their own cookies. 
            These services have their own privacy policies, and we recommend reviewing them. We do not 
            control these third-party cookies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Cookie Retention
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Different cookies have different lifespans:
          </p>
          <ul className="space-y-2 mt-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span><strong>Session cookies:</strong> Deleted when you close your browser</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2">•</span>
              <span><strong>Persistent cookies:</strong> Remain for a set period (usually up to 1 year)</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may update this Cookie Policy from time to time to reflect changes in technology, 
            legislation, or our practices. We will notify you of any significant changes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have questions about our use of cookies, please contact us at{" "}
            <a 
              href="mailto:info@flagforgectf.com"
              className="text-red-400 dark:text-red-500 font-medium hover:underline"
            >
              info@flagforgectf.com
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
          href="/terms-of-service"
          className="inline-block bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg px-6 py-3 text-gray-700 dark:text-gray-100 text-center font-bold border border-gray-300 dark:border-gray-700 transition-colors duration-300"
        >
          Terms of Service
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
