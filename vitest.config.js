
// Import our monkey patch first before anything else gets loaded
try {
  require('./src/rollup-patch');
  console.log('[vitest.config] Rollup native module patch loaded successfully');
} catch (error) {
  console.error('[vitest.config] Failed to load Rollup patch:', error);
}

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
  define: {
    '__ROLLUP_NO_NATIVE__': true,
    'process.env.ROLLUP_NATIVE_DISABLE': '"true"',
    'process.env.ROLLUP_DISABLE_NATIVE': '"true"',
    'process.env.ROLLUP_NATIVE_DISABLED': '"true"',
    'process.env.ROLLUP_FORCE_NODEJS': '"true"'
  }
});
