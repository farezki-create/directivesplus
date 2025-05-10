
// Import the Rollup config first to ensure it's applied before anything else
import './src/rollup-config';

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
      // Disable Rollup native modules completely
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    }
  },
  // Force JavaScript implementation of Rollup
  define: {
    '__ROLLUP_NO_NATIVE__': true
  }
}));
