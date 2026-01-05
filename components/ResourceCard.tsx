import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { Resource } from '@/models/Resource';

interface ResourceCardProps {
  resource: Resource;
  onView?: (resource: Resource) => void;
}

// Constants for category colors to reduce duplication
const CATEGORY_COLORS: { [key: string]: string } = {
  'Tools & Frameworks': 'bg-blue-100 text-blue-800 border-blue-200',
  'CTF Resources & Writeups': 'bg-red-100 text-red-800 border-red-200',
  'CyberSecurity Essentials': 'bg-green-100 text-green-800 border-green-200',
  'Web Essentials': 'bg-purple-100 text-purple-800 border-purple-200',
  'Linux Essentials': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Blue Team': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Red Team': 'bg-rose-100 text-rose-800 border-rose-200',
  'Cryptography': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Forensics': 'bg-orange-100 text-orange-800 border-orange-200',
  'All': 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

const DEFAULT_CATEGORY_COLOR = 'bg-gray-100 text-gray-800 border-gray-200';

// Utility functions
const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || DEFAULT_CATEGORY_COLOR;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Sub-components for better organization
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => (
  <div className="mb-3">
    <span 
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getCategoryColor(category)} dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700`}
      aria-label={`Category: ${category}`}
    >
      {category}
    </span>
  </div>
);

const ResourceDescription: React.FC<{ description: string }> = ({ description }) => (
  <div className="flex-1 mb-4">
    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
      {description}
    </p>
  </div>
);

const ResourceFooter: React.FC<{ createdAt?: string; uploadedBy?: string }> = ({ 
  createdAt, 
  uploadedBy 
}) => (
  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1" title={`Created on ${formatDate(createdAt)}`}>
        <Calendar className="w-3 h-3" aria-hidden="true" />
        <span>{formatDate(createdAt)}</span>
      </div>
      {uploadedBy && (
        <div className="flex items-center gap-1" title={`Uploaded by ${uploadedBy}`}>
          <User className="w-3 h-3" aria-hidden="true" />
          <span>{uploadedBy}</span>
        </div>
      )}
    </div>
  </div>
);

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onView }) => {
  const handleAction = () => {
    if (onView) {
      onView(resource);
    } else {
      window.open(resource.resourceLink, '_blank', 'noopener,noreferrer,nofollow');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle Enter and Space key presses for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAction();
    }
  };

  // Determine appropriate aria-label based on action
  const ariaLabel = onView 
    ? `View details for ${resource.title}` 
    : `Open ${resource.title} in new tab`;

  const baseCardClasses = [
    "relative flex h-full flex-col rounded-3xl border border-gray-200/80 bg-white/80 p-6",
    "shadow-[0_18px_45px_-35px_rgba(15,23,42,0.6)] backdrop-blur-xl",
    "hover:-translate-y-1 hover:border-rose-200/80 hover:bg-white hover:shadow-[0_24px_55px_-35px_rgba(15,23,42,0.6)]",
    "focus:border-rose-300 focus:shadow-[0_24px_55px_-35px_rgba(15,23,42,0.6)]",
    "focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2",
    "transition-all duration-300 cursor-pointer group overflow-hidden",
    "dark:border-gray-700/80 dark:bg-gray-900/70 dark:hover:border-rose-400/50"
  ].join(" ");

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      className={baseCardClasses}
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-rose-600 group-focus:text-rose-600 transition-colors duration-300 line-clamp-2">
            {resource.title}
          </h3>
        </div>
        <ExternalLink 
          className="w-5 h-5 text-gray-400 group-hover:text-rose-500 group-focus:text-rose-500 transition-colors duration-300 flex-shrink-0" 
          aria-hidden="true"
        />
      </div>

      <CategoryBadge category={resource.category} />
      <ResourceDescription description={resource.description} />
      <ResourceFooter 
        createdAt={resource.createdAt as any} 
      />
    </div>
  );
};

export default ResourceCard;
