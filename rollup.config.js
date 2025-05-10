
// Force disable Rollup native modules
globalThis.__ROLLUP_NO_NATIVE__ = true;
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
  process.env.ROLLUP_DISABLE_NATIVE = 'true';
  process.env.ROLLUP_NATIVE_DISABLED = 'true';
  process.env.ROLLUP_FORCE_NODEJS = 'true';
}

export default {
  // This is just a dummy config to force Rollup to use JavaScript implementation
  // The actual build configuration is handled by Vite
  input: 'src/main.tsx',
  output: {
    dir: 'dist',
    format: 'es'
  },
  onwarn(warning, warn) {
    // Suppress certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED' || 
        warning.code === 'CIRCULAR_DEPENDENCY' || 
        warning.message.includes('native')) {
      return;
    }
    warn(warning);
  }
};
