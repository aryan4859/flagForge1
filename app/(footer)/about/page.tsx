import Link from "next/link";

export default function About() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700">
          About <span className="text-rose-500">FlagForge</span>
        </h1>

        <p className="text-lg text-center text-gray-600 max-w-3xl">
          FlagForge is a dynamic and engaging CTF platform dedicated to
          promoting
          <span className="text-rose-500 font-bold"> Cybersecurity </span>
          awareness and fostering a passion for coding among participants.
        </p>
      </div>

      {/* Combined Our Platform and Our Mission Section */}
      <div className="bg-white rounded-xl shadow-lg shadow-gray-200/60 border border-gray-200/80 p-8 backdrop-blur-[150px]">
      
        {/* Our Platform Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-rose-500 mb-4">
              Our Platform 🚀
            </h3>
            <p className="text-gray-600">
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
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-bold text-rose-500 text-sm mb-1">Secure</h4>
              <p className="text-gray-600 text-xs">
                End-to-end encrypted communication
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-bold text-rose-500 text-sm mb-1">
                Collaborative
              </h4>
              <p className="text-gray-600 text-xs">
                Direct participant-organizer communication
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🌐</div>
              <h4 className="font-bold text-rose-500 text-sm mb-1">Global</h4>
              <p className="text-gray-600 text-xs">
                Worldwide network of participants
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-bold text-rose-500 text-sm mb-1">Private</h4>
              <p className="text-gray-600 text-xs">
                Responsible disclosure practices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link
          href="/problems"
          className="inline-block bg-rose-500 hover:bg-rose-700 rounded-lg px-8 py-4 text-white text-center font-bold text-lg"
        >
          Start Solving Challenges 🚀
        </Link>
      </div>
    </div>
  );
}
