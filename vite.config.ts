
// Apply Rollup patch before anything else
process.env.ROLLUP_NATIVE_DISABLED = 'true';

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
  optimizeDeps: {
    force: true, // Force re-optimization to avoid native module issues
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
}));
