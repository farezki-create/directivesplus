
// Apply the rollup patch
import './src/utils/rollup-patch.js';

export default {
  // This is a minimal config just to ensure rollup doesn't try to use native modules
  input: 'src/main.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  // Force pure JavaScript implementation
  treeshake: {
    moduleSideEffects: true,
    propertyReadSideEffects: false,
  },
  // Additional options to avoid native modules
  onwarn(warning, warn) {
    // Skip warnings related to native modules
    if (warning.code === 'MISSING_EXPORT' && warning.message.includes('@rollup/rollup-')) {
      return;
    }
    warn(warning);
  },
  // Explicitly disable plugins that might use native code
  plugins: []
};
