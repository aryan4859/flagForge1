/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://flagforge.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  exclude: [
    '/roles/developers/admins/*',
    '/unauthorized',
    '/authentication',
  ],
  transform: async (config, path) => {
    // Custom priority for landing and global pages
    let priority = config.priority;
    if (path === '/') {
      priority = 1.0;
    } else if (['/about', '/contact', '/problems', '/leaderboard', '/blogs', '/resources'].includes(path)) {
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
    additionalSitemaps: [
      'https://flagforge.xyz/sitemap.xml',
    ],
  },
};
