/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for now
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
