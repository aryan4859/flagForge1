"use client";
import React, { useState, useEffect } from "react";
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

const page = () => {
  const { status: sessionStatus, data } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [problems, setProblems] = useState<QuestionWithExpiry[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<QuestionWithExpiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [questionDone, setQuestionDone] = useState<any>();
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  
  // Dynamic categories state
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  type Problem = {
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
  };

  // Helper function to format time remaining
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

  // Fetch categories from API
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch categories');
        setCategories([
          "All",
          "Web Exploitation",
          "Cryptography", 
          "Reverse Engineering",
          "Forensics",
          "General Skills",
          "Binary Exploitation",
          "IOT"
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        "All",
        "Web Exploitation",
        "Cryptography", 
        "Reverse Engineering",
        "Forensics",
        "General Skills",
        "Binary Exploitation",
        "IOT"
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Filter problems based on selected category
  const filterProblems = (problemsList: QuestionWithExpiry[], category: string) => {
    if (category === "All") {
      return problemsList;
    }
    return problemsList.filter(problem => problem.category === category);
  };

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
    setShowFilterDropdown(false);
    
    // Apply filter to current problems
    const filtered = filterProblems(problems, category);
    setFilteredProblems(filtered);
  };

  const fetchProblems = async () => {
    setLoading(true); 

    try {
      const response = await fetch(`/api/problems?page=${currentPage}`);

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to fetch problems");
      }

      const {
        data,
        totalScore,
        questionDone,
        pagination,
      }: {
        data: Problem[];
        totalScore: number;
        questionDone: any;
        pagination: {
          hasNext: boolean;
          totalPages: number;
        };
      } = await response.json();

      const sanitizedData = data.map(({ flag, ...rest }) => rest);
      setScore(totalScore);
      setProblems(sanitizedData);
      setQuestionDone(questionDone);
      setHasNextPage(pagination.hasNext);
      
      // Apply current filter to new data
      const filtered = filterProblems(sanitizedData, selectedCategory);
      setFilteredProblems(filtered);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Unable to fetch problems. Please try again later.");
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [currentPage]);

  // Apply filter when problems or selected category changes
  useEffect(() => {
    const filtered = filterProblems(problems, selectedCategory);
    setFilteredProblems(filtered);
  }, [problems, selectedCategory]);

  // Update time remaining every minute for active challenges
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
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading && categoriesLoading) {
    return <Loading />;
  }
  if (sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  const handleMenuClick: () => void = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8 mx-8">
      <h1 className="text-4xl sm:text-5xl tracking-tight text-center text-red-500 font-bold">
        Challenges
      </h1>
      
      {/* Stats and Filter Section */}
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
              {questionDone?.length}
            </span>
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex gap-2 items-center justify-center text-center text-xl sm:hidden font-medium text-gray-600">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-1"
          >
            <IoFilter className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="w-full">
        {/* Desktop Filter */}
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
                onChange={(e) => handleCategoryChange(e.target.value)}
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
              onClick={() => handleCategoryChange("All")}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors duration-300"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Mobile Filter Dropdown */}
        {showFilterDropdown && (
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
                      onClick={() => handleCategoryChange(category)}
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
        )}

        {/* Filter Results Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCategory !== "All" && (
              <span>Showing {filteredProblems.length} challenges in "{selectedCategory}"</span>
            )}
            {selectedCategory === "All" && (
              <span>Showing all {filteredProblems.length} challenges</span>
            )}
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="mx-auto my-0 flex justify-between">
        <div className="mx-auto my-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 sm:grid-cols-2 items-center gap-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(
              ({
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
                    key={title}
                    title={title}
                    category={category}
                    points={points}
                    description={description.substring(0, 95)}
                    done={questionDone}
                    _id={_id}
                  />
                  
                  {/* Expiry Status Overlay */}
                  {expiryDate && (
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
                  )}
                  
                  {/* Expired Overlay */}
                  {expired && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                      {/* <span className="text-white font-bold text-lg">EXPIRED</span> */}
                    </div>
                  )}
                </div>
              )
            )
          ) : (
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
                    onClick={() => handleCategoryChange("All")}
                    className="mt-4 text-red-500 hover:text-red-600 underline"
                  >
                    View all challenges
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show pagination only if there are problems or if not on first page */}
      {(problems.length > 0 || currentPage > 1) && (
        <div className="flex justify-end gap-4 w-full">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`font-medium text-base rounded-lg px-4 py-2 text-white ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-red-800"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
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
      )}
    </div>
  );
};

export default page;