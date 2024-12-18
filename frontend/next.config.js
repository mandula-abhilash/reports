/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://maps.googleapis.com https://js.stripe.com 'unsafe-inline' 'unsafe-eval';
              style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
              img-src 'self' https://*.googleapis.com https://*.gstatic.com https://images.pexels.com data: blob:;
              font-src 'self' https://fonts.gstatic.com;
              frame-src 'self' https://js.stripe.com https://maps.googleapis.com;
              connect-src 'self' https://maps.googleapis.com https://api.stripe.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Set-Cookie",
            value: "__cf_bm=*; Secure; SameSite=Strict; Partitioned;",
          },
          {
            key: "Set-Cookie",
            value: "_cfuvid=*; Secure; SameSite=Strict; Partitioned;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
