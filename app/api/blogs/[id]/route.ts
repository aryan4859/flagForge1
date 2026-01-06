import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
export const runtime = "nodejs";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const isLikelyPageId = (value: string) => {
  const normalized = value.replace(/-/g, "");
  return /^[0-9a-f]{32}$/i.test(normalized);
};

const resolvePageId = async (slug: string, databaseId: string) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
      page_size: 1,
    });
    const page = response.results[0];
    if (page) {
      return page.id;
    }
  } catch (error) {
    console.warn("Failed to query Notion slug:", error);
  }

  if (isLikelyPageId(slug)) {
    return slug;
  }

  return null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise
    const { id } = await params;
    if (!process.env.NOTION_API_KEY) {
      return NextResponse.json(
        { error: "NOTION_API_KEY is not configured" },
        { status: 500 }
      );
    }
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: "NOTION_DATABASE_ID is not configured" },
        { status: 500 }
      );
    }

    const slug = decodeURIComponent(id);
    const pageId = await resolvePageId(slug, databaseId);
    if (!pageId) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Get page properties
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // Get page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    const pageData = page as any;
    const properties = pageData.properties;

    // Extract excerpt from first paragraph block
    const extractExcerpt = (blocks: any[]) => {
      const firstParagraph = blocks.find(block => block.type === 'paragraph');
      if (firstParagraph?.paragraph?.rich_text?.length > 0) {
        const text = firstParagraph.paragraph.rich_text
          .map((item: any) => item.plain_text)
          .join('');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
      }
      return '';
    };

    // Extract plain text content from blocks for search/preview purposes
    const extractContentText = (blocks: any[]) => {
      return blocks
        .filter(block => ['paragraph', 'heading_1', 'heading_2', 'heading_3'].includes(block.type))
        .map(block => {
          const blockType = block.type;
          const richText = block[blockType]?.rich_text || [];
          return richText.map((item: any) => item.plain_text).join('');
        })
        .filter(text => text.trim().length > 0)
        .join('\n\n');
    };

    // Helper function to extract image/file URL from Notion property
    const getImageUrl = (property: any) => {
      if (!property) return null;
      
      // Handle different Notion file property formats
      if (property.files && property.files.length > 0) {
        const file = property.files[0];
        return file.external?.url || file.file?.url || null;
      }
      
      // Handle direct URL properties
      if (property.url) {
        return property.url;
      }
      
      // Handle rich text with URLs
      if (property.rich_text && property.rich_text.length > 0) {
        return property.rich_text[0].href || property.rich_text[0].plain_text;
      }
      
      return null;
    };

    // Get block content (preferred) or fall back to Content property
    const extractedContent = extractContentText(blocks.results);
    const fallbackContent = properties.Content?.rich_text
      ?.map((t: any) => t.plain_text)
      .join('') || '';

    // Extract thumbnail URL
    const thumbnailUrl = getImageUrl(properties.Thumbnail);
    
    // Extract image URL (separate from thumbnail)
    const imageUrl = getImageUrl(properties.Images);

    const post = {
      id: pageData.id,
      title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
      thumbnail: thumbnailUrl,
      image: imageUrl,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || slug || pageData.id,
      excerpt: extractExcerpt(blocks.results) || fallbackContent.substring(0, 150),
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      status: properties.Status?.select?.name || 'Published',
      created:
        properties['Publish Date']?.date?.start ||
        properties['Published Date']?.date?.start ||
        pageData.created_time,
      updated: pageData.last_edited_time,
      content: extractedContent || fallbackContent || "No Content",
      cover: properties['Files & media']?.files?.[0]?.external?.url ||
             properties['Files & media']?.files?.[0]?.file?.url ||
             properties['File and Media']?.files?.[0]?.external?.url ||
             properties['File and Media']?.files?.[0]?.file?.url ||
             pageData.cover?.external?.url ||
             pageData.cover?.file?.url ||
             thumbnailUrl || 
             imageUrl ||
             null,
      blocks: blocks.results,
    };

    return NextResponse.json({ post });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
