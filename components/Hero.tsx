"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Hero: React.FC = () => {
  const { status } = useSession();

  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] ">
      <div className="flex flex-col gap-[50px]">
        {/* <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-rose-400 rounded-[100%] top-[50%] left-[50%]  blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" /> */}
        <h2 className=" sm:w-[80%] mx-auto text-[2.6rem] sm:text-6xl text-center text-gray-600 leading-[180%] sm:leading-2 tracking-tight">
          Welcome to
          <span className="text-rose-500 font-extrabold"> FlagForge </span>
          <span className="font-bold">Capture The Flag (CTF) </span>
          playground!🏆
        </h2>
        <h2 className="w-[98%] sm:w-[75%] mx-auto my-0 text-center text-base sm:text-lg">
          <span className="text-red-500 font-extrabold">FlagForge</span> is a
          dynamic and engaging CTF platform dedicated to promoting 
          <span className="text-red-500 font-extrabold"> Cybersecurity </span>
          awareness and fostering a passion for coding among participants. Our
          CTF competition offers a challenging environment for individuals to
          sharpen their skills in cybersecurity, cryptography 🗝️, web
          exploitation 💻, reverse engineering 🔍, & more.
        </h2>
        <Link
          href={status === "authenticated" ? "/problems" : "/authentication"}
          className="mx-auto"
        >
          <button className="bg-red-500 hover:bg-red-700 rounded-lg w-[18rem] px-4 py-4 text-white text-center mx-[auto] my-0 font-bold">
            Start Solving 🚀
          </button>
        </Link>
      </div>

      <div className="w-auto mx-auto my-0 flex flex-col md:flex-row p-6 gap-8 ">
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center shadow-lg shadow-gray-200/60 border-gray-200/80 border p-7 rounded-xl bg-[white]/40 backdrop-blur-[150px]">
          <h1 className="font-extrabold text-2xl">Innovative Challenges 🧿</h1>
          <p>
            <span className="text-red-500 font-bold">FlagForge</span> offers a
            variety of innovative challenges that test participants' creativity
            and problem-solving abilities, ensuring an engaging and rewarding
            experience for all.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center  p-5 rounded-xl shadow-gray-200/60 shadow-lg bg-[white]/40 backdrop-blur-[150px] border-gray-200/80 border">
          <h1 className="font-extrabold text-2xl">Beginner-Friendly 🌐</h1>
          <p>
            <span className="text-red-500 font-extrabold">FlagForge </span>
            welcomes participants of all skill levels, including beginners. The
            platform offers challenges that cater to newcomers, providing a
            supportive environment for learning and growth.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center p-5 rounded-xl shadow-gray-200/60 shadow-lg bg-[white]/40 backdrop-blur-[150px] border-gray-200/80 border">
          <h1 className="font-extrabold text-2xl">Improvement 🎁</h1>
          <p>
            <span className="text-red-500 font-extrabold">FlagForge</span>{" "}
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
