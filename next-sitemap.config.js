/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://flagforge.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
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

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
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
