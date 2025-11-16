/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable production source maps for better debugging
  productionBrowserSourceMaps: false,

  // Configure build output
  output: 'standalone',

  // Configure compression
  compress: true,

  // Configure caching and security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Only run in production client-side build
    if (!dev && !isServer) {
      // Enable tree shaking and dead code elimination
      config.optimization.usedExports = true;

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // Create a separate chunk for React
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 40,
            chunks: 'all',
          },
          // Create a separate chunk for large libraries
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 30,
            chunks: 'all',
          },
          // Create a separate chunk for common components
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };

      // Optimize module concatenation
      config.optimization.concatenateModules = true;

      // Optimize module ids
      config.optimization.moduleIds = 'deterministic';
    }

    return config;
  },

  // Optimize page loading
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', '@heroicons/react'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
