import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Github } from "lucide-react";
import logo from "/public/flagforge-logo.png";

export default function Footer() {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/flagforge/",
      icon: <Linkedin className="w-5 h-5 text-[#0077B5]" />, // LinkedIn blue
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/flag.forge/",
      icon: <Instagram className="w-5 h-5 text-[#E4405F]" />, // Instagram pink
    },
    {
      name: "GitHub",
      url: "https://github.com/FlagForgeCTF/",
      icon: <Github className="w-5 h-5 text-[#181717] dark:text-[#ffffff]" />, // GitHub black/white
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 rounded-lg m-4">
      <div className="w-full max-w-screen-2xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image src={logo} alt="logo" height={70} width={70} />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100 transition-colors duration-300">
              FlagForge
            </span>
          </Link>

          {/* Social Media Icons in the middle */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                aria-label={`Visit our ${social.name} page`}
              >
                {social.icon}
              </Link>
            ))}
          </div>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0 transition-colors duration-300">
            <li>
              <Link href="/about" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            
            <li>
              <Link href="/resources" className="hover:underline me-4 md:me-6">
                Resources
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline me-4 md:me-6">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:underline me-4 md:me-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/licensing" className="hover:underline">
                Licensing
              </Link>
            </li>
            
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-3 transition-colors duration-300" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center transition-colors duration-300">
          © Maintained By{" "}
          <Link href="https://www.linkedin.com/company/shyenasec/" className="hover:underline">
            Shyena Inc.
          </Link>
        </span>
      </div>
    </footer>
  );
}
