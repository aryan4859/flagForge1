'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, AlertCircle, CheckCircle, Upload } from 'lucide-react';

// Type definitions
interface FormData {
  title: string;
  description: string;
  category: string;
  resourceLink: string;
  uploadedBy: string;
}

interface SubmissionData extends FormData {
  createdAt: string;
}

const ResourceUploadPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "All",
    resourceLink: "",
    uploadedBy: "",
  });
  
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const categories = [
    "All",
    "Tools & Frameworks",
    "CTF Resources & Writeups",
    "CyberSecurity Essentials",
    "Web Essentials",
    "Linux Essentials",
    "Blue Team",
    "Red Team",
    "Cryptography",
    "Forensics",
  ];

  useEffect(() => {
    // Check if user is authenticated and get username
    const checkAuth = (): void => {
      if (typeof window !== 'undefined') {
        const adminAuth = sessionStorage.getItem('adminAuth');
        const adminEmail = sessionStorage.getItem('adminEmail');
        const adminUsername = sessionStorage.getItem('adminUsername') || adminEmail?.split('@')[0] || 'admin';
        
        if (adminAuth === 'true' && adminEmail) {
          setIsAuthenticated(true);
          setFormData(prev => ({ ...prev, uploadedBy: adminUsername }));
        } else {
          router.push('/roles/developers/admins/auth');
          return;
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form data
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!formData.resourceLink.trim()) {
      setError("Resource link is required.");
      return;
    }

    if (!validateUrl(formData.resourceLink)) {
      setError("Please enter a valid URL for the resource link.");
      return;
    }

    if (formData.category === "All") {
      setError("Please select a specific category.");
      return;
    }

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const submissionData: SubmissionData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Resource uploaded successfully!");
        setShowConfirmation(false);
        setFormData({
          title: "",
          description: "",
          category: "All",
          resourceLink: "",
          uploadedBy: formData.uploadedBy,
        });
        
        setTimeout(() => {
          router.push("/resources");
        }, 2000);
      } else {
        setError(data.message || "An error occurred.");
        setShowConfirmation(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminUsername');
    }
    router.push('/roles/developers/admins/auth');
  };

  const ConfirmationPopup = () => {
    if (!showConfirmation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">Confirm Submission</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">Please review your resource details before submitting:</p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">Title:</span>
                    <p className="text-gray-600 break-words">{formData.title || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Category:</span>
                    <p className="text-gray-600">{formData.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Uploaded by:</span>
                    <p className="text-gray-600">{formData.uploadedBy}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Resource Link:</span>
                  <p className="text-gray-600 break-all">{formData.resourceLink || "Not specified"}</p>
                </div>
                
                {formData.description && (
                  <div>
                    <span className="font-semibold text-gray-700">Description:</span>
                    <p className="text-gray-600 break-words">{formData.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm & Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center">
        <div className="text-rose-500 text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-500">
            Upload Resource
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Resource Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:border-rose-500 transition duration-200"
                  required
                >
                  <option value="All" disabled>Select a category</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Resource Link
                </label>
                <input
                  id="resourceLink"
                  type="url"
                  placeholder="https://example.com/resource"
                  value={formData.resourceLink}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Detailed description of the resource..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200 resize-none"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-500 hover:bg-rose-600 rounded-xl px-8 py-3 text-white font-bold text-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-rose-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                Upload Resource
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <ConfirmationPopup />
    </div>
  );
};

export default ResourceUploadPage;