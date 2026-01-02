"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/loading";
import JsonLd from "@/components/JsonLd";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  status: string;
  created: string;
  updated: string;
  thumbnail: string | null;
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 dark:text-red-500 mb-4 transition-colors duration-300">
            Error Loading Posts
          </h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-400 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "FlagForge Blog",
          description: "Discover insights, tutorials, and stories from our team at FlagForge.",
          url: "https://flagforge.xyz/blogs",
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `https://flagforge.xyz/blogs/${post.id}`,
            datePublished: post.created,
            description: post.excerpt,
          })),
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-400 dark:text-red-500 mb-2 transition-colors duration-300">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Discover insights, tutorials, and stories from our team
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Check back later for new content!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-red-200 dark:hover:border-red-800 bg-white dark:bg-gray-800"
              >
                {/* Thumbnail Image */}
                {post.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <time className="text-sm text-red-400 dark:text-red-500 font-medium transition-colors duration-300">
                      {formatDate(post.created)}
                    </time>
                  </div>

                  <h2 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-red-500 dark:group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
                    <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 transition-colors duration-300">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/blogs/${post.id}`}
                      className="inline-flex items-center text-red-400 dark:text-red-500 font-medium hover:text-red-700 dark:hover:text-red-500 transition-colors duration-300"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>

                    {post.status && (
                      <span className="px-3 py-1 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full transition-colors duration-300">
                        {post.status}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
