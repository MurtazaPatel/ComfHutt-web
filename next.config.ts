import type { NextConfig } from "next";

const disableRSC = process.env.DISABLE_RSC === "true";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.adanirealty.com",
      },
    ],
  },
  experimental: {
    // Security Hardening: React2Shell
    // If DISABLE_RSC is true, we can attempt to limit server actions here,
    // though strict disabling is better done via Middleware blocking.
    serverActions: {
      bodySizeLimit: '128kb', // Mitigate large payloads
      allowedOrigins: ['comfhutt.com', 'localhost:3000'], // CSRF protection
    }
  },
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
