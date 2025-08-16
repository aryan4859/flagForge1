"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { useSession } from "next-auth/react";

interface ProfileData {
  name: string;
  email: string;
  image: string;
  totalScore: number;
  rank: number;
  level: string;
  completedQuestions: number;
  badges: number;
  streak: number;
  createdAt: string;
}

const ProfilePage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [imageError, setImageError] = useState<boolean>(false);

  const fetchProfileData = useCallback(async () => {
    if (session?.user?.email) {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile`, {
          cache: "no-store", // Ensure fresh data
        });
        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await res.json();
        setProfileData(data);
        setError(null);
        setLastUpdated(new Date());
        setImageError(false); // Reset image error state when new data arrives
      } catch (error) {
        setError("Failed to load profile data");
      }
    }
    setLoading(false);
  }, [session?.user?.email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session) {
      fetchProfileData();
      
      // Auto-refresh profile data every 30 seconds
      interval = setInterval(fetchProfileData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session, fetchProfileData]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Get the appropriate image source
  const getImageSrc = useCallback(() => {
    if (imageError) {
      // Generate fallback image based on user name
      const userName = profileData?.name || session?.user?.name || "User";
      return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(userName.charAt(0).toUpperCase())}`;
    }

    // Try profileData image first, then session image, then fallback
    const userImage = profileData?.image || session?.user?.image;
    
    if (!userImage || userImage.trim() === '') {
      const userName = profileData?.name || session?.user?.name || "User";
      return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(userName.charAt(0).toUpperCase())}`;
    }

    return userImage;
  }, [profileData?.image, profileData?.name, session?.user?.image, session?.user?.name, imageError]);

  // Handle loading and session checks
  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
        <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
      <div className="max-w-3xl w-full bg-gray-800 shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={getImageSrc()}
              alt={profileData?.name || session?.user?.name || "Profile Picture"}
              width={150}
              height={150}
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-400"
              onError={handleImageError}
              unoptimized // Add this to handle external images better
            />
            {/* Optional: Add a loading indicator or placeholder */}
          </div>
          <h1 className="text-3xl font-bold mt-4">
            Welcome, {profileData?.name || session?.user?.name || "User"}!
          </h1>
          <p className="text-gray-400 mt-2">
            Email: {profileData?.email || session?.user?.email || "Not available"}
          </p>
          <p className="text-green-400 mt-2 text-lg font-bold">
            {profileData?.level || "[0x1][Newbie]"}
          </p>
          <p className="text-blue-400 mt-1 text-sm">
            Total Score: {profileData?.totalScore || 0} points
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-400">Rank</h2>
            <p className="text-2xl font-bold text-white mt-2">
              #{profileData?.rank || 'N/A'}
            </p>
          </div>
          <div className="text-center bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-400">Badges</h2>
            <p className="text-2xl font-bold text-white mt-2">
              {profileData?.badges || 0}
            </p>
          </div>
          <div className="text-center bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-400">Streak</h2>
            <p className="text-2xl font-bold text-white mt-2">
              {profileData?.streak || 0}
            </p>
          </div>
          <div className="text-center bg-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-400">Completed</h2>
            <p className="text-2xl font-bold text-white mt-2">
              {profileData?.completedQuestions || 0}
            </p>
          </div>
        </div>
        
        {/* Auto-refresh indicator */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30s
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;