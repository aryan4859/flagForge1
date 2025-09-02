import Link from "next/link";
import { Linkedin, Instagram, Github, Mail } from "lucide-react";

export default function Socials() {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/flagforge/",
      icon: <Linkedin className="w-6 h-6 text-[#0077B5]" />, // LinkedIn blue
      color: "hover:text-[#0077B5] dark:hover:text-[#0077B5]",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/flag.forge/",
      icon: <Instagram className="w-6 h-6 text-[#E4405F]" />, // Instagram pink
      color: "hover:text-[#E4405F] dark:hover:text-[#E4405F]",
    },
    {
      name: "GitHub",
      url: "https://github.com/FlagForgeCTF/",
      icon: <Github className="w-6 h-6 text-[#181717]" />, // GitHub black
      color: "hover:text-[#181717] dark:hover:text-[#ffffff]",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-8 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
          Connect With Us
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          Follow us on social media to stay updated with the latest challenges,
          cybersecurity tips, and community events.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl ${social.color}`}
            aria-label={`Visit our ${social.name} page`}
          >
            <div className="transition-colors duration-300">{social.icon}</div>
            <span className="mt-3 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              {social.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
          Have questions or want to collaborate?
        </p>
        <Link
          href="mailto:info@flagforge.xyz"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-400 dark:bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300 font-medium"
        >
          <Mail className="w-5 h-5" />
          Contact Us
        </Link>
      </div>
    </div>
  );
}
