"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Questions } from "@/interfaces";
import { useSession } from "next-auth/react";
import AuthError from "@/components/authError";
import { initialQuestion } from "@/utlis/data";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import doubt from "@/public/doubt.png";
import ConfettiBoom from "react-confetti-boom";


const Page = ({ params }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { status: sessionStatus } = useSession();
  const [problems, setProblems] = useState<Questions>(initialQuestion);
  const [flag, setFlag] = useState<string>(""); // State for the flag input
  const [message, setMessage] = useState<string | null>(null); // State for success/error message
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // State for confetti explosion

  // Fetch problem data
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/problems/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      setIsDone(data.isDone);
      setProblems(data.question);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Handle flag submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/problems/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag }),
      });

      const result = await response.json();

      // setIsDone(result);

      if (response.ok) {
        setMessage(result.message); // Success message
        if (result.message.includes("Right")) {
          setShowConfetti(true); // Trigger confetti
          setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
        }
      } else {
        setMessage(result.message || "An error occurred"); // Error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  return (
    <div className="">
      {isDone ? (
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-8 justify-center items-center">
            <Image src={doubt} alt="Doubting skill" className="w-72" />
            <p className="w-full mx-auto text-center text-lg">
              Doubting your skills? Let's return to{" "}
              <Link href="/problems" className="text-rose-500">
                problems
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-12 my-0">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-4 text-black font-bold">
                {problems.title}
                <span className="text-sm hidden sm:block px-2 py-1 shadow-xl text-center bg-rose-500 rounded-full tracking-tight font-semibold text-white hover:bg-rose-700">
                  {problems.category}
                </span>
              </h1>
              <h2 className="text-xl hidden sm:block">
                Points: &nbsp;
                <span className="text-rose-500 font-extrabold">
                  {problems.points}
                </span>
              </h2>
            </div>
            <div className="w-full border-b border-gray-300"></div>
          </div>
          <div className="mt-8 text-lg flex flex-col gap-2">
            <p className="text-2xl font-semibold tracking-tight">Description</p>
            <p>{problems.description}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="mt-8 text-lg flex justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xl sm:text-2xl font-semibold">
                  Given Resources
                </p>
                <p className="font-bold text-sm sm:text-md text-rose-500">
                  <a href={problems.link} target="_blank">
                    {problems.link}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl sm:text-2xl font-semibold">Hints</p>
                <p className="text-sm sm:text-md px-3 py-1 shadow-lg text-center bg-rose-500 rounded-lg text-white font-bold hover:bg-rose-700">
                  1
                </p>
              </div>
            </div>
            <div className="mt-3 border border-gray-200 rounded-lg p-6 flex flex-col justify-start gap-4">
              <input
                type="text"
                className="py-2 bg-gray-100 px-4 block w-full border-rose-500 rounded-lg text-base sm:text-lg focus:outline-rose-600"
                placeholder="Flag here!"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
              />
              <button
                className="bg-rose-500 w-full sm:w-[180px] border border-rose-500 hover:bg-rose-800 rounded-lg px-4 py-2 text-white"
                onClick={handleSubmit}
              >
                Submit
              </button>
              {message && (
                <div
                  className={`text-center text-lg font-bold mt-4 ${
                    message.includes("Right")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </div>
              )}
              {/* Show Confetti */}
              {showConfetti && (
                <ConfettiBoom
                  colors={[
                    "#FF6347",
                    "#FFD700",
                    "#00FF00",
                    "#1E90FF",
                    "#FF69B4",
                  ]}
                  particleCount={100} // Number of confetti particles
                  shapeSize={30}
                  deg={270}
                  effectCount={Infinity}
                  effectInterval={3000} // Duration of confetti in ms
                  spreadDeg={60}
                  x={0.5}
                  y={0.5}
                  launchSpeed={1}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
