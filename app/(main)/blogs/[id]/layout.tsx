import type { Metadata } from "next";
import type { ReactNode } from "react";

export const generateMetadata = ({
  params,
}: {
  params: { id: string };
}): Metadata => ({
  alternates: {
    canonical: `/blogs/${params.id}`,
  },
  openGraph: {
    url: `https://flagforge.xyz/blogs/${params.id}`,
  },
});

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return children;
}
