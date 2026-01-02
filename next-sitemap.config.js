/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

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

module.exports = {
  siteUrl: 'https://flagforge.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: false,
  exclude: [
    '/roles/developers/*',
    '/roles/developers',
    '/resources/*',
    '/resources',
    '/profile',
    '/problems',
    '/leaderboard',
    '/home',
    '/unauthorized',
    '/authentication',
  ],
  transform: async (config, path) => {
    // Custom priority for landing and global pages
    let priority = config.priority;
    if (path === '/') {
      priority = 1.0;
    } else if (['/about', '/contact', '/blogs'].includes(path)) {
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
        allow: ['/', '/sitemap.xml', '/llms.txt'],
      },
    ],
    additionalSitemaps: [
      'https://flagforge.xyz/sitemap.xml',
      'https://flagforge.xyz/llms.txt',
    ],
  },
};
