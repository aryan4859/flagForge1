"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import Loading from "@/components/loading";
import JsonLd from "@/components/JsonLd";

// Types
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    status: string;
    content: string;
    created: string;
    updated: string;
    image?: string | null;
    thumbnail: string | null;
    cover: string | null;
    blocks: Block[];
}

interface RichText {
    plain_text: string;
    annotations?: {
        bold?: boolean;
        italic?: boolean;
        strikethrough?: boolean;
        underline?: boolean;
        color?: string;
    };
}

interface Block {
    id: string;
    type: string;
    [key: string]: any;
}

export default function BlogClient({ id }: { id: string }) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/blogs/${id}`);
                if (!response.ok) throw new Error("Failed to fetch post");
                const data = await response.json();
                setPost(data.post);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getTextStyles = (annotations?: RichText["annotations"]) => {
        if (!annotations) return "";
        const styles = [
            annotations.bold && "font-bold",
            annotations.italic && "italic",
            annotations.strikethrough && "line-through",
            annotations.underline && "underline",
            annotations.color === "red" && "text-red-600 dark:text-red-500",
            annotations.color === "blue" && "text-blue-600 dark:text-blue-400",
            annotations.color === "green" && "text-green-600 dark:text-green-400",
        ].filter(Boolean).join(" ");
        return styles;
    };

    const renderRichText = (richText: RichText[]) => {
        if (!richText?.length) return "";
        return richText.map((text, index) => (
            <span key={index} className={getTextStyles(text.annotations)}>
                {text.plain_text}
            </span>
        ));
    };

    const renderBlock = (block: Block) => {
        const { type, id } = block;
        const value = block[type];
        if (!value) return null;

        const blockComponents = {
            paragraph: (
                <p className="mb-6 text-gray-800 dark:text-gray-300 leading-relaxed text-lg transition-colors duration-300">
                    {renderRichText(value.rich_text || [])}
                </p>
            ),
            heading_1: (
                <h1 className="text-4xl font-extrabold text-black dark:text-white mb-6 mt-12 first:mt-0 transition-colors duration-300">
                    {value.rich_text?.map((text: RichText) => text.plain_text).join("") || ""}
                </h1>
            ),
            heading_2: (
                <h2 className="text-3xl font-extrabold text-black dark:text-white mb-5 mt-10 transition-colors duration-300">
                    {value.rich_text?.map((text: RichText) => text.plain_text).join("") || ""}
                </h2>
            ),
            heading_3: (
                <h3 className="text-2xl font-extrabold text-black dark:text-white mb-4 mt-8 transition-colors duration-300">
                    {value.rich_text?.map((text: RichText) => text.plain_text).join("") || ""}
                </h3>
            ),
            bulleted_list_item: (
                <li className="mb-2 text-gray-800 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
                    {renderRichText(value.rich_text || [])}
                </li>
            ),
            numbered_list_item: (
                <li className="mb-2 text-gray-800 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
                    {renderRichText(value.rich_text || [])}
                </li>
            ),
            code: (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <code className="text-sm text-gray-800 dark:text-gray-300 font-mono transition-colors duration-300">
                        {value.rich_text?.map((text: RichText) => text.plain_text).join("") || ""}
                    </code>
                </pre>
            ),
            quote: (
                <blockquote className="border-l-4 border-red-500 dark:border-red-500 pl-6 my-8 italic text-gray-700 dark:text-gray-400 text-lg bg-gray-50 dark:bg-gray-800/50 py-4 rounded-r-lg transition-colors duration-300">
                    {renderRichText(value.rich_text || [])}
                </blockquote>
            ),
            divider: (
                <hr className="my-12 border-gray-300 dark:border-gray-700 transition-colors duration-300" />
            ),
            image: (
                <div className="my-8">
                    {(value.external?.url || value.file?.url) && (
                        <Image
                            src={value.external?.url || value.file?.url}
                            alt={value.caption?.[0]?.plain_text || "Blog image"}
                            width={800}
                            height={400}
                            className="rounded-lg w-full h-auto shadow-lg"
                        />
                    )}
                    {value.caption?.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center italic transition-colors duration-300">
                            {value.caption[0].plain_text}
                        </p>
                    )}
                </div>
            ),
        };

        return (
            <div key={id}>
                {blockComponents[type as keyof typeof blockComponents] || null}
            </div>
        );
    };

    const renderMarkdownContent = (content: string) => {
        if (!content) return null;
        const maxLength = 100000;
        const sanitizedContent = content.length > maxLength
            ? content.substring(0, maxLength) + '\n\n*[Content truncated for security]*'
            : content;

        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-4xl font-extrabold text-black dark:text-white mb-6 mt-12 first:mt-0 transition-colors duration-300">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-3xl font-extrabold text-black dark:text-white mb-5 mt-10 transition-colors duration-300">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-2xl font-extrabold text-black dark:text-white mb-4 mt-8 transition-colors duration-300">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="mb-6 text-gray-800 dark:text-gray-300 leading-relaxed text-lg transition-colors duration-300">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-6 space-y-2 pl-4">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-6 space-y-2 pl-4">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-gray-800 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
                            {children}
                        </li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-red-500 dark:border-red-500 pl-6 my-8 italic text-gray-700 dark:text-gray-400 text-lg bg-gray-50 dark:bg-gray-800/50 py-4 rounded-r-lg transition-colors duration-300">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className }) => {
                        const isInline = !className || !className.startsWith('language-');
                        return isInline ? (
                            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-300">
                                {children}
                            </code>
                        ) : (
                            <code className={`block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300 text-sm font-mono text-gray-800 dark:text-gray-300 ${className}`}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 overflow-x-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                            {children}
                        </pre>
                    ),
                    hr: () => (
                        <hr className="my-12 border-gray-300 dark:border-gray-700 transition-colors duration-300" />
                    ),
                    img: ({ src, alt }) => (
                        <div className="my-8">
                            <Image
                                src={src || ""}
                                alt={alt || "Blog image"}
                                width={800}
                                height={400}
                                className="rounded-lg w-full h-auto shadow-lg"
                            />
                        </div>
                    ),
                }}
            >
                {sanitizedContent}
            </ReactMarkdown>
        );
    };

    const groupListItems = (blocks: Block[]) => {
        const result: (Block | { type: "list_group"; listType: string; items: Block[]; id: string })[] = [];
        let i = 0;
        while (i < blocks.length) {
            const block = blocks[i];
            if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
                const listType = block.type;
                const listItems: Block[] = [];
                while (i < blocks.length && blocks[i].type === listType) {
                    listItems.push(blocks[i]);
                    i++;
                }
                result.push({
                    type: "list_group",
                    listType,
                    items: listItems,
                    id: `list_${listItems[0].id}`,
                });
            } else {
                result.push(block);
                i++;
            }
        }
        return result;
    };

    const renderContent = () => {
        if (post?.blocks?.length) {
            const groupedBlocks = groupListItems(post.blocks);
            return groupedBlocks.map((item) => {
                if (item.type === "list_group") {
                    const ListTag = item.listType === "numbered_list_item" ? "ol" : "ul";
                    const listClasses = item.listType === "numbered_list_item"
                        ? "list-decimal list-inside mb-6 space-y-2 pl-4"
                        : "list-disc list-inside mb-6 space-y-2 pl-4";
                    return (
                        <ListTag key={item.id} className={listClasses}>
                            {item.items.map(renderBlock)}
                        </ListTag>
                    );
                }
                return renderBlock(item as Block);
            });
        }
        return post?.content ? renderMarkdownContent(post.content) : (
            <p className="italic text-gray-600 dark:text-gray-400 transition-colors duration-300">
                No content available
            </p>
        );
    };

    if (loading) return <Loading />;
    if (error || !post) return null; // Error/NotFound handled by parent

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href="/blogs"
                    className="inline-flex items-center text-red-600 dark:text-red-500 mb-8 hover:text-red-800 dark:hover:text-red-600 transition-colors duration-300"
                >
                    ← Back to blogs
                </Link>

                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: post.title,
                        description: post.excerpt,
                        image: post.cover || post.thumbnail || post.image || "https://flagforge.xyz/flagforge-logo.png",
                        datePublished: post.created,
                        dateModified: post.updated,
                        author: {
                            "@type": "Organization",
                            name: "FlagForge",
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "FlagForge",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://flagforge.xyz/flagforge-logo.png",
                            },
                        },
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://flagforge.xyz/blogs/${post.id}`,
                        },
                        keywords: post.tags.join(", "),
                    }}
                />

                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-black dark:text-white mb-6 leading-tight transition-colors duration-300">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm mb-8">
                        <time className="text-red-600 dark:text-red-500 font-medium transition-colors duration-300">
                            {formatDate(post.created)}
                        </time>
                        {post.updated !== post.created && (
                            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                Updated: {formatDate(post.updated)}
                            </span>
                        )}
                    </div>
                    {post.thumbnail && (
                        <div className="mb-8">
                            <Image src={post.thumbnail} alt={post.title} width={800} height={400} className="rounded-lg w-full h-auto shadow-lg" />
                        </div>
                    )}
                    {post.excerpt && (
                        <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light transition-colors duration-300">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {post.tags?.length > 0 && (
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500 rounded-full text-sm font-medium transition-colors duration-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <article className="prose prose-lg max-w-none dark:prose-invert">
                    {renderContent()}
                </article>

                {post.image && (
                    <div className="mt-12">
                        <Image src={post.image} alt={post.title} width={800} height={400} className="rounded-lg w-full h-auto shadow-lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
