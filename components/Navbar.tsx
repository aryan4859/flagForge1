"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "@/public/flagforge-logo.png";
import Image from "next/image";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
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
        "hover:text-red-700 hover:bg-gray-100/70 rounded-md",
        style
      )}
      onClick={onClick}
    >
      <Link href={href}>{tags}</Link>
    </li>
  );
};
const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openp, setOpenp] = useState<boolean>(false);
  const status = false;
  const session = useSession();

  const handleProfClick: () => void = () => {
    setOpenp(!openp);
  };
  const handleMenuClick: () => void = () => {
    setOpen(!open);
  };
  return (
    <header className="bg-white top-0 shadow-lg shadow-gray-100 w-full py-2 md:px-8 px-4">
      <nav className="flex justify-between w-full items-center">
        <Link href="/home">
          <div className="flex items-center text-xl font-bold">
            <Image src={logo} alt="logo" height={70} width={70} />
            flagforge
          </div>
        </Link>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger onClick={handleMenuClick}>
              <CgMenuRightAlt className="text-2xl" />
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
                    className="bg-red-500 hover:bg-red-800 rounded-lg px-4 py-4 text-white"
                  >
                    Sign in / Sign up
                  </Link>
                )}
                {session.status === "authenticated" && (
                  <div
                    onClick={handleProfClick}
                    className="flex gap-2 px-6 py-4 font-bold text-red-500 items-center cursor-pointer"
                  >
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Logo"
                      height={22}
                      width={25}
                      className="rounded-[100%] shadow-xl"
                    />
                    <h3>{session.data?.user?.name ?? "User"}</h3>
                  </div>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>

        {/* <div className="sm:hidden" onClick={handleMenuClick}>
         
        </div> */}
        {/* <div
          className={
            open
              ? "sm:hidden absolute top-0 left-0 h-screen w-[300px] flex justify-center items-center  backdrop-blur-[150px] rounded-2xl transition-all duration-900 shadow-lg"
              : "sm:hidden absolute top-0 left-[-100%] h-screen w-[300px] flex justify-center items-center  backdrop-blur-[1px] rounded-2xl transition-all duration-900 shadow-lg"
          }
        >
          <ul className="flex flex-col gap-[30px]">
            {session.status === "authenticated" ? (
              NavbarData.map(({ href, tags }: NavbarItems) => (
                <NavItem
                  key={href}
                  href={href}
                  tags={tags}
                  onClick={handleMenuClick}
                />
              ))
            ) : (
              <Link
                onClick={handleMenuClick}
                href="/authentication"
                className="bg-red-500 hover:bg-red-800 rounded-lg px-4 py-4 text-white"
              >
                Sign in / Sign up
              </Link>
            )}
            {session.status === "authenticated" && (
              <div
                onClick={handleProfClick}
                className="flex gap-2 font-bold text-red-500 items-center cursor-pointer"
              >
                <Image
                  src={session.data?.user?.image ?? logo}
                  alt="Logo"
                  height={22}
                  width={25}
                  className="rounded-[100%] shadow-xl"
                />
                <h3>{session.data?.user?.name ?? "User"}</h3>
              </div>
            )}
          </ul>
        </div> */}
        {/* <ul
          className={
            openp
              ? "absolute z-[1000] float-left m-0 top-[65vh] sm:top-[70px] right-[155px] sm:right-[150px] w-[30vw] sm:w-[12vw] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg "
              : "absolute z-[1000] float-left m-0 top-[70px] right-[-150000000px] w-[12vw] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg "
          }
          aria-labelledby="dropdownMenuButton2"
          data-te-dropdown-menu-ref
        >
          <li>
            <Link
              className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal  hover:bg-neutral-100  "
              href="#"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal  hover:bg-neutral-100  "
              href="#"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal  hover:bg-neutral-100  "
              href="#"
              onClick={() => signOut()}
            >
              Sign Out
            </Link>
          </li>
        </ul> */}
        <div className="hidden md:block">
          <ul className="flex gap-2">
            {session.status === "authenticated" ? (
              NavbarData.map(({ href, tags }: NavbarItems) => (
                <NavItem
                  key={href}
                  href={href}
                  tags={tags}
                  onClick={handleMenuClick}
                  style="px-2"
                />
              ))
            ) : (
              <Link
                onClick={handleMenuClick}
                href="/authentication"
                className="bg-red-500 hover:bg-red-700 rounded-lg px-5 py-3 text-white"
              >
                Sign in / Sign up
              </Link>
            )}
            {session.status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    onClick={handleProfClick}
                    className="flex gap-2 font-bold text-red-500 items-center justify-center  cursor-pointer"
                  >
                    <Image
                      src={session.data?.user?.image ?? logo}
                      alt="Logo"
                      height={22}
                      width={25}
                      className="rounded-[100%] shadow-xl"
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
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal"
                      href="/profile"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal"
                      href="#"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="block w-full whitespace-nowrap bg-transparent text-sm font-normal text-red-500"
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
