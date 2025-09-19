/** @type {import('next').NextConfig} */
const nextConfig = {
  // These flags were hiding potential TypeScript and ESLint errors that could cause production issues
  eslint: {
    // Only ignore during builds if you have a separate CI/CD linting step
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore build errors if you have a separate type checking step
    // ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
