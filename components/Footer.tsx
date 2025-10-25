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
      icon: <Linkedin className="w-6 h-6 text-[#0077B5]" />, // LinkedIn blue
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/flag.forge/",
      icon: <Instagram className="w-6 h-6 text-[#E4405F]" />, // Instagram pink
    },
    {
      name: "GitHub",
      url: "https://github.com/FlagForgeCTF/",
      icon: <Github className="w-6 h-6 text-[#181717] dark:text-[#ffffff]" />, // GitHub black/white
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 rounded-lg m-2 sm:m-4">
      <div className="w-full max-w-screen-2xl mx-auto p-1">
        {/* Mobile-first layout */}
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
          {/* Logo section */}
          <div className="flex justify-center md:justify-start">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse p-2 sm:p-0 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <Image src={logo} alt="logo" height={60} width={60} className="sm:h-[70px] sm:w-[70px]" />
              <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100 transition-colors duration-300">
                FlagForge
              </span>
            </Link>
          </div>

          {/* Social Media Icons - centered on mobile, middle on desktop */}
          <div className="flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <div className="flex space-x-4 sm:space-x-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 sm:p-3 rounded-xl sm:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label={`Visit our ${social.name} page`}
                >
                  <div className="w-7 h-7 sm:w-6 sm:h-6">
                    {React.cloneElement(social.icon, {
                      className: social.icon.props.className.replace('w-6 h-6', 'w-7 h-7 sm:w-6 sm:h-6')
                    })}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links - stacked on mobile, horizontal on desktop */}
          <nav className="flex justify-center md:justify-end">
            <ul className="grid grid-cols-1 gap-3 w-full max-w-xs sm:grid-cols-2 sm:gap-4 sm:max-w-none md:flex md:flex-wrap md:items-center md:gap-0 text-base sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <li>
                <Link 
                  href="/about" 
                  className="block text-lg py-3 px-4 sm:py-2 sm:px-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:me-4 md:py-0 md:px-0 md:rounded-none"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="block text-lg py-3 px-4 sm:py-2 sm:px-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:me-4 md:py-0 md:px-0 md:rounded-none"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block text-lg py-3 px-4 sm:py-2 sm:px-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:me-4 md:py-0 md:px-0 md:rounded-none"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="block text-lg py-3 px-4 sm:py-2 sm:px-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:me-4 md:py-0 md:px-0 md:rounded-none"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="sm:col-span-2 md:col-span-1">
                <Link 
                  href="/licensing" 
                  className="block text-lg py-3 px-4 sm:py-2 sm:px-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:py-0 md:px-0 md:rounded-none"
                >
                  Licensing
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <hr className="my-8 sm:my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8 transition-colors duration-300" />
        
        {/* Copyright section */}
        <div className="text-center">
          <span className="block text-base sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 leading-relaxed">
            © Maintained By{" "}-
            <Link 
              href="https://www.linkedin.com/company/shyenasec/" 
              className="inline-block py-1 px-2 -mx-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-600 transition-all duration-300 touch-manipulation active:scale-95 md:hover:bg-transparent md:dark:hover:bg-transparent md:hover:underline md:py-0 md:px-0"
            >
              - {""}Shyena Inc.
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
