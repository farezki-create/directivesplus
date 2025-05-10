
// This file is specifically designed to ensure Rollup uses its JavaScript implementation
// It should be imported at the very beginning of entry point files

// Set the global flag to disable native modules
globalThis.__ROLLUP_NO_NATIVE__ = true;

export const ensureJavaScriptRollup = () => {
  if (!globalThis.__ROLLUP_NO_NATIVE__) {
    console.warn('Warning: Rollup native modules were not properly disabled');
    globalThis.__ROLLUP_NO_NATIVE__ = true;
  }
  return true;
};

// Return confirmation that the setting was applied
export default ensureJavaScriptRollup();
