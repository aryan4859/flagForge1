'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Filter, ChevronDown, Plus, BookOpen, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import ResourceCard from '@/components/ResourceCard';
import Loading from '@/components/loading';
import AuthError from '@/components/authError';
import { Resource } from '@/models/Resource';

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
  
  // State management
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  
  // Filter and search states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch resources function
  const fetchResources = async () => {
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
      });
      
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const response = await fetch(`/api/resources?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data: ResourcesResponse = await response.json();
      
      if (data.success) {
        setResources(data.data);
        setFilteredResources(data.data);
        setHasNextPage(data.pagination.hasNext);
        setHasPrevPage(data.pagination.hasPrev);
        setTotalPages(data.pagination.totalPages);
        setTotalResources(data.pagination.totalResources);
        
        if (data.categories) {
          setCategories(data.categories);
        }
      } else {
        setError("Failed to load resources");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
      setCategoriesLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchResources();
    }
  }, [currentPage, selectedCategory, searchTerm, sessionStatus]);

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle resource click
  const handleResourceClick = (resource: Resource) => {
    window.open(resource.resourceLink, '_blank', 'noopener,noreferrer');
  };


  // Show loading if session is loading
  if (sessionStatus === 'loading') {
    return <Loading />;
  }

  // Show auth error if not authenticated
  if (sessionStatus === 'unauthenticated') {
    return <AuthError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and share valuable learning materials with the community
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={categoriesLoading}
              >
                <Filter className="w-4 h-4" />
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {totalResources > 0 
                ? `Showing ${resources.length} of ${totalResources} resources` 
                : 'No resources found'}
            </span>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Resources Grid */}
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    onView={handleResourceClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No resources found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || selectedCategory !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "Be the first to share a learning resource!"}
                </p>
                
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-sm rounded ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          } transition-colors`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;