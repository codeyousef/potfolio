const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost', 'api.yourdomain.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yourdomain.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Webpack configuration for shader files and 3D content
  webpack: (config, { isServer }) => {
    // Add shader file loaders
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    // Add GLTF/GLB file loader
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      exclude: /node_modules/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/',
        },
      },
    });

    // Add HDR/EXR environment map loader
    config.module.rules.push({
      test: /\.(hdr|exr)$/,
      exclude: /node_modules/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/textures/',
          outputPath: 'static/textures/',
        },
      },
    });

    // Resolve aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@components': path.join(__dirname, 'components'),
      '@lib': path.join(__dirname, 'lib'),
      '@store': path.join(__dirname, 'store'),
      '@types': path.join(__dirname, 'types'),
      '@utils': path.join(__dirname, 'utils'),
      '@styles': path.join(__dirname, 'src/styles'),
      '@public': path.join(__dirname, 'public'),
    };

    // Fix for Three.js SSR issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        perf_hooks: false,
      };
    }

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/textures/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for old routes (if migrating from previous site)
  async redirects() {
    return [
      {
        source: '/portfolio',
        destination: '/work',
        permanent: true,
      },
      {
        source: '/journal',
        destination: '/blog',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Typescript
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    dirs: ['src', 'app'],
  },

  // Output configuration
  output: 'standalone',

  // Disable powered by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate build ID
  generateBuildId: async () => {
    return process.env.BUILD_ID || `build-${Date.now()}`;
  },

  // Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;