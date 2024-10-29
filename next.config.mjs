/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static asset optimization
  output: 'standalone',
  
  // Configure base path and asset prefix
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://chnspart.com' : '',
  
  // Configure trailing slashes for consistency
  trailingSlash: false,

  // Image configuration
  images: {
    domains: ['i.ibb.co'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ],
  },

  // Ensure proper environment variable handling
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' ? 'https://chnspart.com' : 'http://localhost:3000'
  },

  // Configure headers for proper asset serving
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;