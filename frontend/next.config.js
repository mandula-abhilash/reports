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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://js.stripe.com https://m.stripe.network;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://images.pexels.com;
              font-src 'self' https://fonts.gstatic.com;
              frame-src 'self' https://js.stripe.com https://maps.googleapis.com https://m.stripe.network;
              connect-src 'self' https://maps.googleapis.com https://api.stripe.com https://m.stripe.network;
              worker-src 'self' blob:;
              child-src blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
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
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
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
