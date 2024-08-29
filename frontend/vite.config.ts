import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
        target: process.env.VITE_BACKEND_URL || 'http://localhost:50000',  // Use environment variable or fallback to localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})