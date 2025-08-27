"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { User } from "lucide-react";
import Image from 'next/image';
import Newbie from '../../../public/badges/0x1.png'
import Scout from '../../../public/badges/0x2.png'
import Codebreaker from '../../../public/badges/0x3.png'
import Hacker from '../../../public/badges/0x4.png'
import Cipher from '../../../public/badges/0x5.png'
import Forger from '../../../public/badges/0x6.png'
import Conqueror from '../../../public/badges/0x7.png'
import Flagforge from '../../../public/flagforge.gif'

interface LeaderboardUser {
  name: string;
  totalScore: number;
  rank: number;
  image: string;
  roomsCompleted: number;
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
        .slice(0, 50) // Limit to top 50 users
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
    if (score < 200) return "[0x1][NEWBIE]";
    if (score < 500) return "[0x2][SCOUT]";
    if (score < 1000) return "[0x3][CODEBREAKER]";
    if (score < 1500) return "[0x4][HACKER]";
    if (score < 2000) return "[0x5][CIPHER HUNTER]";
    if (score < 3000) return "[0x6][FORGER]";
    return "[0x7][FLAG CONQUEROR]";
  }, []);

  const getBadgeComponent = useCallback((score: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const dimensions = {
      small: { width: 48, height: 48 },
      medium: { width: 56, height: 56 },
      large: { width: 72, height: 72 }
    };
    
    const { width, height } = dimensions[size];
    
    if (score < 200) return <Image src={Newbie} alt="Newbie" width={width} height={height} className="drop-shadow-md" />;
    if (score < 500) return <Image src={Scout} alt="Scout" width={width} height={height} className="drop-shadow-md" />;
    if (score < 1000) return <Image src={Codebreaker} alt="Codebreaker" width={width} height={height} className="drop-shadow-md" />;
    if (score < 1500) return <Image src={Hacker} alt="Hacker" width={width} height={height} className="drop-shadow-md" />;
    if (score < 2000) return <Image src={Cipher} alt="Cipher Hunter" width={width} height={height} className="drop-shadow-md" />;
    if (score < 3000) return <Image src={Forger} alt="Forger" width={width} height={height} className="drop-shadow-md" />;
    return <Image src={Conqueror} alt="Flag Conqueror" width={width} height={height} className="drop-shadow-md" />;
  }, []);

  // Check if user has a valid image - if not, should show Flagforge
  const hasValidImage = (user: LeaderboardUser) => {
    return user.image && 
           user.image.trim() !== '' && 
           !imageErrors.has(user.name);
  };

  // Get the appropriate image source - either user image or Flagforge fallback
  const getImageSource = (user: LeaderboardUser) => {
    return hasValidImage(user) ? user.image : Flagforge.src;
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
        <p className="text-sm text-gray-600 text-center">
          Showing top 50 players only
        </p>
      </div>
      
      <div className="w-full max-w-6xl">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <>
            {/* First Place - Full Width */}
            {leaderboard.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-col bg-gray-50 rounded-lg px-6 py-5 shadow-lg shadow-gray-100 relative overflow-clip border border-gray-200 ring-2 ring-yellow-400">
                  <span className="text-xl font-bold absolute top-2 right-4 text-yellow-500">
                    #{leaderboard[0].rank}
                  </span>
                  
                  {/* Golden corner decoration for 1st place */}
                  <div className="absolute right-0 bottom-0 w-20 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                    <div className="absolute right-1 bottom-1 text-white text-xs font-bold">1st</div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <img
                        src={getImageSource(leaderboard[0])}
                        alt={`${leaderboard[0].name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, leaderboard[0].name)}
                        loading="lazy"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {leaderboard[0].name}
                      </h2>
                      <span className="font-medium text-rose-400 text-lg">
                        {getLevel(leaderboard[0].totalScore)}
                      </span>
                      <div className="flex items-center space-x-4 mt-2 text-gray-600">
                        <p className="text-lg">
                          Points: <span className="font-bold">{leaderboard[0].totalScore.toLocaleString()}</span>
                        </p>
                        <p className="text-lg">
                          Rooms in: <span className="font-bold">{leaderboard[0].roomsCompleted || 0}</span>
                        </p>
                      </div>
                    </div>

                    {/* Level Badge for 1st place */}
                    <div className="flex-shrink-0 ">
                      {getBadgeComponent(leaderboard[0].totalScore)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2nd to 5th Place - Grid Layout */}
            {leaderboard.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {leaderboard.slice(1, 5).map((user: LeaderboardUser, index: number) => {
                  const actualIndex = index + 1; // Since we're starting from index 1
                  return (
                    <div
                      key={`${user.name}-${user.rank}-${user.totalScore}`}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <div
                        className={`flex flex-col bg-gray-50 rounded-lg px-6 py-5 shadow-lg shadow-gray-100 relative overflow-clip border border-gray-200 ${
                          actualIndex === 1 ? 'ring-2 ring-gray-400' : ''
                        } ${
                          actualIndex === 2 ? 'ring-2 ring-orange-400' : ''
                        }`}
                      >
                        <span className={`text-xl font-bold absolute top-2 right-4 ${
                          actualIndex === 1 ? 'text-gray-500' :
                          actualIndex === 2 ? 'text-orange-500' : 'text-rose-500'
                        }`}>
                          #{user.rank}
                        </span>
                        
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full mb-2 border-2 border-gray-200 overflow-hidden bg-gray-200 flex items-center justify-center mx-auto">
                          <img
                            src={getImageSource(user)}
                            alt={`${user.name}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, user.name)}
                            loading="lazy"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Badge */}
                        <div className="flex justify-center mb-2">
                          {getBadgeComponent(user.totalScore)}
                        </div>
                        
                        <span className="font-medium text-sm text-rose-400 text-center">
                          {getLevel(user.totalScore)}
                        </span>
                        <h2 className="text-lg font-semibold text-gray-800 truncate text-center">
                          {user.name}
                        </h2>
                        <p className="text-sm text-gray-600 text-center">
                          Points: {user.totalScore.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 text-center">
                          Rooms: {user.roomsCompleted || 0}
                        </p>
                        
                        {actualIndex === 1 && (
                          <div className="absolute right-0 bottom-0 w-16 h-12 bg-gradient-to-br from-gray-400 to-gray-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                            <div className="absolute right-1 bottom-1 text-white text-xs font-bold">2nd</div>
                          </div>
                        )}
                        {actualIndex === 2 && (
                          <div className="absolute right-0 bottom-0 w-16 h-12 bg-gradient-to-br from-orange-400 to-orange-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                            <div className="absolute right-1 bottom-1 text-white text-xs font-bold">3rd</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table for remaining users */}
            {leaderboard.length > 5 && (
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 p-4 bg-rose-500 text-sm font-medium text-white border-b border-rose-600">
                  <div>Rank</div>
                  <div>Username</div>
                  <div>Points</div>
                  <div>Rooms</div>
                  <div>Badge</div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {leaderboard.slice(5).map((user: LeaderboardUser, index: number) => (
                    <div
                      key={`${user.name}-${user.rank}-${user.totalScore}`}
                      className="grid grid-cols-5 gap-4 p-4 text-sm hover:bg-gray-100 transition-colors"
                    >
                      {/* Rank */}
                      <div className="text-gray-800 font-medium">{user.rank}</div>
                      
                      {/* Username with Avatar */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getImageSource(user)}
                            alt={`${user.name}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, user.name)}
                            loading="lazy"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="text-rose-500 font-medium truncate">{user.name}</div>
                          <div className="text-xs text-gray-500">{getLevel(user.totalScore)}</div>
                        </div>
                      </div>
                      
                      {/* Points */}
                      <div className="text-gray-800">{user.totalScore.toLocaleString()}</div>
                      
                      {/* Rooms */}
                      <div className="text-gray-800">{user.roomsCompleted || 0}</div>
                      
                      {/* Badge */}
                      <div className="flex items-center">
                        {getBadgeComponent(user.totalScore)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;