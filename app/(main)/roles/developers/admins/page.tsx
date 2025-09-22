'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Upload, 
  Award, 
  LayoutTemplate, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  ChevronRight,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Loading from '@/components/loading';

// Type definitions for dashboard stats
interface DashboardStats {
  totalChallenges: number;
  activeChallenges: number;
  totalBadgeTemplates: number;
  activeBadgeTemplates: number;
  totalUsers: number;
  recentActivity: number;
  newUsersThisWeek: number;
  topCategories: Array<{ _id: string; count: number }>;
  lastUpdated: string;
}

// Admin card component
interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  onClick: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  path, 
  onClick 
}) => (
  <div 
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${color}`}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          {icon}
        </div>
        <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      <div className="mt-4 text-xs text-white/60 font-medium">
        Navigate to {path}
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

// Stats card component
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trend && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalChallenges: 0,
    activeChallenges: 0,
    totalBadgeTemplates: 0,
    activeBadgeTemplates: 0,
    totalUsers: 0,
    recentActivity: 0,
    newUsersThisWeek: 0,
    topCategories: [],
    lastUpdated: ''
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  // Authentication and admin check
  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      if (status === 'loading') return;
      
      if (!session?.user) {
        router.push('/roles/developers/admins/auth');
        return;
      }

      try {
        setAdminCheckLoading(true);
        console.log('Checking admin status for dashboard:', session.user.email);
        
        const response = await fetch('/api/auth/check-admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        const data = await response.json();
        console.log('Admin check response in dashboard:', response.status, data);
        
        if (response.ok && data.isAdmin) {
          console.log('Admin access verified for dashboard');
          setIsAuthenticated(true);
        } else {
          console.log('Admin access denied for dashboard:', data.message);
          router.push('/roles/developers/admins/auth');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status in dashboard:', error);
        router.push('/roles/developers/admins/auth');
        return;
      } finally {
        setAdminCheckLoading(false);
        setLoading(false);
      }
    };

    checkAuthAndAdmin();
  }, [session, status, router]);

  // Fetch dashboard stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await fetch('/api/admin/dashboard-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard stats received:', data);

      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        console.error('Invalid stats response:', data);
        // Keep current stats if API fails
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep current stats if API fails - no need to show error to user
    }
  };

  const handleLogout = async (): Promise<void> => {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
    router.push('/roles/developers/admins/auth');
  };

  const adminCards = [
    {
      title: "Upload Challenge",
      description: "Create and upload new CTF challenges with hints, time limits, and resource links.",
      icon: <Upload className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-br from-rose-500 to-pink-600",
      path: "/uploads",
      onClick: () => router.push('/roles/developers/admins/uploads')
    },
    {
      title: "Assign Badges",
      description: "Assign achievement badges to users based on their performance and accomplishments.",
      icon: <Award className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      path: "/badges",
      onClick: () => router.push('/roles/developers/admins/badges')
    },
    {
      title: "Badge Templates",
      description: "Create and manage badge templates for different types of achievements and recognitions.",
      icon: <LayoutTemplate className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      path: "/badge-templates",
      onClick: () => router.push('/roles/developers/admins/badge-templates')
    },
    {
      title: "Resources",
      description: "Add resources for user to learn more about cybersecurity.",
      icon: <LayoutTemplate className="w-6 h-6 text-white" />,
      color: "bg-gradient-to-br from-emraid-500 to-emraid-600",
      path: "/resources/upload",
      onClick: () => router.push('/resources/upload')
    }
  ];

  // Show loading while checking session or admin status
  if (status === 'loading' || loading || adminCheckLoading) {
    return <Loading />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated || !session?.user) {
    return null;
  }

  const userName = session.user.name || session.user.email?.split('@')[0] || 'Admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome back, {userName}
                </p>
                {stats.lastUpdated && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Manage CTF challenges, assign badges, and oversee platform activities from your central control panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/problems')}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>View Challenges</span>
            </button>
            <button
              onClick={fetchDashboardStats}
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Challenges"
            value={stats.totalChallenges}
            icon={<Upload className="w-6 h-6 text-white" />}
            color="bg-rose-500"
          />
          <StatsCard
            title="Active Challenges"
            value={stats.activeChallenges}
            icon={<Activity className="w-6 h-6 text-white" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Badge Templates"
            value={`${stats.activeBadgeTemplates}/${stats.totalBadgeTemplates}`}
            icon={<LayoutTemplate className="w-6 h-6 text-white" />}
            color="bg-purple-500"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-blue-500"
            trend={stats.newUsersThisWeek > 0 ? `+${stats.newUsersThisWeek} this week` : undefined}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Admin Actions */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Admin Actions
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                {adminCards.map((card, index) => (
                  <AdminCard
                    key={index}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    color={card.color}
                    path={card.path}
                    onClick={card.onClick}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  System Status
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Platform Health
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    Excellent
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Sessions
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {stats.recentActivity}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Badge Assignments
                  </span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {stats.activeBadgeTemplates} Active
                  </span>
                </div>
              </div>
            </div>

            {/* Category Insights */}
            {stats.topCategories.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Top Categories
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {stats.topCategories.slice(0, 3).map((category, index) => (
                    <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category._id}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {category.count}
                        </span>
                        <span className="text-xs text-gray-500">challenges</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Quick Actions
                </h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/roles/developers/admins/uploads')}
                  className="w-full text-left p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Challenge
                    </span>
                    <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/roles/developers/admins/badges')}
                  className="w-full text-left p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assign Badge
                    </span>
                    <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/roles/developers/admins/badge-templates')}
                  className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Manage Templates
                    </span>
                    <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  Admin Tips
                </h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>• Regularly review and update challenge difficulty</p>
                <p>• Monitor badge assignment frequency</p>
                <p>• Keep badge templates organized by category</p>
                <p>• Set appropriate time limits for challenges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;