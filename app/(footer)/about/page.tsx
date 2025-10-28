import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FlagForge | CTF Platform for Cybersecurity Learning",
  description: "FlagForge is a dynamic CTF platform dedicated to promoting cybersecurity awareness and fostering a passion for coding. Join our global community of learners and compete in engaging challenges.",
  keywords: ["CTF", "cybersecurity", "capture the flag", "coding challenges", "hacking", "security learning", "FlagForge"],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "About FlagForge | CTF Platform",
    description: "Where curiosity meets cybersecurity. Learn, compete, and grow with our global community.",
    type: "website",
    siteName: "FlagForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "About FlagForge | CTF Platform",
    description: "Where curiosity meets cybersecurity. Learn, compete, and grow with our global community.",
  },
};

export default function About() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100 transition-colors duration-300">
          About{" "}
          <span className="text-red-400 dark:text-red-500 font-bold">
            FlagForge
          </span>
        </h1>

        <p className="text-md text-gray-500 dark:text-gray-400 italic">
          "Where curiosity meets cybersecurity."
        </p>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl transition-colors duration-300">
          FlagForge is a dynamic and engaging CTF platform dedicated to promoting{" "}
          <span className="text-red-400 dark:text-red-500 font-bold">
            Cybersecurity
          </span>{" "}
          awareness and fostering a passion for coding among participants.
        </p>
      </div>

      {/* Platform Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] transition-colors duration-300">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-4 transition-colors duration-300">
              Our Platform
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Our platform features a clean, responsive interface and an easy-to-use
              experience. Flags are securely submitted and efficiently validated for
              fair play. Participants can track scores on a real-time leaderboard.
              With Google Authentication, users can sign in instantly and start
              solving. Challenges can be filtered by category and difficulty,
              helping participants find content that fits their skills and interests.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔒", title: "Secure", desc: "End-to-end encrypted communication" },
              { icon: "👥", title: "Collaborative", desc: "Direct participant-organizer communication" },
              { icon: "🌐", title: "Global", desc: "Worldwide network of participants" },
              { icon: "🔐", title: "Private", desc: "Responsible disclosure practices" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center transition-colors duration-300"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="font-bold text-red-400 dark:text-red-500 text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-10 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              To make cybersecurity learning accessible and engaging through practical
              challenges, collaboration, and gamified experiences that empower learners
              worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-red-400 dark:text-red-500 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              To build a global community where future cybersecurity experts and developers
              learn, compete, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="text-center text-gray-600 dark:text-gray-300 mt-6 px-4">
        <p>
          Built by passionate developers and cybersecurity enthusiasts to help others
          learn, grow, and forge their own path in tech.
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Link
          href="/problems"
          className="inline-block bg-red-500 hover:bg-rose-700 dark:bg-red-500 dark:hover:bg-rose-700 rounded-lg px-8 py-4 text-white text-center font-bold text-lg transition-colors duration-300"
        >
          Start Solving Challenges 🚀
        </Link>
      </div>
    </div>
  );
}