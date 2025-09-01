"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/home");
    }
  }, [sessionStatus, router]);

  return (
    <div className="h-[60vh] p-5 sm:p-0 flex flex-col justify-center items-center gap-7 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl sm:text-3xl text-center text-gray-600 dark:text-white leading-[51px] tracking-tight sm:leading-1 transition-colors duration-300">
        Fly into{" "}
        <span className="text-red-500 dark:text-red-400 font-extrabold">
          {" "}
          FlagForge
        </span>
        , where Challenges take Wings!🪽
      </h1>
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md shadow-gray-100 dark:shadow-gray-900 px-8 py-4 text-sm font-medium text-gray-800 dark:text-gray-100  
             hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-400 
             transition-colors duration-300 ease-in-out"
      >
        <FcGoogle className="text-xl" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default AuthPage;
