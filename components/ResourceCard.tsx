import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { Resource } from '@/models/Resource';

interface ResourceCardProps {
  resource: Resource;
  onView?: (resource: Resource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onView }) => {
  const handleClick = () => {
    if (onView) {
      onView(resource);
    } else {
      window.open(resource.resourceLink, '_blank', 'noopener,noreferrer,nofollow');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
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
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={handleClick}
      className="relative bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:border-rose-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-rose-50/20 hover:to-rose-100/10 transition-all duration-300 cursor-pointer group p-6 h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-800 group-hover:text-rose-600 transition-colors duration-300 line-clamp-2">
            {resource.title}
          </h3>
        </div>
        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors duration-300 ml-2 flex-shrink-0" />
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {resource.description}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(resource.createdAt as any)}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* <User className="w-3 h-3" />
            <span>Flagforge</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;