"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/flagforge-logo.png";
import { CgMenuRightAlt } from "react-icons/cg";
import { NavbarData } from "@/utlis/data";
import { NavbarItems } from "@/interfaces";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";

const NavItem = ({ href, tags, onClick, style }: NavbarItems) => (
  <li
    className={cn(
      "hover:text-red-700 hover:bg-gray-100/70 rounded-md transition-all duration-300 ease-in-out",
      style
    )}
    onClick={onClick}
  >
    <Link href={href} className="block w-full h-full px-3 py-2">
      {tags}
    </Link>
  </li>
);

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const { theme, toggleTheme } = useTheme();

  const handleMenuClick = () => setOpen(!open);

  return (
    <header className="bg-white dark:bg-gray-900 top-0 shadow-lg shadow-gray-100 dark:shadow-gray-800 w-full py-2 md:px-8 px-4 sticky z-50 transition-colors duration-300">
      <nav className="flex justify-between w-full items-center">
        <Link href="/">
          <div className="flex items-center text-xl font-bold transition-opacity hover:opacity-80 duration-300">
            <Image src={logo} alt="logo" height={70} width={70} />
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              FlagForge
            </span>
          </div>
        </Link>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger onClick={handleMenuClick}>
              <CgMenuRightAlt className="text-2xl transition-transform hover:scale-110 duration-300 text-gray-900 dark:text-gray-100" />
            </SheetTrigger>
            <SheetContent className="w-full">
              <ul className="flex flex-col gap-1 mt-16">
                {session.status === "authenticated" ? (
                  NavbarData.map(({ href, tags }: NavbarItems) => (
                    <NavItem
                      key={href}
                      href={href}
                      tags={tags}
                      onClick={handleMenuClick}
                      style="px-6 py-4"
                    />
                  ))
                ) : (
                  <Link
                    onClick={handleMenuClick}
                    href="/authentication"
                    className="bg-red-500 hover:bg-red-700 rounded-lg px-5 py-3 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Sign in / Sign up
                  </Link>
                )}
                {session.status === "authenticated" && (
                  <div className="flex gap-2 px-6 py-4 font-bold text-red-500 items-center">
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Logo"
                      height={22}
                      width={25}
                      className="rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                    />
                    <h3>{session.data?.user?.name ?? "User"}</h3>
                  </div>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-2 items-center">
            {session.status === "authenticated" ? (
              NavbarData.map(({ href, tags }: NavbarItems) => (
                <NavItem key={href} href={href} tags={tags} style="px-2" />
              ))
            ) : (
              <Link
                href="/authentication"
                className="bg-red-500 hover:bg-red-700 rounded-lg px-5 py-3 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Sign in / Sign up
              </Link>
            )}
            {session.status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-2 font-bold text-red-500 items-center justify-center cursor-pointer transition-all duration-300 hover:text-red-700">
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Logo"
                      height={32}
                      width={32}
                      className="rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                    />
                    <h3 className="tracking-tight text-lg">
                      {session.data?.user?.name ?? "User"}
                    </h3>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-3 w-44">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link className="block w-full text-sm" href="/profile">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="block w-full text-sm" href="/">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left text-sm text-red-500 hover:text-red-700"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ul>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
      />
    </svg>
  );
}
