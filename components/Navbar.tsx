"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/flagforge-logo.png";
import { CgMenuRightAlt } from "react-icons/cg";
import { NavbarData } from "@/utlis/data";
import { NavbarItems } from "@/interfaces";
import { useSession } from "next-auth/react";
import { signOut } from "@/utlis/auth";
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
  <li onClick={onClick}>
    <Link 
      href={href} 
      className={cn(
        "block w-full rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 font-medium touch-manipulation active:scale-95",
        style
      )}
    >
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
    <header className="bg-white dark:bg-gray-900 top-0 shadow-lg shadow-gray-100 dark:shadow-gray-800 w-full py-3 md:py-2 md:px-8 px-4 sticky z-50 transition-colors duration-300">
      <nav className="flex justify-between w-full items-center max-w-7xl mx-auto">
        <Link href="/">
          <div className="flex items-center text-xl font-bold transition-all hover:opacity-80 duration-300 p-2 -ml-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation active:scale-95">
            <Image 
              src={logo} 
              alt="logo" 
              height={60} 
              width={60} 
              className="sm:h-[70px] sm:w-[70px]"
            />
            <span className="ml-2 text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
              FlagForge
            </span>
          </div>
        </Link>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          {/* Theme toggle for mobile */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-300 touch-manipulation active:scale-95"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          <Sheet>
            <SheetTrigger onClick={handleMenuClick}>
              <div className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 touch-manipulation active:scale-95">
                <CgMenuRightAlt className="text-3xl transition-transform hover:scale-110 duration-300 text-gray-900 dark:text-gray-100" />
              </div>
            </SheetTrigger>
            <SheetContent className="w-full">
              <div className="flex flex-col h-full">
                {/* Mobile menu header */}
                <div className="flex items-center justify-center py-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <Image src={logo} alt="logo" height={50} width={50} />
                    <span className="ml-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                      FlagForge
                    </span>
                  </div>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 py-6">
                  <ul className="flex flex-col gap-2">
                    {session.status === "authenticated" ? (
                      NavbarData.map(({ href, tags }: NavbarItems) => (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={handleMenuClick}
                            className="flex items-center w-full px-6 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 touch-manipulation active:scale-95"
                          >
                            {tags}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <Link
                            href="/blogs"
                            onClick={handleMenuClick}
                            className="flex items-center w-full px-6 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 touch-manipulation active:scale-95"
                          >
                            Blogs
                          </Link>
                        </li>
                        <li className="px-6 py-2">
                          <Link
                            onClick={handleMenuClick}
                            href="/authentication"
                            className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl px-6 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 touch-manipulation shadow-lg"
                          >
                            Sign in / Sign up
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </nav>

                {/* User profile section for authenticated users */}
                {session.status === "authenticated" && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-4">
                    <div className="px-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Image
                          src={session.data?.user?.image ?? logo}
                          alt="Profile"
                          height={40}
                          width={40}
                          className="rounded-full shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {session.data?.user?.name ?? "User"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.data?.user?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <Link
                          href="/profile"
                          onClick={handleMenuClick}
                          className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 touch-manipulation active:scale-95"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={() => {
                            handleMenuClick();
                           async() => await signOut();
                          }}
                          className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 touch-manipulation active:scale-95"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ul className="flex gap-2 items-center">
            {session.status === "authenticated" ? (
              NavbarData.map(({ href, tags }: NavbarItems) => (
                <NavItem key={href} href={href} tags={tags} style="px-3 py-2" />
              ))
            ) : (
              <>
                <li>
                  <Link
                    href="/blogs"
                    className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/authentication"
                    className="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg px-5 py-3 text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    Sign in / Sign up
                  </Link>
                </li>
              </>
            )}
            {session.status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-2 font-bold text-red-500 items-center justify-center cursor-pointer transition-all duration-300 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Profile"
                      height={32}
                      width={32}
                      className="rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                    />
                    <h3 className="tracking-tight text-lg">
                      {session.data?.user?.name ?? "User"}
                    </h3>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-3 w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link className="block w-full text-sm" href="/profile">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="block w-full text-sm" href="/">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      onClick={async() => await signOut()}
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
            className="p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-300 active:scale-95"
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
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
