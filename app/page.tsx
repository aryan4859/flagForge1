"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Loading from "@/components/loading";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FlagForge",
    "url": "https://flagforge.xyz",
    "logo": "https://flagforge.xyz/flagforge.gif",
    "sameAs": [
      "https://github.com/aryan4859"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlagForge",
    "url": "https://flagforge.xyz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flagforge.xyz/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is FlagForge completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! FlagForge is completely free to use. All challenges, features, and competitions are available at no cost. We believe in making cybersecurity education accessible to everyone."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need prior experience in cybersecurity?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! We welcome participants of all skill levels. We have challenges ranging from beginner-friendly to advanced. Start with easier challenges and progressively work your way up as you learn."
        }
      },
      {
        "@type": "Question",
        "name": "How does the hint system work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you're stuck on a challenge, you can request hints. You have two options: watch a short advertisement to get a hint for free, or use your earned points to unlock hints instantly. This system keeps the platform free while helping you learn."
        }
      }
    ]
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <JsonLd data={organizationData} />
        <JsonLd data={websiteData} />
        <JsonLd data={faqData} />
        <main>
          <Hero />
        </main>
      </>
    );
  }
  return null;
}