'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
  cover: string | null;
  blocks: any[];
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

interface ListGroup {
  type: 'list_group';
  listType: string;
  items: Block[];
  id: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTextStyles = (annotations: RichText['annotations']) => {
    let styles = '';
    if (annotations?.bold) styles += ' font-bold';
    if (annotations?.italic) styles += ' italic';
    if (annotations?.strikethrough) styles += ' line-through';
    if (annotations?.underline) styles += ' underline';
    if (annotations?.color && annotations.color !== 'default') {
      if (annotations.color === 'red') styles += ' text-red-600';
      else if (annotations.color === 'blue') styles += ' text-blue-600';
      else if (annotations.color === 'green') styles += ' text-green-600';
    }
    return styles;
  };

  const renderRichText = (richText: RichText[]) => {
    if (!richText || !Array.isArray(richText)) return '';
    
    return richText.map((text: RichText, index: number) => (
      <span key={index} className={getTextStyles(text.annotations)}>
        {text.plain_text}
      </span>
    ));
  };

  const renderBlock = (block: Block) => {
    const { type, id } = block;
    const value = block[type];
    if (!value) return null;

    switch (type) {
      case 'paragraph':
        return (
          <p key={id} className="mb-6 text-gray-800 leading-relaxed text-lg">
            {renderRichText(value.rich_text || [])}
          </p>
        );
      
      case 'heading_1':
        return (
          <h1 key={id} className="text-4xl font-bold text-black mb-6 mt-12 first:mt-0">
            {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
          </h1>
        );
      
      case 'heading_2':
        return (
          <h2 key={id} className="text-3xl font-bold text-black mb-5 mt-10">
            {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
          </h2>
        );
      
      case 'heading_3':
        return (
          <h3 key={id} className="text-2xl font-semibold text-black mb-4 mt-8">
            {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
          </h3>
        );
      
      case 'bulleted_list_item':
        return (
          <li key={id} className="mb-2 text-gray-800 text-lg leading-relaxed">
            {renderRichText(value.rich_text || [])}
          </li>
        );
      
      case 'numbered_list_item':
        return (
          <li key={id} className="mb-2 text-gray-800 text-lg leading-relaxed">
            {renderRichText(value.rich_text || [])}
          </li>
        );
      
      case 'code':
        return (
          <pre key={id} className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto border">
            <code className="text-sm text-gray-800 font-mono">
              {value.rich_text?.map((text: RichText) => text.plain_text).join('') || ''}
            </code>
          </pre>
        );
      
      case 'quote':
        return (
          <blockquote key={id} className="border-l-4 border-red-500 pl-6 my-8 italic text-gray-700 text-lg bg-gray-50 py-4 rounded-r-lg">
            {renderRichText(value.rich_text || [])}
          </blockquote>
        );
      
      case 'divider':
        return <hr key={id} className="my-12 border-gray-300" />;
      
      case 'image':
        const src = value.external?.url || value.file?.url;
        return (
          <div key={id} className="my-8">
            {src && (
              <Image
                src={src}
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
        );
      
      default:
        console.log('Unhandled block type:', type, block);
        return null;
    }
  };

  const groupConsecutiveListItems = (blocks: Block[]): (Block | ListGroup)[] => {
    const result: (Block | ListGroup)[] = [];
    let i = 0;

    while (i < blocks.length) {
      const block = blocks[i];
      
      if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
        const listType = block.type;
        const listItems: Block[] = [];
        
        // Collect consecutive list items of the same type
        while (i < blocks.length && blocks[i].type === listType) {
          listItems.push(blocks[i]);
          i++;
        }
        
        // Create a list group
        result.push({
          type: 'list_group',
          listType: listType,
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
    if (!post?.blocks || post.blocks.length === 0) {
      return <p className="italic text-gray-600">{post?.content || 'No content available'}</p>;
    }

    const groupedBlocks = groupConsecutiveListItems(post.blocks);
    
    return groupedBlocks.map((item, index) => {
      if (item.type === 'list_group') {
        const listGroup = item as ListGroup;
        const ListTag = listGroup.listType === 'numbered_list_item' ? 'ol' : 'ul';
        const listClasses = listGroup.listType === 'numbered_list_item' 
          ? "list-decimal list-inside mb-6 space-y-2 pl-4" 
          : "list-disc list-inside mb-6 space-y-2 pl-4";
        
        return (
          <ListTag key={listGroup.id} className={listClasses}>
            {listGroup.items.map((listItem: Block) => renderBlock(listItem))}
          </ListTag>
        );
      }
      
      return renderBlock(item as Block);
    });
  };

  // --- Render States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

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

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Post not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/blogs" className="inline-flex items-center text-red-600 mb-8 hover:text-red-800 transition-colors">
          ← Back to blogs
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <time className="text-red-600 font-medium">{formatDate(post.created)}</time>
            {post.updated !== post.created && (
              <span className="text-gray-600">
                Updated: {formatDate(post.updated)}
              </span>
            )}
          </div>
          {post.excerpt && (
            <p className="mt-6 text-xl text-gray-700 leading-relaxed font-light">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.cover && (
          <div className="mb-12">
            <Image
              src={post.cover}
              alt={post.title}
              width={800}
              height={400}
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {renderContent()}
        </article>
      </div>
    </div>
  );
}