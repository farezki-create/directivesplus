
// Apply Rollup patch before anything else
process.env.ROLLUP_NATIVE_DISABLED = 'true';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true // Optionnel : permet d'utiliser expect, test sans import explicite
  }
});
