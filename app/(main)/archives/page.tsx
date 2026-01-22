'use client';

import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  ExternalLink,
  Calendar,
  Tag,
  Trophy,
  Filter,
  Search
} from 'lucide-react';
import Loading from '@/components/loading';

interface ArchivedChallenge {
  _id: string;
  title: string;
  description: string;
  challengeLink?: string;
  challengeFile?: string;
  challengeType: 'link' | 'file';
  eventName: string;
  eventDate: string;
  category?: string;
  difficulty?: string;
  solveCount?: number;
}

const ArchivesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<ArchivedChallenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<ArchivedChallenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchTerm, selectedCategory, selectedDifficulty]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/archives?limit=100', {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        const challengeData = data.data || [];
        setChallenges(challengeData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(challengeData.map((c: ArchivedChallenge) => c.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching archived challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = challenges;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
    }

    setFilteredChallenges(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-purple-200/70 blur-3xl dark:bg-purple-900/30" />
      <div className="pointer-events-none absolute -bottom-28 left-[-10%] h-96 w-96 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-900/30" />
      
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-transparent to-white/40 opacity-70 dark:from-purple-900/20" />
          <div className="relative">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-purple-500 rounded-2xl shadow-lg">
                <Archive className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  PGS CTF 2026 Archive
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Explore challenges from past CTF competitions
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
              Browse through our collection of archived CTF challenges. These challenges were part of previous competitions and are now available for practice and learning.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Filters
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredChallenges.length} of {challenges.length} challenges
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge._id}
              className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-900/20" />
              
              <div className="relative space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {challenge.eventName}
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {challenge.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    challenge.challengeType === 'link' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  }`}>
                    {challenge.challengeType === 'link' ? '🔗 Link' : '📁 File'}
                  </span>
                  {challenge.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Tag className="w-3 h-3" />
                      {challenge.category}
                    </span>
                  )}
                  {challenge.difficulty && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      challenge.difficulty === 'Hard' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(challenge.eventDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {challenge.solveCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{challenge.solveCount} solves</span>
                    </div>
                  )}
                </div>

                <a
                  href={challenge.challengeType === 'link' ? challenge.challengeLink : challenge.challengeFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 transition w-full justify-center"
                >
                  {challenge.challengeType === 'link' ? 'View Challenge' : 'Download File'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All'
                ? 'No challenges match your filters'
                : 'No archived challenges available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesPage;
