
// Force disable Rollup native modules BEFORE anything else loads
globalThis.__ROLLUP_NO_NATIVE__ = true;
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
}

// Import the Rollup config to ensure it's applied
import './src/rollup-config';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Log verification
console.log('Vitest config - Rollup native modules disabled:', {
  rollupNoNative: globalThis.__ROLLUP_NO_NATIVE__,
  envDisable: typeof process !== 'undefined' ? process.env.ROLLUP_NATIVE_DISABLE : 'unavailable'
});

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
    '__ROLLUP_NO_NATIVE__': 'true',
    'process.env.ROLLUP_NATIVE_DISABLE': '"true"'
  }
});
