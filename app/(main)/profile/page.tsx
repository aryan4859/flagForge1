"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { useSession } from "next-auth/react";
import Newbie from '../../../public/badges/novice.svg'
import Scout from '../../../public/badges/apprentice.svg'
import Codebreaker from '../../../public/badges/defender.svg'
import Hacker from '../../../public/badges/0x8.svg'
import Cipher from '../../../public/badges/guardian.svg'
import Forger from '../../../public/badges/0xB.svg'
import Conqueror from '../../../public/badges/god.svg'

interface ProfileData {
  name: string;
  email: string;
  image: string;
  totalScore: number;
  rank: number;
  level: string;
  completedQuestions: number;
  roomsCompleted: number;
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

  // Get badge component based on score (same logic as leaderboard)
  const getBadgeComponent = useCallback((score: number, size: number = 48) => {
    if (score < 200) return <Image src={Newbie} alt="Newbie" width={size} height={size} />;
    if (score < 500) return <Image src={Scout} alt="Scout" width={size} height={size} />;
    if (score < 1000) return <Image src={Codebreaker} alt="Codebreaker" width={size} height={size} />;
    if (score < 1500) return <Image src={Hacker} alt="Hacker" width={size} height={size} />;
    if (score < 2000) return <Image src={Cipher} alt="Cipher Hunter" width={size} height={size} />;
    if (score < 3000) return <Image src={Forger} alt="Forger" width={size} height={size} />;
    return <Image src={Conqueror} alt="Flag Conqueror" width={size} height={size} />;
  }, []);

  const getCurrentBadgeName = useCallback((score: number) => {
    if (score < 200) return "Newbie";
    if (score < 500) return "Scout";
    if (score < 1000) return "Codebreaker";
    if (score < 1500) return "Hacker";
    if (score < 2000) return "Cipher Hunter";
    if (score < 3000) return "Forger";
    return "Flag Conqueror";
  }, []);

  const fetchProfileData = useCallback(async () => {
    if (session?.user?.email) {
      try {
        setLoading(true);
        const res = await fetch(`/api/profile`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await res.json();
        setProfileData(data);
        setError(null);
        setLastUpdated(new Date());
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
      
      interval = setInterval(fetchProfileData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session, fetchProfileData]);

  const handleImageError = useCallback(() => {
    const currentImageSrc = getImageSrc();
    console.log('Image failed to load:', currentImageSrc);
    console.log('Profile image:', profileData?.image);
    console.log('Session image:', session?.user?.image);
    setImageError(true);
  }, [profileData?.image, session?.user?.image]);

  const getImageSrc = useCallback(() => {
    if (imageError && profileData?.image) {
      const sessionImage = session?.user?.image;
      if (sessionImage && sessionImage.trim() !== '' && sessionImage !== 'undefined' && sessionImage !== 'null') {
        return sessionImage;
      }
      return null;
    }
    
    let userImage = profileData?.image || session?.user?.image;
    
    if (userImage && userImage.trim() !== '' && userImage !== 'undefined' && userImage !== 'null') {
      return userImage;
    }

    return null;
  }, [profileData?.image, session?.user?.image, imageError]);

  useEffect(() => {
    const currentImage = profileData?.image || session?.user?.image;
    if (currentImage && imageError) {
      setImageError(false);
    }
  }, [profileData?.image, session?.user?.image]);

  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-rose-500 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            {getImageSrc() ? (
              <Image
                src={getImageSrc()!}
                alt={profileData?.name || session?.user?.name || "Profile Picture"}
                width={150}
                height={150}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-rose-400"
                onError={handleImageError}
                unoptimized
                key={`${profileData?.image || session?.user?.image}-${lastUpdated.getTime()}`}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4 border-4 border-rose-400">
                <span className="text-2xl font-bold text-gray-600">
                  {(profileData?.name || session?.user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Welcome, {profileData?.name || session?.user?.name || "User"}!
          </h1>
          <p className="text-gray-600 mt-2">
            Email: {profileData?.email || session?.user?.email || "Not available"}
          </p>
        </div>

        <div className="mt-8 text-center bg-gradient-to-r from-rose-50 to-blue-50 rounded-2xl p-8 border-2 border-rose-200 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Achievement</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-blue-400 rounded-full blur-lg opacity-30 scale-110"></div>
              <div className="relative bg-white rounded-full p-4 shadow-xl border-4 border-rose-300">
                {getBadgeComponent(profileData?.totalScore || 0, 120)}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-rose-600 mb-2">
                {getCurrentBadgeName(profileData?.totalScore || 0)}
              </h3>
              <p className="text-rose-500 text-lg font-bold mb-2">
                {profileData?.level || "[0x1][NEWBIE]"}
              </p>
              <p className="text-blue-600 text-xl font-bold">
                {profileData?.totalScore || 0} points
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-rose-500">Rank</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              #{profileData?.rank || 'N/A'}
            </p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-rose-500">Badges</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {profileData?.badges || 0}
            </p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-rose-500">Streak</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {profileData?.streak || 0}
            </p>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-rose-500">Rooms Completed</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {profileData?.roomsCompleted || profileData?.completedQuestions || 0}
            </p>
          </div>
        </div>
        
        {/* Badge Progress Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">All Badges Progress</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Show different badge levels with progress */}
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 0 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) < 200 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Newbie} alt="Newbie" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Newbie</p>
              <p className="text-xs text-gray-500">0+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 200 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 200 && (profileData?.totalScore || 0) < 500 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Scout} alt="Scout" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Scout</p>
              <p className="text-xs text-gray-500">200+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 500 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 500 && (profileData?.totalScore || 0) < 1000 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Codebreaker} alt="Codebreaker" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Codebreaker</p>
              <p className="text-xs text-gray-500">500+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 1000 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 1000 && (profileData?.totalScore || 0) < 1500 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Hacker} alt="Hacker" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Hacker</p>
              <p className="text-xs text-gray-500">1000+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 1500 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 1500 && (profileData?.totalScore || 0) < 2000 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Cipher} alt="Cipher Hunter" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Cipher Hunter</p>
              <p className="text-xs text-gray-500">1500+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 2000 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 2000 && (profileData?.totalScore || 0) < 3000 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Forger} alt="Forger" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Forger</p>
              <p className="text-xs text-gray-500">2000+ pts</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${(profileData?.totalScore || 0) >= 3000 ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border ${(profileData?.totalScore || 0) >= 3000 ? 'ring-2 ring-rose-400 shadow-md' : ''}`}>
              <Image src={Conqueror} alt="Flag Conqueror" width={32} height={32} className="mx-auto mb-2" />
              <p className="text-xs font-medium">Flag Conqueror</p>
              <p className="text-xs text-gray-500">3000+ pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;