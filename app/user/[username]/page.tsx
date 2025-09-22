'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/components/loading';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle,
  User,
  Calendar,
  Crown,
  Share2,
  Copy,
  ExternalLink,
  Gift
} from 'lucide-react';
import Flagforge from '../../../public/flagforge.gif';
import Newbie from '../../../public/badges/0x1.png';
import Scout from '../../../public/badges/0x2.png';
import Codebreaker from '../../../public/badges/0x3.png';
import Hacker from '../../../public/badges/0x4.png';
import Cipher from '../../../public/badges/0x5.png';
import Forger from '../../../public/badges/0x6.png';
import Conqueror from '../../../public/badges/0x7.png';

interface PublicProfileData {
  name: string;
  email: string;
  image: string;
  totalScore: number;
  rank: number;
  level: string;
  completedQuestions: number;
  badges: number;
  customBadges: any[];
  createdAt: string;
  memberSince: number;
  completedProblems?: any[];
}

// Badge configuration matching the private profile
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

const PublicUserPage = () => {
  const params = useParams();
  const username = params.username as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCustomBadgeTooltip, setShowCustomBadgeTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/user/${encodeURIComponent(username)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found');
          } else {
            setError('Failed to load user profile');
          }
          return;
        }
        const data = await res.json();
        setProfileData(data.user);
      } catch (error) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getBadgeComponent = (score: number, size: number = 48) => {
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
  };

  const getCurrentBadgeName = (score: number) => {
    const badge = BADGE_CONFIG.slice()
      .reverse()
      .find((badge) => score >= badge.threshold);
    return badge ? badge.name : "Newbie";
  };

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

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {error}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://flagforge.xyz';
  const profileUrl = `${currentDomain}/user/${encodeURIComponent(username)}`;
  const badgeSvgUrl = `${currentDomain}/api/badge/${encodeURIComponent(username)}/svg`;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-shrink-0">
                <Image
                  src={profileData.image || Flagforge}
                  alt={`${profileData.name} Profile Picture`}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover ring-4 ring-red-500 shadow-xl"
                  unoptimized
                  priority
                />
              </div>
              
              <div className="flex-grow text-center lg:text-left">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
                      {profileData.name}
                    </h1>
                    <p className="text-xl text-red-600 dark:text-red-500 mb-4 font-medium">
                      {profileData.level}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Member since {profileData.memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                      {getBadgeComponent(profileData.totalScore, 80)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
                  {[
                    {
                      icon: Trophy,
                      label: "Rank",
                      value: `#${profileData.rank}`,
                      color: "text-red-500",
                    },
                    {
                      icon: Award,
                      label: "System Badges",
                      value: profileData.badges,
                      color: "text-red-500",
                    },
                    {
                      icon: Crown,
                      label: "Special Badges",
                      value: profileData.customBadges?.length || 0,
                      color: "text-yellow-500",
                    },
                    {
                      icon: CheckCircle,
                      label: "Completed",
                      value: profileData.completedQuestions,
                      color: "text-red-500",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 text-center transition-all hover:bg-white dark:hover:bg-gray-800 hover:scale-105 shadow-lg"
                    >
                      <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color} mx-auto mb-2 lg:mb-3`} />
                      <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-lg lg:text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="p-6 pb-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview", icon: User },
                    { id: "badges", label: "Badge Collection", icon: Award },
                    { id: "completed", label: "Completed Problems", icon: CheckCircle },
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
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {profileData.name}'s Profile
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Current Level: {getCurrentBadgeName(profileData.totalScore)} with {profileData.totalScore.toLocaleString()} points
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-2xl font-bold text-red-500">{profileData.completedQuestions}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-2xl font-bold text-yellow-500">#{profileData.rank}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Global Rank</p>
                      </div>
                    </div>
                  </div>
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
                        Badges earned through accumulated points from completed cybersecurity challenges.
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
                          Exclusive badges awarded for exceptional contributions and achievements.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {profileData.customBadges.map((badge, index) => (
                          <div
                            key={index}
                            className="relative p-6 rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-yellow-200 dark:ring-yellow-600"
                            onMouseEnter={() => setShowCustomBadgeTooltip(badge.name)}
                            onMouseLeave={() => setShowCustomBadgeTooltip(null)}
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
                        This user hasn't received any special badges from administrators yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "completed" && (
                <div>
                  {profileData.completedProblems && profileData.completedProblems.length > 0 ? (
                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {profileData.completedProblems.map((problem, index) => {
                        const diffStyle = getDifficultyStyle(problem.difficulty || 'Easy');
                        return (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 leading-tight">
                                {problem.title}
                              </h3>
                              <span className="font-bold text-white bg-red-500 px-3 py-1 rounded-full text-sm ml-3 flex-shrink-0">
                                +{problem.points || 0}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {problem.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${diffStyle.color} ${diffStyle.darkColor} ${diffStyle.bg} ${diffStyle.darkBg} border ${diffStyle.border} ${diffStyle.darkBorder}`}
                              >
                                {problem.difficulty || 'Easy'}
                              </span>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full border border-green-200 dark:border-green-700">
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                  Completed
                                </span>
                                <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600">
                                  {getCategoryIcon(problem.category)} {problem.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : profileData.completedQuestions > 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {profileData.completedQuestions} Problems Completed!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                        This user has successfully completed {profileData.completedQuestions} cybersecurity challenges.
                      </p>
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg inline-block font-semibold">
                        🏆 {profileData.totalScore.toLocaleString()} Total Points Earned
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Problems Completed Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        This user hasn't completed any challenges yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicUserPage;