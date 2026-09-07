/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Experimental ────────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'swiper'],
  },

  // ─── Image Domains ───────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'https', hostname: '**.s3.amazonaws.com' },
      { protocol: 'https', hostname: '**.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ─── Security Headers ────────────────────────────────────────────────────────
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(self), microphone=(), geolocation=(self), interest-cohort=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ],

  // ─── Redirects ───────────────────────────────────────────────────────────────
  redirects: async () => [
    {
      source: '/eyeglasses',
      destination: '/shop/eyeglasses',
      permanent: true,
    },
    {
      source: '/sunglasses',
      destination: '/shop/sunglasses',
      permanent: true,
    },
  ],

  // ─── Compiler Options ────────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ─── TypeScript & ESLint ──────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── Environment Variables (exposed to client) ───────────────────────────────
  env: {
    NEXT_PUBLIC_APP_NAME: 'XYZ Eyewear',
  },

  // ─── Powered By Header ───────────────────────────────────────────────────────
  poweredByHeader: false,
};

export default nextConfig;
