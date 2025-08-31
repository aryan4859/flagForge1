"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import Image from "next/image";
import FlagForge from "../../../public/flagforge.gif";
import Link from "next/link";
import {
  Flag,
  LayoutDashboard,
  Trophy,
  Target,
  Users,
  Clock,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Shield,
  Zap,
  Star,
} from "lucide-react";

interface UserStats {
  totalScore: number;
  rank: number;
  level: string;
  completedQuestions: number;
  badges: number;
  streak: number;
}

interface LatestRoom {
  _id: string;
  title: string;
  category: string;
  points: number;
  description: string;
  createdAt: string;
  difficulty?: string;
}

interface SolvedRoom {
  _id: string;
  title: string;
  category: string;
  points: number;
  solvedAt: string;
}

const Home = () => {
  const { status: sessionStatus, data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [latestRoom, setLatestRoom] = useState<LatestRoom | null>(null);
  const [lastSolved, setLastSolved] = useState<SolvedRoom | null>(null);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchUserStats();
      fetchLatestRoom();
      fetchLastSolved();
    }
  }, [sessionStatus]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const fetchLatestRoom = async () => {
    try {
      // Fetch ALL problems with a large limit to get the truly latest one
      const response = await fetch("/api/problems?limit=1000");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Latest room API response:", data); // Debug log
        
        let rooms = [];
        
        // Handle different response structures
        if (Array.isArray(data)) {
          rooms = data;
        } else if (data.data && Array.isArray(data.data)) {
          rooms = data.data;
        } else if (data.problems && Array.isArray(data.problems)) {
          rooms = data.problems;
        } else if (data.questions && Array.isArray(data.questions)) {
          rooms = data.questions;
        }
        
        console.log(`Total rooms fetched: ${rooms.length} out of expected 36+`);
        
        if (rooms.length > 0) {
          setLatestRoom(rooms[0]);
        
        } else {
          console.log("No rooms found in response");
        }
      } else {
        console.error("API response not ok:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Failed to fetch latest room:", error);
    }
  };

  const fetchLastSolved = async () => {
    try {
      const response = await fetch("/api/user/recent-solved");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Last solved API response:", data); // Debug log
        
        // Handle different response structures
        if (Array.isArray(data) && data.length > 0) {
          setLastSolved(data[0]);
          console.log("Last solved set:", data[0]); // Debug log
        } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setLastSolved(data.data[0]);
          console.log("Last solved set:", data.data[0]); // Debug log
        } else {
          console.log("No solved problems found or empty response");
        }
      } else {
        console.error("Recent solved API response not ok:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Failed to fetch last solved:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Web: "bg-red-100 text-red-800",
      Crypto: "bg-purple-100 text-purple-800",
      Forensics: "bg-green-100 text-green-800",
      "Reverse Engineering": "bg-blue-100 text-blue-800",
      PWN: "bg-orange-100 text-orange-800",
      OSINT: "bg-cyan-100 text-cyan-800",
      Misc: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getDifficultyColor = (points: number) => {
    if (points <= 100) return "text-green-600";
    if (points <= 300) return "text-yellow-600";
    if (points <= 500) return "text-orange-600";
    return "text-red-600";
  };

  if (sessionStatus === "loading" || loading) {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239,68,68,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-3 h-3 bg-red-200 rounded-full"></div>
        </div>
        <div className="absolute top-32 right-20 animate-pulse">
          <div className="w-2 h-2 bg-red-300 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-bounce delay-300">
          <div className="w-4 h-4 bg-red-100 rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Left Side - Branding */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="relative">
                  <Image
                    src={FlagForge}
                    height={100}
                    width={100}
                    alt="flagforge"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
                <h1 className="text-6xl font-black text-gray-900 tracking-tight drop-shadow-sm">
                  Flag<span className="text-red-500">Forge</span>
                </h1>
              </div>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed mb-6">
                Master cybersecurity through hands-on CTF challenges and compete
                with hackers worldwide
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Star className="h-5 w-5 text-red-500 fill-red-500" />
                <span className="text-gray-600 font-medium">
                  Join 500+ Active Security Professionals
                </span>
                <Star className="h-5 w-5 text-red-500 fill-red-500" />
              </div>
              <div className="flex text-center justify-center pt-10">
                {/* Enhanced User Level Display */}
                {userStats && (
                  <div className="text-end">
                    <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-lg">
                      <div className="relative">
                        <Shield className="h-8 w-8 text-red-500" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-gray-900">
                          {userStats.level}
                        </div>
                        <div className="text-sm text-gray-600">
                          Security Level
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        {Array.from({
                          length: Math.min(userStats.badges, 5),
                        }).map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-sm animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                        {userStats.badges > 5 && (
                          <span className="text-gray-600 text-sm font-medium ml-2">
                            +{userStats.badges - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {userStats && (
              <div className="grid grid-cols-2 gap-6">
                <div className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="absolute inset-0  rounded-2xl"></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {userStats.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Points
                  </div>
                </div>

                <div className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="absolute inset-0  rounded-2xl"></div>
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    #{userStats.rank}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Global Rank
                  </div>
                </div>

                <div className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="absolute inset-0  rounded-2xl"></div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {userStats.completedQuestions}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Challenges Solved
                  </div>
                </div>

                <div className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="absolute inset-0  rounded-2xl"></div>
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    {userStats.streak}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Day Streak
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {userStats?.completedQuestions === 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Shield className="h-8 w-8 text-[#EF4444]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to the Forge!
              </h2>
              <p className="text-gray-600 mb-4">
                Ready to test your cybersecurity skills? Practice with realistic
                scenarios and showcase your abilities in our gamified
                environment.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  Web
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Crypto
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Forensics
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Reverse
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  PWN
                </div>
              </div>
              <button className="bg-[#EF4444] hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Start Your First Challenge
              </button>
            </div>
          </div>
        )}

        {/* Platform Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">500+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">150+</div>
            <div className="text-sm text-gray-600">Challenges</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">2500+</div>
            <div className="text-sm text-gray-600">Flags Captured</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Challenge */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-[#EF4444]" />
              <h2 className="text-xl font-bold text-gray-900">
                Latest Challenge
              </h2>
            </div>
            {latestRoom ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-[#EF4444] transition-colors">
                      {latestRoom.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {latestRoom.description.substring(0, 100)}...
                    </p>
                    {/* Added creation date display */}
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(latestRoom.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <div
                      className={`text-lg font-bold ${getDifficultyColor(
                        latestRoom.points
                      )}`}
                    >
                      {latestRoom.points} pts
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium ${getCategoryColor(
                      latestRoom.category
                    )}`}
                  >
                    {latestRoom.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-[#EF4444] hover:text-red-600">
                    <PlayCircle className="h-4 w-4" />
                    <Link href="/problems"> Start Challenge </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No challenges available</p>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/problems"
                className="bg-[#EF4444] hover:bg-red-500 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                View All Challenges
              </Link>
            </div>
          </div>

          {/* Last Solved & Quick Actions */}
          <div className="space-y-6">
            {/* Last Solved Problem */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Last Solved</h2>
              </div>

              {lastSolved ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <Flag className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {lastSolved.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lastSolved.category} • {lastSolved.points} pts
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(lastSolved.solvedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Flag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No challenges solved yet</p>
                  <p className="text-xs">Complete your first challenge!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/problems"
                  className="bg-[#EF4444] hover:bg-red-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Target className="h-4 w-4" />
                  Browse
                </Link>

                <Link
                  href="/leaderboard"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Leaderboard
                </Link>

                <Link
                  href="/profile"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Users className="h-4 w-4" />
                  Profile
                </Link>

                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;