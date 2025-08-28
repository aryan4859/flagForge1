"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "@/public/flagforge-logo.png";
import Image from "next/image";
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

const NavItem = ({ href, tags, onClick, style }: NavbarItems) => {
  return (
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
};

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();

  const handleMenuClick: () => void = () => {
    setOpen(!open);
  };

  return (
    <header className="bg-white top-0 shadow-lg shadow-gray-100 w-full py-2 md:px-8 px-4 sticky z-50">
      <nav className="flex justify-between w-full items-center">
        <Link href="/">
          <div className="flex items-center text-xl font-bold transition-opacity hover:opacity-80 duration-300">
            <Image src={logo} alt="logo" height={70} width={70} />
            FlagForge
          </div>
        </Link>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger onClick={handleMenuClick}>
              <CgMenuRightAlt className="text-2xl transition-transform hover:scale-110 duration-300" />
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
                    className="bg-red-500 hover:bg-red-700 rounded-lg px-5 py-3 text-white 
                    transition-all duration-300 ease-in-out transform hover:scale-105"
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
                      className="rounded-[100%] shadow-xl transition-all duration-300 hover:scale-110"
                    />
                    <h3>{session.data?.user?.name ?? "User"}</h3>
                  </div>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex gap-2 items-center">
            {session.status === "authenticated" ? (
              NavbarData.map(({ href, tags }: NavbarItems) => (
                <NavItem key={href} href={href} tags={tags} style="px-2" />
              ))
            ) : (
              <Link
                href="/authentication"
                className="bg-red-500 hover:bg-red-700 rounded-lg px-5 py-3 text-white 
                transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Sign in / Sign up
              </Link>
            )}
            {session.status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    className="flex gap-2 font-bold text-red-500 items-center justify-center cursor-pointer
                    transition-all duration-300 hover:text-red-700"
                  >
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Logo"
                      height={32}
                      width={32}
                      className="rounded-[100%] shadow-xl transition-all duration-300 hover:scale-110"
                    />
                    <h3 className="tracking-tight text-lg">
                      {session.data?.user?.name ?? "User"}
                    </h3>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-3 w-44">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal"
                      href="/profile"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal"
                      href="/"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="transition-colors duration-200 hover:bg-gray-100 cursor-pointer">
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal text-red-500 hover:text-red-700 transition-colors"
                      href="#"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
