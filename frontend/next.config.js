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
    const connectSrc = [
      "'self'",
      "https://maps.googleapis.com",
      "https://api.ipify.org",
      "https://googleapis.l.google.com",
      "https://tile.googleapis.com",
      "https://api.stripe.com",
      "https://checkout.stripe.com",
      "https://m.stripe.network",
      "https://reports.fgbacumen.com",
    ];

    if (process.env.NODE_ENV === "development") {
      connectSrc.push("http://localhost:*");
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://images.pexels.com;
              script-src 'self' https://js.stripe.com https://m.stripe.network https://maps.googleapis.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src ${connectSrc.join(" ")};
              frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://maps.googleapis.com;
              worker-src 'self' blob:;
              child-src blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
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

module.exports = nextConfig;
