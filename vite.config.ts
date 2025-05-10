
// Import our monkey patch first before anything else gets loaded
try {
  require('./src/rollup-patch');
  console.log('[vite.config] Rollup native module patch loaded successfully');
} catch (error) {
  console.error('[vite.config] Failed to load Rollup patch:', error);
}

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["888b4fe0-9edf-469c-bb32-652a4b2227bb.lovableproject.com"],
  },
  plugins: [
    react(),
    mode === 'development' && 
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      context: 'globalThis',
    }
  },
  define: {
    '__ROLLUP_NO_NATIVE__': true,
    'process.env.ROLLUP_NATIVE_DISABLE': '"true"',
    'process.env.ROLLUP_DISABLE_NATIVE': '"true"',
    'process.env.ROLLUP_NATIVE_DISABLED': '"true"',
    'process.env.ROLLUP_FORCE_NODEJS': '"true"'
  }
}));
