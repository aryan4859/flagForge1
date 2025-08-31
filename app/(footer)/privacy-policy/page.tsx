import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100">
          Privacy{" "}
          <span className="text-rose-600 dark:text-rose-500">Policy</span>
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl">
          Last updated: August 28, 2025
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] space-y-8 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We collect information you provide directly to us, including account
            information (name, email, profile details), vulnerability reports,
            communication with our support team, and usage data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            How We Use Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We use your information to provide and maintain our services,
            process vulnerability reports, communicate with you, improve our
            platform, and ensure security. We never sell your personal
            information to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Data Security
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We implement appropriate security measures including encryption,
            access controls, and regular security audits to protect your
            personal information against unauthorized access or destruction.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You have the right to access, update, or delete your personal
            information, opt out of communications, and export your data. We use
            cookies to enhance your experience, which can be controlled through
            your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our services are not intended for children under 13. We do not
            knowingly collect personal information from children.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
            Changes & Contact
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may update this policy periodically. For questions, contact us at{" "}
            <span className="text-rose-600 dark:text-rose-500 font-medium">
              contact@aryan4.com.np
            </span>
          </p>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-rose-600 dark:bg-rose-500 hover:bg-rose-700 dark:hover:bg-rose-600 rounded-lg px-8 py-4 text-white text-center font-bold text-lg transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
