"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { 
  Flag, 
  Trophy, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  TrendingUp,
  Shield,
  Zap
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

interface PlatformStats {
  totalUsers: number;
  totalChallenges: number;
  totalFlags: number;
}

const Home = () => {
  const { status: sessionStatus, data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [latestRoom, setLatestRoom] = useState<LatestRoom | null>(null);
  const [lastSolved, setLastSolved] = useState<SolvedRoom | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchUserStats();
      fetchLatestRoom();
      fetchLastSolved();
      fetchPlatformStats();
    }
  }, [sessionStatus]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchLatestRoom = async () => {
    try {
      const response = await fetch('/api/problems?page=1&latest=true');
      if (response.ok) {
        const data = await response.json();
        setLatestRoom(data.data[0]); // Get only the latest room
      }
    } catch (error) {
      console.error('Failed to fetch latest room:', error);
    }
  };

  const fetchLastSolved = async () => {
    try {
      const response = await fetch('/api/user/last-solved');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setLastSolved(data[0]); // Get the most recent solved
        }
      }
    } catch (error) {
      console.error('Failed to fetch last solved:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const response = await fetch('/api/platform-stats');
      if (response.ok) {
        const data = await response.json();
        setPlatformStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch platform stats:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Web': 'bg-red-100 text-red-800',
      'Crypto': 'bg-purple-100 text-purple-800', 
      'Forensics': 'bg-green-100 text-green-800',
      'Reverse Engineering': 'bg-blue-100 text-blue-800',
      'PWN': 'bg-orange-100 text-orange-800',
      'OSINT': 'bg-cyan-100 text-cyan-800',
      'Misc': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (points: number) => {
    if (points <= 100) return 'text-green-600';
    if (points <= 300) return 'text-yellow-600';
    if (points <= 500) return 'text-orange-600';
    return 'text-red-600';
  };

  if (sessionStatus === "loading" || loading) {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Flag className="h-8 w-8 text-[#EF4444]" />
              <h1 className="text-4xl font-bold text-[#EF4444]">flagforge</h1>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto">
              Master cybersecurity through hands-on CTF challenges
            </p>
          </div>

          {/* Stats Cards */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Trophy className="h-6 w-6 text-[#EF4444] mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{userStats.totalScore}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Target className="h-6 w-6 text-[#EF4444] mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">#{userStats.rank}</div>
                <div className="text-xs text-gray-500">Rank</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 text-[#EF4444] mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{userStats.completedQuestions}</div>
                <div className="text-xs text-gray-500">Solved</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Zap className="h-6 w-6 text-[#EF4444] mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{userStats.streak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
            </div>
          )}

          {/* User Level */}
          {userStats && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200">
                <Shield className="h-5 w-5 text-[#EF4444]" />
                <span className="font-semibold text-[#EF4444]">{userStats.level}</span>
                <div className="flex gap-1 ml-2">
                  {Array.from({ length: userStats.badges }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Challenge */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-[#EF4444]" />
              <h2 className="text-xl font-bold text-gray-900">Latest Challenge</h2>
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
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`text-lg font-bold ${getDifficultyColor(latestRoom.points)}`}>
                      {latestRoom.points} pts
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(latestRoom.category)}`}>
                    {latestRoom.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-[#EF4444] hover:text-red-600">
                    <PlayCircle className="h-4 w-4" />
                    Start Challenge
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
              <button className="bg-[#EF4444] hover:bg-red-500 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                View All Challenges
              </button>
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
                      <div className="font-semibold text-gray-900">{lastSolved.title}</div>
                      <div className="text-sm text-gray-600">{lastSolved.category} • {lastSolved.points} pts</div>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-[#EF4444] hover:bg-red-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <Target className="h-4 w-4" />
                  Browse
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  Leaderboard
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Profile
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <Trophy className="h-4 w-4" />
                  Achievements
                </button>
              </div>
            </div>
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
                Ready to test your cybersecurity skills? Practice with realistic scenarios 
                and showcase your abilities in our gamified environment.
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
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">
              {platformStats?.totalUsers?.toLocaleString() || '...'}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">
              {platformStats?.totalChallenges?.toLocaleString() || '...'}
            </div>
            <div className="text-sm text-gray-600">Challenges</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#EF4444] mb-1">
              {platformStats?.totalFlags?.toLocaleString() || '...'}
            </div>
            <div className="text-sm text-gray-600">Flags Captured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;