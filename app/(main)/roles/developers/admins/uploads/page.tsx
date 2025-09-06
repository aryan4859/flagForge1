'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Plus, X, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';

// Type definitions
interface FormData {
  title: string;
  flag: string;
  description: string;
  points: string;
  category: string;
  link: string;
  isTimeLimited: boolean;
  timeLimit: string;
  timeLimitUnit: 'hours' | 'days' | 'weeks';
  uploadedBy: string;
}

interface Hint {
  id: number;
  text: string;
  pointsDeduction: string;
}

interface SubmissionData extends FormData {
  hints: Hint[];
  expiryDate: Date | null;
  createdAt: string;
}

// Common styles
const styles = {
  input: "w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200",
  label: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
  button: "px-6 py-2 rounded-lg font-medium transition duration-200",
  section: "border-2 border-gray-200 rounded-lg p-6 bg-gray-50",
  alert: "p-4 border rounded-lg text-center"
};

// Categories array
const CATEGORIES = [
  'All', 'Web Exploitation', 'Cryptography', 'Reverse Engineering',
  'Forensics', 'General Skills', 'Binary Exploitation', 'Privilege Escalation',
  'IOT', 'OSINT', 'Miscellaneous', 'Steganography'
];

// Time units
const TIME_UNITS = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' }
];

const UploadPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "", flag: "", description: "", points: "", category: "All",
    link: "", isTimeLimited: false, timeLimit: "", timeLimitUnit: "days", uploadedBy: ""
  });
  
  const [hints, setHints] = useState<Hint[]>([{ id: 1, text: "", pointsDeduction: "" }]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
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
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const addHint = (): void => {
    const newId = hints.length > 0 ? Math.max(...hints.map(h => h.id)) + 1 : 1;
    setHints([...hints, { id: newId, text: "", pointsDeduction: "" }]);
  };

  const removeHint = (id: number): void => {
    if (hints.length > 1) {
      setHints(hints.filter(hint => hint.id !== id));
    }
  };

  const updateHint = (id: number, field: keyof Omit<Hint, 'id'>, value: string): void => {
    setHints(hints.map(hint => 
      hint.id === id ? { ...hint, [field]: value } : hint
    ));
  };

  const calculateExpiryDate = (): Date | null => {
    if (!formData.isTimeLimited || !formData.timeLimit) return null;
    
    const now = new Date();
    const amount = parseInt(formData.timeLimit);
    const multiplier = { hours: 60 * 60 * 1000, days: 24 * 60 * 60 * 1000, weeks: 7 * 24 * 60 * 60 * 1000 };
    
    return new Date(now.getTime() + amount * multiplier[formData.timeLimitUnit]);
  };

  const resetForm = () => {
    setFormData({
      title: "", flag: "", description: "", points: "", category: "All",
      link: "", isTimeLimited: false, timeLimit: "", timeLimitUnit: "days",
      uploadedBy: formData.uploadedBy
    });
    setHints([{ id: 1, text: "", pointsDeduction: "" }]);
  };

  const handleInitialSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validHints = hints.filter(hint => hint.text.trim() !== "");
    for (const hint of validHints) {
      if (!hint.pointsDeduction || parseInt(hint.pointsDeduction) < 0) {
        setError("All hints must have a valid points deduction value.");
        return;
      }
    }

    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const validHints = hints.filter(hint => hint.text.trim() !== "");
      
      const submissionData: SubmissionData = {
        ...formData,
        hints: validHints,
        expiryDate: calculateExpiryDate(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSuccess("CTF challenge uploaded successfully!");
        setShowConfirmation(false);
        resetForm();
        
        setTimeout(() => {
          router.push("/problems");
        }, 2000);
      } else {
        const data = await response.json();
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
      ['adminAuth', 'adminEmail', 'adminUsername'].forEach(key => 
        sessionStorage.removeItem(key)
      );
    }
    router.push('/roles/developers/admins/auth');
  };

  // Reusable components
  const InputField = ({ id, type = "text", placeholder, required = false, children }: {
    id: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode;
  }) => (
    <div>
      <label className={styles.label}>{children || id.charAt(0).toUpperCase() + id.slice(1)}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={formData[id] as string}
        onChange={handleChange}
        className={styles.input}
        required={required}
        {...(type === "number" && { min: id === "points" ? "1" : "0" })}
      />
    </div>
  );

  const Alert = ({ type, message }: { type: 'error' | 'success'; message: string }) => (
    <div className={`${styles.alert} ${type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
      {message}
    </div>
  );

  const DetailRow = ({ label, value, isMono = false }: { label: string; value: string; isMono?: boolean }) => (
    <div>
      <span className="font-semibold text-gray-700">{label}:</span>
      <p className={`text-gray-600 break-words ${isMono ? 'font-mono bg-gray-100 px-2 py-1 rounded break-all' : ''}`}>
        {value || "Not specified"}
      </p>
    </div>
  );

  const ConfirmationPopup = () => {
    if (!showConfirmation) return null;

    const validHints = hints.filter(hint => hint.text.trim() !== "");
    const expiryDate = calculateExpiryDate();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">Confirm Submission</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">Please review your CTF challenge details before submitting:</p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailRow label="Title" value={formData.title} />
                  <DetailRow label="Category" value={formData.category} />
                  <DetailRow label="Points" value={formData.points} />
                  <DetailRow label="Uploaded by" value={formData.uploadedBy} />
                </div>
                
                <DetailRow label="Flag" value={formData.flag} isMono />
                
                {formData.description && <DetailRow label="Description" value={formData.description} />}
                {formData.link && <DetailRow label="Resource Link" value={formData.link} />}
                
                {formData.isTimeLimited && (
                  <div>
                    <span className="font-semibold text-gray-700">Time Limit:</span>
                    <p className="text-gray-600">
                      {formData.timeLimit} {formData.timeLimitUnit}
                      {expiryDate && (
                        <span className="block text-sm text-amber-600">
                          Expires: {expiryDate.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {validHints.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-700">Hints ({validHints.length}):</span>
                    <div className="space-y-2 mt-2">
                      {validHints.map((hint) => (
                        <div key={hint.id} className="bg-white border border-gray-200 rounded p-2">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-gray-600 flex-1">{hint.text}</p>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              -{hint.pointsDeduction} pts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className={`${styles.button} border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className={`${styles.button} bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
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

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-500">
            Upload CTF Challenge
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField id="title" placeholder="CTF Challenge Title" required>Title/Heading</InputField>
              <InputField id="flag" placeholder="flag{example_flag_here}" required>Flag</InputField>
            </div>

            {/* Description */}
            <div>
              <label className={styles.label}>Description</label>
              <textarea
                id="description"
                placeholder="Detailed description of the CTF challenge..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`${styles.input} resize-none`}
                required
              />
            </div>

            {/* Points, Category, Link */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField id="points" type="number" placeholder="100" required>Points</InputField>
              
              <div>
                <label className={styles.label}>Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.input}
                >
                  {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              
              <InputField id="link" type="url" placeholder="https://example.com/resource">Resource Link</InputField>
            </div>

            {/* Time Limit Section */}
            <div className={styles.section}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-semibold text-gray-700">Time Limit Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="isTimeLimited"
                    type="checkbox"
                    checked={formData.isTimeLimited}
                    onChange={handleChange}
                    className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="isTimeLimited" className="text-sm font-medium text-gray-700">
                    Enable time-limited room
                  </label>
                </div>
                
                {formData.isTimeLimited && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField id="timeLimit" type="number" placeholder="1" required={formData.isTimeLimited}>Duration</InputField>
                    
                    <div>
                      <label className={styles.label}>Unit</label>
                      <select
                        id="timeLimitUnit"
                        value={formData.timeLimitUnit}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-lg focus:outline-none focus:border-rose-500 transition duration-200"
                      >
                        {TIME_UNITS.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                {formData.isTimeLimited && formData.timeLimit && calculateExpiryDate() && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Room will expire:</strong> {calculateExpiryDate()?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Hints Section */}
            <div className={styles.section}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-semibold text-gray-700">Hints</h3>
                </div>
                <button
                  type="button"
                  onClick={addHint}
                  className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Hint
                </button>
              </div>
              
              <div className="space-y-4">
                {hints.map((hint, index) => (
                  <div key={hint.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Hint {index + 1}</h4>
                      {hints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHint(hint.id)}
                          className="text-red-500 hover:text-red-700 transition duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Hint Text</label>
                        <textarea
                          placeholder="Enter hint text..."
                          value={hint.text}
                          onChange={(e) => updateHint(hint.id, 'text', e.target.value)}
                          rows={2}
                          className="w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-rose-500 transition duration-200 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Points Deduction</label>
                        <input
                          type="number"
                          placeholder="10"
                          min="0"
                          value={hint.pointsDeduction}
                          onChange={(e) => updateHint(hint.id, 'pointsDeduction', e.target.value)}
                          className="w-full bg-gray-50 text-gray-800 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-rose-500 transition duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                onClick={handleInitialSubmit}
                disabled={isSubmitting}
                className="bg-rose-500 hover:bg-rose-600 rounded-xl px-8 py-3 text-white font-bold text-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-rose-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Challenge 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmationPopup />
    </div>
  );
};

export default UploadPage;