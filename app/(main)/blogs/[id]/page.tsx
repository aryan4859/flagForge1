'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/loading';

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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post data
  useEffect(() => {
    if (!params?.id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.id]);

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTextStyles = (annotations?: RichText['annotations']) => {
    if (!annotations) return '';
    
    const styles = [
      annotations.bold && 'font-bold',
      annotations.italic && 'italic',
      annotations.strikethrough && 'line-through',
      annotations.underline && 'underline',
      annotations.color === 'red' && 'text-red-600',
      annotations.color === 'blue' && 'text-blue-600',
      annotations.color === 'green' && 'text-green-600',
    ].filter(Boolean).join(' ');
    
    return styles;
  };

  const renderRichText = (richText: RichText[]) => {
    if (!richText?.length) return '';
    
    return richText.map((text, index) => (
      <span key={index} className={getTextStyles(text.annotations)}>
        {text.plain_text}
      </span>
    ));
  };

  const renderInlineFormatting = (text: string) => {
    // Handle bold text (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold">{part}</strong>;
      }
      
      // Handle italic text (*text*)
      const italicRegex = /\*(.*?)\*/g;
      const italicParts = part.split(italicRegex);
      
      return italicParts.map((italicPart, italicIndex) => {
        if (italicIndex % 2 === 1) {
          return <em key={`${index}-${italicIndex}`} className="italic">{italicPart}</em>;
        }
        return italicPart;
      });
    });
  };

  // Content rendering functions
  const renderBlock = (block: Block) => {
    const { type, id } = block;
    const value = block[type];
    if (!value) return null;

    const blockComponents = {
      paragraph: (
        <p className="mb-6 text-gray-800 leading-relaxed text-lg">
          {renderRichText(value.rich_text || [])}
        </p>
      ),
      heading_1: (
        <h1 className="text-4xl font-extrabold text-black mb-6 mt-12 first:mt-0">
          {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
        </h1>
      ),
      heading_2: (
        <h2 className="text-3xl font-extrabold text-black mb-5 mt-10">
          {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
        </h2>
      ),
      heading_3: (
        <h3 className="text-2xl font-extrabold text-black mb-4 mt-8">
          {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
        </h3>
      ),
      bulleted_list_item: (
        <li className="mb-2 text-gray-800 text-lg leading-relaxed">
          {renderRichText(value.rich_text || [])}
        </li>
      ),
      numbered_list_item: (
        <li className="mb-2 text-gray-800 text-lg leading-relaxed">
          {renderRichText(value.rich_text || [])}
        </li>
      ),
      code: (
        <pre className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto border">
          <code className="text-sm text-gray-800 font-mono">
            {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
          </code>
        </pre>
      ),
      quote: (
        <blockquote className="border-l-4 border-red-500 pl-6 my-8 italic text-gray-700 text-lg bg-gray-50 py-4 rounded-r-lg">
          {renderRichText(value.rich_text || [])}
        </blockquote>
      ),
      divider: <hr className="my-12 border-gray-300" />,
      image: (
        <div className="my-8">
          {(value.external?.url || value.file?.url) && (
            <Image
              src={value.external?.url || value.file?.url}
              alt={value.caption?.[0]?.plain_text || 'Blog image'}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto shadow-lg"
            />
          )}
          {value.caption?.length > 0 && (
            <p className="text-sm text-gray-600 mt-3 text-center italic">
              {value.caption[0].plain_text}
            </p>
          )}
        </div>
      ),
    };

    return <div key={id}>{blockComponents[type as keyof typeof blockComponents] || null}</div>;
  };

  const renderStringContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n').filter(line => line.trim());
    const elements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];
    let listType: 'bullet' | 'numbered' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === 'numbered' ? 'ol' : 'ul';
        const listClasses = listType === 'numbered' 
          ? "list-decimal list-inside mb-6 space-y-2 pl-4" 
          : "list-disc list-inside mb-6 space-y-2 pl-4";
        
        elements.push(
          <ListTag key={`list-${elements.length}`} className={listClasses}>
            {currentList}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Bold sub-headings (**🔹 Text**)
      if (trimmed.match(/^\*\*[🔹]?\s*.+\*\*$/)) {
        flushList();
        const headerText = trimmed.slice(2, -2);
        elements.push(
          <h3 key={i} className="text-2xl font-extrabold text-black mb-4 mt-8 first:mt-0">
            {headerText}
          </h3>
        );
        return;
      }

      // Regular bold text (**text** not at start/end)
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        flushList();
        const headerText = trimmed.slice(2, -2);
        elements.push(
          <h2 key={i} className="text-3xl font-extrabold text-black mb-6 mt-10 first:mt-0">
            {headerText}
          </h2>
        );
        return;
      }

      // Bullet points (• text)
      if (trimmed.startsWith('•')) {
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        currentList.push(
          <li key={i} className="text-gray-800 text-lg leading-relaxed">
            {renderInlineFormatting(trimmed.slice(1).trim())}
          </li>
        );
        return;
      }

      // Numbered lists (1. text)
      if (/^\d+\./.test(trimmed)) {
        if (listType !== 'numbered') {
          flushList();
          listType = 'numbered';
        }
        currentList.push(
          <li key={i} className="text-gray-800 text-lg leading-relaxed">
            {renderInlineFormatting(trimmed.replace(/^\d+\.\s*/, ''))}
          </li>
        );
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={i} className="mb-6 text-gray-800 leading-relaxed text-lg">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });

    // Flush any remaining list
    flushList();
    
    return elements;
  };

  const groupListItems = (blocks: Block[]) => {
    const result: (Block | { type: 'list_group'; listType: string; items: Block[]; id: string })[] = [];
    let i = 0;

    while (i < blocks.length) {
      const block = blocks[i];
      
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        const listType = block.type;
        const listItems: Block[] = [];
        
        while (i < blocks.length && blocks[i].type === listType) {
          listItems.push(blocks[i]);
          i++;
        }
        
        result.push({
          type: 'list_group',
          listType,
          items: listItems,
          id: `list_${listItems[0].id}`
        });
      } else {
        result.push(block);
        i++;
      }
    }

    return result;
  };

  const renderContent = () => {
    // Render Notion blocks if available
    if (post?.blocks?.length) {
      const groupedBlocks = groupListItems(post.blocks);
      
      return groupedBlocks.map((item) => {
        if (item.type === 'list_group') {
          const ListTag = item.listType === 'numbered_list_item' ? 'ol' : 'ul';
          const listClasses = item.listType === 'numbered_list_item' 
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
    
    // Fallback to string content
    return post?.content ? renderStringContent(post.content) : (
      <p className="italic text-gray-600">No content available</p>
    );
  };

  // Loading state
  if (loading) return <Loading />;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => router.push('/blogs')} 
            className="text-red-600 underline hover:text-red-800 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Post not found.</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/blogs" className="inline-flex items-center text-red-600 mb-8 hover:text-red-800 transition-colors">
          ← Back to blogs
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm mb-8">
            <time className="text-red-600 font-medium">
              {formatDate(post.created)}
            </time>
            {post.updated !== post.created && (
              <span className="text-gray-600">
                Updated: {formatDate(post.updated)}
              </span>
            )}
          </div>

          {/* Thumbnail - only shown once after date */}
          {post.thumbnail && (
            <div className="mb-8">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-lg w-full h-auto shadow-lg"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-6 text-xl text-gray-700 leading-relaxed font-light">
              {post.excerpt}
            </p>
          )}
        </header>



        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          {renderContent()}
        </article>

        {/* Image from ImageURL at the end */}
        {post.image && (
          <div className="mt-12">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}