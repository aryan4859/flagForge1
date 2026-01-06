"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, BookOpen } from "lucide-react";
import Loading from "@/components/loading";
import { Resource } from "@/models/Resource";
import ResourceCard from "@/components/ResourceCard";

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
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [resourcesByCategory, setResourcesByCategory] = useState<
    Record<string, Resource[]>
  >({});

  const fetchResources = async (term: string) => {
    if (hasLoadedOnce) {
      setIsSearching(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const params = new URLSearchParams();
      if (term.trim()) {
        params.append("search", term.trim());
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
      if (hasLoadedOnce) {
        setIsSearching(false);
      } else {
        setLoading(false);
        setHasLoadedOnce(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchResources(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

  const totalResources = useMemo(
    () =>
      Object.values(resourcesByCategory).reduce(
        (sum, list) => sum + list.length,
        0
      ),
    [resourcesByCategory]
  );

  const totalCategories = useMemo(
    () => Object.keys(resourcesByCategory).length,
    [resourcesByCategory]
  );

  if (loading && totalResources === 0) {
    return (
      <>
        <h1 className="sr-only">Learning Resources</h1>
        <h2 className="sr-only">Resources Library</h2>
        <h3 className="sr-only">
          Explore our curated collection of learning materials organized by
          category.
        </h3>
        <h4 className="sr-only">Resource Categories</h4>
        <Loading />
      </>
    );
  }

  return (
    <div className="min-h-screen transform-gpu bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-gray-950 dark:via-gray-900/30 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <div className="rounded-3xl border border-red-100/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl px-6 py-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.6)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                Resources Library
              </h2>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Learning Resources
              </h1>
              <h3 className="mt-2 text-base text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore our curated collection of learning materials organized by
                category.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <h4 className="rounded-full border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 px-4 py-2">
                {totalResources} resources
              </h4>
              <h4 className="rounded-full border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 px-4 py-2">
                {totalCategories} categories
              </h4>
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl px-4 py-3 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.45)]">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search resources, categories, or topics..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-full border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-gray-900/70 py-2.5 pl-11 pr-24 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors duration-300"
            />
            {isSearching && (
              <div className="absolute right-4 flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                Searching...
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {filteredCategories.length > 0 ? (
          <div className="space-y-6">
            {filteredCategories.map((category) => {
              const categoryResources = resourcesByCategory[category].filter(
                (resource) => {
                  if (!searchTerm) return true;
                  return (
                    resource.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    resource.description
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                }
              );
              if (categoryResources.length === 0) return null;
              const isExpanded = expandedCategories.has(category);
              return (
                <div
                  key={category}
                  className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl shadow-[0_18px_45px_-35px_rgba(15,23,42,0.6)] overflow-hidden"
                >
                  <div className="kg-toggle-heading">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <h4 className="kg-toggle-heading-text text-xl font-semibold text-gray-900 dark:text-white">
                          {category}
                        </h4>
                        <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-xs font-semibold">
                          {categoryResources.length}
                        </span>
                      </div>
                      <div className="kg-toggle-card-icon">
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-200/70 dark:border-white/10">
                      <div className="p-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryResources.map((resource) => (
                          <ResourceCard
                            key={resource._id}
                            resource={resource}
                            onView={handleResourceClick}
                          />
                        ))}
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
              {searchTerm ? "No matching resources" : "No resources available"}
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
      </div>
    </div>
  );
};

export default ResourcesPage;
