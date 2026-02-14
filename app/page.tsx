"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import { landingFaqItems } from "@/lib/faq";

export default function Home() {
  const { status } = useSession();
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
    "url": "https://flagforgectf.com",
    "logo": "https://flagforgectf.com/flagforge.gif",
    "sameAs": [
      "https://github.com/aryan4859"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlagForge",
    "url": "https://flagforgectf.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flagforgectf.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": landingFaqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://flagforgectf.com/"
      }
    ]
  };

  if (status !== "authenticated") {
    return (
      <>
        <JsonLd data={organizationData} />
        <JsonLd data={websiteData} />
        <JsonLd data={faqData} />
        <JsonLd data={breadcrumbData} />
        <main>
          <Hero />
        </main>
      </>
    );
  }
  return null;
}
