"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

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

// Constants
const CATEGORIES = [
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
] as const;

const INITIAL_FORM_STATE: Omit<FormData, "uploadedBy"> = {
  title: "",
  description: "",
  category: "All",
  resourceLink: "",
};

// Utility functions
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateFormData = (formData: FormData): string | null => {
  const validations = [
    { condition: !formData.title.trim(), message: "Title is required." },
    {
      condition: !formData.description.trim(),
      message: "Description is required.",
    },
    {
      condition: !formData.resourceLink.trim(),
      message: "Resource link is required.",
    },
    {
      condition: !validateUrl(formData.resourceLink),
      message: "Please enter a valid URL for the resource link.",
    },
    {
      condition: formData.category === "All",
      message: "Please select a specific category.",
    },
  ];

  const failedValidation = validations.find((v) => v.condition);
  return failedValidation?.message || null;
};

// Components
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-rose-500 text-xl font-bold">Loading...</div>
  </div>
);

const AlertMessage: React.FC<{ message: string; type: "error" | "success" }> = ({
  message,
  type,
}) => {
  const styles = {
    error:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
  };
  return (
    <div className={`p-4 border rounded-lg text-center ${styles[type]}`}>
      {message}
    </div>
  );
};

const FormField: React.FC<{
  id: string;
  label: string;
  type?: "text" | "url" | "select" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  placeholder?: string;
  options?: readonly string[];
  rows?: number;
  required?: boolean;
}> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options,
  rows = 4,
  required = false,
}) => (
  <div>
    <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2">
      {label}
    </label>
    {type === "select" ? (
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:border-rose-500 dark:focus:border-rose-400 transition duration-200"
        required={required}
      >
        <option value="All" disabled>
          Select a category
        </option>
        {options?.slice(1).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 dark:focus:border-rose-400 transition duration-200 resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
        required={required}
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 dark:focus:border-rose-400 transition duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        required={required}
      />
    )}
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; breakWords?: boolean }> = ({
  label,
  value,
  breakWords = false,
}) => (
  <div>
    <span className="font-semibold text-gray-700 dark:text-gray-300">
      {label}:
    </span>
    <p
      className={`text-gray-600 dark:text-gray-400 ${
        breakWords ? "break-words" : ""
      }`}
    >
      {value || "Not specified"}
    </p>
  </div>
);

const ConfirmationPopup: React.FC<{
  show: boolean;
  formData: FormData;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ show, formData, isSubmitting, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Confirm Submission
            </h2>
          </div>
          <div className="space-y-4 mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Please review your resource details before submitting:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Title" value={formData.title} breakWords />
                <DetailRow label="Category" value={formData.category} />
                <DetailRow label="Uploaded by" value={formData.uploadedBy} />
              </div>
              <DetailRow label="Resource Link" value={formData.resourceLink} />
              {formData.description && (
                <DetailRow
                  label="Description"
                  value={formData.description}
                  breakWords
                />
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-6 py-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

// ✅ Main component
const ResourceUploadPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData>({
    ...INITIAL_FORM_STATE,
    uploadedBy: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCheckLoading, setAdminCheckLoading] = useState<boolean>(true);

  

  // Auth check
 useEffect(() => {
     const checkAuthAndAdmin = async () => {
       if (status === 'loading') return;
       
       if (!session?.user) {
         router.push('/roles/developers/admins/auth');
         return;
       }
 
       try {
         setAdminCheckLoading(true);
         console.log('Checking admin status for uploads page:', session.user.email);
         
         const response = await fetch('/api/auth/check-admin', {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
           cache: 'no-cache'
         });
         
         const data = await response.json();
         console.log('Admin check response in uploads:', response.status, data);
         
         if (response.ok && data.isAdmin) {
           console.log('Admin access verified for uploads page');
           setIsAuthenticated(true);
           // Set the uploadedBy field
           const username = session.user.name || session.user.email?.split('@')[0] || 'admin';
           setFormData(prev => ({ ...prev, uploadedBy: username }));
         } else {
           console.log('Admin access denied for uploads page:', data.message);
           router.push('/roles/developers/admins/auth');
           return;
         }
       } catch (error) {
         console.error('Error checking admin status in uploads:', error);
         router.push('/roles/developers/admins/auth');
         return;
       } finally {
         setAdminCheckLoading(false);
         setLoading(false);
       }
     };
 
     checkAuthAndAdmin();
   }, [session, status, router]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...INITIAL_FORM_STATE,
      uploadedBy: session?.user?.name || session?.user?.email?.split("@")[0] || "",
    });
  };

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    const validationError = validateFormData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    clearMessages();
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
        resetForm();
        setTimeout(() => router.push("/resources"), 2000);
      } else {
        setError(data.message || "An error occurred.");
        setShowConfirmation(false);
      }
    } catch {
      setError("An unexpected error occurred.");
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") return <LoadingScreen />;
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-rose-500 dark:text-rose-400">
            Upload Resource
          </h1>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/roles/developers/admins/auth" })}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                id="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Resource Title"
                required
              />

              <FormField
                id="category"
                label="Category"
                type="select"
                value={formData.category}
                onChange={handleChange}
                options={CATEGORIES}
                required
              />

              <FormField
                id="resourceLink"
                label="Resource Link"
                type="url"
                value={formData.resourceLink}
                onChange={handleChange}
                placeholder="https://example.com/resource"
                required
              />
            </div>

            <FormField
              id="description"
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the resource..."
              required
            />

            {error && <AlertMessage message={error} type="error" />}
            {success && <AlertMessage message={success} type="success" />}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 rounded-xl px-8 py-3 text-white font-bold text-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                Upload Resource
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationPopup
        show={showConfirmation}
        formData={formData}
        isSubmitting={isSubmitting}
        onCancel={() => setShowConfirmation(false)}
        onConfirm={handleConfirmedSubmit}
      />
    </div>
  );
};

export default ResourceUploadPage;
