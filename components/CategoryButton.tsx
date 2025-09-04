import React from 'react';
import { 
  Wrench, 
  Flag, 
  Shield, 
  Globe, 
  Terminal, 
  Eye, 
  Sword, 
  Lock, 
  Search,
  Folder
} from 'lucide-react';

interface CategoryButtonProps {
  category: string;
  count?: number;
  onClick: () => void;
  isSelected?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  category, 
  count, 
  onClick, 
  isSelected = false 
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Tools & Frameworks': <Wrench className="w-8 h-8" />,
      'CTF Resources & Writeups': <Flag className="w-8 h-8" />,
      'CyberSecurity Essentials': <Shield className="w-8 h-8" />,
      'Web Essentials': <Globe className="w-8 h-8" />,
      'Linux Essentials': <Terminal className="w-8 h-8" />,
      'Blue Team': <Eye className="w-8 h-8" />,
      'Red Team': <Sword className="w-8 h-8" />,
      'Cryptography': <Lock className="w-8 h-8" />,
      'Forensics': <Search className="w-8 h-8" />,
      'All': <Folder className="w-8 h-8" />
    };
    return iconMap[category] || <Folder className="w-8 h-8" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Tools & Frameworks': 'from-blue-400 to-blue-600',
      'CTF Resources & Writeups': 'from-red-400 to-red-600',
      'CyberSecurity Essentials': 'from-green-400 to-green-600',
      'Web Essentials': 'from-purple-400 to-purple-600',
      'Linux Essentials': 'from-yellow-400 to-yellow-600',
      'Blue Team': 'from-indigo-400 to-indigo-600',
      'Red Team': 'from-rose-400 to-rose-600',
      'Cryptography': 'from-cyan-400 to-cyan-600',
      'Forensics': 'from-orange-400 to-orange-600',
      'All': 'from-gray-400 to-gray-600'
    };
    return colorMap[category] || 'from-gray-400 to-gray-600';
  };

  const getHoverColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Tools & Frameworks': 'from-blue-500 to-blue-700',
      'CTF Resources & Writeups': 'from-red-500 to-red-700',
      'CyberSecurity Essentials': 'from-green-500 to-green-700',
      'Web Essentials': 'from-purple-500 to-purple-700',
      'Linux Essentials': 'from-yellow-500 to-yellow-700',
      'Blue Team': 'from-indigo-500 to-indigo-700',
      'Red Team': 'from-rose-500 to-rose-700',
      'Cryptography': 'from-cyan-500 to-cyan-700',
      'Forensics': 'from-orange-500 to-orange-700',
      'All': 'from-gray-500 to-gray-700'
    };
    return colorMap[category] || 'from-gray-500 to-gray-700';
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative group w-full h-32 sm:h-36 lg:h-40 
        bg-gradient-to-br ${getCategoryColor(category)}
        hover:bg-gradient-to-br hover:${getHoverColor(category)}
        rounded-2xl shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-105
        text-white font-medium p-4 flex flex-col justify-center items-center gap-2
        ${isSelected ? 'ring-4 ring-rose-300 ring-opacity-75' : ''}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 rounded-2xl">
        <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center">
          {getCategoryIcon(category)}
        </div>
        
        {/* Category Name */}
        <h3 className="text-sm sm:text-base font-bold leading-tight">
          {category}
        </h3>
        
        {/* Count Badge */}
        {count !== undefined && count > 0 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold min-w-[24px]">
            {count}
          </div>
        )}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-lg" />
      )}
    </button>
  );
};

export default CategoryButton;