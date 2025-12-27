import { Metadata } from "next";
import BlogClient from "@/components/BlogClient";
import { notFound } from "next/navigation";

// Use an absolute URL for cross-environment consistency
const BASE_URL = "https://flagforge.xyz";

async function getPost(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post;
  } catch (error) {
    console.error("Error fetching post for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Post Not Found | FlagForge",
    };
  }

  return {
    title: `${post.title} | FlagForge Blog`,
    description: post.excerpt || `Read ${post.title} on FlagForge.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover || post.thumbnail || post.image ? [post.cover || post.thumbnail || post.image] : ["https://flagforge.xyz/flagforge-logo.png"],
      type: "article",
      publishedTime: post.created,
      modifiedTime: post.updated,
      authors: ["FlagForge"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover || post.thumbnail || post.image ? [post.cover || post.thumbnail || post.image] : ["https://flagforge.xyz/flagforge-logo.png"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return <BlogClient id={id} />;
}