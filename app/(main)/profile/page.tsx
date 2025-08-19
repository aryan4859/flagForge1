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
import Flagforge from '../../../public/flagforge.gif'

// Types
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

interface CompletedProblem {
  _id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  completedAt: string;
}

interface CreatedRoom {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
  isPublished: boolean;
}

// Badge configuration
const BADGE_CONFIG = [
  { name: "Newbie", threshold: 0 },
  { name: "Scout", threshold: 200 },
  { name: "Codebreaker", threshold: 500 },
  { name: "Hacker", threshold: 1000 },
  { name: "Cipher Hunter", threshold: 1500 },
  { name: "Forger", threshold: 2000 },
  { name: "Flag Conqueror", threshold: 3000 },
];

const CATEGORY_ICONS: { [key: string]: string } = {
  'Web': '🌐',
  'Crypto': '🔐',
  'Network': '📡',
  'Forensics': '🔍',
  'OSINT': '🕵️',
  'Pwn': '💀',
  'Reverse': '🔄',
  'Misc': '🎯',
  'Security': '🔓',
  'Defense': '🛡️',
  'Tutorial': '📚',
  'Networking': '🌐'
};

const DIFFICULTY_COLORS: { [key: string]: string } = {
  'Easy': 'text-green-600',
  'Medium': 'text-yellow-600', 
  'Hard': 'text-red-600',
  'Insane': 'text-purple-600'
};

const ProfilePage = () => {
  // Hooks
  const { data: session, status: sessionStatus } = useSession();
  
  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [completedProblems, setCompletedProblems] = useState<CompletedProblem[]>([]);
  const [createdRooms, setCreatedRooms] = useState<CreatedRoom[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showBadgeTooltip, setShowBadgeTooltip] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('completed');

  // Pagination states for completed problems
  const [problemsCurrentPage, setProblemsCurrentPage] = useState<number>(1);
  const [problemsLoading, setProblemsLoading] = useState<boolean>(false);
  const [problemsHasNextPage, setProblemsHasNextPage] = useState<boolean>(true);
  const [totalCompletedProblems, setTotalCompletedProblems] = useState<number>(0);

  // Pagination states for created rooms
  const [roomsCurrentPage, setRoomsCurrentPage] = useState<number>(1);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
  const [roomsHasNextPage, setRoomsHasNextPage] = useState<boolean>(true);
  const [totalCreatedRooms, setTotalCreatedRooms] = useState<number>(0);

  // Utility Functions
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
    const badge = BADGE_CONFIG.reverse().find(badge => score >= badge.threshold);
    return badge ? badge.name : "Newbie";
  }, []);

  const getNextBadgeInfo = useCallback((score: number) => {
    const nextBadge = BADGE_CONFIG.find(badge => score < badge.threshold);
    if (!nextBadge) return null;
    
    const currentBadge = BADGE_CONFIG.filter(badge => score >= badge.threshold).pop();
    const currentThreshold = currentBadge ? currentBadge.threshold : 0;
    const range = nextBadge.threshold - currentThreshold;
    const progress = ((score - currentThreshold) / range) * 100;
    
    return {
      nextThreshold: nextBadge.threshold,
      pointsNeeded: nextBadge.threshold - score,
      progress: Math.min(progress, 100)
    };
  }, []);

  const getImageSrc = useCallback(() => {
    const sources = [
      profileData?.image,
      session?.user?.image
    ];
    
    for (const src of sources) {
      if (src && 
          typeof src === 'string' && 
          src.trim() !== '' && 
          src !== 'undefined' && 
          src !== 'null' && 
          src.toLowerCase() !== 'null') {
        return src;
      }
    }
    
    return null;
  }, [profileData?.image, session?.user?.image]);

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || '📝';
  };

  const getDifficultyColor = (difficulty: string) => {
    return DIFFICULTY_COLORS[difficulty] || 'text-gray-600';
  };

  // API Functions
  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.email) return;
    
    try {
      const res = await fetch(`/api/profile`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch profile data: ${res.status}`);
      }
      
      const data = await res.json();
      setProfileData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Failed to load profile data");
      console.error('Profile fetch error:', error);
    }
  }, [session?.user?.email]);

  const fetchCompletedProblems = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setProblemsLoading(true);
    
    try {
      const res = await fetch(`/api/problems/completed?page=${problemsCurrentPage}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch completed problems: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        // Assuming your API returns pagination info similar to problems and rooms API
        const {
          completedProblems: problemsData = [],
          totalProblems,
          hasMore,
          totalPages
        } = data;
        
        setCompletedProblems(problemsData);
        setTotalCompletedProblems(totalProblems || problemsData.length);
        
        // Determine if there are more pages - similar logic to other paginated sections
        if (hasMore !== undefined) {
          setProblemsHasNextPage(hasMore);
        } else if (totalPages !== undefined) {
          setProblemsHasNextPage(problemsCurrentPage < totalPages);
        } else if (problemsData.length === 0) {
          setProblemsHasNextPage(false);
          if (problemsCurrentPage > 1) {
            setProblemsCurrentPage(prev => prev - 1);
          }
        } else {
          setProblemsHasNextPage(true);
        }
      } else {
        console.error('API returned error:', data.message);
        setCompletedProblems([]);
        setTotalCompletedProblems(0);
        setProblemsHasNextPage(false);
      }
    } catch (error) {
      console.error("Failed to load completed problems:", error);
      setCompletedProblems([]);
      setTotalCompletedProblems(0);
      setProblemsHasNextPage(false);
    } finally {
      setProblemsLoading(false);
    }
  }, [session?.user?.email, problemsCurrentPage]);

  const fetchCreatedRooms = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setRoomsLoading(true);
    
    try {
      const res = await fetch(`/api/rooms/created?page=${roomsCurrentPage}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch created rooms: ${res.status}`);
      }
      
      const data = await res.json();
      
      const {
        createdRooms: roomsData = [],
        totalRooms,
        hasMore,
        totalPages
      } = data;
      
      setCreatedRooms(roomsData);
      setTotalCreatedRooms(totalRooms || roomsData.length);
      
      // Determine if there are more pages - similar logic to problems
      if (hasMore !== undefined) {
        setRoomsHasNextPage(hasMore);
      } else if (totalPages !== undefined) {
        setRoomsHasNextPage(roomsCurrentPage < totalPages);
      } else if (roomsData.length === 0) {
        setRoomsHasNextPage(false);
        if (roomsCurrentPage > 1) {
          setRoomsCurrentPage(prev => prev - 1);
        }
      } else {
        setRoomsHasNextPage(true);
      }
      
    } catch (error) {
      console.error("Failed to load created rooms:", error);
      setCreatedRooms([]);
      setTotalCreatedRooms(0);
      setRoomsHasNextPage(false);
    } finally {
      setRoomsLoading(false);
    }
  }, [session?.user?.email, roomsCurrentPage]);

  // Pagination handlers for completed problems
  const handleProblemsNextPage = () => {
    if (problemsHasNextPage && !problemsLoading) {
      setProblemsCurrentPage(prev => prev + 1);
    }
  };

  const handleProblemsPrevPage = () => {
    if (problemsCurrentPage > 1 && !problemsLoading) {
      setProblemsCurrentPage(prev => prev - 1);
    }
  };

  // Pagination handlers for created rooms
  const handleRoomsNextPage = () => {
    if (roomsHasNextPage && !roomsLoading) {
      setRoomsCurrentPage(prev => prev + 1);
    }
  };

  const handleRoomsPrevPage = () => {
    if (roomsCurrentPage > 1 && !roomsLoading) {
      setRoomsCurrentPage(prev => prev - 1);
    }
  };

  // Effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session) {
      const loadData = async () => {
        await fetchProfileData();
        await fetchCompletedProblems();
        await fetchCreatedRooms();
        setLoading(false);
      };
      
      loadData();
      
      interval = setInterval(() => {
        fetchProfileData();
        if (activeTab === 'completed') {
          fetchCompletedProblems();
        } else if (activeTab === 'created') {
          fetchCreatedRooms();
        }
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session, activeTab, fetchProfileData, fetchCompletedProblems, fetchCreatedRooms]);

  // Reset pagination when switching tabs
  useEffect(() => {
    if (activeTab === 'completed') {
      setProblemsCurrentPage(1);
    } else if (activeTab === 'created') {
      setRoomsCurrentPage(1);
    }
  }, [activeTab]);

  // Fetch completed problems when page changes
  useEffect(() => {
    if (activeTab === 'completed' && session?.user?.email) {
      fetchCompletedProblems();
    }
  }, [problemsCurrentPage, activeTab, session?.user?.email, fetchCompletedProblems]);

  // Fetch created rooms when page changes
  useEffect(() => {
    if (activeTab === 'created' && session?.user?.email) {
      fetchCreatedRooms();
    }
  }, [roomsCurrentPage, activeTab, session?.user?.email, fetchCreatedRooms]);

  // Components
  const ProfileImage = () => {
    const imageSrc = getImageSrc();
    const displayName = profileData?.name || session?.user?.name || "User";
    const [hasError, setHasError] = useState(false);

    if (imageSrc && !hasError) {
      return (
        <Image
          src={imageSrc}
          alt={`${displayName} Profile Picture`}
          width={120}
          height={120}
          className="w-30 h-30 rounded-full object-cover border-4 border-red-500 shadow-lg"
          unoptimized
          priority
          onError={(e) => {
            console.error('Image load error:', e);
            setHasError(true);
          }}
        />
      );
    }

    // Fallback to Flagforge gif when no image or image fails to load
    return (
      <Image
        src={Flagforge}
        alt={`${displayName} Profile Picture`}
        width={120}
        height={120}
        className="w-30 h-30 rounded-full object-cover border-4 border-red-500 shadow-lg"
        unoptimized
        priority
      />
    );
  };

  const BadgeTooltip = () => {
    if (!showBadgeTooltip) return null;
    
    return (
      <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white p-4 rounded-lg shadow-xl z-10 w-80">
        <h4 className="text-sm font-bold mb-3 text-center">Badge Progress</h4>
        <div className="grid grid-cols-2 gap-2">
          {BADGE_CONFIG.map((badge) => (
            <div key={badge.name} className={`text-center p-2 rounded ${
              (profileData?.totalScore || 0) >= badge.threshold ? 'bg-green-600' : 'bg-gray-600'
            } ${
              getCurrentBadgeName(profileData?.totalScore || 0) === badge.name ? 'ring-2 ring-yellow-400' : ''
            }`}>
              <div className="flex justify-center mb-1">
                {getBadgeComponent(badge.threshold, 20)}
              </div>
              <p className="text-xs">{badge.name}</p>
              <p className="text-xs opacity-75">({badge.threshold}+)</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StatsGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center bg-white border-2 border-red-500 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-center mb-2">
          <span className="text-red-500 mr-2 text-xl">🏆</span>
          <span className="text-sm text-gray-600 font-medium">Rank</span>
        </div>
        <p className="text-2xl font-bold text-red-500">
          #{profileData?.rank || 'N/A'}
        </p>
      </div>
      
      <div className="text-center bg-white border-2 border-red-500 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-center mb-2">
          <span className="text-red-500 mr-2 text-xl">🎖️</span>
          <span className="text-sm text-gray-600 font-medium">Badges</span>
        </div>
        <p className="text-2xl font-bold text-red-500">
          {profileData?.badges || 0}
        </p>
      </div>
      
      <div className="text-center bg-white border-2 border-red-500 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-center mb-2">
          <span className="text-red-500 mr-2 text-xl">🔥</span>
          <span className="text-sm text-gray-600 font-medium">Streak</span>
        </div>
        <p className="text-2xl font-bold text-red-500">
          {profileData?.streak || 0}
        </p>
      </div>
      
      <div className="text-center bg-white border-2 border-red-500 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-center mb-2">
          <span className="text-red-500 mr-2 text-xl">✅</span>
          <span className="text-sm text-gray-600 font-medium">Completed</span>
        </div>
        <p className="text-2xl font-bold text-red-500">
          {profileData?.completedQuestions || profileData?.roomsCompleted || 0}
        </p>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="border-b-2 border-red-500 mb-6">
      <nav className="flex space-x-8">
        {[
          { id: 'completed', label: 'Completed Problems', icon: '✅', count: totalCompletedProblems },
          { id: 'badges', label: 'All Badges', icon: '🎖️', count: null },
          { id: 'created', label: 'Created Rooms', icon: '🏗️', count: totalCreatedRooms },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 py-3 px-1 text-sm font-medium flex items-center transition-colors ${
              activeTab === tab.id
                ? 'border-red-500 text-red-500' 
                : 'border-transparent text-gray-500 hover:text-red-500 hover:border-red-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </nav>
    </div>
  );

  // Render conditions
  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-6 text-center border-2 border-red-500">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const nextBadge = getNextBadgeInfo(profileData?.totalScore || 0);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border-2 border-red-500">
        {/* Auto-reload indicator */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <ProfileImage />
          </div>

          {/* Profile Info */}
          <div className="flex-grow text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {profileData?.name || session?.user?.name || "User"}
                </h1>
                <p className="text-xl font-semibold mb-2 text-red-500">
                  {profileData?.level || "[0x1][NEWBIE]"}
                </p>
                <p className="text-gray-600 text-lg">
                  {profileData?.email || session?.user?.email || "Not available"}
                </p>
              </div>
              
              {/* Current Badge with Tooltip */}
              <div className="relative mt-4 lg:mt-0">
                <div 
                  className="cursor-pointer transform hover:scale-105 transition-transform"
                  onMouseEnter={() => setShowBadgeTooltip(true)}
                  onMouseLeave={() => setShowBadgeTooltip(false)}
                >
                  <div className="bg-white rounded-full p-4 shadow-lg border-2 border-red-500">
                    {getBadgeComponent(profileData?.totalScore || 0, 80)}
                  </div>
                </div>
                
                <BadgeTooltip />
              </div>
            </div>

            {/* Current Score and Progress */}
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-red-500 mb-1">
                    {getCurrentBadgeName(profileData?.totalScore || 0)}
                  </h3>
                  <p className="text-3xl font-bold text-red-500">
                    {profileData?.totalScore || 0} points
                  </p>
                </div>
                
                {nextBadge && (
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-600 mb-2">
                      Next Badge: {nextBadge.pointsNeeded} points needed
                    </p>
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${nextBadge.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {nextBadge.progress.toFixed(1)}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>

            <StatsGrid />
          </div>
        </div>

        <TabNavigation />

        {/* Tab Content */}
        {activeTab === 'completed' && (
          <div>
            {/* Loading indicator for completed problems */}
            {problemsLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            )}

            {!problemsLoading && completedProblems.length > 0 ? (
              <div>
                <div className="mx-auto my-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 sm:grid-cols-2 items-center gap-4 mb-8">
                  {completedProblems.map((problem) => (
                    <div 
                      key={problem._id} 
                      className="bg-white rounded-lg p-6 border-2 border-red-500 hover:shadow-lg transition-all duration-200 hover:border-red-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-800">{problem.title}</h3>
                        <span className="font-bold text-red-500">
                          +{problem.points}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {problem.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-500">
                            ✅ Completed
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-500">
                            {problem.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Completed Problems */}
                {(completedProblems.length > 0 || problemsCurrentPage > 1) && (
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-sm text-gray-600">
                      Page {problemsCurrentPage} {totalCompletedProblems > 0 && `• Total: ${totalCompletedProblems} problems`}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleProblemsPrevPage}
                        disabled={problemsCurrentPage === 1 || problemsLoading}
                        className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors ${
                          problemsCurrentPage === 1 || problemsLoading
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleProblemsNextPage}
                        disabled={!problemsHasNextPage || problemsLoading}
                        className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors ${
                          !problemsHasNextPage || problemsLoading
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !problemsLoading && completedProblems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {problemsCurrentPage === 1 ? "No Problems Completed Yet" : "No More Problems"}
                </h3>
                <p className="text-gray-600">
                  {problemsCurrentPage === 1 
                    ? "Start solving challenges to see your progress here!" 
                    : "You've reached the end of your completed problems."}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Badge Collection</h3>
              <p className="text-gray-600">Earn badges by accumulating points through completed challenges</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {BADGE_CONFIG.map((badge) => {
                const earned = (profileData?.totalScore || 0) >= badge.threshold;
                const current = getCurrentBadgeName(profileData?.totalScore || 0) === badge.name;
                
                return (
                  <div key={badge.name} className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    earned 
                      ? current 
                        ? 'border-red-500 bg-red-50 shadow-lg ring-2 ring-red-200' 
                        : 'border-green-500 bg-green-50 hover:shadow-md'
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}>
                    <div className={`mb-3 flex justify-center ${earned ? '' : 'opacity-50 grayscale'}`}>
                      {getBadgeComponent(badge.threshold, 64)}
                    </div>
                    <h4 className={`font-bold text-center mb-1 ${
                      earned ? current ? 'text-red-500' : 'text-green-700' : 'text-gray-500'
                    }`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-center text-gray-600">
                      {badge.threshold}+ points required
                    </p>
                    {current && (
                      <div className="mt-2 text-center">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          Current
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'created' && (
          <div>
            {/* Loading indicator for rooms */}
            {roomsLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            )}

            {!roomsLoading && createdRooms.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {createdRooms.map((room) => (
                    <div key={room._id} className="bg-white rounded-lg p-6 border-2 border-red-500 hover:shadow-lg transition-all duration-200 hover:border-red-600">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 border border-red-500">
                          <span className="text-red-500 text-xl">
                            {getCategoryIcon(room.category)}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg text-gray-800">{room.title}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(room.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            room.isPublished 
                              ? 'bg-green-100 text-green-700 border border-green-500' 
                              : 'bg-gray-100 text-gray-700 border border-gray-500'
                          }`}>
                            {room.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {room.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">📊</span>
                          <span className={`text-sm font-medium ${getDifficultyColor(room.difficulty)}`}>
                            {room.difficulty}
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-500">
                          {room.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Created Rooms */}
                {(createdRooms.length > 0 || roomsCurrentPage > 1) && (
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-sm text-gray-600">
                      Page {roomsCurrentPage} {totalCreatedRooms > 0 && `• Total: ${totalCreatedRooms} rooms`}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleRoomsPrevPage}
                        disabled={roomsCurrentPage === 1 || roomsLoading}
                        className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors ${
                          roomsCurrentPage === 1 || roomsLoading
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleRoomsNextPage}
                        disabled={!roomsHasNextPage || roomsLoading}
                        className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors ${
                          !roomsHasNextPage || roomsLoading
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !roomsLoading && createdRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {roomsCurrentPage === 1 ? "No Rooms Created Yet" : "No More Rooms"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {roomsCurrentPage === 1 
                    ? "Start creating your own challenges to share with the community!" 
                    : "You've reached the end of your created rooms."}
                </p>
                {roomsCurrentPage === 1 && (
                  <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                    Create Your First Room
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;