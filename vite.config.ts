import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow serving files from project root, client and shared directories
      allow: ["./", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Load the server via Vite's module loader so path aliases (eg. @shared)
      // and TS paths are resolved correctly. Avoids Node's ESM resolver trying
      // to resolve `@shared/*` when vite.config.ts is imported.
      try {
        const mod = await server.ssrLoadModule('/server/index.ts');
        const createServer = mod.createServer ?? mod.default ?? mod;
        if (typeof createServer !== 'function') {
          console.error('createServer is not a function:', typeof createServer);
          return;
        }
        const app = createServer();

        // Add Express app as middleware to Vite dev server
        server.middlewares.use(app);
        console.log('[Express Plugin] Server loaded and registered');
      } catch (error) {
        console.error('[Express Plugin] Error loading server:', error);
      }
    },
  };
}
