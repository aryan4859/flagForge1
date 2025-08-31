import Link from "next/link";

export default function About() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8 py-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100 transition-colors duration-300">
          About{" "}
          <span className="text-rose-500 dark:text-rose-500 font-bold">
            FlagForge
          </span>
        </h1>

        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl transition-colors duration-300">
          FlagForge is a dynamic and engaging CTF platform dedicated to
          promoting
          <span className="text-rose-500 dark:text-rose-500 font-bold">
            {" "}
            Cybersecurity{" "}
          </span>
          awareness and fostering a passion for coding among participants.
        </p>
      </div>

      {/* Combined Our Platform and Our Mission Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] transition-colors duration-300">
        {/* Our Platform Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-rose-500 dark:text-rose-500 mb-4 transition-colors duration-300">
              Our Platform 🚀
            </h3>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Our platform has a clean, responsive interface and an easy-to-use
              experience. Flags are securely submitted and efficiently validated
              for fair play. Participants can track scores on a real-time
              leaderboard. Google Authentication allows quick sign-in.
              Challenges can be easily filtered by category and difficulty,
              helping users find content that fits their skills and interests.
            </p>
          </div>

          {/* Platform Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center transition-colors duration-300">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-rose-500 dark:text-rose-500 text-sm mb-1">
                Secure
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-300">
                End-to-end encrypted communication
              </p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center transition-colors duration-300">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-bold text-rose-500 dark:text-rose-500 text-sm mb-1">
                Collaborative
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-300">
                Direct participant-organizer communication
              </p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center transition-colors duration-300">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="font-bold text-rose-500 dark:text-rose-500 text-sm mb-1">
                Global
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-300">
                Worldwide network of participants
              </p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center transition-colors duration-300">
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-bold text-rose-500 dark:text-rose-500 text-sm mb-1">
                Private
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-xs transition-colors duration-300">
                Responsible disclosure practices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Link
          href="/problems"
          className="inline-block bg-rose-500 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-700 rounded-lg px-8 py-4 text-white text-center font-bold text-lg transition-colors duration-300"
        >
          Start Solving Challenges 🚀
        </Link>
      </div>
    </div>
  );
}
