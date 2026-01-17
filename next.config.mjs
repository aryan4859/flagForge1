/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["writeup.flagforge.xyz", "flagforge.xyz", "github.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://flagforge.xyz",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://accounts.google.com https://va.vercel-scripts.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "img-src 'self' https://lh3.googleusercontent.com https://prod-files-secure.s3.us-west-2.amazonaws.com data: https://pagead2.googlesyndication.com https://www.google.com; " +
              "font-src 'self' https://fonts.gstatic.com data:; " +
              "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://stats.g.doubleclick.net https://*.vercel-analytics.com; " +
              "frame-src 'self' https://googleads.g.doubleclick.net https://accounts.google.com; " +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'none';",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), payment=()",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Server",
            value: "",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
