"use client";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <AuthError />;
  return <>{children}</>;
};

export default AuthWrapper;
