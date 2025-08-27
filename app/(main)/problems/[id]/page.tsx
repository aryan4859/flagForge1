"use client";
import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/loading";
import { Questions } from "@/interfaces";
import { useSession } from "next-auth/react";
import AuthError from "@/components/authError";
import { initialQuestion } from "@/utlis/data";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import doubt from "@/public/doubt.png";
import ConfettiBoom from "react-confetti-boom";

export const runtime = "edge";

interface PageParams {
  id: string;
}

const Page = ({ params }: { params: Promise<PageParams> }) => {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { status: sessionStatus } = useSession();
  const [problems, setProblems] = useState<Questions>(initialQuestion);
  const [flag, setFlag] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Duplicate prevention refs
  const lastSubmissionTime = useRef<number>(0);
  const lastSubmittedFlag = useRef<string>("");
  const submissionInProgress = useRef<boolean>(false);
  const abortController = useRef<AbortController | null>(null);

  const MIN_SUBMISSION_INTERVAL = 1000;

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/problems/${unwrappedParams.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      setIsDone(data.isDone);
      setIsCorrect(data.isDone);
      setProblems(data.question);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const canSubmit = () => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    const flagTrimmed = flag.trim();
    
    if (submitting || submissionInProgress.current || isCorrect) {
      return false;
    }
    
    if (!flagTrimmed) {
      setMessage("Please enter a flag");
      return false;
    }
    
    if (lastSubmittedFlag.current === flagTrimmed) {
      setMessage("This flag was already submitted");
      return false;
    }
    
    if (timeSinceLastSubmission < MIN_SUBMISSION_INTERVAL) {
      setMessage("Please wait before submitting again");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      return;
    }

    // Cancel existing request
    if (abortController.current) {
      abortController.current.abort();
    }

    try {
      setSubmitting(true);
      submissionInProgress.current = true;
      const now = Date.now();
      const flagTrimmed = flag.trim();
      
      lastSubmissionTime.current = now;
      lastSubmittedFlag.current = flagTrimmed;
      
      abortController.current = new AbortController();
      setMessage(null);

      const response = await fetch(`/api/problems/${unwrappedParams.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag: flagTrimmed }),
        signal: abortController.current.signal,
      });

      if (abortController.current.signal.aborted) {
        return;
      }

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        if (result.message.includes("Right")) {
          setIsCorrect(true);
          setIsDone(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 9000);
          setFlag("");
          setTimeout(() => {
            router.push("/problems");
          }, 3000);
        } else {
          setTimeout(() => {
            lastSubmittedFlag.current = "";
          }, MIN_SUBMISSION_INTERVAL);
        }
      } else {
        setMessage(result.message || "An error occurred");
        setTimeout(() => {
          lastSubmittedFlag.current = "";
        }, MIN_SUBMISSION_INTERVAL);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error(error);
      setMessage("An error occurred. Please try again.");
      setTimeout(() => {
        lastSubmittedFlag.current = "";
      }, MIN_SUBMISSION_INTERVAL);
    } finally {
      setSubmitting(false);
      submissionInProgress.current = false;
      abortController.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

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
                onKeyPress={handleKeyPress}
                disabled={submitting || isCorrect}
                maxLength={100}
              />
              <button
                className={`w-full sm:w-[180px] border rounded-lg px-4 py-2 text-white transition-colors ${
                  submitting || isCorrect
                    ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                    : "bg-rose-500 border-rose-500 hover:bg-rose-800"
                }`}
                onClick={handleSubmit}
                disabled={submitting || isCorrect}
              >
                {submitting ? "Submitting..." : isCorrect ? "Solved!" : "Submit"}
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
              {showConfetti && (
                <ConfettiBoom
                  colors={[
                    "#FF6347",
                    "#FFD700",
                    "#00FF00",
                    "#1E90FF",
                    "#FF69B4",
                  ]}
                  particleCount={100}
                  shapeSize={30}
                  deg={270}
                  effectCount={Infinity}
                  effectInterval={3000}
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