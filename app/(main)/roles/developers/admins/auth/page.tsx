'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Loading from '@/components/loading';
const AuthPage = () => {  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user) {
      const timer = setTimeout(() => {
        checkAdminStatus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [session, status]);

  const checkAdminStatus = async () => {
    if (adminCheckLoading) return; 
    
    setAdminCheckLoading(true);
    setError('');
    
    try {
      console.log('Checking admin status for:', session?.user?.email);
      
      const response = await fetch('/api/auth/check-admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control to prevent caching issues
        cache: 'no-cache'
      });
      
      const data = await response.json();
      console.log('Admin check response:', response.status, data);
      
      if (response.ok && data.isAdmin) {
        console.log('Admin access granted!');
        router.replace('/roles/developers/admins');
        setError(''); // Clear any previous errors
      } else {
        // User is not admin
        console.log('Admin access denied:', data.message);
        setError(data.message || 'Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('Error verifying admin status. Please try again.');
    } finally {
      setAdminCheckLoading(false);
    }
  };

  const handleSignIn = async (provider: string = 'credentials') => {
    if (loading) return; // Prevent multiple simultaneous sign-ins
    
    setLoading(true);
    setError('');

    try {
      const result = await signIn(provider, {
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError('Sign in failed. Please check your credentials.');
      } else if (result?.ok) {
        console.log('Sign in successful');
        // Don't redirect here, let the useEffect handle admin check after session updates
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleSignIn('google');
  const handleCredentialsSignIn = () => handleSignIn('credentials');

  const handleSignOut = async () => {
    setError('');
    await signOut({ redirect: false });
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full overflow-hidden">
        <div className="bg-rose-500 dark:bg-rose-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white">🔐 Admin Access</h1>
          <p className="text-rose-100 dark:text-rose-200 mt-2">
            {session?.user ? 'Verifying admin privileges...' : 'Sign in to create CTF rooms'}
          </p>
        </div>
        
        <div className="px-8 py-8">
          {session?.user ? (
            // User is signed in, show their info and admin check status
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {session.user.name || session.user.email}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </p>
              </div>

              {adminCheckLoading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
                </div>
              )}

              {!adminCheckLoading && !error && (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
                  ✅ Admin access verified! 
                  <br />
                  <a 
                    href="/roles/developers/admins/uploads" 
                    className="underline hover:no-underline font-semibold"
                  >
                    Go to Uploads Page
                  </a>
                </div>
              )}

              {error && (
                <div className="p-4 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-center">
                  <p className="mb-2">{error}</p>
                  {error.includes('Access denied') && (
                    <p className="text-sm">Contact an administrator to request admin privileges.</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={checkAdminStatus}
                  disabled={adminCheckLoading}
                  className="w-full py-3 rounded-lg font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                  {adminCheckLoading ? 'Checking...' : 'Retry Admin Check'}
                </button>
                
                <button 
                  onClick={handleSignOut}
                  disabled={adminCheckLoading}
                  className="w-full py-3 rounded-lg font-bold text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  Sign out and try different account
                </button>
              </div>
            </div>
          ) : (
            // User is not signed in, show sign in options
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-center">
                  {error}
                </div>
              )}
              
              {/* Google Sign In Button */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold border-2 transition duration-200 flex items-center justify-center gap-3 ${
                  loading 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed border-gray-400 text-white' 
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-800'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {/* Email/Password Sign In Button */}
              <button 
                onClick={handleCredentialsSignIn}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                  loading 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-800'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in with Email 🚀'}
              </button>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
              🔑 Admin role required to create CTF rooms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;