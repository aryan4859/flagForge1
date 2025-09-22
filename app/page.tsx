"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import Hero from "@/components/Hero";
import Loading from "@/components/loading";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Loading/>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main>
        <Hero />
      </main>
    );
  }
  return null;
}