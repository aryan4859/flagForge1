import Link from "next/link";
import { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Home
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - FlagForge CTF Platform",
  description:
    "Get in touch with FlagForge. Contact us via email at info@flagforge.xyz, phone at +977 9828137085, or visit us in Lalitpur, Nepal. We'd love to hear from you!",
  keywords: ["contact FlagForge", "CTF support", "cybersecurity help", "FlagForge team", "Nepal CTF"],
  authors: [{ name: "FlagForge Team" }],
  openGraph: {
    title: "Contact FlagForge - Get in Touch",
    description:
      "Contact the FlagForge team for inquiries, support, or collaboration opportunities.",
    url: "https://flagforge.xyz/contact",
    type: "website",
    siteName: "FlagForge",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Contact FlagForge - Get in Touch",
    description: "Reach out to the FlagForge team for support, inquiries, or collaboration.",
  },
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-950 dark:text-white pb-16 relative overflow-hidden flex items-center justify-center p-4 lg:p-8">

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-red-600/5 dark:bg-red-600/[0.03] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-2%] w-[30%] h-[30%] bg-red-600/5 dark:bg-red-600/[0.03] rounded-full blur-[100px]" />        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] dark:opacity-[0.04]" />
      </div>

      <div className="relative z-10 w-[80%] animate-in fade-in zoom-in-95 duration-700">

        {/* Compact Glass Dashboard */}
        <div className="relative bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl shadow-black/5 overflow-hidden">

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            {/* Left Column: Header & Info */}
            <div className="p-8 lg:p-16 bg-gray-50/50 dark:bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 space-y-12">

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
                  Contact <span className="text-red-500">Us</span>
                </h1>
                <p className="text-base font-medium text-gray-500 dark:text-gray-400 max-w-sm">
                  Get in touch with us. We'd love to hear from you!
                </p>
              </div>

              <div className="space-y-8">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500/80">Get in Touch</h2>
                <div className="grid gap-8">
                  {[
                    { icon: Mail, label: "Email", value: "info@flagforge.xyz", href: "mailto:info@flagforge.xyz" },
                    { icon: Phone, label: "Phone", value: "+977 9828137085", href: "tel:+9779828137085" },
                    { icon: MapPin, label: "Address", value: "Lalitpur, 44600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 group">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-red-500 border border-gray-100 dark:border-white/5 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-base font-bold text-gray-900 dark:text-gray-200 hover:text-red-500 transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-base font-bold text-gray-900 dark:text-gray-200">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link href="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-red-500 transition-all group">
                  <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="p-8 lg:p-16 space-y-10">
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                Send us a Message
              </h2>

              <form className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 ml-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      className="w-full bg-gray-50/50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 ml-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      className="w-full bg-gray-50/50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 ml-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message here..."
                    className="w-full bg-gray-50/50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-red-600/20 text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 group active:scale-[0.98] transition-all"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}