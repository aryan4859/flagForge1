import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/flagforge-logo.png";

export default function Footer() {
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
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0 transition-colors duration-300">
            <li>
              <Link href="/about" className="hover:underline me-4 md:me-6">
                About
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
              <Link href="/licensing" className="hover:underline me-4 md:me-6">
                Licensing
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-3 transition-colors duration-300" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center transition-colors duration-300">
          © Maintained By{" "}
          <Link
            href="https://flagforge.xyz"
            className="hover:underline"
          >
            FlagForge
          </Link>
        </span>
      </div>
    </footer>
  );
}
