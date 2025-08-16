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
        // Reset image error when new data arrives
        setImageError(false);
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

  // Handle image error - be more specific about which image failed
  const handleImageError = useCallback(() => {
    const currentImageSrc = getImageSrc();
    console.log('Image failed to load:', currentImageSrc);
    console.log('Profile image:', profileData?.image);
    console.log('Session image:', session?.user?.image);
    setImageError(true);
  }, [profileData?.image, session?.user?.image]);

  // Get the appropriate image source
  const getImageSrc = useCallback(() => {
    // If there's an image error with DB image, try session image
    if (imageError && profileData?.image) {
      const sessionImage = session?.user?.image;
      if (sessionImage && sessionImage.trim() !== '' && sessionImage !== 'undefined' && sessionImage !== 'null') {
        return sessionImage;
      }
      return null;
    }
    
    // Priority order: profileData.image -> session.user.image -> null
    let userImage = profileData?.image || session?.user?.image;
    
    // Return valid image URL or null if none available
    if (userImage && userImage.trim() !== '' && userImage !== 'undefined' && userImage !== 'null') {
      return userImage;
    }

    // Return null if no valid image - we'll handle this in the render
    return null;
  }, [profileData?.image, session?.user?.image, imageError]);

  // Reset image error when the image source changes, but be smarter about it
  useEffect(() => {
    // Only reset if we have a new image URL that's different from the failed one
    const currentImage = profileData?.image || session?.user?.image;
    if (currentImage && imageError) {
      setImageError(false);
    }
  }, [profileData?.image, session?.user?.image]);

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
            {getImageSrc() ? (
              <Image
                src={getImageSrc()!}
                alt={profileData?.name || session?.user?.name || "Profile Picture"}
                width={150}
                height={150}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-400"
                onError={handleImageError}
                unoptimized
                key={`${profileData?.image || session?.user?.image}-${lastUpdated.getTime()}`}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center mb-4 border-4 border-green-400">
                <span className="text-2xl font-bold text-gray-300">
                  {(profileData?.name || session?.user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
           
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