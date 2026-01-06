import type { Metadata } from "next";
import { cache } from "react";
import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import JsonLd from "@/components/JsonLd";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 300;
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

type NotionBlock = BlockObjectResponse;
type NotionRichText = { plain_text: string };

const isNotionBlock = (
  block: BlockObjectResponse | PartialBlockObjectResponse
): block is BlockObjectResponse => "type" in block;

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
  blocks: NotionBlock[];
}

const getImageUrl = (property: any) => {
  if (!property) return null;

  if (property.files && property.files.length > 0) {
    const file = property.files[0];
    return file.external?.url || file.file?.url || null;
  }

  if (property.url) {
    return property.url;
  }

  if (property.rich_text && property.rich_text.length > 0) {
    return property.rich_text[0].href || property.rich_text[0].plain_text;
  }

  return null;
};

const extractExcerpt = (blocks: NotionBlock[]) => {
  const firstParagraph = blocks.find((block) => block.type === "paragraph");
  const richText = firstParagraph?.paragraph?.rich_text;
  if (Array.isArray(richText) && richText.length > 0) {
    const text = richText
      .map((item: NotionRichText) => item.plain_text)
      .join("");
    return text.length > 150 ? `${text.substring(0, 150)}...` : text;
  }
  return "";
};

const getTextRichText = (block: NotionBlock): NotionRichText[] => {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.rich_text;
    case "heading_1":
      return block.heading_1.rich_text;
    case "heading_2":
      return block.heading_2.rich_text;
    case "heading_3":
      return block.heading_3.rich_text;
    default:
      return [];
  }
};

const extractContentText = (blocks: NotionBlock[]) => {
  return blocks
    .map((block) => {
      const richText = getTextRichText(block);
      return richText.map((item) => item.plain_text).join("");
    })
    .filter((text) => text.trim().length > 0)
    .join("\n\n");
};

const normalizeDescription = (text: string) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "FlagForge blog post on CTF challenges and cybersecurity.";
  }
  return normalized.length > 155
    ? `${normalized.slice(0, 152).trim()}...`
    : normalized;
};

const fetchBlogPost = cache(async (id: string): Promise<BlogPost | null> => {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!apiKey || !databaseId) return null;

  try {
    const slug = decodeURIComponent(id);
    const pageId = await resolvePageId(slug, databaseId);
    if (!pageId) return null;

    const page = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    const pageData = page as any;
    const properties = pageData.properties || {};
    const blockResults: NotionBlock[] = Array.isArray(blocks.results)
      ? blocks.results.filter(isNotionBlock)
      : [];

    const fallbackContent = properties.Content?.rich_text
      ?.map((t: any) => t.plain_text)
      .join("") || "";

    const extractedContent = extractContentText(blockResults);
    const thumbnailUrl = getImageUrl(properties.Thumbnail);
    const imageUrl = getImageUrl(properties.Images);
    const coverUrl =
      properties["Files & media"]?.files?.[0]?.external?.url ||
      properties["Files & media"]?.files?.[0]?.file?.url ||
      properties["File and Media"]?.files?.[0]?.external?.url ||
      properties["File and Media"]?.files?.[0]?.file?.url ||
      pageData.cover?.external?.url ||
      pageData.cover?.file?.url ||
      thumbnailUrl ||
      imageUrl ||
      null;

    const createdDate =
      properties["Publish Date"]?.date?.start ||
      properties["Published Date"]?.date?.start ||
      pageData.created_time;

    const post: BlogPost = {
      id: pageData.id,
      title: properties.Title?.title?.[0]?.plain_text || "Untitled",
      thumbnail: thumbnailUrl,
      image: imageUrl,
      slug: properties.Slug?.rich_text?.[0]?.plain_text || slug || pageData.id,
      excerpt: extractExcerpt(blockResults) || fallbackContent.substring(0, 150),
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      status: properties.Status?.select?.name || "Published",
      created: createdDate,
      updated: pageData.last_edited_time,
      content: extractedContent || fallbackContent || "No Content",
      cover: coverUrl,
      blocks: blockResults,
    };

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchBlogPost(id);
  if (!post) {
    return {
      title: "Blog Post | FlagForge",
      description: "FlagForge blog post on CTF challenges and cybersecurity.",
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const description = normalizeDescription(post.excerpt || post.content);
  const imageUrl = post.cover || post.thumbnail || post.image || null;
  const keywords = post.tags?.length ? post.tags.slice(0, 10) : undefined;
  const canonicalSlug = post.slug || id;

  return {
    title: post.title,
    description,
    keywords,
    alternates: {
      canonical: `/blogs/${canonicalSlug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blogs/${canonicalSlug}`,
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchBlogPost(id);
  const postSlug = post?.slug || id;
  const seoImage =
    post?.cover || post?.thumbnail || post?.image || "https://flagforge.xyz/flagforge-logo.png";
  const wordCount = post?.content
    ? post.content.split(/\s+/).filter(Boolean).length
    : undefined;

  return (
    <>
      {post && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image: [seoImage],
              datePublished: post.created,
              dateModified: post.updated,
              inLanguage: "en-US",
              wordCount,
              isAccessibleForFree: true,
              articleSection: post.tags,
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
                "@id": `https://flagforge.xyz/blogs/${postSlug}`,
              },
              keywords: post.tags?.join(", ") || "",
              isPartOf: {
                "@type": "Blog",
                name: "FlagForge Blog",
                url: "https://flagforge.xyz/blogs",
              },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://flagforge.xyz/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blogs",
                  item: "https://flagforge.xyz/blogs",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: `https://flagforge.xyz/blogs/${postSlug}`,
                },
              ],
            }}
          />
        </>
      )}
      <BlogPostClient postId={id} initialPost={post} />
    </>
  );
}
