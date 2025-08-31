"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Hero: React.FC = () => {
  const { status } = useSession();

  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem]  dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col gap-[50px] ">
        <h2 className="sm:w-[80%] mx-auto text-[2.6rem] sm:text-6xl text-center text-gray-600 dark:text-gray-100 leading-[180%] sm:leading-2 tracking-tight transition-colors duration-300">
          Welcome to
          <span className="text-rose-500 dark:text-red-500 font-extrabold">
            {" "}
            FlagForge{" "}
          </span>
          <span className="font-bold">Capture The Flag (CTF) </span>
          playground!🏆
        </h2>
        <h2 className="w-[98%] sm:w-[75%] mx-auto my-0 text-center text-base sm:text-lg text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <span className="text-red-500 dark:text-red-400 font-extrabold">
            FlagForge
          </span>{" "}
          is a dynamic and engaging CTF platform dedicated to promoting
          <span className="text-red-500 dark:text-red-400 font-extrabold">
            {" "}
            Cybersecurity{" "}
          </span>
          awareness and fostering a passion for coding among participants. Our
          CTF competition offers a challenging environment for individuals to
          sharpen their skills in cybersecurity, cryptography 🗝️, web
          exploitation 💻, reverse engineering 🔍, & more.
        </h2>
        <Link
          href={status === "authenticated" ? "/problems" : "/authentication"}
          className="mx-auto"
        >
          <button className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg w-[18rem] px-4 py-4 text-white text-center mx-[auto] my-0 font-bold transition-colors duration-300">
            Start Solving 🚀
          </button>
        </Link>
      </div>

      <div className="w-auto mx-auto my-0 flex flex-col md:flex-row p-6 gap-8">
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border-gray-200/80 dark:border-gray-700 border p-7 rounded-xl bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Innovative Challenges 🧿
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-red-500 dark:text-red-400 font-bold">
              FlagForge
            </span>{" "}
            offers a variety of innovative challenges that test participants'
            creativity and problem-solving abilities, ensuring an engaging and
            rewarding experience for all.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Beginner-Friendly 🌐
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-red-500 dark:text-red-400 font-extrabold">
              FlagForge{" "}
            </span>
            welcomes participants of all skill levels, including beginners. The
            platform offers challenges that cater to newcomers, providing a
            supportive environment for learning and growth.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Improvement 🎁
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-red-500 dark:text-red-400 font-extrabold">
              FlagForge
            </span>{" "}
            regularly updates its challenges and platform based on feedback from
            participants, ensuring that the experience remains relevant and
            engaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
