"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Award,
  Flame,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  Star,
  Crown,
  Gift,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";
import Newbie from "../../../public/badges/0x1.png";
import Scout from "../../../public/badges/0x2.png";
import Codebreaker from "../../../public/badges/0x3.png";
import Hacker from "../../../public/badges/0x4.png";
import Cipher from "../../../public/badges/0x5.png";
import Forger from "../../../public/badges/0x6.png";
import Conqueror from "../../../public/badges/0x7.png";
import Flagforge from "../../../public/flagforge.gif";

// Types
interface CustomBadge {
  _id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  assignedAt: Date;
  assignedBy: string;
}

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
  customBadges?: CustomBadge[];
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
  { name: "Newbie", threshold: 0, color: "from-gray-400 to-gray-600" },
  { name: "Scout", threshold: 200, color: "from-blue-400 to-blue-600" },
  { name: "Codebreaker", threshold: 500, color: "from-green-400 to-green-600" },
  { name: "Hacker", threshold: 1000, color: "from-purple-400 to-purple-600" },
  {
    name: "Cipher Hunter",
    threshold: 1500,
    color: "from-orange-400 to-orange-600",
  },
  { name: "Forger", threshold: 2000, color: "from-red-400 to-red-600" },
  {
    name: "Flag Conqueror",
    threshold: 3000,
    color: "from-yellow-400 to-yellow-600",
  },
];

const CATEGORY_ICONS: { [key: string]: string } = {
  Web: "🌐",
  Crypto: "🔐",
  Network: "📡",
  Forensics: "🔍",
  OSINT: "🕵️",
  Pwn: "💀",
  Reverse: "🔄",
  Misc: "🎯",
  Security: "🔓",
  Defense: "🛡️",
  Tutorial: "📚",
  Networking: "🌐",
};

const DIFFICULTY_CONFIG: {
  [key: string]: {
    color: string;
    bg: string;
    border: string;
    darkColor: string;
    darkBg: string;
    darkBorder: string;
  };
} = {
  Easy: {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    darkColor: "dark:text-green-400",
    darkBg: "dark:bg-green-900/30",
    darkBorder: "dark:border-green-700",
  },
  Medium: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    darkColor: "dark:text-yellow-400",
    darkBg: "dark:bg-yellow-900/30",
    darkBorder: "dark:border-yellow-700",
  },
  Hard: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    darkColor: "dark:text-red-500",
    darkBg: "dark:bg-red-900/30",
    darkBorder: "dark:border-red-700",
  },
  Insane: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    darkColor: "dark:text-purple-400",
    darkBg: "dark:bg-purple-900/30",
    darkBorder: "dark:border-purple-700",
  },
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
  const [activeTab, setActiveTab] = useState<string>("completed");
  const [showCustomBadgeTooltip, setShowCustomBadgeTooltip] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string>('');
  
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
    if (score < 200)
      return (
        <Image
          src={Newbie}
          alt="Newbie"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    if (score < 500)
      return (
        <Image
          src={Scout}
          alt="Scout"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    if (score < 1000)
      return (
        <Image
          src={Codebreaker}
          alt="Codebreaker"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    if (score < 1500)
      return (
        <Image
          src={Hacker}
          alt="Hacker"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    if (score < 2000)
      return (
        <Image
          src={Cipher}
          alt="Cipher Hunter"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    if (score < 3000)
      return (
        <Image
          src={Forger}
          alt="Forger"
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      );
    return (
      <Image
        src={Conqueror}
        alt="Flag Conqueror"
        width={size}
        height={size}
        className="drop-shadow-sm"
      />
    );
  }, []);

  const getCurrentBadgeName = useCallback((score: number) => {
    const badge = BADGE_CONFIG.slice()
      .reverse()
      .find((badge) => score >= badge.threshold);
    return badge ? badge.name : "Newbie";
  }, []);

  const getNextBadgeInfo = useCallback((score: number) => {
    const nextBadge = BADGE_CONFIG.find((badge) => score < badge.threshold);
    if (!nextBadge) return null;
    const currentBadge = BADGE_CONFIG.filter(
      (badge) => score >= badge.threshold
    ).pop();
    const currentThreshold = currentBadge ? currentBadge.threshold : 0;
    const range = nextBadge.threshold - currentThreshold;
    const progress = ((score - currentThreshold) / range) * 100;
    return {
      nextThreshold: nextBadge.threshold,
      pointsNeeded: nextBadge.threshold - score,
      progress: Math.min(progress, 100),
      nextBadgeName: nextBadge.name,
    };
  }, []);

  const getImageSrc = useCallback(() => {
    const sources = [profileData?.image, session?.user?.image];
    for (const src of sources) {
      if (
        src &&
        typeof src === "string" &&
        src.trim() !== "" &&
        src !== "undefined" &&
        src !== "null" &&
        src.toLowerCase() !== "null"
      ) {
        return src;
      }
    }
    return null;
  }, [profileData?.image, session?.user?.image]);

  const getCategoryIcon = (category: string) => CATEGORY_ICONS[category] || "📝";
  const getDifficultyStyle = (difficulty: string) => DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG["Easy"];

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // API Functions
  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/profile`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      if (!res.ok)
        throw new Error(`Failed to fetch profile data: ${res.status}`);
      const data = await res.json();
      setProfileData(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Failed to load profile data");
      console.error("Profile fetch error:", error);
    }
  }, [session?.user?.email]);

  const fetchCompletedProblems = useCallback(async () => {
    if (!session?.user?.email) return;
    setProblemsLoading(true);
    try {
      const res = await fetch(
        `/api/problems/completed?page=${problemsCurrentPage}`,
        {
          method: "GET",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        }
      );
      if (!res.ok)
        throw new Error(`Failed to fetch completed problems: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        const {
          completedProblems: problemsData = [],
          totalProblems,
          hasMore,
          totalPages,
        } = data;
        setCompletedProblems(problemsData);
        setTotalCompletedProblems(totalProblems || problemsData.length);
        if (hasMore !== undefined) {
          setProblemsHasNextPage(hasMore);
        } else if (totalPages !== undefined) {
          setProblemsHasNextPage(problemsCurrentPage < totalPages);
        } else if (problemsData.length === 0) {
          setProblemsHasNextPage(false);
          if (problemsCurrentPage > 1)
            setProblemsCurrentPage((prev) => prev - 1);
        } else {
          setProblemsHasNextPage(true);
        }
      } else {
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
      // const res = await fetch(`/api/rooms/created?page=${roomsCurrentPage}`, {
      const res = await fetch(`/`, {

        method: "GET",
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
      if (!res.ok)
        throw new Error(`Failed to fetch created rooms: ${res.status}`);
      const data = await res.json();
      const {
        createdRooms: roomsData = [],
        totalRooms,
        hasMore,
        totalPages,
      } = data;
      setCreatedRooms(roomsData);
      setTotalCreatedRooms(totalRooms || roomsData.length);
      if (hasMore !== undefined) {
        setRoomsHasNextPage(hasMore);
      } else if (totalPages !== undefined) {
        setRoomsHasNextPage(roomsCurrentPage < totalPages);
      } else if (roomsData.length === 0) {
        setRoomsHasNextPage(false);
        if (roomsCurrentPage > 1) setRoomsCurrentPage((prev) => prev - 1);
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

  // Pagination handlers
  const handleProblemsNextPage = () => {
    if (problemsHasNextPage && !problemsLoading)
      setProblemsCurrentPage((prev) => prev + 1);
  };

  const handleProblemsPrevPage = () => {
    if (problemsCurrentPage > 1 && !problemsLoading)
      setProblemsCurrentPage((prev) => prev - 1);
  };

  const handleRoomsNextPage = () => {
    if (roomsHasNextPage && !roomsLoading)
      setRoomsCurrentPage((prev) => prev + 1);
  };

  const handleRoomsPrevPage = () => {
    if (roomsCurrentPage > 1 && !roomsLoading)
      setRoomsCurrentPage((prev) => prev - 1);
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
        if (activeTab === "completed") fetchCompletedProblems();
        else if (activeTab === "created") fetchCreatedRooms();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    session,
    activeTab,
    fetchProfileData,
    fetchCompletedProblems,
    fetchCreatedRooms,
  ]);

  useEffect(() => {
    if (activeTab === "completed") setProblemsCurrentPage(1);
    else if (activeTab === "created") setRoomsCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "completed" && session?.user?.email)
      fetchCompletedProblems();
  }, [
    problemsCurrentPage,
    activeTab,
    session?.user?.email,
    fetchCompletedProblems,
  ]);

  useEffect(() => {
    if (activeTab === "created" && session?.user?.email) fetchCreatedRooms();
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
          className="w-30 h-30 rounded-full object-cover ring-4 ring-red-500 shadow-xl"
          unoptimized
          priority
          onError={() => setHasError(true)}
        />
      );
    }
    
    return (
      <Image
        src={Flagforge}
        alt={`${displayName} Profile Picture`}
        width={120}
        height={120}
        className="w-30 h-30 rounded-full object-cover ring-4 ring-red-500 shadow-xl"
        unoptimized
        priority
      />
    );
  };

  const CustomBadgeDisplay = () => {
    if (!profileData?.customBadges || profileData.customBadges.length === 0) return null;

    return (
      <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            Special Badges
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {profileData.customBadges.length} badge{profileData.customBadges.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {profileData.customBadges.map((badge, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowCustomBadgeTooltip(badge.name)}
              onMouseLeave={() => setShowCustomBadgeTooltip(null)}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg ring-2 ring-yellow-200 dark:ring-yellow-600 hover:scale-105 transition-transform duration-200">
                <Image
                  src={badge.icon}
                  alt={badge.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/api/placeholder/64/64';
                  }}
                />
              </div>
              
              {/* Custom Badge Tooltip */}
              {showCustomBadgeTooltip === badge.name && (
                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 shadow-lg">
                  <div className="text-center">
                    <div className="font-semibold text-yellow-300">{badge.name}</div>
                    <div className="text-gray-300">{badge.description}</div>
                    <div className="text-gray-400 mt-1">
                      By: {badge.assignedBy}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(badge.assignedAt)}
                    </div>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BadgeTooltip = () => {
    if (!showBadgeTooltip) return null;
    return (
      <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-6 z-10 w-80">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Badge Progress
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {BADGE_CONFIG.map((badge) => {
            const earned = (profileData?.totalScore || 0) >= badge.threshold;
            const current =
              getCurrentBadgeName(profileData?.totalScore || 0) === badge.name;
            return (
              <div
                key={badge.name}
                className={`text-center p-3 rounded-lg border transition-all ${
                  earned
                    ? current
                      ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 shadow-sm ring-2 ring-red-200 dark:ring-red-700"
                      : "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60"
                }`}
              >
                <div className="flex justify-center mb-2">
                  {getBadgeComponent(badge.threshold, 24)}
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {badge.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ({badge.threshold}+)
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const HeroStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
      {[
        {
          icon: Trophy,
          label: "Rank",
          value: `#${profileData?.rank || "N/A"}`,
          color: "text-red-500",
          bg: "bg-white/95 dark:bg-gray-800/95",
          border: "border-gray-200 dark:border-gray-700",
        },
        {
          icon: Award,
          label: "System Badges",
          value: profileData?.badges || 0,
          color: "text-red-500",
          bg: "bg-white/95 dark:bg-gray-800/95",
          border: "border-gray-200 dark:border-gray-700",
        },
        {
          icon: Crown,
          label: "Special Badges",
          value: profileData?.customBadges?.length || 0,
          color: "text-yellow-500",
          bg: "bg-white/95 dark:bg-gray-800/95",
          border: "border-gray-200 dark:border-gray-700",
        },
        {
          icon: Flame,
          label: "Streak",
          value: profileData?.streak || 0,
          color: "text-red-500",
          bg: "bg-white/95 dark:bg-gray-800/95",
          border: "border-gray-200 dark:border-gray-700",
        },
        {
          icon: CheckCircle,
          label: "Completed",
          value:
            profileData?.completedQuestions || profileData?.roomsCompleted || 0,
          color: "text-red-500",
          bg: "bg-white/95 dark:bg-gray-800/95",
          border: "border-gray-200 dark:border-gray-700",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} ${stat.border} backdrop-blur-sm border rounded-xl p-4 lg:p-6 text-center transition-all hover:bg-white dark:hover:bg-gray-800 hover:scale-105 shadow-lg`}
        >
          <stat.icon
            className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color} mx-auto mb-2 lg:mb-3`}
          />
          <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </p>
          <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );

  const TabNavigation = () => (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8">
        {[
          {
            id: "completed",
            label: "Completed Problems",
            icon: CheckCircle,
            count: totalCompletedProblems,
          },
          { 
            id: "badges", 
            label: "Badge Collection", 
            icon: Award, 
            count: null 
          },
          {
            id: "created",
            label: "Created Rooms",
            icon: Star,
            count: totalCreatedRooms,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 py-4 px-1 text-sm font-medium flex items-center transition-all ${
              activeTab === tab.id
                ? "border-red-600 text-gray-900 dark:text-gray-100"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </nav>
    </div>
  );

  // Render conditions
  if (loading || sessionStatus === "loading") return <Loading />;
  if (sessionStatus === "unauthenticated") return <AuthError />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Unable to Load Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProfileData}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const nextBadge = getNextBadgeInfo(profileData?.totalScore || 0);
  const memberSince = profileData?.createdAt
    ? new Date(profileData.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <ProfileImage />
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
                    {profileData?.name || session?.user?.name || "User"}
                  </h1>
                  <p className="text-xl text-red-600 dark:text-red-500 mb-4 font-medium">
                    {profileData?.level || "[0x1][NEWBIE]"}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {profileData?.email || session?.user?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Member since {memberSince}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Current Badge */}
                <div className="relative">
                  <div
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                    onMouseEnter={() => setShowBadgeTooltip(true)}
                    onMouseLeave={() => setShowBadgeTooltip(false)}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                      {getBadgeComponent(profileData?.totalScore || 0, 80)}
                    </div>
                  </div>
                  <BadgeTooltip />
                </div>
              </div>
              
              {/* Score and Progress */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mt-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {getCurrentBadgeName(profileData?.totalScore || 0)}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {profileData?.totalScore?.toLocaleString() || 0} points
                    </p>
                  </div>
                  {nextBadge && (
                    <div className="text-center md:text-right flex-shrink-0">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Next: {nextBadge.nextBadgeName} (
                        {nextBadge.pointsNeeded} points needed)
                      </p>
                      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${nextBadge.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {nextBadge.progress.toFixed(1)}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <CustomBadgeDisplay />
              
              <HeroStats />

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mt-8 shadow-lg">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Share Your Profile
                  </h3>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Badge</span>
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Create a shareable badge for GitHub, LinkedIn, Twitter and more!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-20">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 pb-0">
            <TabNavigation />
          </div>
          <div className="p-6">
            {/* Tab Content */}
            {activeTab === "completed" && (
              <div>
                {problemsLoading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                )}
                {!problemsLoading && completedProblems.length > 0 ? (
                  <div>
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {completedProblems.map((problem) => {
                        const diffStyle = getDifficultyStyle(problem.difficulty);
                        return (
                          <div
                            key={problem._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 leading-tight">
                                {problem.title}
                              </h3>
                              <span className="font-bold text-white bg-red-500 px-3 py-1 rounded-full text-sm ml-3 flex-shrink-0">
                                +{problem.points}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {problem.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${diffStyle.color} ${diffStyle.darkColor} ${diffStyle.bg} ${diffStyle.darkBg} border ${diffStyle.border} ${diffStyle.darkBorder}`}
                              >
                                {problem.difficulty}
                              </span>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full border border-green-200 dark:border-green-700">
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                  Completed
                                </span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                                  {problem.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Pagination */}
                    {(completedProblems.length > 0 || problemsCurrentPage > 1) && (
                      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Page {problemsCurrentPage}{" "}
                          {totalCompletedProblems > 0 &&
                            `• ${totalCompletedProblems} problems total`}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleProblemsPrevPage}
                            disabled={problemsCurrentPage === 1 || problemsLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              problemsCurrentPage === 1 || problemsLoading
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={handleProblemsNextPage}
                            disabled={!problemsHasNextPage || problemsLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              !problemsHasNextPage || problemsLoading
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : !problemsLoading && completedProblems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {problemsCurrentPage === 1
                        ? "No Problems Completed Yet"
                        : "No More Problems"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {problemsCurrentPage === 1
                        ? "Start solving challenges to build your portfolio and earn badges!"
                        : "You've reached the end of your completed problems."}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === "badges" && (
              <div>
                {/* System Badges Section */}
                <div className="mb-12">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      System Badge Collection
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Unlock prestigious badges by accumulating points through completed challenges. 
                      Each badge represents your growing expertise in cybersecurity.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {BADGE_CONFIG.map((badge) => {
                      const earned = (profileData?.totalScore || 0) >= badge.threshold;
                      const current = getCurrentBadgeName(profileData?.totalScore || 0) === badge.name;
                      return (
                        <div
                          key={badge.name}
                          className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                            earned
                              ? current
                                ? `border-red-500 bg-gradient-to-br ${badge.color} shadow-lg ring-2 ring-red-300 dark:ring-red-700 text-white`
                                : "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 hover:shadow-md hover:border-green-400 dark:hover:border-green-500"
                              : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {current && (
                            <div className="absolute -top-2 -right-2">
                              <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                Current
                              </div>
                            </div>
                          )}
                          <div className={`mb-4 flex justify-center ${earned ? "" : "opacity-40 grayscale"}`}>
                            {getBadgeComponent(badge.threshold, 72)}
                          </div>
                          <h4 className={`font-bold text-center mb-2 text-lg ${
                              earned
                                ? current
                                  ? "text-white"
                                  : "text-green-800 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {badge.name}
                          </h4>
                          <p className={`text-sm text-center ${
                              earned
                                ? current
                                  ? "text-red-100"
                                  : "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {badge.threshold}+ points required
                          </p>
                          {earned && !current && (
                            <div className="mt-3 text-center">
                              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium border border-green-200 dark:border-green-700">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                Earned
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Badges Section */}
                {profileData?.customBadges && profileData.customBadges.length > 0 && (
                  <div>
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-center">
                        <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                        Special Achievement Badges
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Exclusive badges awarded by administrators for exceptional contributions, 
                        outstanding achievements, or special recognitions.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {profileData.customBadges.map((badge, index) => (
                        <div
                          key={index}
                          className="relative p-6 rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-yellow-200 dark:ring-yellow-600"
                        >
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                              <Gift className="w-3 h-3 mr-1" />
                              Special
                            </div>
                          </div>
                          <div className="mb-4 flex justify-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg ring-2 ring-yellow-200 dark:ring-yellow-600">
                              <Image
                                src={badge.icon}
                                alt={badge.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/api/placeholder/80/80';
                                }}
                              />
                            </div>
                          </div>
                          <h4 className="font-bold text-center mb-2 text-lg text-yellow-800 dark:text-yellow-400">
                            {badge.name}
                          </h4>
                          <p className="text-sm text-center text-yellow-700 dark:text-yellow-500 mb-3">
                            {badge.description}
                          </p>
                          <div className="text-center space-y-1">
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">
                              Awarded by: <span className="font-semibold">{badge.assignedBy}</span>
                            </div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">
                              {formatDate(badge.assignedAt)}
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded-full font-medium border border-yellow-200 dark:border-yellow-700">
                              <Crown className="w-3 h-3 inline mr-1" />
                              Exclusive
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Custom Badges Message */}
                {(!profileData?.customBadges || profileData.customBadges.length === 0) && (
                  <div className="mt-12 text-center py-12 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Special Badges Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Keep contributing to the community and demonstrating exceptional skills to earn exclusive special badges from administrators!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "created" && (
              <div>
                {roomsLoading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                )}
                {!roomsLoading && createdRooms.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {createdRooms.map((room) => {
                        const diffStyle = getDifficultyStyle(room.difficulty);
                        return (
                          <div
                            key={room._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                          >
                            <div className="flex items-start mb-6">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4 border border-gray-200 dark:border-gray-600">
                                <span className="text-gray-600 dark:text-gray-300 text-xl">
                                  {getCategoryIcon(room.category)}
                                </span>
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                                  {room.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Created {new Date(room.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    room.isPublished
                                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                                      : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700"
                                  }`}
                                >
                                  {room.isPublished ? "Published" : "Draft"}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">
                              {room.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${diffStyle.color} ${diffStyle.darkColor} ${diffStyle.bg} ${diffStyle.darkBg} border ${diffStyle.border} ${diffStyle.darkBorder}`}
                              >
                                {room.difficulty}
                              </span>
                              <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                                {room.category}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Pagination */}
                    {(createdRooms.length > 0 || roomsCurrentPage > 1) && (
                      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Page {roomsCurrentPage}{" "}
                          {totalCreatedRooms > 0 && `• ${totalCreatedRooms} rooms total`}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleRoomsPrevPage}
                            disabled={roomsCurrentPage === 1 || roomsLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              roomsCurrentPage === 1 || roomsLoading
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            Previous
                          </button>
                          <button
                            onClick={handleRoomsNextPage}
                            disabled={!roomsHasNextPage || roomsLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              !roomsHasNextPage || roomsLoading
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : !roomsLoading && createdRooms.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {roomsCurrentPage === 1 ? "No Rooms Created Yet" : "No More Rooms"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      {roomsCurrentPage === 1
                        ? "Share your knowledge by creating cybersecurity challenges for the community!"
                        : "You've reached the end of your created rooms."}
                    </p>
                    {roomsCurrentPage === 1 && (
                      <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium inline-flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Create Your First Room
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Share Your Badge
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {/* Badge Preview */}
              <div className="mb-6 text-center">
                <Image
                  src={`/api/badge/${encodeURIComponent(profileData?.name || '')}/svg`}
                  alt="Profile Badge"
                  width={400}
                  height={200}
                  unoptimized
                  className="mx-auto border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>

              {/* Share Options */}
              <div className="space-y-4">
                {(() => {
                  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://flagforge.xyz';
                  const profileUrl = `${currentDomain}/user/${encodeURIComponent(profileData?.name || '')}`;
                  const badgeSvgUrl = `${currentDomain}/api/badge/${encodeURIComponent(profileData?.name || '')}/svg`;
                  
                  return (
                    <>
                      {/* Profile Link */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Profile Link
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(profileUrl, 'link')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedText === 'link' ? <span>Copied!</span> : <span>Copy</span>}
                          </button>
                        </div>
                      </div>

                      {/* SVG Badge URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Badge SVG URL (for GitHub README)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={badgeSvgUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(badgeSvgUrl, 'svg')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedText === 'svg' ? <span>Copied!</span> : <span>Copy</span>}
                          </button>
                        </div>
                      </div>

                      {/* Markdown for GitHub */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Markdown (GitHub)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={`[![${profileData?.name || ''}'s FlagForge Badge](${badgeSvgUrl})](${profileUrl})`}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(`[![${profileData?.name || ''}'s FlagForge Badge](${badgeSvgUrl})](${profileUrl})`, 'markdown')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedText === 'markdown' ? <span>Copied!</span> : <span>Copy</span>}
                          </button>
                        </div>
                      </div>

                      {/* HTML */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          HTML
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={`<a href="${profileUrl}"><img src="${badgeSvgUrl}" alt="${profileData?.name || ''}'s FlagForge Badge" /></a>`}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(`<a href="${profileUrl}"><img src="${badgeSvgUrl}" alt="${profileData?.name || ''}'s FlagForge Badge" /></a>`, 'html')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedText === 'html' ? <span>Copied!</span> : <span>Copy</span>}
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;