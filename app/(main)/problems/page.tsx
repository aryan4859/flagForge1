"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import QustionCards from "@/components/QustionCards";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";
import { IoFilter, IoChevronDown } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { Questions } from "@/interfaces";

// Extended interface to include expiry information
interface QuestionWithExpiry extends Questions {
  expired?: boolean;
  timeRemaining?: number;
  expiryDate?: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  link: string;
  done: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  flag?: string;
  expired?: boolean;
  timeRemaining?: number;
  expiryDate?: string;
}

interface PaginationData {
  hasNext: boolean;
  totalPages: number;
  total: number;
}

interface ApiResponse {
  data: Problem[];
  totalScore: number;
  questionDone: any;
  pagination: PaginationData;
}

// Constants
const DEFAULT_CATEGORIES = [
  "All",
  "Web Exploitation",
  "Cryptography", 
  "Reverse Engineering",
  "Forensics",
  "General Skills",
  "Binary Exploitation",
  "IOT"
];

const UPDATE_INTERVAL = 60000; // 1 minute
const DESCRIPTION_TRUNCATE_LENGTH = 95;

// Utility functions
const formatTimeRemaining = (timeMs: number): string => {
  if (timeMs <= 0) return "Expired";
  
  const days = Math.floor(timeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h left`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  } else {
    return `${minutes}m left`;
  }
};

const sanitizeProblems = (data: Problem[]): Problem[] => 
  data.map(({ flag, ...rest }) => rest);

// Custom hooks
const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch categories');
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, fetchCategories };
};

const useProblems = (currentPage: number, selectedCategory: string, categoriesLoading: boolean) => {
  const [problems, setProblems] = useState<QuestionWithExpiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionDone, setQuestionDone] = useState<any>();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProblems = useCallback(async () => {
    setLoading(true);

    try {
      let apiUrl = `/api/problems?page=${currentPage}`;
      if (selectedCategory && selectedCategory !== "All") {
        apiUrl += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to fetch problems");
      }

      const { data, totalScore, questionDone, pagination }: ApiResponse = await response.json();

      const sanitizedData = sanitizeProblems(data);
      setScore(totalScore);
      setProblems(sanitizedData);
      setQuestionDone(questionDone);
      setHasNextPage(pagination.hasNext);
      setTotalPages(pagination.totalPages);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Unable to fetch problems. Please try again later.");
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (!categoriesLoading) {
      fetchProblems();
    }
  }, [fetchProblems, categoriesLoading]);

  return {
    problems,
    setProblems,
    loading,
    score,
    questionDone,
    hasNextPage,
    totalPages,
    fetchProblems
  };
};

// Sub-components
const StatsSection: React.FC<{ 
  score: number; 
  questionDone: any; 
  showFilterDropdown: boolean;
  onToggleFilter: () => void;
}> = ({ score, questionDone, showFilterDropdown, onToggleFilter }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex justify-between items-center w-full">
      <h2 className="text-center text-xl sm:text-xl font-medium text-gray-600 dark:text-white transition-colors duration-300">
        Score: &nbsp;
        <span className="text-red-400 dark:text-red-500 font-extrabold transition-colors duration-300">
          {score}
        </span>
      </h2>
      
      <p className="text-center text-xl sm:text-xl font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Total Question Solved:&nbsp;
        <span className="text-red-400 dark:text-red-500 font-extrabold transition-colors duration-300">
          {questionDone?.length || 0}
        </span>
      </p>
    </div>

    {/* Mobile Filter Button */}
    <div className="flex gap-2 items-center justify-center text-center text-xl sm:hidden font-medium text-gray-600">
      <button 
        onClick={onToggleFilter}
        className="flex items-center gap-1"
        aria-label="Toggle filter dropdown"
      >
        <IoFilter className="text-2xl" />
      </button>
    </div>
  </div>
);

const DesktopFilter: React.FC<{
  categories: string[];
  categoriesLoading: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, categoriesLoading, selectedCategory, onCategoryChange }) => (
  <div className="hidden sm:flex items-center gap-4 justify-end mb-4">
    <div className="flex items-center gap-2">
      <IoFilter className="text-xl text-gray-600 dark:text-gray-300" />
      <span className="text-gray-600 dark:text-gray-300 font-medium">Filter by Category:</span>
    </div>
    
    <div className="relative">
      {categoriesLoading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-500">
          Loading categories...
        </div>
      ) : (
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-300"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}
      <IoChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
    
    {selectedCategory !== "All" && (
      <button
        onClick={() => onCategoryChange("All")}
        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors duration-300"
      >
        Clear Filter
      </button>
    )}
  </div>
);

const MobileFilter: React.FC<{
  show: boolean;
  categories: string[];
  categoriesLoading: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ show, categories, categoriesLoading, selectedCategory, onCategoryChange }) => {
  if (!show) return null;

  return (
    <div className="sm:hidden mb-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Category</h3>
        {categoriesLoading ? (
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${
                  selectedCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterResultsInfo: React.FC<{
  selectedCategory: string;
  problemsCount: number;
  currentPage: number;
  totalPages: number;
}> = ({ selectedCategory, problemsCount, currentPage, totalPages }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {selectedCategory !== "All" ? (
        <span>Showing {problemsCount} challenges in "{selectedCategory}" (Page {currentPage} of {totalPages})</span>
      ) : (
        <span>Showing all challenges (Page {currentPage} of {totalPages})</span>
      )}
    </div>
  </div>
);

const ExpiryOverlay: React.FC<{ 
  expiryDate?: string; 
  expired?: boolean; 
  timeRemaining?: number;
}> = ({ expiryDate, expired, timeRemaining }) => {
  if (!expiryDate) return null;

  return (
    <>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
        expired 
          ? 'bg-red-500 text-white' 
          : 'bg-yellow-500 text-black'
      }`}>
        {expired 
          ? 'EXPIRED' 
          : timeRemaining ? formatTimeRemaining(timeRemaining) : 'Limited Time'
        }
      </div>
      
      {expired && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-lg">
          {/* Expired overlay without text to avoid duplication */}
        </div>
      )}
    </>
  );
};

const NoProblemsMessage: React.FC<{ 
  selectedCategory: string; 
  onShowAll: () => void;
}> = ({ selectedCategory, onShowAll }) => (
  <div className="col-span-full text-center py-12">
    <div className="text-gray-500 dark:text-gray-400">
      <IoFilter className="mx-auto text-4xl mb-4 opacity-50" />
      <p className="text-lg font-medium">No challenges found</p>
      <p className="text-sm">
        {selectedCategory !== "All" 
          ? `No challenges available in "${selectedCategory}" category`
          : "No challenges available at the moment"
        }
      </p>
      {selectedCategory !== "All" && (
        <button
          onClick={onShowAll}
          className="mt-4 text-red-500 hover:text-red-600 underline"
        >
          View all challenges
        </button>
      )}
    </div>
  </div>
);

const PaginationControls: React.FC<{
  currentPage: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ currentPage, hasNextPage, onPrevious, onNext }) => (
  <div className="flex justify-end gap-4 w-full">
    <button
      onClick={onPrevious}
      disabled={currentPage === 1}
      className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors duration-300 ${
        currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-400 hover:bg-red-800"
      }`}
    >
      Previous
    </button>
    <button
      onClick={onNext}
      disabled={!hasNextPage}
      className={`font-medium text-base rounded-lg px-4 py-2 text-white transition-colors duration-300 ${
        !hasNextPage
          ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
          : "bg-red-400 dark:bg-red-500 hover:bg-red-800 dark:hover:bg-red-600"
      }`}
    >
      Next
    </button>
  </div>
);

const Page: React.FC = () => {
  const { status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { categories, loading: categoriesLoading } = useCategories();
  const { 
    problems, 
    setProblems, 
    loading: problemsLoading, 
    score, 
    questionDone, 
    hasNextPage, 
    totalPages 
  } = useProblems(currentPage, selectedCategory, categoriesLoading);

  // Handle category filter change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  }, []);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [hasNextPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  // Update time remaining for expiring challenges
  useEffect(() => {
    const interval = setInterval(() => {
      setProblems(prevProblems => 
        prevProblems.map(problem => {
          if (problem.expiryDate && !problem.expired) {
            const now = new Date();
            const expiryDate = new Date(problem.expiryDate);
            const timeRemaining = Math.max(0, expiryDate.getTime() - now.getTime());
            return {
              ...problem,
              expired: timeRemaining <= 0,
              timeRemaining
            };
          }
          return problem;
        })
      );
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [setProblems]);

  // Loading states
  if (problemsLoading && categoriesLoading) {
    return <Loading />;
  }

  if (sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  const shouldShowPagination = problems.length > 0 || currentPage > 1;

  return (
    <div className="flex flex-col justify-center items-center gap-8 mx-8">
      <h1 className="text-4xl sm:text-5xl tracking-tight text-center text-red-500 font-bold">
        Challenges
      </h1>
      
      <StatsSection 
        score={score}
        questionDone={questionDone}
        showFilterDropdown={showFilterDropdown}
        onToggleFilter={() => setShowFilterDropdown(!showFilterDropdown)}
      />

      {/* Filter Section */}
      <div className="w-full">
        <DesktopFilter
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <MobileFilter
          show={showFilterDropdown}
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <FilterResultsInfo
          selectedCategory={selectedCategory}
          problemsCount={problems.length}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      {/* Problems Grid */}
      <div className="mx-auto my-0 flex justify-between">
        <div className="mx-auto my-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 sm:grid-cols-2 items-center gap-4">
          {problems.length > 0 ? (
            problems.map(({
              title,
              category,
              points,
              description,
              _id,
              done,
              expired,
              timeRemaining,
              expiryDate,
            }: QuestionWithExpiry) => (
              <div key={_id} className="relative">
                <QustionCards
                  title={title}
                  category={category}
                  points={points}
                  description={description.substring(0, DESCRIPTION_TRUNCATE_LENGTH)}
                  done={questionDone}
                  _id={_id}
                />
                
                <ExpiryOverlay
                  expiryDate={expiryDate}
                  expired={expired}
                  timeRemaining={timeRemaining}
                />
              </div>
            ))
          ) : (
            <NoProblemsMessage
              selectedCategory={selectedCategory}
              onShowAll={() => handleCategoryChange("All")}
            />
          )}
        </div>
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <PaginationControls
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          onPrevious={handlePrevPage}
          onNext={handleNextPage}
        />
      )}
    </div>
  );
};

export default Page;