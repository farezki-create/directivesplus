
// Apply the rollup patch before importing vite
import "./src/utils/rollup-patch.js";

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
      target: 'es2020',
    },
    force: true, // Force re-optimization
  },
  // Explicitly configure rollup to use pure JS implementation
  build: {
    target: 'es2020',
    minify: 'esbuild', // Change from terser to esbuild
    rollupOptions: {
      // Force rollup to use pure JavaScript implementation
      treeshake: {
        moduleSideEffects: true,
        propertyReadSideEffects: false,
      },
      // Skip native modules
      onwarn(warning, warn) {
        if (warning.code === 'MISSING_EXPORT' && warning.message.includes('@rollup/rollup-')) {
          return;
        }
        warn(warning);
      }
    },
  },
  // Override Vite's default rollup config
  customRollupOptions: {
    context: 'window',
    treeshake: {
      moduleSideEffects: true,
      propertyReadSideEffects: false,
    }
  }
}));
