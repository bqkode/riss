import { defineConfig, type Plugin } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// In dev mode, serve /docs/** static HTML files directly, bypassing Vite's SPA fallback
function docsRewrite(): Plugin {
  return {
    name: 'docs-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/docs')) return next();
        // If URL has no extension, try appending /index.html
        let filePath = req.url;
        if (!/\.\w+$/.test(filePath)) {
          filePath = filePath.replace(/\/+$/, '') + '/index.html';
        }
        const absPath = resolve(__dirname, 'public', filePath.slice(1));
        if (existsSync(absPath)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(readFileSync(absPath, 'utf-8'));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [docsRewrite()],
  build: {
    outDir: 'dist',
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
});
