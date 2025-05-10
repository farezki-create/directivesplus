
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
    exclude: ['@rollup/rollup-linux-x64-gnu', 'rollup/dist/native'], // Explicitly exclude problematic native modules
  },
  build: {
    target: 'es2020',
    minify: 'esbuild', // Always use esbuild instead of terser
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
}));
