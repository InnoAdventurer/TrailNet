import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
