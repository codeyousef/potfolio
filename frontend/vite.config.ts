import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:8055';
  
  return {
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: true,
      proxy: {
        '^/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          ws: true, // Enable WebSocket support
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.error('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying request:', req.method, req.url);
              // Ensure we don't override content-type for FormData
              if (req.headers['content-type']?.includes('multipart/form-data')) {
                proxyReq.setHeader('Content-Type', req.headers['content-type']);
              }
              // Ensure we include the host header
              proxyReq.setHeader('Host', new URL(apiUrl).host);
              // Add CORS headers
              proxyReq.setHeader('Origin', 'http://localhost:8080');
              proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              // Ensure CORS headers are set in the response
              const origin = req.headers.origin || 'http://localhost:8080';
              proxyRes.headers['Access-Control-Allow-Origin'] = origin;
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD';
              proxyRes.headers['Vary'] = 'Origin';
              
              // For preflight requests
              if (req.method === 'OPTIONS') {
                proxyRes.statusCode = 204;
              }
              
              console.log('Proxied response:', proxyRes.statusCode, req.url, {
                headers: proxyRes.headers
              });
            });
          }
        }
      },
      cors: {
        origin: 'http://localhost:8080',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        exposedHeaders: ['Content-Range', 'X-Total-Count']
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Add environment variables configuration for Directus
    envPrefix: ["VITE_", "DIRECTUS_", "NEXT_PUBLIC_"],
  }
});