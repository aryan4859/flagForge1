import { Metadata } from "next";

// We'll use the API URL but we need to be careful with the environment
// In local dev, it should be localhost, in prod it should be the site URL.
// Ideally, we'd use an environment variable.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://flagforge.xyz";

async function getPost(id: string) {
    try {
        // In server components, fetch needs an absolute URL
        // We try to catch errors if the server is not reachable
        const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
            next: { revalidate: 3600 },
            cache: 'no-store' // Ensure we don't get stale metadata if env variables change
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.post;
    } catch (error) {
        console.error("Error fetching post for metadata layout:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return {
            title: "Blog Post | FlagForge",
        };
    }

    const imageUrl = post.cover || post.thumbnail || post.image || "https://flagforge.xyz/flagforge-logo.png";

    return {
        title: `${post.title} | FlagForge Blog`,
        description: post.excerpt || `Read ${post.title} on FlagForge.`,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [imageUrl],
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
            images: [imageUrl],
        },
    };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
