import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file from the root directory
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    root: 'frontend',  // Point Vite to the frontend folder
    server: {
      proxy: {
        '/weather_api': {
          target: 'http://www.bom.gov.au',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/weather_api/, ''),
        },
        '/osm': {
          target: 'https://www.openstreetmap.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/osm/, ''),
        },
        // Proxy for the backend server
        '/api': {
          target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',  // Use the loaded environment variable
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});