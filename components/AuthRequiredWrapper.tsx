"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AuthRequiredWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

const AuthRequiredWrapper = ({ 
  children, 
  fallback,
  redirectTo = "/authentication" 
}: AuthRequiredWrapperProps) => {
  const { status } = useSession();
  const router = useRouter();

  const handleAuthRequired = () => {
    router.push(redirectTo);
  };

  if (status === "loading") {
    return fallback || <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    if (fallback) {
      return <>{fallback}</>;
    }
    handleAuthRequired();
    return null;
  }

  return <>{children}</>;
};

export default AuthRequiredWrapper;