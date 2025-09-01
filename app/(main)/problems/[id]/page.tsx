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
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          setFlag("");
          setTimeout(() => setIsDone(true), 5000);
          setTimeout(() => router.push("/problems"), 8000);
        } else {
          setTimeout(
            () => (lastSubmittedFlag.current = ""),
            MIN_SUBMISSION_INTERVAL
          );
        }
      } else {
        setMessage(result.message || "An error occurred");
        setTimeout(
          () => (lastSubmittedFlag.current = ""),
          MIN_SUBMISSION_INTERVAL
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error(error);
      setMessage("An error occurred. Please try again.");
      setTimeout(
        () => (lastSubmittedFlag.current = ""),
        MIN_SUBMISSION_INTERVAL
      );
    } finally {
      setSubmitting(false);
      submissionInProgress.current = false;
      abortController.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading || sessionStatus === "loading") return <Loading />;
  if (sessionStatus === "unauthenticated") return <AuthError />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {isDone ? (
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-8 justify-center items-center">
            <Image src={doubt} alt="Doubting skill" className="w-72" />
            <p className="w-full mx-auto text-center text-lg text-gray-800 dark:text-gray-300 transition-colors duration-300">
              Doubting your skills? Let's return to{" "}
              <Link
                href="/problems"
                className="text-red-500 dark:text-red-500 hover:underline transition-colors duration-300"
              >
                problems
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-4 sm:mx-12 my-0 py-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-4 text-black dark:text-white font-bold transition-colors duration-300">
                {problems.title}
                <span className="text-sm hidden sm:block px-2 py-1 shadow-lg text-center bg-red-400 dark:bg-red-500 rounded-full tracking-tight font-semibold text-white hover:bg-red-700 dark:hover:bg-red-700 transition-colors duration-300">
                  {problems.category}
                </span>
              </h1>
              <h2 className="text-xl hidden sm:block text-gray-800 dark:text-gray-300 transition-colors duration-300">
                Points: &nbsp;
                <span className="text-red-500 dark:text-red-500 font-extrabold transition-colors duration-300">
                  {problems.points}
                </span>
              </h2>
            </div>
            <div className="w-full border-b border-gray-300 dark:border-gray-700 transition-colors duration-300"></div>
          </div>

          <div className="mt-8 text-lg flex flex-col gap-2">
            <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 transition-colors duration-300">
              Description
            </p>
            <p className="text-gray-800 dark:text-gray-300 transition-colors duration-300">
              {problems.description}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="mt-8 text-lg flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Given Resources
                </p>
                <p className="font-bold text-sm sm:text-md text-red-500 dark:text-red-500 transition-colors duration-300">
                  <a
                    href={problems.link}
                    target="_blank"
                    className="hover:underline"
                  >
                    {problems.link}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Hints
                </p>
                <p className="text-sm sm:text-md px-3 py-1 shadow-lg text-center bg-red-400 dark:bg-red-500 rounded-lg text-white font-bold hover:bg-red-700 dark:hover:bg-red-700 transition-colors duration-300">
                  1
                </p>
              </div>
            </div>

            <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col justify-start gap-4 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
              <input
                type="text"
                className="py-2 px-4 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-base sm:text-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors duration-300"
                placeholder="Flag here!"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={submitting || isCorrect}
                maxLength={100}
              />
              <button
                className={`w-full sm:w-[180px] border rounded-lg px-4 py-2 text-white transition-colors duration-300 ${
                  submitting || isCorrect
                    ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                    : "bg-red-400 dark:bg-red-500 border-red-500 dark:border-red-600 hover:bg-red-700 dark:hover:bg-red-700"
                }`}
                onClick={handleSubmit}
                disabled={submitting || isCorrect}
              >
                {submitting
                  ? "Submitting..."
                  : isCorrect
                  ? "Solved!"
                  : "Submit"}
              </button>
              {message && (
                <div
                  className={`text-center text-lg font-bold mt-4 transition-colors duration-300 ${
                    message.includes("Right")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-500"
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
