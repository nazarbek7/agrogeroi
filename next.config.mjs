/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
        ],
      },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'agrogeroi.kg' }],
          destination: 'https://agrogeroi.com/:path*',
          permanent: true,
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.agrogeroi.kg' }],
          destination: 'https://agrogeroi.com/:path*',
          permanent: true,
        },
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.agrogeroi.com' }],
          destination: 'https://agrogeroi.com/:path*',
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
};

export default nextConfig;
