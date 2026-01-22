'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Trophy, 
  Archive,
  Users,
  Award,
  Shield,
  FileText,
  Upload,
  Home
} from 'lucide-react';

const AdminNavigation: React.FC = () => {
  const pathname = usePathname();

  const adminLinks = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Stats'
    },
    {
      href: '/admin/event-scoreboards',
      label: 'Event Scoreboards',
      icon: Trophy,
      description: 'Manage CTF Events'
    },
    {
      href: '/admin/archives',
      label: 'Challenge Archives',
      icon: Archive,
      description: 'Archived Challenges'
    },
    {
      href: '/admin/users',
      label: 'User Management',
      icon: Users,
      description: 'Manage Users'
    },
    {
      href: '/admin/badges',
      label: 'Badge Management',
      icon: Award,
      description: 'Create & Assign Badges'
    },
    {
      href: '/resources/upload',
      label: 'File Upload',
      icon: Upload,
      description: 'Upload Resources'
    }
  ];

  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Admin Navigation
        </h3>
      </div>
      
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-all duration-200 ${
                isActive
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <link.icon className={`h-5 w-5 ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
              <div>
                <div className="text-xs font-semibold">{link.label}</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-500">{link.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;