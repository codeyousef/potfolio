/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Add other configurations here if needed in the future
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055', // Assuming your Directus is on port 8055
        pathname: '/assets/**', // Allow any path under /assets
      },
    ],
  },
};

module.exports = nextConfig;
