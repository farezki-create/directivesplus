
// Set this before all other imports to ensure Rollup uses JavaScript implementation
globalThis.__ROLLUP_NO_NATIVE__ = true;

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // Force JavaScript implementation of Rollup
  define: {
    '__ROLLUP_NO_NATIVE__': true
  }
});
