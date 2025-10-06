"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  ChevronDown,
  BookOpen,
  ExternalLink,
  Video,
  FileText,
  Code,
  Globe,
} from "lucide-react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { Resource } from "@/models/Resource";

interface ResourcesResponse {
  success: boolean;
  data: Resource[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResources: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  categories: string[];
}

const ResourcesPage: React.FC = () => {
  const { status: sessionStatus } = useSession();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [resourcesByCategory, setResourcesByCategory] = useState<
    Record<string, Resource[]>
  >({});

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }
      const data: ResourcesResponse = await response.json();
      if (data.success) {
        const grouped = data.data.reduce(
          (acc: Record<string, Resource[]>, resource) => {
            const category = resource.category || "Uncategorized";
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(resource);
            return acc;
          },
          {}
        );
        setResourcesByCategory(grouped);
      } else {
        setError("Failed to load resources");
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchResources();
    }
  }, [searchTerm, sessionStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleResourceClick = (resource: Resource) => {
    window.open(
      resource.resourceLink,
      "_blank",
      "noopener,noreferrer,nofollow"
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return Video;
      case "article":
        return FileText;
      case "code":
        return Code;
      case "website":
        return Globe;
      default:
        return BookOpen;
    }
  };

  const filteredCategories = Object.keys(resourcesByCategory).filter(
    (category) => {
      if (!searchTerm) return true;
      const categoryResources = resourcesByCategory[category];
      return categoryResources.some(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  if (sessionStatus === "loading") {
    return <Loading />;
  }
  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Explore our curated collection of learning materials organized by
            category
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources, categories, or topics..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {filteredCategories.length > 0 ? (
              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const categoryResources = resourcesByCategory[
                    category
                  ].filter((resource) => {
                    if (!searchTerm) return true;
                    return (
                      resource.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      resource.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    );
                  });
                  if (categoryResources.length === 0) return null;
                  const isExpanded = expandedCategories.has(category);
                  return (
                    <div
                      key={category}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="kg-toggle-heading">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <h4 className="kg-toggle-heading-text text-xl font-semibold text-gray-900 dark:text-white">
                              {category}
                            </h4>
                            <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-2 py-1 rounded-full text-sm font-medium">
                              {categoryResources.length}
                            </span>
                          </div>
                          <div className="kg-toggle-card-icon">
                            <ChevronDown
                              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <div className="p-6 space-y-4">
                            {categoryResources.map((resource) => {
                              const IconComponent = getResourceIcon(
                                resource.category
                              );
                              return (
                                <div
                                  key={resource._id}
                                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer"
                                  onClick={() => handleResourceClick(resource)}
                                >
                                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                          {resource.title}
                                        </h5>
                                        {resource.description && (
                                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                            {resource.description}
                                          </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                          {resource.category && (
                                            <span className="capitalize">
                                              {resource.category}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm
                    ? "No matching resources"
                    : "No resources available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "Resources will appear here once they're added to the system."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
