'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Users,
  Medal,
  Upload,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import Loading from '@/components/loading';
import Image from 'next/image';

interface EventScoreboard {
  _id: string;
  title: string;
  description: string;
  eventName: string;
  eventDate: string;
  scoreboardUrl: string;
  eventImage?: string;
  totalTeams: number;
  totalPlayers: number;
  isActive: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

const AdminEventScoreboardsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const [scoreboards, setScoreboards] = useState<EventScoreboard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScoreboard, setEditingScoreboard] = useState<EventScoreboard | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventName: '',
    eventDate: '',
    scoreboardUrl: '',
    totalTeams: 0,
    totalPlayers: 0,
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Authentication and admin check (same as main admin page)
  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      if (status === 'loading') return;
      
      if (!session?.user) {
        router.push('/roles/developers/admins/auth');
        return;
      }

      try {
        setAdminCheckLoading(true);
        console.log('Checking admin status for event scoreboards:', session.user.email);
        
        const response = await fetch('/api/auth/check-admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        const data = await response.json();
        console.log('Admin check response:', response.status, data);
        
        if (response.ok && data.isAdmin) {
          console.log('Admin access verified for event scoreboards');
          setIsAuthenticated(true);
        } else {
          console.log('Admin access denied:', data.message);
          router.push('/roles/developers/admins/auth');
          return;
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/roles/developers/admins/auth');
        return;
      } finally {
        setAdminCheckLoading(false);
        setLoading(false);
      }
    };

    checkAuthAndAdmin();
  }, [session, status, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchScoreboards();
    }
  }, [isAuthenticated]);

  const fetchScoreboards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/event-scoreboards?limit=100', {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        setScoreboards(data.data || []);
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

  const validateFormData = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.eventName.trim()) errors.push("Event name is required");
    if (!formData.scoreboardUrl.trim()) errors.push("Scoreboard URL is required");
    if (!formData.eventDate) errors.push("Event date is required");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      alert("Please fix the following errors:\n" + validationErrors.join("\n"));
      return;
    }
    
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('eventName', formData.eventName.trim());
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('scoreboardUrl', formData.scoreboardUrl.trim());
      formDataToSend.append('totalTeams', formData.totalTeams.toString());
      formDataToSend.append('totalPlayers', formData.totalPlayers.toString());
      formDataToSend.append('isActive', formData.isActive.toString());

      if (selectedFile) {
        formDataToSend.append('eventImage', selectedFile);
      }

      const url = editingScoreboard 
        ? `/api/admin/event-scoreboards?id=${editingScoreboard._id}`
        : '/api/admin/event-scoreboards';
      
      const method = editingScoreboard ? 'PUT' : 'POST';

      console.log(`${method} request to:`, url);
      console.log('Form data:', {
        title: formData.title,
        eventName: formData.eventName,
        isActive: formData.isActive
      });

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (response.ok) {
        await fetchScoreboards();
        resetForm();
        setShowForm(false);
        alert(responseData.message || 'Event scoreboard saved successfully!');
      } else {
        console.error('Server error:', responseData);
        alert(responseData.message || `Failed to ${editingScoreboard ? 'update' : 'create'} event scoreboard`);
      }
    } catch (error) {
      console.error('Error saving event scoreboard:', error);
      alert(`Failed to ${editingScoreboard ? 'update' : 'create'} event scoreboard. Please check the console for details.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (scoreboardId: string) => {
    if (!confirm('Are you sure you want to delete this event scoreboard?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/event-scoreboards?id=${scoreboardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchScoreboards();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete event scoreboard');
      }
    } catch (error) {
      console.error('Error deleting event scoreboard:', error);
      alert('Failed to delete event scoreboard');
    }
  };

  const handleEdit = (scoreboard: EventScoreboard) => {
    setEditingScoreboard(scoreboard);
    
    setFormData({
      title: scoreboard.title,
      description: scoreboard.description,
      eventName: scoreboard.eventName,
      eventDate: scoreboard.eventDate.split('T')[0], // Format for date input
      scoreboardUrl: scoreboard.scoreboardUrl,
      totalTeams: scoreboard.totalTeams,
      totalPlayers: scoreboard.totalPlayers,
      isActive: scoreboard.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventName: '',
      eventDate: '',
      scoreboardUrl: '',
      totalTeams: 0,
      totalPlayers: 0,
      isActive: true
    });
    setSelectedFile(null);
    setEditingScoreboard(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading while checking session or admin status
  if (status === 'loading' || loading || adminCheckLoading) {
    return <Loading />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated || !session?.user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-blue-200/70 blur-3xl dark:bg-blue-900/30" />
      <div className="pointer-events-none absolute -bottom-28 left-[-10%] h-96 w-96 rounded-full bg-rose-200/60 blur-3xl dark:bg-rose-900/30" />
      
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <button
              onClick={() => router.push('/roles/developers/admins')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Admin Dashboard
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Event Scoreboards Management
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage CTF event scoreboards and winners
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/debug-scoreboards');
                    const result = await response.json();
                    console.log('Debug info:', result);
                    if (result.success) {
                      alert(`Debug info logged to console. Found ${result.data.totalScoreboards} scoreboards.`);
                    } else {
                      alert('Debug failed: ' + result.message);
                    }
                  } catch (error) {
                    console.error('Debug error:', error);
                    alert('Debug failed. Check console.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm"
              >
                Debug Data
              </button>
              <button
                onClick={async () => {
                  if (confirm('This will clean up old data format. Continue?')) {
                    try {
                      const response = await fetch('/api/admin/migrate-scoreboards', {
                        method: 'POST'
                      });
                      const result = await response.json();
                      
                      if (result.success) {
                        alert(`✅ ${result.message}`);
                        fetchScoreboards();
                      } else {
                        console.error('Migration failed:', result);
                        let errorMessage = `❌ ${result.message}`;
                        if (result.errors && result.errors.length > 0) {
                          errorMessage += '\n\nErrors:\n' + result.errors.join('\n');
                        }
                        alert(errorMessage);
                      }
                    } catch (error) {
                      console.error('Migration error:', error);
                      alert('❌ Migration failed. Check console for details.');
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Clean Data
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                Add Event Scoreboard
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full my-4 sm:my-8 shadow-2xl min-h-fit">
              <div className="p-4 sm:p-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {editingScoreboard ? 'Edit Event Scoreboard' : 'Add Event Scoreboard'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="e.g., PGS CTF 2026 Scoreboard"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Event Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.eventName}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="e.g., PGS CTF 2026"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Scoreboard URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.scoreboardUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, scoreboardUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="https://event.flagforgectf.com/games/2/scoreboard"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Total Teams
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalTeams}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalTeams: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Total Players
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalPlayers}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalPlayers: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Brief description of the event..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Event Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload an image for the event (max 10MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active (visible to users)
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-600 sticky bottom-0 bg-white dark:bg-gray-800">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <Save className="h-4 w-4" />
                      {submitting ? 'Saving...' : 'Save Event Scoreboard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Scoreboards List */}
        <div className="space-y-6">
          {scoreboards.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-12 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
                <Trophy className="mx-auto h-20 w-20 text-gray-400 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Event Scoreboards
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first event scoreboard to get started.
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Event
                </button>
              </div>
            </div>
          ) : (
            scoreboards.map((scoreboard) => (
              <div
                key={scoreboard._id}
                className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {scoreboard.title}
                      </h3>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        scoreboard.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {scoreboard.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      {scoreboard.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-600 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{formatDate(scoreboard.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{scoreboard.totalTeams} teams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Medal className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">{scoreboard.totalPlayers} players</span>
                      </div>
                    </div>

                    {scoreboard.eventImage && (
                      <div className="mb-6">
                        <Image
                          src={scoreboard.eventImage}
                          alt={scoreboard.title}
                          width={300}
                          height={150}
                          className="rounded-2xl object-cover shadow-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-6">
                    <a
                      href={scoreboard.scoreboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                      title="View Scoreboard"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleEdit(scoreboard)}
                      className="p-3 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(scoreboard._id)}
                      className="p-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventScoreboardsPage;