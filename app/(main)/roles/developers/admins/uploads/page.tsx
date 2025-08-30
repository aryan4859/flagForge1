'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    flag: "",
    description: "",
    points: "",
    category: "All",
    link: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const adminAuth = sessionStorage.getItem('adminAuth');
        const adminEmail = sessionStorage.getItem('adminEmail');
        
        if (adminAuth === 'true' && adminEmail) {
          setIsAuthenticated(true);
        } else {
          router.push('/roles/developers/admins/auth');
          return;
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("CTF question uploaded successfully!");
        setFormData({
          title: "",
          flag: "",
          description: "",
          points: "",
          category: "All",
          link: "",
        });
        router.push("/problems");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('adminEmail');
    }
    router.push('/roles/developers/admins/auth');
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
            Upload CTF Questions
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Title/Heading
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="CTF Challenge Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Flag
                </label>
                <input
                  id="flag"
                  type="text"
                  placeholder="flag{example_flag_here}"
                  value={formData.flag}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Detailed description of the CTF challenge..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Points
                </label>
                <input
                  id="points"
                  type="number"
                  placeholder="100"
                  value={formData.points}
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
                >
                  <option>All</option>
                  <option>Web Exploitation</option>
                  <option>Cryptography</option>
                  <option>Reverse Engineering</option>
                  <option>Forensics</option>
                  <option>General Skills</option>
                  <option>Binary Exploitation</option>
                  <option>IOT</option>
                </select>
              </div>
              
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Resource Link
                </label>
                <input
                  id="link"
                  type="url"
                  placeholder="https://example.com/resource"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-rose-500 transition duration-200"
                />
              </div>
            </div>

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

            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                className="bg-rose-500 hover:bg-rose-600 rounded-xl px-8 py-3 text-white font-bold text-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-rose-200"
              >
                Upload Challenge 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;