"use client";
import React from "react";
import Image from "next/image";

interface AdvertisementCardProps {
  imagePath: string;
  title?: string;
  description?: string;
  link?: string;
  className?: string;
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({
  imagePath,
  title = "Sponsored Ad",
  description = "Learn more about this opportunity from our partners.",
  link = "https://presidential.edu.np/course/bachelor-of-science-in-cybersecurity",
  className = "",
}) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`group relative block bg-white/70 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="relative h-80 w-full">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/50 backdrop-blur-md border border-white/20 text-[10px] text-white font-medium uppercase tracking-wider">
          Sponsored
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  );
};

export default AdvertisementCard;
