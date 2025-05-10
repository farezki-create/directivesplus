
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
  // Force l'utilisation de Rollup non-natif
  define: {
    '__ROLLUP_NO_NATIVE__': 'true'
  }
});
