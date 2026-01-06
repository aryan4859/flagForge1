import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
export const runtime = "nodejs";

export async function GET() {
  try {
    // Check environment variables
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey) {
      console.error('NOTION_API_KEY is not set');
      return NextResponse.json(
        { error: 'NOTION_API_KEY is not configured' },
        { status: 500 }
      );
    }

    if (!databaseId) {
      console.error('NOTION_DATABASE_ID is not set');
      return NextResponse.json(
        { error: 'NOTION_DATABASE_ID is not configured' },
        { status: 500 }
      );
    }

    const notion = new Client({
      auth: apiKey,
    });

    // First, let's get the database to check its structure
    let database;
    try {
      database = await notion.databases.retrieve({ database_id: databaseId });
      console.log('Database properties:', Object.keys(database.properties));
    } catch (dbError) {
      console.error('Database access error:', dbError);
      return NextResponse.json(
        { error: 'Cannot access Notion database. Check your database ID and permissions.' },
        { status: 500 }
      );
    }

    // Query the database with minimal sorting to avoid property issues
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(`Found ${response.results.length} pages`);

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

    const getExcerpt = (property: any) => {
      const richText = property?.rich_text;
      if (!Array.isArray(richText) || richText.length === 0) return "";
      const text = richText.map((item: any) => item.plain_text).join("");
      return text.length > 150 ? `${text.substring(0, 150)}...` : text;
    };
 
    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      console.log('Available properties:', Object.keys(properties));
      const thumbnailUrl = getImageUrl(properties.Thumbnail);
      const contentExcerpt = getExcerpt(properties.Content);
      const slugValue =
        properties.Slug?.rich_text?.[0]?.plain_text || page.id;

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
        thumbnail: thumbnailUrl,
        slug: slugValue,
        excerpt: contentExcerpt,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        status: properties.Status?.select?.name || 'Published',
        created:
          properties['Publish Date']?.date?.start ||
          properties['Published Date']?.date?.start ||
          page.created_time,
        updated: page.last_edited_time,
        cover: properties['File and Media']?.files?.[0]?.external?.url || 
               properties['File and Media']?.files?.[0]?.file?.url ||
               page.cover?.external?.url || 
               page.cover?.file?.url || 
               null,
      };
    });

    // Filter only published posts (but if no Status field, show all)
    const publishedPosts = posts.filter((post) => 
      post.status === 'Published' || post.status === 'published' || !database.properties.Status
    );

    console.log(`Returning ${publishedPosts.length} published posts`);

    return NextResponse.json({ posts: publishedPosts });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch blogs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
