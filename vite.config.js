import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function frameCacheHeaders() {
  return {
    name: 'frame-cache-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/assets/frames/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/assets/frames/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), frameCacheHeaders()],
  server: { port: 5173, host: true },
});
