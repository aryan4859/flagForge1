"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";

interface InstaPost {
    id: string;
    link: string;
    imgUrl: string;
    caption: string;
    timestamp: string;
}

export default function InstagramFeed() {
    const [posts, setPosts] = useState<InstaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [fallbackImages, setFallbackImages] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/instagram");
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch instagram posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-white/5 rounded-3xl" />
                ))}
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-xl text-white shadow-lg shadow-pink-500/20">
                        <Instagram className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                            Latest from Instagram
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Follow @flag.forge for security tips and updates
                        </p>
                    </div>
                </div>
                <Link
                    href="https://www.instagram.com/flag.forge/"
                    target="_blank"
                    className="group flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                >
                    View Profile
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => {
                    const fallbackSrc =
                        fallbackImages[post.id] ??
                        post.imgUrl;
                    const proxySrc = `/api/instagram/image?src=${encodeURIComponent(post.imgUrl)}`;

                    return (
                        <Link
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            className="group relative aspect-square overflow-hidden rounded-[2rem] bg-gray-100 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <Image
                                src={fallbackSrc}
                                alt={post.caption}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized // Instagram URLs can be tricky with Next.js Image optimization sometimes
                                onError={() => {
                                    setFallbackImages((prev) => {
                                        if (prev[post.id]) return prev;
                                        return { ...prev, [post.id]: proxySrc };
                                    });
                                }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Heart className="h-6 w-6 fill-white" />
                                    <span>Like</span>
                                </div>
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <MessageCircle className="h-6 w-6 fill-white" />
                                    <span>Comment</span>
                                </div>
                            </div>

                            {/* Caption Gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex items-end">
                                <p className="text-white text-xs line-clamp-2 font-medium">
                                    {post.caption}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
