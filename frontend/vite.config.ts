import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  console.log(`Current mode: ${mode}`);  // This should output 'production' during build
  const env = loadEnv(mode, process.cwd());
  
  return {
    base: mode === 'production' ? '/TrailNet/' : '/', // Use the correct base path
    plugins: [react()],
    server: {
      proxy: {
        '/backend_api': {
          target: env.VITE_BACKEND_URL,
          // target: 'http://localhost:50000', // Your backend server
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend_api/, ''),
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
