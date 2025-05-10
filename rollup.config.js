
// Force disable Rollup native modules
globalThis.__ROLLUP_NO_NATIVE__ = true;
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
}

export default {
  // This is just a dummy config to force Rollup to use JavaScript implementation
  // The actual build configuration is handled by Vite
};
