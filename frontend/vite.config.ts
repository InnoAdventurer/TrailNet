// frontend\vite.config.ts

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  console.log(`Current mode: ${mode}`);  // This should output 'production' during build
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      proxy: {
        '/backend_api': {
          target: env.VITE_BACKEND_URL,
          // target: 'http://localhost:50000', // Your backend server
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend_api/, ''),
          logLevel: 'debug', // Enable debug logging for troubleshooting
        },
        '/osm': {
          target: 'https://www.openstreetmap.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/osm/, ''),
        },
      },
      preview: {
        port: 5000,
      },
    },
  };
});
