"use client";
import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
import AuthError from "@/components/authError";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import doubt from "@/public/doubt.png";
import ConfettiBoom from "react-confetti-boom";
import FloatingChat from "@/components/FloatingChat";

export const runtime = "edge";

// Fixed interface definitions
interface Hint {
  id?: number;
  text: string;
  pointsDeduction: number | string;
}

interface Questions {
  _id?: string;
  title: string;
  flag: string;
  description: string;
  points: number | string;
  category: string;
  link: string;
  isTimeLimited: boolean;
  timeLimit: number | string;
  timeLimitUnit: "hours" | "days" | "weeks";
  expiryDate: string | Date | null;
  hints: Hint[];
  uploadedBy: string;
  createdAt?: string;
}

interface PageParams {
  id: string;
}

// Initial question with proper structure
const initialQuestion: Questions = {
  title: "",
  flag: "",
  description: "",
  points: "",
  category: "All",
  link: "",
  isTimeLimited: false,
  timeLimit: "",
  timeLimitUnit: "days",
  expiryDate: null,
  hints: [],
  uploadedBy: "",
};

const Page = ({ params }: { params: Promise<PageParams> }) => {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session, status: sessionStatus } = useSession();
  const [problems, setProblems] = useState<Questions>(initialQuestion);
  const [flag, setFlag] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [availableHints, setAvailableHints] = useState<Hint[]>([]);
  const [hintLoading, setHintLoading] = useState<boolean>(false);
  const [usedHints, setUsedHints] = useState<number[]>([]);

  // Duplicate prevention refs
  const lastSubmissionTime = useRef<number>(0);
  const lastSubmittedFlag = useRef<string>("");
  const submissionInProgress = useRef<boolean>(false);
  const abortController = useRef<AbortController | null>(null);

  const MIN_SUBMISSION_INTERVAL = 1000;

  // URL validation function
  const isValidUrl = (string: string): boolean => {
    if (!string || string.trim() === "") return false;

    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Format time remaining
  const formatTimeRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Format expiry date
  const formatExpiryDate = (expiryDate: string | Date) => {
    const date = new Date(expiryDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/problems/${unwrappedParams.id}`);

      if (response.status === 410) {
        // HTTP Gone - expired
        const data = await response.json();
        setIsExpired(true);
        setMessage(data.message);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const data = await response.json();

      // Handle the data structure properly
      setIsDone(data.isDone);
      setIsCorrect(data.isDone);
      setUsedHints(data.usedHints || []);

      // Ensure we have proper hints array
      const questionData = data.question || {};
      const hints = Array.isArray(questionData.hints) ? questionData.hints : [];

      setProblems({
        ...initialQuestion,
        ...questionData,
        hints: hints,
      });

      // Calculate time remaining
      let calculatedTimeRemaining = data.timeRemaining;
      if (!calculatedTimeRemaining && questionData.expiryDate) {
        const expiryTime = new Date(questionData.expiryDate).getTime();
        const currentTime = Date.now();
        calculatedTimeRemaining = Math.max(0, expiryTime - currentTime);
      }

      setTimeRemaining(calculatedTimeRemaining);
      setIsExpired(
        data.expired ||
          (calculatedTimeRemaining !== null && calculatedTimeRemaining <= 0)
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching problem:", error);
      setLoading(false);
    }
  };

  // Fetch hints from backend
  const fetchHints = async () => {
    if (hintLoading || availableHints.length > 0) return;

    try {
      setHintLoading(true);
      const response = await fetch(`/api/problems/${unwrappedParams.id}/hints`);

      if (!response.ok) {
        throw new Error("Failed to fetch hints");
      }

      const data = await response.json();
      setAvailableHints(data.hints || []);
      setUsedHints(data.usedHints || []);
    } catch (error) {
      console.error("Error fetching hints:", error);
      setMessage("Failed to load hints. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setHintLoading(false);
    }
  };

  // Request a specific hint
  const requestHint = async (hintIndex: number) => {
    if (usedHints.includes(hintIndex)) return;

    try {
      setHintLoading(true);
      const response = await fetch(
        `/api/problems/${unwrappedParams.id}/hints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hintIndex }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request hint");
      }

      const data = await response.json();
      setUsedHints((prev) => [...prev, hintIndex]);
      setMessage(data.message);

      // Update user's total score if points were deducted
      if (data.pointsDeducted > 0) {
        setTimeout(() => setMessage(null), 5000);
      } else {
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error requesting hint:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to request hint"
      );
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setHintLoading(false);
    }
  };

  // Toggle hints display and fetch if needed
  const toggleHints = async () => {
    if (!showHint) {
      await fetchHints();
    }
    setShowHint(!showHint);
  };

  // Update time remaining every second for time-limited challenges
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !isExpired && !isDone) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev > 1000) {
            return prev - 1000;
          } else {
            setIsExpired(true);
            setMessage("This challenge has expired");
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining, isExpired, isDone]);

  const canSubmit = () => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime.current;
    const flagTrimmed = flag.trim();

    if (submitting || submissionInProgress.current || isCorrect || isExpired) {
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

  // Show expired challenge page
  if (isExpired) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto py-8">
          <div className="flex flex-col gap-8 justify-center items-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                Challenge Expired
              </h1>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                <p className="text-lg text-red-800 dark:text-red-200 mb-2">
                  This time-limited challenge has expired and is no longer
                  available.
                </p>
                {problems.expiryDate && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Expired on: {formatExpiryDate(problems.expiryDate)}
                  </p>
                )}
              </div>
            </div>
            <Image src={doubt} alt="Challenge expired" className="w-72" />
            <p className="w-full mx-auto text-center text-lg text-gray-800 dark:text-gray-300 transition-colors duration-300">
              Don't worry! Check out other available{" "}
              <Link
                href="/problems"
                className="text-rose-500 dark:text-red-400 hover:underline transition-colors duration-300"
              >
                challenges
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <FloatingChat
              userId={session?.user?.id || ""}
              challengeId={unwrappedParams.id}
            />
          </div>

          {/* Challenge expiry info */}
          {problems.expiryDate && (
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Time-Limited Challenge
                </p>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Expires on: {formatExpiryDate(problems.expiryDate)}
              </p>
            </div>
          )}

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
                {problems.link ? (
                  isValidUrl(problems.link) ? (
                    <p className="font-bold text-sm sm:text-md text-red-500 dark:text-red-500 transition-colors duration-300">
                      <a
                        href={problems.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {problems.link}
                      </a>
                    </p>
                  ) : (
                    <p className="font-bold text-sm sm:text-md text-red-500 dark:text-red-500 transition-colors duration-300">
                      {problems.link}
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No resources provided
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Hints
                </p>
                <button
                  onClick={toggleHints}
                  disabled={hintLoading}
                  className="text-sm sm:text-md px-3 py-1 shadow-lg text-center bg-red-400 dark:bg-red-500 rounded-lg text-white font-bold hover:bg-red-700 dark:hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hintLoading ? "Loading..." : problems.hints?.length || 0}
                </button>
              </div>
            </div>

            {/* Hints section */}
            {showHint && (
              <div className="mt-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-200 mb-3">
                  💡 Available Hints ({availableHints.length})
                </h3>
                {availableHints.length > 0 ? (
                  <div className="space-y-3">
                    {availableHints.map((hint: Hint, index: number) => {
                      const isUsed = usedHints.includes(index);
                      return (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 border border-rose-200 dark:border-rose-700 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-rose-800 dark:text-rose-200">
                                  Hint {index + 1}
                                </span>
                                {hint.pointsDeduction &&
                                  Number(hint.pointsDeduction) > 0 && (
                                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs font-medium">
                                      -{hint.pointsDeduction} pts
                                    </div>
                                  )}
                              </div>
                              {isUsed ? (
                                <p className="text-rose-700 dark:text-rose-300">
                                  {hint.text}
                                </p>
                              ) : (
                                <p className="text-gray-600 dark:text-gray-400 italic">
                                  Click "Use Hint" to reveal this hint
                                </p>
                              )}
                            </div>
                            <div>
                              {!isUsed && (
                                <button
                                  onClick={() => requestHint(index)}
                                  disabled={hintLoading}
                                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {hintLoading ? "..." : "Use Hint"}
                                </button>
                              )}
                              {isUsed && (
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                                  ✓ Used
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-rose-700 dark:text-rose-300">
                    {hintLoading
                      ? "Loading hints..."
                      : "No hints available for this challenge."}
                  </p>
                )}
              </div>
            )}

            <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col justify-start gap-4 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
              <input
                type="text"
                className="py-2 px-4 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-base sm:text-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-colors duration-300"
                placeholder="Flag here!"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={submitting || isCorrect || isExpired}
                maxLength={100}
              />
              <button
                className={`w-full sm:w-[180px] border rounded-lg px-4 py-2 text-white transition-colors duration-300 ${
                  submitting || isCorrect || isExpired
                    ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                    : "bg-red-400 dark:bg-red-500 border-red-500 dark:border-red-600 hover:bg-red-700 dark:hover:bg-red-700"
                }`}
                onClick={handleSubmit}
                disabled={submitting || isCorrect || isExpired}
              >
                {submitting
                  ? "Submitting..."
                  : isCorrect
                  ? "Solved!"
                  : isExpired
                  ? "Expired"
                  : "Submit"}
              </button>

              {message && (
                <div
                  className={`text-center text-lg font-bold mt-4 transition-colors duration-300 ${
                    message.includes("Right")
                      ? "text-green-600 dark:text-green-400"
                      : message.includes("points deducted") ||
                        message.includes("Hint revealed")
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-red-600 dark:text-red-500"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Time remaining display */}
              {timeRemaining && timeRemaining > 0 && !isExpired && (
                <div className="text-center">
                  <div
                    className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                      timeRemaining < 3600000 // Less than 1 hour
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                        : timeRemaining < 86400000 // Less than 1 day
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                    }`}
                  >
                    ⏰ Time Remaining: {formatTimeRemaining(timeRemaining)}
                  </div>
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
