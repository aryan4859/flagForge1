'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Admin credentials (in production, store these securely)
const ADMIN_EMAIL = 'admin@flagforge.com';
const ADMIN_PASSWORD = 'Flagforge@321#@!';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      // Set admin session
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminEmail', formData.email);
      
      // Redirect to upload page
      router.push('/upload');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-gray-700 font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-center mt-6">
              <button 
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg transition duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Demo Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;