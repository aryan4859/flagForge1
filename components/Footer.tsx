import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/flagforge-logo.png";
function Footer() {
  return (
    <footer className="bg-white rounded-lg m-4">
      <div className="w-full max-w-screen-2xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image src={logo} alt="logo" height={70} width={70} />
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              FlagForge
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
            <li>
              <Link href="/about" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline me-4 md:me-6">
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
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-3" />
        <span className="block text-sm text-gray-500 sm:text-center ">
          © Maintained By{" "}
          <Link
            href="https://flagforge.aryan4.com.np"
            className="hover:underline"
          >
            FlagForge
          </Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
