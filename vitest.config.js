
// Apply the rollup patch before importing vitest
import './src/utils/rollup-patch.js';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Optional: allows using expect, test without explicit import
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**']
  }
});
