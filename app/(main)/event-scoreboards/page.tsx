'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ExternalLink,
  Calendar,
  Users,
  Medal,
  Search,
  Filter,
  ChevronDown,
  Star
} from 'lucide-react';
import Loading from '@/components/loading';
import Image from 'next/image';
import Link from 'next/link';

interface EventWinner {
  rank: number;
  teamName: string;
  totalScore: number;
  solvedChallenges: number;
}

interface EventScoreboard {
  _id: string;
  title: string;
  description: string;
  eventName: string;
  eventDate: string;
  scoreboardUrl: string;
  eventImage?: string;
  winners: EventWinner[];
  totalTeams: number;
  totalPlayers: number;
  isActive: boolean;
}

const EventScoreboardsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scoreboards, setScoreboards] = useState<EventScoreboard[]>([]);
  const [filteredScoreboards, setFilteredScoreboards] = useState<EventScoreboard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    fetchScoreboards();
  }, []);

  useEffect(() => {
    filterScoreboards();
  }, [scoreboards, searchTerm]);

  const fetchScoreboards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/event-scoreboards?limit=50', {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        const scoreboardData = data.data || [];
        setScoreboards(scoreboardData);
      } else {
        console.error('Failed to fetch scoreboards:', response.status);
        setScoreboards([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching event scoreboards:', error);
      setScoreboards([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterScoreboards = () => {
    let filtered = scoreboards;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredScoreboards(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const toggleExpanded = (scoreboardId: string) => {
    setExpandedCard(expandedCard === scoreboardId ? null : scoreboardId);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-purple-200/70 blur-3xl dark:bg-purple-900/30" />
      <div className="pointer-events-none absolute -bottom-28 left-[-10%] h-96 w-96 rounded-full bg-blue-200/60 blur-3xl dark:bg-blue-900/30" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Event Scoreboards
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore past CTF events, winners, and team performances
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredScoreboards.length} event{filteredScoreboards.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Scoreboards Grid */}
        {filteredScoreboards.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Event Scoreboards Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for event results.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredScoreboards.map((scoreboard) => (
              <div
                key={scoreboard._id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Event Image */}
                {scoreboard.eventImage && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={scoreboard.eventImage}
                      alt={scoreboard.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {scoreboard.title}
                      </h3>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Title (if no image) */}
                  {!scoreboard.eventImage && (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {scoreboard.title}
                    </h3>
                  )}

                  {/* Event Info */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(scoreboard.eventDate)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {scoreboard.totalTeams} teams
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {scoreboard.totalPlayers} players
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {scoreboard.description}
                  </p>

                  {/* Top Winners Preview */}
                  {scoreboard.winners.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Top Winners
                      </h4>
                      <div className="space-y-2">
                        {scoreboard.winners.slice(0, 3).map((winner) => (
                          <div key={`${winner.rank}-${winner.teamName}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              {getRankIcon(winner.rank)}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {winner.teamName}
                              </span>
                              <span className="ml-auto font-mono text-red-600 dark:text-red-400">
                                {winner.totalScore}pts
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {winner.solvedChallenges} challenges solved
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {scoreboard.winners.length > 3 && (
                        <button
                          onClick={() => toggleExpanded(scoreboard._id)}
                          className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <span>
                            {expandedCard === scoreboard._id ? 'Show less' : `Show ${scoreboard.winners.length - 3} more winners`}
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedCard === scoreboard._id ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded Winners List */}
                  {expandedCard === scoreboard._id && scoreboard.winners.length > 3 && (
                    <div className="mb-4 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                      {scoreboard.winners.slice(3).map((winner) => (
                        <div key={`${winner.rank}-${winner.teamName}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            {getRankIcon(winner.rank)}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {winner.teamName}
                            </span>
                            <span className="ml-auto font-mono text-red-600 dark:text-red-400">
                              {winner.totalScore}pts
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {winner.solvedChallenges} challenges solved
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View Scoreboard Button */}
                  <Link
                    href={scoreboard.scoreboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Full Scoreboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventScoreboardsPage;