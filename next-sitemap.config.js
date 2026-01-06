/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const mongoose = require('mongoose');

const APP_DIR = path.join(process.cwd(), 'app');
const PAGE_FILE_REGEX = /^page\.[jt]sx?$/;

const isRouteGroup = (segment) => segment.startsWith('(') && segment.endsWith(')');
const isDynamicSegment = (segment) => segment.startsWith('[') && segment.endsWith(']');

const collectPageFiles = (dir, results = []) => {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPageFiles(fullPath, results);
      continue;
    }

    if (PAGE_FILE_REGEX.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
};

const buildRouteLastmod = () => {
  const routeLastmod = new Map();
  const pageFiles = collectPageFiles(APP_DIR);

  for (const filePath of pageFiles) {
    const relativePath = path.relative(APP_DIR, filePath);
    const dirName = path.dirname(relativePath);
    const segments = dirName === '.' ? [] : dirName.split(path.sep);
    const routeSegments = segments.filter((segment) => !isRouteGroup(segment));

    if (routeSegments.some(isDynamicSegment)) {
      continue;
    }

    const routePath = `/${routeSegments.join('/')}`;
    const stats = fs.statSync(filePath);
    routeLastmod.set(routePath === '/' ? '/' : routePath, stats.mtime.toISOString());
  }

  return routeLastmod;
};

const routeLastmod = buildRouteLastmod();

const SITEMAP_EXCLUDE = [
  '/roles/developers/*',
  '/roles/developers',
  '/resources/*',
  '/resources',
  '/profile',
  '/problems',
  '/leaderboard',
  '/home',
  '/unauthorized',
];

const fetchBlogEntries = async () => {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.warn('Notion env vars missing, skipping blog sitemap entries.');
    return [];
  }

  try {
    const notion = new Client({ auth: apiKey });
    const response = await notion.databases.query({ database_id: databaseId });

    return response.results
      .map((page) => {
        const properties = page.properties ?? {};
        const status = properties.Status?.select?.name;
        const publishedDate =
          properties['Publish Date']?.date?.start ||
          properties['Published Date']?.date?.start;
        const slug =
          properties.Slug?.rich_text?.[0]?.plain_text?.trim() || page.id;

        return {
          id: page.id,
          slug,
          status,
          lastmod: page.last_edited_time || publishedDate || page.created_time,
        };
      })
      .filter((post) => {
        if (!post.status) return true;
        return post.status.toLowerCase() === 'published';
      })
      .map((post) => ({
        loc: `/blogs/${encodeURIComponent(post.slug)}`,
        lastmod: post.lastmod,
        changefreq: 'monthly',
        priority: 0.6,
      }));
  } catch (error) {
    console.warn('Failed to fetch Notion blog posts for sitemap.', error);
    return [];
  }
};

const fetchPublicUserEntries = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.warn('MONGO_URL is missing, skipping public user sitemap entries.');
    return [];
  }

  let shouldDisconnect = false;
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUrl, {
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        bufferCommands: false,
      });
      shouldDisconnect = true;
    }

    const users = await mongoose.connection.db
      .collection('users')
      .find({}, { projection: { name: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    return users
      .map((user) => {
        const name = typeof user?.name === 'string' ? user.name.trim() : '';
        if (!name) return null;
        const slug = name.replace(/\s+/g, '-');
        const lastmod = user.updatedAt || user.createdAt;

        return {
          loc: `/user/${encodeURIComponent(slug)}`,
          lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
          changefreq: 'weekly',
          priority: 0.4,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.warn('Failed to fetch public users for sitemap.', error);
    return [];
  } finally {
    if (shouldDisconnect) {
      await mongoose.disconnect();
    }
  }
};


module.exports = {
  siteUrl: 'https://flagforge.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: false,
  exclude: SITEMAP_EXCLUDE,
  additionalPaths: async () => {
    const [blogEntries, userEntries] = await Promise.all([
      fetchBlogEntries(),
      fetchPublicUserEntries(),
    ]);

    return [...blogEntries, ...userEntries];
  },
  transform: async (config, path) => {
    // Custom priority for landing and global pages
    let priority = config.priority;
    if (path === '/') {
      priority = 1.0;
    } else if (['/about', '/contact', '/blogs', '/authentication'].includes(path)) {
      priority = 0.9;
    }

    const lastmod = routeLastmod.get(path);

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: lastmod ?? undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [],
      },
    ],
    transformRobotsTxt: async (config) => {
      const lines = [
        'User-agent: *',
        'Allow: /',
        'Allow: /llms.txt',
        'Disallow:',
        '',
        `Sitemap: ${config.siteUrl}/sitemap.xml`,
        `Sitemap: ${config.siteUrl}/sitemap1.xml`,
        `Sitemap: ${config.siteUrl}/sitemap.txt`,
        '',
      ];

      return lines.join('\n');
    },
  },
};
