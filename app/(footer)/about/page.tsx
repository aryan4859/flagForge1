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

      {/* Educational Purpose & Ethical Hacking Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl shadow-lg p-8 transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚖️</div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-4">
              Educational Purpose & Ethical Hacking
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <strong>FlagForge is designed exclusively for educational purposes.</strong> Our platform provides a safe, legal, and controlled environment for learning cybersecurity concepts, ethical hacking techniques, and problem-solving skills.
              </p>
              <p>
                All challenges and activities on FlagForge are intended to teach responsible security practices. We strictly prohibit the use of knowledge gained on our platform for any illegal activities, unauthorized access to systems, or malicious purposes.
              </p>
              <p>
                By participating in FlagForge challenges, users agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use their skills only for legal and ethical purposes</li>
                <li>Respect the privacy and security of others</li>
                <li>Follow responsible disclosure practices when discovering vulnerabilities</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Never attempt unauthorized access to systems outside our platform</li>
              </ul>
              <p className="font-semibold text-yellow-900 dark:text-yellow-200 mt-4">
                We promote ethical hacking and responsible security research. If you discover a security vulnerability in any system, please follow responsible disclosure practices and report it to the appropriate parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] transition-colors duration-300">
        <h3 className="text-2xl font-bold text-red-400 dark:text-red-500 mb-6 text-center">
          What You'll Learn on FlagForge
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Web Security",
              icon: "🌐",
              skills: ["XSS Prevention", "SQL Injection Defense", "CSRF Protection", "Secure Authentication"]
            },
            {
              title: "Cryptography",
              icon: "🔐",
              skills: ["Encryption Basics", "Hash Functions", "Digital Signatures", "Secure Communication"]
            },
            {
              title: "Network Security",
              icon: "🛡️",
              skills: ["Protocol Analysis", "Packet Inspection", "Firewall Configuration", "Intrusion Detection"]
            },
            {
              title: "Reverse Engineering",
              icon: "🔧",
              skills: ["Binary Analysis", "Debugging Techniques", "Code Decompilation", "Malware Analysis"]
            },
            {
              title: "Forensics",
              icon: "🔍",
              skills: ["Data Recovery", "Log Analysis", "Memory Forensics", "Evidence Collection"]
            },
            {
              title: "Problem Solving",
              icon: "🧩",
              skills: ["Critical Thinking", "Pattern Recognition", "Logical Reasoning", "Creative Solutions"]
            }
          ].map((category, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 transition-colors duration-300 hover:shadow-lg"
            >
              <div className="text-4xl mb-3 text-center">{category.icon}</div>
              <h4 className="font-bold text-red-500 dark:text-red-400 text-lg mb-3 text-center">
                {category.title}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {category.skills.map((skill, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-xl shadow-lg p-8 text-white transition-colors duration-300">
        <h3 className="text-2xl font-bold mb-4 text-center">Join Our Growing Community</h3>
        <p className="text-center text-lg mb-6 max-w-3xl mx-auto">
          Built by passionate developers and cybersecurity enthusiasts, FlagForge is more than just a platform—it's a community dedicated to helping others learn, grow, and forge their own path in technology and cybersecurity.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">1000+</div>
            <div className="text-sm opacity-90">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-sm opacity-90">Challenges Solved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-sm opacity-90">Learning Support</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Link
          href="/problems"
          className="inline-block bg-red-500 hover:bg-rose-700 dark:bg-red-500 dark:hover:bg-rose-700 rounded-lg px-8 py-4 text-white text-center font-bold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Start Solving Challenges 🚀
        </Link>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Free to join • No credit card required • Start learning immediately
        </p>
      </div>
    </div>
  );
}