
// Apply the rollup patch
import './src/utils/rollup-patch.js';

export default {
  // This is a minimal config just to ensure rollup doesn't try to use native modules
  input: 'src/main.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  }
};
