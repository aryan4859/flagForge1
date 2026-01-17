'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Archive, 
  Plus, 
  Trash2, 
  ExternalLink,
  Calendar,
  Tag,
  Trophy,
  ArrowLeft,
  Edit,
  Save,
  X
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
  uploadedBy: string;
  createdAt: string;
}

const ArchivesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [challenges, setChallenges] = useState<ArchivedChallenge[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ArchivedChallenge | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    challengeType: 'link' as 'link' | 'file',
    challengeLink: '',
    eventName: 'PGS CTF 2026 Archive',
    eventDate: '',
    category: '',
    difficulty: 'Medium',
    solveCount: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;
      
      if (!session?.user) {
        router.push('/roles/developers/admins/auth');
        return;
      }

      try {
        const response = await fetch('/api/auth/check-admin', {
          method: 'GET',
          cache: 'no-cache'
        });
        
        const data = await response.json();
        
        if (response.ok && data.isAdmin) {
          setIsAuthenticated(true);
          fetchChallenges();
        } else {
          router.push('/roles/developers/admins/auth');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/roles/developers/admins/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [session, status, router]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/admin/archives?limit=100', {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching archived challenges:', error);
    }
  };

  const handleEdit = (challenge: ArchivedChallenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      challengeType: challenge.challengeType,
      challengeLink: challenge.challengeLink || '',
      eventName: challenge.eventName,
      eventDate: challenge.eventDate.split('T')[0], // Format date for input
      category: challenge.category || '',
      difficulty: challenge.difficulty || 'Medium',
      solveCount: challenge.solveCount || 0,
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingChallenge(null);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      challengeType: 'link',
      challengeLink: '',
      eventName: 'PGS CTF 2026 Archive',
      eventDate: '',
      category: '',
      difficulty: 'Medium',
      solveCount: 0,
    });
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      const isEditing = editingChallenge !== null;
      const url = isEditing ? `/api/admin/archives?id=${editingChallenge._id}` : '/api/admin/archives';
      const method = isEditing ? 'PUT' : 'POST';

      if (formData.challengeType === 'file') {
        // Handle file upload
        if (!isEditing && !selectedFile) {
          alert('Please select a file to upload');
          setSubmitting(false);
          return;
        }

        const fileFormData = new FormData();
        fileFormData.append('title', formData.title);
        fileFormData.append('description', formData.description);
        fileFormData.append('eventName', formData.eventName);
        fileFormData.append('eventDate', formData.eventDate);
        fileFormData.append('category', formData.category);
        fileFormData.append('difficulty', formData.difficulty);
        fileFormData.append('solveCount', formData.solveCount.toString());
        fileFormData.append('challengeType', formData.challengeType);
        
        if (selectedFile) {
          fileFormData.append('challengeFile', selectedFile);
        }

        response = await fetch(url, {
          method: method,
          body: fileFormData,
        });
      } else {
        // Handle link-based challenge
        response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        alert(isEditing ? 'Archived challenge updated successfully!' : 'Archived challenge created successfully!');
        handleCancelEdit();
        fetchChallenges();
      } else {
        alert(data.message || `Failed to ${isEditing ? 'update' : 'create'} archived challenge`);
      }
    } catch (error) {
      console.error(`Error ${editingChallenge ? 'updating' : 'creating'} archived challenge:`, error);
      alert(`Failed to ${editingChallenge ? 'update' : 'create'} archived challenge`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this archived challenge?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/archives?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Archived challenge deleted successfully!');
        fetchChallenges();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete archived challenge');
      }
    } catch (error) {
      console.error('Error deleting archived challenge:', error);
      alert('Failed to delete archived challenge');
    }
  };

  if (status === 'loading' || loading) {
    return <Loading />;
  }

  if (!isAuthenticated || !session?.user) {
    return null;
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
            <button
              onClick={() => router.push('/roles/developers/admins')}
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-purple-500 rounded-2xl shadow-lg">
                    <Archive className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                    CTF Archives
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                  Manage archived challenges from past CTF competitions
                </p>
              </div>
              
              <button
                onClick={() => {
                  setEditingChallenge(null);
                  setFormData({
                    title: '',
                    description: '',
                    challengeType: 'link',
                    challengeLink: '',
                    eventName: 'PGS CTF 2026 Archive',
                    eventDate: '',
                    category: '',
                    difficulty: 'Medium',
                    solveCount: 0,
                  });
                  setSelectedFile(null);
                  setShowForm(!showForm);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-600 transition"
              >
                <Plus className="w-5 h-5" />
                Add Archive
              </button>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {editingChallenge ? 'Edit Archived Challenge' : 'Add New Archived Challenge'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                    placeholder="Enter challenge title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Type *
                  </label>
                  <select
                    value={formData.challengeType}
                    onChange={(e) => setFormData({ ...formData, challengeType: e.target.value as 'link' | 'file' })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  >
                    <option value="link">External Link</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>

                {formData.challengeType === 'link' ? (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Challenge Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.challengeLink}
                      onChange={(e) => setFormData({ ...formData, challengeLink: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Challenge File {editingChallenge ? '(Upload new file to replace current)' : '*'}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        required={!editingChallenge}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-300"
                        accept=".zip,.pdf,.txt,.png,.jpg,.jpeg"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Supported formats: ZIP, PDF, TXT, PNG, JPG (Max: 50MB)
                        {editingChallenge && editingChallenge.challengeFile && (
                          <span className="block text-blue-600 dark:text-blue-400">
                            Current file: {editingChallenge.challengeFile.split('/').pop()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                    placeholder="e.g., Web, Crypto, Forensics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Solve Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.solveCount}
                    onChange={(e) => setFormData({ ...formData, solveCount: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100"
                  placeholder="Enter challenge description"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-600 disabled:opacity-50 transition"
                >
                  {submitting ? (editingChallenge ? 'Updating...' : 'Creating...') : (editingChallenge ? 'Update Archive' : 'Create Archive')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Challenges List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-900/20" />
              
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {challenge.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                      title="Edit challenge"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      title="Delete challenge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    <span>{new Date(challenge.eventDate).toLocaleDateString()}</span>
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
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 transition"
                >
                  {challenge.challengeType === 'link' ? 'View Challenge' : 'Download File'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {challenges.length === 0 && !showForm && (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No archived challenges yet. Click "Add Archive" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesManagement;
