'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;


const AuthPage = () => {  
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
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      // Set admin session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminEmail', formData.email);
      }
      
      // Redirect to upload page
      router.push('/roles/developers/admins/uploads');
    } else {
      setError('Invalid email or password. Access denied.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full overflow-hidden">
        <div className="bg-rose-500 dark:bg-rose-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white">🔐 Admin Access</h1>
          <p className="text-rose-100 dark:text-rose-200 mt-2">Enter credentials to create CTF rooms</p>
        </div>
        
        <div className="px-8 py-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="email">
                 Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-rose-500 dark:focus:border-rose-400 transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="password">
                 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-rose-500 dark:focus:border-rose-400 transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>
            
            {error && (
              <div className="p-4 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                loading 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-800'
              }`}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel 🚀'}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
              🔑 Admin credentials required to create CTF rooms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;