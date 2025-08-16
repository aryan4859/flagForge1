/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Apply headers to all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://flagforge.aryan4.com.np",  
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          /*
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://lh3.googleusercontent.com;",
          },
          */
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
            value: "no-store, no-cache, must-revalidate, proxy-revalidate", 
          },
          {
            key: "Pragma",
            value: "no-cache", 
          },
          {
            key: "Server",
            value: "", 
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
