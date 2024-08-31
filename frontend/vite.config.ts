import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/backend_api': {
          // target: env.VITE_BACKEND_URL,
          target: 'http://localhost:50000', // Your backend server
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/backend_api/, ''), // Remove '/backend_api' prefix when forwarding
          logLevel: 'debug', // Enable debug logging for troubleshooting
        },
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
        
      },
    },
  };
});
