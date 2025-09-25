// auth.ts
import { signOut as nextAuthSignOut } from "next-auth/react";

export const signOut = async () => {
  try {
    // Clear any client-side storage that might contain sensitive data
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any custom cookies you might have set
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });
    }

    // Call NextAuth signOut with proper options
    await nextAuthSignOut({ 
      callbackUrl: "/",
      redirect: true
    });

    // Force a hard refresh to clear any cached data
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  } catch (error) {
    console.error('SignOut error:', error);
    // Even if signOut fails, redirect to home to prevent session persistence
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  }
};

// Alternative version with more control
export const secureSignOut = async (redirectTo: string = "/") => {
  try {
    // Optional: Call a custom API endpoint for server-side cleanup
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      console.warn('Server-side logout failed, continuing with client-side logout');
    }

    // Clear client-side data
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    // NextAuth signOut
    await nextAuthSignOut({ 
      callbackUrl: redirectTo,
      redirect: false // We'll handle redirect manually for better control
    });

    // Manual redirect with cache busting
    if (typeof window !== 'undefined') {
      // Add cache busting parameter
      const separator = redirectTo.includes('?') ? '&' : '?';
      window.location.href = `${redirectTo}${separator}_t=${Date.now()}`;
    }
  } catch (error) {
    console.error('Secure signOut error:', error);
    // Force redirect even if logout fails
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }
};