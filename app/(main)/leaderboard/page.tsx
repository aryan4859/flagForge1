"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { Crown, User } from "lucide-react";

interface LeaderboardUser {
  name: string;
  totalScore: number;
  rank: number;
  image: string;
}

const LeaderboardPage = () => {
  const { status: sessionStatus } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image loading errors
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, userName: string) => {
    console.log(`Image failed to load for user: ${userName}`);
    setImageErrors(prev => new Set([...prev, userName]));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/leaderboard", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await res.json();
      
      const sortedData = data
        .sort((a: { totalScore: number }, b: { totalScore: number }) => b.totalScore - a.totalScore)
        .map((user: any, index: number) => ({
          ...user,
          rank: index + 1,
        }));
      
      setLeaderboard(sortedData);
      setLastUpdated(new Date());
      // Clear image errors when data refreshes
      setImageErrors(new Set());
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (sessionStatus === "authenticated") {
      fetchLeaderboard();
      intervalId = setInterval(fetchLeaderboard, 10000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionStatus, fetchLeaderboard]); 

  const getLevel = useCallback((score: number): string => {
    if (score < 200) return "[0x1][Newbie]";
    if (score < 500) return "[0x2][Scout]";
    if (score < 1000) return "[0x3][Codebreaker]";
    if (score < 1500) return "[0x4][Hacker]";
    if (score < 2000) return "[0x5][Cipher Hunter]";
    if (score < 3000) return "[0x6][Forger]";
    return "[0x7][Flag Conqueror]";
  }, []);

  // Check if user has a valid image
  const hasValidImage = (user: LeaderboardUser) => {
    return user.image && 
           user.image.trim() !== '' && 
           !imageErrors.has(user.name);
  };

  if (sessionStatus === "loading" || loading) {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center mt-[20vh]">
        <h1 className="text-2xl sm:text-2xl text-center text-rose-500 font-bold mb-4">
          Error: {error}
        </h1>
        <button 
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-16 px-8">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl sm:text-3xl tracking-tight text-center text-rose-500 font-bold mb-2">
          Leaderboard
        </h1>
      </div>
      
      <div className="w-full max-screen-w-2xl p-4">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {leaderboard.map((user: LeaderboardUser, index: number) => (
              <div
                className={`${index === 0 ? "col-span-full" : ""} transition-all duration-300 hover:scale-105`}
                key={`${user.name}-${user.rank}-${user.totalScore}`}
              >
                {user.totalScore > 0 ? (
                  <div
                    className={`flex flex-col bg-gray-50 rounded-lg px-6 py-5 shadow-lg shadow-gray-100 relative overflow-clip border border-gray-200 ${
                      index === 0 ? 'ring-2 ring-yellow-400' : ''
                    } ${
                      index === 1 ? 'ring-2 ring-gray-400' : ''
                    } ${
                      index === 2 ? 'ring-2 ring-orange-400' : ''
                    }`}
                  >
                    <span className={`text-xl font-bold absolute top-2 right-4 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-500' :
                      index === 2 ? 'text-orange-500' : 'text-rose-500'
                    }`}>
                      #{user.rank}
                    </span>
                    
                    {/* Avatar with fallback */}
                    <div className="w-20 h-20 rounded-full mb-2 border-2 border-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center">
                      {hasValidImage(user) ? (
                        <img
                          src={user.image}
                          alt={`${user.name}'s avatar`}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, user.name)}
                          loading="lazy"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User size={40} className="text-gray-500" />
                      )}
                    </div>
                    
                    <span className="font-medium text-sm text-rose-400">
                      {getLevel(user.totalScore)}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Score: {user.totalScore.toLocaleString()}
                    </p>
                    {index === 0 && (
                      <div className="absolute right-0 bottom-0 w-20 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                        <div className="absolute right-2 bottom-2">
                          <Crown color="white" size={16} />
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute right-0 bottom-0 w-16 h-12 bg-gradient-to-br from-gray-400 to-gray-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                        <div className="absolute right-1 bottom-1 text-white text-xs font-bold">2nd</div>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute right-0 bottom-0 w-16 h-12 bg-gradient-to-br from-orange-400 to-orange-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                        <div className="absolute right-1 bottom-1 text-white text-xs font-bold">3rd</div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;