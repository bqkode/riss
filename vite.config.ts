import { defineConfig, type Plugin } from 'vite';

// In dev mode, rewrite /docs/ to /docs/index.html (static hosts do this automatically)
function docsRewrite(): Plugin {
  return {
    name: 'docs-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && /^\/docs\/?$/.test(req.url)) {
          req.url = '/docs/index.html';
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
