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
              default-src 'self' wss://*.fgbacumen.com https://api.ipify.org;
              img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://images.pexels.com https://maps.googleapis.com https://maps.gstatic.com https://khms0.googleapis.com https://khms1.googleapis.com https://api.maptiler.com https://api.os.uk https://khm.google.com https://khm0.google.com https://khm1.google.com https://khms0.google.com https://khms1.google.com https://khms2.google.com https://khms3.google.com https://geo0.ggpht.com https://geo1.ggpht.com https://geo2.ggpht.com https://geo3.ggpht.com https://lh3.ggpht.com https://lh4.ggpht.com https://lh5.ggpht.com https://lh6.ggpht.com https://streetviewpixels-pa.googleapis.com https://developers.google.com https://tile.googleapis.com https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://maps.google.com/mapfiles/ms/icons/blue-dot.png;
              script-src 'unsafe-eval' 'unsafe-inline' 'self' https://cdnjs.cloudflare.com https://unpkg.com https://maps.googleapis.com https://clients.l.google.com https://maps.l.google.com https://mt.l.google.com https://khm.l.google.com https://csi.gstatic.com https://js.stripe.com https://m.stripe.network;
              style-src 'unsafe-inline' 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://unpkg.com;
              font-src 'unsafe-inline' 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com https://unpkg.com;
              connect-src 'self' https://maps.googleapis.com https://api.ipify.org https://googleapis.l.google.com https://tile.googleapis.com https://api.stripe.com https://m.stripe.network;
              frame-src 'self' https://js.stripe.com https://maps.googleapis.com https://m.stripe.network;
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
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "sameorigin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "autoplay=(), camera=(), microphone=()",
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
