import Link from "next/link";

export default function Contact() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700">
          Contact <span className="text-rose-500">Us</span>
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-3xl">
          Get in touch with us. We'd love to hear from you!
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg shadow-gray-200/60 border border-gray-200/80 p-8 backdrop-blur-[150px]">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Get in Touch</h2>

            <div className="flex items-start gap-4">
              <div className="bg-rose-100 p-3 rounded-lg">
                <span className="text-rose-500 text-xl">📧</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600">info@flagforge.xyz</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-rose-100 p-3 rounded-lg">
                <span className="text-rose-500 text-xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-600">+977 9828137085</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-rose-100 p-3 rounded-lg">
                <span className="text-rose-500 text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Address</h3>
                <p className="text-gray-600">Lalitpur, 44600</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">
              Send us a Message
            </h2>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-rose-500 hover:bg-rose-700 rounded-lg px-8 py-4 text-white text-center font-bold text-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
