import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
export const runtime = "nodejs";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise
    const { id } = await params;
    const pageId = id;

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

    // Get block content (preferred) or fall back to Content property
    const extractedContent = extractContentText(blocks.results);
    const fallbackContent = properties.Content?.rich_text
      ?.map((t: any) => t.plain_text)
      .join('') || '';

    const post = {
      id: pageData.id,
      title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
      thumbnail: properties.Thumbnail,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || pageData.id,
      excerpt: extractExcerpt(blocks.results) || fallbackContent.substring(0, 150),
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      status: properties.Status?.select?.name || 'Published',
      created: properties['Publish Date']?.date?.start || pageData.created_time,
      updated: pageData.last_edited_time,
      content: extractedContent || fallbackContent || "No Content",
      cover: properties['Files & media']?.files?.[0]?.external?.url ||
             properties['Files & media']?.files?.[0]?.file?.url ||
             pageData.cover?.external?.url ||
             pageData.cover?.file?.url ||
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